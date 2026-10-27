# Suriyan K.S. — Portfolio

A responsive multi-page portfolio built with static HTML, CSS and vanilla JavaScript. Deployed on Vercel without a build step.

## Live versions

- **V1 / production:** https://kssuriyan-portfolio.vercel.app/
- **V2 / Claude preview:** https://kssuriyan-portfolio-git-claude-v2-suriyan-24s-projects.vercel.app/

Keep `main` as the production baseline. The `claude-v2` branch is separate for side-by-side review; do not merge it into `main` unless deliberately replacing V1.

## Pages

- `index.html` — homepage, interactive hero and featured sections
- `projects.html` — project visuals, live search, filters and contextual project details
- `experience.html` — internship timeline, campus leadership and searchable filters
- `posts.html` — curated LinkedIn themes with search and category filters
- `certifications.html` — category-organised learning record with search and filters
- `404.html` — themed not-found page

## Interaction system

- Theme-matched glowing cursor and lightweight fading trail (fine pointer only)
- Pointer-reactive cards, subtle 3D tilt, and magnetic primary actions
- Command palette: **Ctrl/⌘ + K**
- Project and content search/filter controls
- Contextual detail dialogs for cards
- Hero particle canvas and interactive focus chips
- Reading progress, copy-email feedback and back-to-top control
- Reduced-motion and touch-device fallbacks

All interactions are implemented in `assets/main.js` and styled in `assets/style.css`. There are no animation-library dependencies or build tools required; the page uses CSS, Canvas and native browser APIs.

## Content integrity

- A live-demo link is shown only for a deployed user-facing application we could identify.
- API health-check endpoints and generic/template demos should not be presented as project demos.
- Concept and hardware projects are labelled accordingly when no public demo/repository is available.
- LinkedIn cards link to the original post when a direct URL is available; otherwise they lead to profile activity.
- Certification verification links should be added only from their actual credential pages.
- The portrait stored at `assets/suriyan-profile.jpg` is the existing profile asset; replace it with a higher-resolution original when available.

## Design research references

The interaction approach was informed by public portfolio examples; no source code was copied. The MIT-licensed template below was used as an open-source pattern reference, while the other public repositories served as visual research:

- [Naresh-Khatri/3d-portfolio](https://github.com/Naresh-Khatri/3d-portfolio) — **MIT license**; interactive skill-keyboard, custom cursor, themes and motion ideas.
- [Jonathan-Jesni/portfolio-ver-2](https://github.com/Jonathan-Jesni/portfolio-ver-2) — scroll-driven storytelling and accessible custom-cursor patterns.
- [KaranChandekar/interactive-3d-portfolio](https://github.com/KaranChandekar/interactive-3d-portfolio) — magnetic cursor, pointer-reactive project cards and project detail-page patterns.

## Deploy on Vercel

Import this repository with the root directory set to `./`. No build command or environment variables are needed for the static portfolio.
