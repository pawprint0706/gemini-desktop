const { app, BrowserWindow, Menu, Tray, nativeImage, shell } = require('electron');
const path = require('path');

const GEMINI_URL = 'https://gemini.google.com/app';
const allowedHosts = new Set(['gemini.google.com', 'accounts.google.com', 'myaccount.google.com']);

let mainWindow;
let tray;
let isQuitting = false;
const hasSingleInstanceLock = app.requestSingleInstanceLock();

const getIconPath = () => path.join(__dirname, 'Gemini.ico');

function showWindow() {
  if (!mainWindow) {
    return;
  }
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  if (!mainWindow.isVisible()) {
    mainWindow.show();
  }
  mainWindow.focus();
}

function createTray() {
  const icon = nativeImage.createFromPath(getIconPath());
  tray = new Tray(icon);
  tray.setToolTip('Gemini Desktop');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Gemini',
      click: () => showWindow()
    },
    {
      label: 'Reload',
      click: () => mainWindow?.reload()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => showWindow());
}

function isAllowedUrl(url) {
  try {
    const { host } = new URL(url);
    return allowedHosts.has(host);
  } catch {
    return false;
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Gemini Desktop',
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#101828',
    autoHideMenuBar: true,
    show: false,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(GEMINI_URL);

  mainWindow.on('ready-to-show', () => {
    showWindow();
  });

  mainWindow.on('close', (event) => {
    if (isQuitting) {
      return;
    }
    event.preventDefault();
    mainWindow.hide();
  });

  const handleExternalLinks = (event, url) => {
    if (!isAllowedUrl(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  };

  mainWindow.webContents.on('will-navigate', handleExternalLinks);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!isAllowedUrl(url)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      showWindow();
    } else {
      createMainWindow();
    }
  });

  app.whenReady().then(() => {
    app.setAppUserModelId('GeminiDesktop');
    createMainWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      } else {
        showWindow();
      }
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
