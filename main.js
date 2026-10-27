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

  // 在页面完成加载后，自动设置 localStorage 并触发语言切换为中文
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      try {
        localStorage.setItem('lang', 'zh-CN');
        localStorage.setItem('locale', 'zh-CN');
        localStorage.setItem('language', 'zh-CN');
        localStorage.setItem('i18n_locale', 'zh-CN');
      } catch (e) {}
    `);
  });

  // 绑定 Ctrl+P 快捷键打印
  win.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'p') {
      win.webContents.print();
      event.preventDefault();
    }
  });

  win.loadFile(path.join(__dirname, 'dist/index.html'));
}

// 强制设置 Electron 底层首选语言为中文
app.commandLine.appendSwitch('lang', 'zh-CN');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
