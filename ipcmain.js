var { ipcMain,BrowserWindow,dialog,app} = require('electron');
const fs = require('fs');
const {download} = require('electron-dl');

var nowW,nowView,pageUrls=[];

var goNext = function (url) {
  let nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    //nowView.loadURL(url);
    nowView.executeJavaScript(`
      document.getElementsByClassName('J_NextPage')[0].click();
    `);
    // nowView.executeJavaScript(`
    //   window.pingNxt();
    // `);
  }
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send("reset tips", "1");
  win.webContents.send("set auto", true);
}

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
    pageUrls.shift();
    console.log(pageUrls.length,pageUrls[0]);
    if(pageUrls.length>0){
      goNext(pageUrls[0]);  
    }else{
      console.log('all done!!!');
    }
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
  //console.log(data,'sendChksendChksendChksendChk');
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send("update items", data,allcc);
});
ipcMain.on('sendChkOnly', function(evt,data) {
  const win = BrowserWindow.getFocusedWindow();
  win.webContents.send("update tips", data);
});

ipcMain.on('sendPge', function(evt,data) {
  //console.log(data,'sendPgesendPgesendPge');
  pageUrls = data;
  //const win = BrowserWindow.getFocusedWindow();
  //win.webContents.send("update items", data,allcc);
});
ipcMain.on('sendDownpage', function(evt,data) {
  //console.log(data,pageUrls,'pageUrlspageUrlspageUrls');
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  //console.log(nowW[0].getBrowserViews());
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.downloadURL(pageUrls[0]);
  }
  //const win = BrowserWindow.getFocusedWindow();
  //win.webContents.send("update items", data,allcc);
});

ipcMain.on('sendAutoPage', function(evt,data) {
  console.log('sendAutoPagesendAutoPagesendAutoPage',data);
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.executeJavaScript(`
      window.pingBtm();
    `);
  }
});
