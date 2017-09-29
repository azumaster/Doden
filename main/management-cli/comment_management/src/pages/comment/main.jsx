import React from 'react';
import Control from './table-control.jsx';

const Main = React.createClass({

    getInitialState(){
        return {
            ListData: [],
            areaList: [],
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

    componentDidMount(){
        this.getRegion(() => {
            this.getListData({
                area_id: 2,
                page: 1,
                status: 1
            });
        });
    },

    refresh(p = {}, fn = () => {}) {
        let params = {};
        this.state.areaList.forEach((el) => {
            if (el.area_id === 2) {
                params.area_id = el.area_id;
            }
        });
        Object.assign(params, p);
        this.getListData(params, fn);
    },

    // 获取列表
    getListData(param = {}, fn = () => {}){
        let server = H.server,
            obj = param,
            defaultParam = {
                size: 20,
                page: 1,
                date_begin: $('#time_startTime').val(),
                date_end: $('#time_endTime').val(),
                status: 1
            },
            params = Object.assign(defaultParam, obj);

        this.setState({
            currentPage: params.page
        }, () => {
            server.order_appraise_admin_list(params, (res) => {
                if (res.code === 0) {
                    this.setState({
                        ListData: res.data.appraise_infos || [],
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

    // 拉取大区
    getRegion(fn = () => {}) {
        H.server.area_list({}, (res) => {
            if (res.code === 0) {
                this.setState({
                    areaList: res.data
                }, () => {
                    fn();
                });
            } else {
                H.Modal(res.message);
            }
        });
    },

    render(){
        let dom = '';
        if (this.state.areaList.length === 0) {
            dom = (
                <div>加载中...</div>
            );
        } else {
            dom = (
                <Control 
	                areaList={this.state.areaList}
	                currentPage={this.state.currentPage} 
	                pageNum={this.state.pageNum}
                    status={this.state.status}
	                data={this.state.ListData}/>
            );
        }
        return dom;
    }
});

export default Main;