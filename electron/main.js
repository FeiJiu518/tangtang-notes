const { app, BrowserWindow, ipcMain, shell, Menu, Tray, screen, clipboard, dialog } = require('electron');
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
    mainWindow.loadURL('http://localhost:5174');
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
  // 启动时清理旧会话，防止上次崩溃或强制关闭导致会话残留
  saveSessions({});
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
  for (const [, win] of pinnedWindows) {
    if (!win.isDestroyed()) win.close();
  }
  pinnedWindows.clear();
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

const https = require('https');
const http = require('http');

const faviconCache = new Map();

async function fetchFaviconBase64(url) {
  try {
    const { origin } = new URL(url);
    if (faviconCache.has(origin)) return faviconCache.get(origin);
    const result = await _fetchFaviconBase64(url);
    if (result) faviconCache.set(origin, result);
    return result;
  } catch (e) {
    return null;
  }
}

async function _fetchFaviconBase64(url) {
  try {
    const { origin } = new URL(url);
    const fetchUrl = (targetUrl, redirects = 0) => new Promise((resolve, reject) => {
      if (redirects > 3) { reject(new Error('Too many redirects')); return; }
      const mod = targetUrl.startsWith('https') ? https : http;
      const req = mod.get(targetUrl, {
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const next = res.headers.location.startsWith('http') ? res.headers.location : `${new URL(targetUrl).origin}${res.headers.location}`;
          fetchUrl(next, redirects + 1).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) { reject(new Error('Not found')); return; }
        const ct = res.headers['content-type'] || '';
        if (ct.includes('text/html')) { reject(new Error('HTML response')); return; }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    });

    // 尝试解析HTML找到真正的favicon链接
    const fetchHtmlFavicon = async () => {
      const htmlBuf = await new Promise((resolve, reject) => {
        const mod = origin.startsWith('https') ? https : http;
        const req = mod.get(origin, {
          timeout: 5000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        }, (res) => {
          if (res.statusCode !== 200) { reject(new Error('Not OK')); return; }
          const chunks = [];
          res.on('data', c => { chunks.push(c); if (Buffer.concat(chunks).length > 50000) { req.destroy(); resolve(Buffer.concat(chunks)); } });
          res.on('end', () => resolve(Buffer.concat(chunks)));
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      });
      const html = htmlBuf.toString('utf8');
      const match = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)
        || html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i);
      if (!match) return null;
      let href = match[1];
      if (href.startsWith('//')) href = 'https:' + href;
      else if (href.startsWith('/')) href = origin + href;
      else if (!href.startsWith('http')) href = origin + '/' + href;
      const buf = await fetchUrl(href);
      if (buf.length < 64) return null;
      const ext = href.includes('.png') ? 'image/png' : href.includes('.svg') ? 'image/svg+xml' : 'image/x-icon';
      return `data:${ext};base64,${buf.toString('base64')}`;
    };

    // 先试 /favicon.ico
    try {
      const buf = await fetchUrl(`${origin}/favicon.ico`);
      if (buf.length >= 64) {
        return `data:image/x-icon;base64,${buf.toString('base64')}`;
      }
    } catch {}

    // 回退：解析HTML找icon链接
    try {
      const result = await fetchHtmlFavicon();
      if (result) return result;
    } catch {}

    return null;
  } catch {
    return null;
  }
}

async function enrichLinksWithFavicons(links) {
  return Promise.all(links.map(async link => {
    if (link.favicon) return link;
    if (link.customFavicon) return { ...link, favicon: link.customFavicon };
    const favicon = await fetchFaviconBase64(link.url).catch(() => null);
    return favicon ? { ...link, favicon } : link;
  }));
}

ipcMain.handle('fetch-favicon', async (event, url) => {
  const favicon = await fetchFaviconBase64(url);
  return favicon ? { success: true, favicon } : { success: false };
});

ipcMain.handle('select-icon-file', async () => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  const result = await dialog.showOpenDialog(win, {
    title: '选择图标图片',
    filters: [{ name: '图片', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }],
    properties: ['openFile'],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false };
  }
  const filePath = result.filePaths[0];
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : `image/${ext}`;
  const buf = fs.readFileSync(filePath);
  const base64 = `data:${mime};base64,${buf.toString('base64')}`;
  return { success: true, favicon: base64 };
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

// ==================== 钉到桌面功能 ====================

const pinnedWindows = new Map(); // noteId -> BrowserWindow

ipcMain.handle('pin-note', async (event, { noteId, bounds }) => {
  if (pinnedWindows.has(noteId)) {
    pinnedWindows.get(noteId).focus();
    return { success: true };
  }

  const win = new BrowserWindow({
    width: bounds?.width || 300,
    height: bounds?.height || 360,
    x: bounds?.x || undefined,
    y: bounds?.y || undefined,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    minimizable: false,
    skipTaskbar: true,
    minWidth: 200,
    minHeight: 150,
    icon: path.join(__dirname, '../public/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    hasShadow: true,
  });

  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    win.loadURL(`http://localhost:5174?pinned=${noteId}`);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { pinned: String(noteId) }
    });
  }

  win.on('moved', () => {
    const b = win.getBounds();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('pinned-window-moved', { noteId, bounds: b });
    }
  });

  win.on('resized', () => {
    const b = win.getBounds();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('pinned-window-moved', { noteId, bounds: b });
    }
  });

  win.on('closed', () => {
    pinnedWindows.delete(noteId);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('pinned-window-closed', { noteId });
    }
  });

  pinnedWindows.set(noteId, win);
  return { success: true };
});

ipcMain.handle('unpin-note', async (event, noteId) => {
  const win = pinnedWindows.get(noteId);
  if (win && !win.isDestroyed()) {
    win.close();
  }
  pinnedWindows.delete(noteId);
  return { success: true };
});

ipcMain.handle('get-pinned-windows', async () => {
  return Array.from(pinnedWindows.keys());
});

ipcMain.handle('update-note-from-pinned', async (event, { noteId, updates }) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('note-updated-from-pinned', { noteId, updates });
  }
  return { success: true };
});

ipcMain.handle('notify-pinned-windows', async (event, { noteId, noteData }) => {
  const win = pinnedWindows.get(noteId);
  if (win && !win.isDestroyed()) {
    win.webContents.send('note-data-updated', noteData);
  }
  return { success: true };
});

ipcMain.handle('close-all-pinned', async () => {
  for (const [, win] of pinnedWindows) {
    if (!win.isDestroyed()) win.close();
  }
  pinnedWindows.clear();
  return { success: true };
});

// ==================== Link Dock ====================

const DOCK_WIDTH_COLLAPSED = 56;
const DOCK_WIDTH_EXPANDED = 210;
let linkDockWindow = null;

function createLinkDock(links, side) {
  if (linkDockWindow && !linkDockWindow.isDestroyed()) {
    enrichLinksWithFavicons(links).then(enriched => {
      linkDockWindow.webContents.send('dock-links-updated', enriched);
    });
    const primaryDisplay = screen.getPrimaryDisplay();
    const workArea = primaryDisplay.workArea;
    const height = Math.min(links.length * 52 + 80, workArea.height * 0.8);
    const bounds = linkDockWindow.getBounds();
    const y = workArea.y + Math.floor((workArea.height - height) / 2);
    linkDockWindow.setBounds({ ...bounds, y, height }, true);
    return;
  }

  const virtualBounds = getVirtualScreenBounds();
  const primaryDisplay = screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workArea;
  const itemHeight = 52;
  const height = Math.min(links.length * itemHeight + 80, workArea.height * 0.8);
  const y = workArea.y + Math.floor((workArea.height - height) / 2);
  const x = side === 'left' ? virtualBounds.minX : virtualBounds.maxX - DOCK_WIDTH_EXPANDED;

  linkDockWindow = new BrowserWindow({
    width: DOCK_WIDTH_EXPANDED,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    minimizable: false,
    skipTaskbar: true,
    hasShadow: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const dockSide = side || 'right';
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
    linkDockWindow.loadURL(`http://localhost:5174?dock=true&side=${dockSide}`);
  } else {
    linkDockWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      query: { dock: 'true', side: dockSide },
    });
  }

  linkDockWindow.on('closed', () => {
    linkDockWindow = null;
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('dock-closed');
    }
  });

  linkDockWindow.webContents.on('did-finish-load', async () => {
    if (linkDockWindow && !linkDockWindow.isDestroyed()) {
      linkDockWindow.setIgnoreMouseEvents(true, { forward: true });
      const basicLinks = links.map(l => ({
        id: l.id,
        url: l.url || l.content,
        title: l.title || l.url || l.content,
        favicon: l.customFavicon || l.favicon || null,
      }));
      linkDockWindow.webContents.send('dock-links-updated', basicLinks);
      linkDockWindow.show();
      linkDockWindow.setAlwaysOnTop(true, 'screen-saver');
      const enriched = await enrichLinksWithFavicons(basicLinks);
      if (linkDockWindow && !linkDockWindow.isDestroyed()) {
        linkDockWindow.webContents.send('dock-links-updated', enriched);
      }
    }
  });
}

ipcMain.handle('open-link-dock', async (event, { links, side }) => {
  createLinkDock(links, side || 'right');
  return { success: true };
});

ipcMain.handle('close-link-dock', async () => {
  if (linkDockWindow && !linkDockWindow.isDestroyed()) linkDockWindow.close();
  return { success: true };
});

ipcMain.handle('remove-dock-link', async (event, linkId) => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return { success: false };
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('dock-link-removed', linkId);
  }
  return { success: true };
});

ipcMain.handle('show-dock-icon-menu', async (event, { linkId, url }) => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  const menu = Menu.buildFromTemplate([
    {
      label: '更换图标',
      click: async () => {
        const result = await dialog.showOpenDialog(linkDockWindow, {
          title: '选择图标图片',
          filters: [{ name: '图片', extensions: ['png', 'jpg', 'jpeg', 'ico', 'svg', 'webp'] }],
          properties: ['openFile'],
        });
        if (!result.canceled && result.filePaths.length > 0) {
          const filePath = result.filePaths[0];
          const ext = path.extname(filePath).slice(1).toLowerCase();
          const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'ico' ? 'image/x-icon' : `image/${ext}`;
          const buf = fs.readFileSync(filePath);
          const base64 = `data:${mime};base64,${buf.toString('base64')}`;
          linkDockWindow.webContents.send('dock-icon-updated', { linkId, favicon: base64 });
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('dock-icon-updated', { linkId, favicon: base64 });
          }
        }
      }
    },
    {
      label: '重新获取图标',
      click: async () => {
        const favicon = await fetchFaviconBase64(url);
        if (favicon) {
          linkDockWindow.webContents.send('dock-icon-updated', { linkId, favicon });
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('dock-icon-updated', { linkId, favicon });
          }
        }
      }
    },
  ]);
  menu.popup({ window: linkDockWindow });
});

let dockDragStartY = 0;
ipcMain.handle('dock-drag-start', async () => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  dockDragStartY = linkDockWindow.getBounds().y;
});

ipcMain.handle('dock-drag-move', async (event, deltaY) => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  const bounds = linkDockWindow.getBounds();
  linkDockWindow.setBounds({ ...bounds, y: dockDragStartY + deltaY });
});

ipcMain.handle('dock-set-mouse-ignore', async (event, ignore) => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  if (ignore) {
    linkDockWindow.setIgnoreMouseEvents(true, { forward: true });
  } else {
    linkDockWindow.setIgnoreMouseEvents(false);
  }
});

ipcMain.handle('update-link-dock', async (event, { links }) => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return { success: false };
  const enriched = await enrichLinksWithFavicons(links);
  linkDockWindow.webContents.send('dock-links-updated', enriched);
  const primaryDisplay = screen.getPrimaryDisplay();
  const workArea = primaryDisplay.workArea;
  const height = Math.min(links.length * 52 + 80, workArea.height * 0.8);
  const bounds = linkDockWindow.getBounds();
  const y = workArea.y + Math.floor((workArea.height - height) / 2);
  linkDockWindow.setBounds({ ...bounds, y, height }, true);
  return { success: true };
});

ipcMain.handle('expand-dock', async () => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  const bounds = linkDockWindow.getBounds();
  const newX = bounds.x - (DOCK_WIDTH_EXPANDED - bounds.width);
  linkDockWindow.setBounds({ x: newX, y: bounds.y, width: DOCK_WIDTH_EXPANDED, height: bounds.height }, true);
});

ipcMain.handle('collapse-dock', async () => {
  if (!linkDockWindow || linkDockWindow.isDestroyed()) return;
  const bounds = linkDockWindow.getBounds();
  const newX = bounds.x + (bounds.width - DOCK_WIDTH_COLLAPSED);
  linkDockWindow.setBounds({ x: newX, y: bounds.y, width: DOCK_WIDTH_COLLAPSED, height: bounds.height }, true);
});
