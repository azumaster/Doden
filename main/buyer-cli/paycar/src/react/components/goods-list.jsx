import React from 'react';

class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delStatus: {} //是否显示市场的删除状态;
        };
        this.createGoodsDom = this.createGoodsDom.bind(this);
    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    //商品勾选框
    goodsChangeSelect(id) {
        let node = $('#goods_' + id + '_select'),
            arr = this.props.goodsIdArr;
        if(node.attr('class').indexOf('selected') != -1) {
            node.removeClass('selected');
            $('#all_select').removeClass('selected');
            for(var i in arr) {
                if(arr[i] == id) {
                    arr.splice(i, 1);
                }
            }
        }else {
            node.addClass('selected');
            arr.push(id);
        }
        this.props.goodsIdArrHandler && this.props.goodsIdArrHandler(arr);
    }

    //商品数量改变; 参数，kid: 市场ID，id: 购物车商品ID，s=add: 点击数量加，s=reduction: 点击数量减, e: event;
    changeGoodsNum(kid, id, s) {
        let info = this.props.goodsList.market_info,
            val = 0,
            oldVal = 0;
        for(var i in info[kid].goods_infos) {
            if(info[kid].goods_infos[i].shop_cart_goods_id == id) {
                oldVal = parseInt(info[kid].goods_infos[i].buy_number);
                if(s == 'add') {
                    val = oldVal + 1;
                }else if(s == 'reduction') {
                    val = oldVal <= 1 ? 1 : oldVal-1;
                }
                break;
            }
        }

        if(val != oldVal) {
            $('#goods_id_' + id).val(val);
            let param = {
                shop_cart_goods_id: id,
                goods_number: val
            };
            H.we_loading.show('金额计算中</br>请稍候……');
            H.server.shopCart_goods_rejig_buyNumber(param, (res) => {
                if(res.code == 0) {
                    info[kid].goods_infos[i].buy_number = val;
                    info[kid].goods_infos[i].preferential_name = res.data.preferential_name;
                    info[kid].goods_infos[i].preferential_text = res.data.preferential_text;
                    this.props.setGoodsInfo && this.props.setGoodsInfo(info);
                    this.props.goodsIdArrHandler && this.props.goodsIdArrHandler(this.props.goodsIdArr);
                }else if(res.code == 102) {
                    $('#goods_id_' + id).val(oldVal);
                    H.operationState(res.message);
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }
    }
    //
    ////商品数量直接输入修改时，change事件; 参数，kid: 市场ID，id: 购物车商品ID, e: event;
    //changeGoods(kid, id, e) {
    //    let info = this.props.goodsList.market_info,
    //        val = 0,
    //        oldVal = 0;
    //    for(var i in info[kid].goods_infos) {
    //        if(info[kid].goods_infos[i].shop_cart_goods_id == id) {
    //            oldVal = info[kid].goods_infos[i].buy_number;
    //            val = e.target.value <= 1 ? 1 : e.target.value;
    //            break;
    //        }
    //    }
    //    if(val != oldVal) {
    //        info[kid].goods_infos[i].buy_number = val;
    //        this.props.setGoodsInfo && this.props.setGoodsInfo(info);
    //    }
    //}

    //商品数量直接输入修改时，输入框获得焦点事件; 参数，kid: 市场ID，id: 购物车商品ID, e: event;
    focusGoodsNum(e) {
        e.target.value = '';
    }

    //商品数量直接输入修改时，输入框失去焦点事件; 参数，kid: 市场ID，id: 购物车商品ID, e: event;
    blurGoodsNum(kid, id, e) {
        let info = this.props.goodsList.market_info,
            val = 0,
            oldVal = 0;
        for(var i in info[kid].goods_infos) {
            if(info[kid].goods_infos[i].shop_cart_goods_id == id) {
                oldVal = info[kid].goods_infos[i].buy_number;
                val = e.target.value;
                break;
            }
        }

        let target = e.target;
        if(val > 0) {
            let param = {
                shop_cart_goods_id: id,
                goods_number: val
            };
            H.we_loading.show('金额计算中</br>请稍候……');
            H.server.shopCart_goods_rejig_buyNumber(param, (res) => {
                if(res.code == 0) {
                    info[kid].goods_infos[i].buy_number = val;
                    info[kid].goods_infos[i].preferential_name = res.data.preferential_name;
                    info[kid].goods_infos[i].preferential_text = res.data.preferential_text;
                    this.props.setGoodsInfo && this.props.setGoodsInfo(info);
                    this.props.goodsIdArrHandler && this.props.goodsIdArrHandler(this.props.goodsIdArr);
                }else if(res.code == 102) {
                    target.value = oldVal;
                    H.operationState(res.message);
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else {
            target.value = oldVal;
        }
    }

    //点击删除;
    delGoods(id) {
        if($('.section-item .del-state').length > 0) return;
        let delStatus = this.state.delStatus;
        delStatus[id] = 1;
        this.setState({delStatus: delStatus});
        $('#' + id + ' .goods-body-cell').addClass('del-state');
        this.props.changeNextPageState && this.props.changeNextPageState(0);
    }

    //确认删除;
    confirmGoods(id) {
        let delStatus = this.state.delStatus;
        delStatus[id] = 0;
        this.setState({delStatus: delStatus});
        $('#' + id + ' .goods-body-cell').removeClass('del-state');
        this.props.changeNextPageState && this.props.changeNextPageState(1);
    }

    //删除某个商品;
    delGoodsItem(kid, id) {
        $('#goods_' + id).addClass('del-removed');
        let info = this.props.goodsList.market_info,
            flag = false,
            param = {shop_cart_goods_id: id},
            arr = this.props.goodsIdArr;
        for(var i in info[kid].goods_infos) {
            if(info[kid].goods_infos[i].shop_cart_goods_id == id) {
                info[kid].goods_infos.splice(i, 1);
                if(info[kid].goods_infos.length <= 0) {
                    info[kid] = null;
                    flag = true;
                }
                break;
            }
        }

        H.we_loading.show('商品删除中</br>请稍候……');
        //请求删除购物车商品接口;
        H.server.shopCart_goods_del(param, (res) => {
            if(res.code == 0) {
                for(var i in arr) {
                    if(arr[i] == id) {
                        arr.splice(i, 1);
                    }
                }
                H.operationState('删除成功');
                setTimeout(() => {
                    //this.setState({goodsList: info});
                    this.props.setGoodsInfo && this.props.setGoodsInfo(info);
                    if(flag) {
                        this.props.changeNextPageState && this.props.changeNextPageState(1);
                    }
                    this.props.goodsIdArrHandler && this.props.goodsIdArrHandler(arr);
                }, 500);
            }else {
                setTimeout(() => {
                    $('#goods_' + id).removeClass('del-removed');
                }, 700);
                H.operationState(res.message);
            }
        });
        H.we_loading.hide();
    }

    //生成购物车商品;
    createGoodsDom() {
        let data = this.props.goodsList.market_info,
            goodsIdArr = this.props.goodsIdArr,
            xml = [];
        for(var k in data) {
            let sectionXml = '',
                goodsXml = [],
                obj = data[k];
            if(obj) {
                for(var i in obj.goods_infos) {
                    let operationFlag = obj.goods_infos[i].goods_status != 2 || obj.goods_infos[i].price_expired || obj.goods_infos[i].on_sale == 1;
                    goodsXml.push(
                        <div id={'goods_' + obj.goods_infos[i].shop_cart_goods_id} key={'goods_' + obj.goods_infos[i].shop_cart_goods_id}
                             className={operationFlag ? 'body-cell goods-body-cell lack-state' : 'body-cell goods-body-cell'} >
                            <div className="flex-box center">
                                <div className="left">
                                    <div className="flex-box center">
                                        <div className="flex-num1">
                                            <div className="flex-box center">
                                                <div
                                                    id={'goods_' + obj.goods_infos[i].shop_cart_goods_id + '_select'}
                                                    className={!operationFlag && goodsIdArr.indexOf(obj.goods_infos[i].shop_cart_goods_id) !=-1 ? 'select selected' : 'select'}
                                                    onClick={operationFlag ? '' : this.goodsChangeSelect.bind(this, obj.goods_infos[i].shop_cart_goods_id)}>
                                                </div>
                                                <div className="goods-name flex-num1" style={{width: '100%'}}>
                                                    <p>{obj.goods_infos[i].goods_name}({obj.goods_infos[i].model_number})</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="unit-price">￥{obj.goods_infos[i].price}</div>
                                        <div className="goods-count flex-box center">
                                            <div className="add"
                                                 onClick={!operationFlag ? this.changeGoodsNum.bind(this, k, obj.goods_infos[i].shop_cart_goods_id, 'add') : ''}
                                            ></div>
                                            {
                                                operationFlag ? <div className="not-pay">缺货</div> :
                                                    <input type="tel" className="input-num"
                                                           id={'goods_id_'+obj.goods_infos[i].shop_cart_goods_id}
                                                           defaultValue={operationFlag ? '-' : obj.goods_infos[i].buy_number}
                                                           onFocus={this.focusGoodsNum.bind(this)}
                                                           onBlur={this.blurGoodsNum.bind(this, k, obj.goods_infos[i].shop_cart_goods_id)}
                                                        //onChange={this.changeGoods.bind(this, k, obj.goods_infos[i].shop_cart_goods_id)}
                                                           disabled={operationFlag}
                                                    />
                                            }
                                            <div className="reduction"
                                                 onClick={!operationFlag ? this.changeGoodsNum.bind(this, k, obj.goods_infos[i].shop_cart_goods_id, 'reduction') : ''}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="del-icon" onClick={this.delGoodsItem.bind(this, k, obj.goods_infos[i].shop_cart_goods_id)}>
                                </div>
                            </div>
                            {
                                obj.goods_infos[i].preferential_name ? <div className="preferential-price"><span className="label-icon">{obj.goods_infos[i].preferential_name}</span>
                                    {obj.goods_infos[i].preferential_name}{obj.goods_infos[i].preferential_text}</div> : null
                            }
                        </div>
                    );
                }
                sectionXml = (
                    <section id={'goods_' + k} key={'goods_' + k} className="section-item">
                        <div className="header-cell flex-box center">
                            <div className="flex-num1">从{obj.market_name}发货</div>
                            {
                                this.state.delStatus['goods_' + k] != 1 ?
                                    <div className="delGoodsBtn" onClick={this.delGoods.bind(this, 'goods_' + k)}>删除</div>
                                    :<div className="delGoodsBtn confirmBtn" onClick={this.confirmGoods.bind(this, 'goods_' + k)}>确定</div>
                            }
                        </div>
                        {goodsXml}
                    </section>
                );
                xml.push(sectionXml);
            }
        }

        return xml;
    }



    render() {
        return (
            <div className="goods-list">
                {this.createGoodsDom()}

                { this.props.goodsList.market_info ?
                <section className="section-item">
                    <div className="header-cell flex-box">
                        <div className="flex-num1">付款方式<span className="aside-info">(支持：微信支付、银行卡支付、网银支付)</span></div>
                    </div>
                    <div className="body-cell flex-box" onClick={this.props.changePayWayHandler.bind(this, 1)}>
                        <div className="flex-num1">
                            在线支付
                        </div>
                        <i className={this.props.payWay == 1 ? 'radio-icon selected' : 'radio-icon'}>
                        </i>
                    </div>
                    <div
                        className="body-cell flex-box"
                        onClick={this.props.changePayWayHandler.bind(this, 6)}>
                        <div className="flex-num1">
                            集采后支付（在线支付）
                        </div>
                        <i className={this.props.payWay == 6 ? 'radio-icon selected' : 'radio-icon'}>
                        </i>
                    </div>
                    <p className="desc">卖家将在每天{this.props.grouponTime.start}-{this.props.grouponTime.end}对集采单进行报价，报价后方可支付，请根据货物紧急程度自行选择下单。</p>
                    {/*{*/}
                        {/*this.props.goodsList.shop_transfer == 1 ?*/}
                            {/*<div>*/}
                                {/*<div*/}
                                    {/*className="body-cell flex-box"*/}
                                    {/*onClick={this.props.changePayWayHandler.bind(this, 2)}>*/}
                                    {/*<div className="flex-num1">*/}
                                        {/*上车收钱*/}
                                    {/*</div>*/}
                                    {/*<i className={this.props.payWay == 2 ? 'radio-icon selected' : 'radio-icon'}>*/}
                                    {/*</i>*/}
                                {/*</div>*/}
                            {/*</div>*/}
                             {/*:*/}
                            {/*<div*/}
                                {/*className={this.props.goodsList.payment_after_arrival == 1 ? 'body-cell flex-box lack-state' : 'body-cell flex-box'}*/}
                                {/*onClick={this.props.goodsList.payment_after_arrival == 1 ? '' : this.props.changePayWayHandler.bind(this, 5)}>*/}
                                {/*<div className="flex-num1">*/}
                                    {/*货到付款{this.props.goodsList.payment_after_arrival == 1 ? '（不支持）' : ''}*/}
                                {/*</div>*/}
                                {/*<i className={this.props.payWay == 5 ? 'radio-icon selected' : 'radio-icon'}>*/}
                                {/*</i>*/}
                            {/*</div>*/}
                    {/*}*/}
                    { this.props.goodsList.shop_transfer == 1 ? null :
                        <div
                            className={this.props.goodsList.payment_after_arrival == 1 ? 'body-cell flex-box lack-state' : 'body-cell flex-box'}
                            onClick={this.props.goodsList.payment_after_arrival == 1 ? '' : this.props.changePayWayHandler.bind(this, 5)}>
                            <div className="flex-num1">
                                货到付款{this.props.goodsList.payment_after_arrival == 1 ? '（不支持）' : ''}
                            </div>
                            <i className={this.props.payWay == 5 ? 'radio-icon selected' : 'radio-icon'}>
                            </i>
                        </div>
                    }
                </section>: <p style={{marginTop: '100px', textAlign: 'center'}}>购物车没有东西哦</p>}
            </div>
        );
    }
}

export default GoodsList;