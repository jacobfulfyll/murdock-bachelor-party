# Getting Started

## Prerequisites

- Any web browser
- Python 3 (for local dev server) — or any static file server

## Run Locally

```bash
git clone <repo-url>
cd murdock_bachelor_party
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

You must use a server — opening `index.html` directly as a file will break Firebase and font loading.

**Password:** `saxophonecat` or `saxcat` (case-insensitive)

## Firebase Setup (Groceries Voting)

The groceries page works without Firebase — it just shows zero votes and the suggestion form won't persist. To enable live shared voting:

**1. Create a Firebase project**

Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project. You can skip Google Analytics.

**2. Enable Realtime Database**

In the Firebase console: Build > Realtime Database > Create database. Choose any region. Start in **test mode** (open read/write rules) — this is fine for a private party site.

**3. Paste the config into `groceries.html`**

Find the commented-out block near the bottom of `groceries.html`:

```html
<!-- TODO: Replace with your Firebase config after creating the project
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  ...
};
firebase.initializeApp(firebaseConfig);
-->
```

Replace it with your actual config from the Firebase console (Project Settings > Your apps > SDK setup and configuration). Uncomment the block.

**4. Test it**

Reload the page and upvote something. Open a second browser tab — the vote count should update in real time.

## Images

All images are sourced from [Pexels](https://www.pexels.com/) (free license) and compressed to WebP.

**Hero image:** `images/hero/utah-hero.webp` — mountain landscape for the landing page background.

**Page images:** `images/pages/` — per-page split-screen images (Airbnb, packing, Salt Lake City).

**Schedule images:** `images/schedule/` — one photo per schedule section (12 total across 4 days).

To replace or add images, compress to WebP before committing:

```bash
# Hero: 1920px wide
cwebp -q 80 -resize 1920 0 input.jpg -o images/hero/utah-hero.webp

# All others: 1200px wide, target < 150KB
cwebp -q 80 -resize 1200 0 input.jpg -o images/schedule/[name].webp
```

Raw PNGs are in `.gitignore`.

## Deploy

Push to the `main` branch. Then:

1. Go to the repo on GitHub
2. Settings > Pages
3. Source: "Deploy from a branch"
4. Branch: `main`, folder: `/ (root)`
5. Save

The site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

The password gate is client-side only and will be visible in the source. That's acceptable — the goal is to keep the URL private, not to prevent a determined person from reading the HTML.
