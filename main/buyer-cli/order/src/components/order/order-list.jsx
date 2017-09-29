import React from "react";
import Btn from "../btn/btn.jsx";
import OrderGoodsList from "./order-goods-list.jsx";

var OrderList = React.createClass({
    getInitialState: function() {
        return {
            data: ""
        }
    },
    pays: function(param) {  //去支付;
        location.href = '#';
        this.props.goPay && this.props.goPay(param);
    },
    refund: function(param) {  //申请售后;
        let dialog = H.dialog({
            title: "申请售后",
            autoClose: false,
            content: "<div class='refund-warp'><div>售后原则：</div><ul>" +
            "<li>1、收货3天内无条件退货；</li>" +
            "<li>2、解冻、开零后不可退；</li>" +
            "<li>3、退货前请通知客服安排车辆。</li>" +
            "</ul></div>",
            okCallback() {
                let server = H.server;
                server.order_buy_back(param,(res)=>{
                    if(res.code == 0){
                        dialog.reRender({
                            title: "申请成功",
                            content: "<p>您已成功申请售后，稍候会有客服联系您，请保持手机畅通。</p>",
							autoClose: true,
                            okText: "关闭"
                        });
                    }else {
                        dialog.reRender({
                            content: "<p>"+res.message+"</p>",
                            okText: "关闭"
                        });
                    }
                })
            },
            cancel: true,
            cancelCallback(){
               dialog.destroy(); 
            }
        });

    },
    takeGoods: function(param) {  //确认收货;
        let _this = this;
        let dialog = H.dialog({
            title: "确认收货",
            autoClose: false,
            content: "<p>确认收货后，平台才会打款给卖家<br />请仔细核对货物是否正确。</p>",
            okCallback() {
                let server = H.server;
                server.order_buy_receive(param,(res)=>{
                    if(res.code == 0){
                        dialog.reRender({
                            title: "收货成功",
                            content: "<p>系统奖励您"+res.data.reward_quantity+"钻石，下次买货可以抵扣现金。</p>",
                            okText: "关闭"
                        });
                        _this.props.takeOrder && _this.props.takeOrder(param.sub_order_id);
                    }else {
                        dialog.reRender({
                            content: "<p>"+res.message+"</p>",
                            okText: "关闭"
                        });
                    }
                })
            },
            cancel: true,
            cancelCallback(){
               dialog.destroy(); 
            }
        });
    },
    dial: function(tel) {  //拨打电话;
        window.location.href = 'tel:'+tel;
    },
    afresh: function() {  //重新购买跳转到购物车;
        window.location.href = "index.php?m=Buyers&c=Myorder&a=cartShow";
    },
    star: function(no) { //去评价;
        window.location.href = '/Public/buyer-cli/comment/main.html#'+no ;
    },
    reComment: function(no) { //追加评价;
        window.location.href = '/Public/buyer-cli/comment/recomment.html#'+no ;
    },
    render: function() {
        return (
            <ul className="order-content">
                {
                    this.props.data.map((data, index) =>{

                        var pri = {
                            key : <span className="privilege-text">状&nbsp;&nbsp;态:</span>,
                            value : "",
                            className : "state",
                            priceTitle : <span className="privilege-text">总&nbsp;&nbsp;价:</span>,
                            timeTitle: "下单时间",
                            id: null,
                            delState: 1,
                            shopIsShow: <div className="order-shop-name"><p><i className="icon-font" style={{margin: "-3px 3px 0 0"}}>&#xe600;</i>{data.sell_district}-{data.sell_shop_name}</p></div>
                        };
                        var btnXml = null;
                        var appraise = "";
                        switch (data.status){
                            case 1:
                                pri.key = <span className="privilege-text">钻石减免:</span>;
                                pri.value = "-"+data.discount_amount;
                                pri.className = "privilege-price";
                                pri.delState = 2;
                                pri.priceTitle = <span className="privilege-text">应付金额:</span>;
                                pri.timeTitle = "下单时间";
                                pri.shopIsShow = "";
                                if(data.payment_mode == 6) {
                                    btnXml = <div className="btn-group"><button className="btn btn-orange btn-disabled">去支付</button></div>;
                                }else {
                                    btnXml = <div className="btn-group">
                                        <button
                                            className="btn btn-orange"
                                            onClick={this.pays.bind(this,
                                            {
                                                pay_amount: data.order_amount,
                                                parent_order_no: data.parent_order_no,
                                                time: data.status_time
                                            }
                                        )}>
                                            去支付
                                        </button>
                                    </div>;
                                }
                                pri.id = data.parent_order_no;
                                break;
                            case 2:
                                pri.value = "已付款-待发货";
                                pri.timeTitle = "下单时间";
                                if(data.payment_mode == 1){
                                    btnXml = (
                                        <div className="btn-group">
                                            <button
                                                className="btn"
                                                onClick={this.refund.bind(this,{sub_order_no: data.sub_order_no})}>
                                                售后
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={this.dial.bind(this,data.phone)}>
                                                卖家电话
                                            </button>
                                        </div>);
                                }else {
                                    if(data.payment_mode == 2){
                                        pri.value = "上车收钱-待发货";
                                    }else if(data.payment_mode == 3){
                                        pri.value = "自行协商-待发货";
                                    }else if(data.payment_mode == 4){
                                        pri.value = "打款给商家-待发货";
                                    }else if(data.payment_mode == 5) {
                                        pri.value = "货到付款-待发货";
                                    }
                                    if(data.user_type == 1){
                                        pri.value = "待发货";
                                    }
                                    pri.id = data.sub_order_no;
                                    btnXml = (
                                        <div className="btn-group">
                                            <button
                                                className="btn"
                                                onClick={this.dial.bind(this,data.phone)}>
                                                卖家电话
                                            </button>
                                        </div>);
                                }
                                break;
                            case 3:
                                pri.value = "已付款-已发货";
                                pri.timeTitle = "发货时间";
                                if(data.payment_mode == 1){
                                    pri.key = "";
                                    btnXml = (
                                        <div className="btn-group">
                                            <button
                                                className="btn"
                                                onClick={this.refund.bind(this,{sub_order_no: data.sub_order_no})}>
                                                售后
                                            </button>
                                            <button
                                                className="btn"
                                                onClick={this.dial.bind(this,data.phone)}>
                                                卖家电话
                                            </button>
                                            <button
                                                className="btn btn-green"
                                                onClick={this.takeGoods.bind(this,{sub_order_id: data.order_id})}>
                                                确认收货
                                            </button>
                                        </div>);
                                }else {
                                    if(data.payment_mode == 2){
                                        pri.value = "上车收钱-已发货";
                                    }else if(data.payment_mode == 3){
                                        pri.value = "自行协商-已发货";
                                    }else if(data.payment_mode == 4){
                                        pri.value = "打款给商家-已发货";
                                    }else if(data.payment_mode == 5) {
                                        pri.value = "货到付款-已发货";
                                    }
                                    if(data.user_type == 1){
                                        pri.value = "已发货";
                                    }
                                    btnXml = (
                                        <div className="btn-group">
                                            <button
                                                className="btn"
                                                onClick={this.dial.bind(this,data.phone)}>
                                                卖家电话
                                            </button>
                                            <button
                                                className="btn btn-green"
                                                onClick={this.takeGoods.bind(this,{sub_order_id: data.order_id})}>
                                                确认收货
                                            </button>
                                        </div>);
                                }
                                break;
                            case 4:
                                pri.value = "已付款-已完成";
                                pri.timeTitle = "发货时间";
                                pri.className = "privilege-price";
                                let currentTime = new Date().getTime();
                                let oldTime = new Date(data.take_goods_time+"").getTime();
                                if((currentTime - oldTime)/3600000 > 72 || data.payment_mode != 1){
                                    if(data.payment_mode != 1){
                                        if(data.payment_mode == 2){
                                            pri.value = "上车收钱-已完成";
                                        }else if(data.payment_mode == 3){
                                            pri.value = "自行协商-已完成";
                                        }else if(data.payment_mode == 4){
                                            pri.value = "打款给商家-已完成";
                                        }else if(data.payment_mode == 5) {
                                            pri.value = "货到付款-已完成";
                                        }
                                        if(data.user_type == 1){
                                            pri.value = "已完成";
                                        }

                                        btnXml = (
                                            <div className="btn-group">
                                                <button
                                                    className="btn"
                                                    onClick={this.dial.bind(this,data.phone)}>
                                                    卖家电话
                                                </button>
                                            </div>);
                                    }else {
                                        if(data.appraise == 4) {
                                            btnXml = (
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-green"
                                                        onClick={this.reComment.bind(this, data.sub_order_no)}>
                                                        追加评价
                                                    </button>
                                                    <button
                                                        className="btn"
                                                        onClick={this.dial.bind(this,data.phone)}>
                                                        卖家电话
                                                    </button>
                                                </div>);
                                        }else if(data.appraise == 2) {
                                            btnXml = (
                                                <div className="btn-group">
                                                    <button
                                                        className="btn btn-green"
                                                        onClick={this.star.bind(this,data.sub_order_no)}>
                                                        评价
                                                    </button>
                                                    <button
                                                        className="btn"
                                                        onClick={this.dial.bind(this,data.phone)}>
                                                        卖家电话
                                                    </button>
                                                </div>);
                                        }else {
                                            btnXml = (
                                                <div className="btn-group">
                                                    <button
                                                        className="btn"
                                                        onClick={this.dial.bind(this,data.phone)}>
                                                        卖家电话
                                                    </button>
                                                </div>);
                                        }
                                    }
                                }else {
                                    if(data.appraise == 4) {
                                        btnXml = (
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-green"
                                                    onClick={this.reComment.bind(this,data.sub_order_no)}>
                                                    追加评价
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={this.refund.bind(this,{sub_order_no: data.sub_order_no})}>
                                                    售后
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={this.dial.bind(this,data.phone)}>
                                                    卖家电话
                                                </button>
                                            </div>);
                                    }else if(data.appraise == 2) {
                                        btnXml = (
                                            <div className="btn-group">
                                                <button
                                                    className="btn btn-green"
                                                    onClick={this.star.bind(this,data.sub_order_no)}>
                                                    评价
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={this.refund.bind(this,{sub_order_no: data.sub_order_no})}>
                                                    售后
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={this.dial.bind(this,data.phone)}>
                                                    卖家电话
                                                </button>
                                            </div>);
                                    }else {
                                        btnXml = (
                                            <div className="btn-group">
                                                <button
                                                    className="btn"
                                                    onClick={this.refund.bind(this,{sub_order_no: data.sub_order_no})}>
                                                    售后
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={this.dial.bind(this,data.phone)}>
                                                    卖家电话
                                                </button>
                                            </div>);
                                    }
                                }
                                break;
                            case 5:
                                pri.value = "已取消";
                                pri.timeTitle = "取消时间";
                                btnXml = <div className="btn-group">
                                    <button
                                        className="btn btn-orange"
                                        onClick={this.afresh}>
                                        重新购买
                                    </button>
                                </div>;
                                break;
                            case 6:
                                pri.value = "已关闭";
                                pri.timeTitle = "处理时间";
                                appraise = (
                                    <div className="refund-state">退款中</div>
                                );
                                //if(data.payment_mode == 1){
                                //    if(data.appraise == 1){
                                //        btnXml = <div className="btn-group">
                                //            <button
                                //                className="btn"
                                //                onClick={this.star.bind(this,data.sub_order_no)}>
                                //                已评价
                                //            </button>
                                //        </div>;
                                //    }else {
                                //        btnXml = <div className="btn-group">
                                //            <button
                                //                className="btn btn-green"
                                //                onClick={this.star.bind(this,data.sub_order_no)}>
                                //                评价
                                //            </button>
                                //        </div>;
                                //    }
                                //}
                                break;
                            case 7:
                                pri.value = "已关闭";
                                pri.timeTitle = "处理时间";
                                appraise = (
                                    <div className="refund-state">已退款:{data.refund_amount}元</div>
                                );
                                //if(data.payment_mode == 1){
                                //    if(data.appraise == 1){
                                //        btnXml = <div className="btn-group">
                                //            <button
                                //                className="btn"
                                //                onClick={this.star.bind(this,data.sub_order_no)}>
                                //                已评价
                                //            </button>
                                //        </div>;
                                //    }else if(data.appraise == 2) {
                                //        btnXml = <div className="btn-group">
                                //            <button
                                //                className="btn btn-green"
                                //                onClick={this.star.bind(this,data.sub_order_no)}>
                                //                评价
                                //            </button>
                                //        </div>;
                                //    }
                                //}
                                break;
                        }
                        var nodeId = "";
                        if(data.sub_order_no){
                            nodeId = data.sub_order_no;
                        }else {
                            nodeId = data.parent_order_no;
                        }

                        //是否滚动的;
                        var stateTitleXml = "";
                        if(data.logistic_info.length > 1 && index == 0){
                            stateTitleXml = <div className="state-title-warp run">
                                <ul className="state-title-animate">
                                    <li><p className="state-title">{data.logistic_info[0]}</p></li>
                                    <li><p className="state-title">{data.logistic_info[1]}</p></li>
                                </ul>
                            </div> ;
                        }else {
                            stateTitleXml = <div className="state-title-warp">
                                <p className="state-title">{data.logistic_info[0]}</p>
                            </div> ;
                        }
                        if(data.payment_mode == 6) stateTitleXml = "";

                        var priceXML = (
                            <div className="order-price flex-num1">
                                <p>{pri.key}<span className={pri.className}>{pri.value}</span></p>
                                <p>{pri.priceTitle}<span className="count-price">{data.order_amount}元</span></p>
                            </div>
                        );
                        if(data.payment_mode == 6) {
                            priceXML = (
                                <div className="order-price flex-num1">
                                    {data.remark[0]}
                                </div>
                            );
                        }
                        return <li className="list orderlist" key={index} id={"id"+nodeId}>
                            <div className="order-list-top flex-box center">
                                {priceXML}
                                {data.buy_way == 2 ? <span className="group-buy">集采</span> : null}
                                {btnXml}
                            </div>
                            <div className="order-state flex-box">
                                <div className="flex-num1">
                                    {stateTitleXml}
                                    <p className="state-time">{pri.timeTitle}：{data.status_time}</p>
                                </div>
                                {appraise}
                            </div>
                            {pri.shopIsShow}
                            <OrderGoodsList
                                data={data.order_goods_infos}
                                orderId={pri.id}
                                delState={pri.delState}
                                delOrderGoods={this.props.delOrderGoods}
                            />
                        </li>
                    })
                }
            </ul>
        )
    }
});

export default OrderList;
