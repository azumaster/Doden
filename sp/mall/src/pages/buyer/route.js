/**
 * Created by Doden on 2017.03.03.
 */

module.exports = {
    path: '/buyer',
    //indexRoute: {component: require('./entry.jsx').default},
    component: require('./entry.jsx').default,
    childRoutes:[
        {
            path: 'buy',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./buy/search/search.jsx').default);}, 'buy');
            },
            childRoutes:[
                {
                    path: 'result',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('./buy/result/goodsPage.jsx').default);}, 'buy');
                    },
                    childRoutes:[
                        {
                            path: 'goodsInfo',
                            getComponent(nextState, cb) {
                                require.ensure([], (require) => {cb(null, require('./goodsInfo/goodsInfo.jsx').default);}, 'buy');
                            }
                        },
                        {
                            path: 'searchHistory',
                            getComponent(nextState, cb) {
                                require.ensure([], (require) => {cb(null, require('./buy/result/searchHistory.jsx').default);}, 'buy');
                            }
                        }
                    ]
                },
                {
                    path: 'searchHistory',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('./buy/result/searchHistory.jsx').default);}, 'buy');
                    }
                }
            ]
        },
        {
            path: 'car',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./car/car.jsx').default);}, 'car');
            },
            childRoutes:[
                {
                    path: 'confirm',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('./car/confirmOrder.jsx').default);}, 'car');
                    },
                    childRoutes:[
                        {
                            path: 'address',
                            getComponent(nextState, cb) {
                                require.ensure([], (require) => {cb(null, require('./car/address.jsx').default);}, 'car');
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: 'goodsInfo',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./goodsInfo/goodsInfo.jsx').default);}, 'goodsInfo');
            }
        },
        {
            path: 'order',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./order/order.jsx').default);}, 'order');
            }
        }
    ]
};