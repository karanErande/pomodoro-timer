# 🍅 Pomo — Pomodoro Timer

A clean, feature-rich Pomodoro Timer application built with vanilla HTML, CSS, and JavaScript. No build tools or dependencies required.

---

## 📁 Project Structure

```
pomodoro/
├── index.html          ← Main HTML file (open this in browser / VS Code)
├── css/
│   └── style.css       ← All styles and theme variables
├── js/
│   └── app.js          ← Timer logic, settings, dashboard, sound engine
└── README.md           ← You are here
```

---

## 🚀 How to Run

### Option 1 — Open directly in browser
Double-click `index.html` — it opens in your default browser immediately.

### Option 2 — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code  
   *(Extensions → search "Live Server" by Ritwick Dey → Install)*
2. Open the `pomodoro/` folder in VS Code
3. Right-click `index.html` → **"Open with Live Server"**
4. The app opens at `http://127.0.0.1:5500`

> Live Server auto-reloads on file save, great for tweaking styles.

### Option 3 — VS Code built-in Simple Browser
Press `Ctrl+Shift+P` → type **"Simple Browser: Show"** → enter the file path.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Timer modes** | Work, Short Break, Long Break — switchable anytime |
| **Circular progress ring** | Animated SVG ring with glow effect, color changes per mode |
| **Customizable durations** | Work (1–90 min), Short break (1–30 min), Long break (1–60 min) |
| **Session dots** | Visual indicator of progress through a Pomodoro cycle |
| **Alert sounds** | Bell, Chime, Digital, Soft ping — generated via Web Audio API |
| **Auto-start toggles** | Auto-begin breaks or sessions after completion |
| **Browser notifications** | Desktop alerts when a session ends (requires permission) |
| **Dashboard** | Today's count, focus time, total sessions, day streak |
| **Weekly bar chart** | Visual history of sessions over the last 7 days |
| **Session history** | Scrollable log of recent activity with timestamps |
| **Persistent storage** | All data and settings saved to `localStorage` |
| **Keyboard shortcut** | Press `Space` to play / pause the timer |
| **Responsive** | Works on mobile, tablet, and desktop |

---

## ⌨️ Keyboard Shortcut

| Key | Action |
|---|---|
| `Space` | Play / Pause timer |

---

## 🎨 Customization

All colors and sizes are controlled via CSS variables in `css/style.css`:

```css
:root {
  --clr-accent:    #7c6fff;  /* Primary accent (violet) */
  --clr-work:      #7c6fff;  /* Work mode ring color */
  --clr-break:     #3ecf8e;  /* Break mode ring color */
  --clr-longbreak: #38bdf8;  /* Long break ring color */
  --clr-bg:        #0d0d12;  /* Page background */
  ...
}
```

Change `--clr-accent` to your favorite color to retheme the whole app instantly.

---

## 🌐 External Resources (CDN)

The app loads two resources from CDN (requires internet connection):

- **Google Fonts** — Syne (display) + DM Mono (timer clock)
- **Tabler Icons** — outline icon set

To use fully offline, download these and serve them locally.

---

## 📦 No build step required

Pure HTML + CSS + JS. No npm, no webpack, no React. Just open and go.