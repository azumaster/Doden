/*
* 底部导航*/

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    clickHandler(index) {
        this.props.clickCallBack(index);
    }

    render() {
        return (
            <div className="nav">
                <a className="nav-item" onClick={this.clickHandler.bind(this, 0)}>
                    <span className="nav-icon icon-home"></span>
                    <p>首页</p>
                </a>
                <a className="nav-item active" onClick={this.clickHandler.bind(this, 1)}>
                    <span className="nav-icon icon-goods"></span>
                    <p>商品</p>
                </a>
                <a className="nav-item" onClick={this.clickHandler.bind(this, 2)}>
                    <span className="nav-icon icon-order"></span>
                    <p>订单</p>
                </a>
            </div>
        );
    }
}

export default Nav;