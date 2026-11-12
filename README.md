# JUNG HWAN'S DAILY

A mobile-first, phone-portrait fan memory archive in a soft powder-blue and pastel-pink Korean-inspired style.

## Files
- `index.html` — page structure and bottom navigation
- `style.css` — mobile-first layout (the content stays in a phone-width app frame on desktop too)
- `app.js` — Supabase loading, admin magic-link login, entry publishing, editing, deleting and photo uploads

## Publish with GitHub Pages
Upload these four files directly to the root of the `Junghwan-daily` repository. In Settings → Pages, select `Deploy from a branch`, branch `main`, folder `/(root)`.

## Supabase
The frontend is configured to use the existing Supabase project. In Supabase → Authentication → URL Configuration, set Site URL and Redirect URLs to the final GitHub Pages URL, for example `https://YOUR-USERNAME.github.io/Junghwan-daily/`.

Only the publishable key is used in the frontend. Never put a service-role key in this repository.
