

//查询二级分类
var page = 1;
var pageSize = 6;
function render() {
    //发送ajax请求
    $.ajax({
        type: "get",
        url: "/category/querySecondCategoryPaging",
        data: {
            page: page,
            pageSize: pageSize
        },
        success: function (info) {
            // console.log(info);
            //结合模板
            $("tbody").html(template("tpl-1", info));
            //分页
            $("#paginator").bootstrapPaginator({
                bootstrapMajorVersion: 3,
                size: "small",
                currentPage: page,
                numberOfPages: 3,
                totalPages: Math.ceil(info.total / pageSize),
                onPageClicked: function (a, b, c, p) {
                    page = p;
                    render();
                }
            })
        }
    })
}
render();

//查询一级分类
$("#addcl").on("click", function () {
    //显示模态框
    $('#addModalcl').modal('show');
    // 发送ajax请求
    $.ajax({
        url: "/category/queryTopCategoryPaging",
        type: "get",
        data: {
            page: 1,
            pageSize: 100,
        },
        success: function (info) {
            // console.log(info);
            //结合模板
            $(".dropdown-menu").html(template("tpl-2", info));
        }
    })
})

//点击a选中一级分类
$(".dropdown-menu").on("click", 'a', function () {
    //获取点击值与id
    var id = $(this).data("id");
    var val = $(this).text();
    $("#dropdownMenu1").text(val);
    $("[name='categoryId']").val(id);
    $("[name='categoryId']").text(val);
    //手动校验通过
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
});

//图片上传
$("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) { //图片上传成功之后的回调函数
        // console.log(data);
        console.log(data.result.picAddr);
        //显示图片在div中
        $("#logo").attr("src", data.result.picAddr);
        //把图片的地址赋值给input-pic1
         $("[name='brandLogo']").val(data.result.picAddr);
        //手动更改图片校验
          $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID" );
    },
});

// 异步表单较验
var $form = $("#form");
$form.bootstrapValidator({
    //1. 指定不校验的类型
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields: {
        //name ="categoryName"  的规则
        categoryId: {
            validators: {
                notEmpty: {
                    message: "请选择一级分类"
                }
            }
        },
        brandName: {
            validators: {
                notEmpty: {
                    message: "请输入二级分类的名称"
                }
            }
        },
        brandLogo: {
            validators: {
                notEmpty: {
                    message: "请上传一张图片"
                }
            }
        },
    },
})
//校验完成 发送ajax请求
$form.on("success.form.bv",function(e){
    //阻止 跳转
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "/category/addSecondCategory",
        data:$form.serialize() ,
        success: function(info){
            // console.log(info);
            if(info.success){
                page:1;
                render();
                //关闭模态框
                $('#addModalcl').modal('hide');
            }
        }
    });
})
































