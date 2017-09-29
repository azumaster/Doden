/*
* 市场/店铺列表;
*
* props参数说明:
* areaId => 0  大区ID;
* callback => fn   点击店铺名之后
* */
import React from 'react';
import ChooseSearch from '../../../components/choose-search/choose-search.jsx';

class MarketShopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],  //市场和店铺列表数据;
            defaultVal: '',  //input的值;
            areaId: null,     //大区ID;
            update: false     //update变化时更新数据;
        };
        this.createTree = this.createTree.bind(this);
        this.callback = this.callback.bind(this);
        this.getShopMarket = this.getShopMarket.bind(this);
    }

    componentWillMount() {
        if(this.props.areaId != this.state.areaId) {
            this.state.areaId = this.props.areaId;
            this.getShopMarket();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.areaId != this.state.areaId || nextProps.updateState != this.state.update) {
            this.state.areaId = nextProps.areaId;
            this.state.update = nextProps.updateState;
            this.getShopMarket();
        }
    }

    //获取店铺列表;
    getShopMarket() {
        H.server.shop_newGoods_market_list({area_id: this.state.areaId}, (res) => {
            if(res.code == 0){
                this.setState({
                    list: res.data.markets ? res.data.markets : []
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //点击事件;
    clickHandler(e) {
        let node = e.target;
        if(node.dataset.status == 'toggle-close') {
            $(node).parent().removeClass('toggle-close');
            $(node).parent().addClass('toggle-open');
            $(node).attr('data-status', 'toggle-open');
        }else if(node.dataset.status == 'toggle-open') {
            $(node).parent().removeClass('toggle-open');
            $(node).parent().addClass('toggle-close');
            $(node).attr('data-status', 'toggle-close');
        }else if(node.dataset.val) {
            let key = node.dataset.key,
                val = node.dataset.val;
            $('#goodsAuditTree .goods-class-name').css('color', '');
            $(node).css('color', 'red');
            this.setState({defaultVal: node.dataset.name});
            this.props.callback && this.props.callback(key, val);
        }
    }

    createTree() {
        let list = this.state.list,
            XML = [];
        if(list.length <= 0) return XML;
        for(let i = 0 ; i < list.length ; i++) {
            let shopList = list[i].shops,
                xml = [];
            for(let j = 0 ; j < shopList.length ; j++) {
                let text = shopList[j].shop_name + ' (' + shopList[j].new_goods_number + ')';
                xml.push(
                    <li key={j}><div className="last-icon"></div>
                        <div className="goods-class-name" data-key="shop_id" data-val={shopList[j].shop_id} data-name={shopList[j].shop_name}>{text}</div>
                    </li>
                );
            }
            XML.push(
                <li key={i} className="toggle-open">
                    <div className="cuttle-icon" data-status="toggle-open"></div>
                    <div className="goods-class-name" data-key="market_id" data-val={list[i].market_id} data-name={list[i].market_name}>{list[i].market_name}</div>
                    <ul>{xml}</ul>
                </li>
            );
        }

        return XML;
    }

    callback(shopId, shopName) {
        this.setState({defaultVal: shopName});
        this.props.callback && this.props.callback('shop_id', shopId);
    }

    render() {
        return (
            <div className="market-shop" style={{border: '1px solid #ccc'}}>
                <div style={{margin: '8px'}}>
                    <ChooseSearch
                        data={this.state.list}
                        keyArr={['shops']}
                        diffArr={['shop_id', 'shop_name']}
                        callback={this.callback}
                        placeholder="输入店铺名"
                        val={this.state.defaultVal}
                    />
                </div>
                <div className="goods-class-tree" id="goodsAuditTree">
                    <ul className="goods-class-treeview" onClick={this.clickHandler.bind(this)}>{this.createTree()}</ul>
                </div>
            </div>
        );
    }
}

export default MarketShopList;