import { useState, useEffect, useCallback } from 'react';
import { Token, Asset } from '@tristeroresearch/mach-sdk-types';
import { NetworkGroup } from '../types/swap';
import { useMach } from '@/components/MachProvider'; // Use context for assets

const ALLOWED_NETWORKS = new Set(['sepolia', 'monadtestnet']);

export function useTokens() {
  const { assets, loadingAssets } = useMach(); // Get assets and loading state from context
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  // --- Process assets from context when available ---
  useEffect(() => {
    // Wait until assets are loaded
    if (loadingAssets || !assets) return;

    try {
      const rawTransformedTokens: Token[] = [];

      // Iterate through the network keys (e.g., ETHEREUM_ASSETS) in the assets object
      for (const networkKey in assets) {
        // Extract the canonical network name (lowercase, no suffix)
        const networkName = networkKey.replace(/_ASSETS$/i, '').toLowerCase();

        // Only process allowed networks using the extracted name
        if (!ALLOWED_NETWORKS.has(networkName)) continue;

        // Access the object associated with the key (e.g., assets['ETHEREUM_ASSETS'])
        const networkDataObject = assets[networkKey];

        // The assets object IS networkDataObject itself, not nested further
        const networkAssets = networkDataObject;

        if (!networkAssets || typeof networkAssets !== 'object') {
          continue;
        }

        // Iterate through the symbols within the 'networkAssets' object
        for (const symbol in networkAssets) {
          if (symbol === 'assets' || symbol.toLowerCase().includes('weth')) continue; // Skip 'assets' property and WETH

          const token = networkAssets[symbol] as Asset;
          if (!token || !token.logoURI) continue; // Skip if no token or no logo

          // Safely extract token properties (matching LocalAsset definition)
          const tokenSymbol = token.symbol || symbol || '';
          const tokenName = token.name || tokenSymbol || 'Unknown Token';
          const tokenAddress = token.address || '';
          const tokenDecimals = token.decimals || 18;

          rawTransformedTokens.push({
            symbol: tokenSymbol.toUpperCase(),
            name: tokenName,
            logoURI: token.logoURI,
            network: networkName,
            address: tokenAddress,
            decimals: tokenDecimals,
            current_price: 0,
          });
        }
      }

      // De-duplicate tokens based on network and address
      const uniqueTokensMap = new Map<string, Token>();
      rawTransformedTokens.forEach((token) => {
        if (token.address && token.address !== '') {
          const uniqueKey = `${token.network}-${token.address.toLowerCase()}`;
          if (!uniqueTokensMap.has(uniqueKey)) {
            uniqueTokensMap.set(uniqueKey, token);
          }
        }
      });
      const transformedTokens = Array.from(uniqueTokensMap.values());

      setTokensList(transformedTokens);

      // --- Set initial defaults based on the directly processed tokens ---
      if (transformedTokens.length > 0) {
        setFromToken((prevFromToken: Token | null) => {
          if (prevFromToken === null) {
            return (
              transformedTokens.find((t) => t.symbol === 'USDC' && t.network === 'arbitrum') || transformedTokens[0]
            );
          }
          return prevFromToken;
        });
        setToToken((prevToToken: Token | null) => {
          if (prevToToken === null) {
            return (
              transformedTokens.find((t) => t.symbol === 'ETH' && t.network === 'ethereum') ||
              (transformedTokens.length > 1 ? transformedTokens[1] : transformedTokens[0])
            );
          }
          return prevToToken;
        });
      }
    } catch (error) {
      console.error('[useTokens] Error processing assets from context:', error);
    }
    // Rerun whenever assets or loadingAssets changes
  }, [assets, loadingAssets]);

  // Group tokens by network
  const getNetworkGroups = useCallback(() => {
    if (!tokensList.length) {
      return [];
    }

    const networkGroups = tokensList.reduce((acc: Record<string, NetworkGroup>, token) => {
      const networkName = token.network;
      if (!acc[networkName]) {
        acc[networkName] = {
          name: networkName,
          logo: token.logoURI,
          tokens: [],
        };
      }
      if (token.address && token.address !== '') {
        acc[networkName].tokens.push(token);
      }
      return acc;
    }, {} as Record<string, NetworkGroup>);

    const result = Object.values(networkGroups)
      .filter((group) => group.tokens.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [tokensList]);

  // Filter networks based on URL config
  const filteredNetworks = useCallback(() => {
    const networks = getNetworkGroups();
    return networks;
  }, [getNetworkGroups]);

  // Search tokens
  const searchTokens = useCallback(
    (query: string) => {
      const searchTerm = query.toLowerCase();
      return tokensList.filter(
        (token) =>
          (token.symbol?.toLowerCase().includes(searchTerm) ||
            token.name?.toLowerCase().includes(searchTerm) ||
            token.address?.toLowerCase().includes(searchTerm)) &&
          token.address &&
          token.address !== ''
      );
    },
    [tokensList]
  );

  // Swap tokens
  const swapTokens = useCallback(() => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  }, [fromToken, toToken]);

  return {
    tokens: tokensList,
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    loading: loadingAssets, // Return loading state from context
    getNetworkGroups,
    filteredNetworks,
    searchTokens,
    swapTokens,
  };
}
