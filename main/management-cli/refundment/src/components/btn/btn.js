/**
 * Created by Administrator on 2016/2/1.
 * 按钮
 */
var React = require('react');

/*按钮组件;*/
var Btn = React.createClass({
    render: function () {
        return (
            <button className={"btn btn-default " + this.props.otherClass} onClick={this.props.btnEvent} >{this.props.name}</button>
        )
    }
});

module.exports = Btn;