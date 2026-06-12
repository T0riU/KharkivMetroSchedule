# Kharkiv Metro Schedule App

Kharkiv metro schedules, route planning and map.
---

## Features

- **Live train times** — next departures for both directions from any station, updating every second
- **Route planner** — fastest path between any two stations, including transfers, with travel time and arrival predictions
- **Interactive SVG map** — pan and zoom with mouse or touch; tap any station to open its panel
- **Weekday / weekend schedules** — automatically switches based on Kyiv time
- **Persistent state** — last selected station and settings saved in cookies
- **Settings** — customize per-line travel intervals and transfer walking time

---

## Project Structure

```
├── index.html
├── styles/
│   └── main.css
├── js/
│   ├── app.js              # Entry point
│   ├── config.js           # Line/station definitions, settings, cookie helpers
│   ├── map.js              # SVG map loading, pan/zoom, tap handling
│   ├── panel.js            # Bottom sheet: times, route result, drag gesture
│   ├── route.js            # Route calculation (single-line + transfer)
│   ├── schedule.js         # Schedule lookup, time helpers, Kyiv clock
│   ├── schedule-loader.js  # Fetches scraped_data.json at startup
│   └── state.js            # Shared mutable state
├── img/
│   ├── map_comp.svg
│   ├── map_lines.svg
│   └── map_points.svg
├── data/
│   ├── scraped_data.json         # Primary schedule data
│   └── scraped_data_backup.json  # Fallback
└── scrapper.py                   # Script that scrapes schedule data from metro.kharkiv.ua
```

---

## Metro Lines

| Line | Color | Stations | Terminus A | Terminus B |
|------|-------|----------|------------|------------|
| Kholodnohirsko-Zavodska (Red) | `#bf3f52` | 13 | Kholodna Hora | Industrialna |
| Saltivska (Blue) | `#547dcd` | 8 | Saltivska | Istorychnyi Muzei |
| Oleksiivska (Green) | `#1d9a2c` | 9 | Peremoha | Metrobudivnykiv |

### Transfers

| Blue ↔ Green | Universytet ↔ Derzhprom |
|---|---|
| **Blue ↔ Red** | Istorychnyi Muzei ↔ Tsentralnyi Rynok |
| **Green ↔ Red** | Arkhitektora Beketova ↔ Sportyvna |

---

## Architecture

- **No framework, no bundler** — pure ES modules
- **State** centralized in `state.js`, mutated only via exported setters
- **Schedule lookup** resolves weekday/weekend and line keys at runtime; time arithmetic in minutes since midnight
- **Route planning** iterates all valid transfer combinations, picks minimum travel time
- **Pan/zoom** via CSS `transform: translate() scale()`, works on both desktop and touch
- **Bottom sheet** supports drag-to-collapse/expand with flick detection

---

## Settings

Accessible via the ⚙ button. Persisted in a cookie (`metro_settings`).

| Setting | Default |
|---------|---------|
| Blue line interval | 120 s |
| Green line interval | 120 s |
| Red line interval | 120 s |
| Transfer time | 180 s |

---

## License
Copyright (c) 2026 T0riU

Licensed under the MIT License.

Schedule data sourced from https://www.metro.kharkiv.ua