# Wavecast | Studio Dashboard
 
A responsive, single-page frontend for a fictional podcast-analytics SaaS product, built with **plain HTML, CSS and JavaScript**. No frameworks, no build tools, no libraries.
 
Built for **Project 1: Responsive Frontend Interface** (DecodeLabs Full Stack Internship).
 
---
 
## Live preview
 
Open `index.html` directly in any modern browser. No install or server required.
 
---
 
## What this is
 
Wavecast is a mock studio dashboard for a podcast host named 'The Night Shift'. It's a single HTML page; organized into distinct sections (Overview, Episodes, Audience, Revenue, Settings) that behave like dashboard 'views' via anchor links and active-state highlighting.
 
The goal of the project was to prove out responsive, semantic, accessible front-end fundamentals before moving on to backend integration:
 
- Semantic HTML5 landmarks
- CSS Grid (page layout) + Flexbox (components)
- Mobile-first responsive design with real breakpoints
- Vanilla JavaScript for state and interactivity (no data fetching — everything is local demo data)
---
 
## Features
 
- **Responsive layout** — persistent sidebar navigation on desktop; on mobile (≤768px) it becomes a slide-in drawer plus a bottom tab bar, so core navigation stays reachable with a thumb.
- **Custom waveform chart** — a bar chart built from plain `<div>`s (no charting library), with hover/focus tooltips showing the exact value per day.
- **Interactive date range** — switching between 7D / 30D / 90D re-renders the stat cards, the chart, and the top-episodes list from local demo data.
- **Show switcher** — a dropdown in the sidebar for swapping between shows (cosmetic demo only).
- **Light/dark theme toggle** — swaps CSS custom properties; state lives in memory only (not persisted), by design.
- **Keyboard and screen-reader friendly** — visible focus states, chart bars are focusable and announce their value, `aria-expanded`/`aria-label` used on interactive controls, `prefers-reduced-motion` respected.
---
 
## Tech & structure
 
```
wavecast-dashboard/
├── index.html   # Semantic markup: sidebar, topbar, hero, stat cards, chart, lists
├── styles.css   # Design tokens, layout, responsive breakpoints, light/dark theme
├── app.js       # Demo data, rendering, and all interactivity
└── README.md
```
 
### Responsive breakpoints
 
- **Desktop:** ≥1025px — full sidebar + two-column panel grid
- **Tablet:** ≤1024px — stat cards drop to 2 columns, panels stack to 1 column
- **Mobile:** ≤768px — sidebar becomes an off-canvas drawer, top bar is replaced by a compact mobile bar, bottom tab bar appears
- **Small phones:** ≤460px — stat grid stays 2-up, chart height reduces
---
 
## Notes on the data
 
All numbers (listens, subscribers, revenue, episode plays, activity feed) are static demo data defined at the top of `app.js`. There is no backend, API or persistence layer. This project is scoped to the front-end interface only, per the Project 1 brief. Swapping in real data later just means replacing the `DATA` and `ACTIVITY` objects with API responses.
