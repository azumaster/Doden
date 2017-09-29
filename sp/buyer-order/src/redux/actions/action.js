import MarketAction from './seller/market.js';
import ShopAction from './seller/shopInfo.js';
import CustomAction from './seller/custom.js';
import TicketAction from './seller/ticket.js';
import PriceAction from './seller/price.js';
import BuyAction from './buyer/buy.js';
import CarAction from './buyer/car.js';
import PublicAction from './buyer/Public.js';

import OrderAction from './buyer/order.js';

export default (dispatch, op, data)=>{
    let seller = Object.assign(MarketAction, ShopAction, CustomAction, TicketAction, PriceAction, PublicAction),
        buyer = Object.assign(BuyAction, OrderAction, CarAction),
        actions = Object.assign(seller, buyer);
    if(data){
        actions[op](dispatch, data);
    }else {
        actions[op](dispatch);
    }
};