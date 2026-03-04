# SKS Adventures recruitment site

A pure static, mobile-first GitHub Pages website for recruiting players to SKS Adventures D&D campaigns.

## Files

- `index.html` – single-page site layout and content sections
- `assets/styles.css` – visual theme and responsive styles
- `assets/main.js` – link configuration + small UI helpers
- `assets/img/` – optional local image assets (includes placeholder note)

## Quick customization

### 1) Update key links

Open `assets/main.js` and edit these constants:

```js
const FORM_URL = "https://example.com";
const DISCORD_INVITE_URL = "https://example.com";
const CONTACT_EMAIL = "mailto:example@example.com";
```

- `FORM_URL` powers **Apply to Play**, **Join the Waitlist**, and footer apply links.
- `DISCORD_INVITE_URL` powers the Discord button.
- `CONTACT_EMAIL` powers the footer Contact link.

> Tip: while `FORM_URL` is still `example.com`, the page shows a reminder message to update it.

### 2) Change text/content

Edit `index.html` section-by-section:

- Hero pitch and CTA text
- Campaign hooks/cards
- Table expectations/logistics
- Safety language and about bio

Use semantic headings (`h1`, `h2`, `h3`) to keep accessibility and SEO strong.

### 3) Add social preview + favicon

Place these files in `assets/img/`:

- `favicon.ico`
- `social-preview.png`

`index.html` already includes metadata/link placeholders for both.

## Form options (Google Forms or Tally)

You can use either service as your `FORM_URL`:

- **Google Forms**: use the public responder URL (usually `/viewform`).
- **Tally**: use your public form URL.

Paste that full URL into `FORM_URL` in `assets/main.js`.

## Enable GitHub Pages (repo root)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/ (root)`
4. Save and wait for deployment.
5. Your site will appear at your GitHub Pages URL.

## Local preview

Because this is a no-build static site, you can open `index.html` directly in a browser.
For cleaner testing, use a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
