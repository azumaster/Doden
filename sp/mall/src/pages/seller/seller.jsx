/**
 * Created by Doden on 2017.03.03
 */

import React from 'react';

class Sell extends React.Component {
    constructor(props) {
        super(props);
        $.seller = true;
    }

    render() {
        return (<div id="sellerRoute">
                {this.props.children}
            </div>
        );
    }
}

export default Sell;