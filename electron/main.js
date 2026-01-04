const { app, BrowserWindow, ipcMain, shell, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// 数据存储路径
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'notes-data.json');

let mainWindow;
let isCollapsed = false;
let collapsedSide = 'right';
let normalBounds = null;
const COLLAPSE_WIDTH = 80; // 无边框圆角窗口
const EDGE_THRESHOLD = 20;

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

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('moved', () => {
    if (isCollapsed) {
      // 收缩状态下，保持 X 位置贴边，只允许上下移动
      const bounds = mainWindow.getBounds();
      const primaryDisplay = screen.getPrimaryDisplay();
      const workArea = primaryDisplay.workArea;
      const { width: screenWidth } = primaryDisplay.workAreaSize;
      
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
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
