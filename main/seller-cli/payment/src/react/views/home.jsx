/**
 * 货款中心首页
 * Created by Doden on 2017.07.07
 */

import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payment: {},
            userRole: 0,
            cardInfo: {},
            isShow: false
        };
    }

    componentDidMount(){
        this.getData();
        this.createScroll();
    }

    createScroll(){
        H.scroll('#paymentHome', (SCROLL)=>{
            this.SCROLL = SCROLL;
            SCROLL.on('beforeScrollStart', () => {
                SCROLL.refresh();
            });
        });
    }

    createDialogScroll(){
        H.scroll('#dialogList', (SCROLL)=>{
            this.DialogSCROLL = SCROLL;
            SCROLL.on('beforeScrollStart', () => {
                SCROLL.refresh();
            });
        });
    }

    async getData(){
        H.loading.show();
        await new Promise((resolve)=>{
            this.getPayment(resolve);
        });
        await new Promise((resolve)=>{
            this.getUserRole(resolve);
        });
        await new Promise((resolve)=>{
            this.getCard(resolve);
        });
        this.setState({
            isShow: true
        }, ()=>{
            H.loading.hide();
        });
    }

    // 获取货款中心首页信息
    getPayment(resolve){
        H.server.getPayment({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    payment: res.data
                }, ()=>{ resolve('ok'); });

            } else {
                H.toast(res.message);
            }
        });
    }
    // 获取用户角色
    getUserRole(resolve){
        H.server.getUserRole({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    userRole: res.data.shop_infos.user_role
                }, ()=>{ resolve('ok'); });

            } else {
                H.toast(res.message);
            }
        });
    }
    // 获取银行卡信息
    getCard(resolve){
        H.server.showCard({}, (res)=>{
           if(res.code == 0){
                this.setState({
                    cardInfo: res.data
                }, ()=>{resolve('ok');});
           } else {
               H.toast(res.message);
           }
        });
    }

    createHeader(){

        let have_bank_card = this.state.payment.have_bank_card;
        let btn = null;

        if(have_bank_card == 99){
            btn = (<div className="payment-btn" onClick={this.withdraw.bind(this)}><i className="icon money"></i>申请提现</div>);
        }else if(have_bank_card == 1) {
            btn = (this.state.userRole == 0?<div className="payment-btn" onClick={this.showCard.bind(this, 'bind')}><i className="icon card"></i>绑定银行卡提现</div>:
                <div className="payment-btn sm">请联系店铺老板绑定银行卡信息后提现</div>);
        }else {
            btn = (this.state.userRole == 0?<div className="payment-btn" onClick={this.showCard.bind(this, 'edit')}><i className="icon card"></i>完善银行卡信息</div>:
                <div className="payment-btn sm">请联系店铺老板完善银行卡信息后提现</div>);
        }

        return (<div className="payment-header">
            <div className="header-info">
                <p className="tip top">可提现（元）</p>
                <h1>{this.state.payment.cash}</h1>
                <p className="tip bottom">提现将收取提现金额{this.state.payment.ratio}%的提现手续费</p>
                <div className="payment-code" onClick={this.toRecode.bind(this)}>提现记录<i className="icon right"></i></div>
            </div>
            {btn}
        </div>);
    }

    createList(){
        let have_bank_card = this.state.payment.have_bank_card;
        let btn = null;

        if(have_bank_card == 99){
            // 以完善
            btn = (<ul className="payment-ul">
                {this.state.userRole == 0?<li className="payment-li" onClick={this.showCard.bind(this, 'edit')}><span>更换收款银行卡</span><i className="icon right"></i></li>:
                    <li className="payment-li" onClick={this.showCard.bind(this, 'show')}><span>查看收款银行卡</span><i className="icon right"></i></li>}
            </ul>);
        }


        return (<div className="payment-list">
            {btn}
            <ul className="payment-ul">
                <li className="payment-li" onClick={this.toOrder.bind(this, 'statement')}><span>对账单</span><i className="icon right"></i></li>
                <li className="payment-li" onClick={this.toOrder.bind(this, 'withdraw')}><span>已提现订单</span><i className="icon right"></i></li>
                <li className="payment-li" onClick={this.toOrder.bind(this, 'withdrawing')}><span>提现中订单</span><i className="icon right"></i></li>
                <li className="payment-li" onClick={this.toOrder.bind(this, 'can')}><span>可提现订单</span><i className="icon right"></i></li>
                <li className="payment-li" onClick={this.toOrder.bind(this, 'incomplete')}><span>未完成订单</span><i className="icon right"></i></li>
                <li className="payment-li" onClick={this.toHelp.bind(this)}><span>常见问题与帮助</span><i className="icon right"></i></li>
            </ul>
        </div>);
    }

    createTip(){
        return (<div className="payment-tip">
            <p>温馨提示</p>
            <p>买家确认收货后方可提现；提醒买家收货请联系买家</p>
            {this.state.cardInfo?null:<p>店铺员工不能绑定银行卡且查看完整银行信息</p>}
        </div>);
    }

    // 申请提现
    withdraw(){
        this.SCROLL.destroy();

        H.dialog({
            title: '提现信息确认',
            okText: '确认提现',
            cancel: true,
            content: '<div class="dialog-list" id="dialogList"><div class="scroller">' +
            '<div class="dialog-item"><p>提现金额(元)</p><p>'+this.state.payment.cash+'</p></div>' +
            '<div class="dialog-item"><p>收款人</p><p>'+this.state.cardInfo.name+'</p></div>' +
            '<div class="dialog-item"><p>银行卡号</p><p>'+this.state.cardInfo.card+'</p></div>' +
            '<div class="dialog-tip"><p>确认提现后，两个工作日内到账，请注意查收。</p><p>如有疑问，请联系客服。</p></div>' +
            '</div></div>',
            okCallback: ()=>{
                let cash = this.state.payment.cash;
                cash = Math.round(Number(cash.split(',').join(''))*100);
                if(cash<=0){
                    H.toast('您没有可提现的金额。');
                    return;
                }

                H.server.withdraw({orderIds: this.state.payment.order_ids.toString(), amount: cash}, (res)=>{
                    if(res.code == 0){
                        H.toast('提现处理中！请耐心等待银行到账');
                        this.getData();
                    }else {
                        H.toast(res.message);
                    }
                    this.DialogSCROLL.destroy();
                    this.createScroll();
                });
            },
            cancelCallback: ()=>{
                this.DialogSCROLL.destroy();
                this.createScroll();
            }
        });
        this.createDialogScroll();
    }

    // 查看/管理银行卡
    showCard(type){
        let cardInfo = this.state.cardInfo;
        this.SCROLL.destroy();

        let title, content, callback,
            cancel = true,
            okText = '保存信息';

        // 有三种情况：未绑卡老板绑卡，绑卡老板修改，员工查看
        switch (type){
            case 'bind':
                title = '绑定收款银行卡信息';
                content = '<div class="dialog-list" id="dialogList"><div class="scroller">' +
                    '<div class="dialog-item"><p>收款人</p><input id="cardName" type="text" placeholder="请填写银行收款人姓名"></div>' +
                    '<div class="dialog-item"><p>身份证号</p><input id="cardId" type="text" placeholder="请填写收款人身份证号码"></div>' +
                    '<div class="dialog-item"><p>手机号码</p><input id="cardPhone" type="tel" placeholder="请填写银行预留手机号码"></div>' +
                    '<div class="dialog-item"><p>银行卡号</p><input id="cardNumber" type="number" placeholder="请填写收款人银行卡号"></div>' +
                    '</div></div>';
                okText = '保存信息';
                callback = () =>{
                    let name = $('#cardName').val(),
                        id = $('#cardId').val(),
                        mobile = $('#cardPhone').val(),
                        number = $('#cardNumber').val();
                    H.loading.show('正在验证...');
                    H.server.updateCard({type: 1, card_master: name, card_number: number, master_idCard: id, mobile: mobile}, (res)=>{
                        if(res.code == 0){
                            H.toast('绑定成功！');
                            this.getData();
                        } else {
                            H.toast(res.message);
                        }
                        this.DialogSCROLL.destroy();
                        this.createScroll();
                        H.loading.hide();
                    });
                };
                break;
            case 'show':
                title = '查看收款银行卡信息';
                content = '<div class="dialog-list">' +
                    '<div class="dialog-item"><p>收款人</p><p id="cardName">'+cardInfo.name+'</p></div>' +
                    '<div class="dialog-item"><p>银行卡号</p><p id="cardNumber">'+cardInfo.card+'</p></div>' +
                    '</div>';
                cancel = false;
                okText = '关闭';
                callback = ()=> {
                    this.DialogSCROLL.destroy();
                    this.createScroll();
                };
                break;
            case 'edit':
                title = '更换收款银行卡信息';
                content = '<div class="dialog-list" id="dialogList"><div class="scroller">' +
                    '<div class="dialog-item"><p>收款人</p><input id="cardName" type="text" placeholder="请填写银行收款人姓名"></div>' +
                    '<div class="dialog-item"><p>身份证号</p><input id="cardId" type="text" placeholder="请填写收款人身份证号码"></div>' +
                    '<div class="dialog-item"><p>手机号码</p><input id="cardPhone" type="tel" placeholder="请填写银行预留手机号码"></div>' +
                    '<div class="dialog-item"><p>银行卡号</p><input id="cardNumber" type="number" placeholder="请填写收款人银行卡号"></div>' +
                    '<div class="dialog-tip"><p>应银行要求，更换银行卡需重新填写所有信息。</p><p>放弃更改，请点击【取消】按钮，请谨慎操作。</p><p>如有疑问，请联系客服。</p></div>' +
                    '</div></div>';
                callback = () =>{
                    let name = $('#cardName').val(),
                        id = $('#cardId').val(),
                        mobile = $('#cardPhone').val(),
                        number = $('#cardNumber').val();

                    // 如果文本框中的信息没有发生变化，则不发起请求
                    if(name == cardInfo.name && id == cardInfo.idCard && mobile == cardInfo.mobile && cardInfo.card == number){
                        return;
                    }else {
                        H.loading.show('正在验证...');
                        H.server.updateCard({type: 2, card_master: name, card_number: number, master_idCard: id, mobile: mobile}, (res)=>{
                            if(res.code == 0){
                                H.toast('保存成功！');
                                this.getData();
                            } else {
                                H.toast(res.message);
                            }
                            this.DialogSCROLL.destroy();
                            this.createScroll();
                            H.loading.hide();
                        });
                    }
                };
                break;
        }

        H.dialog({
            title: title,
            okText: okText,
            cancel: cancel,
            content: content,
            okCallback: callback,
            cancelCallback: ()=>{
                this.DialogSCROLL.destroy();
                this.createScroll();
            }
        });

        this.createDialogScroll();
        H.setInputPosition('cardName', -1);
    }

    // 跳转到提现记录页面
    toRecode(){
        window.location.href = '#/recode';
    }

    // 去往订单页面
    toOrder(type){
        window.location.href = '#/order/'+type;
    }

    // 去往帮助中心
    toHelp(){
        window.location.href = '#/help';
    }

    render() {
        return (<div id="paymentHome" className="payment-home">
            <div className="scroller">
                {this.state.isShow?<div>
                    {this.createHeader()}
                    {this.createList()}
                    {/*{this.createTip()}*/}
                </div>:null}
            </div>
        </div>);
    }
}

export default Home;