import React from "react";

var ActionSheet = React.createClass({
    getInitialState: function() {
        return {
            showState: 0,
            payInfo: null,
            wePay: false,
            useWePay: false
        }
    },
    cancel: function() {   //关闭;
        //this.props.cancelHandler && this.props.cancelHandler();
        if(this.state.showState == 3 || this.state.showState == 4 || this.state.showState == 5){
            window.location.reload();
        } else {
            $("#mask").removeClass("fade_toggle");
            $("#mask").css("display","none");
            $("#actionsheet").removeClass("actionsheet_toggle");
            this.setState({showState: 0});
        }
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
            p = {"main_order_no": this.props.parentId.parent_order_no};
        $loading.show();
        server.weChat_pay(p, (res) => {
            $loading.hide();
            if(res.code == 0){
                let _this = this;
                console.log('开始支付');
                console.log(res);
                var payDataObj = res.data.charge;
                wx.chooseWXPay({
                    timestamp: payDataObj.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: payDataObj.nonceStr, // 支付签名随机串，不长于 32 位
                    package: payDataObj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: payDataObj.paySign, // 支付签名
                    success: function (res) {
                        if(res.errMsg == 'chooseWXPay:ok') {
                            _this.setState({showState: 3, wePay: true});
                        }else {
                            _this.setState({showState: 3, wePay: false});
                        }
                    },
                    error: function (res) {
                        console.log(res);
                        _this.setState({showState: 3, wePay: false});
                    }
                });
            }else {
                H.dialog(res.message);
            }
        });
    },
    //点已完成按钮;
    wePaySuccess: function() {
        if(this.state.wePay){
            this.setState({showState: 4});
        }else {
            this.setState({showState: 5});
        }
    },
    //点重新支付;
    wePayError: function() {
        if(this.state.wePay){
            this.setState({showState: 4});
        }else {
            this.setState({showState: 0});
        }
    },
    //获取支付信息;
    getPayWay: function(no) {
        let server = H.server;
        if(!no) return;
        let p = {"main_order_no": no || 0};
        server.order_payment_mode(p, (res) => {
            if(res.code == 0){
                if(res.data.we_chat.status == 1){
                    this.setState({useWePay: true});
                }else {
                    this.setState({useWePay: false});
                }
            }else {
                H.dialog(res.message);
            }
        })
    },
    //componentWillMount: function() {
    //    this.getPayWay();
    //},
    componentWillReceiveProps: function(nextProps) {
        this.getPayWay(nextProps.parentId.parent_order_no);
    },
    render: function() {
        //<div className="actionsheet_cell"
        //     onTouchStart={this.payWay.bind(this,2)}>
        //    <a className="a-warp">
        //        <i className="icon-font alipay-pay">&#xe602;</i>支付宝转账
        //    </a>
        //</div>

        let xml = "";
        if(this.state.showState == 0){ //选择付款方式;
            let wePayXml = <div className="actionsheet_cell"
                            onTouchStart={this.wePay}>
                            <a className="a-warp">
                                <i className="icon-font weChat-pay">&#xe603;</i>
                                <span className="weChat-pay-remark">微信支付</span>
                            </a>
                        </div>;
            if(this.props.parentId.pay_amount > 10000 || !this.state.useWePay){
                wePayXml = <div className="actionsheet_cell read-only sheet-disabled">
                    <a className="a-warp">
                        <i className="icon-font weChat-pay">&#xe603;</i>
                        <span className="weChat-pay-remark">微信支付</span>
                    </a>
                </div>;
            }
            xml = (
                <div className="actionsheet_menu">
                    <div className="actionsheet_cell sheet-title read-only">
                        请选择付款方式<span id="actionsheet-loading" className="pullUpIcon">&nbsp;</span>
                    </div>
                    {wePayXml}
                    <div className="actionsheet_cell"
                         onTouchStart={this.payWay.bind(this,1)}>
                        <a className="a-warp">
                            <i className="icon-font bank-pay">银</i>网银转账
                        </a>
                    </div>

                </div>
            )
        }else if(this.state.showState == 1) { //选择了网银转账付款方式;
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