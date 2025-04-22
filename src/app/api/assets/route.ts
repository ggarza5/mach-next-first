import { NextResponse } from 'next/server';
import { assets } from '@tristeroresearch/mach-sdk';
import { handleApiError } from '@/app/api/utils/handleApiError';

export async function GET() {
  try {
    return NextResponse.json({ success: true, data: assets }, { status: 200 });
  } catch (err) {
    console.error('Error returning assets:', err);
    return handleApiError(err);
  }
}
