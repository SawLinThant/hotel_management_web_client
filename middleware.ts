import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './src/lib/constants';

// Get the preferred locale from the Accept-Language header or default to 'en'
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        return locale;
      }
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname doesn't have a locale, redirect to default locale
  if (!pathnameHasLocale) {
    // Skip middleware for static files, API routes, and Next.js internals
    const isStaticFile = pathname.startsWith('/_next') || 
                         pathname.startsWith('/api') || 
                         pathname.includes('.') ||
                         pathname.startsWith('/favicon.ico');
    
    if (isStaticFile) {
      return NextResponse.next();
    }

    // Redirect to default locale
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
    // Preserve query parameters
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
  }

  // Validate locale if present in pathname
  const pathnameLocale = pathname.split('/')[1];
  if (pathnameLocale && !locales.includes(pathnameLocale as typeof locales[number])) {
    // Invalid locale, redirect to default locale
    const redirectUrl = new URL(pathname.replace(`/${pathnameLocale}`, `/${defaultLocale}`), request.url);
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl);
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
     * - files with extensions (e.g., .png, .jpg, .ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|.*\\..*).*)',
  ],
};

