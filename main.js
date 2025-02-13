const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const robo = require('./scraper');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    console.log('aqui roda')
    mainWindow.loadFile('src/index.html');
});

ipcMain.handle('run-scraper', async () => {
    const data = await robo();
    return data;
});
