import { tokens } from '@tristeroresearch/mach-sdk';

export const getToken = (symbol: string, chain: string) => {
  return tokens[chain as keyof typeof tokens]?.[symbol] || null;
};
