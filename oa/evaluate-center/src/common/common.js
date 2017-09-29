(function () {

    let base = {};

    // 登录超时
    base.logTimeOut = function (obj) {
        obj.$Modal.error({
            title: '找冻品网 · 提示',
            content: '登录已过期，请重新登录。',
            okText: '我知道啦',
            onOk: function () {
                window.location.href = '/';
            }
        });
    };

    window.base = base;
})();