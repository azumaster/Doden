/**
 * 冻品贷的首页
 * 隐藏了近7日贷款记录
 * 额度的动画使用的Canvas，用了一个组件<Sum />
 * Created by Doden on 2017.06.20
 */


import React from 'react';

import Sum from './../../components/sum.jsx';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homeData: null
        };
    }

    componentWillMount(){
        this.getHomeData();
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){

        let SCROLL = new IScroll('#loanHome', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    getHomeData(){
        H.loading.show();
        H.server.getHome({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    homeData: res.data
                });
            }else{
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    createLoan(){
        let total = 0, used = 0, available = 0,
            homeData = this.state.homeData;

        if(homeData){
            total = Math.round(homeData.credit_limit.total*10)/1000;
            used = Math.round(homeData.credit_limit.used*10)/1000;
            available = Math.round(homeData.credit_limit.available*10)/1000;
        }

        return (<div className="loan-head">
            <div className="loan-head-info">
                <Sum total={total} used={used}/>
                <div className="loan-big-info">
                    <p>授信总额度(元)</p>
                    <p>{H.formatMoney(total, 2, '')}</p>
                </div>
            </div>
            <div className="loan-info">
                <div className="loan-info-item">
                    <p className="loan-title">贷款可用额度(元)</p>
                    <p className="loan-money">{H.formatMoney(available, 2, '')}</p>
                </div>
                <div className="loan-info-item">
                    <p className="loan-title use">已用额度(元)</p>
                    <p className="loan-money">{H.formatMoney(used, 2, '')}</p>
                </div>
            </div>
        </div>);
    }


    createLoanList(){
        let homeData = this.state.homeData,
            loanList = [],
            loanHomeList = [];

        if(homeData) loanList = homeData.recent_loan_list;

        loanList.map((loan, index)=>{
            loanHomeList.push(<li key={index} className="loan-ul-li" onClick={this.toDetail.bind(this, loan.main_order_no, loan.loan_no)}>
                <div className="loan-li date">
                    <p>到期日</p>
                    <p>{loan.expire_date}</p>
                </div>
                <div className="loan-li money">
                    <p>￥{H.formatMoney(loan.loan_money, 2, '')}</p>
                    <p>{loan.loan_no}</p>
                </div>
                <div className="loan-li operate"><i className="icon right"></i></div>
            </li>);
        });

        return (<div className="loan-home-list">
            <div className="loan-title">近7天贷款记录</div>
            <ul className="loan-ul">{loanHomeList}</ul>
        </div>);
    }

    toDetail(main, no){
        this.props.transfer && this.props.transfer('detail', {main_order_no: main, loan_no: no});
    }

    render() {
        return (<div id="loanHome" className="loan-home">
            <div className="scroller">
                {this.createLoan()}
                {/*{this.createLoanList()}*/}
            </div>
        </div>);
    }
}

export default Home;