# Supabase Auth Integration

Auth is implemented through Supabase Auth REST endpoints, without an extra
client dependency. The app stores the Supabase access token and refresh token in
HTTP-only cookies.

Implemented:

- `/auth/login`: sign in with email/password.
- `/auth/signup`: create an account with email/password.
- `/dashboard`: protected server-rendered page.
- Sign out action clears local auth cookies and calls Supabase logout when a
  token is available.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: the project URL, for example
  `https://your-project.supabase.co`. If `/rest/v1` is included by mistake,
  the app removes it before calling Supabase Auth.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: the public anon key. A modern Supabase
  publishable key can also be provided as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Never expose the Supabase secret key in browser-facing or public environment
variables.

Still to build:

- Password reset.
- Email confirmation callback UI.
- Database tables for user profiles, brain-test results, XP, streaks, score
  history, and dashboard progress.
