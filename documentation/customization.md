# Customization Guide

## 1. Brand Colors & Typography
Edit the CSS custom properties at the top of `assets/css/style.css` (`:root`) and dark overrides in `assets/css/dark-mode.css`:

```css
:root {
  --ink: #0B2B33;
  --primary: #0E8B8B;
  --primary-btn: #0B7575;
  --primary-soft: #DDF3EE;
  --accent: #FF6B5E;
  --accent-btn: #D4473B;
  --gold: #E3B85C;
  --paper: #F7FAF9;
  --slate: #4F656F;
}
```

Ensure any custom palette maintains a minimum **4.5:1 contrast ratio** (WCAG 2.1 AA) for normal text and buttons.

## 2. Replacing Photography
- All 101 unique photographs reside in `assets/images/` organized by section (`home/`, `courses/`, `facilities/`, `faculty/`, `placements/`, `about/`, `gallery/`, `blog/`, `dashboard/`, `misc/`).
- Keep both `.jpg` and `.webp` formats with matching filenames so `<picture>` elements serve WebP to modern browsers cleanly.
- Maintain minimum resolutions of **1600px wide** for hero/banner media and **1000px wide** for cards. Update `width` and `height` HTML attributes whenever aspect ratios change to prevent CLS.

## 3. Third-Party Integration Hook Points (`TODO:` Markers)
- **Contact & Enquiry Forms** (`pages/index.html`, `pages/contact.html`, `pages/admissions.html`): Add `action="https://formspree.io/f/YOUR_ID" method="POST"` or `data-netlify="true"` on the `<form>` tags, and remove `e.preventDefault()` inside `initForms()` in `assets/js/main.js` when connecting a live backend.
- **Newsletter & Launch Alerts** (`footer`, `pages/coming-soon.html`): Point form actions to your Mailchimp / ConvertKit audience URL.
- **Campus Visit Booking** (`pages/contact.html#visit`): Mount Calendly or Cal.com embed directly inside `[data-calendar-hook="campus-tour"]`.
- **Google Maps** (`pages/contact.html`): Replace the GPS Locator placeholder container with your Google Maps Embed `<iframe>`.
- **Fee Payments** (`pages/dashboard/fees.html`): Wire `[data-pay-gateway="Stripe"]` and `[data-pay-gateway="PayPal"]` buttons to your Stripe Checkout session endpoint or PayPal Smart Buttons SDK.
