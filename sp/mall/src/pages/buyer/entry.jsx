/**
 * Created by Doden on 2017.03.03
 */

import React from 'react';
import Nav from '../../components/nav/nav.jsx';

class Buy extends React.Component {
    constructor(props) {
        super(props);
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