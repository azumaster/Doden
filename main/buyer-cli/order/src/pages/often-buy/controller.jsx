import React from 'react';
import OftenShop from './often-shop.jsx';
import OftenGoods from './often-goods.jsx';
import SearchShop from './search-shop.jsx';

class OftenCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            pageState: 0,
            keyWords: ''
        };
    }

    setUserInfo = (user) => {
        this.setState({user: user, pageState: 1});
    }

    setKeyWords = (words) => {
        this.setState({keyWords: words, pageState: 2});
    }

    componentWillMount = () => {
        let browser={
            versions:function(){
                var u = navigator.userAgent;
                //app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核;
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == 'qq' //是否QQ
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        };

        this.setState({browser: browser});

    }

    callback = (page) =>{
        this.setState({pageState: page});
    }

    render = () => {
        let xml = '';
        if(this.state.pageState == 1){ //买家常购商品列表;
            xml = (
                <OftenGoods
                    userInfo={this.state.user}
                    searchHandler={this.setKeyWords}
                    callback={this.callback}
                />
            );
        }else if(this.state.pageState == 2) { //搜索卖家店铺中的商品列表;
            xml = (
                <SearchShop
                    userInfo={this.state.user}
                    shopName={this.state.keyWords}
                    callback={this.callback}
                />
            );
        }else {  //店铺列表;
            xml = (
                <OftenShop
                    goodsHandler={this.setUserInfo}
                />
            );
        }
        return (
            <div>
                {xml}
            </div>
        );
    }
}

export default OftenCtrl;