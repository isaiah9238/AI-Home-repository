import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    node: 'CABINET_CORE_V4.2.0'
  });
}
