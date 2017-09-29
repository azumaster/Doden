
const GET_GOODS_TYPE = 'GET_GOODS_TYPE';
const GET_GOODS_PRICE = 'GET_GOODS_PRICE';
const ADD_PRICE = 'ADD_PRICE';

const getGoodsType = (goodsType)=>{
    return {type: GET_GOODS_TYPE, goodsType};
};

const getGoodsPrice = (goodsPrice)=>{
    return {type: GET_GOODS_PRICE, goodsPrice};
};

const addPrice = (addPrice) =>{
    return {type: ADD_PRICE, addPrice};
};

const fetchGoodsType = (dispatch, data) => {
    $.req.getTypeList(data, (res)=>{
        if(res.code == 0){
            dispatch(getGoodsType(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchGoodsPrice = (dispatch, data)=>{
    $.req.getGoodsPrice(data, (res)=>{
        if(res.code == 0){
            dispatch(getGoodsPrice(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

const fetchAddPrice = (dispatch, data)=>{
    $.req.addPrice(data, (res)=>{
        if(res.code == 0){
            dispatch(addPrice(res.data));
            $.toast({text: '加价成功'});
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};


export default {
    fetchGoodsType: fetchGoodsType,
    fetchGoodsPrice: fetchGoodsPrice,
    fetchAddPrice: fetchAddPrice
};