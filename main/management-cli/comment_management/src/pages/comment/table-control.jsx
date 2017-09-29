import React from 'react';
import PageCtrlBar from '../../components/page/paging';
import Btn from '../../components/btn/btn.js';
import Refresh from '../../components/refresh/refresh.js';
import FuzzySearchControl from './fuzzy-search-control.jsx';
import TimeSearchControl from './time-search-control.jsx';

import TrInfo from './tr-info.jsx';

let Control = React.createClass({

    contextTypes: {
        listData: React.PropTypes.array,
        currFresh: React.PropTypes.func
    },

    getInitialState(){
        return {
            infoPanelIsShow: false,
            infoPanelFlag: {},

            orderInfoData: [],
            filterCondition: {},
            btnGroupFilter: [
                {name: '待处理', selected: true, status: 1},
                {name: '已完成', selected: false, status: 2},
                {name: '已删除', selected: false, status: 3},
                {name: '中好评', selected: false, status: 4}
            ],
            areaFilter:[],
            areaGroupFilter: []
        };
    },

    componentDidMount() {
        this.areaFilterGroupGenerate(this.props.areaList);
    },

    areaFilterGroupGenerate(areas = [], fn = () => {}) {
        let arealist = areas.map((el) => {
            let obj = {
                    name: el.area_name,
                    selected: false,
                    status: el.area_id
                };
                if (el.area_id === 2) {
                    obj.selected = true;
                }
                return obj;
            });

        this.setState({
            areaFilter: arealist
        }, () => {
            fn();
        });
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
            areaFilter: (key === 'areaFilter' ? newBtnGroupFilter : this.state.areaFilter),
            infoPanelIsShow: false
        }, () => {
            let params = this.state.filterCondition;
            this.context.currFresh(params, () => {
                btn.siblings().prop('disabled', false);
            });
        });
    },

    showInfoPanel(value){
        let server = H.server,
            params = {
                appraise_id: value.appraise_id
            };

        this.setState({
            infoPanelIsShow: true,
            infoPanelFlag: value
        });

        server.order_appraise_admin_dispose_list(params, (res) => {
            if (res.code === 0) {
                this.setState({
                    orderInfoData: res.data.list_infos || []
                });
            } else {
                H.Modal(res.message);
            }
        });
    },

    hideInfoPanel(){
        this.setState({
            infoPanelIsShow: false
        });
    },

    refresh(){
        let newAreaList = this.state.areaFilter.map((el) => {
            el.selected = el.status === 2;
            return el;
        });

        this.setState({
            filterCondition:{},
            areaFilter: newAreaList,
            infoPanelIsShow: false
        }, () => {
            // 初始化关键字搜索和日期选择，再点击筛选按钮组中的全部按钮来请求全部数据一次来达到页面刷新的效果
            $('#component_search_input').val('');
            $('#time_startTime').val(H.getSouroundDate(7));// 将开始日期与技术日期相差的间隔为一周
            $('#time_endTime').val('' + H.Date.getFullYear() + '-' + H.Date.getMonth() + '-' + H.Date.getDate());
            $('#withdraw_btn_w').children('button:first').click();
        });
    },

    finish(value) {
        H.server.order_appraise_admin_finish_dispose({
            appraise_id: value.appraise_id
        }, (res) => {
            if (res.code === 0) {
                H.Modal(res.message || 'ok');
                this.getCurrentPageData();
            } else {
                H.Modal(res.message);
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
        const generateStar = (num) => {
            let dom = [1, 2, 3, 4, 5].map((el, index) => {
                if (el <= num) {
                    return (<i key={index} className="iconfont icon-star icon-star-yellow"></i>);
                } else {
                    return (<i key={index} className="iconfont icon-star"></i>);
                }
            });

            return dom;
        };
        return (
            <div className="section-withdraw">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form action="" className="form-inline">
                        <div className="search-inputs-w">
                            <FuzzySearchControl searchHandler={this.getCurrentPageData} dropdownMenus={['买家店铺名', '买家名字', '卖家店铺名', '卖家名字', '商品名字', '商品订单号']}/>

                            <div className="time-search-w">
                                <TimeSearchControl  searchHandler={this.getCurrentPageData}/>
                            </div>
                        </div>

                        <div className="btn-groups-w">
                            <div id="rank_areaBtn_w" className="btn-group btn-w">
                                {this.state.areaFilter.map((value, index)=>{
                                    return (<Btn
                                            key={'area_' + index}
                                            name={value.name}
                                            otherClass={value.selected ? 'btn-primary' : ''}
                                            btnEvent={this.showBtnGroupFilterResult.bind(this, 'areaFilter', {area_id: value.status}, value.status)}/>
                                    );
                                })}
                            </div>

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
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-responsive">
                    	<thead>
                            <tr>
                                <th>ID</th>
                                <th>订单ID</th>
                                <th>地区</th>
                                <th>买家</th>
                                <th>商品名</th>
                                <th>卖家</th>
                                <th>商品评价</th>
                                <th>服务评价</th>
                                <th>评价时间</th>
                                <th>操作</th>
                            </tr>
                    	</thead>
                        <tbody>
                            {this.props.data.map((value, index)=>{
                                return (
                                    <tr key={'tr_' + index}>
                                        <td>{value.appraise_id}</td>
                                        <td>{value.sub_order_no}</td>
                                        <td>
                                            {value.buyer_infos.market}
                                        </td>
                                        <td>
                                            <div>{value.buyer_infos.shop_name}</div>
                                            <div>{value.buyer_infos.name}</div>
                                            <div>{value.buyer_infos.phone}</div>
                                        </td>
                                        <td>
                                            <div>{value.goods_infos.name}</div>
                                            <div>{value.goods_infos.price + ' * ' + value.goods_infos.buy_number + value.goods_infos.unit + ' = ' + value.goods_infos.total_price}元</div>
                                        </td>
                                        <td>
                                            <div>{value.sell_infos.shop_name}</div>
                                            <div>{value.sell_infos.name}</div>
                                            <div>{value.sell_infos.phone}</div>
                                        </td>
                                        <td>
                                            <div>
                                                <span>品质：</span>
                                                <span>
                                                    {generateStar(value.quality)}
                                                </span>
                                            </div>
                                            <div>
                                                <span>评价：</span>
                                                <span>{value.content}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span>卖家服务：</span>
                                                <span>
                                                    {generateStar(value.order_appraise.sell_service)}
                                                </span>
                                            </div>
                                            <div>
                                                <span>平台服务：</span>
                                                <span>
                                                    {generateStar(value.order_appraise.service_platform)}
                                                </span>
                                            </div>
                                            <div>
                                                <span>发货速度：</span>
                                                <span>
                                                    {generateStar(value.order_appraise.delivery_speed)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{value.create_time}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={this.showInfoPanel.bind(this, value)}>备注</button>
                                            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            {this.props.status === 1 ? <button className="btn btn-primary" onClick={this.finish.bind(this, value)}>完成</button> : ''}
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
                        infoData={this.state.orderInfoData}
                        infoFlag={this.state.infoPanelFlag}
                        infoFreshHandler={this.showInfoPanel}
                        parentFresh={this.trInfoRefreshParent}/>
                </div>
            </div>
        );
    }
});

module.exports = Control;