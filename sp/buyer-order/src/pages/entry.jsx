/**
 * Created by Doden on 2017.03.03
 */

import Nav from '../components/nav/nav.jsx';
import Order from './order/order.jsx';

class Buy extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Nav/>
                <Order/>
            </div>
        );
    }
}

export default Buy;