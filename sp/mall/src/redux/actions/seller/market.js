/**
 * 获取市场列表的ACTION
 */
const GET_MARKET_LIST = 'GET_MARKET_LIST';
const UPDATE_MARKET = 'UPDATE_MARKET';

function getMarketList(marketList) {
    return { type: GET_MARKET_LIST, marketList };
}

function updateMarket(updateResult) {
    return {type: UPDATE_MARKET, updateResult};
}

const fetchMarketList = (dispatch) => {
    $.req.getMarketList({}, (res)=>{
        if(res.code == 0){
            dispatch(getMarketList(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchUpdateMarket = (dispatch, data) => {
    $.req.updateMarket(data, (res)=>{
        if(res.code == 0){
            dispatch(updateMarket(res.data));
            $.toast({text: '已提交'});
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchMarketList: fetchMarketList,
    fetchUpdateMarket: fetchUpdateMarket
};
