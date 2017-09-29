/**
 * 贷款管理的详情页
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loanDetail: null
        };
    }

    componentWillMount(){
        if(!this.props.current){
            window.location.href = '#/loan';
        }else{
            H.loading.show();
            H.server.getLoanDetail(this.props.current, (res)=>{
                if(res.code == 0){
                    this.setState({
                        loanDetail: res.data
                    });
                }else{
                    H.toast(res.message);
                }
                H.loading.hide();
            });
        }
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){

        let SCROLL = new IScroll('#loanDetail', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    createDetail(){
        let info = this.state.loanDetail,
            status = this.props.current.status;

        if(!info) return;

        let orders = info.loans[0],
            loans;

        if(status == 'ALREADY_LOAN'){
            // 已放款
            loans = (<div className="detail-info">
                <div className="detail-info-title">贷款详情</div>
                <div className="detail-info-body">
                    <p>徙木单据号：</p>
                    <p>{orders.loan_no}</p>
                </div>
                <div className="detail-info-body">
                    <p>应还本金：</p>
                    <p>{H.formatMoney(Math.round(orders.loan_money*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>应还利息：</p>
                    <p>{H.formatMoney(Math.round(orders.interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>服务费用：</p>
                    <p>{H.formatMoney(Math.round(orders.s_charge*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>还款状态：</p>
                    <p>{orders.s_status}</p>
                </div>
                <div className="detail-info-body">
                    <p>应还日期：</p>
                    <p>{orders.s_date}</p>
                </div>
                <div className="detail-info-body">
                    <p>还款期次：</p>
                    <p>{orders.s_term}</p>
                </div>
            </div>);
        }else if(status == 'ALREADY_PAYMENT'){
            // 已还款
            loans = (<div className="detail-info">
                <div className="detail-info-title">贷款详情</div>
                <div className="detail-info-body">
                    <p>徙木单据号：</p>
                    <p>{orders.loan_no}</p>
                </div>
                <div className="detail-info-body">
                    <p>会计日期：</p>
                    <p>{orders.repayment_date}</p>
                </div>
                <div className="detail-info-body">
                    <p>还款期次：</p>
                    <p>{orders.s_term}</p>
                </div>
                <div className="detail-info-body">
                    <p>应还日期：</p>
                    <p>{orders.s_date}</p>
                </div>
                <div className="detail-info-body">
                    <p>实还本金：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_repayment_money*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还利息：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>服务费用：</p>
                    <p>{H.formatMoney(Math.round(orders.r_charge*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还本金罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.loan_actual_overdue*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还利息罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_overdue_interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>逾期天数：</p>
                    <p>{orders.overdue_days}</p>
                </div>
            </div>);
        }else{
            loans = (<div className="detail-info">
                <div className="detail-info-title">贷款详情</div>
                <div className="detail-info-body">
                    <p>徙木单据号：</p>
                    <p>{orders.loan_no}</p>
                </div>
                <div className="detail-info-body">
                    <p>应还本金：</p>
                    <p>{H.formatMoney(Math.round(orders.loan_money*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还本金：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_repayment_money*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>应收利息：</p>
                    <p>{H.formatMoney(Math.round(orders.interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还利息：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>应还本金罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.loan_overdue*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还本金罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.loan_actual_overdue*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>应还利息罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.overdue_interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>实还利息罚息：</p>
                    <p>{H.formatMoney(Math.round(orders.actual_overdue_interest*10)/1000, 2, '')}元</p>
                </div>
                <div className="detail-info-body">
                    <p>逾期天数：</p>
                    <p>{orders.overdue_days}</p>
                </div>
                <div className="detail-info-body">
                    <p>会计日期：</p>
                    <p>{orders.repayment_date}</p>
                </div>
                <div className="detail-info-body">
                    <p>期次号：</p>
                    <p>{orders.s_term}</p>
                </div>
            </div>);
        }

        let detail = (<div className="detail-body">
            <div className="detail-title"><i onClick={this.transfer.bind(this)} className="icon right"></i>贷款详情单</div>
            <div className="detail-info">
                <div className="detail-info-title">找冻品网订单</div>
                <div className="detail-info-body">
                    <p>主订单编号：</p>
                    <p>{info.orders.main_order_no}</p>
                </div>
                <div className="detail-info-body">
                    <p>子订单编号：</p>
                    <p>{info.orders.sub_order_no}</p>
                </div>
                <div className="detail-info-body">
                    <p>下单日期：</p>
                    <p>{info.orders.order_create_date}</p>
                </div>
            </div>
            {loans}
        </div>);
        return detail;
    }

    transfer(){
        this.props.transfer && this.props.transfer('loan');
    }

    render() {
        return (<div id="loanDetail" className="loan-detail">
            <div className="scroller">
                {this.createDetail()}
            </div>
        </div>);
    }
}

export default Detail;