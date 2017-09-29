/**
 * Created by john on 2016/2/26.
 */
import CommonPath from '../path/common-path.js';
const CommonFunc = {
    goLogin(message) {
        H.Modal({
            content: '<span style="color:red">' + message+ '</span>',
            okCallback(){
                window.location.href = CommonPath.login;
            }
        });
    }
};

export default CommonFunc;