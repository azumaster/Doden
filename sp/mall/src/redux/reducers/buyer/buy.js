/*
*找货页面的reducers
* */

//搜索商品时商品分类列表;
const customerType = (state = null, action) => {
    switch (action.type) {
        case 'GET_CUSTOMER_TYPE':
            return action.data;
        default:
            return state;
    }
};

//当前选择分类搜索的分类数组：[0]:选择的二级分类，[1]:选择的三级分类
const goodsTypeState = (state = [], action) => {
    switch (action.type){
        case 'SET_GOODS_TYPE':
            return action.data;
        default:
            return state;
    }
};

//设置搜索和筛选的参数;
const param = {    //搜索商品的参数;
    type_ids: [],
    xinghaos: [],
    brand_ids: [],
    order: [0, true],
    halal: null,
    page: 1,
    state: 0,
    size: 20
};
const searchGoodsParam = (state = param, action) => {
    switch (action.type) {
        case 'SET_GOODS_PARAM':
            return action.data;
        default:
            return state;
    }
};

//搜索的商品列表;
const searchGoodsList = (state = {page_all: -1, list: [], page: 1}, action) => {
    switch (action.type) {
        case 'GET_SEARCH_GOODS_DATA':
            return {
                page_all: action.data.page_all,
                list: action.data.page == 1 ? action.data.goods : state.list.concat(action.data.goods),
                page: action.data.page
            };
        default:
            return state;
    }
};

//获取搜索商品的筛选项;
const goodsFilter = (state = null, action) => {
    switch (action.type) {
        case 'GET_GOODS_FILTER':
            return action.data;
        default:
            return state;
    }
};

//获取搜索商品的筛选项;
const typeFilter = (state = {state: -1, data: []}, action) => {
    switch (action.type) {
        case 'SET_TYPE_FILTER':
            return action.data;
        default:
            return state;
    }
};

export default {
    goodsTypeState,
    searchGoodsList,
    goodsFilter,
    customerType,
    searchGoodsParam,
    typeFilter
};