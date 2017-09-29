/**
 * Created by Doden on 2017.03.03
 */

import Nav from '../components/nav/nav.jsx';

class Buy extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        window.location.href = '#/buyer/buy';
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