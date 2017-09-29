import React from "react";
import RankControl from "./table-control.jsx";

const Rank = React.createClass({

    getInitialState(){
        return {
            violationListData: [],
            violationTypes: [],
            areaList: [],
            pageNum: 1,
            currentPage: 1
        };
    },

    getChildContext: function() {
        return {
            withDrawData: this.state.data,
            currFresh: this.refresh
        };
    },

    childContextTypes: {
        withDrawData: React.PropTypes.array,
        currFresh: React.PropTypes.func
    },

    componentDidMount(){
        this.getRegion(() => {
            this.getViolationTypes(() => {
                this.getRankData({
                    area_id: 2 ,
                    page: 1
                })
            })
        });
    },

    refresh(p = {}, fn = () => {}) {
        let params = {},
            sichuan = this.state.areaList.forEach((el) => {
                if (el.area_id === 2) {
                    params.area_id = el.area_id;
                }
            });
        Object.assign(params, p);
        this.getRankData(params, fn);
    },

    // 获取违规列表
    getRankData(param = {}, fn = () => {}){
        let server = H.server,
            obj = param,
            defaultParam = {
                size : 20
            },
            params = Object.assign(defaultParam,obj);

        this.setState({
            currentPage: param.page
        }, () => {
            server.admin_shop_seller_violation_list(params, (res) => {
                if (res.code === 0) {
                    this.setState({
                        violationListData: res.data.list || [],
                        pageNum: Math.ceil(res.data.total_count/20)
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

    // 获取违规处理类型
    getViolationTypes(callback = () => {}) {
        H.server.admin_shop_seller_violation_types({}, (res) => {
            if (res.code === 0) {
                this.setState({
                    violationTypes: res.data
                }, () => {
                    callback();
                });
            } else {
                H.Modal(res.message);
            }
        });
    },

    render(){
        let dom = '';
        if (!this.state.areaList.length || !this.state.violationTypes.length) {
            dom = (
                <div>加载中...</div>
            );
        } else {
            dom = (
                <RankControl 
                areaList={this.state.areaList}
                currentPage={this.state.currentPage} 
                pageNum={this.state.pageNum} 
                violationTypes={this.state.violationTypes}
                data={this.state.violationListData}/>
            );
        }
        return dom;
    }
});

export default Rank;