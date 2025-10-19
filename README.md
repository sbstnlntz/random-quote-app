# Random Quote App

Eine kleine, eigenständige Web-App, die inspirierende Zitate anzeigt und Favoriten lokal speichert. Alles läuft mit Vanilla HTML, CSS und JavaScript – kein Build-Step nötig.

![Screenshot Platzhalter](https://placehold.co/960x540?text=Random+Quote+App)

## Features
- Lädt Zitate live von <https://api.zitat-service.de> (Deutsch/Englisch umschaltbar) und speichert bereits geladene Einträge lokal für Favoriten
- Zufällige Zitate mit sanfter Fade-in-Animation und Tageszitat auf Basis des aktuellen Datums (pro Sprache pro Tag stabil)
- Favoritenverwaltung mit LocalStorage, aufklappbarem Panel und Entfernen einzelner Einträge
- Kopier- und Teilen-Buttons (Twitter Intent) plus Tastaturkürzel `N`, `F`, `C`
- Dark-Mode-Toggle mit persistentem Zustand
- Modernes Glas-/Gradient-Design mit dezenten Animationen und Akzentfarben
- Barrierearme Umsetzung (Semantik, aria-live, sichtbare Fokus-Stile)

## Installation & Start
- Repository bzw. ZIP herunterladen.
- `index.html` im Browser öffnen (Internetverbindung nötig, um die API zu erreichen).
- Hinweis: Manche Browser blockieren `fetch` für lokale Dateien. In dem Fall kurz einen lokalen Server starten, z. B. mit `python -m http.server` oder `npx serve`.

## Projektstruktur
```
index.html
style.css
script.js
fallback-quotes.json
README.md
docs/screenshot.png (Platzhalter für eigenen Screenshot)
```

## Tastaturkürzel
- `N` – Neues Zufallszitat anzeigen
- `F` – Aktuelles Zitat als Favorit speichern oder entfernen
- `C` – Zitat und Autor in die Zwischenablage kopieren

## Datenspeicherung
- Favoriten werden in `localStorage` unter dem Schlüssel `random-quote-app:favorites` abgelegt.
- Der Dark-Mode-Zustand liegt unter `random-quote-app:theme`.
- Die beim Start geladenen Zitate bleiben nur im Arbeitsspeicher (kein Persistieren, bei API-Ausfall greift `fallback-quotes.json`).
Beides bleibt lokal im Browser und kann jederzeit gelöscht werden.

## Lizenz & Hinweise
- Code: MIT License (siehe `LICENSE`, falls hinzugefügt; andernfalls frei zur Nutzung mit Hinweis auf diese App).
- Zitate: Gemeinfreie Quellen, klassische Sprichwörter oder eigens formulierte Kurztexte. Bitte bei Veröffentlichungen prüfen, ob zusätzliche Rechtehinweise nötig sind.
- Datenquelle: Live-Abrufe über <https://www.zitat-service.de>.

## Deployment
- Optimal für GitHub Pages oder jeden anderen statischen Hoster geeignet – einfach die Dateien bereitstellen.
