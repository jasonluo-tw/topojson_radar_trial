//TODO: Need to change to Class?
class dragBar {
    constructor (dom_id) {
        this.dom_id = dom_id
        this.seek = document.querySelector(`#${dom_id} > .seekbar`)
        this.fill = document.querySelector(`#${dom_id} > .seekbar > .fill`);
        this.handle = document.querySelector(`#${dom_id} > .seekbar > .handle`);
        this.timetip = document.querySelector(`#${dom_id} > .seekbar > .timetip`);
        this.sdate, this.edate
        this.tdate, this.total_seconds
        console.log(this.seek)
    }

    init (sdate, edate, dragFun) {
        if(dragFun) {
            this.dragFun = dragFun
        }else{
            this.dragFun = function () {}
        }
        this.mousedown = false

        this.sdate = calDate(sdate)
        this.edate = calDate(edate)
        this.total_seconds = this.edate - this.sdate
        //TODO:
        this.fill.style.width = '0%'
        // initiate event listener
        this.initMouseDown()
        this.initMouseUp()
        this.initMouseMove()
        //
        this.initMouseMoveTooltip()
        this.initMouseLeaveTooltip()
    }

    initMouseDown () {
        // mouse down
        let $this = this
        this.seek.addEventListener('mousedown', function(e){
            $this.mousedown = true;
            // e.clientX, e.pageX
            // seek.offsetLeft, seek.getBoundingClientRect().left
            // window.scrollX
            let offset = $this.seek.getBoundingClientRect().left + window.scrollX
            var p = (e.pageX - offset) / $this.seek.clientWidth;
            $this.fill.style.width = p * 100 + '%';
        })
    }

    initMouseUp () {
        let $this = this
        this.seek.addEventListener('mouseup', function(e){
            if(!$this.mousedown) return;
            $this.mousedown = false;
            let offset = $this.seek.getBoundingClientRect().left + window.scrollX
            var p = (e.pageX - offset) / $this.seek.clientWidth;
            $this.fill.style.width = p * 100 + '%';
            console.log('Up', p);
            $this.dragFun($this.tdate)
            //alert('You choose '+ tdate)
        })
    }

    initMouseMove () {
        // the fill bar
        let $this = this
        this.seek.addEventListener('mousemove', function(e){
            if(!$this.mousedown) return;
            let offset = $this.seek.getBoundingClientRect().left + window.scrollX
            var p = (e.pageX - offset) / $this.seek.clientWidth;
            $this.fill.style.width = p * 100 + '%';
        })
    }
    // timetip
    initMouseMoveTooltip () {
        let $this = this
        this.seek.addEventListener('mousemove', function(e){
            $this.timetip.style.opacity = 1;
    
            let offset = $this.seek.getBoundingClientRect().left + window.scrollX
            var p = (e.pageX - offset) / $this.seek.clientWidth
            if(p <= 0){
              p = 0
            }else if(p >= 1){
              p = 1
            }
            //TODO: temporary
            let ndate = new Date($this.sdate.getTime() + $this.total_seconds * p)
            let nyy = ndate.getUTCFullYear().toString()
            let nmm = (ndate.getUTCMonth()+1).toString().padStart(2, 0)
            let ndd = ndate.getUTCDate().toString().padStart(2, 0)
            let nhh = ndate.getUTCHours().toString().padStart(2, 0)
            let nMM = ndate.getUTCMinutes().toString().padStart(2, 0)
            //TODO:
            nMM = nMM.substring(0, 1)
            $this.tdate = nyy+nmm+ndd+nhh+nMM+"0"
            //console.log($this.sdate.getTime(), $this.total_seconds)
            //console.log(e.pageX, offset, seek.clientWidth, p, `${nmm}/${ndd} ${nhh}:00`)
    
            $this.timetip.innerHTML = `${nmm}/${ndd} ${nhh}:${nMM}0`
    
            let ww = e.pageX - offset - $this.timetip.clientWidth / 2;
            $this.timetip.style.left = ww + 'px';
            //timetip.style.opacity = 0;
            //fill.style.width = p * 100 + '%';
        })
    }

    initMouseLeaveTooltip () {
        let $this = this
        this.seek.addEventListener('mouseleave', function(e){
            $this.timetip.style.opacity = 0
            if($this.mousedown){
                $this.dragFun($this.tdate)
                //alert('You choose '+ tdate)
            }
            $this.mousedown = false
        });
    }
}

function calDate (date_str) {
    let yy = date_str.substr(0, 4)
    let mm = date_str.substr(4, 2)
    let dd = date_str.substr(6, 2)
    let hh = date_str.substr(8, 2)
    let MM = date_str.substr(10, 2)
    let date = new Date(Date.UTC(yy, mm-1, dd, hh, MM))
    return date
}

function clamp(min,val,max){
    return Math.min(Math.max(min,val),max);
}
  

  

  



