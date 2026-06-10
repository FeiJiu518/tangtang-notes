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

  // 获取网站favicon
  fetchFavicon: (url) => ipcRenderer.invoke('fetch-favicon', url),
  selectIconFile: () => ipcRenderer.invoke('select-icon-file'),
  
  // 窗口收缩/展开
  expandWindow: () => ipcRenderer.invoke('expand-window'),
  getCollapseState: () => ipcRenderer.invoke('get-collapse-state'),
  updateCollapseHeight: (height) => ipcRenderer.invoke('update-collapse-height', height),
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

  // 关闭行为设置
  setCloseBehavior: (behavior) => ipcRenderer.invoke('set-close-behavior', behavior),
  getCloseBehavior: () => ipcRenderer.invoke('get-close-behavior'),
  confirmClose: (behavior) => ipcRenderer.invoke('confirm-close', behavior),
  onShowCloseDialog: (callback) => {
    ipcRenderer.on('show-close-dialog', () => callback());
  },

  // 钉到桌面
  pinNote: (noteId, bounds) => ipcRenderer.invoke('pin-note', { noteId, bounds }),
  unpinNote: (noteId) => ipcRenderer.invoke('unpin-note', noteId),
  getPinnedWindows: () => ipcRenderer.invoke('get-pinned-windows'),
  closeAllPinned: () => ipcRenderer.invoke('close-all-pinned'),
  notifyPinnedWindows: (noteId, noteData) => ipcRenderer.invoke('notify-pinned-windows', { noteId, noteData }),
  onPinnedWindowClosed: (callback) => {
    ipcRenderer.on('pinned-window-closed', (event, data) => callback(data));
  },
  onPinnedWindowMoved: (callback) => {
    ipcRenderer.on('pinned-window-moved', (event, data) => callback(data));
  },
  // 钉窗口专用：接收数据更新
  onNoteDataUpdated: (callback) => {
    ipcRenderer.on('note-data-updated', (event, data) => callback(data));
  },
  // 钉窗口专用：向主窗口发送更新
  updateNoteFromPinned: (noteId, updates) => ipcRenderer.invoke('update-note-from-pinned', { noteId, updates }),
  // 主窗口专用：接收钉窗口的更新
  onNoteUpdatedFromPinned: (callback) => {
    ipcRenderer.on('note-updated-from-pinned', (event, data) => callback(data));
  },

  // Link Dock
  openLinkDock: (links, side) => ipcRenderer.invoke('open-link-dock', { links, side }),
  closeLinkDock: () => ipcRenderer.invoke('close-link-dock'),
  updateLinkDock: (links) => ipcRenderer.invoke('update-link-dock', { links }),
  removeDockLink: (linkId) => ipcRenderer.invoke('remove-dock-link', linkId),
  showDockIconMenu: (linkId, url) => ipcRenderer.invoke('show-dock-icon-menu', { linkId, url }),
  expandDock: () => ipcRenderer.invoke('expand-dock'),
  collapseDock: () => ipcRenderer.invoke('collapse-dock'),
  dockDragStart: () => ipcRenderer.invoke('dock-drag-start'),
  dockDragMove: (deltaY) => ipcRenderer.invoke('dock-drag-move', deltaY),
  dockSetMouseIgnore: (ignore) => ipcRenderer.invoke('dock-set-mouse-ignore', ignore),
  onDockLinksUpdated: (callback) => {
    ipcRenderer.on('dock-links-updated', (event, data) => callback(data));
  },
  onDockIconUpdated: (callback) => {
    ipcRenderer.on('dock-icon-updated', (event, data) => callback(data));
  },
  onDockClosed: (callback) => {
    ipcRenderer.on('dock-closed', () => callback());
  },
  onDockLinkRemoved: (callback) => {
    ipcRenderer.on('dock-link-removed', (event, linkId) => callback(linkId));
  },

  // 平台信息
  platform: process.platform,
  isElectron: true,
});
