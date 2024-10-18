// File: src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing authentication token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('X-User-ID', payload.userId as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid authentication token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: ['/api/chat/:path*', '/api/financial-advice/:path*', '/api/goals/:path*'],
}