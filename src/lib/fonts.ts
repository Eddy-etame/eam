import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

/**
 * DISPLAY — Fraunces. A high-contrast "old-style" variable serif with optical
 * sizing; editorial and heraldic rather than the over-used agency grotesks.
 */
export const fontDisplay = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  preload: true,
})

/** BODY — Plus Jakarta Sans. Clean, professional, neutral foil to the serif. */
export const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  preload: true,
})

/** MONO — JetBrains Mono. Tags, labels, indices, "engraved" data. */
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: false,
})

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`
