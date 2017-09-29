import React from "react";

var Btn = React.createClass({
    handler: function() {
        this.props.btnEv && this.props.btnEv();
    },
    render: function() {
        console.log(this.props.param);
        return (
            <button className="btn {this.props.class}" onClick={this.handler}>{this.props.name}</button>
        )
    }
});

export default Btn;