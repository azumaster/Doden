/**
 * 获取到客户的列表
 * @type {string}
 */

const GET_CUSTOM_LIST = 'GET_CUSTOM_LIST';

function getCustomList(customList) {
    return { type: GET_CUSTOM_LIST, customList };
}

const fetchCustomList = (dispatch, data)=>{
    $.req.getCustomList(data, (res)=>{
        if(res.code == 0){
            dispatch(getCustomList(res.data));
        }else {
            $.toast({text:res.message, icon: 'info'});
        }
    });
};

export default {
    fetchCustomList: fetchCustomList
};