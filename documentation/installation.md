# Installation & Deployment Guide

## Requirements
- Any modern static web host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, Apache, Nginx, cPanel).
- Zero Node build steps required at runtime; pure semantic HTML5, modular CSS3, and ES6 JavaScript.

## Local Preview
From the root directory (`lifebridge-institute/`):

```bash
# Option A: Python 3
python -m http.server 8080

# Option B: Node.js
npx serve .
```

Open `http://localhost:8080/` (redirects automatically to `/pages/index.html`).

## Deploying to Production
1. Update canonical URLs and `sitemap.xml` / `robots.txt` from `https://lifebridgeinstitute.edu.in` to your live domain.
2. Search the repository for `TODO:` comments to configure:
   - Official institute SVG/PNG logo in header & footer
   - Formspree or Netlify Forms endpoints on enquiry, contact, and admissions forms
   - Mailchimp / ConvertKit endpoints on footer newsletter and Coming Soon page
   - Google Maps iframe embed on `pages/contact.html`
   - Stripe / PayPal live public keys on `pages/dashboard/fees.html`
3. Optionally swap stylesheet and script tags to their pre-minified production builds (`*.min.css` and `*.min.js`) located alongside source files inside `assets/css/` and `assets/js/`.
