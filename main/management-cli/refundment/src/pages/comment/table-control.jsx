import React from 'react';
import PageCtrlBar from '../../components/page/paging';
import Btn from '../../components/btn/btn.js';
import Refresh from '../../components/refresh/refresh.js';
import FuzzySearchControl from './fuzzy-search-control.jsx';

import TrInfo from './tr-info.jsx';

let Control = React.createClass({

    contextTypes: {
        listData: React.PropTypes.array,
        currFresh: React.PropTypes.func
    },

    getInitialState(){
        return {
            infoPanelIsShow: false,
            filterCondition: {},
            btnGroupFilter: [
                {name: '待处理', selected: true,  status: 1},
                {name: '已退款', selected: false, status: 2},
                {name: '已撤回', selected: false, status: 3},
                {name: '失败',   selected: false, status: 4}
            ]
        };
    },

    getCurrentPageData(condition = {}){
        // 根据已有的状态跟新当前页的数据业务逻辑
            // 与当前已有的条件进行合并
        let newCondition = Object.assign(this.state.filterCondition, condition);
        this.setState({
            filterCondition: newCondition,
            infoPanelIsShow: false
        }, () => {
            this.context.currFresh(this.state.filterCondition);
        });
    },

    showBtnGroupFilterResult(key, params, status, e){
        e.preventDefault();
        // 发起请求的时候，其余按钮disabled，直到请求完成
        let btn = $(e.target);
        btn.siblings().prop('disabled', true);
        // 与当前已有的条件进行合并
        let newCondition = Object.assign(this.state.filterCondition, params, {page: 1}),
            // 改变筛选按钮的选中状态
            newBtnGroupFilter = this.state[key].map((value) => {
                value.selected = (value.status === status);
                return value;
            });
        // 更新页面的筛选条件的状态
        this.setState({
            filterCondition: newCondition,
            btnGroupFilter: (key === 'btnGroupFilter' ? newBtnGroupFilter : this.state.btnGroupFilter),
            infoPanelIsShow: false
        }, () => {
            let params = this.state.filterCondition;
            this.context.currFresh(params, () => {
                btn.siblings().prop('disabled', false);
            });
        });
    },

    showInfoPanel(){
        this.setState({
            infoPanelIsShow: true
        });
    },

    hideInfoPanel(){
        this.setState({
            infoPanelIsShow: false
        });
    },

    refresh(){
        this.setState({
            filterCondition:{},
            infoPanelIsShow: false
        }, () => {
            // 初始化关键字搜索和日期选择，再点击筛选按钮组中的全部按钮来请求全部数据一次来达到页面刷新的效果
            $('#component_search_input').val('');
            // $('#time_startTime').val(H.getSouroundDate(7));// 将开始日期与技术日期相差的间隔为一周
            // $('#time_endTime').val('' + H.Date.getFullYear() + '-' + H.Date.getMonth() + '-' + H.Date.getDate());
            $('#withdraw_btn_w').children('button:first').click();
        });
    },

    // finish(value) {
    //     H.server.order_appraise_admin_finish_dispose({
    //         appraise_id: value.appraise_id
    //     }, (res) => {
    //         if (res.code === 0) {
    //             H.Modal(res.message || 'ok');
    //             this.getCurrentPageData();
    //         } else {
    //             H.Modal(res.message);
    //         }
    //     });
    // },

    // 撤回退款 
    refundHandler(refund_no = '') {
        H.Modal({
            content: '确认该操作？',
            closeBtn: true,
            autoClose: false,
            okCallback(o) {
                H.server.order_refund_cancel({
                    refund_no: refund_no
                }, (res) => {
                        o.el
                            .html(res.message)
                            .siblings('.dialog-btn-group')
                            .find('button')
                            .attr('disabled', 'true');

                        setTimeout(() => {
                            o.destroy();
                        }, 1500);
                });
            }
        });
    },

    // 主表数据同步
    trInfoRefreshParent(condition = {}, fn = () => {}) {
        let newCondition = Object.assign(this.state.filterCondition, condition);
        this.setState({
            filterCondition: newCondition
        }, () => {
            this.context.currFresh(this.state.filterCondition, () => {
                fn();
            });
        });
    },

    render(){

        let status = ['', '待处理', '处理中', '已退款', '已撤回', '失败'];

        return (
            <div className="section-withdraw">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form action="" className="form-inline">
                        <div className="search-inputs-w">
                            <FuzzySearchControl searchHandler={this.getCurrentPageData} dropdownMenus={['订单ID', '店铺名']}/>
                        </div>

                        <div className="btn-groups-w">
                            <div id="withdraw_btn_w" className="btn-group btn-w">
                                {this.state.btnGroupFilter.map((value, index)=>{
                                    return (
                                        <Btn
                                            key={'btnFilter_' + index}
                                            name={value.name}
                                            otherClass={value.selected ? 'btn-primary' : ''}
                                            btnEvent={this.showBtnGroupFilterResult.bind(this, 'btnGroupFilter', {status: value.status}, value.status)}/>
                                    );
                                })}
                            </div>
                            <button className="addItemBtn btn btn-default" type="button" onClick={this.showInfoPanel}>添加退款</button>
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-responsive">
                    	<thead>
                            <tr>
                                <th>退款号</th>
                                <th>订单号</th>
                                <th>买家</th>
                                <th>收款微信名</th>
                                <th>实收金额</th>
                                <th>退款金额</th>
                                <th>发起时间</th>
                                <th>处理时间</th>
                                <th>退款状态</th>
                                <th>操作</th>
                            </tr>
                    	</thead>
                        <tbody>
                            {this.props.data.map((value, index)=>{
                                return (
                                    <tr key={'tr_' + index}>
                                        <td>{value.refund_no}</td>
                                        <td>{value.sub_order_no}</td>
                                        <td>{value.buyers_shop_name}</td>
                                        <td>{value.buyers_wechat_name}</td>
                                        <td>{value.payment_amount}</td>
                                        <td>{value.refund_amount}</td>
                                        <td>{value.create_time}</td>
                                        <td>{value.update_time}</td>
                                        <td>{status[value.status]}</td>
                                        <td>
                                            { value.status === 1 ? (<button className="btn btn-primary" onClick={this.refundHandler.bind(this, value.refund_no)}>撤回</button>) : '' }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <PageCtrlBar clickCallback={this.getCurrentPageData} pageNum={this.props.currentPage} maxPage={this.props.pageNum}/>

                </div>

                <div className={ this.state.infoPanelIsShow ? 'section-tr-info show' : 'section-tr-info' }>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <TrInfo 
                        parentFresh={this.trInfoRefreshParent}/>
                </div>
            </div>
        );
    }
});

module.exports = Control;