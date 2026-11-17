# VenueFlow Studio · Supabase

Remote project: `pfzigswxultqyjahunqo`  
Region: `sa-east-1` (São Paulo)  
API URL: `https://pfzigswxultqyjahunqo.supabase.co`

## Frontend integration

The client application uses React + TypeScript + Vite. Its typed Supabase client is in `src/lib/supabase/client.ts` and imports `supabase/database.types.ts`.

Configure `.env.local` using the root `.env.example`:

```env
VITE_SUPABASE_URL=https://pfzigswxultqyjahunqo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Only the publishable key belongs in the browser. Never expose a secret/service-role key or OAuth client secret in frontend code, source control, or a `VITE_*` variable.

## Database types

`database.types.ts` was generated from the live Supabase schema. Regenerate it after every schema change:

```bash
npx supabase gen types typescript --project-id pfzigswxultqyjahunqo --schema public > supabase/database.types.ts
```

## Establish migration history

The remote schema was initially assembled directly in the hosted database. It does not yet have a verified, reproducible baseline migration in this repository. Do not create a fake/no-op migration to disguise that drift.

Install the Supabase CLI and Docker, authenticate, then run from the repository root:

```bash
npx supabase login
npx supabase link --project-ref pfzigswxultqyjahunqo
npx supabase db pull venueflow_remote_baseline
npx supabase migration list
```

Review the generated file under `supabase/migrations/` before committing it. Do not run `supabase db reset --linked` against this project.

After the baseline is in version control, make future schema changes through reviewed migration files. Verify locally with `npx supabase db reset`, then use `npx supabase db push --dry-run` and `npx supabase db push` for deployment.

## Authentication setup

The frontend currently implements email/password signup and sign-in. Provider credentials and production redirect domains remain environment-specific.

1. In Supabase Dashboard, open Authentication → URL Configuration.
2. For local Vite development, use `http://localhost:5173` as the Site URL and add `http://localhost:5173/**` to allowed redirect URLs.
3. Set the production Site URL to the deployed VenueFlow Studio origin when it exists.
4. Keep email confirmation enabled for production and configure SMTP before relying on production email delivery.
5. Enable Google or Microsoft only after creating the OAuth application and securely entering its client ID/secret in Authentication → Sign In / Providers.
6. Before release, test signup, confirmation, login, logout, password recovery, expired sessions and denied cross-organization access.

Provider callback URL:
`https://pfzigswxultqyjahunqo.supabase.co/auth/v1/callback`

## Data API exposure

RLS and SQL grants are part of the database security model. Data API exposure is a separate project setting. In Project Settings → API → Data API, confirm that `public` is an exposed schema. Keep RLS enabled on every exposed table and do not expose the internal `private` schema.

## Implementation boundary

The frontend foundation and first workspace view exist. The geometric editor, complete venue/event workflows, inventory, optimization, circulation, exports, collaboration and offline synchronization still require implementation and validation.
