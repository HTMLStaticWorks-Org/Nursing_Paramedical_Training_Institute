# Admin Dashboard Starter Blueprint

A lightweight placeholder Admin Console is provided at [`pages/admin/index.html`](../pages/admin/index.html) sharing the same collapsible sidebar, Dark/Light mode, RTL support, and 3D tilt KPI cards as the Student LMS.

## Included Starter Modules
1. **Overview (`#overview`)** — Enrolment counts, 2026–27 active applications, scheduled campus tours, INC audit readiness.
2. **Users & Cohorts (`#users`)** — Student roster, faculty guardian assignments, role-based access hooks.
3. **Courses & Notices (`#content`)** — Manage 12 accredited programs, fee tables, circular uploads, and exam timetables.
4. **Campus Bookings (`#bookings`)** — Guided simulation lab tour slots synced from `pages/contact.html#visit`.
5. **Enquiry Inbox (`#messages`)** — Admission leads from Home 1, Course Details, and Prospectus modal.
6. **INC Reports (`#reports`)** — Attendance shortage audit exports (80% threshold) and placement statistics CSV export.
7. **Settings (`#settings`)** — Academic session dates, scholarship rules, and payment gateway API credentials.

## Backend Integration Notes
Connect the starter console to any REST or GraphQL backend (Laravel, Django, Node/Express, Supabase, or Firebase) by binding authenticated fetch handlers in a dedicated `assets/js/admin.js` module.
