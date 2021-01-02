// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer,remote } = require('electron')    

global.pingHost = () => {
  ipcRenderer.sendToHost('ping')
}

global.pingHtml = () => {
  ipcRenderer.send('senH', document.body.innerHTML);
}

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
