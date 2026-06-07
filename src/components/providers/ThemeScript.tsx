import { THEME_IDS, defaultThemeId, THEME_STORAGE_KEY } from '@/lib/themes'

/**
 * Inline, render-blocking script that sets [data-theme] on <html> before paint
 * to prevent a flash of the wrong palette. Reads the persisted choice or falls
 * back to the default. Must be placed in <head>.
 */
export function ThemeScript() {
  const code = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var v=${JSON.stringify(
    THEME_IDS,
  )};var t=localStorage.getItem(k);if(!t||v.indexOf(t)<0){t=${JSON.stringify(
    defaultThemeId,
  )};}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(
    defaultThemeId,
  )});}})();`
  return <script dangerouslySetInnerHTML={{ __html: code }} suppressHydrationWarning />
}
