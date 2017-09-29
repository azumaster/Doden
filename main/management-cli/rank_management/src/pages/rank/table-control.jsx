import React from "react";
import Table from "../../components/table/tables.js";
import PageCtrlBar from "../../components/page/paging";
import Btn from "../../components/btn/btn.js";
import Refresh from "../../components/refresh/refresh.js";
import FuzzySearchControl from "./fuzzy-search-control.jsx";
// import TimeOptionSearchControl from "./timeOption-search-control.jsx";

import TrInfo from "./tr-info.jsx";

let RankControl = React.createClass({

    contextTypes: {
        withDrawData: React.PropTypes.array,
        currFresh: React.PropTypes.func
    },

    getInitialState(){
        return {
            infoPanelIsShow: false,
            infoPanelFlag: {},
            orderInfoData: [],
            filterCondition: {},
            btnGroupFilter: [],
            areaFilter:[],
            areaGroupFilter: []
        }
    },

    componentDidMount() {
        this.areaFilterGroupGenerate(this.props.areaList, () => {
            this.btnFilterGroupGenerate(this.props.violationTypes);
        });
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

    btnFilterGroupGenerate(types = [], fn = () => {}) {
        let vTypes = types.map((el) => {
                return {
                    name: el.title,
                    selected: false,
                    status: el.type
                };
            });
        vTypes.unshift({
                    name:"全部违规",
                    selected:true,
                    status: ''
                });
        this.setState({
            btnGroupFilter: vTypes
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
        btn.siblings().prop('disabled',true);
        // 与当前已有的条件进行合并
        let newCondition = Object.assign(this.state.filterCondition, params, {page: 1}),
            // 改变筛选按钮的选中状态
            newBtnGroupFilter = this.state[key].map((value, index)=>{
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
                shop_id: value.shop_id,
                type: this.state.filterCondition.violation_type
            };

        this.setState({
            infoPanelIsShow: true,
            infoPanelFlag: value
        });

        server.admin_shop_seller_violation_logs(params, (res) => {
            if (res.code === 0) {
                this.setState({
                    orderInfoData: res.data
                });
            } else {
                H.Modal(res.message);
            }
        });
    },

    hideInfoPanel(){
        this.setState({
            infoPanelIsShow: false
        })
    },

    refresh(){
        let newAreaList = this.state.areaFilter.map((el) => {
            if(el.status === 2) {
                el.selected = true;
            } else {
                el.selected = false;
            }
            return el;
        });

        this.setState({
            filterCondition:{},
            areaFilter: newAreaList,
            infoPanelIsShow: false
        }, () => {
            // 初始化关键字搜索和日期选择，再点击筛选按钮组中的全部按钮来请求全部数据一次来达到页面刷新的效果
            $('#component_search_input').val('');
            // $('#withdraw_startTime').val(H.getSouroundDate(7));// 将开始日期与技术日期相差的间隔为一周
            // $('#withdraw_endTime').val('' + H.Date.getFullYear() + '-' + H.Date.getMonth() + '-' + H.Date.getDate());
            $('#withdraw_btn_w').children('button:first').click();
        });
    },

    // 提交违规时，主表数据同步
    trInfoRefreshParent(condition = {}, fn = () => {}) {
        let newCondition = Object.assign(this.state.filterCondition, condition);
        this.setState({
            filterCondition: newCondition,
        }, () => {
            this.context.currFresh(this.state.filterCondition, () => {
                fn();
            });
        });
    },

    render(){
        let headArr = ['ID','店铺名','市场'];

        this.props.violationTypes.forEach((el) => {
            headArr.push(el.title);
        });

        headArr.push('当前等级','当前积分','操作');

        return (
            <div className="section-withdraw">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form action="" className="form-inline">

                        <FuzzySearchControl searchHandler={this.getCurrentPageData} dropdownMenus={['卖家店铺名','卖家名字']}/>

                        <div id="rank_areaBtn_w" className="btn-group btn-w">
                            {this.state.areaFilter.map((value, index)=>{
                                return (<Btn
                                        key={"area_" + index}
                                        name={value.name}
                                        otherClass={value.selected ? "btn-primary" : ""}
                                        btnEvent={this.showBtnGroupFilterResult.bind(this, 'areaFilter', {area_id: value.status}, value.status)}/>
                                );
                            })}
                        </div>

                        <div id="withdraw_btn_w" className="btn-group btn-w">
                            {this.state.btnGroupFilter.map((value,index)=>{
                                return <Btn
                                        key={"btnFilter_" + index}
                                        name={value.name}
                                        otherClass={value.selected ? "btn-primary" : ""}
                                        btnEvent={this.showBtnGroupFilterResult.bind(this, 'btnGroupFilter', {violation_type: value.status}, value.status)}/>
                            })}
                        </div>
                    </form>
                </div>
                <div className="section-table">

                    <Table titles={headArr} types="1">
                        <tbody>
                            {this.props.data.map((value,index)=>{
                                return (
                                    <tr key={'rank_tr_' + index}>
                                        <td>{value.shop_id}</td>
                                        <td>{value.shop_name}</td>
                                        <td>{value.market_name}</td>
                                        {value.violation_summary.map((el, index) => {
                                            return (
                                                <td key={'v_' + index}>{el.num}</td>
                                            );
                                        })}
                                        <td>{value.grade}</td>
                                        <td>{value.score}</td>
                                        <td><button className="btn btn-primary" onClick={this.showInfoPanel.bind(this, value)}>处理标记</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>

                    <PageCtrlBar clickCallback={this.getCurrentPageData} pageNum={this.props.currentPage} maxPage={this.props.pageNum}/>

                </div>

                <div className={ this.state.infoPanelIsShow ? "section-tr-info show" : "section-tr-info" }>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <TrInfo 
                        infoData={this.state.orderInfoData} 
                        infoFlag={this.state.infoPanelFlag}
                        infoFreshHandler={this.showInfoPanel}
                        parentFresh={this.trInfoRefreshParent}
                        violationTypes={this.props.violationTypes}/>
                </div>
            </div>
        );
    }
});

module.exports = RankControl;