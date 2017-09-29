/**
 * 获取店铺信息的ACTION
 */
const GET_SHOP_INFO = 'GET_SHOP_INFO';

function getShopInfo(shopInfo) {
    return { type: GET_SHOP_INFO, shopInfo };
}

const fetchShopInfo = (dispatch) => {
    $.req.getShopInfo({}, (res)=>{
        if(res.code == 0){
            dispatch(getShopInfo(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchShopInfo: fetchShopInfo
};
