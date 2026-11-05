const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('browserAPI', {
  navigate: (url) => ipcRenderer.send('navigate', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  newWindow: () => ipcRenderer.send('new-window'),
  openDevTools: () => ipcRenderer.send('open-devtools'),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  onNavigation: (cb) => ipcRenderer.on('navigate-event', cb),
  saveDialog: (defaultPath) => ipcRenderer.invoke('save-dialog', defaultPath)
});
