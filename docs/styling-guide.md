# Styling Guide

## Principles

Dark nature aesthetic. The base is deep forest at night — nearly black greens. Warm sandstone and cream pull the palette toward Utah's landscape. Everything should feel intentional and a little luxurious, not party-themed.

Never use white backgrounds. Never add decorative borders, icons, or flourishes that read as "celebration." The photo explosion on the landing page is the one exception — that moment is deliberately chaotic.

Always test at 375px width. Most of the 16 attendees will use this on their phones.

## Color Palette

All tokens are defined as CSS custom properties in `css/styles.css` and extended into Tailwind via the inline `tailwind.config` block on each page.

### Pine Greens (primary)

| Token | Hex | Tailwind class | Use |
|-------|-----|---------------|-----|
| `--pine-950` | `#112C1A` | `bg-pine-950` | Page background |
| `--pine-900` | `#1B4127` | `bg-pine-900` | Card backgrounds |
| `--pine-800` | `#28633B` | `border-pine-800` | Card borders, dividers |
| `--pine-700` | `#398852` | `border-pine-700` | Input borders, hover states |
| `--pine-500` | `#63B57D` | `bg-pine-500` | Primary buttons, active day selector |
| `--pine-400` | `#90CFA2` | `text-pine-400` | Active nav links, upvote hover |
| `--pine-300` | `#B3E0C0` | `text-pine-300` | Light accents |

### Sandstone (warm accents)

| Token | Hex | Tailwind class | Use |
|-------|-----|---------------|-----|
| `--sandstone-500` | `#A67C52` | — | Rare deep accent |
| `--sandstone-400` | `#C4956A` | `bg-sandstone-400` | Warm/secondary buttons |
| `--sandstone-300` | `#D4AF87` | `text-sandstone-300` | Section category labels in groceries/costs |
| `--sandstone-200` | `#E8D5B7` | `text-sandstone-200` | Subtle warm text |

### Sky Blue (arrivals accent)

| Token | Hex | Tailwind class | Use |
|-------|-----|---------------|-----|
| `--skyblue-500` | `#5BA8BE` | — | — |
| `--skyblue-400` | `#7BBFCF` | `text-skyblue-400` | Arrival times on arrivals page |
| `--skyblue-300` | `#A3D4DF` | `text-skyblue-300` | Light sky accent |

### Cream (text)

| Token | Hex | Tailwind class | Use |
|-------|-----|---------------|-----|
| `--cream-100` | `#F5F0E8` | `text-cream-100` | Primary body text, headings |
| `--cream-200` | `#EDE5D8` | `text-cream-200` | Secondary text, nav links |
| `--cream-400` | `#BDB4A4` | `text-cream-400` | Tertiary text, labels, placeholders |

### Amber (celebration)

| Token | Hex | Tailwind class | Use |
|-------|-----|---------------|-----|
| `--amber-400` | `#F59E0B` | `text-amber-400` | Group suggestions section header, cost totals |
| `--amber-300` | `#FBD27A` | — | Rare highlight |

## Typography

Two typefaces. One serif, one sans.

**Playfair Display** (serif) — headings only (`h1`–`h4`). Loaded from Google Fonts. Use for page titles, section headers, card titles. The Tailwind alias is `font-serif`.

```html
<h1 class="font-serif text-3xl md:text-5xl font-bold text-cream-100">Groceries</h1>
```

**Inter** (sans) — everything else. Body copy, labels, nav links, buttons, table cells. The Tailwind alias is `font-sans` (default body).

### Eyebrow Labels

Small uppercase labels above section headings, always in pine-400.

```html
<span class="eyebrow">Stock Up</span>
<h1 class="font-serif ...">Groceries</h1>
```

The `.eyebrow` class: `Inter`, `0.75rem`, `font-weight: 600`, `uppercase`, `letter-spacing: 0.1em`, `color: var(--pine-400)`.

## Component Patterns

### Split-Screen Layout

Used on home, packing, arrivals, and each schedule slide. Content on one side, image on the other. On mobile, the image stacks below.

```html
<section class="split-section">
  <div class="split-content"><!-- text --></div>
  <div class="split-image">
    <img src="..." alt="...">
    <div class="split-image-overlay"></div>
  </div>
</section>
```

The `.split-section` class is `display: grid; grid-template-columns: 1fr` on mobile, `1fr 1fr` at `md:`. The overlay is a left-to-right gradient from `rgba(17,44,26,0.5)` to transparent, softening the image edge against the content panel.

On schedule slides, panels alternate: odd slides put content left, even slides put content right (swap the order of the two divs).

### Cards

Dark green cards used for grocery items, arrival entries, cost rows.

```html
<div class="card">...</div>
```

`.card`: `bg-pine-900`, `border-pine-800`, `border-radius: 0.75rem`, `padding: 1rem 1.25rem`. On hover: border moves to `pine-700`, slight `translateY(-1px)`.

### Glass Nav

The nav starts transparent and gains a frosted-glass background once the user scrolls.

```html
<nav id="main-nav" class="nav-glass fixed top-0 left-0 right-0 z-40 px-6 py-4">
```

`.nav-glass.scrolled` (applied by `nav.js`): `background: rgba(17,44,26,0.85)`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid pine-800`.

Nav links use `.nav-link`: uppercase, `0.875rem`, with an animated underline that slides in on hover or active state.

### Day Selector

The timeline at the top of `schedule.html`. A pill-shaped container with one button per day.

```html
<div class="day-selector">
  <button class="day-btn active">Thu 7/16</button>
  <button class="day-btn">Fri 7/17</button>
  ...
</div>
```

Active day button: `bg-pine-500`, `color: pine-950`. Inactive: transparent with `cream-400` text.

### Grocery Voting

Each grocery card has up/down vote buttons. Upvote hover/active color is `amber-400`. Downvote hover/active is `pine-400`.

```html
<button class="vote-btn upvote" @click="vote('item-id', 'up')">
  <svg ...></svg>
  <span x-text="getVoteCount('item-id')">0</span>
</button>
<button class="vote-btn downvote" @click="vote('item-id', 'down')">
  <svg ...></svg>
</button>
```

### Buttons

Two button variants:

- `.btn-primary` — `bg-pine-500`, dark text. For confirmation/submit actions on the green side.
- `.btn-warm` — `bg-sandstone-400`, dark text. Used for the grocery suggestion submit.

### Form Inputs

`.form-input` and `.password-input` both use a semi-transparent dark green background with pine-700 border. Focus state: border jumps to pine-500 with a soft glow. Error state: red border + shake animation. Success state (password only): amber border + glow.

## Animations

### Photo Explosion (`auth.js`)

12 images spawn from random screen edges and animate to random positions on screen. Each image: random size (80–200px), random entry delay (0–80ms × index), random rotation (±20deg), spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Total runtime: ~1.4s before redirect.

### Parallax Hero (`parallax.js`)

`.parallax-bg` elements have `top: -4rem` to start offset, and their `transform: translateY` is driven by scroll position. Disabled entirely when `prefers-reduced-motion: reduce` is set.

### Page Transitions

`.page-content` plays `fadeUp` on load: `opacity 0 → 1`, `translateY(20px → 0)` over 0.3s.

### Schedule Day Switch

On day change, `schedule.js` applies `animation: fadeUp 0.3s ease-out` to the newly active `.day-container`.

### Input Shake

On wrong password, the input gets `.error` which triggers `@keyframes shake`: `translateX` oscillates ±6px over 0.4s.

## Mobile

Breakpoint: `md` (768px). Below this:
- Split sections stack vertically (image below content)
- Desktop nav hides; hamburger shows
- Mobile menu is a full-screen overlay: `rgba(17,44,26,0.95)`, `backdrop-filter: blur(12px)`, centered links at `1.25rem`
- Grocery grid collapses to single column
