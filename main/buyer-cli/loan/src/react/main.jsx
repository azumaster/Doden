import React from 'react';


import Home from './views/home/home.jsx';
import Loan from  './views/loan/loan.jsx';
import Repay from './views/loan/rePay.jsx';
// import Transfer from './views/loan/transfer.jsx';
import Detail from './views/loan/detail.jsx';
// import Success from './views/loan/success.jsx';
// import Fail from './views/loan/fail.jsx';
import RePaying from './views/loan/rePaying.jsx';
// import Me from './views/me/me.jsx';

/**
 * 只包含贷款首页、贷款列表、提前还款和贷款详情
 * @author:魏华东
 */

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panel: null,
            current: 0,
            currentPage: 'home',
            currentData: null,
            hashChange: false
        };
    }

    componentWillMount(){
        document.body.ontouchmove = (e)=>{
            e.preventDefault();
        };
    }

    createTabs(){
        let tabs = [{'tag': 'home', 'name': '贷款首页'}, {'tag': 'loan', 'name': '我的贷款'}],
            // tabs = [{'tag': 'home', 'name': '贷款首页'}, {'tag': 'loan', 'name': '我的贷款'}, {'tag': 'me', 'name': '我的信息'}, {'tag': 'mail', 'name': '站内信'}],
            tabItem = [];

        tabs.map((tab, index)=>{
            tabItem.push(<div key={index} data-key={index} data-name={tab.tag} onClick={this.changeTab.bind(this)} className={'tab-item' + (this.state.current==index?' active':'')}>
                <i data-key={index} data-name={tab.tag} className={'icon '+(this.state.current==index?tab.tag+'-fill':tab.tag)}></i>
                <p data-key={index} data-name={tab.tag}>{tab.name}</p>
            </div>);
        });

        return (<div id="tab" className="tab">{tabItem}</div>);
    }

    // 创建内容页
    createPanel(){
        let panel = null;

        switch (this.state.currentPage){
            case 'home':
                panel = <Home transfer={this.transfer.bind(this)}/>;
                break;
            case 'loan':
                panel = <Loan transfer={this.transfer.bind(this)}/>;
                break;
            case 'rePay':
                panel = <Repay current={this.state.currentData} transfer={this.transfer.bind(this)}/>;
                break;
            case 'detail':
                panel = <Detail current={this.state.currentData} transfer={this.transfer.bind(this)}/>;
                break;
            case 'rePaying':
                panel = <RePaying current={this.state.currentData} transfer={this.transfer.bind(this)}/>;
                break;
        }
        return panel;
    }


    transfer(type, data){
        this.setState({
            currentPage: type,
            currentData: data
        });
    }

    // 切换底部的Tab
    changeTab(e){
        let index = e.target.dataset.key?e.target.dataset.key:e.target.parentNode.dataset.key,
            name = e.target.dataset.name?e.target.dataset.name:e.target.parentNode.dataset.name;
        if(index == this.state.current){
            return;
        }

        this.setState({
            currentPage: name,
            current: index
        });
    }

    render() {
        return (<div id="loan" className="loan">
            {this.createPanel()}
            {this.createTabs()}
        </div>);
    }
}

export default Main;