// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var { ipcRenderer} = require('electron');
var sendOne = document.querySelector('#sendone');

sendOne.onclick=function(){
    //渲染进程给主进程广播数据
    //alert('111');
    ipcRenderer.send('sendM','this is  renderer');
}