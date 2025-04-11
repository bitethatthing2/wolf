import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is no longer used as we've migrated from Elfsight to direct implementations
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Elfsight proxy has been deprecated. We now use direct Instagram and Google integrations.' },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'Elfsight proxy has been deprecated. We now use direct Instagram and Google integrations.' },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}