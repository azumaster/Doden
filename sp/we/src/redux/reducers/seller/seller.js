
const shop = (state = 0, action)=> {
    switch (action.type){
        case 'GET_SHOP_INFO':
            return action.shopInfo;
        default:
            return state;
    }
};

const market = (state = 0, action)=> {
    switch (action.type){
    case 'GET_MARKET_LIST':
        return action.marketList;
    case 'UPDATE_MARKET':
        return action.updateResult;
    default:
        return state;
}
};

const custom = (state = 0, action) => {
    switch (action.type){
        case 'GET_CUSTOM_LIST':
            return action.customList;
        default:
            return state;
    }
};

const ticket = (state = 0, action)=> {
    switch (action.type){
        case 'GET_TICKET_LIST':
            return action.ticketList;
        default:
            return state;
    }
};

const ticketOperate = (state = 0, action)=>{
    switch (action.type){
        case 'ORDER_OPERATE':
            return action.operateResult;
        default:
            return state;
    }
};

const purchase = (state = 0, action)=>{
    switch (action.type){
        case 'PURCHASE':
            return action.purchaseResult;
        default:
            return state;
    }
};

const orderCustom = (state = 0, action)=> {
    switch (action.type){
        case 'GET_CUSTOM_INFO':
            return action.customInfo;
        default:
            return state;
    }
};

const goodsType = (state = 0, action)=>{
    switch (action.type){
        case 'GET_GOODS_TYPE':
            return action.goodsType;
        default:
            return state;
    }
};

const goodsPrice = (state=0, action)=>{
    switch (action.type){
        case 'GET_GOODS_PRICE':
            return action.goodsPrice;
        default:
            return state;
    }
};

const addPrice = (state =0, action) => {
    switch (action.type){
        case 'ADD_PRICE':
            return action.addPrice;
        default:
            return state;
    }
};

export default {
    shop,
    market,
    custom,
    ticket,
    orderCustom,
    ticketOperate,
    goodsType,
    goodsPrice,
    addPrice,
    purchase
};