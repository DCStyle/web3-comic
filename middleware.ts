import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle genre redirects from /comics?genre=X to /genres/x
  if (pathname === '/comics' && searchParams.has('genre')) {
    const genre = searchParams.get('genre');
    
    if (genre) {
      // Convert genre to lowercase and replace spaces with hyphens for URL-friendly format
      const urlFriendlyGenre = genre.toLowerCase().replace(/\s+/g, '-');
      
      // Create new URL for genre page
      const genreUrl = new URL(`/genres/${urlFriendlyGenre}`, request.url);
      
      // Preserve other query parameters (page, status, search)
      const newSearchParams = new URLSearchParams();
      
      for (const [key, value] of searchParams.entries()) {
        if (key !== 'genre') {
          newSearchParams.set(key, value);
        }
      }
      
      // Add preserved params to the new URL
      if (newSearchParams.toString()) {
        genreUrl.search = newSearchParams.toString();
      }
      
      return NextResponse.redirect(genreUrl, 301); // Permanent redirect
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};