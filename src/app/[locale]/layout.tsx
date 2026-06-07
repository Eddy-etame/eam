import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { fontVariables } from '@/lib/fonts'
import { locales, isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site.config'
import { ThemeScript } from '@/components/providers/ThemeScript'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Cursor } from '@/components/layout/Cursor'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const base = buildMetadata({
    locale,
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    path: '',
  })
  return {
    ...base,
    title: { default: dict.meta.home.title, template: `%s · ${siteConfig.name}` },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="grain">
        <a
          href="#content"
          className="sr-only rounded bg-gold px-4 py-2 text-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          {dict.common.skipToContent}
        </a>
        <ThemeProvider>
          <SmoothScroll />
          <Cursor />
          <Navbar locale={locale} dict={dict} />
          {children}
          <Footer locale={locale} dict={dict} />
          <ThemeSwitcher label={dict.common.theme} />
        </ThemeProvider>
      </body>
    </html>
  )
}
