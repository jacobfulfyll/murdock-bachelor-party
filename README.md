# Murdock's Weekend

A private website for Christopher Murdock's bachelor party — Salt Lake City, July 16–19, 2026. Sixteen guys, one URL, one password.

## Quick Start

```bash
git clone <repo-url>
cd murdock_bachelor_party
python3 -m http.server 8000
```

Open `http://localhost:8000`. Password: `saxcat`

## Features

- **Password gate** with photo explosion on entry
- **Trip logistics** — Airbnb link, transportation, dates
- **What To Pack** — curated list for a mountain/city/lake weekend
- **Arrivals** — schedule for all 16 attendees
- **Groceries** — full shopping list with live up/down voting and group suggestions (Firebase)
- **4-day schedule** — day-by-day slideshow with activity photos
- **Cost breakdown** — per-person estimates by category

## Tech

Vanilla HTML/CSS/JS. No build step. Tailwind CSS and Alpine.js from CDN. Firebase Realtime Database for grocery votes. Deployed on GitHub Pages.

## Docs

- [docs/soul.md](docs/soul.md) — project purpose and intended experience
- [docs/architecture.md](docs/architecture.md) — page structure and data flow
- [docs/styling-guide.md](docs/styling-guide.md) — color palette, typography, components
- [docs/getting-started.md](docs/getting-started.md) — Firebase setup, image sourcing, deployment
