//TODO: Need to change to Class?
var seek = document.querySelector('.seekbar');
var fill = document.querySelector('.fill');
var handle = document.querySelector('.handle');
var timetip = document.querySelector('.timetip');
var sdate, edate, tdate, total_seconds
var drag_fun
console.log(seek)

//TODO: temporaily function
function initDragBar(ss, ee, fun) {
    sdate = calDate(ss)
    edate = calDate(ee)
    total_seconds = edate - sdate
    drag_fun = fun
    //TODO:
    fill.style.width = '0%';
}

function calDate(date_str) {
    let yy = date_str.substr(0, 4)
    let mm = date_str.substr(4, 2)
    let dd = date_str.substr(6, 2)
    let hh = date_str.substr(8, 2)
    let date = new Date(Date.UTC(yy, mm-1, dd, hh))

    return date
}

function clamp(min,val,max){
    return Math.min(Math.max(min,val),max);
}
  
let mousedown = false;
seek.addEventListener('mousedown', function(e){
    mousedown = true;
    // e.clientX, e.pageX
    // seek.offsetLeft, seek.getBoundingClientRect().left
    // window.scrollX
    let offset = seek.getBoundingClientRect().left + window.scrollX
    var p = (e.pageX - offset)/seek.clientWidth;
    fill.style.width = p * 100 + '%';
    console.log(p)
});
  
seek.addEventListener('mouseup', function(e){
    if(!mousedown) return;
    mousedown = false;
    let offset = seek.getBoundingClientRect().left + window.scrollX
    var p = (e.pageX - offset)/seek.clientWidth;
    fill.style.width = p * 100 + '%';
    console.log('Up', p);
    drag_fun(tdate)
    //alert('You choose '+ tdate)
});
  
// the fill bar
seek.addEventListener('mousemove', function(e){
    if(!mousedown) return;
    let offset = seek.getBoundingClientRect().left + window.scrollX
    var p = (e.pageX - offset)/seek.clientWidth;
    fill.style.width = p * 100 + '%';
});


