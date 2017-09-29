const GET_CONTACT_CHOP = 'GET_CONTACT_CHOP';

//获取搜索商品的分类数据;
const getContactChop = (data) => {
    return {type: GET_CONTACT_CHOP, data};
};

const fetchGetContactShop = (dispatch) => {
    $.req.contactShop({}, (res) => {
        if(res.code == 0) {
            dispatch(getContactChop(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};


export default {
    fetchGetContactShop: fetchGetContactShop
};