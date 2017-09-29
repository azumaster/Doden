const SET_GOODS_TYPE = 'SET_GOODS_TYPE';
const GET_SEARCH_GOODS_DATA = 'GET_SEARCH_GOODS_DATA';
const GET_GOODS_FILTER = 'GET_GOODS_FILTER';
const GET_CUSTOMER_TYPE = 'GET_CUSTOMER_TYPE';
const SET_GOODS_PARAM = 'SET_GOODS_PARAM';
const SET_TYPE_FILTER = 'SET_TYPE_FILTER';

//获取搜索商品的分类数据;
const getCustomerType = (data) => {
    return {type: GET_CUSTOMER_TYPE, data};
};

//设置商品分类Id
const setGoodsType = (data)=>{
    return {type: SET_GOODS_TYPE, data};
};

//搜索商品;
const searchGoods = (data) => {
    return {type: GET_SEARCH_GOODS_DATA, data};
};

//获取搜索商品的筛选项;
const getGoodsFilter = (data) => {
    return {type: GET_GOODS_FILTER, data};
};

//设置商品搜索的参数;
const setGoodsParam = (data) => {
    return {type: SET_GOODS_PARAM, data};
};

//设置分类四级的筛选;
const setTypeFilter = (data) => {
    return {type: SET_TYPE_FILTER, data};
};

/*********************************************************************/

//获取搜索商品的分类数据;
const fetchGetCustomerType = (dispatch, data) => {
    $.loading.show();
    let fn = $.seller ? $.req.getTypeList : $.req.getCustomerTypeList;
    fn(data, (res) => {
        $.loading.hide();
        if(res.code == 0){
            dispatch(getCustomerType(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

//设置商品分类Id;
const fetchSetGoodsType = (dispatch, data) => {
    dispatch(setGoodsType(data));
};

//搜索商品;
const fetchSearchGoods = (dispatch, data) => {
    let d = {};
    for(let i in data) {
        if(data[i] != null) {
            if(i != 'state') {
                d[i] = data[i];
            }
        }
    }
    if(data.page == 1) {
        $.loading.show();
    }

    $.req.searchGoods(JSON.stringify(d), (res)=>{
        $.loading.hide();
        if(res.code == 0){
            dispatch(searchGoods(res.data));
            dispatch(setGoodsParam(data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });

};

//获取搜索商品的筛选项;
const fetchGetGoodsFilter = (dispatch, data) => {
    $.req.getGoodsFilter(JSON.stringify(data), (res) => {
        if(res.code == 0) {
            dispatch(getGoodsFilter(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

//设置商品搜索的参数;
const fetchSetGoodsParam = (dispatch, data) => {
    dispatch(setGoodsParam(data));
};

//设置分类四级的筛选;
const fetchSetTypeFilter = (dispatch, data) => {
    dispatch(setTypeFilter(data));
};

//通过三级分类获取当前三级分类下面的四级分类;
const fetchGetTypeFilter = (dispatch, data) => {
    $.req.getGoodsFilter(JSON.stringify({type_ids: [data[1]], select: ['categories']}), (res) => {
        if(res.code == 0) {
            dispatch(setGoodsType(data));
            dispatch(setTypeFilter({state: -1, data: res.data.categories}));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchSetGoodsType: fetchSetGoodsType,
    fetchSearchGoods: fetchSearchGoods,
    fetchGetGoodsFilter: fetchGetGoodsFilter,
    fetchGetCustomerType: fetchGetCustomerType,
    fetchSetGoodsParam: fetchSetGoodsParam,
    fetchSetTypeFilter: fetchSetTypeFilter,
    fetchGetTypeFilter: fetchGetTypeFilter
};