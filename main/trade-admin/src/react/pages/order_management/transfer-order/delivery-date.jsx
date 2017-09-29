/*
* 改期
* */

import React from 'react';

class DeliveryDate extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $.datepicker.regional[ 'zh-CN' ] = {
            closeText: '关闭', 
            prevText: '&#x3C;上月', 
            nextText: '下月&#x3E;', 
            currentText: '今天', 
            monthNames: [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ],
            monthNamesShort: [ '一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月' ],
            dayNames: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
            dayNamesShort: [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
            dayNamesMin: [ '日', '一', '二', '三', '四', '五', '六' ],
            weekHeader: '周',
            dateFormat: 'yy-mm-dd', 
            firstDay: 1, 
            isRTL: false, 
            showMonthAfterYear: true, 
            yearSuffix: '年'
        };

        let $deliveryDate = $('#delivery-date');
        $deliveryDate.val(this.props.data.delivery_date);

        $.datepicker.setDefaults( $.datepicker.regional[ 'zh-CN' ] );
        $deliveryDate.datepicker({
            minDate: H.GetDateStr().time1,
            dateFormat: 'yy-mm-dd', 
            changeMonth: true, 
            changeYear: true
        });
    }

    render() {
        return (
            <div>
                <p>当前买家：{this.props.data.shop_name}</p>
                <div>商品名：<div style={{display: 'inline-block',  verticalAlign: 'top'}}>
                    {
                        this.props.data.goods_infos.map((val,  index) => {
                            return (
                                <p key={index}>{val.goods_name}&nbsp;&nbsp;{val.goods_price}元/{val.goods_unit}</p>
                            );
                        })
                    }
                </div></div>
                <div className='form-inline'>新发货时间： <input id='delivery-date' type='text' className='form-control form-control' style={{borderRadius: '0'}} /></div>
            </div>
        );
    }
}

export default DeliveryDate;