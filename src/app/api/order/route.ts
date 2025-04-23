import { NextRequest, NextResponse } from 'next/server';
import { order, config, dollarToTokenValue } from '@tristeroresearch/mach-sdk';
import { type Hex } from 'viem';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { srcAssetAddress, dstAssetAddress, srcAmount } = body;

    if (!srcAssetAddress || !dstAssetAddress || !srcAmount)
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });

    const sdkConfig = await config;
    await sdkConfig.setTestnetMode(true);
    sdkConfig.setGasFeeMultiplier(BigInt(2));
    sdkConfig.setGasLimitMultiplier(BigInt(2));
    const amt = await dollarToTokenValue(Number(srcAmount), srcAssetAddress);
    const orderResponse = await order(srcAssetAddress as Hex, dstAssetAddress as Hex, amt);

    return NextResponse.json({ success: true, data: orderResponse });
  } catch (error: unknown) {
    console.error('Order API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
