/*
 * 买家端底部菜单，3.0买家端react项目通用;
 *
 * 参数说明：
 * index: 当前的菜单索引,
 * num: 小数量;
 * */

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navArr: [   //生成菜单的数据;
                {icon: 'home', name: '首页', url: 'index.php?m=PublicTemplate&c=ApiPublic&a=buyerIndex', page: '#'},
                {icon: 'car', name: '购物车', url: 'index.php?m=PublicTemplate&c=ApiPublic&a=shopCartIndex', page: 'javascript:;'},
                {icon: 'order', name: '订单', url: 'index.php?m=PublicTemplate&c=ApiPublic&a=buyerOrder', page: 'javascript:;'},
                {icon: 'oftenBuy', name: '常购', url: 'index.php?m=PublicTemplate&c=ApiPublic&a=oftenbuy', page: 'javascript:;'},
                {icon: 'myInfo', name: '我的', url: 'index.php?m=Buyers&c=user&a=info', page: 'javascript:;'}
            ]
        };
    }

    tourists(num, page) {
        if(num == 0) {
            location.href = page;
        }else {
            H.sheet.promptLogin();
        }
    }

    render() {
        return (
            <div className="nav-wrap">
                {
                    this.state.navArr.map((val, index) => {
                        if(this.props.identity == 1 && index == 1) {
                            return null;
                        }
                        let num = this.props.num,
                            badgeXml = null;
                        if(num && num[index]) {
                            if(num[index] > 99) {
                                badgeXml = (<span className="nav-badge">99<small><b><sup>+</sup></b></small></span>);
                            }else {
                                badgeXml = (<span className="nav-badge">{num[index]}</span>);
                            }
                        }
                        if(this.props.identity == 3) {
                            return (
                                <a className={'nav-item' + (index == this.props.index ? ' active' : '')} onClick={this.tourists.bind(this, index, val.page)}>
                                <span className={'nav-icon ' + val.icon + '-icon'}>
                                    {badgeXml}
                                </span>
                                    <p className="nav-label">{val.name}</p>
                                </a>
                            );
                        }
                        return (
                            <a className={'nav-item' + (index == this.props.index ? ' active' : '')} href={index == this.props.index ? val.page : val.url}>
                                <span className={'nav-icon ' + val.icon + '-icon'}>
                                    {badgeXml}
                                </span>
                                <p className="nav-label">{val.name}</p>
                            </a>
                        );
                    })
                }
            </div>
        );
    }
}

export default Nav;