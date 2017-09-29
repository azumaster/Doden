const GET_ORDER_LIST = 'GET_ORDER_LIST';
const UPDATE_ORDER = 'UPDATE_ORDER';

function getOrderList(orderList) {
    return { type: GET_ORDER_LIST, orderList };
}

function updateOrder(updateResult) {
    return { type: UPDATE_ORDER, updateResult };
}

const fetchOrderList = (dispatch, data)=>{
    $.req.getOrderList(data, (res)=>{
        if(res.code == 0){
            dispatch(getOrderList(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchUpdateOrder = (dispatch, data)=>{
    $.req.updateOrder(data, (res)=>{
        if(res.code == 0){
            dispatch(updateOrder(res.data));
            $.toast({text:'操作成功'});
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchOrderList: fetchOrderList,
    fetchUpdateOrder: fetchUpdateOrder
};