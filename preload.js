const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
  navigate: (url) => ipcRenderer.send('navigate', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  newTab: () => ipcRenderer.send('new-tab'),
  closeTab: (id) => ipcRenderer.send('close-tab', id),
  switchTab: (id) => ipcRenderer.send('switch-tab', id),
  openDevTools: () => ipcRenderer.send('open-devtools'),
  toggleTheme: () => ipcRenderer.send('toggle-theme'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  closeApp: () => ipcRenderer.send('close-app'),
  saveDialog: (defaultPath) => ipcRenderer.invoke('save-dialog', defaultPath),
  on: (channel, cb) => ipcRenderer.on(channel, cb),
  off: (channel, cb) => ipcRenderer.removeListener(channel, cb)
});
