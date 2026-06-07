/**
 * GSAP single-registration module. Import { gsap, ScrollTrigger, ... } from
 * here — never register plugins ad-hoc. All plugins are free since the Webflow
 * sponsorship. Plugin registration + custom eases run client-side only.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined' && !(gsap.core as { __eamRegistered?: boolean }).__eamRegistered) {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, CustomEase, useGSAP)

  // Signature easings — mirror the CSS custom-bezier tokens in globals.css
  CustomEase.create('eam-reveal', '0.16, 1, 0.30, 1')
  CustomEase.create('eam-silk', '0.45, 0.05, 0.55, 0.95')
  CustomEase.create('eam-snap', '0.25, 0.46, 0.45, 0.94')
  CustomEase.create('eam-gold', '0.76, 0, 0.24, 1')

  ;(gsap.core as { __eamRegistered?: boolean }).__eamRegistered = true
}

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP }
