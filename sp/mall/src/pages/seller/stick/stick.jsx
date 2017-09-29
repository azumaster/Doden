/**
 * Created by Doden on 2017.06.20
 */

import React from 'react';

class Stick extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="stick">
            {this.props.children}
        </div>);
    }
}

export default Stick;