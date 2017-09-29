/**
 * 货款中心的订单页面
 * 包括了对账单、已提现、未提现、可提现和未完成这五种状态的订单
 * Created by Doden on 2017.07.10
 */

import React from 'react';

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                page_num: 1,
                page_size: 10,
                start_time: '',
                end_time: ''
            },
            paramsIn: {
                page: 1,
                size: 10,
                start_time: '',
                end_time: ''
            },
            show: false,
            final: true,
            type: '',
            allMoney: 0,
            finalOrder: false,
            orderList: [],
            status: {0: '新订单', 1: '已电联', 2: '已确认', 3: '已发货', 4: '已收货', 5: '卖家取消', 6: '买家取消', 7: '提现中', 8: '已提现', 9: '已评价', 20: '已超时', 30: '已退款', 101: '财务确认', 102: '财务冻结'}
        };
    }

    componentWillMount(){
        let params = this.state.params,
            paramsIn = this.state.paramsIn;
        params.start_time = new Date().getFullYear()+'-01-01';
        paramsIn.start_time = new Date().getFullYear()+'-01-01';
        params.end_time = H.getToday();
        paramsIn.end_time = H.getToday();

        this.setState({
            type: this.props.params.type,
            params: params,
            paramsIn: paramsIn
        });
    }

    componentDidMount(){
        this.getData();
        this.createScroll();
        $('#orderDefault').css({height: window.innerHeight+'px'});
    }

    getData(){
        let type = this.state.type;

        switch (type) {
            case 'withdraw':
                // 已提现订单
                this.getWithdrawData();
                break;
            case 'can':
                // 可提现订单
                this.getCan();
                break;
            case 'incomplete':
                // 未提现订单
                this.getIncompleteData();
                break;
            case 'withdrawing':
                // 获取提现中订单
                this.getWithdrawing();
                break;
            case 'statement':
                // 获取对账单
                this.getStatement();
                break;
        }

    }

    componentDidUpdate(){
        this.SCROLL.refresh();
        $('#orderDefault').css({height: window.innerHeight+'px'});
    }

    createScroll(){
        H.scroll('#order', (SCROLL)=>{
            this.SCROLL = SCROLL;
            SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if (this.state.final) return;
                if ((SCROLL.y - SCROLL.maxScrollY) < 300) {
                    this.state.paramsIn.page++;
                    this.state.params.page_num++;
                    new Promise(() => {
                        this.getData();
                    });
                }
            });

        });
    }

    // 获取已提现订单的数据
    async getWithdrawData(){
        H.loading.show();
        await new Promise((resolve)=>{
            let orderList = this.state.orderList;
            H.server.getWithdraw(this.state.params, (res)=>{
                if(res.code == 0){
                    let final = false;

                    if(res.data.data.length<=0) {
                        final = true;
                        if(this.state.params.page_num != 1){
                            H.toast('没有更多啦~');
                        }

                        if(this.state.params.page_num == 1){
                            orderList = [];
                        }

                    }
                    orderList = orderList.concat(res.data.data);
                    this.setState({
                        allMoney: res.data.allMoney,
                        orderList: orderList,
                        final: final
                    });

                }else {
                    H.toast(res.message);
                }
                this.setState({
                    finalOrder: true
                }, ()=>{
                    resolve('ok');
                });
            });
        });
        H.loading.hide();
    }

    // 获取未完成订单信息
    async getIncompleteData(){
        H.loading.show();
        await new Promise((resolve)=>{
            let orderList = this.state.orderList;
            H.server.getIncomplete(this.state.paramsIn, (res)=>{
                if(res.code == 0){
                    let final = false;

                    if(res.data.depositInfo.length<=0) {
                        final = true;
                        if(this.state.paramsIn.page != 1){
                            H.toast('没有更多啦~');
                        }
                    }

                    if(this.state.paramsIn.page == 1){
                        orderList = [];
                    }

                    orderList = orderList.concat(res.data.depositInfo);
                    this.setState({
                        orderList: orderList,
                        final: final
                    });

                }else {
                    H.toast(res.message);
                }
                this.setState({
                    finalOrder: true
                }, ()=>{
                    resolve('ok');
                });
            });
        });
        await new Promise((resolve)=>{
            H.loading.hide();
            resolve('ok');
        });
        if(!this.state.show){
            this.setState({
                show: false
            }, ()=>{
                $('#orderTip').delay(300).animate({top: 0}, 250).delay(10000).animate({top: '-70px'}, 250);
            });
        }
    }

    // 获取可提现订单信息
    async getCan(){
        H.loading.show();
        await new Promise((resolve)=>{
            let orderList = this.state.orderList;
            H.server.getCan(this.state.paramsIn, (res)=>{
                if(res.code == 0){
                    let final = false;

                    if(res.data.depositInfo.length<=0) {
                        final = true;
                        if(this.state.paramsIn.page != 1){
                            H.toast('没有更多啦~');
                        }
                    }

                    if(this.state.paramsIn.page == 1){
                        orderList = [];
                    }

                    orderList = orderList.concat(res.data.depositInfo);
                    this.setState({
                        allMoney: res.data.allTotalPrice,
                        orderList: orderList,
                        final: final
                    });
                }else {
                    H.toast(res.message);
                }
                this.setState({
                    finalOrder: true
                }, ()=>{
                    resolve('ok');
                });
            });
        });
        await new Promise((resolve)=>{
            H.loading.hide();
            resolve('ok');
        });
        if(!this.state.show){
            this.setState({
                show: false
            }, ()=>{
                $('#orderTip').delay(300).animate({top: 0}, 250).delay(15000).animate({top: '-33px'}, 250);
            });
        }
    }

    // 获取提现中订单的信息
    async getWithdrawing(){
        H.loading.show();
        await new Promise((resolve)=>{
            let orderList = this.state.orderList;
            H.server.getWithdrawing(this.state.paramsIn, (res)=>{
                if(res.code == 0){
                    let final = false;
                    if(res.data.depositInfo.length<=0) {
                        final = true;
                        if(this.state.paramsIn.page != 1){
                            H.toast('没有更多啦~');
                        }
                    }

                    if(this.state.paramsIn.page == 1){
                        orderList = [];
                    }

                    orderList = orderList.concat(res.data.depositInfo);
                    this.setState({
                        allMoney: res.data.allTotalPrice,
                        orderList: orderList,
                        final: final
                    });
                }else {
                    H.toast(res.message);
                }
                this.setState({
                    finalOrder: true
                }, ()=>{
                    resolve('ok');
                });
            });
        });
        await new Promise((resolve)=>{
            H.loading.hide();
            resolve('ok');
        });
    }

    async getStatement(){
        H.loading.show();
        await new Promise((resolve)=>{
            let orderList = this.state.orderList;
            H.server.getStatement(this.state.paramsIn, (res)=>{
                if(res.code == 0){
                    let final = false;

                    if(res.data.depositInfo.length<=0) {
                        final = true;
                        if(this.state.paramsIn.page != 1){
                            H.toast('没有更多啦~');
                        }
                    }

                    if(this.state.paramsIn.page == 1){
                        orderList = [];
                    }

                    orderList = orderList.concat(res.data.depositInfo);
                    this.setState({
                        allMoney: res.data.allTotalPrice,
                        orderList: orderList,
                        final: final
                    });
                }else {
                    H.toast(res.message);
                }
                this.setState({
                    finalOrder: true
                }, ()=>{
                    resolve('ok');
                });
            });
        });
        H.loading.hide();
    }

    // 创建头部
    createWithdraw(){
        let type = {withdraw: '累计提现', can: '可提现金额', withdrawing: '提现中金额', statement: '累计提现'};

        if(this.state.type == 'withdraw' || this.state.type == 'statement'){
            let optionYear = [], optionMonth = [];
            let month = 12;

            if(this.state.params.start_time.split('-')[0]==new Date().getFullYear()){
                month = new Date().getMonth()+1;
            }

            optionYear.push(<option value={new Date().getFullYear()}>今年</option>);
            for(let i = new Date().getFullYear()-1; i> 2014; i--){
                optionYear.push(<option key={'year_'+i} value={i}>{i}</option>);
            }

            optionMonth.push(<option value={0}>全部</option>);
            for(let j = month; j>=1; j--){
                optionMonth.push(<option key={'month_'+j} value={j}>{j}月</option>);
            }

            return (<div className="withdraw-info">
                <div className="withdraw-title">
                   <div className="full-p">
                       <div className="full-select"><select onChange={this.changeYear.bind(this)}>{optionYear}</select></div>
                       <div className="full-select"><select onChange={this.changeMonth.bind(this)}>{optionMonth}</select></div>
                   </div>
                </div>
                <div className="withdraw-money">累计提现：{H.formatMoney(this.state.allMoney, 2, '￥')}</div>
            </div>);
        }else{
            return (<div className="withdraw-info">
                <div className="withdraw-title">
                    <p>{type[this.state.type]}:</p>
                    <p>(不含提现手续费)</p>
                </div>
                <div className="withdraw-money">{H.formatMoney(this.state.allMoney, 2, '￥')}</div>
            </div>);
        }
    }

    createList(){
        let list = [];

        switch (this.state.type) {
            case 'incomplete':
            case 'can':
            case 'withdrawing':
                list = this.createIncompleteList();
                break;
            case 'withdraw':
                list = this.createWithdrawList();
                break;
            case 'statement':
                list = this.createStatement();
                break;
        }

        return (<ul className="order-ul">{list}</ul>);
    }

    // 创建未完成订单的列表和已完成订单的列表（接口结构一致，写在一起）
    createIncompleteList(){
        let list = [];

        this.state.orderList.map((order, i)=>{
            let goodsList = [];

            for(let index in order.goods){
                goodsList.push(<div key={index} className="order-body-item">
                    <p>{order.goods[index].gname} {order.goods[index].guigei}</p>
                    <p>X{order.goods[index].buy_num}</p>
                </div>);
            }

            list.push(<li key={i} className="order-li">
                <div className="order-title">
                    <div className="shop-name"><i className="icon shop"></i>{order.dianPuName}</div>
                    <div className="order-status"><p className={this.state.type=='withdraw'?'':'status'}>{this.state.status[order.orderact]}</p>{this.state.type == 'withdraw'?<p>{order.endTime}</p>:null}</div>
                </div>
                <div className="order-body">{goodsList}</div>
                <div className="order-bottom">
                    <p>下单时间:{order.addtime}</p>
                    <p>合计:<em>{H.formatMoney(order.total_price, 2, '￥')}</em></p>
                </div>
            </li>);
        });

        return list;
    }

    // 创建已提现订单的列表（与另外两种状态的结构接口不一致，故单独写一遍）
    createWithdrawList(){
        let list = [];

        this.state.orderList.map((order, i)=>{
            let withdrawList = [];

            for(let index in order.withDrawInfo){
                let goodsInfo = [];

                for(let i in order.withDrawInfo[index].goodsInfo){
                    goodsInfo.push(<div key={index+'_'+i} className="order-goods">
                        <p>{order.withDrawInfo[index].goodsInfo[i].goodsName} {order.withDrawInfo[index].goodsInfo[i].specification}</p>
                        <p>X{order.withDrawInfo[index].goodsInfo[i].num}</p>
                    </div>);
                }

                withdrawList.push(<div key={index} className="withdraw-order">
                    <div className="order-title">
                        <div className="shop-name"><i className="icon shop"></i>{order.withDrawInfo[index].buyName}</div>
                        <div className="order-status">{H.formatMoney(order.withDrawInfo[index].orderMoney, 2, '￥')}</div>
                    </div>
                    <div className="order-body">
                        {goodsInfo}
                    </div>
                    <div className="order-footer">
                        <p className="send-time">发货时间:{order.withDrawInfo[index].sendOutTime}</p>
                        <p className="order-goods">共{order.withDrawInfo[index].goodsNum}件商品 <span onClick={this.openGoods.bind(this)} className="icon-down"><i className="icon down"></i></span></p>
                    </div>
                </div>);
            }

            list.push(<li key={i} className="withdraw-li">
                <div className="withdraw-title">
                    <div className="withdraw-date">{order.withDrawTime}</div>
                    <div className="withdraw-money">{order.allOrder}笔 共计<span className="money">{H.formatMoney(order.withDrawMoney, 2, '￥')}</span></div>
                </div>
                <div className="withdraw-body">{withdrawList}</div>
            </li>);
        });

        return list;
    }

    // 创建对账单
    createStatement(){
        let list = [];

        this.state.orderList.map((order, i)=>{
            let goodsList = [];

            for(let index in order.goods){
                goodsList.push(<div key={index} className="order-body-item">
                    <p>{order.goods[index].gname} {order.goods[index].guigei}</p>
                    <p>X{order.goods[index].buy_num}</p>
                </div>);
            }

            list.push(<li key={i} className="order-li">
                <div className="order-title">
                    <div className="shop-name"><i className="icon shop"></i>{order.dianPuName}</div>
                    <div className="order-status"><p className={this.state.type=='withdraw'?'':'status'}>{this.state.status[order.orderact]}</p></div>
                </div>
                <div className="order-body">{goodsList}</div>
                <div className="order-bottom">
                    <p>发货时间:{order.order_send_time}</p>
                    <p>合计:<em>{H.formatMoney(order.total_price, 2, '￥')}</em></p>
                </div>
            </li>);
        });

        return list;
    }

    createTip(){
        return (<div id="orderTip" className="order-tip">
            <p>买家确认收货后可提现;提醒买家收货请联系买家</p>
            <i className="icon close" onClick={this.closeTip.bind(this)}></i>
        </div>);
    }

    createCanTip(){
        return (<div id="orderTip" className="order-tip">
            <p>买家确认收货后可提现;提醒买家收货请联系买家。若发货后买家长时间没点确认收货，请联系买家。</p>
            <i className="icon close" onClick={this.closeTip.bind(this)}></i>
        </div>);
    }

    createDefault(){
        return (<div id="orderDefault" className="default">
            <div className="default-body">
                <div className="default-img"><img src="http://img.idongpin.com/Public/images/seller-cli/no-order.png@640w_100Q.png" /></div>
                <div className="default-text">
                    <h1>抱歉，您暂时还没有订单</h1>
                </div>
            </div>
        </div>);
    }

    closeTip() {
        $('#orderTip').css({top: '-70px'});
    }

    // 打开下拉
    openGoods(e){
        let down = e.target.parentNode,
            target = e.target.parentNode.parentNode.parentNode.parentNode.children[1];

        // 改变下角标的样式
        if(down.className == 'icon-down'){
            down.className = 'icon-down active';
            target.className = 'order-body active';

        }else if(down.className == 'icon-down active'){
            down.className = 'icon-down';
            target.className = 'order-body';
        }

    }

    //更改日期
    changeYear(e){
        let value = e.target.value,
            month = e.target.parentNode.parentNode.children[1].children[0],
            params = this.state.params,
            paramsIn = this.state.paramsIn;

        month.options[0].selected = true;
        params.start_time = value+'-01-01';
        paramsIn.start_time = value+'-01-01';
        params.end_time = value+'-12-31';
        paramsIn.end_time = value+'-12-31';
        params.page_num = 1;
        paramsIn.page = 1;

        this.setState({
            params: params,
            paramsIn: paramsIn
        }, this.getData);
    }

    changeMonth(e){
        let value = e.target.value,
            year = e.target.parentNode.parentNode.children[0].children[0].value,
            params = this.state.params,
            paramsIn = this.state.paramsIn;

        if(value!=0){
            params.start_time = year+'-'+value+'-01';
            paramsIn.start_time = year+'-'+value+'-01';
            params.end_time = year+'-'+value+'-'+(new Date(year, value, 0).getDate());
            paramsIn.end_time = year+'-'+value+'-'+(new Date(year, value, 0).getDate());
        } else {
            params.start_time = year+'-01-01';
            paramsIn.start_time = year+'-01-01';
            params.end_time = year+'-12-31';
            paramsIn.end_time = year+'-12-31';
        }

        params.page_num = 1;
        paramsIn.page = 1;

        this.setState({
            params: params,
            paramsIn: paramsIn
        }, this.getData);
    }

    render() {
        return (<div className="order" id="order">
            {/*{this.state.orderList.length>0?:this.createDefault()}*/}
            <div className="scroller">
                {/*这个地方没有同时判断是因为会导致可能无法滑动的问题*/}
                {this.state.type == 'incomplete'?null:this.createWithdraw()}
                {this.state.finalOrder?(this.state.orderList.length>0?this.createList():this.createDefault()):null}

            </div>
            {this.state.orderList.length>0?(this.state.type == 'incomplete'?this.createTip():null):null}
            {this.state.orderList.length>0?(this.state.type == 'can'?this.createCanTip():null):null}
        </div>);
    }
}

export default Order;