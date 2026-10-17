Fertilizer Shop Manager — Cloud starter
=======================================

This is a starter project, not a deployed/production-ready service.

Files:
- index.html: responsive bilingual web UI
- app.js: Supabase auth and database operations
- supabase_schema.sql: database tables, owner-level Row Level Security policies, atomic sale function

Setup outline:
1. Create a Supabase project at https://supabase.com/ and keep the project private.
2. In Supabase SQL Editor, run supabase_schema.sql.
3. In Project Settings > API, copy the Project URL and public anon/publishable key.
4. Edit app.js: replace SUPABASE_URL and SUPABASE_ANON_KEY placeholders.
5. For email/password sign-in, configure Supabase Auth email confirmation/redirect settings.
6. Host index.html and app.js on an HTTPS static host (e.g. Netlify, Cloudflare Pages, or GitHub Pages). Do not use file:// for final deployment.
7. Create the owner account and test with dummy farmers/products before entering real shop data.

Important:
- Never expose the Supabase service_role/secret key in app.js or in GitHub.
- The included RLS policies scope records to the signed-in user, but the schema and business workflows still require careful production review.
- App is currently a starter for farmers, products, sales, payments and basic dashboard. It does not yet include full audit logs, editing/deleting workflows, purchase supplier invoices, tax/GST invoice compliance, expiry alerts, automatic SMS/WhatsApp APIs, receipt printing, or scheduled offsite backups.
- SMS: connect a compliant provider and template/consent flow. WhatsApp: use the official WhatsApp Business Platform or an approved provider. This starter does not send messages.
- Do not store full Aadhaar numbers. Use internal Farmer IDs and only use legally appropriate verification methods if required.
- Before live use, test stock, payments, balances, access control, backups, and applicable Indian fertilizer/pesticide recordkeeping and invoice rules with a qualified professional.
