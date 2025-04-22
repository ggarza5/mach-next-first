import type { OrderItemResponse } from '@tristeroresearch/mach-sdk';

// Request types
export interface SwapRequest {
  from: string;
  to: string;
  amount: string;
  chainFrom: string;
  chainTo: string;
}

export interface SwapResponse {
  message: string;
  tx: OrderItemResponse;
}

export interface TokenResponse {
  message: string;
  allTokens?: TokenData[];
}

// Token types
export interface TokenData {
  chain: string;
  token: {
    symbol: string;
    address: string;
    decimals: number;
    logoURI?: string;
  };
}

// Error handling types
export interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
}

export interface Chain {
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
}

export interface ChainResponse {
  message: string;
  allChains: unknown;
}
