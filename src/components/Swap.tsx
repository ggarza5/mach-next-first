'use client';

import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { Loader } from './Loader';
import { TokenSelector } from './TokenSelector';
import { TokenInput } from './TokenInput';
import { useTokens } from '../hooks/useTokens';
import { type Token } from '@tristeroresearch/mach-sdk-types';
import { type Hex } from 'viem';

export function Swap() {
  const [amount, setAmount] = useState<string>('');
  const [showFromTokenList, setShowFromTokenList] = useState(false);
  const [showToTokenList, setShowToTokenList] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapStatus, setSwapStatus] = useState<{ success: boolean; message: string } | null>(null);

  const { fromToken, toToken, setFromToken, setToToken, loading, filteredNetworks, swapTokens } = useTokens();

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount) return;
    setIsSwapping(true);
    setSwapStatus(null);

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          srcAssetAddress: fromToken.address as Hex,
          dstAssetAddress: toToken.address as Hex,
          srcAmount: amount,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Swap successful:', result.data);
        setSwapStatus({ success: true, message: 'Swap submitted successfully!' });
        setAmount('');
      } else {
        console.error('Swap failed:', result);
        setSwapStatus({ success: false, message: result.error || 'Swap failed. Please try again.' });
      }
    } catch (error) {
      console.error('Error during swap request:', error);
      setSwapStatus({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setIsSwapping(false);
    }
  };

  if (loading) {
    return (
      <div className="w-[400px] bg-black/95 rounded-xl p-4 text-white flex items-center justify-center h-[480px]">
        <Loader text="Fetching tokens..." />
      </div>
    );
  }

  return (
    <div className="w-[400px] bg-black/95 rounded-xl p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Swap</h2>
      </div>

      <div className="relative">
        <TokenInput
          label="From"
          amount={amount}
          onAmountChange={setAmount}
          token={fromToken}
          onTokenSelect={() => setShowFromTokenList(true)}
          readOnly={false}
        />

        <TokenInput
          label="To"
          amount={amount}
          onAmountChange={() => {}}
          token={toToken}
          onTokenSelect={() => setShowToTokenList(true)}
          readOnly={true}
        />

        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 rounded-full p-1 border-4 border-black/95 hover:cursor-pointer hover:bg-gray-600"
          onClick={swapTokens}
          aria-label="Swap tokens"
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      {showFromTokenList && (
        <TokenSelector
          show={showFromTokenList}
          onClose={() => setShowFromTokenList(false)}
          onSelect={(token: Token) => {
            setFromToken(token);
            setShowFromTokenList(false);
          }}
          filteredNetworks={filteredNetworks}
          token={fromToken}
          disabledToken={toToken}
        />
      )}
      {showToTokenList && (
        <TokenSelector
          show={showToTokenList}
          onClose={() => setShowToTokenList(false)}
          onSelect={(token: Token) => {
            setToToken(token);
            setShowToTokenList(false);
          }}
          filteredNetworks={filteredNetworks}
          token={toToken}
          disabledToken={fromToken}
        />
      )}

      {swapStatus && (
        <div className={`mt-4 p-2 rounded text-center text-sm ${swapStatus.success ? 'bg-green-800' : 'bg-red-800'}`}>
          {swapStatus.message}
        </div>
      )}

      <button
        onClick={handleSwap}
        disabled={isSwapping || !fromToken || !toToken || !amount}
        className={`w-full mt-4 p-3 rounded font-semibold ${
          isSwapping || !fromToken || !toToken || !amount
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSwapping ? <Loader text="Swapping..." /> : 'Swap'}
      </button>
    </div>
  );
}
