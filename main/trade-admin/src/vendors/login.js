/**
 * Created by john on 2016/2/22.
 */
$(function () {
    var userInput = $('#username'),
        passInput = $('#password'),
        params = {};

    $('#loginBtn').on('click',function(e){
        e.preventDefault();
        var _this = this;
        $(_this).attr("disabled","disabled");
        $(_this).css('opacity', '.6');
        if (!userInput.val()) {
            prompt(_this, '用户名不能为空');
            userInput.focus();
            return;
        }
        if (!passInput.val()) {
            prompt(_this, '密码不能为空');
            passInput.focus();
            return;
        }
        params.login_name = userInput.val();
        params.login_password = passInput.val();
        H.server.login(params,function(res){
            if (res.code == 0) {
                window.location.href = '/user/home';
            } else {
                prompt(_this, res.message);
            }
        });
    });

    function prompt(obj,text){
        if(text){
            $('#prompt').css('visibility', 'visible');
            $('#prompt').html(text);
            $(obj).removeAttr("disabled");
            $(obj).css('opacity', '1');
        }else {
            $('#prompt').css('visibility', 'hidden');
        }
    }
});