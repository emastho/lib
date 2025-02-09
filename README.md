[![npm version](https://badge.fury.io/js/sveltekit-i18n.svg)](https://badge.fury.io/js/sveltekit-i18n) ![](https://github.com/sveltekit-i18n/lib/workflows/Tests/badge.svg)

# sveltekit-i18n
`sveltekit-i18n` is a tiny library with no external dependencies, built for [Svelte](https://github.com/sveltejs/svelte) and [SvelteKit](https://github.com/sveltejs/kit). It glues [@sveltekit-i18n/base](https://github.com/sveltekit-i18n/base) and [@sveltekit-i18n/parser-default](https://github.com/sveltekit-i18n/parsers/tree/master/parser-default) together to provide you the most straightforward `sveltekit-i18n` solution.

__Note this README is related to `sveltekit-i18n@2.x`. If you are looking for version `1.x` you can find it [here](https://github.com/sveltekit-i18n/lib/tree/1.x).__

## Key features

✅ SvelteKit ready\
✅ SSR support\
✅ Custom data sources – no matter if you are using local files or remote API to get your translations\
✅ Module-based – your translations are loaded for visited pages only (and only once!)\
✅ Component-scoped translations – you can create multiple instances with custom definitions\
✅ Custom modifiers – you can modify the input data the way you really need\
✅ TS support\
✅ No external dependencies

## Usage

Setup `translations.js` in your lib folder...
```javascript
import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
  loaders: [
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./en/common.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'home',
      routes: ['/'], // you can use regexes as well!
      loader: async () => (
        await import('./en/home.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'about',
      routes: ['/about'],
      loader: async () => (
        await import('./en/about.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'common',
      loader: async () => (
        await import('./cs/common.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'home',
      routes: ['/'],
      loader: async () => (
        await import('./cs/home.json')
      ).default,
    },
    {
      locale: 'cs',
      key: 'about',
      routes: ['/about'],
      loader: async () => (
        await import('./cs/about.json')
      ).default,
    },
  ],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
```

...load your translations in `__layout.svelte`...

```svelte
<script context="module">
  import { locale, loadTranslations } from '$lib/translations';

  export const load = async ({ url }) => {
    const { pathname } = url;

    const defaultLocale = 'en'; // get from cookie, user session, ...
    
    const initLocale = locale.get() || defaultLocale; // set default if no locale already set

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    return {};
  }
</script>
```

<details><summary>+layout.ts example</summary>

  In modern SvelteKit `+layout.ts` is used instead of `__layout.svelte`.

  ```ts
  import { loadTranslations, locale } from '$lib/translations/translations';
  import type { LayoutLoad } from './$types';

  export const load: LayoutLoad = async ({ url }) => {
    const { pathname } = url;
    const defaultLocale = 'en'; // get from cookie, user session, ...
    const initLocale = locale.get() || defaultLocale; // set default if no locale already set
    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    return {};
  }
```
</details>

...and include your translations within pages and components.

```svelte
<script>
  import { t } from '$lib/translations';

  const pageName = 'This page is Home page!';
</script>

<div>
  <!-- you can use `placeholders` and `modifiers` in your definitions (see docs) -->
  <h2>{$t('common.page', { pageName })}</h2>
  <p>{$t('home.content')}</p>
</div>
```

## More info
[Docs](https://github.com/sveltekit-i18n/lib/tree/master/docs/README.md)\
[Examples](https://github.com/sveltekit-i18n/lib/tree/master/examples)\
[Changelog](https://github.com/sveltekit-i18n/lib/releases)
