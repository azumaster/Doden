import React from 'react';
import CarInfo from './car-info.jsx';
import Breaks from './breaks.jsx';
import TakeInfo from './take-info.jsx';

class OnlinePayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'receivingWay': 2  //收货方式，2自己有车,3冻车/物流;
        };
        this.showReceivingWay = this.showReceivingWay.bind(this);
    }

    changeReceivingWay(status) {
        this.setState({receivingWay: status}, () => {
            let data = this.props.data;
            data.logistics_method = this.state.receivingWay;
            this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
        });
    }

    showReceivingWay() {
        if(this.state.receivingWay == 2) {
            return (<CarInfo data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} scrollRefresh={this.props.scrollRefresh} />);
        }else {
            return (
                <TakeInfo data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} areaData={this.props.areaData} scrollRefresh={this.props.scrollRefresh} />
            );
        }
    }

    render() {
        return (
            <div className="goods-list">
                <section className="section-item">
                    <div className="header-cell flex-box">
                        <div className="flex-num1">收货方式</div>
                    </div>
                    <div className="body-cell flex-box" onClick={this.changeReceivingWay.bind(this, 2)}>
                        <div className="flex-num1">
                            自己有车
                        </div>
                        <i className={this.state.receivingWay == 2 ? 'radio-icon selected' : 'radio-icon'}></i>
                    </div>
                    <div className="body-cell flex-box" onClick={this.changeReceivingWay.bind(this, 3)}>
                        <div className="flex-num1">
                            冻车/物流
                        </div>
                        <i className={this.state.receivingWay == 3 ? 'radio-icon selected' : 'radio-icon'}></i>
                    </div>
                </section>
                {this.showReceivingWay()}
                <Breaks data={this.props.data} changeSettlementInfo={this.props.changeSettlementInfo} operation={this.props.operation} />
            </div>
        );
    }
}

export default OnlinePayment;