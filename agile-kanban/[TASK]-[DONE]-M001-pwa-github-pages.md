# M001: PWA + GitHub Pages Deploy

## Priority: HIGH
## Effort: Small
## Phase: M — The Infinite

## Description
Make the game installable as a Progressive Web App and deploy to GitHub Pages for public access. This is the quickest win to get the game into players' hands.

## Acceptance Criteria
- [ ] `manifest.json` with app name, icons, theme color, display: standalone
- [ ] `sw.js` service worker for offline caching (cache-first strategy)
- [ ] Register service worker in `index.html`
- [ ] App icons generated (192x192, 512x512) as canvas-drawn PNGs
- [ ] Meta tags for PWA (theme-color, apple-mobile-web-app-capable)
- [ ] GitHub Pages deployment working (Settings → Pages → main branch)
- [ ] Game playable at `https://qdev89.github.io/AppXDev.Game.Diablo/`
- [ ] Offline play works after first visit

## Technical Notes
- Generate icons programmatically via canvas (no external assets needed)
- Service worker caches all .js, .html files
- No build step needed — static files deploy directly
