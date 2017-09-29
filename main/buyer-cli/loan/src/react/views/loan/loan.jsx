/**
 * 贷款信息的列表
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class Loan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panel: null,
            page: 1,
            size: 10,
            lists: [],
            final: false
        };
    }

    componentWillMount() {
        this.getLoanList();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate(){
        this.SCROLL.refresh();
    }

    createScroll() {
        let SCROLL = new IScroll('#loanPage', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('scrollStart', () => {
            SCROLL.options.preventDefault = true;
        });
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 300) {
                this.state.page++;
                new Promise(() => {
                    this.getLoanList();
                });
            }

        });
    }

    getLoanList(){
        let loanList = this.state.lists;

        H.loading.show();
        H.server.getLoanList({page: this.state.page, size: this.state.size}, (res)=>{
            if (res.code == 0) {
                let final = false,
                    lists = res.data.lists;
                if (lists.length <= 0) {
                    final = true;
                    H.toast('没有更多啦~');
                }

                if (this.state.page == 1) {
                    loanList = [];
                }

                loanList = loanList.concat(lists);

                this.setState({
                    lists: loanList,
                    final: final
                });
            }else{
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    createList() {
        let list = [],
            status = {
                'WAIT_LOAN_CONFIRM': '待放款',
                'WAIT_COLLECTION_CONFIRM': '待收款',
                'ALREADY_LOAN': '已放款',
                'ALREADY_PAYMENT': '已还款',
                'ALREADY_OVERDUE': '已逾期',
                'WAIT_PROD_RECEIVE': '待收货',
                'PREVIOUS_REPAYING': '还款中'
            },
            loanList = this.state.lists;

        loanList.map((loan, index) => {
            let title, bodyTop, bodyBottom, footer;
            if (status[loan.status] == '待放款') {
                // 待放款
                title = (<div className="loan-title"><p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    <p>{status[loan.status]}</p></div>);
                bodyBottom = (<div className="loan-bottom"><p>贷款期限：{loan.loan_period}天</p></div>);
            } else if (status[loan.status] == '已放款') {
                // 未还款
                title = (<div className="loan-title"><p>到期还款总额：<em className="light">{H.formatMoney(Math.round((Number(loan.loan_money)+Number(loan.charge_amt))*10)/1000, 2, '')}元</em></ p><p className="light">{status[loan.status]}</p></div>);
                bodyTop = (<div className="loan-top">
                    <div className="body-info">
                        <p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    </div>
                    <div className="body-info">
                        <p>到期手续费：{H.formatMoney(Math.round(loan.charge_amt*10)/1000, 2, '')}元</p>
                        <p>日利率：{loan.interest_rate}%</p>
                    </div>
                    <div className="body-info">
                        <p>贷款期限：{loan.loan_period}天</p>
                    </div>
                </div>);
                bodyBottom = (<div className="loan-bottom">
                    <p>到期时间：{loan.expire_date}</p>
                </div>);
                footer = (<div className="loan-footer btn-group">
                    <button type="button" data-main={loan.main_order_no} data-no={loan.loan_no} data-sub={loan.sub_order_no}
                            className="btn btn-sm btn-primary" onClick={this.toNewPage.bind(this, 'rePay', loan.status)}>提前还款
                    </button>
                    <button type="button" data-main={loan.main_order_no} data-no={loan.loan_no} data-sub={loan.sub_order_no}
                            className="btn btn-sm btn-primary" onClick={this.toNewPage.bind(this, 'detail', loan.status)}>还款详情
                    </button>
                </div>);
            }else if(status[loan.status] == '待收货'){
                title = (<div className="loan-title"><p>到期还款总额：<em className="light">{H.formatMoney(Math.round((Number(loan.loan_money)+Number(loan.charge_amt))*10)/1000, 2, '')}元</em></ p><p className="light">{status[loan.status]}</p></div>);
                bodyTop = (<div className="loan-top">
                    <div className="body-info">
                        <p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    </div>
                    <div className="body-info">
                        <p>到期手续费：{H.formatMoney(Math.round(loan.charge_amt*10)/1000, 2, '')}元</p>
                        <p>日利率：{loan.interest_rate}%</p>
                    </div>
                    <div className="body-info">
                        <p>贷款期限：{loan.loan_period}天</p>
                    </div>
                </div>);
                bodyBottom = (<div className="loan-bottom">
                    <p>到期时间：{loan.expire_date}</p>
                </div>);
            } else if (status[loan.status] == '已还款') {
                // 已结算
                title = (<div className="loan-title"><p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    <p>{status[loan.status]}</p></div>);
                bodyBottom = (<div className="loan-bottom">
                    <p>放款时间：{loan.loan_date}</p>
                </div>);
                footer = (<div className="loan-footer btn-group">
                    <button type="button" data-main={loan.main_order_no} data-no={loan.loan_no} data-sub={loan.sub_order_no}
                            className="btn btn-sm btn-primary" onClick={this.toNewPage.bind(this, 'detail', loan.status)}>还款详情
                    </button>
                </div>);
            } else if (status[loan.status] == '已逾期') {
                // 已逾期
                title = (<div className="loan-title"><p>到期还款总额：<em>{H.formatMoney(Math.round((Number(loan.loan_money)+Number(loan.charge_amt))*10)/1000, 2, '')}元</em></p><p
                    className="light">{status[loan.status]}</p></div>);
                bodyTop = (<div className="loan-top">
                    <div className="body-info">
                        <p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    </div>
                    <div className="body-info">
                        <p>到期手续费：{H.formatMoney(Math.round(loan.charge_amt*10)/1000, 2, '')}元</p>
                        <p>日利率：{loan.interest_rate}%</p>
                    </div>
                </div>);
                bodyBottom = (<div className="loan-bottom">
                    <p>贷款期限：{loan.loan_period}天</p>
                    <p>放款时间：{loan.loan_date}</p>
                    <p>到期时间：{loan.expire_date}</p>
                </div>);
                footer = (<div className="loan-footer btn-group">
                    <button type="button" data-main={loan.main_order_no} data-no={loan.loan_no} data-sub={loan.sub_order_no} className="btn btn-sm btn-primary"
                            onClick={this.toNewPage.bind(this, 'detail', loan.status)}>还款详情
                    </button>
                </div>);
            } else if (status[loan.status] == '还款中'){
                // 还款中
                title = (<div className="loan-title"><p>到期还款总额：<em>{H.formatMoney(Math.round((Number(loan.loan_money)+Number(loan.charge_amt))*10)/1000, 2, '')}元</em></p>
                    <p>{status[loan.status]}</p></div>);
                bodyTop = (<div className="loan-top">
                    <div className="body-info">
                        <p>贷款金额：<em>{H.formatMoney(Math.round(loan.loan_money*10)/1000, 2, '')}元</em></p>
                    </div>
                    <div className="body-info">
                        <p>到期手续费：{H.formatMoney(Math.round(loan.charge_amt*10)/1000, 2, '')}元</p>
                    </div>
                </div>);
                bodyBottom = (<div className="loan-bottom">
                    <p>放款时间：{loan.loan_date}</p>
                    <p>到期时间：{loan.expire_date}</p>
                </div>);
            }

            list.push(<div key={index} className="loan-item">
                {title}
                <div className="loan-body">
                    {bodyTop}
                    {bodyBottom}
                </div>
                {footer}
            </div>);
        });

        return list;
    }

    toNewPage(type, status, e){

        let data = {},
            no = e.target.dataset.no,
            sub = e.target.dataset.sub,
            arrears = e.target.dataset.total;

        data = {
            loan_no: no,
            sub_order_no: sub,
            status: status
        };

        if (arrears) {
            data.arrears = arrears;
        }
        this.props.transfer && this.props.transfer(type, data);
    }

    render() {
        return (<div id="loanPage" className="loan-page">
            <div className="scroller">
                <div className="loan-list">
                    {this.createList()}
                </div>
            </div>
        </div>);
    }
}

export default Loan;