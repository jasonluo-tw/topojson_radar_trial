var vm

vm = new Vue({
    el: "#app",
    data: {
        table_header: [],
        table_content: [],
        title: "",
        datetime: ""
    },
    mounted () {
        var dragbar1 = new dragBar("predict")
        dragbar1.init("202203010000", "202203010210", dragFun)
        //
        var dragbar2 = new dragBar("real")
        dragbar2.init("202203010000", "202203010210", dragFun)
    }
})
vm.table_header = ["Name", "11:20","11:30","11:40","11:50","12:00","12:10", "pred", "obs"]//,"12:20","12:30","12:40","12:50","13:00","13:10"]

all_content = []
for(let i=0; i<39; i++){
    all_content.push(["信義區", 0, 0, 0, 0, 0, 0, 1, 2])
}
//vm.table_content = [["信義區", 0, 0, 0, 0, 0, 0, 1, 2]]//, 0, 0, 0, 0, 0, 0]]
vm.table_content = all_content

//console.log("HelloWorld")
//initDragBar("2022030100", "2022030223", dragFun)

function dragFun(tdate) {
    console.log('Drag~~: '+tdate)
}