CONTEXT
Existing site: drpujaprasad.in (static HTML, GitHub Pages). Domain on Hostinger. We are building appoint.drpujaprasad.in as a new Nuxt 3 + Supabase application to replace the current WhatsApp-only booking flow.

CLINIC DATA
Doctor: Dr. Puja Prasad, MBBS MS (Obs & Gyn) DMAS FMAS, 23 years, Patparganj East Delhi. 4 locations: Madhu Vihar (all days, ₹800), Pushpanjali Hospital (Wed+Sat, ₹1000), Max Hospital (Tue+Sun, ₹1000), Femmenest (Mon+Thu, ₹1000). Video consultation available (Madhu Vihar timings). Language: Hindi + English.

BOOKING UI (matches provided screenshot)
Screen 1: Tab switcher (In-Person / Video) + doctor card (photo, name, qual, location selector "+N More", fee, avg wait, ratings). Horizontal scrolling date strip (Today/Tomorrow/dates, each showing availability indicator). 3 time slots preview row + "See all slots" expansion with Morning/Afternoon/Evening groups.
Screen 2: Phone number entry (+91 prefix, 10-digit validation) → OTP (6-digit, 30s countdown, 1 resend).
Screen 3: Patient details (prefilled for returning, editable). Quick-chip reason selector.
Screen 4: Booking summary + consent + confirm.
Screen 5: Confirmation with booking ID, QR, calendar links, WhatsApp share.

PRESENTATION
Mobile: bottom sheet (slides up, 92vh, rounded top corners, drag handle). Desktop: centred modal. Not a full-page redirect.

INDIA-SPECIFIC REQUIREMENTS
SMS: MSG91 (TRAI-compliant transactional SMS, DLT registered). WhatsApp: AiSensy or Interakt (WhatsApp Business API). OTP: server-side only, rate-limit 3 per phone per 10 mins. ABHA integration: Phase 4 only, via ABDM sandbox. DPDP Act 2023 compliance: explicit consent, data minimisation, right to erasure endpoint. GST invoice generation if payment added later.

TECH STACK
Nuxt 3, Vue 3, TypeScript, Tailwind CSS 3, shadcn/vue. Supabase (Auth + PostgreSQL + Realtime + Edge Functions + pg_cron). Vercel hosting. Resend for email. No passwords — OTP only for patients. Staff login: email + password via Supabase Auth.

DOUBLE-BOOKING PREVENTION
Postgres UNIQUE constraint on (location_id, appt_date, time_slot). Temp reservation table with 5-min TTL. Supabase Realtime pushes slot status to all active sessions. pg_cron cleans expired reservations every 60 seconds.

PHASE 1 DELIVERABLE (now)
A self-contained HTML/CSS/JS widget matching the screenshot UI. Drop-in replacement for the current booking modal in index.html. Phone collection next screen. WhatsApp confirm (existing flow). No Nuxt, no Supabase needed yet.

PHASE 2+ DELIVERABLE (separate)
Full Nuxt 3 app at appoint.drpujaprasad.in with all the above backend, auth, admin dashboards, and notification system.