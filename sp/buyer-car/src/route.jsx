/**
 * Created by Doden on 2017.03.03
 */

// import {Router, hashHistory} from 'react-router';
let {Router, hashHistory} = ReactRouter;

class Route extends React.Component {
    constructor(props) {
        super(props);
        this.rootRoute = {};
    }

    componentWillMount(){
        this.rootRoute = {
            path: '/',
            component: require('./pages/entry.jsx').default,
            childRoutes:[
                {
                    path: '/buyer/car',
                    component: require('./pages/car/car.jsx').default,
                    childRoutes:[
                        {
                            path: 'confirm',
                            component: require('./pages/car/confirmOrder.jsx').default,
                            childRoutes:[
                                {
                                    path: 'address',
                                    component: require('./pages/car/address.jsx').default
                                }
                            ]
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