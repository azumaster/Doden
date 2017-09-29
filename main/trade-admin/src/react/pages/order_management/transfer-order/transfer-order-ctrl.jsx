/*
* 转接订单
* */

import React from 'react';
import BuyerList from './buyer-list.jsx';
import SellerList from './seller-list.jsx';

class TransferOrderCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderPageState: 1,  //1为买家版，2卖家版，3商品版;
            privilege: null  //当前用户的所有权限;
        };
        this.setPageState = this.setPageState.bind(this);
    }

    componentWillMount() {
        //当前用户的所有权限获取;
        let tabData = this.props.currentTabData,
            userNavigate = this.props.userNavigate;
        if(this.props.userNavigate && this.props.userNavigate != '') {
            if(userNavigate[tabData.parentId] && userNavigate[tabData.parentId][tabData.id]){
                this.setState({privilege: this.props.userNavigate[tabData.parentId][tabData.id]});
            }
        }
    }

    setPageState(page) {
        this.setState({orderPageState: page});
    }

    render() {
        let page = '';
        if(this.state.orderPageState == 1) {
            page = (<BuyerList privilege={this.state.privilege} setPage={this.setPageState} />);
        }else if(this.state.orderPageState == 2) {
            page = (<SellerList privilege={this.state.privilege} setPage={this.setPageState} />);
        }
        return (
            <div>
                {page}
            </div>
        );
    }
}

export default TransferOrderCtrl;