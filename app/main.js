const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');

const store = new Store({
  defaults: {
    recentFiles: [],
    windowBounds: { width: 960, height: 700 }
  }
});

let mainWindow = null;
let fileToOpen = null;

// ── Recent files ────────────────────────────────────────────────────────────

function getRecentFiles() {
  const files = store.get('recentFiles', []);
  // Filter out files that no longer exist
  return files.filter(f => fs.existsSync(f.path));
}

function addRecentFile(filePath) {
  const recent = getRecentFiles();
  const entry = {
    path: filePath,
    name: path.basename(filePath),
    dir: path.dirname(filePath),
    openedAt: new Date().toISOString()
  };
  // Remove duplicate
  const filtered = recent.filter(f => f.path !== filePath);
  filtered.unshift(entry);
  // Keep last 20
  store.set('recentFiles', filtered.slice(0, 20));
}

function removeRecentFile(filePath) {
  const recent = getRecentFiles();
  store.set('recentFiles', recent.filter(f => f.path !== filePath));
}

function clearRecentFiles() {
  store.set('recentFiles', []);
}

// ── Window ──────────────────────────────────────────────────────────────────

function createWindow() {
  const { width, height } = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 500,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 14, y: 18 },
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.on('resize', () => {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', { width: bounds.width, height: bounds.height });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (fileToOpen) {
      openFile(fileToOpen);
      fileToOpen = null;
    }
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ── File operations ─────────────────────────────────────────────────────────

function openFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  addRecentFile(filePath);

  if (mainWindow) {
    mainWindow.webContents.send('file-opened', {
      content,
      name: fileName,
      path: filePath
    });
    mainWindow.setTitle(fileName);
  }
}

function openFileDialog() {
  const result = dialog.showOpenDialogSync(mainWindow, {
    filters: [
      { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd', 'mkdn', 'txt'] }
    ],
    properties: ['openFile']
  });

  if (result && result.length > 0) {
    openFile(result[0]);
  }
}

// ── IPC handlers ────────────────────────────────────────────────────────────

ipcMain.handle('get-recent-files', () => getRecentFiles());
ipcMain.handle('open-file-dialog', () => openFileDialog());
ipcMain.handle('open-file', (_event, filePath) => openFile(filePath));
ipcMain.handle('remove-recent-file', (_event, filePath) => {
  removeRecentFile(filePath);
  return getRecentFiles();
});
ipcMain.handle('clear-recent-files', () => {
  clearRecentFiles();
  return [];
});
ipcMain.handle('save-file', (_event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
ipcMain.handle('create-file', async () => {
  const result = dialog.showSaveDialogSync(mainWindow, {
    filters: [
      { name: 'Markdown', extensions: ['md'] }
    ],
    defaultPath: 'untitled.md'
  });
  if (result) {
    fs.writeFileSync(result, '', 'utf-8');
    openFile(result);
    return result;
  }
  return null;
});
ipcMain.handle('go-home', () => {
  if (mainWindow) {
    mainWindow.webContents.send('show-home');
    mainWindow.setTitle('Markdown Viewer');
  }
});

// ── Menu ────────────────────────────────────────────────────────────────────

function buildMenu() {
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => openFileDialog()
        },
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-home');
              mainWindow.setTitle('Markdown Viewer');
            }
          }
        },
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('create-new');
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('save-current');
          }
        },
        { type: 'separator' },
        { role: 'close' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Toggle Edit Mode',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) mainWindow.webContents.send('toggle-edit');
          }
        },
        { type: 'separator' },
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── App lifecycle ───────────────────────────────────────────────────────────

// Handle file open from OS (macOS)
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    openFile(filePath);
  } else {
    fileToOpen = filePath;
  }
});

// Handle file open from command line args (Windows/Linux)
function handleArgv(argv) {
  const file = argv.find(arg => {
    return arg.endsWith('.md') || arg.endsWith('.markdown');
  });
  if (file && fs.existsSync(file)) {
    if (mainWindow) {
      openFile(file);
    } else {
      fileToOpen = file;
    }
  }
}

app.on('second-instance', (_event, argv) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  handleArgv(argv);
});

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  handleArgv(process.argv);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
