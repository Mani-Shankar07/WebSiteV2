# Dr. Puja Prasad - Clinic Website (v3)

A responsive, SEO-optimized, and accessible medical practice website for [drpujaprasad.in](https://drpujaprasad.in). This repository contains the source code for the front-end architecture, modular booking system, and web infrastructure.

## Key Features

* **SEO & Accessibility First:** Semantic HTML with proper `<main>` tags, complete Schema.org JSON-LD (Physician entity), canonical URLs, Twitter cards, and `aria-label` implementations for screen readers.
* **Modular JavaScript Architecture:** Extracted and isolated logic into `main.js` (UI/routing), `booking.js` (appointments), and `chat.js` (interaction) for maintainability.
* **Dynamic Booking System:** 
  * Multi-step modal with day-aware slots and same-day past-time filtering.
  * Local storage deduplication (keyed by date + location + time).
  * Dual integration: Calendly scheduling and a custom form via Formspree (with a WhatsApp fallback).
* **Hash Routing:** Deep-linkable sections (e.g., `#about`, `#services`) enabling native browser back/forward navigation.
* **Security & Infrastructure:** Pre-configured `.htaccess` with security headers (X-Frame-Options, HSTS, CSP), along with `robots.txt` and `sitemap.xml` for crawler management.

## 📂 Project Structure

```text
/
├── index.html        # Main entry point with corrected structural HTML & metadata
├── css/              # Stylesheets (style.css)
├── images/           # Assets and placeholders (profile.jpg)
├── js/
│   ├── main.js       # Core UI, hash routing, modal helpers, and scroll listeners
│   ├── booking.js    # Booking logic, Formspree integration, WhatsApp fallback
│   └── chat.js       # Chat widget logic and availability timings
├── .htaccess         # Security headers and HTTPS redirects (for Hostinger)
├── CNAME             # Custom domain configuration for GitHub Pages
├── robots.txt        # Web crawler directives
└── sitemap.xml       # Priority-based sitemap for Google Search Console
