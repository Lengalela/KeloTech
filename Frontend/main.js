const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: true }
    });

    win.loadFile('login.html'); // Load a webpage or an HTML file
}

app.whenReady().then(createWindow);
