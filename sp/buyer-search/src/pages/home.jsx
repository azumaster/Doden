/**
 * Created by Doden on 2017.03.03
 */

import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    render() {
        return (<div id="serviceHome">
            {this.props.children}
        </div>);
    }
}

export default Home;