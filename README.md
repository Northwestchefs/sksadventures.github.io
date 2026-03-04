# SKS Adventures Website

Static GitHub Pages site for recruiting players to join SKS Adventures D&D games.

## Enable GitHub Pages
1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, set:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Save. GitHub will publish and update your site automatically after each push.

## Edit your signup/contact settings
Update the constants in `assets/main.js`:
- `FORM_URL`
- `DISCORD_INVITE_URL`
- `CONTACT_EMAIL`
- `DISCORD_HANDLE`

`SAFETY_URL` defaults to `FORM_URL` in that same file.

## Plug in Google Forms or Tally
1. Create your form in Google Forms or Tally.
2. Copy the public share URL.
3. Paste that URL into `FORM_URL` in `assets/main.js`.
   - The "Apply to Play" buttons on the site will automatically point at
     whatever URL you provide.
   - When you supply a real form URL (i.e. not the `https://example.com`
     placeholder) an iframe is injected below the button so visitors can
     complete the form directly without leaving the page. The iframe is
     hidden until a proper link is configured.
4. (Optional) Use a dedicated safety form by setting `SAFETY_URL` to a different URL.

## Suggested update workflow
1. Edit constants in `assets/main.js`.
2. Commit your changes.
3. Push to GitHub.
4. Wait for Pages deployment to complete (usually 1–2 minutes).
