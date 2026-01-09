import createMiddleware from 'next-intl/middleware';
import {routing} from './routing'; // You may need to move your routing config here

export default createMiddleware({
  locales: ['en', 'bn'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(bn|en)/:path*']
};