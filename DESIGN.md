---
name: Aero Minimal
colors:
  surface: '#f4faff'
  surface-dim: '#d2dbe1'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5fb'
  surface-container: '#e6eff5'
  surface-container-high: '#e0e9ef'
  surface-container-highest: '#dbe4ea'
  on-surface: '#141d21'
  on-surface-variant: '#45464d'
  inverse-surface: '#293236'
  inverse-on-surface: '#e9f2f8'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006686'
  on-secondary: '#ffffff'
  secondary-container: '#7ed4fd'
  on-secondary-container: '#005b78'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2c'
  on-tertiary-container: '#008ebf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#c0e8ff'
  secondary-fixed-dim: '#7bd1fa'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d66'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#f4faff'
  on-background: '#141d21'
  surface-variant: '#dbe4ea'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 5rem
    fontWeight: '800'
    lineHeight: 5.25rem
    letterSpacing: 0.15em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 2.75rem
    fontWeight: '800'
    lineHeight: 3rem
    letterSpacing: 0.1em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: 0.12em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: 0.08em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: 0.02em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: '700'
    lineHeight: 1rem
    letterSpacing: 0.22em
  label-metric:
    fontFamily: Space Grotesk
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system channels high-end industrial minimalism with an airy, forward-looking ethos inspired by modern electric mobility. It pairs pristine, breathable open space with high-precision engineering elements: geometric typography, generous tracking, soft powder-blue ambient gradients, and crisp architectural outlines.

The emotional signature is effortless calm, futuristic sophistication, and technological purity. The aesthetic merges **Minimalism** with subtle **Frosted Glassmorphism**—relying on atmospheric lighting, translucent pill-shaped surfaces, and stark charcoal contrasts to anchor visual focus without visual noise.

## Colors

The palette is rooted in atmospheric pastel sky tones balanced against deep carbon blacks and crisp frosted whites.

- **Primary (`#0F172A`)**: Deep obsidian charcoal for maximum legibility, high-impact titles, key interactive strokes, and technical specifications.
- **Secondary (`#7DD3FC`)**: Soft powder sky blue used for subtle gradient glows, ambient spherical accents, and delicate interactive focus rings.
- **Tertiary (`#38BDF8`)**: Vibrant electric azure for precision data metrics, progress indicators, and active status states.
- **Neutral (`#F0F9FF`)**: Luminous ice white/pale powder surface creating an airy, weightless canvas.

### Atmospheric Gradients & Tints
- Canvas background leverages a multi-stop mesh gradient transitioning smoothly between `#E0F2FE` (light sky), `#BAE6FD` (powder cyan), and `#F8FAFC` (pure light mist).
- Translucent overlays use `rgba(255, 255, 255, 0.45)` with soft cyan border strokes `rgba(15, 23, 42, 0.15)`.

## Typography

Typography establishes an industrial, aerodynamic identity:
- **Headlines & Display (`Space Grotesk`)**: Rendered in all-caps with generous letter spacing (`0.1em` to `0.22em`). This evokes precision engineering, aerospace schematics, and high-performance craft.
- **Body & Supporting Copy (`Plus Jakarta Sans`)**: Clean, neutral, and readable with subtle openness, ensuring effortless scanning across long descriptions and product breakdowns.
- **Vertical Accent Typography**: Side labels and index marks run vertically along viewport borders with exaggerated tracking (`0.35em`) in uppercase.

## Layout & Spacing

This design system uses a 12-column fluid grid system on desktop that gracefully collapses to 8 columns on tablet and 4 columns on mobile. 

Generous whitespace and off-center focal elements (such as vehicle cutouts and hero typography) drive the airy atmosphere.
- **Outer Canvas Margins**: Substantial 3.5rem (`56px`) margins preserve the perimeter frame and house navigational coordinates and vertical accent labels.
- **Floating Containers**: Product metric bars, spec cards, and navigation pills float independently above the canvas with consistent inner padding.
- **Grid Gutters**: Clean 1.5rem gap allows content blocks to breathe without dense grouping.

## Elevation & Depth

Visual hierarchy rejects heavy drop shadows in favor of ambient lighting, backdrop blur, and crisp hairline boundaries:

- **Spherical Ambient Underlays**: Soft, out-of-focus atmospheric spheres (`filter: blur(80px)`) positioned behind primary focal points provide natural dimensional radiance.
- **Frosted Glass Glassmorphism**: Floating panels leverage `backdrop-filter: blur(16px)` combined with semi-opaque white fill (`rgba(255, 255, 255, 0.4)`) and subtle sky-blue backdrops.
- **Low-Contrast Structural Outlines**: Floating pods and controls use delicate `1px` or `1.5px` outlines tinted with slate charcoal (`rgba(15, 23, 42, 0.25)` to `rgba(15, 23, 42, 0.45)`) to maintain physical clarity against bright backdrops.
- **Soft Ambient Grounding**: Product renders utilize feather-soft contact shadows tinted with slate-cyan (`rgba(15, 23, 42, 0.12)`, `blur: 32px`) directly underneath wheelbases or grounding planes.

## Shapes

The design system favors elongated, aerodynamic silhouettes:
- **Pill Geometry**: Primary action buttons, status chips, and navigation links use full pill forms (`border-radius: 9999px`) or generous continuous curves (`12px` to `16px`).
- **Metric Pods & Cards**: Floating summary cards employ `rounded-lg` (16px) with ultra-thin architectural borders.
- **Circular Graphic Motifs**: Minimalist target markers, coordinate crosses (`+`), and soft spherical backdrop masks contrast cleanly with strict rectilinear layout lines.

## Components

### Buttons
- **Outlined Pill (Primary Action)**: Transparent or soft frosted background (`rgba(255, 255, 255, 0.35)`), bordered with a precise `1.5px` solid charcoal line (`#0F172A`). Text is uppercase `Space Grotesk` with `0.2em` letter spacing. On hover: solid fill (`#0F172A`) with light contrast text (`#F0F9FF`) and smooth 200ms transition.
- **Ghost Navigation Pill**: Subtle hairline border (`rgba(15, 23, 42, 0.2)`), translucent white backdrop, low-profile horizontal padding (`1.25rem`).

### Floating Metric & Spec Pods
- **Horizontal Spec Bar**: Translucent frosted capsule (`backdrop-filter: blur(12px)`, background `rgba(255, 255, 255, 0.3)`) encapsulated by a crisp `1px` slate-grey border. Contains vertical divider lines (`rgba(15, 23, 42, 0.1)`) separating key numerical figures (e.g., speed, range, charging time) from their lowercase unit labels.

### Navigation Header
- **Minimalist Top Bar**: Centered bold caps links (`HOME`, `PRODUCTS`, `GALLERY`, `CONTACT`) set in `Space Grotesk` bold (`letter-spacing: 0.18em`). Framed on the left by a solid flat icon/monogram mark and on the right by a floating pill `LOGIN` action button and clean circular search icon.

### Form Inputs & Fields
- **Pill Inputs**: Horizontal frosted fields with `1px` charcoal borders (`rgba(15, 23, 42, 0.2)`). Focus state transitions border to primary `#0F172A` with an ambient `0 0 0 3px rgba(125, 211, 252, 0.4)` powder glow.
- **Checkboxes & Radios**: Minimalist circular geometry with hairline borders; checked states display a centered solid obsidian dot.

### Graphic Decals & Technical Markers
- **Coordinate Crosses (`+`)**: Subtle, thin registration marks positioned near key visual features to reinforce precision engineering aesthetic.
- **Vertical Concept Labels**: Single-column vertical typography oriented at 90 degrees along the right edge of viewports.