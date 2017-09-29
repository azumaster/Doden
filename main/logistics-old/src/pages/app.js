import React from 'react';
import ReactDOM from 'react-dom';
// import "../vendors/zepto.min.js";
// import "../vendors/iscroll-probe.js";
// import "../vendors/base.js";
// import "../vendors/request.js";
// import "../assets/less/style.less";
// import "../components/order/order-controller.jsx";

import Main from './main.jsx';
//import injectTapEventPlugin from 'react-tap-event-plugin';
//import Main from "../components/tabs/tab-controller.jsx";
//injectTapEventPlugin();
ReactDOM.render(<Main/>, document.getElementById('app'));