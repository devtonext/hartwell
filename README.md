# Hartwell — Product Designer Portfolio Template

React 18 + Vite 5 + React Router 6, plain CSS, optional Supabase back end, built-in admin dashboard.

## Features
**Website:** Home, Services (FAQ accordion), About, Projects (filters), Blog (search + article pages), Testimonials, Contact form, footer newsletter, 404, responsive layout, hover micro-interactions, SEO title/meta per page, skip-link and reduced-motion support.
**Dashboard (`/admin`):** edit every text/image/colour, manage all lists (add, edit, duplicate, delete, reorder, Live/Hidden), inbox for messages and subscribers with CSV export, media library, setup guide.

## Quick start
```bash
npm install
npm run dev
```
No setup needed: with empty env vars the template runs in **demo mode** (data in localStorage).
Dashboard: `/admin` — demo login `admin@demo.com` / `demo1234`.

## Go live with Supabase in 5 steps
1. Create a project at supabase.com.
2. SQL Editor → paste `supabase/setup.sql` → Run (safe to re-run).
3. Copy the Project URL and **anon** key into `.env` (see `.env.example`). Never use the `service_role` key.
4. Open `/admin/login` and create the first account — it automatically becomes the admin.
5. Supabase → Authentication → turn **off** “Allow new users to sign up”.

## Deploy to Vercel
Import the repo, add the three `VITE_*` env vars **before** deploying, redeploy after any change, and set Supabase → Authentication → URL Configuration → Site URL to your live domain.

## Admins (SQL)
```sql
insert into public.admin_users(user_id,email) select id,email from auth.users where email='new@admin.com';
delete from public.admin_users where email='old@admin.com';
```

## Database
| Table | Purpose | Read | Write |
|---|---|---|---|
| site_content | One row per page section | Public | Admin |
| services, stats, tools, projects, journey, posts, testimonials, faqs | Lists | Public (published rows) | Admin |
| contact_messages, subscribers | Form entries | Admin | Anyone can insert (status forced), admin manages |
| admin_users | Dashboard admins | Admin | Admin |
| storage `media` | Images | Public | Admin |

`supabase/schema.sql` and `seed.sql` are **generated** from `src/admin/schema.js` and `src/lib/defaults.js`: run `npm run build:sql` after changing either. `npm run test:sql` checks the SQL in PGlite (idempotency, every RLS rule, first-admin trigger).

## Structure
`src/lib/defaults.js` (all content) · `src/lib/api.js` (Supabase + demo drivers) · `src/admin/` (dashboard) · `src/pages/` · `src/components/` · `src/styles/global.css` · `supabase/` · `scripts/`

## Add a field to a section
Add the key to the section in `defaults.js` and use it in the page. The dashboard form field appears automatically (type is inferred from the key: `image`, `*_link`, `color`, `title`, arrays = one per line).

## Add a column to a collection
1. Add the field to the collection in `src/admin/schema.js`. 2. Add a default value to its rows in `defaults.js`. 3. `npm run build:sql`. 4. For an existing database run `alter table public.<table> add column …`.

## Field types
text, textarea, title, list, tags, image (upload / drag-drop / library / URL), number, select, boolean, color, date, url, slug, markdown.

## Troubleshooting
| Problem | Fix |
|---|---|
| Still in demo mode | Env vars missing at build time; add them and redeploy |
| Can't create admin | An admin already exists — sign in, or add one with SQL |
| Uploads fail | Re-run `setup.sql`; check the `media` bucket exists |
| 404 on refresh | Keep `vercel.json` / `public/_redirects` |

## Image credits
Hero/About cutouts come from the design mockup and **must be replaced** before selling. Avatars: randomuser.me. Project/blog images are generated SVG placeholders.
