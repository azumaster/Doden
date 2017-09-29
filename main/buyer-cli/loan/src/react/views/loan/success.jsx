/**
 * 还款成功的界面（因为西姆金融无法做到实时打款，所以暂时弃用）
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class Success extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        if(!this.props.current){
            // 如果用户强制刷新，没有获取到current,则会返回到上一页
            window.location.href = '#/loan';
            return;
        }

        console.log(this.props.current);
    }

    success(){
        window.location.href = '#/loan';
    }

    render() {
        return (<div id="loanStatus" className="status">
            <div className="status-head">
                <img src="./Public/images/success.png"/>
                <div className="status-word">
                    <p>还款成功!</p>
                    <p className="word-money">{H.formatMoney(Math.round(this.props.current.arrears*10)/1000, 2, '')}元（{this.props.current.day}天）</p>
                </div>
            </div>
            <div className="status-operate">
                <p>您可以在"我的贷款"中查看</p>
                <div className="status-btn">
                    <button type="button" className="btn btn-large btn-primary" onClick={this.success.bind(this)}>完成</button>
                </div>
            </div>
        </div>);
    }
}

export default Success;