const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getRecentFiles: () => ipcRenderer.invoke('get-recent-files'),
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  removeRecentFile: (filePath) => ipcRenderer.invoke('remove-recent-file', filePath),
  clearRecentFiles: () => ipcRenderer.invoke('clear-recent-files'),
  goHome: () => ipcRenderer.invoke('go-home'),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  createFile: () => ipcRenderer.invoke('create-file'),

  onFileOpened: (callback) => {
    ipcRenderer.on('file-opened', (_event, data) => callback(data));
  },
  onShowHome: (callback) => {
    ipcRenderer.on('show-home', () => callback());
  },
  onToggleEdit: (callback) => {
    ipcRenderer.on('toggle-edit', () => callback());
  },
  onSaveCurrent: (callback) => {
    ipcRenderer.on('save-current', () => callback());
  },
  onCreateNew: (callback) => {
    ipcRenderer.on('create-new', () => callback());
  }
});
