const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    // Starting size (will be maximized anyway)
    width: 800,
    height: 600,

    // Remove the default Electron menu bar
    autoHideMenuBar: true,

    // Keep the OS window controls visible (minimize, maximize, close)
    // so don't use fullscreen or kiosk

    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Maximize the window so it covers the screen but with OS controls
  win.maximize();

  // Load your main page
  win.loadFile("login.html");
}

app.whenReady().then(createWindow);
