# Architecture

## Overview

Pure static site. No build step, no bundler, no Node. Every page is a standalone HTML file that loads its dependencies from CDN and its shared JS from `js/`. Deployed on GitHub Pages, served from the repo root.

## Pages

| File | Route | Purpose |
|------|-------|---------|
| `index.html` | `/` | Password gate + photo explosion |
| `home.html` | `/home.html` | Welcome, Airbnb link, trip logistics |
| `packing.html` | `/packing.html` | What to bring |
| `flights.html` | `/flights.html` | Arrivals and departures for 16 attendees |
| `groceries.html` | `/groceries.html` | Shopping list with voting and suggestions |
| `schedule.html` | `/schedule.html` | 4-day slideshow |
| `costs.html` | `/costs.html` | Cost breakdown |

## Authentication

Client-side only. No server, no real user accounts.

- `index.html` validates the password against `['saxophonecat', 'saxcat']` (case-insensitive)
- On success: sets `sessionStorage.getItem('murdock_party_auth') = 'true'`
- Every other page calls `requireAuth()` on load, which redirects to `index.html` if the key is absent
- Auth lasts for the browser session — closing the tab requires re-entry

This is intentional. The goal is not security, it's keeping the site private from search engines and casual stumbling.

## Data Flow

Only one page uses a backend: `groceries.html`.

```
User votes / submits suggestion
        |
  Alpine.js event handler (groceries.js)
        |
  Firebase Realtime Database
        |
  Real-time listener (db.ref().on('value', ...))
        |
  Alpine.js reactive state updates DOM
```

**Firebase paths:**
- `votes/{itemId}` — integer, vote count for a hardcoded grocery item
- `suggestions/{pushId}` — object `{ item, name, timestamp, votes }`

Votes are not per-user. Anyone can vote any direction any number of times. This is fine for 16 friends.

The Firebase config block lives directly in `groceries.html` (commented out until the project is created). See `getting-started.md` for setup.

## CDN Dependencies

Loaded per-page in `<head>`. No local copies, no lockfile.

| Library | Version | CDN |
|---------|---------|-----|
| Tailwind CSS | latest CDN | `cdn.tailwindcss.com` |
| Alpine.js | 3.x | `cdn.jsdelivr.net/npm/alpinejs@3.x.x` |
| Firebase App (compat) | 9.23.0 | `gstatic.com/firebasejs/9.23.0/firebase-app-compat.js` |
| Firebase Database (compat) | 9.23.0 | `gstatic.com/firebasejs/9.23.0/firebase-database-compat.js` |
| Google Fonts | — | `fonts.googleapis.com` |

Tailwind config is inlined in a `<script>` tag on each page. This extends the default palette with the project's custom color tokens. It must be copy-consistent across all pages.

## Shared JavaScript

| File | Responsibility |
|------|---------------|
| `js/auth.js` | Password validation, sessionStorage, photo explosion animation, `requireAuth()` |
| `js/nav.js` | Sticky glass nav scroll behavior, mobile menu open/close |
| `js/groceries.js` | Alpine.js `groceryStore()` — Firebase sync, voting, suggestions |
| `js/schedule.js` | Day selector state, `fadeUp` transition on day switch, keyboard arrow navigation |
| `js/parallax.js` | Scroll-linked `transform: translateY` on `.parallax-bg` elements; disabled when `prefers-reduced-motion` is set |

## Shared CSS

`css/styles.css` — custom properties and component classes that extend Tailwind. Tailwind handles layout and utility classes; `styles.css` handles anything Tailwind can't: CSS variables, animations, component-level selectors, scrollbar styling.

## Images

```
images/
  explosion/   — cat + saxophone photos for the landing animation (WebP)
  hero/        — landing page hero background image
  pages/       — per-page split-screen images (Airbnb, packing, arrivals)
  schedule/    — activity photos for each day's schedule panels
```

Raw PNGs are `.gitignore`d. All committed images must be WebP or AVIF.

Compression command: `cwebp -q 80 -resize [width] 0 input.png -o output.webp`

## Deployment

Push to `main`. GitHub Pages serves from the repository root. No build or publish step required.
