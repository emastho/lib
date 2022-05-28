// eslint-disable-next-line import/extensions
import { defaultLocale, locales } from '$lib/translations';

const routeRegex = new RegExp(/^\/[^.]*([?#].*)?$/);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
  const { url, request } = event;
  const { pathname, origin } = url;

  // If this request is a route request
  if (routeRegex.test(pathname)) {
    // Get defined locales
    const supportedLocales = locales.get();

    // Try to get locale from `pathname`.
    let locale = supportedLocales.find((l) => `${l}`.toLowerCase() === `${pathname.match(/[^/]+?(?=\/|$)/)}`.toLowerCase());

    // If route locale is not supported
    if (!locale) {
      // Set default locale if user preferred locale does not match
      locale = defaultLocale;

      // Replace the trailing slash as `svelte.config` is set to `trailingSlash: 'never'`
      const redirectTo = `${origin}/${locale}${pathname}`.replace(/\/$/, '');

      // Serve the redirected route.
      // In this case we don't have to set the html 'lang' attribute
      // as the default locale is already included in our app.html.
      return fetch(redirectTo, request);
    }


    // Add html `lang` attribute
    return resolve(event, {
      transformPage: ({ html }) => html.replace(/<html.*>/, `<html lang="${locale}">`),
    });
  }

  return resolve(event);
};