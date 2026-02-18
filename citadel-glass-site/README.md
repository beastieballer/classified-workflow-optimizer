# Citadel Glass Static Website

Luxury, mobile-first static site for **Citadel Glass** built with semantic HTML, modern CSS, and lightweight vanilla JavaScript.

## Files

- `index.html` — full page structure and content sections
- `styles.css` — dark metallic executive visual system, responsive layout, accessibility/focus states, animations
- `script.js` — mobile nav toggle, FAQ accordion, and scroll reveal behavior

## Included Sections

- Polished hero with primary CTA
- Service cards
- Process timeline
- Trust/value section
- FAQ accordion
- CTA block
- Sticky contact bar (mobile only)

## Brand & Aesthetic Notes

- Refined dark + metallic palette (`#0b0f14` base, gold accent system)
- Executive, restrained typography and spacing
- Placeholder blocks for logo + 3 imagery areas

## Performance & Accessibility

- No frameworks, minimal JS
- Semantic heading structure and landmark regions
- Keyboard-visible focus styles
- Contrast-forward text colors on dark surfaces
- `prefers-reduced-motion` support
- `defer` script loading

## Local Preview

Open `index.html` directly in a browser, or serve with a static file server:

```bash
cd citadel-glass-site
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.
