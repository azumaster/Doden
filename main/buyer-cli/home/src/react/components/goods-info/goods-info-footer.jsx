/*
* 商品详情底部栏*/

class GoodsInfoFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carData: {   //购物车数据;
                goods_count: 0
            }
        };
        this.getCarData = this.getCarData.bind(this);
    }

    componentWillMount() {
        this.getCarData();
    }

    setGoodsEnshrine() {
        if(this.props.data.visitor_status == 1) {
            this.props.setGoodsEnshrine && this.props.setGoodsEnshrine();
        }else {
            H.sheet.promptLogin();
        }
    }

    //获取购物车数据;
    getCarData() {
        H.server.shopCartInfo({}, (res) => {
            if(res.code == 0) {
                this.setState({carData: res.data});
            }else {
                H.operationState(res.message);
            }
        });
    }

    //加入购物车;
    addBuyCar(e) {
        e.stopPropagation();
        if(this.props.data.is_seller == 1) {
            this.shopping();
            return;
        }
        let goodsId = this.props.goodsId;
        if(this.props.data.visitor_status == 1) {
            H.we_loading.show('加入购物车...');
            H.server.getGoodsConfirmInfo({goods_id: goodsId}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = goodsId;
                    H.sheet.addCar(options, () => {
                        $('#add_car_num').addClass('run');
                        $('#goodsInfoCarNum').show();
                        $('#goodsInfoCarNum').html(parseInt($('#goodsInfoCarNum').html()) + 1);
                        setTimeout(() => {
                            $('#add_car_num').removeClass('run');
                        }, 500);
                    });
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else {
            H.sheet.promptLogin();
        }
    }

    //去购物车;
    goBuyCar() {
        //如果是访客则让提示注册;
        if(this.props.data.visitor_status != 1) {
            H.sheet.promptLogin();
            return;
        }
        //如果是一批商不让点;
        if(this.props.data.is_seller == 1) {
            return;
        }

        window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=shopCartIndex';
    }

    //去店铺;
    homeHandler() {
        window.location.href = '?m=PublicTemplate&c=ApiPublic&a=shopShow&shopId='+this.props.supplierData.seller_id;
    }

    //减一
    take(){
        let val = Number($('#ask_price').val()) - 1;
        if(val <= 0 ){
            return;
        }
        if($('#ask_price')) {
            let price = $('#ask_price').attr('data-price');
            $('#totalPrice').html((val*price).toFixed(2));
        }
        $('#ask_price').val(val);
    }

    //加一
    add(){
        let val = Number($('#ask_price').val()) + 1;
        if($('#ask_price')) {
            let price = $('#ask_price').attr('data-price');
            $('#totalPrice').html((val*price).toFixed(2));
        }
        $('#ask_price').val(val);
    }

    //在线下单按钮
    shopping() {
        let para = this.props.data.goods;
        H.we_loading.show();
        H.server.getGoodsBuyData({goods_id: para.goods_id}, (res) => {
            H.we_loading.hide();
            let buyInfo = res.data;
            H.sheet.create({
                title: '在线下单',
                content: '<div class="ask-price" style="font-size: 16px;">' + '<div class="cell-row">' +
                '<div class="cell-head">' +
                '<img src=' + H.localhost + para.goods_image[0] + H.imgSize()[110]  + '>' +
                '</div>' +
                '<div class="cell-body"><div class="cell-column">' +
                '<div class="cell-head">' +
                this.props.data.details.goods_name +
                '</div>' +
                '<div style="position: absolute;bottom: 10px;"><span style="color: #d40c21;">￥<span>'+para.goods_price+'</span></span>' +
                '</div>' +
                '</div></div>' +
                '</div>' +
                '<div class="about pay-mum">购买数量<div data-operate="take" class="take-icon"></div><input type="number" class="cell-input-value" id="ask_price" data-price="'+
                buyInfo.goods_price+'" value="'+buyInfo.least_buy_num+'" /><div class="add-icon" data-operate="add"></div></div>' +
                '<div class="about total-price" style="border-top: 1px solid #e6e6e6;border-bottom: 1px solid #e6e6e6;">商品总价' +
                '<span class="total-price" style="color:#d40c21;">￥<span id="totalPrice">'+((buyInfo.goods_price*buyInfo.least_buy_num).toFixed(2))+'</span></span></div>' +
                '<div style="text-align: center;color:#878787;font-size: 12px;padding: 10px 0;">由<span style="color: #1bc078;">“'+buyInfo.seller_shop_name+
                '”</span>从<span style="color: #1bc078;">'+buyInfo.market_name+'</span>发货</div></div>',
                cancel: '关闭',
                confirm: '确认下单',
                confirmCallback: function() {
                    let obj = {
                        goods_id: para.goods_id,
                        basic_attr_id: buyInfo.basic_attr_id,
                        buy_num: $('#ask_price').val(),
                        take_tel: buyInfo.mobile_no,
                        address: buyInfo.take_address
                    };
                    H.we_loading.show();
                    H.server.genGoodsOrder(obj, (res) => {
                        if(res.code == 0) {
                            H.operationState('下单成功');
                        }else {
                            H.operationState(res.message);
                        }
                    });
                    H.sheet.hide();
                    H.we_loading.hide();
                }
            });
            $('.take-icon').click(this.take);
            $('.add-icon').click(this.add);
            $('#ask_price').change(() => {
                let price = $('#ask_price').attr('data-price');
                let val = $('#ask_price').val();
                $('#totalPrice').html((val*price).toFixed(2));
            });
        });
    }

    //求报价
    askPrice(){
        let para = this.props.data.goods,
            supplierData = this.props.supplierData;
        H.sheet.create({
            title: '获取报价',
            content: '<div class="ask-price">' + '<div class="cell-row">' +
            '<div class="cell-head">' +
            '<img src=' + H.localhost + para.goods_image[0] + H.imgSize()[110]  + '>' +
            '</div>' +
            '<div class="cell-body"><div class="cell-column">' +
            '<div class="cell-head">' +
            this.props.data.details.goods_name +
            '</div>' +
            '<div class="cell-foot">' +
            supplierData.point_of_departure +
            '</div>' +
            '</div></div>' +
            '</div>' +
            '<div class="about askPrice">大概数量：<div data-operate="take" class="take-icon"></div><input type="number" class="cell-input-value" id="ask_price" value="1" /><div class="add-icon" data-operate="add"></div></div>' +
            '<p class="askPrice">供应商：' + supplierData.seller_name + '</p>' +
            '<p>当前价格过期，需要你提出购买需求，供应商才能报价</p></div>',
            cancel: '关闭',
            confirm: '通知供应商',
            confirmCallback: function() {
                let obj = {
                    goods_id: '',
                    need_num: ''
                };
                obj.goods_id = para.goods_id;
                obj.need_num = $('#ask_price').val();
                H.we_loading.show();
                H.server.addQuotation(obj, (res) => {
                    if(res.code == 0) {
                        H.operationState('通知成功');
                    }else {
                        H.operationState(res.message);
                    }
                });
                H.sheet.hide();
                H.we_loading.hide();
            }
        });
        $('.take-icon').click(this.take);
        $('.add-icon').click(this.add);
    }

    render() {
        let addCarDom = '',
            goodsData = this.props.data.goods;

        //addCarDom = (<div className="flex-num1 add-shop-car disabled">售罄</div>);
        //@@goods_status	整型	商品状态 0=待审核 1=正常 3=被删除 4=拒绝
        //@@on_sale	整型	上架状态 1=下架 2=上架
        //@@price_expired	布尔	商品价格是否过期 false=未过期 true=已过期
        if(this.props.goodsStatus == 1) {
            if(goodsData.goods_status != 1 || goodsData.on_sale == 1) {    //商品不正常或者已下架
                addCarDom = (<div className="flex-num1 add-shop-car disabled">商品已下架</div>);
            }else {       //商品正常并且上架;
                if(goodsData.price_expired) {     //商品已过期;
                    addCarDom = (<div className="flex-num1 add-shop-car disabled" onClick={this.askPrice.bind(this)}>求报价</div>);
                }else {     //商品未过期;
                    if(this.props.data.is_seller == 1) {     //如果是一批商显示在线下单;
                        addCarDom = (<div className="flex-num1 add-shop-car" onClick={this.shopping.bind(this)}>在线下单</div>);
                    }else {
                        addCarDom = (<div className="flex-num1 add-shop-car" onClick={this.addBuyCar.bind(this)}>加入购物车</div>);
                    }
                }
            }
        }else {
            addCarDom = (<div className="flex-num1 add-shop-car disabled">商品已下架</div>);
        }

        return (
            <footer className="goods-info-footer flex-box">
                <a className="home" onClick={this.homeHandler.bind(this)}>
                    <i className="home-icon"></i>
                    <p>店铺</p>
                </a>
                {
                    this.props.goodsEnshrine == 1 ?
                        <a className="often-buy">
                            <i className="often-buy-icon has" onClick={this.setGoodsEnshrine.bind(this)}></i>
                            <p>已常购</p>
                        </a>
                        :
                        <a className="often-buy" onClick={this.setGoodsEnshrine.bind(this)}>
                            <i className="often-buy-icon"></i>
                            <p>常购</p>
                        </a>
                }
                <a className="consulting" onClick={this.props.consultingHandler}>
                    <i className="consulting-icon"></i>
                    <p>咨询</p>
                </a>
                {
                    this.props.data.is_seller != 1 ? <a className="shop-car" onClick={this.goBuyCar.bind(this)}>
                        <i className="shop-car-icon"></i>
                        <p>购物车</p>
                        <span className="car-num" id="goodsInfoCarNum"
                              style={this.state.carData.goods_count > 0 ? null : {display: 'none'}}>{this.state.carData.goods_count}</span>
                        <span id="add_car_num" className="add-car-num">+1</span>
                    </a> : null
                }
                {addCarDom}
            </footer>
        );
    }
}

export default GoodsInfoFooter;