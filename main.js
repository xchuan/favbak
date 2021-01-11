// Modules to control application life and create native browser window
const {app, BrowserWindow, BrowserView} = require('electron')
const path = require('path');
const store = new (require('electron-store'))
const sessionCookieStoreKey = 'cookies.favWin'

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1300,
    height: 600,
    webPreferences: {
      //contextIsolation: true,
      enableRemoteModule:true,
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
  secondView.setBounds({ x: 200, y: 0, width: 1100, height: 600 })
  secondView.webContents.loadURL('https://taobao.com')

  let loadCc = function(){
    let cookies = store.get(sessionCookieStoreKey) || [];
    let recoverTimes = cookies.length;
    if (recoverTimes <= 0) {
        //无cookie数据无需恢复现场
        return;
    }
    console.log(recoverTimes,'recoverTimesrecoverTimesrecoverTimes888888888');
    //恢复cookie现场
    cookies.forEach((cookiesItem) => {
        let {
            secure = true,
            domain = '',
            path = ''
        } = cookiesItem

        secondView.webContents.session.cookies
            .set(
                Object.assign(cookiesItem, {
                    url: (secure ? 'https://' : 'http://') + domain.replace(/^\./, '') + path
                })
            )
            .then(() => {
            })
            .catch((e) => {
                console.error({
                    message: '恢复cookie失败',
                    cookie: cookiesItem,
                    errorMessage: e.message,
                })
            })
            .finally(() => {
                recoverTimes--;
                if (recoverTimes <= 0) {
                  return
                }
            })
    });
  }
  loadCc();


  secondView.webContents.on('dom-ready', () => {
    console.log(secondView.webContents.getURL());
    let nowurl = secondView.webContents.getURL();

    if(nowurl=='https://www.taobao.com/'){
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
    }
    if(String(nowurl).indexOf('item_collect')>-1 || String(nowurl).indexOf('login.jhtml')>-1){
      //console.log('1111111111111');
      if(nowurl=='https://login.taobao.com/member/login.jhtml'){
        secondView.webContents.executeJavaScript(`
          document.querySelector('.login-box-warp').style.right = 'auto';
          document.querySelector('.login-box-warp').style.left = '0px;'
          document.querySelector('.login-adlink').style.display = 'none';
        `);  
      }
      //https://shoucang.taobao.com/item_collect_n.htm?startRow=210&type=0&value=&tab=0&keyword=&t=1610265823533
      // || String(nowurl).indexOf('item_collect_n.htm')>-1
      //console.log(String(nowurl).indexOf('item_collect.htm')>-1,nowurl,'nowurl6666');
      if(String(nowurl).indexOf('item_collect.htm')>-1){
        secondView.webContents.executeJavaScript(`
          window.pingChk();
        `);    
      }

      if(String(nowurl).indexOf('item_collect_n.htm')>-1){
        secondView.webContents.executeJavaScript(`
          window.getFlag();
        `);    
      }
      //secondView.webContents.executeJavaScript(`
      //  window.pingHtml();
      //`);
    }
  });

  let chgcc = 0;

  secondView.webContents.session.cookies.on('changed', () => {
    //检测cookies变动事件，标记cookies发生变化
    //console.log('isCookiesChanged!');
    secondView.webContents.session.cookies.get({})
      .then((cookies) => {
        if(chgcc%30==0){
          //console.log(cookies,'isCookiesChanged!',chgcc);
          store.set(sessionCookieStoreKey, cookies);  
        }
        chgcc++;
      })
      .catch((error) => {
        console.log({error})
      })
      .finally(() => {
          
      })
  });

  function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  //'did-redirect-navigation
  secondView.webContents.on('did-navigation', (evt,url) => {
    console.log(url,'did-redirect-navigationdid-redirect-navigationdid-redirect-navigation');
  });

  secondView.webContents.session.on('will-download', (event, item, webContents) => {
    let uid = guid();

    win.webContents.send('downloadStated', {
      itemTotal: item.getTotalBytes(),
      received: item.getReceivedBytes(),
      name: item.getFilename(),
      path: item.getSavePath(),
      urlpath: uid,
      status:'startd'
    });
    
    item.on('updated', (event, state) => {
      if (win.isDestroyed()) {
          return;
      }
      if (state === 'interrupted') {
          // Interrupted
      } else if (state === 'progressing') {
          if (item.isPaused()) {
              // Handle pause
          } else {
            win.webContents.send('downloadInProgress', {
              itemTotal: item.getTotalBytes(),
              received: item.getReceivedBytes(),
              name: item.getFilename(),
              path: item.getSavePath(),
              urlpath: uid,
              status:'downloading'
            });
          }
      }
    });

    item.once('done', (event, state) => {
      if (win.isDestroyed()) {
          return;
      }
      if (state === 'completed') {
        win.webContents.send('downloadCompleted', {
          itemTotal: item.getTotalBytes(),
          received: item.getReceivedBytes(),
          name: item.getFilename(),
          path: item.getSavePath(),
          urlpath: uid,
          status:'finish'
        });
      } else {
          // Handle
      }
    });
  });
  //secondView.webContents.loadFile('tb.html')
  
  app.on('window-all-closed', () => {
    win.removeBrowserView(secondView)
    //win.removeBrowserView(view)
    //app.quit()
  })

  // Open the DevTools.
  secondView.webContents.openDevTools();
  //win.webContents.openDevTools();
  require('./ipcmain.js');
  require('./menu/menu.js');
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
