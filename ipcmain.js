var { ipcMain,BrowserWindow,dialog,app} = require('electron');
const fs = require('fs');
const {download} = require('electron-dl');

var nowW,nowView;

ipcMain.on('sendM',function(evt,data) {
  //console.log(data);
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  //console.log(nowW[0].getBrowserViews());
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.loadURL(gourl);
  }
  //secondView.webContents.loadURL('https://taobao.com')
  //console.log(evt);
})

ipcMain.on('sendBak',function(evt,data) {
  console.log(data,'sendBaksendBak');
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  //console.log(nowW[0].getBrowserViews());
  if(allws.length>0){
    nowView=allws[0].webContents;
    //console.log(typeof nowView.webContents,'assssaa1111aa');
    nowView.executeJavaScript(`
      window.pingHtml();
    `);
  }
  //secondView.webContents.loadURL('https://taobao.com')
  //console.log(evt);
});

ipcMain.on('sendBtm',function(evt,data) {
  console.log(data,'sendBtmsendBtm3333');
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.executeJavaScript(`
      window.scrollTo(0,document.body.scrollHeight);
      window.pingChk();
    `);
  }
});

ipcMain.on('sendR',function(evt,data) {
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  console.log(nowW[0].getBrowserViews());
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.reload();
  }
});

ipcMain.on('sendH', function(evt,data) {
  //console.log(data,'htmlllllllllll');
  fs.writeFile("tmp/"+data.name+".json", JSON.stringify(data.list), function(error) {
    if (error)
      throw error;
    console.log("Write Data("+data.name+") successfully.");
    
  });
  //const win = BrowserWindow.getFocusedWindow();  
  //await download(win, "tmp/login.html")
});

ipcMain.on('sendD', function(evt,data) {
  console.log(data,'dddddddddddddd');
  const win = BrowserWindow.getFocusedWindow();
  download(BrowserWindow.getFocusedWindow(), data.url,{directory:data.pp}).then(dl => win.webContents.send("download complete", dl.getSavePath()));
});

ipcMain.on('sendChk', function(evt,data,allcc) {
  console.log(data,'sendChksendChksendChksendChk');
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send("update items", data,allcc);
});

