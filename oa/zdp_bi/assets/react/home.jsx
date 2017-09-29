/**
 * Created by Doden on 2017.04.18
 */

import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="tab-content" id="tab-content">
            {this.props.children}
        </div>);
    }
}

export default Home;