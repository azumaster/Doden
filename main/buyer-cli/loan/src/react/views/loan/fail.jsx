/**
 * 贷款失败的提示（因非实时扣款，暂时弃用）
 * Created by Doden on 2017.06.23
 */

import React from 'react';

class Fail extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        if(!this.props.current){
            // 如果用户强制刷新，没有获取到current,则会返回到上一页
            window.location.href = '#/loan';
            return;
        }
    }

    transfer(){
        this.props.transfer && this.props.transfer('transfer', this.props.current);
    }

    back(){
        window.location.href = '#/loan';
    }

    render() {
        return (<div id="loanStatus" className="status">
            <div className="status-head">
                <img src="./Public/images/fail.png"/>
                <div className="status-word">
                    <p>还款失败!</p>
                </div>
            </div>
            <div className="status-operate">
                <p>请稍后再试</p>
                <div className="status-btn status-btn-group">
                    <button className="btn btn-lg" onClick={this.back.bind(this)}>返回</button>
                </div>
            </div>
        </div>);
    }
}

export default Fail;