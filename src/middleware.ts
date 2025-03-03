import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Middleware function to verify JWT token for protected routes
export async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 })
  }

  // Extract the JWT token from the Authorization header
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  // If no token is found, return a 401 Unauthorized response
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Missing authentication token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  try {
    // Verify the JWT token using the JWT_SECRET
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    // Add the user ID to the request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('X-User-ID', payload.userId as string)

    // Continue to the next middleware or route handler
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // If the token is invalid, return a 401 Unauthorized response
    return new NextResponse(
      JSON.stringify({ error: 'Invalid authentication token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}

// Configure the middleware to run on specific routes
export const config = {
  matcher: ['/api/chat/:path*', '/api/financial-advice/:path*', '/api/goals/:path*'],
}