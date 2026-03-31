const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

let overlayWindow = null;
let setupWindow = null;
let isClickThrough = true;

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
}

function createOverlayWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 560,
    height: 110,
    x: Math.round(width / 2 - 280),
    y: 10,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  overlayWindow.loadFile(path.join(__dirname, 'renderer/overlay.html'));
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  overlayWindow.setAlwaysOnTop(true, 'screen-saver');
  overlayWindow.setVisibleOnAllWorkspaces(true);

  isClickThrough = true;
}

app.whenReady().then(() => {
  createSetupWindow();

  // Toggle overlay visibility
  globalShortcut.register('F2', () => {
    if (overlayWindow) {
      if (overlayWindow.isVisible()) {
        overlayWindow.hide();
      } else {
        overlayWindow.show();
      }
    }
  });

  // Reset — close overlay and go back to hero select
  globalShortcut.register('F4', () => {
    if (overlayWindow) {
      overlayWindow.close();
      overlayWindow = null;
    }
    if (setupWindow) {
      setupWindow.show();
    } else {
      createSetupWindow();
    }
  });

  // Toggle click-through (so you can interact with the overlay)
  globalShortcut.register('F3', () => {
    if (overlayWindow) {
      isClickThrough = !isClickThrough;
      if (isClickThrough) {
        overlayWindow.setIgnoreMouseEvents(true, { forward: true });
        overlayWindow.setFocusable(false);
        overlayWindow.webContents.send('click-through-state', true);
      } else {
        overlayWindow.setIgnoreMouseEvents(false);
        overlayWindow.setFocusable(true);
        overlayWindow.focus();
        overlayWindow.webContents.send('click-through-state', false);
      }
    }
  });
});

// Receive hero selection from setup and open overlay
ipcMain.on('start-overlay', (event, heroes) => {
  if (setupWindow) {
    setupWindow.hide();
  }
  if (!overlayWindow) {
    createOverlayWindow();
  }
  // Wait for overlay to load then send hero data
  overlayWindow.webContents.once('did-finish-load', () => {
    overlayWindow.webContents.send('load-heroes', heroes);
    overlayWindow.webContents.send('click-through-state', isClickThrough);
  });
  overlayWindow.show();
});

// Reset - go back to setup
ipcMain.on('reset-overlay', () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
  if (setupWindow) {
    setupWindow.show();
  } else {
    createSetupWindow();
  }
});

// Move overlay window (drag from renderer)
ipcMain.on('overlay-drag', (event, { deltaX, deltaY }) => {
  if (overlayWindow) {
    const [x, y] = overlayWindow.getPosition();
    overlayWindow.setPosition(x + deltaX, y + deltaY);
  }
});

ipcMain.on('close-app', () => {
  app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
