/**
 * 贷款管理的还款中（目前前端界面显示的只有这一个界面）
 * Created by Doden on 2017.06.26
 */

import React from 'react';

class RePaying extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        console.log(this.props.current);
        if(!this.props.current){
            // 如果用户强制刷新，没有获取到current,则会返回到上一页
            window.location.href = '#/loan';
            return;
        }
    }

    rePay(){
        this.props.transfer && this.props.transfer('loan');
    }

    render() {
        return (<div id="loanStatus" className="status">
            <div className="status-head">
                <img src="http://img.idongpin.com/Public/images/loan/rePay.png@640w_100Q.png"/>
                <div className="status-word">
                    <p>还款中!</p>
                    <p className="word-money">{H.formatMoney(Math.round(this.props.current.arrears*10)/1000, 2, '')}元（{this.props.current.day}天）</p>
                </div>
            </div>
            <div className="status-operate">
                <p>还款正在进行人工审核，请耐心等待！</p>
                <div className="status-btn">
                    <button type="button" className="btn btn-large btn-primary" onClick={this.rePay.bind(this)}>完成</button>
                </div>
            </div>
        </div>);
    }
}

export default RePaying;