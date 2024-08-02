const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 550,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        // resizable: false,
    });
    win.loadFile('render/index.html');
    win.setMenu(null);
    // 开启调试工具
    // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('start-merge', (event, projectPath) => {
    const scriptPath = path.join(__dirname, 'assets', 'devToPre.sh');
    const bashPath = "C:\\Program Files\\Git\\bin\\bash.exe";
    console.log(`Bash path: ${bashPath}`);
    console.log('projectPath', `${projectPath}`);
    
    execFile(bashPath, [scriptPath, projectPath], (error, stdout, stderr) => {
        if (error) {
            console.error(`run sh error: ${error}`);
            event.sender.send('merge-result', `error msg》: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            event.sender.send('merge-result', `tip》: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        event.sender.send('merge-result', `merge success: ${stdout}`);
    });
});
