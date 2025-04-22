'use server';

import { tokens, Asset } from '@tristeroresearch/mach-sdk';

// Define the structure of the raw tokens export from the SDK
interface SdkTokens {
  [network: string]: {
    assets?: { [symbol: string]: Asset };
    contracts?: Record<string, string>;
    chain_id?: number;
    abbreviation?: string;
    [key: string]: unknown;
  };
}

/**
 * Gets a token by symbol and chain
 */
export const getToken = async (symbol: string, chain: string): Promise<Asset | null> => {
  const networkData = (tokens as SdkTokens)[chain];
  return networkData?.assets?.[symbol] || null;
};
