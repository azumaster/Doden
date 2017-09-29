import React from "react";

var ActionSheet = React.createClass({
    getInitialState: function() {
        return {
            showState: 0,
            payInfo: null,
            wePay: false
        }
    },
    cancel: function() {   //关闭;
        //this.props.cancelHandler && this.props.cancelHandler();
        $("#mask").removeClass("fade_toggle");
        $("#mask").css("display","none");
        $("#actionsheet").removeClass("actionsheet_toggle");
        this.setState({showState: 0});
    },
    dialPhone: function(tel) {  //拨打电话;
        window.location.href = 'tel:'+tel;
    },
    payWay: function(param) {   //获取银行卡和支付宝的支付信息;
        let server = H.server,
            $loading = $('#actionsheet-loading'),
            p = {};

        $loading.show();
        if(param == 1){
            p.pay_mode = "bank";
        }else if(param == 2) {
            p.pay_mode = "alipay";
        }
        server.order_payment_mode_info(p,(res) => {
            if(res.code == 0){
                $loading.hide();
                this.setState({payInfo: res.data,showState: param});
            }else {
                H.dialog(res.message);
            }
        });
    },
    wePay: function() {  // 微信支付;
        let server = H.server,
            $loading = $('#actionsheet-loading'),
            p = {"parentId": this.props.parentId};
        $loading.show();
        server.weChat_pay(p, (res) => {
            if(res.code == 0){
                $loading.hide();
                let charge = res.charge;
                pingpp.createPayment(charge, function(result, error){
                    if (result == "success") {
                        this.setState({wePay: true});
                        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
                    } else if (result == "fail") {
                        // charge 不正确或者微信公众账号支付失败时会在此处返回
                    } else if (result == "cancel") {
                        // 微信公众账号支付取消支付
                    }
                });
                this.setState({showState: 3});
            }
        });
    },
    //微信支付成功;
    wePaySuccess: function() {
        if(this.state.wePay){
            this.setState({showState: 4});
        }else {
            this.setState({showState: 5});
        }
    },
    //微信支付失败;
    wePayError: function() {
        if(this.state.wePay){
            this.setState({showState: 4});
        }else {
            this.setState({showState: 0});
        }
    },
    render: function() {
        let xml = "";
        if(this.state.showState == 0){ //选择付款方式;
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell sheet-title read-only">
                        请选择付款方式<span id="actionsheet-loading" className="pullUpIcon">&nbsp;</span>
                    </div>
                    <div className="actionsheet_cell"
                         onTouchStart={this.wePay}>
                        <i className="icon-font weChat-pay">&#xe603;</i>微信支付
                    </div>
                    <div className="actionsheet_cell"
                         onTouchStart={this.payWay.bind(this,1)}>
                        <i className="icon-font bank-pay">银</i>网银转账
                    </div>
                    <div className="actionsheet_cell"
                         onTouchStart={this.payWay.bind(this,2)}>
                        <i className="icon-font alipay-pay">&#xe602;</i>支付宝转账
                    </div>
                </div>
            )
        }else if(this.state.showState == 1) { //选择了网银转账付款方式;
            console.log(11);
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell read-only">请打款到以下银行账号</div>
                    <div className="actionsheet_cell read-only">
                        <p>开户行：{this.state.payInfo.account_info[0].bank_name}{this.state.payInfo.account_info[0].bank_address}</p>
                        <p>账号：{this.state.payInfo.account_info[0].bank_account_no}</p>
                        <p>户名：{this.state.payInfo.account_info[0].bank_account_name}</p>
                        <div style={{fontSize: "14px",color: "#717171",textAlign: "left",lineHeight: "25px",marginTop: "20px"}}>
                            提示：打款时请务必备注<span style={{color: "#14a65f"}}>店铺名</span>，财务人员会在30分钟内处理收款。
                        </div>
                        <div className="btn-group" style={{textAlign: "right"}}>
                            <button className="sheet-btn sheet-btn-icon" onClick={this.dialPhone.bind(this, this.state.payInfo.customer_phone)}>联系客服</button>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.showState == 2) { //选择了支付宝付款方式
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell read-only">请打款到以下账号</div>
                    <div className="actionsheet_cell read-only">
                        <p>支付宝账号：{this.state.payInfo.account_info[0].alipay_account}</p>
                        <p>支付宝户名：{this.state.payInfo.account_info[0].alipay_account_name}</p>
                        <div style={{fontSize: "14px",color: "#717171",textAlign: "left",lineHeight: "25px",marginTop: "20px"}}>
                            提示：打款时请务必备注<span style={{color: "#14a65f"}}>店铺名</span>，财务人员会在30分钟内处理收款。
                        </div>
                        <div className="btn-group" style={{textAlign: "right"}}>
                            <button className="sheet-btn sheet-btn-icon" onClick={this.dialPhone.bind(this, this.state.payInfo.customer_phone)}>联系客服</button>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.showState == 3){ //选择了微信支付;
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell read-only">微信支付说明</div>
                    <div className="actionsheet_cell read-only">
                        <p>农业银行、邮政银行限额<span className="red">5000</span>元/笔</p>
                        <p>工行、建行、中行、招行限额<span className="red">1</span>万元/笔</p>
                        <div style={{fontSize: "14px",color: "#717171",textAlign: "left",lineHeight: "25px",marginTop: "20px"}}>
                            完成付款后请点击下面按钮
                        </div>
                        <div className="btn-group" style={{textAlign: "right",marginTop: "20px"}}>
                            <button
                                className="sheet-btn sheet-btn-bg"
                                onClick={this.wePaySuccess}>
                                已完成付款
                            </button>
                            <button
                                className="sheet-btn"
                                onClick={this.wePayError}>
                                重新支付
                            </button>
                        </div>
                    </div>
                </div>
            )
        }else if(this.state.showState == 4) {  //微信支付成功;
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell read-only">付款成功</div>
                    <div className="actionsheet_cell read-only">
                        <div className="text-center">
                            <i className="icon-font icon-success">&#xe606;</i>
                            <p className="text-center">我们会尽快安排发货</p>
                        </div>
                    </div>
                </div>
            );
        }else if(this.state.showState == 5) {  //微信支付失败;
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell read-only">付款失败</div>
                    <div className="actionsheet_cell read-only">
                        <div className="text-center">
                            <i className="icon-font icon-error">&#xe604;</i>
                            <p className="text-center">如果微信已扣费，请联系客服人工处理</p>
                            <p className="text-center">如果未扣费，您可以在订单页重新付款</p>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div id="actionSheet_wrap">
                <div className="mask_transition" id="mask"></div>
                <div className="actionsheet" id="actionsheet">
                    {xml}
                    <div className="actionsheet_action">
                        <div className="actionsheet_cell" id="actionsheet_cancel" onTouchStart={this.cancel}>关闭</div>
                    </div>
                </div>
            </div>
        )
    }
});

export default ActionSheet;