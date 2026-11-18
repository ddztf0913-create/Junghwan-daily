# JUNG HWAN's DAILY

Mobile-first pastel pink and powder-blue fan diary.

## Daily calendar
- Calendar dates are marked when a daily entry exists.
- Selecting a date shows four independent content categories: text, stickers/emojis, images, and videos.
- Images open in a full-screen viewer with previous/next controls.
- Videos play inline with native controls.
- Previous/next day controls move the selected calendar date.

## Admin publishing
- Admin email: `180498829@qq.com`
- Sign in through the ADMIN button using the Supabase magic link.
- Daily entry form supports text, multiple photos, MP4/WEBM/MOV videos (up to 50 MB each), and emoji/sticker text separated by spaces or commas.
- PHOTO gallery uploads remain independent of Daily entries.

## Backend
- Supabase project: `rzlywtntvxxifobdcyxl`
- Storage bucket: `daily-photos`
- `daily_entries` includes `videos text[]` and `stickers text[]` columns.
- Never put a Supabase service-role key in frontend code. The publishable key is intended for browser use with RLS enabled.

## Deploy
Upload `index.html`, `style.css`, `app.js`, and `README.md` to the root of the GitHub Pages repository, replacing the existing files. Commit the changes and wait for Pages to redeploy.
