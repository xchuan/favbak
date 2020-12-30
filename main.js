// Modules to control application life and create native browser window
const {app, BrowserWindow, BrowserView} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 600,
    webPreferences: {
      //contextIsolation: true,
      nodeIntegration: true
      //preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  //const win = new BrowserWindow({ width: 800, height: 600 })

  /*const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.addBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 500, height: 600 })
  view.webContents.loadFile('index.html')*/

  const secondView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule:true,
      preload: path.join(__dirname, 'preload1.js')
    }
  })
  win.addBrowserView(secondView)
  secondView.setBounds({ x: 220, y: 0, width: 1024, height: 600 })
  secondView.webContents.loadURL('https://taobao.com')

  secondView.webContents.on('dom-ready', () => {
    secondView.webContents
      .executeJavaScript(
        `
        let cc = 0
        const waitForExternal = setInterval(() => {
          if (document.querySelector('.j_logoArea') || document.querySelector('.J_Cover')){
            clearInterval(waitForExternal);
            console.log(11111);
            var tOne = document.querySelector('#oversea-searchbar');

            if(tOne==null){
              tOne = document.querySelector('.tbh-search');
            }
            tOne.onclick=function(){
              //alert('111');
              window.pingHost();
            } 
          }else{
            console.log('no');
            cc++;
          }
          if(cc==30){
            clearInterval(waitForExternal);  
          }
        }, 100);
        `,
        false,
        (result) =>
          console.log('webContents exec callback: ' + result)
      )
      .then((result) =>
        console.log('webContents exec then: ' + result)
      );
  });
  //secondView.webContents.loadFile('tb.html')
  
  app.on('window-all-closed', () => {
    win.removeBrowserView(secondView)
    //win.removeBrowserView(view)
    //app.quit()
  })

  // Open the DevTools.
  secondView.webContents.openDevTools();
  // win.webContents.openDevTools();
  require('./ipcmain.js')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
