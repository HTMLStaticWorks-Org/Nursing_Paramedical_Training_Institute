# LifeBridge Institute of Nursing & Paramedical Sciences

A production-quality, multi-page HTML5 / CSS3 / ES6 JavaScript website & Student LMS Dashboard template built specifically for **Nursing Colleges, Paramedical Training Institutes, and Allied Health Sciences Academies**.

**Design Identity:** *"Clinical Calm meets Pulse"* — deep midnight teal (`#0B2B33`), surgical teal (`#0E8B8B`), warm coral-vital (`#FF6B5E`), soft brass (`#E3B85C`), Fraunces display serif, Plus Jakarta Sans UI typography, animated ECG motifs, and 3D perspective tilt cards with healthcare-themed micro-animations.

## Key Highlights

- **30 Complete HTML Pages** — 19 public marketing, admissions, gallery, blog, auth & utility pages + 10 interactive Student Dashboard LMS pages + 1 Admin Blueprint starter page.
- **Zero Repeated Sections** — Home 1 (Editorial Split-Screen) and Home 2 (Full-Bleed Cinematic Course Finder + Interactive ICU Simulation Lab Hotspots) share zero hero layouts and zero section structures. Every page contains only purpose-built sections.
- **101 Unique Local Photographs (Zero Reuse)** — Stored in `assets/images/` across 10 subfolders in both optimized `.jpg` and `.webp` formats using `<picture>`, `loading="lazy"`, and explicit `width`/`height` attributes. Zero external hotlinked image URLs.
- **Strict 3D Tilt & Responsive Alignment** — All cards use mouse-driven 3D tilt (with touch scroll-tilt & tap depth), centered icons/text in every viewport, equal row heights, and pinned bottom CTAs. Mobile (`<640px`) enforces centered tags/headings/copy/buttons with identical button sizing across the site; Tablet (`640–1024px`) centers tags, headings, and buttons.
- **Global Accessibility & Features** — WCAG 2.1 AA contrast & keyboard focus, Dark/Light mode (`prefers-color-scheme` + `localStorage`), full RTL mirroring (`rtl.css`), Command Palette search (`Ctrl/Cmd+K`), 3-question Course Quiz modal, Prospectus modal, Toast notifications, ECG preloader, skeleton loaders, print stylesheet, and validated forms.

## Quick Start

1. Open `index.html` (redirects to `pages/index.html`) or start any static server from the project root:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```
2. Visit `http://localhost:8080/pages/index.html` (Home 1), `http://localhost:8080/pages/home-2.html` (Home 2), or `http://localhost:8080/pages/dashboard/overview.html` (Student LMS).

## Documentation

Full guides live inside [`documentation/`](documentation/):
- [Installation Guide](documentation/installation.md)
- [Customization Guide](documentation/customization.md) (Brand tokens, fonts, photos, Formspree/Mailchimp/Maps/Stripe hooks)
- [Page Structure & Unique Section Map](documentation/page-structure.md)
- [Admin Dashboard Blueprint](documentation/admin-blueprint.md)
- [Credits & Licensing](documentation/credits.md)
- [Changelog](documentation/changelog.md)
- [Support](documentation/support.md)
