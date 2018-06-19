//头部进度条
NProgress.configure({ showSpinner: false });

$(document).ajaxStart(function () {
  NProgress.start();
});

$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  }, 500);
});

//判断帐号用户名是否存在
if(location.href.indexOf("login.html") == -1){
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        success: function(info){
            console.log(info);
            if(info.error == 400 ){
                location.href = "login.html"
            }
        }
    })
}
//导航下拉
var $child = $(".child");
$child.prev().on("click",function(){
    $child.slideToggle();
})

// 左侧淡入淡出
var $fideinout = $("#fideinout");
$fideinout.on("click",function(){
    $(".lt_aside").toggleClass("now");
    $(".lt_main").toggleClass("now");
})
//退出 功能
var $returnlog = $("#returnlog");
var $deleteuser = $("#deleteuser");
$returnlog.on("click",function(){
    $('#myModal').modal('show');
    $deleteuser.off().on("click",function(){
        $.ajax({
            url:"/employee/employeeLogout",
            type:"get",
            success:function(info){
                if(info.success){
                    location.href = "login.html";
                }
            }
        })
    })
})














