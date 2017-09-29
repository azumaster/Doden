import React from "react";
import LoanContract from './loan-contract.jsx';
import Withholding from './Withholding.jsx';

class Pay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hash: location.hash.substr(1),
            payWayData: null,    //获取的支付方式数据;
            payWay: null,        //当前选择的支付方式;
            bankList: []         //可选择的银行卡列表;
        };
        location.href = '#';
    }

    componentWillMount() {
        window.onhashchange = () => {
            let hash = location.hash.substr(1);
            this.setState({hash: hash});
        };
        this.getPayWay();
    }

    //获取支付信息;
    getPayWay () {
        let server = H.server;
        let p = {"main_order_no": this.props.orderNo};
        H.we_loading.show();
        server.order_payment_mode(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0){
                this.setState({payWayData: res.data});
            }else {
                H.dialog(res.message);
            }
        })
    }

    closePaySheet() {
        this.props.closePaySheet();
    }

    //获取银行转账的信息;
    bankPay() {
        H.server.order_payment_mode_info({pay_mode: 'bank'}, (res) => {
            if(res.code == 0){
                let d = res.data,
                    dom = (
                        <div className="pay-content">
                            <div className="hd">请选择支付方式</div>
                            <div className="bd">
                                <div className="back-desc-info">
                                    <p>开户行：{d.account_info[0].bank_name + d.account_info[0].bank_address}</p>
                                    <p>账号：{d.account_info[0].bank_account_no}</p>
                                    <p>户名：{d.account_info[0].bank_account_name}</p>
                                    <div className="prompt">提示：打款时请务必备注<span style={{color: "#14a65f"}}>店铺名</span>，财务人员会在30分钟内处理收款。</div>
                                    <div className="btn-group"><a className="contact sheet-btn sheet-btn-icon" href={'tel:'+d.customer_phone}>联系客服</a></div>
                                </div>
                            </div>
                            <div className="ft flex-box"><div className="flex-num1 confirm" onClick={this.bankBack.bind(this)}>返回</div></div>
                        </div>
                    );
                this.setState({payResult: dom, bankInfo: res.data});
            }else {
                H.dialog(res.message);
            }
        });
    }

    //从银行支付说明返回到选择支付列表;
    bankBack(s) {
        if(s == 1) {
            location.reload();
        }else {
            this.setState({payResult: null});
        }
    }

    //宝付微信支付;
    baofooWechatPub () {
        let p = {
            main_order_no: this.props.orderNo,
            pay_method: 'baofoo_wechat_pub'
        };
        H.we_loading.show();
        H.server.getPaymentCharge(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                if(res.data.isRaw == 1) {
                    this.onBridgeReady(res.data.charge);
                }else {
                    location.href = res.data.charge;
                }
            }else {
                H.dialog(res.message);
            }
        });
    }

    //微信H5支付;
    onBridgeReady(d){
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": d.appId,     //公众号名称，由商户传入
                "timeStamp": d.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": d.nonceStr, //随机串
                "package": d.package,
                "signType": d.signType,         //微信签名方式：
                "paySign": d.paySign //微信签名
            },
            function(res){
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    this.paySuccess();
                }else {
                    this.payErr();
                }
            }
        );
    }

    //支付成功显示效果;
    paySuccess() {
        let dom = (
            <div className="pay-content">
                <div className="hd">付款成功</div>
                <div className="bd">
                    <div className="actionsheet_cell read-only">
                        <div className="text-center">
                            <i className="icon-font icon-success">&#xe606;</i>
                            <p className="text-center">我们会尽快安排发货</p>
                        </div>
                    </div>
                </div>
                <div className="ft flex-box"><div className="flex-num1 confirm" onClick={this.bankBack.bind(this, 1)}>返回</div></div>
            </div>
        );
        this.setState({payResult: dom});
    }

    //支付失败显示效果;
    payErr() {
        let dom = (
            <div className="pay-content">
                <div className="hd">付款失败</div>
                <div className="bd">
                    <div className="actionsheet_cell read-only">
                        <div className="text-center">
                            <i className="icon-font icon-error">&#xe604;</i>
                            <p className="text-center">如果微信已扣费，请联系客服人工处理</p>
                            <p className="text-center">如果未扣费，您可以返回重新付款</p>
                        </div>
                    </div>
                </div>
                <div className="ft flex-box"><div className="flex-num1 confirm" onClick={this.bankBack.bind(this)}>返回</div></div>
            </div>
        );
        this.setState({payResult: dom});
    }

    //选择宝付快捷支付;
    baofooQuickPub() {
        H.we_loading.show();
        H.server.getPayIdentity({}, (res) => {
            if(res.code == 0) {
                H.we_loading.hide();
                this.setState({bankList: res.data});
                if(res.data.length > 0) {    //如果获取的列表有数据时，直接让用户去选择，如果没有数据时，直接让用户去添加;
                    location.href = '#bankList';
                }else {
                    location.href = '#addBank';
                }
            }else {
                H.dialog(res.message);
            }
        });
    }

    //微信原生支付;
    wechatPub() {
        let server = H.server,
            p = {
                main_order_no: this.props.orderNo,
                pay_method: 'wechat_pub'
            };
        server.weChat_pay(p, (res) => {
            if(res.code == 0){
                let _this = this;

                var payDataObj = res.data.charge;
                wx.chooseWXPay({
                    timestamp: payDataObj.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: payDataObj.nonceStr, // 支付签名随机串，不长于 32 位
                    package: payDataObj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: payDataObj.paySign, // 支付签名
                    success: function (res) {
                        if(res.errMsg == 'chooseWXPay:ok') {
                            _this.paySuccess();
                        }else {
                            _this.payErr();
                        }
                    },
                    error: function (res) {
                        console.log(res);
                        _this.payErr();
                    }
                });
            }else {
                H.dialog(res.message);
            }
        });
    }

    //白条支付
    ious() {
        location.href = '#ious';
    }

    //选择支付方式;
    choosePay(key, status) {
        if(status == 0) return;
        this.setState({payWay: key}, () => {
            this.pay();
        });
    }

    //点击确认支付按钮，根据选择的支付方式payWay选择执行对应的方法;
    pay() {
        switch (this.state.payWay) {
            case 'baofoo_wechat_pub':
                this.baofooWechatPub();
                break;
            case 'baofoo_quick_pub':
                this.baofooQuickPub();
                break;
            case 'bank':
                this.bankPay();
                break;
            case 'wechat_pub':
                this.wechatPub();
                break;
            case 'ious':
                this.ious();
                break;
        }
    }

    showDesc(key) {
        switch (key) {
            case 'baofoo_wechat_pub':
                location.href = '#WeChatDesc';
                break;
            case 'baofoo_quick_pub':
                location.href = '#BackDesc';
                break;
            case 'ious':
                location.href = '#ious';
        }
    }

    render() {
        let hash = this.state.hash,
            descXML = null,
            way = this.state.payWayData,
            wayListXML = [];
        if(hash.indexOf('BackDesc') != -1) {
            descXML = (<BackDesc />);
        }else if(hash.indexOf('WeChatDesc') != -1) {
            descXML = (<WeChatDesc />);
        }else if(hash.indexOf('bankList') != -1) {
            descXML = (<ChooseBank data={this.state.bankList} orderNo={this.props.orderNo} />);
        }else if(hash.indexOf('addBank') != -1) {
            descXML = (<AddBank orderNo={this.props.orderNo} />);
        }else if(hash.indexOf('ious') != -1) {
            descXML = (<IousApply orderNo={this.props.orderNo} orderPrice={this.props.orderPrice} orderTime={this.props.orderTime} />);
        }
        if(way)
        if(way.ious) {
            wayListXML.push(
                <div className="cell" key="ious">
                    <div className={'flex-num1 ious'} onClick={this.choosePay.bind(this, 'ious', way['ious'].status)}>{way['ious'].payment_mode}{way['ious'].status == 0 ? '（开发中）' : null}</div>
                </div>
            );
        }
        for(let i in way) {
            if (i != 'ious')
            wayListXML.push(
                <div className="cell" key={i}>
                    <div className={'flex-num1 ' + i} onClick={this.choosePay.bind(this, i, way[i].status)}>{way[i].payment_mode}{way[i].status == 0 ? '（开发中）' : null}</div>
                    {
                        i == 'baofoo_wechat_pub' || i == 'baofoo_quick_pub' ?
                            <a className="desc" onClick={this.showDesc.bind(this, i)}>查看限额</a> : null
                    }
                </div>
            );
        }

        return (
            <div className="pay-wrap">
                <div className="pay-mask"></div>
                {
                    this.state.payResult ? this.state.payResult :
                    <div className="pay-content">
                        <div className="hd">请选择支付方式</div>
                        <div className="bd">
                            {wayListXML}
                        </div>
                        <div className="ft flex-box"><div className="flex-num1 cancel" onClick={this.closePaySheet.bind(this)}>取消</div></div>
                    </div>
                }
                {descXML}
            </div>
        );
    }
}
//<div className="flex-num1 confirm" onClick={this.pay.bind(this)}>确定</div>
export default Pay;

//微信支付的查看限额;
class WeChatDesc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null
        }
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("payDescContent"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    historyBack() {
        history.back();
    }


    render() {
        return (
            <div className="pay-desc">
                <div className="hd flex-box">
                    <div className="flex-num1">银行</div><div className="flex-num1">储蓄卡限额</div><div className="flex-num1">信用卡限额</div>
                </div>
                <div id="payDescContent" className="bd">
                    <div className="scroller">
                        <table cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr><td>工商银行</td><td>1万元/笔<br/>5万元/日</td><td>1万元/笔<br/>5万元/日</td></tr>
                                <tr><td>农业银行</td><td>1万元/笔<br/>1万元/日</td><td>1万元/笔<br/>1万元/日</td></tr>
                                <tr><td>招商银行</td><td>5万元/笔<br/>5万元/日</td><td>3万元/笔<br/>3万元/日</td></tr>
                                <tr><td>建设银行</td><td>1万元/笔<br/>5万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>中国银行</td><td>2万元/笔<br/>2万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>光大银行</td><td>5万元/笔<br/>5万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>广发银行</td><td>5万元/笔<br/>5万元/日</td><td>3万元/笔<br/>3万元/日</td></tr>
                                <tr><td>平安银行</td><td>5万元/笔<br/>5万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>中信银行</td><td>10万元/笔<br/>10万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>兴业银行</td><td>3万元/笔<br/>3万元/日</td><td>3万元/笔<br/>5万元/日</td></tr>
                                <tr><td>民生银行</td><td>5万元/笔<br/>5万元/日</td><td>3万元/笔<br/>5万元/日</td></tr>
                                <tr><td>浦发银行</td><td>30万元/笔<br/>50万元/日</td><td>5万元/笔<br/>5万元/日</td></tr>
                                <tr><td>邮政银行</td><td>5千元/笔<br/>5千元/日</td><td>2万元/笔<br/>5万元/日</td></tr>
                                <tr><td>交通银行</td><td>5万元/笔<br/>5万元/日</td><td>2.5万元/笔<br/>2.5万元/日</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="ft" onClick={this.historyBack}>关闭</div>
            </div>
        );
    }
}

//银行快捷支付查看限额;
class BackDesc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null
        }
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("backDescContent"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    historyBack() {
        history.back();
    }

    render() {
        return (
            <div className="pay-desc">
                <div className="hd flex-box">
                    <div className="flex-num1">银行</div><div className="flex-num1">单笔限额</div><div className="flex-num1">单日限额</div>
                </div>
                <div id="backDescContent" className="bd">
                    <div className="scroller">
                        <table cellSpacing="0" cellPadding="0">
                            <tbody style={{lineHeight: 2}}>
                                <tr><td>工商银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>农业银行</td><td>2千</td><td>1万</td></tr>
                                <tr><td>中国银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>建设银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>交通银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>邮政储蓄银行</td><td>2千</td><td>5千</td></tr>
                                <tr><td>兴业银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>光大银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>平安银行</td><td>5万</td><td>5万</td></tr>
                                <tr><td>浦发银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>中信银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>上海银行</td><td>2万</td><td>5万</td></tr>
                                <tr><td>北京银行</td><td>2万</td><td>5万</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="ft" onClick={this.historyBack}>关闭</div>
            </div>
        );
    }
}

//银行快捷支付的可选列表;
class ChooseBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            paymentId: null
        }
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("bankList"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    select(id) {
        this.setState({paymentId: id});
    }

    CreateList() {
        let data = this.props.data,
            arr = {},
            XML = [];
        for(let i = 0 ; i < data.length ; i++) {
            if(arr[data[i].name]) {
                arr[data[i].name].push(data[i]);
            }else {
                arr[data[i].name] = [data[i]];
            }
        }
        for(let i in arr) {
            let list = arr[i],
                xml = [];
            for(let n = 0 ; n < list.length ; n++) {
                xml.push(
                    <div key={n} className="flex-box" onClick={this.select.bind(this, list[n].payment_id)}>
                        <div className={this.state.paymentId == list[n].payment_id ? 'flex-num1 bank-name active' : 'flex-num1 bank-name'}>{list[n].bank_name}</div>
                        <div className="bank-number">{'**** **** **** ' + list[n].bank_card_no}</div>
                    </div>
                );
            }
            XML.push(
                <div key={i} className="item">
                    <div className="hd">{i}</div>
                    <div className="bd">
                        {xml}
                    </div>
                </div>
            );
        }

        return XML;
    }

    //选择现有的卡去支付;
    baofooPaying() {
        if(!this.state.paymentId) {
            return ;
        }
        let p = {
            main_order_no: this.props.orderNo,
            pay_method: 'baofoo_quick_pub',
            payment_id: this.state.paymentId
        };
        H.we_loading.show();
        H.server.getPaymentCharge(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                let u= res.data.charge,
                    form = document.createElement("form"),
                    str = '';
                form.method = 'post';
                form.action = u.form_action;
                for(let i in u) {
                    if(i != 'form_action') {
                        form[i] = u[i];
                        str += '<input hidden name="'+i+'" value="'+u[i]+'" />'
                    }
                }
                form.innerHTML = str;
                document.body.appendChild(form);
                form.submit();
            }else {
                H.dialog(res.message);
            }
        });
    }

    render() {
        return (
            <div id="bankList" className="bank-list">
                <div className="scroller">
                    <div className="bank-list-content">
                        <p className="title">请选择支付银行卡</p>
                        {this.CreateList()}
                        <div className="ft">
                            <button className={this.state.paymentId ? 'next' : 'next disabled'} onClick={this.baofooPaying.bind(this)}>下一步</button>
                            <div><a className="addBank-btn" href="#addBank">使用新的身份信息</a></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//添加新的快捷支付;
class AddBank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            name: '',     //输入的用户名;
            id_card_no: ''      //输入的身份证;
        }
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("addBank"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    //更改用户名和身份证;
    changeHandler(key, e) {
        this.state[key] = e.target.value;
        this.forceUpdate();
    }

    //用新的卡去支付;
    baofooAddPaying() {
        let p = {
            main_order_no: this.props.orderNo,
            pay_method: 'baofoo_quick_pub',
            name: this.state.name,
            id_card_no: this.state.id_card_no
        };
        H.we_loading.show();
        H.server.getPaymentCharge(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                let u= res.data.charge,
                    form = document.createElement("form"),
                    str = '';
                form.method = 'post';
                form.action = u.form_action;
                for(let i in u) {
                    if(i != 'form_action') {
                        form[i] = u[i];
                        str += '<input hidden name="'+i+'" value="'+u[i]+'" />'
                    }
                }
                form.innerHTML = str;
                document.body.appendChild(form);
                form.submit();
            }else {
                H.dialog(res.message);
            }
        });
    }

    render() {
        return (
            <div id="addBank" className="add-bank">
                <div className="scroller">
                    <p className="hd">请填写身份信息</p>
                    <div className="bd">
                        <div className="input-item flex-box"><i className="icon user-icon"></i>
                            <input type="text" placeholder="请输入姓名" className="flex-num1" value={this.state.name} onChange={this.changeHandler.bind(this, 'name')} /></div>
                        <div className="input-item flex-box"><i className="icon id-icon"></i>
                            <input type="text" placeholder="请输入身份证号" className="flex-num1" value={this.state.id_card_no} onChange={this.changeHandler.bind(this, 'id_card_no')} /></div>
                    </div>
                    <div className="ft">
                        <div className="prompt">请填写准确真实的姓名和身份证，以保证支付成功。</div>
                        <button className={this.state.name && this.state.id_card_no ? 'next' : 'next disabled'} onClick={this.baofooAddPaying.bind(this)}>下一步</button>
                    </div>
                </div>
            </div>
        );
    }
}

//白条支付支用申请;
class IousApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            interestRate: {},
            param: {
                apply_data: {
                    "main_order_no": this.props.orderNo,
                    "loan_money": this.props.orderPrice*100,
                    "loan_period":10,
                    "interest_rate": '',
                    "interest": ''
                },
                final_protocol: {
                    "loan_contract": 0,
                    "withhold_contract": 0
                }
            },
            applyData: null     //白条注册时填写的信息;
        };
    }

    componentWillMount() {
        this.getCreditLimit();
        this.getInterestRate();
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator(){
        // 创建iscroll实例
        var wrapper = document.getElementById("iousApply"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    //获取白条额度;
    getCreditLimit() {
        H.we_loading.show();
        H.server.getCreditLimit({}, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                this.setState({data: res.data.credit_limit});
            }else {
                H.dialog(res.message);
            }
        });
    }

    //获取利率和利息;
    getInterestRate() {
        let data = this.state.param,
            param = {
                main_order_no: data.apply_data.main_order_no,
                loan_money: data.apply_data.loan_money,
                loan_period: data.apply_data.loan_period
            };
        H.server.getInterestRate(param, (res) => {
            if(res.code == 0) {
                data.apply_data.interest_rate = res.data.interest_rate;
                data.apply_data.interest = res.data.interest;
                this.setState({param: data, interestRate: res.data});
            }else {
                H.dialog(res.message);
            }
        });
    }

    //贷款期限改变时;
    loanPeriodChange(e) {
        let data = this.state.param;
        data.apply_data.loan_period = e.target.value;
        this.setState({param: data});
    }

    //协议的状态改变时：
    changeAgreed() {
        let data = this.state.param;
        if(data.final_protocol.loan_contract != 1) {
            data.final_protocol.loan_contract = 1;
            data.final_protocol.withhold_contract = 1;
        }else {
            data.final_protocol.loan_contract = 0;
            data.final_protocol.withhold_contract = 0;
        }
        this.setState({param: data});
    }

    subApply() {
        let param = this.state.param;
        H.we_loading.show();
        H.server.apply(JSON.stringify(param), (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                H.dialog({
                    title: '申请成功',
                    content: '<div><div class="apply-success icon-font"></div><div>您可以在“我的”—“我的贷款”中查看贷款记录</div></div>',
                    okText: '完成',
                    okCallback: () => {
                        location.href = '#';
                        location.reload();
                    }
                });
            }else {
                H.dialog(res.message);
            }
        });
    }

    //
    setApplyData(data) {
        this.setState({applyData: data});
    }

    render() {
        let data = this.state.param,
            hash = location.hash,
            loan = null;
        if(hash.indexOf('LoanContract') != -1) {
            loan = (<LoanContract data={this.state.interestRate} param={this.state.param} setApplyData={this.setApplyData.bind(this)} applyData={this.state.applyData}/>);
        }else if(hash.indexOf('withholding') != -1) {
            loan = (<Withholding data={this.state.interestRate} param={this.state.param} setApplyData={this.setApplyData.bind(this)} applyData={this.state.applyData}/>);
        }
        return (
            <div>
                <div id="iousApply" className="ious-apply">
                    <div className="scroller">
                        <p className="hd">贷款申请</p>
                        <div className="bd">
                            <div className="flex-box ious-apply-item align-items-center">
                                <div className="flex-num1">订单编号</div>
                                <div>{data.apply_data.main_order_no}</div>
                            </div>
                            <hr/>
                            <div className="flex-box ious-apply-item align-items-center">
                                <div className="flex-num1">下单时间</div>
                                <div>{this.props.orderTime}</div>
                            </div>
                            <hr/>
                            <div className="flex-box ious-apply-item">
                                <div className="flex-num1">订单金额</div>
                                <div>{data.apply_data.loan_money/100}元</div>
                            </div>
                        </div>
                        <div className="bd">
                            <div className="flex-box ious-apply-item">
                                <div className="flex-num1">贷款金额</div>
                                <div>{data.apply_data.loan_money/100}元</div>
                            </div>
                            <hr/>
                            <div className="flex-box ious-apply-item">
                                <div className="flex-num1">贷款期限</div>
                                <div className="loan-period">
                                    <select className="choose-period" value={data.apply_data.loan_period} onChange={this.loanPeriodChange.bind(this)}>
                                        <option value="10">10天</option>
                                        <option value="20">20天</option>
                                        <option value="30">30天</option>
                                    </select>
                                </div>
                            </div>
                            <hr/>
                            <div className="flex-box ious-apply-item">
                                <div className="flex-num1">贷款利率</div>
                                <div>每天{data.apply_data.interest_rate}</div>
                            </div>
                            <hr/>
                            <div className="flex-box ious-apply-item">
                                <div className="flex-num1">贷款利息</div>
                                <div>{data.apply_data.interest/100}元</div>
                            </div>
                        </div>
                        <div className="ft">
                            <div>我的贷款可用额度为：<span className="ious-price">{this.state.data.available ? this.state.data.available/100 : ''}</span>元</div>
                            <p className="agreement">
                                <i className={data.final_protocol.loan_contract == 1 ? 'icon-font agreed' : 'icon-font not-agreed'} onClick={this.changeAgreed.bind(this)}></i>
                                我已阅读并同意<a className="blue" href="#ious/LoanContract">《借款合同》</a>与<a className="blue" href="#ious/withholding">《代扣协议》</a></p>
                            <button className="sub-apply" disabled={data.final_protocol.loan_contract != 1} onClick={this.subApply.bind(this)}>确认提交</button>
                        </div>
                    </div>
                </div>
                {loan}
            </div>
        );
    }
}