# Pred Flash Tracker

A lightweight desktop overlay for **Predecessor** that tracks enemy flash (blink) cooldowns. Works safely alongside Easy Anti-Cheat — no injection, no memory reading, just a transparent always-on-top window.

![Electron](https://img.shields.io/badge/Electron-28-blue)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Mac%20%7C%20Linux-green)
![EAC Safe](https://img.shields.io/badge/EAC-Safe-brightgreen)

---

## Screenshots

### Hero Select
![Hero Select Screen](screenshots/setup.png)

### In-Game Overlay
![In-Game Overlay](screenshots/overlay.png)

## How It Works

The app creates a **borderless, transparent, always-on-top window** that sits above your game. It does NOT hook into the game process, read memory, or interact with Predecessor in any way. It's the same approach used by Discord overlay, OBS, and similar tools.

### Features
- Select 5 enemy heroes from the full Predecessor roster
- Click a hero to start a **5-minute flash cooldown timer**
- Visual ring timer with color-coded states:
  - **Green** = Flash ready
  - **Red** = On cooldown (with countdown)
  - **Yellow** = Almost ready (last 30 seconds, pulsing)
- Right-click to cancel a timer if you made a mistake
- Toggle overlay visibility with **F2**
- Toggle click-through mode with **F3** (so you can click through the overlay while gaming)

---

## Setup (Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- npm (comes with Node.js)

### Install & Run

```bash
# Clone or download this folder
cd predecessor-flash-tracker

# Install dependencies
npm install

# Download hero portrait images (one-time setup)
node scripts/download-portraits.js

# Run the app
npm start
```

The portrait download script fetches all ~50 hero images from statz.gg (official Predecessor hero assets) and saves them to `src/assets/heroes/`. If any fail, the app gracefully shows initials instead.

---

## How to Use

1. **Launch the app** — a setup window appears
2. **Search and select 5 enemy heroes** from the grid
3. Click **"Start Tracking"** — the overlay appears at the top-center of your screen
4. **Open Predecessor** in fullscreen borderless (or windowed) mode
5. When you see an enemy burn flash:
   - Press **F3** to make the overlay clickable
   - Click the hero's portrait to start the 5-min timer
   - Press **F3** again to go back to click-through mode
6. The timer counts down and the ring animates. When it turns yellow and pulses, flash is almost back up

### Hotkeys
| Key | Action |
|-----|--------|
| **F2** | Show / Hide the overlay |
| **F3** | Toggle click-through mode (so you can click the overlay) |

### Important: Game Display Mode
The overlay works best with **Fullscreen Borderless** (Windowed) mode in Predecessor. True exclusive fullscreen may hide the overlay on some systems.

---

## Building for Distribution

To package the app as a downloadable installer:

```bash
# Windows (.exe installer)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage)
npm run build:linux

# All platforms
npm run build
```

The output will be in the `dist/` folder.

### Adding a Custom Icon
Place your icon files in the `build/` folder:
- `icon.ico` for Windows (256x256)
- `icon.icns` for macOS
- `icon.png` for Linux (512x512)

---

## EAC Safety

This app is **safe to use with Easy Anti-Cheat** because:

1. It does **NOT** inject code into the game process
2. It does **NOT** read game memory
3. It does **NOT** hook into DirectX/Vulkan rendering
4. It does **NOT** use any game APIs
5. It's simply a **normal desktop window** displayed on top of the game

This is the same technique used by Discord, OBS, Medal.tv, and other legitimate overlay apps. The app is purely a manual timer — you see an enemy use flash, you click the button yourself.

---

## Project Structure

```
predecessor-flash-tracker/
├── package.json          # Dependencies & build config
├── scripts/
│   └── download-portraits.js  # Downloads hero images from statz.gg
├── src/
│   ├── main.js           # Electron main process (window management, hotkeys)
│   ├── heroes-data.js    # Shared hero roster data (names, roles, image filenames)
│   ├── assets/
│   │   └── heroes/       # Hero portrait images (created by download script)
│   └── renderer/
│       ├── setup.html     # Hero selection screen
│       └── overlay.html   # In-game overlay with timers
└── build/                # Icons for packaging (add your own)
```

---

## Customization

### Change Flash Cooldown
In `src/renderer/overlay.html`, find this line and change the value:
```javascript
const FLASH_COOLDOWN = 300; // 5 minutes in seconds
```

### Change Hotkeys
In `src/main.js`, find the `globalShortcut.register` calls and change the key bindings.

### Reposition the Overlay
In `src/main.js`, modify the `x` and `y` values in `createOverlayWindow()`.

---

## License

MIT — Use it, modify it, share it. Happy hunting on Omeda!
