

//商品渲染
var currentpage = 1;
var pageSize = 5;
function render() {
    $.ajax({
        type: "get",
        url: '/product/queryProductDetailList',
        data: {
            page: currentpage,
            pageSize: pageSize,
        },
        success: function (info) {//回调函数 
            // console.log(info);
            //结合模板 
            var $html = template("tpl", info);
            $("tbody").html($html);
            //分页
            $("#paginator").bootstrapPaginator({
                bootstrapMajorVersion: 3,
                size: "small",
                currentPage: currentpage,
                numberOfPages: 3,
                totalPages: Math.ceil(info.total / pageSize),
                onPageClicked: function (a, b, c, p) {
                    currentpage = p;
                    render();
                }
            })
        }
    })
}

render();
//显示添加模态框 addModal
$("#addcl").on("click", function () {
    $("#addModal").modal('show');
})

// 查询二级分类
$.ajax({
    type: "get",
    url: "/category/querySecondCategoryPaging",
    data: {
        page: 1,
        pageSize: 100,
    },
    success: function (info) {
        // console.log(info);
        // 结合模板
        $(".dropdown-menu").html(template("tpl-2", info))
    }
})
var $form = $("form");
// 给查询二级分类a注册点击事件
$(".dropdown-menu").on("click", "a", function () {
    //获取点击按钮id 和值
    var id = $(this).data("id");
    var text = $(this).text();
    //赋值给点击按钮
    $("#dropdownMenu1").text(text);
    // 赋值给隐藏提交按钮
    $("[name='categoryId']").val(id);
    $("[name='categoryId']").text(text);
    //手动更改为校验成功事件
    $form.data('bootstrapValidator').updateStatus("categoryId", "VALID")

});
//上传三张图片

//每次图片上传成功就往数组存储下来上传的结果。
// 1. 判断数组的长度就知道上传了几张图片
//2. 点击添加按钮时，需要获取到图片的信息
var imgs = [];
$("#guanlian").fileupload({
    dataType: "json",
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
        if (imgs.length >= 3) {
            return;
        }
        // console.log(data);
        // 图片显示到页面中
        $(".file-img").append('<img src="' + data.result.picAddr + '"  alt="">');
        imgs.push(data.result);
        //手动更改较验状态
        if (imgs.length != 3) {
            $form.data('bootstrapValidator').updateStatus("brandLogo", "INVALID")
        } else {
            $form.data('bootstrapValidator').updateStatus("brandLogo", "VALID")
        }
    }
})



// 二级商品表单校验
$form.bootstrapValidator({
    // 指定不校验的类型
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    //3.较验字段
    fields: {
        categoryId: {
            validators: {
                notEmpty: {
                    message: "请选择二级分类的名称"
                }
            }
        },
        proName: {
            validators: {
                notEmpty: {
                    message: "请输入商品名称"
                }
            }
        },
        proDesc: {
            validators: {
                notEmpty: {
                    message: "请输入商品的描述"
                }
            }
        },
        num: {
            validators: {
                notEmpty: {
                    message: "请输入商品的库存"
                },
                // regexp: {
                //     regexp:/^[1-9]\d&/,
                //     message:"请正确输入商品库存"
                // }
            }
        },
        size: {
            validators: {
                notEmpty: {
                    message: "请输入商品的尺码(32-46)"
                },
                //较验正则
                // regexp: {
                //     regexp: /^\d{2}-\d{2}&/,
                //     message: "请正确输入尺码"
                // }
            }
        },
        oldPrice: {
            validators: {
                notEmpty: {
                    message: "请输入商品的原价"
                }
            }
        },
        price: {
            validators: {
                notEmpty: {
                    message: "请输入商品的价格"
                }
            }
        },
        brandLogo: {
            validators: {
                notEmpty: {
                    message: "请上传三张图片"
                }
            }
        },
    }
});



$form.on("success.form.bv", function (e) {
    e.preventDefault();
    var $data = $form.serialize();
    $data += "&picName1" + imgs[0].picName + "$picAddr1" + imgs[0].picAddr;
    $data += "&picName2" + imgs[1].picName + "$picAddr1" + imgs[1].picAddr;
    $data += "&picName3" + imgs[2].picName + "$picAddr1" + imgs[2].picAddr;

    //发送ajax请求
    $.ajax({
        type: "post",
        url: "/product/addProduct",
        data: $data,
        success: function (info) {
            // console.log(info);
            // 渲染
            render();
            //隐藏模态框
            $("#addModal").modal('hide');
            //重置为表单默认样式
            $form.data("bootstrapValidator").resetForm();
            $form[0].reset();
            //重置下拉菜单
            $("#dropdownMenu1").text("请选择二级分类");
            $("[name=categoryId]").data("");
            //重置图片
            $(".file-img img").remove();

        }
    })
})




