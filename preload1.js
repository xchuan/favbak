// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer} = require('electron')    

var getFav = function(){
  //document.querySelector('#fav-list ul').innerHTML
  var allli = document.querySelector('#fav-list ul').getElementsByTagName('LI');
  let getlink = /(href|title|src)="(.*?)"/g;
  let getpriceOld = /<span>([\d.]+)<\/span>/g;
  let getpriceNew = /<strong>([\d.]+)<\/strong>/g;
  let getpriceId = /id=(\d+)/g;
  var output =[];
  for (k in allli){
    let nowitem = allli[k];
    if(typeof nowitem =='object'){
      let nowhtml = nowitem.innerHTML.replace(/\s+/g, " ");
      let found = nowhtml.match(getlink);
      let foundold = nowhtml.match(getpriceOld);
      let foundp = nowhtml.match(getpriceNew);
      //if(k<100){console.log(found);}
      
      let nowkeyid;
      if(found.length>0){
        let linksrc = found[0].replace('href="','').replace('"','');
        let linkshop = found[4].replace('href="','').replace('"','');
        let linktitle = found[1].replace('title="','').replace('"','');
        let linkimg = found[2].replace('src="','').replace('"','').replace('160x160xz','430x430q90');
        let linkold = (foundold!=null ? foundold[0].replace('<span>','').replace('</span>','') : 0);
        let linkpp = (foundp!=null ? foundp[0].replace('<strong>','').replace('</strong>','') : 0);
        let foundid = linksrc.match(getpriceId);
        if(foundid.length>0){
          let opkey = String(foundid[0]).replace('id=','');
          output.push({
            'id':opkey,'t':linktitle,'lk':linksrc,'img':linkimg,'old':linkold,'price':linkpp,'shop':linkshop
          })
          //output[foundid[0]] = linksrc;  
        }
      }
    }
  };
  //console.log(output);
  return output;
  //document.querySelector('#fav-list ul').getElementsByTagName('LI')[0].innerHTML.replace(/\s+/g, " ")
  //  /(href|title|src)="(.*?)"/g
  //  /<span>(.*?)</span>/g
  //  /<strong>(.*?)</strong>/g
  //  /id=(\d+)/g
}

window.pingHost = () => {
  ipcRenderer.send('sendM','gogogogog');
  //ipcRenderer.sendToHost('ping')
}
window.pingHtml = () => {

  ipcRenderer.send('sendH', {
    'list':getFav(),
    'name':(document.getElementsByClassName('dpl-paginator-curr').length > 0 ? document.getElementsByClassName('dpl-paginator-curr')[0].innerText : 'NaN')
  });
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