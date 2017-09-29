import React from 'react';
import CarInfo from './car-info.jsx';
import Breaks from './breaks.jsx';

class CarPay extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    render() {
        return (
            <div className="goods-list">
                <CarInfo data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} />
                <Breaks data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} operation={this.props.operation} />
                <p style={{margin: '10px 0 10px 8px', fontSize: '14px', color: '#6f6f6f'}}>在线支付可使用钻石减免，最高可减免10元</p>
            </div>
        );
    }
}

export default CarPay;