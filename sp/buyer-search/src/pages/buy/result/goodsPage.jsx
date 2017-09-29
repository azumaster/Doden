/*
* 搜索出的商品列表
* Created by xy on 2017.03.08.
* */

import React from 'react';
import TypeFilter from './typeFilter.jsx';
import Sort from './sort.jsx';
import GoodsList from './goodsList.jsx';
import Action from '../../../redux/actions/action.js';
import Filter from './filter.jsx';
import { connect } from 'react-redux';

class goodsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            filterParam: {    //获取筛选项的;
                select: ['halal', 'categories', 'brands']
            },
            isType: false,    //是否选择了四级分类;
            filterShow: false, //显示筛选框;
            backScrollTop: false   //返回滚动条顶部;
        };
    }

    componentWillMount() {
        //当搜索状态为false时，表示即不是分类搜索进入也不是关键词搜索进入,直接跳到分类界面;
        //if(!this.props.param.state) window.location.href = $.seller ? '#/seller/mall' : '#/buyer/buy';
        let c_id = $.hashParam('c_id');
        let b_id = $.hashParam('b_id');
        let type_id = $.hashParam('type_id');
        let halal = $.hashParam('halal') ? true : null;
        if(c_id) {
            this.searchGoods(c_id);
        }else if(b_id) {
            this.keyWordsSearch(b_id);
        }else if(type_id) {
            this.searchGoods(type_id, halal);
        }
    }

    //按分类ID搜索;
    searchGoods(typeId, halal) {
        let data = this.props.goodsTypeState,
            param = this.props.param;
        data[1] = typeId;
        param.type_ids = [data[1]];
        param.xinghaos = [];
        param.brand_ids = [];
        param.order = [0, true];
        param.halal = halal;
        param.page = 1;
        param.state = 2;
        param.search = '';
        this.props.getTypeFilter(data);
        this.props.searchGoods(param);   //请求商品数据;
        this.props.getGoodsFilter({type_ids: [data[1]], select: ['halal', 'brands']});   //请求筛选项;
    }

    //输入关键词搜索;
    keyWordsSearch(bId) {
        let param = this.props.param;
        param.search = '';  //关键词搜索时更新搜索的参数;
        param.type_ids = [];
        param.xinghaos = [];
        param.brand_ids = [bId];
        param.order = [0, true];
        param.halal = null;
        param.page = 1;
        param.state = 1;
        this.props.searchGoods(param);   //请求商品数据;
        this.props.getGoodsFilter({search: '', select: ['halal', 'categories', 'brands']});   //请求筛选项;
    }

    //更改搜索的参数并执行一次搜索;
    setParam(key, value) {
        let param = this.props.param;
        if(key != 'page') {
            param.page = 1;
            this.state.backScrollTop = true;
        }
        if(key == 'type_ids') {   //选择商品列表上方的分类时，;
            param.order = [0, true];
            param.xinghaos = [];
            param.brand_ids = [];
            if(value) {   //选择了其它分类;
                this.state.filterParam[key] = [value];
                param[key] = [value];
                this.state.filterParam.select = ['halal', 'xinghaos', 'brands'];
            }else {    //如果选择了全部分类需要把第三级分类设置回去, 并且筛选项中没有型号;
                if(param.state == 2) {
                    this.state.filterParam[key] = [this.props.currentGoodsType[1]];
                    param[key] = [this.props.currentGoodsType[1]];
                }
                this.state.filterParam.select = ['halal', 'brands'];
            }
            this.getFilter();
        }else {   //order, page
            param[key] = value;
        }
        this.props.searchGoods(param);
    }

    setFilterShow(bool, val) {
        let param = this.props.param;
        if(val) {
            param = Object.assign(param, val);
            param.page = 1;
            param.order = [0, true];
            this.props.searchGoods(param);
            this.state.backScrollTop = true;
        }
        this.setState({filterShow: bool});
    }

    //获取当前搜索条件上的筛选项;
    getFilter() {
        this.props.getGoodsFilter(this.state.filterParam);
    }

    setBackScrollTop(cb) {
        this.setState({backScrollTop: false}, cb);
    }

    render() {
        let param = this.props.param,
            style = null;
        if(param.state == 1) {
            style = {top: 0};
        }
        return (

            <div>
                <div className="result-page" style={{bottom: $.seller && 0}}>
                    {param.state == 2 && this.props.filter ? <TypeFilter setParam={this.setParam.bind(this)} /> : null}
                    <Sort param={param} setParam={this.setParam.bind(this)} setFilterShow={this.setFilterShow.bind(this)} />
                    <GoodsList list={this.props.list}
                               setParam={this.setParam.bind(this)}
                               param={param}
                               backScrollTop={this.state.backScrollTop}
                               setBackScrollTop={this.setBackScrollTop.bind(this)}
                    />
                    {
                        this.props.filter ?
                            <Filter filterShow={this.state.filterShow}
                                    filterData={this.props.filter}
                                    setFilterShow={this.setFilterShow.bind(this)}
                                    param={param}
                        /> : null
                    }
                    {
                        this.props.list.page_all != -1 && this.props.list.list.length <= 0 ?
                            <div className="search-goods-no" style={style}>
                                <img src={$.cdn() + 'Public/service-provider/images/search-goods-no.png'} />
                                <p className="note">暂未搜到该商品，您可以联系店铺找货</p>
                                {
                                    this.props.contactShop ? <a href={'tel:'+this.props.contactShop.mobile} className="btn btn-full btn-primary">联系店铺</a> : null
                                }
                            </div> : null
                    }
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentGoodsType: state.goodsTypeState,
        list: state.searchGoodsList,
        filter: state.goodsFilter,
        param: state.searchGoodsParam,
        contactShop: state.contactShop,
        goodsType: state.customerType,
        goodsTypeState: state.goodsTypeState
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getGoodsType: (data)=>{Action(dispatch, 'fetchGoodsType', data);},
        getCustomerType: (data) => {Action(dispatch, 'fetchGetCustomerType', data);},
        setParam: (data)=>{Action(dispatch, 'fetchSetParam', data);},
        searchGoods: (data) => {Action(dispatch, 'fetchSearchGoods', data);},
        getGoodsFilter: (data) => {Action(dispatch, 'fetchGetGoodsFilter', data);},
        getContactShop: (data) => {Action(dispatch, 'fetchGetContactShop', data);},
        getTypeFilter: (data) => {Action(dispatch, 'fetchGetTypeFilter', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(goodsPage);