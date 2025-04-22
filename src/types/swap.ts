export interface TokenData {
  symbol: string;
  name: string;
  image: string;
  decimals: number;
  current_price?: number;
}

export interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  network: string;
  address: string;
  decimals: number;
  current_price?: number;
}

// Or wherever you define your network type
export interface NetworkGroup {
  name: string;
  logo?: string; // Make logo optional
  tokens: Token[];
}
