/**
 * Created by Doden on 2017.03.08
 */

import React from 'react';

class Price extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="sellerPrice">
            {this.props.children}
        </div>);
    }
}

export default Price;