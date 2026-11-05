const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hidden',
    title: 'Chromium Browser Pro',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    show: false,
    backgroundColor: '#0f172a'
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('navigate', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    win.webContents.loadURL(url).catch(() => {});
  }
});

ipcMain.on('go-back', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.goBack();
});

ipcMain.on('go-forward', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.goForward();
});

ipcMain.on('reload', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.reload();
});

ipcMain.on('new-tab', () => {
  if (mainWindow) mainWindow.webContents.send('add-tab');
});

ipcMain.on('close-tab', (event, tabId) => {
  if (mainWindow) mainWindow.webContents.send('remove-tab', tabId);
});

ipcMain.on('switch-tab', (event, tabId) => {
  if (mainWindow) mainWindow.webContents.send('active-tab', tabId);
});

ipcMain.on('open-devtools', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.webContents.openDevTools();
});

ipcMain.on('toggle-theme', (event) => {
  if (mainWindow) mainWindow.webContents.send('theme-toggled');
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('save-dialog', async (event, defaultPath) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showSaveDialog(win, { defaultPath });
  return result;
});

ipcMain.on('minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.on('close-app', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});
