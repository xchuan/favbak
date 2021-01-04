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

var updateTips = function(a){
    document.querySelector('input').value = a;
}
var updateTotal = function(a,b,c){
    var allem = document.getElementsByTagName('EM');
    allem[0].innerHTML = a;
    allem[1].innerHTML = b;
    allem[2].innerHTML = c;
}
document.querySelector('#scrolldown').onclick=function(){
    ipcRenderer.send('sendBtm','1');
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
sendRefresh.onclick=function(){
    ipcRenderer.send('sendR','1');
}

sendBak.onclick=function(){
    ipcRenderer.send('sendBak','1');
}

ipcRenderer.on("download complete", (event, file) => {
    console.log(file,'ddddddddddddddddddddd'); // Full file path
});

ipcRenderer.on("update items", (event, count,allcc) => {
    console.log(count,'update itemsupdate itemsupdate items'); // Full file path
    updateTips(count);
    updateTotal(...allcc);
});
