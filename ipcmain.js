var { ipcMain,BrowserWindow,dialog,app} = require('electron');
const fs = require('fs');
const {download} = require('electron-dl');

var nowW,nowView,pageUrls=[],isStop=false;

var goNext = function (url,k) {
  //https://shoucang.taobao.com/item_collect.htm?startRow=1680
  ///item_collect_n.htm?startRow=3360type=0&value=&tab=0&keyword=&t=1610382981150
  let nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    //nowView.loadURL(url);
    console.log(url,k,'goNexturlurlurlurlurl');
    nowView.executeJavaScript(`
      document.getElementsByClassName('J_NextPage')[0].click();
    `);
    // nowView.executeJavaScript(`
    //   window.pingNxt();
    // `);
  }
  const win = BrowserWindow.getAllWindows()[0];
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
ipcMain.on('sendNextpage',function(evt,data) {
  let nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    console.log(pageUrls[data],'uuuuuuuuuu');
    nowView.loadURL(pageUrls[data]);
    //console.log(pageUrls[data],data,'set next attr');
    //nowView.executeJavaScript('document.getElementsByClassName(\'J_NextPage\')[0].setAttribute("href","'+pageUrls[data]+'");');
  }
})
ipcMain.on('sendStop',function(evt,data) {
  isStop = data;
})
ipcMain.on('goBackup',function(evt,data) {
  let nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.loadFile('backup.html');
  }
})
ipcMain.on('sendPageback',function(evt,data) {
  let nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.goBack();
  }
})
ipcMain.on('sendBak',function(evt,data) {
  //console.log(data,'sendBaksendBak');
  if(isStop){
    console.log(data,'is Stopped!');
    return false;
  }
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

ipcMain.on('sendCartBtm',function(evt,data) {
  console.log(data,'sendBtmsendBtm22222');
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.executeJavaScript(`
      window.scrollTo(0,document.body.scrollHeight);
      window.pingCartChk();
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
  let totallen = pageUrls.length;
  console.log(data.name,pageUrls.length,pageUrls);
  fs.writeFile("tmp/"+data.name+".json", JSON.stringify(data.list), function(error) {
    if (error)
      throw error;
    console.log("Write Data("+data.name+") successfully.");
    if(data.auto){
      pageUrls.shift();
      //console.log(pageUrls.length,pageUrls[0],data.startindex,'gggggggggg');
      if(pageUrls.length>0){
        goNext(pageUrls[0],data.startindex);  
      }else{
        console.log('all done!!!');
      }
    }else{
      console.log('no loop! finished..');
    }
  });
  //const win = BrowserWindow.getAllWindows()[0];
  //await download(win, "tmp/login.html")
});

ipcMain.on('sendD', function(evt,data) {
  console.log(data,'dddddddddddddd');
  const win = BrowserWindow.getFocusedWindow();
  download(BrowserWindow.getFocusedWindow(), data.url,{directory:data.pp}).then(dl => win.webContents.send("download complete", dl.getSavePath()));
});

ipcMain.on('sendChk', function(evt,data,allcc) {
  //console.log(data,'sendChksendChksendChksendChk');
  const win = BrowserWindow.getAllWindows()[0];
  win.webContents.send("update items", data,allcc);
});
ipcMain.on('sendChkOnly', function(evt,data) {
  const win = BrowserWindow.getAllWindows()[0];
  win.webContents.send("update tips", data);
});
ipcMain.on('sendPageOnly', function(evt,data) {
  const win = BrowserWindow.getAllWindows()[0];
  win.webContents.send("update now page", data);
});

ipcMain.on('sendPge', function(evt,data) {
  //console.log(data,'sendPgesendPgesendPge');
  pageUrls = data;
  //const win = BrowserWindow.getAllWindows()[0];
  //win.webContents.send("update items", data,allcc);
});
ipcMain.on('sendDownpage', function(evt,data) {
  /*nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.downloadURL(pageUrls[0]);
  }*/
  let gostart = parseInt(data,10)
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    nowView=allws[0].webContents;
    nowView.executeJavaScript('window.pingBtm(true,'+gostart+');');
  }
});

ipcMain.on('sendAutoPage', function(evt,data) {
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    isStop = false;
    nowView=allws[0].webContents;
    nowView.executeJavaScript(`
      window.pingBtm();
    `);
  }
});
ipcMain.on('sendAutoCart', function(evt,data) {
  let gourl = String(data);
  nowW = BrowserWindow.getAllWindows();
  let allws = nowW[0].getBrowserViews();
  if(allws.length>0){
    isStop = false;
    nowView=allws[0].webContents;
    nowView.executeJavaScript(`
      window.pingCart();
    `);
  }
});