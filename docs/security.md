# Security

## Token Protection

The Brapi API token is the primary credential that must be protected:

### Architecture
- Token is never stored in client-side code
- All Brapi requests go through a backend proxy
- Proxy appends the token server-side before proxying to Brapi

### Local Development
- Token stored in `.env` file (excluded from Git via `.gitignore`)
- Backend proxy reads token from environment variable

### Production (Kubernetes)
- Token stored in Kubernetes Secret
- Secret mounted as environment variable
- Never committed to repository

### Production (Vercel)
- Token stored as server-side environment variable
- Only accessible within serverless function runtime
- Never prefixed with `NEXT_PUBLIC_` or similar

## HTTP Security Headers

Configured in Nginx and Vercel:

- Content-Security-Policy: Restricts resource sources
- X-Content-Type-Options: Prevents MIME sniffing
- Referrer-Policy: Controls referrer header
- Permissions-Policy: Restricts browser features
- Cross-Origin-Opener-Policy: Isolates cross-origin windows
- Strict-Transport-Security: Enforces HTTPS (when enabled)

## Additional Measures

- Correlation IDs for request tracing
- No secrets in logs or error responses
- Input sanitization for ticker parameters
- Request timeout to prevent hanging connections
- Rate limiting on the proxy layer
