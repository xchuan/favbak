// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer,remote } = require('electron')    

window.pingHost = () => {
  ipcRenderer.send('sendM','gogogogog');
  //ipcRenderer.sendToHost('ping')
}
window.pingHtml = () => {
  ipcRenderer.send('sendH', document.body.innerHTML);
}

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  
  
});

/*window.addEventListener('load',() => {
   
});*/