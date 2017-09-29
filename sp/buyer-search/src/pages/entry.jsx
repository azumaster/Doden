/**
 * Created by Doden on 2017.03.03
 */

import Nav from '../components/nav/nav.jsx';

class Buy extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let g_id = $.urlParam('g_id');
        let c_id = $.urlParam('c_id');
        let b_id = $.urlParam('b_id');
        if(g_id) {
            location.hash = '#/buyer/goodsInfo?&id='+g_id;
        }else if(c_id) {
            location.hash = '#/buyer/buy/result?&c_id='+c_id;
        }else if(b_id) {
            location.hash = '#/buyer/buy/result?&b_id='+b_id;
        }else {
            window.location.href = '#/buyer/buy';
        }
    }

    render() {
        return (
            <div>
                <Nav/>
                {this.props.children}
            </div>
        );
    }
}

export default Buy;