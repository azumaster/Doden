/**
 * 贷款管理的提前还款
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class RePay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rePay: null
        };
    }

    componentWillMount(){

        if(!this.props.current){
            // 如果用户强制刷新，没有获取到current,则会返回到上一页
            window.history.back();
            return;
        }

        H.loading.show();
        H.server.getRePayInfo(this.props.current, (res)=>{
            if(res.code == 0){
                this.setState({
                    rePay: res.data
                });
            }else {
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){

        let SCROLL = new IScroll('#repay', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    rePay(){
        let current = this.props.current;
        current.arrears = this.state.rePay.arrears;
        current.day = this.state.rePay.repay_day;

        H.loading.show('还款中...');
        H.server.rePay(this.props.current, (res)=>{
            if(res.code == 0){
                this.props.transfer && this.props.transfer('rePaying', current);
            }else {
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    render() {
        let rePayInfo = this.state.rePay;

        if(!rePayInfo) return null;

        return (<div className="repay" id="repay">
            <div className="scroller">
                <div className="repay-head">
                    <p className="repay-notice">请确认以下还款信息</p>
                    <p className="repay-tip">总还款金额(元)</p>
                    <p className="repay-money">{H.formatMoney(Math.round(rePayInfo.arrears*10)/1000, 2, '')}</p>
                </div>
                <ul className="repay-body">
                    <li className="repay-li">
                        <p>贷款金额</p>
                        <p>{H.formatMoney(Math.round(rePayInfo.loan_money*10)/1000, 2, '')}元</p>
                    </li>
                    <li className="repay-li">
                        <p>应还利息</p>
                        <p>{H.formatMoney(Math.round(rePayInfo.interest*10)/1000, 2, '')}元</p>
                    </li>
                    <li className="repay-li">
                        <p>手续费</p>
                        <p>{H.formatMoney(Math.round(rePayInfo.repay_fee*10)/1000, 2, '')}元</p>
                    </li>
                    <li className="repay-li">
                        <p>计息天数</p>
                        <p>{rePayInfo.repay_day}天</p>
                    </li>
                    <li className="repay-li">
                        <p>返还利息</p>
                        <p>{H.formatMoney(Math.round(rePayInfo.return_inte*10)/1000, 2, '')}元</p>
                    </li>
                    <li className="repay-li">
                        <p>应退利息总额</p>
                        <p>{H.formatMoney(Math.round(rePayInfo.return_inte_total*10)/1000, 2, '')}元</p>
                    </li>
                    <li className="repay-li">
                        <p>备注信息</p>
                        <p>{rePayInfo.remark}</p>
                    </li>
                </ul>
                <div className="repay-btn">
                    <button className="btn btn-full btn-primary" onClick={this.rePay.bind(this)}>确认还款</button>
                </div>
            </div>
        </div>);
    }
}

export default RePay;