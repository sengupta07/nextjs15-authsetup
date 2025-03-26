import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/welcome', '/profile'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;

  // Redirect logic for authenticated routes
  if (authRoutes.includes(path)) {
    if (token) {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
  }

  // Protect authenticated routes
  if (protectedRoutes.includes(path)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/welcome', '/profile', '/register']
};