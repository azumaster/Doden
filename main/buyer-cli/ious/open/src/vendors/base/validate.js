/*
* xy 2017-06-23
* 验证数据方法;
* */

let validate = {};

validate.mobile = (mobile) => {
    var reg = /^1[0-9]{10}$/;
    return reg.test(mobile);
};

export default validate;