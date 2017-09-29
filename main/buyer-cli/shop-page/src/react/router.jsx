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
            childRoutes: [
                {
                    path: 'appraise/:id',
                    component: require('./views/appraise.jsx').default
                }, {
                    path: 'goodsInfo/:id',
                    component: require('./components/home/goods-info/goods-info.jsx').default,
                    childRoutes: [
                        {
                            path: 'comments',
                            component: require('./components/home/goods-info/comments.jsx').default
                        }
                    ]
                }
            ]
        };
    }

    render() {
        return (
            <Router history={hashHistory} routes={this.rootRoute} />
        );
    }
}

export default route;