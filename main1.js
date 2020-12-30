const { BrowserView, BrowserWindow, app } = require('electron')
function twoViews () {
  const win = new BrowserWindow({ width: 800, height: 600 })

  const view = new BrowserView()
  win.addBrowserView(view)
  view.setBounds({ x: 0, y: 0, width: 400, height: 300 })
  view.webContents.loadURL('https://electronjs.org')

  const secondView = new BrowserView()
  win.addBrowserView(secondView)
  secondView.setBounds({ x: 400, y: 0, width: 400, height: 300 })
  secondView.webContents.loadURL('https://electronjs.org')
  app.on('window-all-closed', () => {
    win.removeBrowserView(secondView)
    win.removeBrowserView(view)
    app.quit()
  })
}

app.whenReady().then(twoViews)