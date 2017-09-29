/**
 * Created by Doden on 2017.03.03
 */

let {Router, hashHistory} = ReactRouter;

class Route extends React.Component {
    constructor(props) {
        super(props);
        this.rootRoute = {};
    }

    componentWillMount(){
        this.rootRoute = {
            path: '/',
            component: require('./pages/seller.jsx').default,
            childRoutes:[
                {
                    path: 'seller',
                    indexRoute: {component: require('./pages/home.jsx').default},
                    component: require('./pages/sellerPanel.jsx').default,
                    childRoutes: [
                        {
                            path: 'market',
                            component: require('./pages/market/market.jsx').default
                        }, {
                            path: 'shop-info',
                            component: require('./pages/shopInfo/shopInfo.jsx').default
                        }, {
                            path: 'custom',
                            component: require('./pages/custom/custom.jsx').default
                        }, {
                            path: 'price',
                            indexRoute: { component: require('./pages/price/priceManage.jsx').default },
                            component:  require('./pages/price/price.jsx').default,
                            childRoutes:[
                                {
                                    path: 'priceList/:id/:tId',
                                    component: require('./pages/price/priceList.jsx').default
                                }, {
                                    path: ':id/:status',
                                    component: require('./pages/price/updatePrice.jsx').default
                                }]
                        }, {
                            path: 'blacklist',
                            indexRoute: {
                                component: require('./pages/price/priceManage.jsx').default
                            },
                            component: require('./pages/price/price.jsx').default,
                            childRoutes:[{
                                path: ':id/:status',
                                component: require('./pages/blacklist/blacklist.jsx').default
                            }]
                        }, {
                            path: 'ticket',
                            component:  require('./pages/ticket/ticket.jsx').default
                        }, {
                            path: 'pay',
                            component: require('./pages/pay/pay.jsx').default
                        }, {
                            path: 'member',
                            component: require('./pages/member/member.jsx').default,
                            childRoutes: [
                                {
                                    path: 'permissions',
                                    component: require('./pages/member/permissions.jsx').default
                                }
                            ]
                        }, {
                            path: 'mall',
                            component: require('./pages/buy/search/search.jsx').default,
                            childRoutes:[
                                {
                                    path: 'result',
                                    component: require('./pages/buy/result/goodsPage.jsx').default,
                                    childRoutes:[
                                        {
                                            path: 'goodsInfo',
                                            component: require('./pages/goodsInfo/goodsInfo.jsx').default
                                        },
                                        {
                                            path: 'searchHistory',
                                            component: require('./pages/buy/result/searchHistory.jsx').default
                                        }
                                    ]
                                },
                                {
                                    path: 'searchHistory',
                                    component:  require('./pages/buy/result/searchHistory.jsx').default
                                }
                            ]
                        },  {
                            path: 'stick',
                            indexRoute: {
                                component: require('./pages/stick/stickCategory.jsx').default
                            },
                            component: require('./pages/stick/stick.jsx').default,
                            childRoutes:[{
                                path: ':id',
                                component: require('./pages/stick/stickList.jsx').default
                            }, {
                                path: ':id/:sortId',
                                component: require('./pages/stick/stickOrder.jsx').default
                            }]
                        }
                    ]
                }
            ]
        };
    }

    render() {
        return(<Router history={hashHistory} routes={this.rootRoute} />);
    }
}

export default Route;