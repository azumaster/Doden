/**
 * Created by Doden on 2017.07.07
 */

import React from 'react';
import {Router, hashHistory} from 'react-router';

class route extends React.Component {
    constructor(props) {
        super(props);
        this.rootRoute = {};
    }

    componentWillMount(){
        this.rootRoute = {
            path: '/',
            component: require('./main.jsx').default,
            indexRoute: {component: require('./views/home.jsx').default},
            childRoutes: [{
                path: 'recode',
                component: require('./views/recode.jsx').default
            }, {
                path: 'order/:type',
                component: require('./views/order.jsx').default
            }, {
                path: 'help',
                component: require('./views/help.jsx').default
            }]
        };
    }

    render() {
        return (
            <Router history={hashHistory} routes={this.rootRoute} />
        );
    }
}

export default route;