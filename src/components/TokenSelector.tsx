import { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { Token } from '@tristeroresearch/mach-sdk-types';
import Image from 'next/image';

interface TokenSelectorProps {
  token: Token | null;
  show: boolean;
  onSelect: (token: Token) => void;
  onClose: () => void;
  filteredNetworks: () => { name: string; logo?: string; tokens: Token[] }[];
  disabledToken?: Token | null;
}

export function TokenSelector({ token, show, onSelect, onClose, filteredNetworks, disabledToken }: TokenSelectorProps) {
  const networks = filteredNetworks();
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (networks.length > 0 && selectedNetwork === null) {
      setSelectedNetwork(networks[0].name);
    }
  }, [networks, selectedNetwork]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  const currentNetwork = networks.find((n) => n.name === selectedNetwork);

  const handleChangeNetwork = (networkName: string) => {
    setSelectedNetwork(networkName);
  };

  const handleSelectToken = (token: Token) => {
    onSelect(token);
    onClose();
  };

  const formatNetworkName = (name: string): string => {
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    formattedName = formattedName.replace(/testnet/gi, ' Testnet');
    return formattedName;
  };

  return (
    <div className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-black/95 rounded-lg overflow-hidden border border-gray-800 w-full max-w-md">
        <div className="p-2 flex items-center justify-end gap-2 border-b border-gray-800">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[320px]">
          <div className="w-1/3 border-r border-gray-800 overflow-y-auto bg-black">
            {networks.map((network) => {
              const logoPath = `/network/${network.name.toLowerCase()}.png`;
              return (
                <button
                  key={network.name}
                  className={`flex items-center gap-2 w-full p-2 hover:bg-white/10 cursor-pointer ${
                    selectedNetwork === network.name ? 'bg-white/10' : ''
                  }`}
                  onClick={() => handleChangeNetwork(network.name)}
                >
                  <Image
                    src={logoPath}
                    alt={`${network.name} logo`}
                    width={20}
                    height={20}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-sm">{formatNetworkName(network.name)}</span>
                </button>
              );
            })}
          </div>

          {/* Token selector */}
          <div className="w-2/3 overflow-y-auto bg-black">
            {currentNetwork && currentNetwork.tokens && currentNetwork.tokens.length > 0 ? (
              currentNetwork.tokens.map((t) => {
                const isDisabled = disabledToken?.address === t.address && disabledToken?.network === t.network;
                return (
                  <button
                    key={`${t.network}-${t.symbol}`}
                    className={`flex items-center gap-2 w-full p-2 ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                    }`}
                    onClick={() => !isDisabled && handleSelectToken(t)}
                    disabled={isDisabled}
                  >
                    <Image src={t.logoURI} alt={t.symbol} width={24} height={24} className="rounded-full" />
                    <div className="flex flex-col items-start">
                      <span>{t.symbol}</span>
                      <span className="text-sm text-gray-400">{t.name}</span>
                    </div>
                    {token?.symbol === t.symbol && token?.network === t.network && (
                      <Check size={16} className="ml-auto text-green-500" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">Select a network.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
