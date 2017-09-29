/**
 * Created by Doden on 2017.05.31
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
                path: '/jewel',
                component: require('./views/jewel/jewelContent.jsx').default,
                indexRoute: {component: require('./views/jewel/jewel.jsx').default},
                childRoutes: [{
                    path: 'jewelList',
                    component: require('./views/jewel/jewelList.jsx').default
                }]
            }, {
                path: '/setting',
                component: require('./views/setting/settingContent.jsx').default,
                indexRoute: {component: require('./views/setting/setting.jsx').default},
                childRoutes: [{
                    path: 'member',
                    component: require('./views/setting/member.jsx').default
                }]
            }, {
                path: '/appraise',
                component: require('./views/appraise/appraiseContent.jsx').default,
                indexRoute: {component: require('./views/appraise/appraise.jsx').default},
                childRoutes: [{
                    path: 'score',
                    component: require('./views/appraise/score.jsx').default
                }]
            }, {
                path: '/help',
                component: require('./views/help/help.jsx').default
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