/**
 * Created by Doden on 2017.03.03
 */

import React from 'react';
import {Router, hashHistory} from 'react-router';

class Route extends React.Component {
    constructor(props) {
        super(props);
        this.rootRoute = {};
    }

    componentWillMount(){
        this.rootRoute = {
            path: '/',
            component: require('./pages/home.jsx').default,
            childRoutes: [
                require('./pages/buyer/route.js'),
                require('./pages/seller/index.js')
            ]
        };
    }

    render() {
        return(<Router history={hashHistory} routes={this.rootRoute} />);
    }
}

export default Route;