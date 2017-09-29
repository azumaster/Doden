//购物车商品列表;
//const shoppingList = (state = [], action) => {
//    switch (action.type){
//        case 'GET_CAR_LIST':
//            return action.data;
//        default:
//            return state;
//    }
//};

const carAddress = (state = 0, action) => {
    switch (action.type) {
        case 'CAR_ADDRESS':
            return action.data;
            break;
        default:
            return state;
    }
};

//设置有效商品的列表和总的合计数据;
const carConfirmData = (state = 0, action) => {
    switch (action.type) {
        case 'CAR_CONFIRM_DATA':
            return action.data;
            break;
        default:
            return state;
    }
};


export default {
    carAddress,
    carConfirmData
};