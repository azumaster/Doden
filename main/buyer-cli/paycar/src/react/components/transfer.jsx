/*
* 转接用户;
* */

import React from 'react';
import Breaks from './breaks.jsx';
import TakeInfo from './take-info.jsx';

class Transfer extends React.Component {
    constructor(props) {
        super(props);
        this.logisticsFees = this.logisticsFees.bind(this);
    }

    //生成运费;
    logisticsFees() {
        let logisticsFees = this.props.data.logistics_fees,
            xml = '',
            priceText = '';
        if(parseFloat(logisticsFees.buy_number_price) < parseFloat(logisticsFees.total_price)){
            priceText = (<div className="flex-box" style={{color: 'red'}}><div className="flex-num1">最低运费：</div>{logisticsFees.total_price}元</div>);
        }else if(parseFloat(logisticsFees.buy_number_price) > parseFloat(logisticsFees.total_price)) {
            priceText = (<div className="flex-box" style={{color: 'red'}}><div className="flex-num1">封顶运费：</div>{logisticsFees.total_price}元</div>);
        }else {
            priceText = (<div className="flex-box"><div className="flex-num1">运费：</div>{logisticsFees.total_price}元</div>);
        }

        if(logisticsFees.reduce_price == 0) {
            xml = (
                <div className="flex-num1">
                    <div className="flex-box"><div className="flex-num1">数量：</div>{logisticsFees.buy_number}件</div>
                    {priceText}
                </div>
            );
        }else {
            xml = (
                <div className="flex-num1">
                    <div className="flex-box"><div className="flex-num1">数量：</div>{logisticsFees.buy_number}件</div>
                    {priceText}
                    <div className="flex-box"><div className="flex-num1">减免：</div>-{logisticsFees.reduce_price}元</div>
                    <div className="flex-box"><div className="flex-num1">实付：</div>{logisticsFees.paid_price}元</div>
                </div>
            );
        }
        return xml;
    }

    chargeStandard() {
        let data = this.props.data.logistics_fees.price_standard,
            feesRules = data.fees_rules,
            unit = data.fees_rule_type_id == 2 ? 'kg' : '元',
            str = '<div class="actionsheet_item center"><span class="label" style="width: 5em;padding: 0;">配送费：</span><div class="flex-num1">'+
                '最低运费' + data.freight_min_amount +
                '元</div></div>',
            free_freight_order_time = '';
        for(var i = 0 ; i < feesRules.length ; i++) {
            str += '<div class="actionsheet_item center"><span class="label" style="width: 5em;"></span><div class="flex-num1">'+
                '单件' + feesRules[i].from_min_amount + '-' + feesRules[i].to_max_amount + unit +'，每件收' + feesRules[i].freight_amount + '元' +
                '</div></div>';
        }

        if(data.free_freight_order_time != 0) {
            free_freight_order_time = '<div class="actionsheet_item center"><span class="label" style="width: 5em;">运费减免：</span>'+
                '<div class="flex-num1"><div class="flex-box">前' + data.free_freight_order_time + '单，每单封顶减免' + data.free_freight_max_amount + '元' +
                '</div></div></div>';
        }

        H.sheet({
            title: '收费标准',
            content: '<div class="actionsheet_cell read-only">'+ free_freight_order_time
            + str +
            '<div class="actionsheet_item center"><span class="label" style="width: 5em;">配送时间：</span>' +
            '<div class="flex-num1">以购物车显示的配送时间为准</div></div>'+
            '</div>',
            confirm: '我知道了',
            confirmClose: true
        });
    }

    render() {

        return (
            <div className="goods-list">
                <section className="section-item">
                    <div className="header-cell flex-box">
                        <div className="flex-num1">送货方式</div>
                    </div>
                    <div className="body-cell flex-box">
                        <div className="flex-num1">
                            <p>由“{this.props.data.delivery_mode.sell_shop_name}”提供服务</p>
                            <p>预计送达时间：{this.props.data.delivery_mode.arrival_time}</p>
                        </div>
                    </div>
                </section>
                <TakeInfo
                    data={this.props.data}
                    areaData={this.props.areaData}
                    changeSettlementInfo={this.props.changeSettlementInfo}
                    operation={this.props.operation}
                    scrollRefresh={this.props.scrollRefresh}
                />
                <section className="section-item">
                    <div className="header-cell flex-box">
                        <div className="flex-num1">运费</div>
                        <a onClick={this.chargeStandard.bind(this)}>收费标准?</a>
                    </div>
                    <div className="body-cell flex-box center">
                        {this.logisticsFees()}
                    </div>
                </section>
                <Breaks data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} operation={this.props.operation} />
                {
                    !this.props.operation ?
                        <p style={{margin: '10px 0 10px 8px', fontSize: '14px', color: '#6f6f6f'}}>在线支付可使用钻石减免，最高可减免10元</p>
                        : ''
                }
            </div>
        );
    }
}

export default Transfer;