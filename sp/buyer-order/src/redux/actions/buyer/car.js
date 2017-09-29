const GET_CAR_LIST = 'GET_CAR_LIST';
const CAR_ADDRESS = 'CAR_ADDRESS';
const CAR_CONFIRM_DATA = 'CAR_CONFIRM_DATA';

//获取购物车用户的地址列表;
const aCarAddress = (data) => {
    return {type: CAR_ADDRESS, data};
};

const fetchGetCarAddress = (dispatch, data) => {
    dispatch(aCarAddress(data.address));
    let param = data.param;
    param.param.address_id = data.address.main_address_id;
    dispatch(setCarConfirmData(param));
};

//获取购物车商品列表;
const getCarList = (data)=>{
    return {type: GET_CAR_LIST, data};
};

//购物车商品;
const fetchShoppingCar = (dispatch, data) => {
    $.req.shoppingCart(data, (res)=>{
        if(res.code == 0){
            dispatch(getCarList(res.data.goods));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

//设置有效商品的列表和总的合计数据;
const setCarConfirmData = (data) => {
    return {type: CAR_CONFIRM_DATA, data};
};

const fetchCarConfirmData = (dispatch, data) => {
    dispatch(setCarConfirmData(data));
};

export default {
    fetchGetCarAddress: fetchGetCarAddress,
    fetchShoppingCar: fetchShoppingCar,
    fetchCarConfirmData: fetchCarConfirmData
};