const bkItem = function(args) {
    const title = args.t;
    const img = args.img;
    const lnk = args.lk;
    return (`<li class="bklis">
            <div class="item">
                <a href="https:${lnk}" target="_self"><img src="https:${img}" /></a>
                <h3>${title}</h3>
            </div>
        </li>`);
}
const bkCartItem = function(args) {
    const title = args.t;
    const img = args.img;
    const lnk = args.lk;
    return (`<li class="bklis">
            <div class="item">
                <a href="${lnk}" target="_self"><img src="${img}" /></a>
                <h3>${title}</h3>
            </div>
        </li>`);
}

var outputLst = function(lst) {
    const mainDOM = document.getElementById('backups');

    if (mainDOM) {
        mainDOM.innerHTML = lst.join('');
    }
}

var nowPage = 1;

var loadJData = function(no) {
    var xmlhttp = new XMLHttpRequest();
    var url = "tmp/"+no+".json";
    var formattorIt = bkItem;
    if(no=='cart'){
        formattorIt = bkCartItem;
    }
    xmlhttp.onreadystatechange = function() {
        let allgp =['<ul>']
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            //console.log(bkItem(myArr[0]));
            for (let index = 0; index < myArr.length; index++) {
                allgp.push(formattorIt(myArr[index]));
            }
            allgp.push('</ul>'); 
            outputLst(allgp)
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

var prevP = function() {
    nowPage-=1;
    if(nowPage<=0)nowPage=1;
    loadJData(nowPage);
}
var nextP = function() {
    nowPage+=1;
    if(nowPage>20)nowPage=20;
    loadJData(nowPage);
}

var goCart = function() {
    loadJData('cart');    
}

loadJData(1);