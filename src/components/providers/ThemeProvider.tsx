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
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* storage unavailable — ignore */
    }
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}
