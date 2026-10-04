# Security Architecture Notes

## Trust boundaries

Zertainity has three primary trust boundaries:

1. **Browser application** — uses only the public Supabase client key and authenticated user sessions.
2. **Supabase Edge Functions** — privileged operations authenticate the caller before using the service-role key.
3. **PDF renderer** — treated as isolated infrastructure. It receives requests only from the Edge Function and requires a shared secret in production.

## Server-access protections

- Service-role credentials are read only from server-side environment variables.
- The PDF Edge Function requires a valid Supabase bearer token.
- Production PDF renderer URLs must use HTTPS and match the configured host allow-list.
- The PDF renderer disables remote and local-file resource fetching during WeasyPrint rendering, preventing submitted HTML from being used to reach arbitrary hosts or local files.
- PDF HTML/CSS payloads are size-limited to reduce resource-exhaustion abuse.
- Browser CORS origins are explicitly allow-listed.
- Sensitive role-check RPC execution is restricted to authenticated/service-role callers.
- Content Security Policy does not permit `unsafe-eval`.

## Operational requirements

Production deployments should set:

- `ENVIRONMENT=production`
- `PDF_SERVICE_SECRET` to a strong random secret
- `PDF_ALLOWED_HOSTS` to the exact renderer host(s)
- `PRIMARY_PDF_SERVICE_URL` and `FALLBACK_PDF_SERVICE_URL` to HTTPS renderer endpoints

Never commit these values to the repository.

## Scope

These controls reduce unauthorized access and SSRF risk, but they do not replace infrastructure-level controls such as private networking, firewall rules, secret rotation, database policy review, rate limiting, logging, backups, and provider security settings.
