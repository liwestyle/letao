
var currentPage = 1;//当前页数
var pageSize = 4; //每页显示个数
//渲染数据
function render() {
    //去后台获取一级分类的数据
    $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        data: {
            page: currentPage,
            pageSize: pageSize
        },
        success: function (info) {
            // console.log(info);
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

        },
    })
};
render();
// 添加模态框
$("#addcl").on("click", function () {
    $('#addModal').modal('show')
})
// 一级分类表单校验 
// var $addclass = $("#addclass");
var $form = $("#form");
$form.bootstrapValidator({
    // 指定不校验的类型
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        categoryName: {
            validators: {
                notEmpty: {
                    message: "请输入一级分类的名称"
                }
            }
        }
    },
})

//注册表单校验成功事件
$form.on("success.form.bv", function (e) {
    //阻止button type=submit 跳转
    e.preventDefault();
    //发送ajax 请求
    $.ajax({
        type: "post",
        data:$form.serialize() ,
        url: "/category/addTopCategory",
        success: function (info) {
            console.log(info);
            if (info.success) {
                //重新渲染第一页
                currentPage=1;
                render();
                //关闭模态框 
                $('#addModal').modal('hide')
            }
            // 并且会隐藏所有的错误提示和图标, 重置模态框
            $form.data("bootstrapValidator").resetForm();
            $form[0].reset();
        }
    })
})







