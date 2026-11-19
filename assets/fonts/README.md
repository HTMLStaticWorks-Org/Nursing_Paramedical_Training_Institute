# Fonts Directory (`assets/fonts/`)

By default, LifeBridge Institute loads three Google Fonts with `display=swap` and `preconnect` hints in each HTML `<head>`:
- **Fraunces** (500, 600, 700) — Display headings
- **Plus Jakarta Sans** (400, 500, 600, 700) — Body & UI
- **JetBrains Mono** (400, 500, 600) — Numeric KPIs, codes, and IDs

## Self-Hosting for Offline / Intranet Deployments
1. Download `.woff2` subsets for Fraunces, Plus Jakarta Sans, and JetBrains Mono into this folder (`assets/fonts/`).
2. Add `@font-face` declarations at the top of `assets/css/style.css` pointing to `../fonts/<filename>.woff2` with `font-display: swap;`.
3. Remove the Google Fonts `<link>` tags from HTML pages if deploying inside a restricted hospital intranet.
