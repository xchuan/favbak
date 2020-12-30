var { ipcMain} = require('electron');

ipcMain.on('sendM',function(evt,data) {
  console.log(data);
  console.log(evt);
})