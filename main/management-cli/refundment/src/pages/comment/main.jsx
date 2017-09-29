import React from 'react';
import Control from './table-control.jsx';

const Main = React.createClass({

    getInitialState(){
        return {
            ListData: [],
            status: 1,
            pageNum: 1,
            currentPage: 1
        };
    },

    getChildContext: function() {
        return {
            listData: this.state.data,
            currFresh: this.refresh
        };
    },

    childContextTypes: {
        listData: React.PropTypes.array,
        currFresh: React.PropTypes.func
    },

    componentDidMount() {
        this.getListData();
    },

    refresh(p = {}, fn = () => {}) {
        let params = {};
        Object.assign(params, p);
        this.getListData(params, fn);
    },

    // 获取列表
    getListData(param = {}, fn = () => {}){
        let obj = param,
            defaultParam = {
                size: 20,
                page: 1,
                status: 1
            },
            params = Object.assign(defaultParam, obj);

        this.setState({
            currentPage: params.page
        }, () => {
            H.server.order_refund_list(params, (res) => {
                if (res.code === 0) {
                    this.setState({
                        ListData: res.data.refund_infos || [],
                        pageNum: Math.ceil(res.data.total/20),
                        status: params.status
                    }, () => {
                        fn();
                    });
                } else {
                    H.Modal(res.message);
                }
            });
        });
    },

    render(){
          return (
                <Control
	                currentPage={this.state.currentPage} 
	                pageNum={this.state.pageNum}
                    status={this.state.status}
	                data={this.state.ListData}/>
            );
    }
});

export default Main;