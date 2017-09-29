/**
 * Created by john on 2016/2/26.
 */
import {Func} from "../../common/main.js";

var isLoginTimeoutInWithdraw = {
    validateIsLoginTimeout(callback){
        let server = H.server,
            params = {
                date_type : 1,
                date_begin : $('#withdraw_startTime').val(),
                date_end : $('#withdraw_endTime').val()
            };
        server.deposit_order_list(params,(res)=>{
            if (res.code == 10101) {
                Func.goLogin(res.message);
            } else {
                callback && callback();
            }
        });
    }
};

export default isLoginTimeoutInWithdraw;