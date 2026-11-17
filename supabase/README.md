# VenueFlow Studio · Supabase

Remote project: `pfzigswxultqyjahunqo`  
Region: `sa-east-1` (São Paulo)  
API URL: `https://pfzigswxultqyjahunqo.supabase.co`

## Database types

`database.types.ts` is generated directly from the live Supabase schema. Regenerate it after every schema change:

```bash
npx supabase gen types typescript --project-id pfzigswxultqyjahunqo --schema public > supabase/database.types.ts
```

Use the publishable key in browser applications. Never place a secret/service-role key in frontend code, source control, or any `NEXT_PUBLIC_*` / `VITE_*` variable.

## Establish migration history

The remote schema was initially assembled directly in the hosted database. It does not yet have a verified, reproducible baseline migration in this repository. Do not create a fake/no-op migration to disguise that drift.

Install the Supabase CLI and Docker, authenticate, then run from the repository root:

```bash
npx supabase login
npx supabase link --project-ref pfzigswxultqyjahunqo
npx supabase db pull venueflow_remote_baseline
npx supabase migration list
```

Review the generated file under `supabase/migrations/` before committing it. The CLI will record the pulled baseline as already applied remotely. Do not run `supabase db reset --linked` against this project: that command is destructive.

After the baseline is in version control, make future schema changes through reviewed migration files and verify them locally with `npx supabase db reset` before deploying with `npx supabase db push --dry-run` and `npx supabase db push`.

## Authentication setup

Authentication provider credentials and redirect domains are environment-specific and must not be committed here.

1. In the Supabase Dashboard, open Authentication → URL Configuration.
2. Set the Site URL to the actual deployed VenueFlow Studio origin once it exists.
3. Add the exact local development callback, initially `http://localhost:3000/**`, and the deployed callback path used by the app.
4. Keep email confirmation enabled for production. Configure SMTP before relying on production email delivery.
5. Enable Google or Microsoft only after creating the corresponding OAuth application and securely entering its client ID/secret in Authentication → Sign In / Providers. Never commit OAuth client secrets.
6. Test signup, confirmation, login, logout, password recovery, expired sessions, and denied cross-organization access before release.

Provider callback URL format:
`https://pfzigswxultqyjahunqo.supabase.co/auth/v1/callback`

## Data API exposure

RLS and SQL grants are already part of the database security model. Data API exposure is a separate project setting. In Project Settings → API → Data API, confirm that `public` is an exposed schema. Keep RLS enabled on every exposed table and do not expose the internal `private` schema.

## Current integration boundary

This repository is currently an empty application repository with Supabase infrastructure files only. No frontend framework, app routes, UI, or OAuth provider credentials have been assumed or fabricated.
