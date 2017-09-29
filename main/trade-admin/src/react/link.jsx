import React from 'react';

let Link = React.createClass({
    render(){
        return (
            <a id={this.props.id} href={this.props.url} title={this.props.name} onClick={this.props.clickEvent}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = Link;