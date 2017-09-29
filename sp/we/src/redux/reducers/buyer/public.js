//联系服务商信息;
const contactShop = (state = null, action) => {
    switch (action.type) {
        case 'GET_CONTACT_CHOP':
            return action.data;
        default:
            return state;
    }
};

export default {
    contactShop
};