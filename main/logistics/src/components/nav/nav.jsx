/*
* 底部菜单
* */

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    navHandler(e) {
        let hash = '#',
            index = e.target.dataset.index;
        switch (index) {
            case '0':
                hash = '#';
                break;
            case '1':
                hash = '#history';
                break;
            case '2':
                hash = '#address';
                break;
        }
        location.href = hash;
    }

    //隐藏菜单;
    closeNav() {
        $('#navWrap').addClass('hide');
    }

    render() {
        return (
            <div id="navWrap" className="nav-wrap" onTouchStart={this.navHandler.bind(this)}>
                <div className="mask" onClick={this.closeNav.bind(this)}></div>
                <div className="content">
                    <div className="hd">
                        <img src="/Public/images/logistics/header.png"/>
                        <p className="username">食品房子</p>
                    </div>
                    <ul className="bd">
                        <li className="nav-send">发货</li>
                        <li className="nav-await">待付账单</li>
                        <li className="nav-history">历史记录</li>
                        <li className="nav-address">地址管理</li>
                        <li className="nav-kf">客服</li>
                    </ul>
                    <div className="ft">
                        <p>大鱼物流</p>
                        <p>ddayu.com</p>
                    </div>
                </div>

            </div>
        );
    }
}

export default Nav;