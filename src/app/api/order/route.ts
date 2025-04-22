import { NextRequest, NextResponse } from 'next/server';
import { order } from '@tristeroresearch/mach-sdk';
import { type Hex } from 'viem';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { srcAssetAddress, dstAssetAddress, srcAmount } = body;

    if (!srcAssetAddress || !dstAssetAddress || !srcAmount)
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });

    // Note: The `order` function will attempt to load PRIVATE_KEY from env vars.
    // Ensure it is set securely in your server environment.
    const orderResponse = await order(
      srcAssetAddress as Hex,
      dstAssetAddress as Hex,
      srcAmount.toString() // Ensure amount is a string or bigint
      // gasData and privateKey are omitted; SDK handles PK from env
    );

    return NextResponse.json({ success: true, data: orderResponse });
  } catch (error: unknown) {
    console.error('Order API Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to process order';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
