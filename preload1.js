// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer} = require('electron')    
const myDelay = (t, cb) => {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
        cb();
        resolve();
    }, t);
  });
}

var autoFlag = false;
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

var oneStep = function(){
  var d = new Promise(function(resolve, reject){resolve();});
  function toBtm(){
    window.scrollTo(0,document.body.scrollHeight-600);
  }

  function chkFull(){
    ipcRenderer.send('sendChkOnly',chkLens());
  }
  
  var step = function(def) {
    def.then(function(){
      return myDelay(900, toBtm);
    }).then(function(){
      return myDelay(2000, toBtm);
    }).then(function(){
      return myDelay(2000, toBtm);
    }).then(function(){
      return myDelay(2000, toBtm);
    }).then(function(){
      return chkFull(100, chkFull);
    }).then(function(){
        //step(def);
        ipcRenderer.send('sendBak','1');
        //ipcRenderer.send('sendChkOnly',chkLens());
        console.log('end 44444');
    });
  }

  step(d);
}

var chkLens = function(){
  return document.querySelector('#fav-list ul').getElementsByTagName('LI').length;  
}

var chkTotals = function(){
  let totalitems = document.querySelector('.fav-select').getElementsByTagName('EM')[0].innerText;
  let nowpage = (document.getElementsByClassName('dpl-paginator-curr').length > 0 ? document.getElementsByClassName('dpl-paginator-curr')[0].innerText : 0);
  let totalpage = String(document.getElementsByClassName('page-jump-form')[0].innerText).split(',')[0];
  return [totalitems,nowpage,totalpage]
}


var getPageUrls = function(){
  let firstpu = 'https://shoucang.taobao.com/item_collect.htm';
  let totalpage = String(document.getElementsByClassName('page-jump-form')[0].innerText).split(',')[0].match(/(\d+)/gi)[0];
  var ll=[];
  if(document.getElementsByClassName('J_HotPoint')[2].getAttribute('href')!=null){
    ll = document.getElementsByClassName('J_HotPoint')[2].getAttribute('href').match(/([^?&=]+)=([^?&=]+|)/gi);
    ll.shift();
  }
  // ([^?&=]+)=([^?&=]+|)
  let output = [];
  output.push(firstpu);
  for (let index = 1; index < parseInt(totalpage,10); index++) {
    let offsetstart = 210*index;
    let thiurl = ['https://shoucang.taobao.com/item_collect_n.htm?','startRow=',offsetstart,ll.join('&')].join('');
    output.push(thiurl);
  }
  //document.getElementsByClassName('J_HotPoint')[2].getAttribute('href').match(/([^?&=]+)=([^?&=]+|)/gi);
  return output;
}

window.pingChk = () => {
  ipcRenderer.send('sendChk',chkLens(),chkTotals());
  ipcRenderer.send('sendPge',getPageUrls());
  //ipcRenderer.sendToHost('ping')
}

window.pingHost = () => {
  ipcRenderer.send('sendM','gogogogog');
  //ipcRenderer.sendToHost('ping')
}

window.setFlag = () => {
  autoFlag = true;
  //ipcRenderer.sendToHost('ping')
}
window.getFlag = () => {
  console.log(autoFlag,'autoFlagautoFlagautoFlag');
  return autoFlag;
  //ipcRenderer.sendToHost('ping')
}

window.pingHtml = () => {

  ipcRenderer.send('sendH', {
    'list':getFav(),
    'name':(document.getElementsByClassName('dpl-paginator-curr').length > 0 ? document.getElementsByClassName('dpl-paginator-curr')[0].innerText : 'NaN')
  });
}

window.pingBtm = () => {
  oneStep();
  console.log('oneSteponeSteponeStep');
}
window.pingNxt = () => {
  console.log('pingNxtpingNxtpingNxtpingNxtpingNxt');
  twoStep();
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