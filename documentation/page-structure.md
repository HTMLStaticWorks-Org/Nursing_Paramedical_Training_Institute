# Page Structure & Unique Sections Architecture

Every page in LifeBridge Institute serves a distinct informational goal with **zero repeated content sections** across pages.

## Public Website (`pages/`)
| File | Role | Unique Sections |
|---|---|---|
| `index.html` | Home 1 (Editorial Split) | Split 3-photo hero with word-swap & ECG, Accreditation strip, Placements dark spotlight + marquee, 4 Program tilt cards, Sticky "A Day as a Student" timeline, Why Choose Us bento grid, Alumni video cards, 4-step heartbeat admission process, Compact notices, Campus visit enquiry |
| `home-2.html` | Home 2 (Cinematic Finder) | Full-bleed 3-slide hero with Course Finder glass bar, Overlapping Quick Facts ribbon, 7-role interactive Career Path tabs, 5-pin interactive ICU Simulation Lab hotspot viewer, 4-column Faculty coverflow, Scholarships comparison, Student Voices masonry, Live Intake Countdown, Admissions FAQ accordion |
| `about.html` | Institute Heritage | Campus exterior banner, Vision & Mission, 2008–2026 Milestones timeline, Principal Dr. Nandini Rao message, Accreditation registry cards, 4 Core Clinical Values, Leadership Team, Reception visit strip |
| `courses.html` | 12-Program Catalog | Category/Search/Duration/Sort filter bar with skeleton shimmer, 12 unique course tilt cards, Side-by-side Course Comparison Tool, Responsive Eligibility & Fee table, Intake Calendar |
| `course-details.html` | B.Sc. Nursing Deep Dive | Program hero + print syllabus button, Overview KPIs, 8-Semester curriculum accordion, Supervised Clinical Rotation matrix, Eligibility & Fee breakdown table, Career outcomes, Related icon cards, Sticky enquiry & PDF sidebar |
| `facilities.html` | 12 Campus Facilities | 6 Clinical/Paramedical labs showcase, Interactive 8.5-acre Campus Map with zone filters, 5 Campus/Transport/Wellness facilities, Interactive 3-tab Hostel & Mess tour, Clinical Safety & Biosafety compliance |
| `placements.html` | Placement Analytics | 6-Year placement bar chart & sector donut chart, Multi-year placement data table, 4-stage placement roadmap, 4 top-placed graduate profiles, Categorized hospital & lab partners, Overseas NCLEX/OET/IELTS cell, Recruiter desk |
| `instructors.html` | Faculty Directory | Department filter bar, 8 Full-Time Faculty portrait cards, 3 Visiting Hospital Clinicians, 1:15 Guardian Mentorship model |
| `admissions.html` | Online Application | Counseling header, Interactive Eligibility Checker calculator, 5-step Multi-Step Application Form with Save Draft & Review, Mandatory Documents Checklist, Installment Schedule |
| `resources.html` | Academic Downloads | Live-searchable & filterable Syllabus/Timetable/Question Paper/Logbook table, E-Library database cards, Anti-Ragging & Grievance Policies |
| `gallery.html` | Campus Gallery | 6-category filterable 12-photo Masonry Grid + accessible Keyboard Lightbox |
| `blog.html` & `blog-details.html` | Clinical Journal | Featured NCLEX playbook, category filters, 5 career/OSCE posts, pagination; Details view with sticky TOC, SBAR clinical article, inline handover photo, author bio, copy-link share |
| `contact.html` | Contact & Visit | Helpline & department cards, Validated Contact form, 45-min Campus Tour Scheduler, GPS / Google Maps placeholder (FAQ-free) |
| `login.html`, `sign-up.html`, `forgot-password.html` | Auth Portal | Split-screen portal with Role Switcher, Password show/hide, OTP login mode, rotating clinical quotes |
| `404.html` & `coming-soon.html` | Utility | Animated Flatline ECG 404 recovery; Full-bleed Innovation Wing 2027 countdown & Mailchimp email capture |

## Student LMS Dashboard (`pages/dashboard/`)
10 dedicated app-shell views: `overview.html`, `attendance.html`, `assignments.html`, `exam-results.html`, `timetable.html`, `clinical-postings.html`, `fees.html`, `messages.html`, `profile.html`, `settings.html`.

## Admin Console Blueprint (`pages/admin/`)
Light starter scaffold at [`pages/admin/index.html`](../pages/admin/index.html) — see [`admin-blueprint.md`](admin-blueprint.md).
