/*
 * Created by xy on 2017.03.08.
 * 参数说明：
 * items: [
 *  {
 *      name: '首页',   //菜单名字;
 *      url: '/home',   //菜单连接对应的地址;
 *      icon: 'icon-home',  //icon图标
 *      num: 1          //是否显示数字。大于0表示有;
 *  }
 * ]
 * style: ''             //需要更改样式的时候，传入一个class名字，在这个名字上去修改样式;
 * index: 0              //默认显示在哪一项, 0开始;
 * cb:                   //点击回调，返回点击按钮的index;
* */
import React from 'react';
//import 'less-loader!./nav.less';

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            items: [],
            hash: location.hash.substr(1)
        };
    }

    componentWillMount() {
        //this.setIndex();
        //window.onhashchange = () => {   //监听浏览器地址栏变化;
        //    this.setIndex();
        //};
        this.getHomeState();
    }

    getHomeState() {
        $.req.openHome({}, (res) => {
            if(res.code == 0) {
                if(res.data.enabled == 1) {
                    this.setState({
                        items: [
                            {name: '首页', url: '/home', icon: 'icon-home'},
                            {name: '找货', url: '/search', icon: 'icon-buy'},
                            {name: '进货单', url: '/car', icon: 'icon-car'},
                            {name: '订单', url: '/order', icon: 'icon-order'}
                        ],
                        index: 1
                    });
                }else {
                    this.setState({
                        items: [
                            {name: '找货', url: '/search', icon: 'icon-buy'},
                            {name: '进货单', url: '/car', icon: 'icon-car'},
                            {name: '订单', url: '/order', icon: 'icon-order'}
                        ],
                        index: 0
                    });
                }
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //setIndex() {
    //    let hash = location.hash.substr(1),
    //        index = null;
    //    if(hash.indexOf('/buyer/buy') != -1) {
    //        index = 0;
    //    }else if(hash.indexOf('/buyer/car') != -1) {
    //        index = 1;
    //    }else if(hash.indexOf('/buyer/order') != -1) {
    //        index = 2;
    //    }
    //    if(index != this.state.index) {
    //        this.setState({index: index});
    //    }
    //    if(hash == '/buyer/buy' && $.selector('#keyWordsVal')) {
    //        $.selector('#keyWordsVal').value = '';
    //    }
    //    if(hash == '/buyer') {
    //        location.href = '#/buyer/buy';
    //    }
    //}

    handler(index) {
        let items = this.state.items;
        window.location.href = items[index].url;
        //this.setState({index: index});
    }

    render() {
        let items = this.state.items,
            index = this.state.index;
        return (
            <div className="flex align-items-center border-top nav-wrap">
                {
                    items.map((val, i) => {
                        let badgeXml = null;
                        if(val.num) {
                            if(val.num > 99) {
                                badgeXml = (<span className="nav-badge">99<small><b><sup>+</sup></b></small></span>);
                            }else {
                                badgeXml = (<span className="nav-badge">{val.num}</span>);
                            }
                        }
                        return (
                            <a key={i} className={index == i ? 'flex-item nav-item active' : 'flex-item nav-item'} onTouchStart={this.handler.bind(this, i)}>
                                <span className={'nav-icon '+val.icon}>
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