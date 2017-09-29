/**
 * Created by Administrator on 2016/2/1.
 * 按钮
 */
var React = require('react');

/*按钮组件;*/
var Refresh = React.createClass({
    handler: function(e) {
        e.preventDefault();
        this.props.refreshEv && this.props.refreshEv();
    },
    render: function () {
        return (
            <a id="refreshBtn" className="refresh-btn" onClick={this.handler}>
                <i className="iconfont icon-refresh"></i>刷新
            </a>
        )
    }
});

module.exports = Refresh;