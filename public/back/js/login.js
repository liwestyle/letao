// 公共js
//表单校验


$form = $("form");
$form.bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-thumbs-up',
        invalid: 'glyphicon glyphicon-remove-sign',
        validating: 'glyphicon glyphicon-refresh'
        // glyphicon glyphicon-thumbs-up
    },
    //3. 指定校验字段
    fields: {
        username: {
            //username的规则
            validators: {
                notEmpty: {
                    message: "用户名不能为空"
                },
                callback: {
                    message: "用户名不存在"
                },
                //长度校验
                // stringLength: {
                //     min: 6,
                //     max: 30,
                //     message: '用户名长度必须在6到30之间'
                // },
            }
        },

        password: {
            validators: {
                notEmpty: {
                    message: "用户密码不能为空"
                },
                stringLength: {
                    min: 6,
                    max: 12,
                    message: "密码长度是6-12位"
                },
                callback: {
                    message: "密码错误"
                }
            }
        }
    },



})

//表单校验成功 发送ajax请求
$form.on("success.form.bv", function (e) {
    //阻止浏览器的默认行为
    e.preventDefault();
    // console.log(222)
    $.ajax({
        type: "post",
        url: "/employee/employeeLogin",
        data: $form.serialize(),
        beforeSend: function(){
            NProgress.start()
        },
        success: function (info) {
            console.log(info);
            if (info.success) {
                location.href = "index.html";
            };
            if (info.error == 1000) {
                console.log("name")
                //手动调用方法，updateStatus让username校验失败即可
                //第一个参数：改变哪个字段
                //第二个参数：改成什么状态  VALID:通过  INVALID:不通过
                //第三个参数：选择提示的信息
                $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
            }
            if (info.error == 1001) {
                $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
            };
            NProgress.done();
        }
    })
})

  //重置功能，重置样式
  $("[type='reset']").on("click", function () {
    //重置样式
    $form.data("bootstrapValidator").resetForm();
  });































