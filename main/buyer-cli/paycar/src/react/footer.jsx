import React from 'react';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.createPreferential = this.createPreferential.bind(this);
    }

    //全选;
    allSelect() {
        let className = $('#all_select').attr('class');
        if(className.indexOf('selected') != -1) {
            $('#all_select').removeClass('selected');
            $('.body-cell:not(.lack-state) .select').removeClass('selected');
            this.props.goodsIdArrHandler && this.props.goodsIdArrHandler([]);
        }else {
            $('#all_select').addClass('selected');
            $('.body-cell:not(.lack-state) .select').addClass('selected');
            let data = this.props.goodsList.market_info,
                arr = [];
            for(var k in data) {
                let obj = data[k];
                if(obj) {
                    for(var i in obj.goods_infos) {
                        if(obj.goods_infos[i].goods_status == 2 && !obj.goods_infos[i].price_expired && obj.goods_infos[i].on_sale == 2) {
                            arr.push(obj.goods_infos[i].shop_cart_goods_id);
                        }
                    }
                }
            }
            this.props.goodsIdArrHandler && this.props.goodsIdArrHandler(arr);
        }
    }

    //提交购物车;
    subInfo(amount) {
        let param = {},
            data = this.props.data,
            confirmText = '查看订单';

        if((this.props.pageStatus == 1 || this.props.pageStatus == 3) && data.payment_method != 6) {
            confirmText = '去付款';
        }

        if(data.shop_transfer == 1) {
            param = {
                shop_transfer: data.shop_transfer,
                shop_cart_goods_ids: data.shop_cart_goods_ids,
                payment_method: data.payment_method,
                logistics_method: data.logistics_method,
                diamond_use_number: data.diamond_use_number,
                voiture_info: data.voiture_info,
                order_amount: amount,
                take_info: {
                    province_id: data.take_info.province_id,
                    city_id: data.take_info.city_id,
                    county_id: data.take_info.county_id,
                    address: data.take_info.address,
                    contacts: data.take_info.contacts,
                    phone: data.take_info.phone
                }
            };
        }else {
            param = {
                shop_transfer: data.shop_transfer,
                shop_cart_goods_ids: data.shop_cart_goods_ids,
                payment_method: data.payment_method,
                logistics_method: data.logistics_method,
                diamond_use_number: data.diamond_use_number,
                order_amount: amount,
                take_info: {
                    province_id: data.take_info.province_id,
                    city_id: data.take_info.city_id,
                    county_id: data.take_info.county_id,
                    address: data.take_info.address,
                    contacts: data.take_info.contacts,
                    phone: data.take_info.phone
                }
            };
        }
        H.we_loading.show('订单提交中</br>请稍候……');
        H.server.order_create({data: JSON.stringify(param)}, (res) => {
            if(res.code == 0) {
                H.sheet({
                    title: '订单提交成功',
                    content: '<div class="actionsheet_cell read-only">' +
                    '<div class="icon-wrap success"></div>'+
                    '<p style="line-height: 1.6;">您的订单已提交成功</p>'+
                    '</div>',
                    cancel: '继续找货',
                    confirm: confirmText,
                    cancelCallback: () => {
                        window.location.href = 'index.php?m=Buyers';
                    },
                    confirmCallback: () => {
                        if(confirmText == '查看订单') {
                            window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=buyerOrder#no-shop-page';
                        }else {
                            window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=buyerOrder';
                        }
                    }
                });
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    createPreferential() {
        if(!this.props.footData) return null;
        let footData = this.props.footData.preferential;
        if(footData.length <= 0) return null;
        let xml = footData.map((val, index) => {
            return (<span key={index}>{val.preferential_name + val.preferential_value + val.preferential_unit}</span>);
        });
        return (<span>，含{xml}</span>);
    }

    render() {
        let domXml = '';
        if(this.props.pageStatus == 0) {
            domXml = (
                <footer className="car-foot-bar foot-bar flex-box">
                    <div className="all-select">
                        <i id="all_select" className={this.props.nextState == 1 ? 'selected' : 'selected disabled'}
                           onClick={this.props.nextState == 1 ? this.allSelect.bind(this) : ''}>
                        </i>(全选)
                    </div>
                    {
                        this.props.payWay == 6 ?
                            <div className="flex-num1 count"><p>每日{this.props.grouponTime.start}-{this.props.grouponTime.end}刷新价格</p><p>(不含运费)</p></div> :
                            <div className="flex-num1 count"><p>合计：{this.props.totalPrice}元</p><p>(不含运费{this.createPreferential()})</p></div>
                    }
                    <div>
                        <button
                            className={this.props.nextState == 1 && this.props.totalPrice != 0 ? 'next-btn' : 'next-btn disabled'}
                            onClick={this.props.nextState == 1 && this.props.totalPrice != 0 ? this.props.nextHandler.bind(this) : ''}
                        >下一步
                        </button>
                    </div>
                </footer>
            );
        }else if(this.props.pageStatus == 1) {
            domXml = (
                <footer className="car-foot-bar foot-bar flex-box">
                    {
                        this.props.payWay == 6 ?
                            <div className="all-select"><p>每日{this.props.grouponTime.start}-{this.props.grouponTime.end}刷新价格</p><p>(不含运费)</p></div> :
                            <div className="all-select"><p>合计：{
                                this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0)
                            }元</p><p>(不含运费{this.createPreferential()})</p></div>
                    }
                    <div className="flex-num1 count"><p>最高奖励：{this.props.diamond}钻</p>
                        {this.props.data.reducePrice ? <p>钻石减免：{this.props.data.reducePrice}元</p> : null}
                    </div>
                    <div>
                        <button
                            className="next-btn"
                            onClick={this.subInfo.bind(this, this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0))}
                        >提交</button>
                    </div>
                </footer>
            );
        }else if(this.props.pageStatus == 2) {
            domXml = (
                <footer className="car-foot-bar foot-bar flex-box">
                    <div className="all-select"><p>合计：
                        {
                            this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0)
                        }
                        元</p><p>(不含运费{this.createPreferential()})</p></div>
                    <div className="flex-num1 count"><p>最高奖励：{this.props.diamond}钻</p>
                        {this.props.data.reducePrice ? <p>钻石减免：{this.props.data.reducePrice}元</p> : null}
                    </div>
                    <div>
                        <button
                            className="next-btn"
                            onClick={this.subInfo.bind(this, this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0))}
                        >提交</button></div>
                </footer>
            );
        }else {
            domXml = (
                <footer className="car-foot-bar foot-bar flex-box">
                    <div className="all-select"><p>合计：
                        {
                            this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0) + parseInt(this.props.paidPrice)
                        }
                        元</p><p>(已含运费{this.createPreferential()})</p></div>
                    <div className="flex-num1 count"><p>最高奖励：{this.props.diamond}钻</p>
                        {this.props.data.reducePrice ? <p>钻石减免：{this.props.data.reducePrice}元</p> : null}
                    </div>
                    <div>
                        <button
                            className="next-btn"
                            onClick={this.subInfo.bind(this, this.props.totalPrice - (this.props.data.reducePrice ? this.props.data.reducePrice : 0) + parseInt(this.props.paidPrice))}
                        >提交</button>
                    </div>
                </footer>
            );
        }

        return (
            <div>
                {domXml}
            </div>
        );
    }
}

export default Footer;