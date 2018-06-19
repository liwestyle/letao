//获取数据

var currentPage = 1;
var pageSize = 5;
function render() {
    $.ajax({
        type: "get",
        url: "/user/queryUser",
        data: {
            page: currentPage,
            pageSize: pageSize,
        },
        success: function (info) {
            console.log(info);
            // 结合模版和数据 并渲染到页面中
            $("tbody").html(template("tpl", info));
            // 渲染分页
            $("#paginator").bootstrapPaginator({
                bootstrapMajorVersion: 3,
                size: "small",
                currentPage: currentPage,
                numberOfPages: 3,
                totalPages: Math.ceil(info.total / pageSize),
                onPageClicked: function (a, b, c, p) {
                    currentPage = p;
                    render();
                }
            })

        }
    })
}
render();


//注册委托事件
$("tbody").on("click", ".btn", function () {
    //弹出模态框
    $('#revampmodal').modal('show');
    //获取id
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    //当点击确定时
    $("#revamuser").off().on("click", function () {
        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data:{
                id: id,
                isDelete : isDelete,
            },
            success: function(info){
                if(info.success){
                    //关闭模态框
                    $('#revampmodal').modal('hide');
                    //重新xuanr
                    render();
                }
            }
        })
    })
})












