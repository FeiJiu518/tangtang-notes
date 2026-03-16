const { app, BrowserWindow, ipcMain, shell, Menu, Tray, screen, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据存储路径
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'notes-data.json');
const sessionFilePath = path.join(userDataPath, 'active-sessions.json'); // 会话文件

let mainWindow;
let tray = null;
let isCollapsed = false;
let collapsedSide = 'right';
let normalBounds = null;
const COLLAPSE_WIDTH = 80; // 无边框圆角窗口
const EDGE_THRESHOLD = 20;
const SNAP_THRESHOLD = 80; // 收缩状态下拖拽时，距边缘多近算"靠近边缘"
let lastCollapseWorkArea = null; // 记录收缩时所在屏幕的工作区域
let collapseDragTimer = null; // 收缩状态拖拽防抖定时器
let closeBehavior = null; // null=未设置, 'quit'=直接退出, 'tray'=最小化到托盘
let isForceQuit = false; // 是否强制退出（托盘菜单退出时）

// 读取应用设置
function loadAppSettings() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
      if (data.appSettings?.closeBehavior) {
        closeBehavior = data.appSettings.closeBehavior;
      }
    }
  } catch (error) {
    console.error('读取应用设置失败:', error);
  }
}

// 保存关闭行为设置
function saveCloseBehavior(behavior) {
  closeBehavior = behavior;
  try {
    let data = {};
    if (fs.existsSync(dataFilePath)) {
      data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }
    data.appSettings = { ...(data.appSettings || {}), closeBehavior: behavior };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存关闭行为设置失败:', error);
  }
}

// 创建系统托盘
function createTray() {
  if (tray) return;

  const iconPath = path.join(__dirname, '../public/icon.ico');
  tray = new Tray(iconPath);
  tray.setToolTip('糖糖便签');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isForceQuit = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

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
      // 收缩状态下拖拽：用防抖判断拖拽结束后的最终位置
      // 拖拽过程中不强制吸回，让用户自由拖动
      if (collapseDragTimer) {
        clearTimeout(collapseDragTimer);
      }

      collapseDragTimer = setTimeout(() => {
        if (!mainWindow || !isCollapsed) return;

        const bounds = mainWindow.getBounds();
        const virtualBounds = getVirtualScreenBounds();
        const currentDisplay = screen.getDisplayNearestPoint({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 });
        const workArea = currentDisplay.workArea;

        const rightEdge = bounds.x + bounds.width;
        const isNearRight = rightEdge >= virtualBounds.maxX - SNAP_THRESHOLD;
        const isNearLeft = bounds.x <= virtualBounds.minX + SNAP_THRESHOLD;

        if (isNearRight || isNearLeft) {
          // 靠近边缘：保持收缩，吸附到该边
          const newSide = isNearRight ? 'right' : 'left';
          if (newSide !== collapsedSide) {
            collapsedSide = newSide;
            mainWindow.webContents.send('collapse-state-changed', { isCollapsed: true, side: collapsedSide });
          }

          const correctX = collapsedSide === 'right' ? virtualBounds.maxX - COLLAPSE_WIDTH : virtualBounds.minX;

          // 限制 Y 的范围
          let newY = bounds.y;
          if (newY < workArea.y) {
            newY = workArea.y;
          }
          if (newY + bounds.height > workArea.y + workArea.height) {
            newY = workArea.y + workArea.height - bounds.height;
          }

          mainWindow.setBounds({
            x: correctX,
            y: newY,
            width: bounds.width,
            height: bounds.height
          }, true);
        } else {
          // 远离边缘：在当前位置展开窗口
          expandWindow(true);
        }
      }, 200); // 200ms 防抖，拖拽结束后触发
    } else {
      checkEdgeCollapse();
    }
  });

  mainWindow.on('resize', () => {
    if (!isCollapsed) {
      normalBounds = mainWindow.getBounds();
    }
  });

  // 拦截关闭事件
  mainWindow.on('close', (event) => {
    if (isForceQuit) return; // 强制退出时不拦截

    if (closeBehavior === 'tray') {
      // 已设置最小化到托盘
      event.preventDefault();
      mainWindow.hide();
      createTray();
    } else if (closeBehavior === null) {
      // 未设置过关闭行为，通知渲染进程弹窗询问
      event.preventDefault();
      mainWindow.webContents.send('show-close-dialog');
    }
    // closeBehavior === 'quit' 时不拦截，正常关闭
  });

  mainWindow.on('closed', () => {
    // 窗口关闭时清除会话
    clearCurrentSession();
    stopHeartbeat();
    mainWindow = null;
  });
  
  normalBounds = mainWindow.getBounds();
}

// 获取所有屏幕组成的虚拟桌面边界
function getVirtualScreenBounds() {
  const displays = screen.getAllDisplays();
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  displays.forEach(d => {
    minX = Math.min(minX, d.workArea.x);
    maxX = Math.max(maxX, d.workArea.x + d.workArea.width);
    minY = Math.min(minY, d.workArea.y);
    maxY = Math.max(maxY, d.workArea.y + d.workArea.height);
  });
  return { minX, maxX, minY, maxY };
}

function checkEdgeCollapse() {
  if (!mainWindow) return;

  const bounds = mainWindow.getBounds();
  const virtualBounds = getVirtualScreenBounds();

  // 获取窗口所在的显示器
  const currentDisplay = screen.getDisplayNearestPoint({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 });
  const workArea = currentDisplay.workArea;

  const rightEdge = bounds.x + bounds.width;
  // 只在虚拟桌面的最外侧边缘才触发吸附（不在屏幕交界处触发）
  const isNearRightEdge = rightEdge >= virtualBounds.maxX - EDGE_THRESHOLD;
  const isNearLeftEdge = bounds.x <= virtualBounds.minX + EDGE_THRESHOLD;

  if ((isNearRightEdge || isNearLeftEdge) && !isCollapsed) {
    normalBounds = { ...bounds };
    isCollapsed = true;
    collapsedSide = isNearRightEdge ? 'right' : 'left';

    const newX = isNearRightEdge ? virtualBounds.maxX - COLLAPSE_WIDTH : virtualBounds.minX;
    // 先用默认高度，渲染进程会根据实际图标数量回调调整
    const collapseHeight = Math.min(480, workArea.height * 0.55);
    const newY = workArea.y + Math.floor((workArea.height - collapseHeight) / 2);
    lastCollapseWorkArea = workArea;

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

function expandWindow(atCurrentPosition) {
  if (!mainWindow || !isCollapsed) return;

  isCollapsed = false;

  // 取消置顶
  mainWindow.setAlwaysOnTop(false);

  const virtualBounds = getVirtualScreenBounds();
  const currentBounds = mainWindow.getBounds();

  let newX, newY;

  if (atCurrentPosition) {
    // 拖拽释放：以当前窗口位置为中心展开
    newX = currentBounds.x - Math.floor((normalBounds.width - currentBounds.width) / 2);
    newY = currentBounds.y - Math.floor((normalBounds.height - currentBounds.height) / 2);
  } else {
    // 按钮点击：恢复到收缩前的原始位置
    newX = normalBounds.x;
    newY = normalBounds.y;
  }

  // 确保展开后窗口不会超出虚拟桌面边缘（留出余量避免再次触发吸附）
  if (newX + normalBounds.width > virtualBounds.maxX - EDGE_THRESHOLD * 2) {
    newX = virtualBounds.maxX - normalBounds.width - EDGE_THRESHOLD * 2;
  }
  if (newX < virtualBounds.minX + EDGE_THRESHOLD * 2) {
    newX = virtualBounds.minX + EDGE_THRESHOLD * 2;
  }
  // 确保 Y 不超出屏幕
  if (newY < virtualBounds.minY) {
    newY = virtualBounds.minY;
  }
  if (newY + normalBounds.height > virtualBounds.maxY) {
    newY = virtualBounds.maxY - normalBounds.height;
  }

  mainWindow.setBounds({
    x: newX,
    y: newY,
    width: normalBounds.width,
    height: normalBounds.height
  }, true);

  mainWindow.webContents.send('collapse-state-changed', { isCollapsed: false });
}

app.whenReady().then(() => {
  loadAppSettings();
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

// ==================== 关闭行为设置 ====================

ipcMain.handle('set-close-behavior', (event, behavior) => {
  saveCloseBehavior(behavior);
  return { success: true };
});

ipcMain.handle('get-close-behavior', () => {
  return closeBehavior;
});

ipcMain.handle('confirm-close', (event, behavior) => {
  // 用户在弹窗中做出了选择
  if (behavior === 'tray') {
    mainWindow.hide();
    createTray();
  } else {
    // quit
    isForceQuit = true;
    mainWindow.close();
  }
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

// 更新收缩窗口高度（渲染进程根据图标数量计算后调用）
ipcMain.handle('update-collapse-height', async (event, height) => {
  if (!mainWindow || !isCollapsed) return;

  const bounds = mainWindow.getBounds();
  const currentDisplay = screen.getDisplayNearestPoint({ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 });
  const workArea = currentDisplay.workArea;

  // 限制高度不超过工作区域
  const clampedHeight = Math.min(height, workArea.height);
  // 垂直居中
  const newY = workArea.y + Math.floor((workArea.height - clampedHeight) / 2);

  mainWindow.setBounds({
    x: bounds.x,
    y: newY,
    width: bounds.width,
    height: clampedHeight
  }, true);
});
