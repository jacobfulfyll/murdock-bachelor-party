# CLAUDE.md

## Project Overview
Password-gated bachelor party website for Christopher Murdock's trip to Salt Lake City (July 16-19, 2026). Nature-inspired dark theme with interactive grocery voting, day-by-day schedule slideshow, and trip logistics for ~16 attendees.

## Tech Stack
- **Language**: Vanilla HTML/CSS/JavaScript (no build step)
- **Styling**: Tailwind CSS (CDN) + custom CSS tokens in `css/styles.css`
- **Reactivity**: Alpine.js (CDN) for grocery voting/suggestions
- **Backend**: Firebase Realtime Database (grocery votes + suggestions only)
- **Fonts**: Google Fonts — Playfair Display (serif headers) + Inter (sans body)
- **Deployment**: GitHub Pages (static site)

## Project Structure
```
murdock_bachelor_party/
├── index.html          # Landing page (password gate + photo explosion)
├── home.html           # Home page (welcome, Airbnb link, trip info)
├── packing.html        # What To Pack (split layout)
├── flights.html        # Arrivals & departures (16 attendees)
├── groceries.html      # Grocery list with Firebase voting + suggestions
├── schedule.html       # 4-day slideshow (3 sections per day)
├── costs.html          # Cost breakdown by day
├── css/
│   └── styles.css      # Design tokens, animations, component styles
├── js/
│   ├── auth.js              # Password gate + photo explosion animation
│   ├── nav.js               # Sticky glassmorphic nav + mobile menu + active link
│   ├── groceries.js         # Alpine.js store for Firebase voting
│   ├── schedule.js          # Day selector + slideshow state + scroll animations
│   ├── parallax.js          # Hero parallax + split-image container parallax (desktop, rAF)
│   ├── scroll-animations.js # IntersectionObserver fly-in for split-section pages
│   ├── page-transitions.js  # Fade-out on internal nav, bfcache restore
│   └── packing.js           # Packing checklist with localStorage + progress counter
├── images/
│   ├── explosion/      # Photo explosion images (compressed WebP)
│   ├── hero/           # Landing page hero background image
│   ├── pages/          # Per-page split-screen images (Airbnb, packing, arrivals)
│   └── schedule/       # Activity photos for daily schedule
├── notes.txt           # Original project spec
├── TASKS.md            # Development task backlog
└── docs/               # Documentation
```

## Conventions
- Password: "saxophonecat" or "saxcat" (case-insensitive)
- All pages require auth via sessionStorage — `requireAuth()` called on load
- Tailwind config is inline in each HTML `<script>` tag (no build step)
- Design tokens defined as CSS custom properties in `css/styles.css`
- Color palette: pine greens (base), sandstone (warm accents), sky blue (arrivals), amber (celebration)
- Split-screen layout pattern used across most pages (content + image)
- Firebase config goes in `groceries.html` (TODO: add after project creation)
- Images must be compressed WebP/AVIF before committing (raw PNGs in .gitignore)

## Key Commands
- **Dev server**: `python3 -m http.server 8000` (or any static server)
- **Image compress**: `cwebp -q 80 -resize [width] 0 input.png -o output.webp`
- **Deploy**: Push to `main` branch, GitHub Pages serves from root

## Documentation
See `docs/` for:
- `soul.md` — project purpose, target users, core experience
- `architecture.md` — page structure, data flow, Firebase integration
- `styling-guide.md` — color palette, typography, component patterns
- `getting-started.md` — setup and first run

## Agent Preferences
- Use web-developer agent for UI/layout work
- Use cloud-engineer agent for Firebase configuration
- Always test on mobile viewport (375px) — 16 guys on phones
- Preserve the dark nature aesthetic — no bright backgrounds or party decorations
- Photo explosion uses images from `images/explosion/` only

## Animation Architecture
- **schedule.js** manages its own scroll animations (day-container scoped, resets on day switch)
- **scroll-animations.js** handles all other pages (document-level, fire-and-forget)
- **parallax.js** applies to `.parallax-bg` (hero, factor 0.4) and `.split-image` containers (factor 0.1, desktop only)
  - IMPORTANT: Apply split-image parallax to the `.split-image` container, NOT the `img` — applying to `img` clobbers CSS hover zoom
- **page-transitions.js**: use a `navigated` flag to guard the transitionend + setTimeout dual-fire pattern
- Scroll animation CSS classes (`.slide-left/right/up/down`, `.in-view`) live in `css/styles.css` under `@media (prefers-reduced-motion: no-preference)`
- Packing checklist keyed by item text (not index) — avoid duplicate text across lists
- Schedule slides use `.schedule-slide.split-section` (double-class selector) to override `.split-section`'s `min-height: 100vh` — desktop gets 100vh via media query, mobile gets `min-height: 0` for flowing layout
- Schedule day switch uses instant `scrollTo` with temporary CSS `scroll-behavior: auto` override — don't revert to `scrollIntoView`
