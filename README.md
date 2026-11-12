# JUNG HWAN's DAILY

A responsive fan-memory archive for SO JUNG HWAN, built with HTML/CSS/JS and Supabase.

## Publish with GitHub Pages
1. Create a **new** repository named `jung-hwan-daily`. Do not reuse your old repository.
2. Upload `index.html`, `style.css`, `app.js`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
5. GitHub will display the published URL, normally `https://YOUR-USERNAME.github.io/jung-hwan-daily/`.

## Supabase redirect setup
After you know the GitHub Pages URL, open project `JungHwanDaily` → Authentication → URL Configuration:
- Set Site URL to the exact published URL.
- Add that URL to Redirect URLs.
- Save changes.

## Admin publishing
Open ADMIN on the site and request a magic link for `180498829@qq.com`. Open the email link on the same device/browser. The admin panel supports adding, editing, deleting entries and uploading multiple images.

## Security
The browser uses the Supabase publishable key, not a service-role key. Database RLS and Storage policies must remain enabled. Never place a service-role key in frontend files.
