# JUNG HWAN's DAILY — mobile edition

A phone-first Korean pastel pink/blue fan diary with a monthly calendar and photo gallery.

## Features
- Calendar-first Daily archive: month navigation, date selection, colored dots on dates with entries, and selected-day memories.
- Separate Photo gallery. Admins can upload photos independently without creating a Daily diary entry.
- Admin email magic-link login, create/edit/delete daily memories, multi-image upload.
- Supabase Storage bucket `daily-photos` and existing `daily_entries` table are used.

## Publish
Upload the four files (`index.html`, `style.css`, `app.js`, `README.md`) to the root of the GitHub Pages repository and commit the changes.

## Admin use
1. Open ADMIN and request a magic link for the configured admin email.
2. Open the email link on the same device/browser.
3. To add a dated diary entry, use the New memory form.
4. To upload photos independently, use the separate **Upload to Photo** form. These are stored as gallery-only records and do not appear as calendar diary entries.

Supabase project URL and publishable key are configured in `app.js`. Never put a service-role key in frontend code.
