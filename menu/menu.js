const { Menu,BrowserWindow,dialog }=require('electron');
const shell = require('electron').shell;

var tpl = [{
    label:'文件',
    submenu:[{
        label:'关闭',
        role:'quit'
    },{
        label:'刷新缓存',
        role:'forcereload'
    },{
        label:'开发者工具',
        role:'toggledevtools'
    },{
        label:'开发者工具II',
        click:function(){ 
            let nowW = BrowserWindow.getAllWindows();
            let allws = nowW[0].getBrowserViews();
            if(allws.length>0){
                nowView=allws[0].webContents;
                nowView.openDevTools();
            }
        }
    }]
},{
    label:'帮助',
    submenu:[{
        label:'服务协议',
        click:function(){ 
            console.log('new window');
            shell.openExternal('https://ichart.cc');
        }
    },{
        label:'关于',
        click:function(){ 
            console.log('about');
            const options = {
                type: 'info',
                defaultId: 0,cancelId:1,
                title: '关于此软件',
                message: 'Do you want to do this?',
                detail: 'It does not really matter'
            };
        
            dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                console.log(response);
                console.log(checkboxChecked);
            });
            
        }
    }]
}];
var m=Menu.buildFromTemplate(tpl);
Menu.setApplicationMenu(m);