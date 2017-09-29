/**
 * Created by Doden on 2017.03.03.
 */
module.exports = {
    path: '/seller',
    indexRoute: {component: require('./home.jsx').default},
    getComponent(nextState, cb) {
        require.ensure([], (require) => {cb(null, require('./seller.jsx').default);}, 'seller');
    },
    childRoutes:[
        {
            path: 'market',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./market/market.jsx').default);}, 'seller');
            }
        }, {
            path: 'shop-info',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./shopInfo/shopInfo.jsx').default);}, 'seller');
            }
        }, {
            path: 'custom',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./custom/custom.jsx').default);}, 'seller');
            }
        }, {
            path: 'price',
            indexRoute: {
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./price/priceManage.jsx').default);}, 'seller');
                }
            },
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./price/price.jsx').default);}, 'seller');
            },
            childRoutes:[
                {
                    path: 'priceList/:id/:tId',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('./price/priceList.jsx').default);}, 'seller');
                    }
                }, {
                path: ':id/:status',
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./price/updatePrice.jsx').default);}, 'seller');
                }
            }]
        }, {
            path: 'blacklist',
            indexRoute: {
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./price/priceManage.jsx').default);}, 'seller');
                }
            },
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./price/price.jsx').default);}, 'seller');
            },
            childRoutes:[{
                path: ':id/:status',
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./blacklist/blacklist.jsx').default);}, 'seller');
                }
            }]
        }, {
            path: 'ticket',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./ticket/ticket.jsx').default);}, 'seller');
            }
        }, {
            path: 'pay',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./pay/pay.jsx').default);}, 'seller');
            }
        }, {
            path: 'member',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./member/member.jsx').default);}, 'seller');
            }
        }, {
            path: 'mall',
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('../buyer/buy/search/search.jsx').default);}, 'malls');
            },
            childRoutes:[
                {
                    path: 'result',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('../buyer/buy/result/goodsPage.jsx').default);}, 'malls');
                    },
                    childRoutes:[
                        {
                            path: 'goodsInfo',
                            getComponent(nextState, cb) {
                                require.ensure([], (require) => {cb(null, require('../buyer/goodsInfo/goodsInfo.jsx').default);}, 'malls');
                            }
                        },
                        {
                            path: 'searchHistory',
                            getComponent(nextState, cb) {
                                require.ensure([], (require) => {cb(null, require('../buyer/buy/result/searchHistory.jsx').default);}, 'malls');
                            }
                        }
                    ]
                },
                {
                    path: 'searchHistory',
                    getComponent(nextState, cb) {
                        require.ensure([], (require) => {cb(null, require('../buyer/buy/result/searchHistory.jsx').default);}, 'malls');
                    }
                }
            ]
        },  {
            path: 'stick',
            indexRoute: {
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./stick/stickCategory.jsx').default);}, 'seller');
                }
            },
            getComponent(nextState, cb) {
                require.ensure([], (require) => {cb(null, require('./stick/stick.jsx').default);}, 'seller');
            },
            childRoutes:[{
                path: ':id',
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./stick/stickList.jsx').default);}, 'seller');
                }
            }, {
                path: ':id/:sortId',
                getComponent(nextState, cb) {
                    require.ensure([], (require) => {cb(null, require('./stick/stickOrder.jsx').default);}, 'seller');
                }
            }]
        }
    ]
};