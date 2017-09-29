/**
 * Created by Doden on 2017.03.08
 */

import React from 'react';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        sessionStorage.clear();
    }

    toNewPage(url){
        window.location.href = '#/seller/'+url;
    }

    render() {
        return (<div id="sellerHome">
            <div className="grid-row seller-home">
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'ticket')}><div className="seller-home-link text-center">
                    <i className="icon ticket" /><h4>销售单</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'market')}><div className="seller-home-link text-center">
                    <i className="icon market" /><h4>市场管理</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'price')}><div className="seller-home-link text-center">
                    <i className="icon goods" /><h4>商品改价</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'blacklist')}><div className="seller-home-link text-center">
                    <i className="icon blacklist" /><h4>商品屏蔽</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'stick')}><div className="seller-home-link text-center">
                    <i className="icon stick" /><h4>商品置顶</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'mall')}><div className="seller-home-link text-center">
                    <i className="icon dong" /><h4>冻品商城</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'shop-info')}><div className="seller-home-link text-center">
                    <i className="icon shop-info" /><h4>店铺信息</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'custom')}><div className="seller-home-link text-center">
                    <i className="icon custom" /><h4>客户管理</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'member')}><div className="seller-home-link text-center">
                    <i className="icon member" /><h4>成员管理</h4>
                </div></div>
                <div className="grid-col-4" onClick={this.toNewPage.bind(this, 'pay')}><div className="seller-home-link text-center">
                    <i className="icon pay" /><h4>收款管理</h4>
                </div></div>
            </div>
        </div>);
    }
}

export default Home;