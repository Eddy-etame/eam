import { NotFoundScreen } from '@/components/layout/NotFoundScreen'

/**
 * Global 404 (prerendered as /_not-found) — paths that never reach the
 * [locale] tree. Same server-rendered screen, so agents always get the
 * recovery map in raw HTML.
 */
export default function NotFound() {
  return <NotFoundScreen />
}
