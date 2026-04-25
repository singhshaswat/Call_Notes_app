# 📞 Call Notes

A clean, minimal browser-based app to save and browse call notes — no backend, no dependencies beyond a CDN font and Font Awesome.

---

## 📁 Project Structure

```
call-notes/
├── index.html       # App markup and structure
├── style.css        # All styling and animations
└── script.js        # Logic: carousel, form, validation, localStorage
```

---

## ✨ Features

- **Stacked card carousel** — cards sit behind each other like a physical deck; bottom edges of the 2nd and 3rd cards are always visible
- **Circular navigation** — up/down SVG arrow buttons cycle through all cards in a loop; going up from the first card wraps to the last
- **Smooth transitions** — cards slide up or down with fade animations when navigating
- **Add new call note** — click the `+` button to open a modal form
- **Form validation** — all fields are trimmed and validated before saving:
  - Name: letters only, minimum 2 characters
  - Home town: required
  - Purpose: required
  - Category: one of Emergency / Important / Urgent / No Rush (radio, required)
- **Most recent first** — newly created notes always appear at the front of the stack
- **Persistent storage** — notes are saved to `localStorage` and survive page refreshes
- **Color theme switcher** — four dot buttons on the right change the accent color across the whole UI
- **Avatar support** — paste an image URL to show a photo; falls back to initials if the URL fails or is left empty
- **Seed data** — 3 pre-loaded example cards so the app never looks empty on first load

---

## 🚀 Getting Started

No build step or server needed. Just open the file in any browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve locally (optional, avoids any CORS quirks)
npx serve .
```

---

## 🗂 Card Categories & Colors

| Category  | Color  |
|-----------|--------|
| Emergency | 🔴 Red     |
| Important | 🟣 Purple  |
| Urgent    | 🟠 Orange  |
| No Rush   | 🟢 Teal    |

---

## 💾 Data Format

Each note stored in `localStorage` under the key `callNotes` follows this shape:

```json
{
  "id": 1714123456789,
  "name": "Fatima Uma",
  "town": "Singapore",
  "purpose": "Follow up on booking confirmation",
  "category": "Important",
  "img": "https://example.com/photo.jpg",
  "bookings": 3,
  "createdAt": 1714123456789
}
```

---

## 🛠 Built With

- Vanilla HTML, CSS, JavaScript — no frameworks
- [DM Sans + Syne](https://fonts.google.com/) via Google Fonts
- SVG icons (arrows, phone) — inline, no library needed
- `localStorage` for persistence
