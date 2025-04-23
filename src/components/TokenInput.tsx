import { ChevronDown } from 'lucide-react';
import { Token } from '@tristeroresearch/mach-sdk-types';
import { formatCurrency } from '../utils/formatting';
import Image from 'next/image';

interface TokenInputProps {
  label: string;
  amount: string;
  token: Token | null;
  readOnly?: boolean;
  showUsdValue?: boolean | string;
  onAmountChange?: (value: string) => void;
  onTokenSelect: () => void;
}

export function TokenInput({
  label,
  amount,
  token,
  readOnly = false,
  showUsdValue,
  onAmountChange,
  onTokenSelect,
}: TokenInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !onAmountChange) return;

    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^(0|0\.\d*|\.\d*|\d+\.?\d*)$/.test(value)) {
      const formattedValue = value.startsWith('.') ? `0${value}` : value;
      onAmountChange(formattedValue);
    }
  };

  const formatNetworkName = (name: string): string => {
    let formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    formattedName = formattedName.replace(/testnet/gi, ' Testnet');
    return formattedName;
  };

  return (
    <div>
      <div className="bg-black/40 rounded-lg p-4 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">{label}</span>
          {token && (
            <button
              onClick={onTokenSelect}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Image
                src={`/network/${token.network.toLowerCase()}.png`}
                alt={`${token.network} logo`}
                width={16}
                height={16}
                className="rounded-full"
              />
              <span>{formatNetworkName(token.network)}</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <input
              type="text"
              value={
                readOnly
                  ? amount
                  : amount === ''
                  ? ''
                  : amount.startsWith('.') || amount.startsWith('0')
                  ? amount
                  : Number(amount).toLocaleString('en-US', {
                      maximumFractionDigits: 20,
                      useGrouping: true,
                    })
              }
              onChange={handleAmountChange}
              placeholder="0"
              readOnly={readOnly}
              className="bg-transparent text-3xl outline-none w-full"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
            onClick={onTokenSelect}
          >
            {token && (
              <>
                <Image src={token.logoURI} alt={token.symbol} width={24} height={24} className="rounded-full" />
                <span>{token.symbol}</span>
              </>
            )}
            <ChevronDown size={20} />
          </button>
        </div>
        {showUsdValue && (
          <div className="text-sm text-gray-400">
            {typeof showUsdValue === 'string'
              ? formatCurrency(showUsdValue)
              : token?.current_price && formatCurrency(token.current_price * Number(amount))}
          </div>
        )}
      </div>
    </div>
  );
}
