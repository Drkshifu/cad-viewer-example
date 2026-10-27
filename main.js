const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'CADViewer',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  Menu.setApplicationMenu(null);

  // 页面加载完成后注入打印样式：白底黑线 + 隐藏多余界面元素
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      @media print {
        @page {
          margin: 0;
        }
        body, html {
          background-color: #ffffff !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        /* 核心反色：把黑底变成白底，白线条变成黑色线条 */
        canvas {
          filter: invert(100%) !important;
          background-color: #ffffff !important;
        }
        /* 隐藏顶部功能区、底部命令行、状态栏、侧边悬浮工具条 */
        .el-header,
        .header,
        .top-bar,
        .bottom-bar,
        .command-bar,
        .status-bar,
        .side-toolbar,
        .floating-toolbar,
        [class*="header"],
        [class*="bottom"],
        [class*="toolbar"] {
          display: none !important;
        }
      }
    `);
  });

  // 绑定快捷键 Ctrl + P 直接调用系统打印对话框
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'p') {
      win.webContents.print({
        silent: false,
        printBackground: true
      });
      event.preventDefault();
    }
  });

  win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
