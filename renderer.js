// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var { ipcRenderer,remote} = require('electron');
const { dialog } = remote;

var sendOne = document.querySelector('#sendone');
var sendTwo = document.querySelector('#sendtwo');
var sendBak = document.querySelector('#baknow');
var sendRefresh = document.querySelector('#refresh');
var golppage = document.querySelector('#goploop');
var goqueue = document.querySelector('#goqueue');
var isAuto = false,nowPageUrl='';

var updateTips = function(a){
    document.querySelector('#itcount').value = a;
}
var updateNowp = function(a){
    var allem = document.getElementsByTagName('EM');
    allem[1].innerHTML = a;
}
var updateTotal = function(a,b,c){
    var allem = document.getElementsByTagName('EM');
    allem[0].innerHTML = a;
    allem[1].innerHTML = b;
    allem[2].innerHTML = c;
}
var updateUrl = function(u) {
    nowPageUrl = u;
}
document.querySelector('#scrolldown').onclick=function(){
    console.log(nowPageUrl,'nowPageUrl');
    //ipcRenderer.send('sendBtm','1');
    //sendCartBtm
    if(String(nowPageUrl).indexOf('collect')>-1){
        ipcRenderer.send('sendBtm','1');
    }
    if(String(nowPageUrl).indexOf('cart')>-1){
        ipcRenderer.send('sendCartBtm','1');
    }
    //window.scrollTo(0,3000)
}
document.querySelector('#backpage').onclick=function(){
    ipcRenderer.send('sendPageback','1');
    //window.scrollTo(0,3000)
}
document.querySelector('#sendcart').onclick=function(){
    ipcRenderer.send('sendM','https://cart.taobao.com/cart.htm');
}
document.querySelector('#nowstop').onclick=function(){
    ipcRenderer.send('sendStop',true);
}
document.querySelector('#lookbak').onclick=function(){
    ipcRenderer.send('goBackup','1');
    //window.scrollTo(0,3000)
}
document.querySelector('#downnow').onclick=function(){
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths);
        ipcRenderer.send('sendD',{
            //url:'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png',
            url:'file:///D:/Code/favbak/tmp/login.html',
            pp:result.filePaths[0]
        });
    }).catch(err => {
        console.log(err)
    })
    //ipcRenderer.send('sendD','https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png');
    //ipcRenderer.send('sendM','https://login.taobao.com/member/login.jhtml');
}
sendOne.onclick=function(){
    ipcRenderer.send('sendM','https://login.taobao.com/member/login.jhtml');
    //document.querySelector('.login-box-warp').style.right = 'auto';
    //document.querySelector('.login-box-warp').style.left = '0px;'
    //document.querySelector('.login-adlink').style.display = 'none';
}
sendTwo.onclick=function(){
    ipcRenderer.send('sendM','https://shoucang.taobao.com/item_collect.htm');
}
/*sendRefresh.onclick=function(){
    ipcRenderer.send('sendR','1');
}

sendBak.onclick=function(){
    ipcRenderer.send('sendBak','1');
}*/
golppage.onclick=function(){
    //auto loop page
    if(document.querySelector('#startpage').value!=''){
        ipcRenderer.send('sendNextpage',document.querySelector('#startpage').value);    
    }
    //ipcRenderer.send('sendDownpage',document.querySelector('#startpage').value);
}
goqueue.onclick=function(){
    //auto loop page
    if(String(nowPageUrl).indexOf('collect')>-1){
        ipcRenderer.send('sendAutoPage','1');    
    }
    if(String(nowPageUrl).indexOf('cart')>-1){
        ipcRenderer.send('sendAutoCart','1');    
    }
}

ipcRenderer.on("download complete", (event, file) => {
    console.log(file,'ddddddddddddddddddddd'); // Full file path
});

ipcRenderer.on("update tips", (event, count) => {
    updateTips(count);
});
ipcRenderer.on("reset tips", (event, count) => {
    updateTips(30);
});
ipcRenderer.on("update now page", (event, count) => {
    updateNowp(count);
});

ipcRenderer.on("update now url", (event, url) => {
    updateUrl(url);
});

ipcRenderer.on("update items", (event, count,allcc) => {
    console.log(count,'update itemsupdate itemsupdate items'); // Full file path
    updateTips(count);
    updateTotal(...allcc);
});

const myDelay = (t, cb) => {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            cb();
            resolve();
        }, t);
    });
}

var twoStep = function(){
    var d = new Promise(function(resolve, reject){resolve();});
    function goLoop(){
        ipcRenderer.send('sendAutoPage','1');
    }

    var step = function(def) {
      def.then(function(){
        return myDelay(1000, goLoop);
      }).then(function(){
          console.log('end 555555');
      });
    }
  
    step(d);
  }

ipcRenderer.on('set auto', (event, args) => {
    isAuto = true;
    twoStep();
    console.log('set auto status ...',args);
});
ipcRenderer.on('downloadStated', (event, args) => {
    console.log('start download ...',args);
});
ipcRenderer.on('downloadInProgress', (event, args) => {
    console.log('download99999 ...',args);
});
ipcRenderer.on('downloadCompleted', (event, args) => {
    console.log('down! 00000',args);
});
