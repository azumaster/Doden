/**
 * Created by Doden on 2017.05.04
 */

import React from 'react';

class ShopInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    toAppraise(){
        window.location.href = '#/appraise';
        this.props.stopAuto && this.props.stopAuto();
    }

    render() {
        let shopInfo = this.props.shopInfo;

        return (<div className="shop-info">
            <div className="shop-info-item">
                <div className="shop-info-icon"><i className="icon money"></i></div>
                <p>{shopInfo.goodMoney}</p>
                <p>本月销售额</p>
            </div>
            <div className="shop-info-item">
                <div className="shop-info-icon"><i className="icon num"></i></div>
                <p>{shopInfo.goodNum}</p>
                <p>本月销售件数</p>
            </div>
            <div className="shop-info-item" onClick={this.toAppraise.bind(this)}>
                <div className="shop-info-icon"><i className="icon like"></i></div>
                <p className="red">{this.props.favorable}%</p>
                <p>买家评价</p>
            </div>
        </div>);
    }
}

export default ShopInfo;