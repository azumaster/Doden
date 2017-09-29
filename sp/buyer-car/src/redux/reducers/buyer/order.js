const orderList = (state = 0, action)=> {
    switch (action.type){
        case 'GET_ORDER_LIST':
            return action.orderList;
        case 'UPDATE_ORDER':
            return action.updateResult;
        default:
            return state;
    }
};

export default {
    orderList
};