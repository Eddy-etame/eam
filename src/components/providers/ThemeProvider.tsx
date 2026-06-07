'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { defaultThemeId, isThemeId, THEME_STORAGE_KEY, type ThemeId } from '@/lib/themes'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultThemeId,
  setTheme: () => {},
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(defaultThemeId)

  // Sync React state with the attribute ThemeScript already set (no flash).
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    if (isThemeId(current)) setThemeState(current)
  }, [])

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    // Persist via cookie so the server renders the correct palette on next load.
    document.cookie = `${THEME_STORAGE_KEY}=${next};path=/;max-age=31536000;samesite=lax`
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
