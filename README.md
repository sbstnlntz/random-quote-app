# Random Quote App

A small, standalone web app that displays inspiring quotes and lets you save your favorites locally.
Built entirely with Vanilla HTML, CSS, and JavaScript — no build step required.

## Features
- Fetches quotes live from https://api.zitat-service.de (switchable between English and German)
- Caches already loaded quotes locally for offline favorites
- Random quote generator with smooth fade-in animation
- Daily quote based on the current date (stable per day and language)
- Favorite management with LocalStorage, collapsible panel, and single-entry removal
- Copy and Share buttons (Twitter intent) + keyboard shortcuts N, F, C
- Dark-mode toggle with persistent state
- Modern glass/gradient design with subtle animations and accent colors
- Accessible markup (semantic HTML, aria-live, visible focus styles)

## Installation & Start
1. Download or clone the repository (or ZIP).
2. Open index.html in your browser.
   - An internet connection is required for the live quote API.
   - Some browsers block fetch() for local files.
     → In that case, quickly start a local server:

python -m http.server
# or
npx serve

## Project Structure
```
index.html
style.css
script.js
fallback-quotes.json
README.md
docs/screenshot.png (Platzhalter für eigenen Screenshot)
```

## Keyboard Shortcuts
- `N` – Show a new random quote
- `F` – Add or remove the current quote from favorites
- `C` – Copy quote and author to clipboard

## Data Storage
- Favorites are stored in localStorage under
  random-quote-app:favorites
- Dark-mode state is stored under
  random-quote-app:theme
- Quotes fetched at startup are stored in memory only.
  On API failure, the app falls back to fallback-quotes.json.

All data stays local in your browser and can be deleted at any time.

## License & Notes
- Code: MIT License (see LICENSE if available; otherwise free to use with credit).
- Quotes: Public domain sources, traditional sayings, or original short texts.
  Please verify any additional rights before publishing.
- Data source: Live requests via https://www.zitat-service.de

## Deployment
- Perfect for GitHub Pages or any other static host —
  just upload the files, and you’re done.
