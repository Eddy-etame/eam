/**
 * Duotone filter bank for the team stage. Each filter (1) collapses the
 * portrait to luminance, then (2) remaps the gray ramp onto a two-tone EAM
 * palette via feComponentTransfer tableValues ("shadowChannel highlightChannel",
 * both 0–1 = colour/255). Swapping modes swaps six numbers — no asset change.
 * `color-interpolation-filters="sRGB"` keeps the /255 maths honest.
 *
 * NB: the shadow endpoint is deliberately LIFTED above the page background
 * (#070D18) so dark-skinned / dark-clad figures separate from the navy void
 * instead of dissolving into it — the figures must read as ghosts in fog, not
 * vanish. The fog halo (globals.css .team-fog) does the rest.
 *
 * mono  cool slate → warm-white   (default, heraldic-faithful ghost)
 * gold  dark bronze → heraldic gold
 * iri   dark slate → grey          (body stays dark; the conic rim adds colour)
 * paper editorial ink → paper      (light inverse, for the editorial theme)
 */
const LUMA = '0.2126 0.7152 0.0722 0 0'
const desat = `${LUMA} ${LUMA} ${LUMA} 0 0 0 1 0`

export function TeamDuotoneDefs() {
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter id="eam-duo-mono" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={desat} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.243 0.961" />
            <feFuncG type="table" tableValues="0.290 0.941" />
            <feFuncB type="table" tableValues="0.388 0.910" />
          </feComponentTransfer>
        </filter>

        <filter id="eam-duo-gold" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={desat} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.180 0.788" />
            <feFuncG type="table" tableValues="0.150 0.663" />
            <feFuncB type="table" tableValues="0.100 0.431" />
          </feComponentTransfer>
        </filter>

        <filter id="eam-duo-iri" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={desat} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.070 0.340" />
            <feFuncG type="table" tableValues="0.070 0.340" />
            <feFuncB type="table" tableValues="0.090 0.380" />
          </feComponentTransfer>
        </filter>

        <filter id="eam-duo-paper" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values={desat} />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.086 0.984" />
            <feFuncG type="table" tableValues="0.067 0.973" />
            <feFuncB type="table" tableValues="0.039 0.945" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  )
}
