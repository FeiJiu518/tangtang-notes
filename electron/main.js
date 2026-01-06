const { app, BrowserWindow, ipcMain, shell, Menu, screen, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据存储路径
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'notes-data.json');
const sessionFilePath = path.join(userDataPath, 'active-sessions.json'); // 会话文件

let mainWindow;
let isCollapsed = false;
let collapsedSide = 'right';
let normalBounds = null;
const COLLAPSE_WIDTH = 80; // 无边框圆角窗口
const EDGE_THRESHOLD = 20;

// 当前窗口的唯一ID
const WINDOW_ID = 'window_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
let currentLoggedInUserId = null; // 当前窗口登录的用户ID

// 读取会话文件
function loadSessions() {
  try {
    if (fs.existsSync(sessionFilePath)) {
      const data = fs.readFileSync(sessionFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取会话文件失败:', error);
  }
  return {};
}

// 保存会话文件
function saveSessions(sessions) {
  try {
    fs.writeFileSync(sessionFilePath, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存会话文件失败:', error);
  }
}

// 清理过期会话（超过60秒没更新的认为已过期）
function cleanExpiredSessions() {
  const sessions = loadSessions();
  const now = Date.now();
  let changed = false;
  
  for (const userId in sessions) {
    if (now - sessions[userId].timestamp > 60000) {
      delete sessions[userId];
      changed = true;
    }
  }
  
  if (changed) {
    saveSessions(sessions);
  }
  
  return sessions;
}

// 检查用户是否已在其他窗口登录
function isUserLoggedIn(userId) {
  const sessions = cleanExpiredSessions();
  const session = sessions[userId];
  
  if (session && session.windowId !== WINDOW_ID) {
    // 检查时间戳是否在有效期内（30秒）
    if (Date.now() - session.timestamp < 30000) {
      return true;
    }
  }
  return false;
}

// 注册登录会话
function registerSession(userId, username) {
  const sessions = loadSessions();
  sessions[userId] = {
    windowId: WINDOW_ID,
    username: username,
    timestamp: Date.now()
  };
  saveSessions(sessions);
  currentLoggedInUserId = userId;
}

// 更新会话心跳
function updateSessionHeartbeat() {
  if (currentLoggedInUserId) {
    const sessions = loadSessions();
    if (sessions[currentLoggedInUserId]?.windowId === WINDOW_ID) {
      sessions[currentLoggedInUserId].timestamp = Date.now();
      saveSessions(sessions);
    }
  }
}

// 清除当前窗口的会话
function clearCurrentSession() {
  if (currentLoggedInUserId) {
    const sessions = loadSessions();
    if (sessions[currentLoggedInUserId]?.windowId === WINDOW_ID) {
      delete sessions[currentLoggedInUserId];
      saveSessions(sessions);
    }
    currentLoggedInUserId = null;
  }
}

// 心跳定时器
let heartbeatInterval = null;

function startHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
  }
  heartbeatInterval = setInterval(updateSessionHeartbeat, 10000); // 每10秒更新一次
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

function createWindow() {
  Menu.setApplicationMenu(null);
  
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: COLLAPSE_WIDTH,
    minHeight: 400,
    x: Math.floor((screenWidth - 1200) / 2),
    y: Math.floor((screenHeight - 800) / 2),
    title: '糖糖便签',
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    frame: false, // 无边框窗口
    transparent: true, // 透明背景，支持圆角
    backgroundColor: '#00000000',
    show: false,
    hasShadow: true,
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 右键菜单处理
  mainWindow.webContents.on('context-menu', (event, params) => {
    const { isEditable, selectionText } = params;
    
    let menuTemplate = [];
    
    if (isEditable) {
      // 编辑框中的右键菜单：全选、剪切、复制、粘贴
      menuTemplate = [
        { label: '全选', accelerator: 'CmdOrCtrl+A', click: () => mainWindow.webContents.selectAll() },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', enabled: selectionText.length > 0, click: () => mainWindow.webContents.cut() },
        { label: '复制', accelerator: 'CmdOrCtrl+C', enabled: selectionText.length > 0, click: () => mainWindow.webContents.copy() },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', click: () => mainWindow.webContents.paste() },
      ];
    } else if (selectionText.length > 0) {
      // 非编辑框中选中文字的右键菜单：只有复制
      menuTemplate = [
        { label: '复制', accelerator: 'CmdOrCtrl+C', click: () => mainWindow.webContents.copy() },
      ];
    }
    
    if (menuTemplate.length > 0) {
      const menu = Menu.buildFromTemplate(menuTemplate);
      menu.popup({ window: mainWindow });
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('moved', () => {
    if (isCollapsed) {
      // 收缩状态下，检测是否拖到了另一边
      const bounds = mainWindow.getBounds();
      const primaryDisplay = screen.getPrimaryDisplay();
      const workArea = primaryDisplay.workArea;
      const { width: screenWidth } = primaryDisplay.workAreaSize;
      
      // 计算窗口中心点
      const centerX = bounds.x + bounds.width / 2;
      const screenCenterX = screenWidth / 2;
      
      // 判断是否需要切换吸附边
      let newSide = collapsedSide;
      if (collapsedSide === 'right' && centerX < screenCenterX - 50) {
        // 从右边拖到左边
        newSide = 'left';
      } else if (collapsedSide === 'left' && centerX > screenCenterX + 50) {
        // 从左边拖到右边
        newSide = 'right';
      }
      
      // 如果切换了边，更新状态并通知渲染进程
      if (newSide !== collapsedSide) {
        collapsedSide = newSide;
        mainWindow.webContents.send('collapse-state-changed', { isCollapsed: true, side: collapsedSide });
      }
      
      // 计算正确的 X 位置（贴边）
      const correctX = collapsedSide === 'right' ? screenWidth - COLLAPSE_WIDTH : workArea.x;
      
      // 限制 Y 的范围
      let newY = bounds.y;
      if (newY < workArea.y) {
        newY = workArea.y;
      }
      if (newY + bounds.height > workArea.y + workArea.height) {
        newY = workArea.y + workArea.height - bounds.height;
      }
      
      // 如果位置需要修正
      if (bounds.x !== correctX || bounds.y !== newY) {
        mainWindow.setBounds({
          x: correctX,
          y: newY,
          width: bounds.width,
          height: bounds.height
        }, true);
      }
    } else {
      checkEdgeCollapse();
    }
  });

  mainWindow.on('resize', () => {
    if (!isCollapsed) {
      normalBounds = mainWindow.getBounds();
    }
  });

  mainWindow.on('closed', () => {
    // 窗口关闭时清除会话
    clearCurrentSession();
    stopHeartbeat();
    mainWindow = null;
  });
  
  normalBounds = mainWindow.getBounds();
}

function checkEdgeCollapse() {
  if (!mainWindow) return;
  
  const bounds = mainWindow.getBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  const workArea = primaryDisplay.workArea;
  
  const rightEdge = bounds.x + bounds.width;
  const isNearRightEdge = rightEdge >= screenWidth - EDGE_THRESHOLD;
  const isNearLeftEdge = bounds.x <= workArea.x + EDGE_THRESHOLD;
  
  if ((isNearRightEdge || isNearLeftEdge) && !isCollapsed) {
    normalBounds = { ...bounds };
    isCollapsed = true;
    collapsedSide = isNearRightEdge ? 'right' : 'left';
    
    const newX = isNearRightEdge ? screenWidth - COLLAPSE_WIDTH : workArea.x;
    const collapseHeight = Math.min(480, workArea.height * 0.55);
    const newY = workArea.y + Math.floor((workArea.height - collapseHeight) / 2);
    
    mainWindow.setBounds({
      x: newX,
      y: newY,
      width: COLLAPSE_WIDTH,
      height: collapseHeight
    }, true);
    
    // 收缩时置顶
    mainWindow.setAlwaysOnTop(true, 'floating');
    
    mainWindow.webContents.send('collapse-state-changed', { 
      isCollapsed: true, 
      side: collapsedSide 
    });
  }
}

function expandWindow() {
  if (!mainWindow || !isCollapsed) return;
  
  isCollapsed = false;
  
  // 取消置顶
  mainWindow.setAlwaysOnTop(false);
  
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;
  
  let newX = normalBounds.x;
  if (newX + normalBounds.width > screenWidth - EDGE_THRESHOLD * 2) {
    newX = screenWidth - normalBounds.width - EDGE_THRESHOLD * 2;
  }
  if (newX < EDGE_THRESHOLD * 2) {
    newX = EDGE_THRESHOLD * 2;
  }
  
  mainWindow.setBounds({
    x: newX,
    y: normalBounds.y,
    width: normalBounds.width,
    height: normalBounds.height
  }, true);
  
  mainWindow.webContents.send('collapse-state-changed', { isCollapsed: false });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // 应用退出前清除会话
  clearCurrentSession();
  stopHeartbeat();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 应用退出前确保清理
app.on('before-quit', () => {
  clearCurrentSession();
  stopHeartbeat();
});

// ==================== IPC 处理 ====================

ipcMain.handle('load-data', async () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('读取数据失败:', error);
    return null;
  }
});

ipcMain.handle('save-data', async (event, data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error('保存数据失败:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('expand-window', async () => {
  expandWindow();
  return { success: true };
});

ipcMain.handle('get-collapse-state', async () => {
  return isCollapsed;
});

// 窗口控制
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// ==================== 登录会话管理 ====================

// 检查用户是否已在其他窗口登录
ipcMain.handle('check-user-session', async (event, userId) => {
  return isUserLoggedIn(userId);
});

// 注册登录会话
ipcMain.handle('register-session', async (event, { userId, username }) => {
  registerSession(userId, username);
  startHeartbeat();
  return { success: true };
});

// 清除登录会话（登出时调用）
ipcMain.handle('clear-session', async () => {
  clearCurrentSession();
  stopHeartbeat();
  return { success: true };
});
