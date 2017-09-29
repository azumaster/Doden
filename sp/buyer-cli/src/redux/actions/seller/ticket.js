/**
 * 获取店铺信息的ACTION
 */
const GET_TICKET_LIST = 'GET_TICKET_LIST';
const ORDER_OPERATE = 'ORDER_OPERATE';
const GET_CUSTOM_INFO = 'GET_CUSTOM_INFO';
const PURCHASE = 'PURCHASE';

function getTicketList(ticketList) {
    return { type: GET_TICKET_LIST, ticketList };
}

function orderOperate(operateResult) {
    return { type: ORDER_OPERATE, operateResult };
}

function getCustomInfo(customInfo) {
    return {type: GET_CUSTOM_INFO, customInfo};
}

function purchase(purchaseResult) {
    return {type: PURCHASE, purchaseResult};
}

const fetchTicketList = (dispatch, data) => {
    $.req.getTicketList(data, (res)=>{
        if(res.code == 0){
            dispatch(getTicketList(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchOrderOperate = (dispatch, data) =>{
    $.req.operateTicket(data, (res)=>{
        if(res.code == 0){
            dispatch(orderOperate(res.data));
            $.toast({text: '操作成功'});
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchCustomInfo = (dispatch, data) => {
    $.req.showCustom(data, (res)=>{
        if(res.code == 0){
            dispatch(getCustomInfo(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchPurchase = (dispatch, data) => {
    $.req.purchase(data, (res)=>{
        if(res.code == 0){
            dispatch(purchase(res.data));
            $.toast({text: '进货成功'});
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchTicketList: fetchTicketList,
    fetchOrderOperate: fetchOrderOperate,
    fetchCustomInfo: fetchCustomInfo,
    fetchPurchase: fetchPurchase
};