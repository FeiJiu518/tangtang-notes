const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 数据持久化
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // 窗口收缩/展开
  expandWindow: () => ipcRenderer.invoke('expand-window'),
  getCollapseState: () => ipcRenderer.invoke('get-collapse-state'),
  onCollapseStateChanged: (callback) => {
    ipcRenderer.on('collapse-state-changed', (event, data) => callback(data));
  },
  
  // 窗口控制（无边框窗口需要）
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  
  // 登录会话管理
  checkUserSession: (userId) => ipcRenderer.invoke('check-user-session', userId),
  registerSession: (userId, username) => ipcRenderer.invoke('register-session', { userId, username }),
  clearSession: () => ipcRenderer.invoke('clear-session'),
  
  // 平台信息
  platform: process.platform,
  isElectron: true,
});
