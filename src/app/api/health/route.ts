import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    node: 'CABINET_CORE_V4.2.0'
  });
}
