import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/items': '/items',
    '/items/[slug]': '/items/[slug]',
    '/about': '/about',
    '/terms': '/terms',
    '/cart': '/cart',
  },
});

// Language-aware navigation helpers
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
