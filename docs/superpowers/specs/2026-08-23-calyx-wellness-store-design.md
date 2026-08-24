# Calyx — Ultra-Premium Wellness E-Commerce Design Spec

Date: 2026-08-23
Status: Approved (user approved in conversation)

## Summary

Replace the existing "Orbit Studio" landing page with a two-page, dependency-free
e-commerce front-end for a high-end health & wellness dropshipping brand: an
ultra-minimal, white/ivory, luxury-scientific aesthetic (Aesop × The Ordinary × Apple).

## Deliverables

| File | Purpose |
|---|---|
| `index.html` | Nav, announcement bar, hero, collection grid (6 products), trust band, philosophy, newsletter, footer with watermark |
| `product.html` | PDP for Magnesium Glycinate 400: sticky gallery, purchase panel (one-time/subscribe), facts table, accordions, related products |
| `styles.css` | Tokens, base, UI components, page layouts, motion, responsive |
| `renders.css` | Signature CSS product-render system (bottles/jars/droppers built from gradients) |
| `script.js` | Header state, scroll reveals, quick-add cart counter, accordions, plan toggle, quantity stepper, gallery views, mobile menu |

## Brand

- Name: **CALYX** (the casing that holds a flower bud before it opens)
- Voice: clinical calm; product names follow The Ordinary convention
  ("Magnesium Glycinate 400", "Omega-3 Triglyceride")
- Lineup: Magnesium Glycinate 400 · Omega-3 Triglyceride · Ashwagandha KSM-66 ·
  Vitamin D3 + K2 Drops · Marine Collagen Peptides · Probiotic 50 Billion

## Design tokens

- Ivory page `#FBFAF7`, pure surface `#FFFFFF`, ink `#161513`
- Warm grays: text-secondary `#78736B`, faint `#A39E94`, hairline `#ECE8E1`, stroke `#DDD8CF`
- Product accents (desaturated, one per product): sage `#93A18A`, oat `#C4B294`,
  clay `#BC9783`, slate `#93A1AB`, honey `#C0966B`
- Type: Inter (200–500) display/body; IBM Plex Mono (uppercase, tracked) for
  spec labels — the recurring "lab label" motif
- Shadows soft and diffuse; radii subtle (cards 16–20px media panels, pill buttons)

## Signature element

Hand-built CSS product renders: matte bottles, smoked/amber glass, dropper vials,
ceramic and powder jars — layered gradients, refraction highlights, real micro-type
on labels, soft floor shadows staged on a hairline "gallery shelf". All other
decoration stays minimal. Motion limited to staggered hero entrance, scroll
fade-ups (`prefers-reduced-motion` respected), gentle card hover with quick-add.

## Structure decisions

- Static vanilla HTML/CSS/JS (no build step, no dependencies beyond Google Fonts CDN)
- Two pages sharing one stylesheet pair; PDP reached from product cards/breadcrumbs
- Imagery approach: CSS-crafted renders only (user-selected); no stock hotlinks
- Replaces existing `index.html` / `styles.css`

## Accessibility & quality floor

Semantic landmarks, labelled controls, focus-visible outlines, contrast ≥ 4.5:1 for
body text, responsive to 360px, reduced-motion honored, no layout shift from renders.

## Out of scope

Real checkout/cart persistence, CMS, search results page, journal content pages.
