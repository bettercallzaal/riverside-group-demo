# Riverside Group - Demo Website

A refreshed website demo for Riverside Group LLC (Mount Desert, ME landscape design firm).

Built by BetterCallZaal as a design proposal - April 2026.

## Structure

- `index.html` - single-page main site (hero, services, process, portfolio preview, service area map, journal preview, team, testimonials, inquiry form)
- `portfolio/index.html` - filterable project grid
- `portfolio/coastal-estate.html` - sample case study (Schooner Head Estate)
- `journal/index.html` - blog archive with category filter
- `journal/designing-for-maine-winters.html` - sample full article
- `assets/css/styles.css` - all styling (CSS variables + responsive)
- `assets/js/app.js` - nav, before/after slider, multi-step inquiry form

## Features beyond the current site

1. Portfolio case studies with narrative detail + image gallery
2. Interactive before/after slider (drag to transform)
3. Multi-step project inquiry form (project type -> size/budget -> timeline -> contact)
4. Visual 5-phase process timeline
5. SVG service-area map showing Maine coast coverage
6. Seasonal journal with category filtering
7. Testimonials carousel
8. Mobile-first responsive (breaks at 880px)

## Running locally

Open `index.html` in a browser. No build step required.

## Deploying to Vercel

```bash
vercel
```

Static site, no framework, no env vars needed.

## Stack

- Vanilla HTML / CSS / JS
- Google Fonts: Fraunces (display) + Inter (body)
- Unsplash for placeholder imagery (replace with Cameron's actual project photography before launch)

## Colors

- Moss `#1f2e1a` - primary dark
- Bone `#e8e4d8` - primary light
- Brass `#8b6f3a` - accent
- Charcoal `#2a2a24` - body text
- Stone `#7a7a6e` - muted

## Typography

- Display: Fraunces, 300-400 weight, italic variants
- Body: Inter, 400-600 weight
