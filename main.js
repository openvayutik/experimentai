const { app, BrowserWindow, ipcMain, session, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;
const windows = [];

function createWindow(file = 'index.html') {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    show: false
  });

  win.loadFile(file);

  win.once('ready-to-show', () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  win.on('closed', () => {
    const idx = windows.indexOf(win);
    if (idx !== -1) windows.splice(idx, 1);
  });

  windows.push(win);
  return win;
}

app.whenReady().then(() => {
  mainWindow = createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC: navigate
ipcMain.on('navigate', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && win.webContents) {
    win.webContents.loadURL(url).catch(() => {});
  }
});

// IPC: go back
ipcMain.on('go-back', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.goBack();
});

// IPC: go forward
ipcMain.on('go-forward', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.goForward();
});

// IPC: reload
ipcMain.on('reload', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.reload();
});

// IPC: new window
ipcMain.on('new-window', () => {
  createWindow();
});

// IPC: open devtools
ipcMain.on('open-devtools', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.openDevTools();
});

// IPC: external link
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

// IPC: save dialog
ipcMain.handle('save-dialog', async (event, defaultPath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showSaveDialog(win, { defaultPath });
  return result;
});
