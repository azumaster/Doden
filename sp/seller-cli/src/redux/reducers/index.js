import { combineReducers } from 'redux';
import SellerReducer from './seller/seller.js';
import OrderReducer from './buyer/order.js';
import BuyReducer from './buyer/buy.js';
import CarReducer from './buyer/car.js';
import publicReducer from './buyer/public.js';

let reducer = Object.assign(SellerReducer, BuyReducer, OrderReducer, CarReducer, publicReducer);
export default combineReducers(reducer);