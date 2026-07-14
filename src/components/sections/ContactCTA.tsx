import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { Magnetic } from '@/components/ui/Magnetic'
import { localizedPath } from '@/lib/seo'
import { siteConfig } from '@/lib/site.config'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'

export function ContactCTA({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { contact, nav } = dict
  return (
    <section className="relative overflow-hidden border-t border-line px-6 py-28 md:px-12 md:py-40 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 120%, rgb(201 169 110 / 0.10), transparent 60%)',
        }}
      />
      <Reveal className="mx-auto max-w-4xl text-center">
        {/* Crest medallion — the maison's mark, magnetic under the cursor */}
        <div className="mb-9 flex justify-center">
          <Magnetic strength={0.2}>
            <span
              aria-hidden
              className="shadow-gold grid h-20 w-20 place-items-center rounded-full border border-gold/40"
            >
              <span
                className="block h-10 w-10 bg-gold/85"
                style={{
                  WebkitMaskImage: 'url(/logo-eam.png)',
                  maskImage: 'url(/logo-eam.png)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </span>
          </Magnetic>
        </div>
        <p className="text-mono-label text-gold/85">{contact.eyebrow}</p>
        <h2 className="mt-6 text-4xl">{contact.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{contact.lead}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Magnetic>
            <Link
              href={localizedPath(locale, 'contact')}
              className="shadow-gold rounded-full bg-gold px-8 py-4 text-mono-label text-deep transition-colors hover:bg-gold-bright"
            >
              {nav.startProject}
            </Link>
          </Magnetic>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-mono-label text-muted transition-colors hover:text-ink"
          >
            {siteConfig.email}
          </a>
        </div>
      </Reveal>
    </section>
  )
}
