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

var getCart = function() {
  var allli = document.querySelector('#J_OrderList').getElementsByClassName('item-content');
  
  var output =[];
  for (let k = 0; k < allli.length; k++) {
    let nowitem = allli[k];
    let nowshp= allli[k].parentElement.parentElement.parentElement.getAttribute("ID").split('_');
    let nowhtml = nowitem.innerHTML.replace('title="商品被下架、删除、库存不足，或商家处于被监管或冻结状态"','').replace('href=\"//service.taobao.com/support/knowledge-1116245.htm\"','').replace(/\s+/g, " ");
    let nowhtmlp = '';
    let foundp = -1;
    if(nowshp.length>0){
      foundp = nowshp[3];
    }//else{
      //console.log(k,'undefinedundefinedundefined');
    //}
    
    let getlink = /(href|title|src)="(.*?)"/g;
    let getpriceId = /id=(\d+)/g;
    let getshopid = /user_number_id=(\d+)/g;
    let getpriceOld = /￥(\d+).(\d+)/g;
    let found = nowhtml.match(getlink);
    let foundold = nowhtml.match(getpriceOld);
    
    //console.log(foundp,'foundpfoundp');
    if(found.length>0){
      let linksrc = found[0].replace('href="','').replace('"','');
      let linktitle = found[1].replace('title="','').replace('"','');
      //console.log(linksrc,linktitle,k);
      let linkimg = found[2].replace('src="','').replace('"','').replace('160x160xz','430x430q90'); 
      let linkold = (foundold!=null ? foundold[0].replace('￥','') : 0);
      let linkpp = (foundold!=null ? foundold[1].replace('￥','') : 0);
      let foundid = linksrc.match(getpriceId);
      if(foundid===null)foundid=[-1];
      if(foundid!=null && foundid.length>0){
        let opkey = String(foundid[0]).replace('id=','');
        let opkeyp = '//store.taobao.com/shop/view_shop.htm?user_number_id='+foundp;
        //,'shop':linkshop
        output.push({
          'id':opkey,'t':linktitle,'lk':linksrc,'img':linkimg,'old':linkold,'price':linkpp,'shop':opkeyp
        })
        //output[foundid[0]] = linksrc;  
      }  
    }
  } 
  //console.log(output);
  return output; 
}

var oneStep = function(isauto,start){
  var d = new Promise(function(resolve, reject){resolve();});
  function toBtm(){
    window.scrollTo(0,document.body.scrollHeight-600);
    ipcRenderer.send('sendChkOnly',chkLens());
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
        if(typeof isauto =='undefined'){
          ipcRenderer.send('sendBak','1');
        }else{
          window.pingHtml(isauto,start);
        }
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

var chkCartTotals = function() {
  var allli = document.querySelector('#J_OrderList').getElementsByClassName('item-content'); 
  return allli.length
}


var getPageUrls = function(){
  let firstpu = 'https://shoucang.taobao.com/item_collect.htm';
  let totalpage = String(document.getElementsByClassName('page-jump-form')[0].innerText).split(',')[0].match(/(\d+)/gi)[0];
  let nowpage = (document.getElementsByClassName('dpl-paginator-curr').length > 0 ? document.getElementsByClassName('dpl-paginator-curr')[0].innerText : 0);
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
    //https://shoucang.taobao.com/item_collect.htm?startRow=1680 
    let thiurl = ['https://shoucang.taobao.com/item_collect.htm?','startRow=',offsetstart].join('');
    output.push(thiurl);
  }

  if(nowpage>1){
    output = output.slice(nowpage-1);  
  }
  //document.getElementsByClassName('J_HotPoint')[2].getAttribute('href').match(/([^?&=]+)=([^?&=]+|)/gi);
  return output;
}

window.pingChk = () => {
  ipcRenderer.send('sendChk',chkLens(),chkTotals());
  ipcRenderer.send('sendPge',getPageUrls());
  //ipcRenderer.sendToHost('ping')
}
window.pingCartChk = () => {
  ipcRenderer.send('sendChkOnly',chkCartTotals());
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
  let alltt = chkTotals();
  ipcRenderer.send('sendPageOnly',alltt[1]);
  console.log(autoFlag,'autoFlagautoFlagautoFlag');
  return autoFlag;
  //ipcRenderer.sendToHost('ping')
}

window.pingHtml = (isauto,k) => {
  let auto = true,startk = '';
  if(typeof isauto!='undefined'){
    auto = isauto;
  }
  if(typeof k!='undefined' && k!=''){
    startk = k;
  }
  //console.log(k,startk,'startkstartkstartkstartk');
  ipcRenderer.send('sendH', {
    'list':getFav(),
    'auto':auto,
    'startindex':startk,
    'name':(document.getElementsByClassName('dpl-paginator-curr').length > 0 ? document.getElementsByClassName('dpl-paginator-curr')[0].innerText : 'NaN')
  });
}

window.pingCart = () => {
  ipcRenderer.send('sendH', {
    'list':getCart(),
    'auto':false,
    'startindex':0,
    'name':'cart'
  });
}

window.pingBtm = (a,s) => {
  //console.log(a,s,'pingBtmpingBtmpingBtm');
  oneStep(a,s);
}
window.pingNxt = () => {
  //console.log('pingNxtpingNxtpingNxtpingNxtpingNxt');
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