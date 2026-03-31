const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let overlayWindow = null;
let setupWindow = null;
let isDragMode = false;

function isAlive(win) {
  return win && !win.isDestroyed();
}

// ===== SETTINGS PERSISTENCE =====
const settingsPath = path.join(app.getPath('userData'), 'overlay-settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
  } catch {}
  return {};
}

function saveSettings(data) {
  try {
    const existing = loadSettings();
    const merged = { ...existing, ...data };
    fs.writeFileSync(settingsPath, JSON.stringify(merged, null, 2));
  } catch {}
}

function saveOverlayBounds() {
  if (!isAlive(overlayWindow)) return;
  const [x, y] = overlayWindow.getPosition();
  const [width, height] = overlayWindow.getSize();
  saveSettings({ overlay: { x, y, width, height } });
}

function createSetupWindow() {
  setupWindow = new BrowserWindow({
    width: 900,
    height: 700,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../build/icon.png'),
  });

  setupWindow.loadFile(path.join(__dirname, 'renderer/setup.html'));
  setupWindow.setAlwaysOnTop(false);
  setupWindow.on('closed', () => { setupWindow = null; });
}

function createOverlayWindow() {
  const { width: screenW } = screen.getPrimaryDisplay().workAreaSize;
  const settings = loadSettings();
  const saved = settings.overlay;

  // Use saved position/size, or defaults
  const winWidth = saved?.width || 460;
  const winHeight = saved?.height || 95;
  const winX = saved?.x ?? Math.round(screenW / 2 - 230);
  const winY = saved?.y ?? 10;

  overlayWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: winX,
    y: winY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    hasShadow: false,
    minWidth: 120,
    minHeight: 80,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.loadFile(path.join(__dirname, 'renderer/overlay.html'));
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true);
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  isDragMode = false;
  overlayWindow.on('closed', () => { overlayWindow = null; });

  // Save position when overlay is about to close
  overlayWindow.on('close', () => {
    saveOverlayBounds();
  });

  // Forward resize events to renderer for layout flip
  overlayWindow.on('resize', () => {
    if (!isAlive(overlayWindow)) return;
    const [w, h] = overlayWindow.getSize();
    overlayWindow.webContents.send('window-resized', { width: w, height: h });
  });
}

function enterDragMode() {
  if (!isAlive(overlayWindow)) return;
  isDragMode = true;
  overlayWindow.setIgnoreMouseEvents(false);
  overlayWindow.setResizable(true);
  overlayWindow.setFocusable(true);
  overlayWindow.focus();
  overlayWindow.webContents.send('drag-mode', true);
}

function exitDragMode() {
  if (!isAlive(overlayWindow)) return;
  isDragMode = false;
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.setResizable(false);
  overlayWindow.webContents.send('drag-mode', false);
  // Save position and size after user finishes repositioning
  saveOverlayBounds();
}

app.whenReady().then(() => {
  createSetupWindow();

  globalShortcut.register('F2', () => {
    if (!isAlive(overlayWindow)) return;
    overlayWindow.isVisible() ? overlayWindow.hide() : overlayWindow.show();
  });

  globalShortcut.register('F3', () => {
    if (!isAlive(overlayWindow)) return;
    isDragMode ? exitDragMode() : enterDragMode();
  });

  globalShortcut.register('F4', () => {
    if (isAlive(overlayWindow)) overlayWindow.close();
    if (isAlive(setupWindow)) {
      setupWindow.show();
    } else {
      createSetupWindow();
    }
  });
});

// ===== MINIMIZE BUTTON (setup window) =====
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.minimize();
});

// ===== HOVER CLICK-THROUGH =====
ipcMain.on('set-clickable', () => {
  if (!isAlive(overlayWindow) || isDragMode) return;
  overlayWindow.setIgnoreMouseEvents(false);
});

ipcMain.on('set-click-through', () => {
  if (!isAlive(overlayWindow) || isDragMode) return;
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
});

// ===== OVERLAY LIFECYCLE =====
ipcMain.on('start-overlay', (event, heroes) => {
  if (isAlive(setupWindow)) setupWindow.hide();
  if (!isAlive(overlayWindow)) createOverlayWindow();
  overlayWindow.webContents.once('did-finish-load', () => {
    if (!isAlive(overlayWindow)) return;
    overlayWindow.webContents.send('load-heroes', heroes);
    overlayWindow.webContents.send('drag-mode', false);
    // Send initial size for layout calculation
    const [w, h] = overlayWindow.getSize();
    overlayWindow.webContents.send('window-resized', { width: w, height: h });
  });
  overlayWindow.show();
});

ipcMain.on('reset-overlay', () => {
  if (isAlive(overlayWindow)) overlayWindow.close();
  if (isAlive(setupWindow)) {
    setupWindow.show();
  } else {
    createSetupWindow();
  }
});

// ===== CLOSE APP — fully kill the process =====
ipcMain.on('close-app', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

// Force-kill if anything lingers
app.on('quit', () => {
  process.exit(0);
});
