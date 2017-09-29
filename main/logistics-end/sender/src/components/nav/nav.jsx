/*
* 底部菜单
* */

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }

    tabHandler(e) {
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

    render() {
        let hash = this.props.hash;
        return (
            <div className="nav-wrap" onTouchStart={this.tabHandler.bind(this)}>
                <a className={hash == '' ? 'nav-item active' : 'nav-item'} data-index="0">收件</a>
                <a className={hash.indexOf('history') != -1 ? 'nav-item active' : 'nav-item'} data-index="1">历史记录</a>
                <a className={hash.indexOf('address') != -1 ? 'nav-item active' : 'nav-item'} data-index="2">地址管理</a>
            </div>
        );
    }
}

export default Nav;