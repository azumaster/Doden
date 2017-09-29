/*
* 商品详情底部栏*/

class GoodsInfoFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    setGoodsEnshrine() {

        if(this.props.isTourists == 1) {
            this.props.setGoodsEnshrine && this.props.setGoodsEnshrine();
        }else {
            H.sheet.promptLogin();
        }
    }

    //加入购物车;
    addBuyCar(e) {
        e.stopPropagation();
        if(this.props.isSeller == 1) {
            H.operationState('您是商家，不能加入购物车');
            return;
        }
        let goodsId = this.props.goodsId;
        if(this.props.isTourists == 1) {
            H.we_loading.show('加入购物车...');
            H.server.getGoodsConfirmInfo({goods_id: goodsId}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = goodsId;
                    H.sheet.addCar(options, () => {
                        $('#add_car_num').addClass('run');
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
        if(this.props.isTourists != 1) {
            H.sheet.promptLogin();
            return;
        }
        //如果是一批商不让点;
        if(this.props.isSeller == 1) {
            return;
        }

        window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=shopCartIndex';
    }

    //回首;
    homeHandler() {
        //如果是访客则让提示注册;
        if(this.props.isTourists != 1) {
            H.sheet.promptLogin();
            return;
        }

        window.location.href = 'index.php?m=Buyers&c=Goods&a=goodsGroupSHow';
    }

    render() {
        let addCarDom = '';
        if(this.props.goodsStatus == 0) {
            addCarDom = (<div className="flex-num1 add-shop-car disabled">售罄</div>);
        }else if(this.props.goodsStatus == 1) {
            addCarDom = (<div className="flex-num1 add-shop-car" onClick={this.addBuyCar.bind(this)}>加入购物车</div>);
        }else {
            addCarDom = (<div className="flex-num1 add-shop-car disabled">缺货</div>);
        }

        return (
            <footer className="goods-info-footer flex-box">
                <a className="home" onClick={this.homeHandler.bind(this)}>
                    <i className="home-icon"></i>
                    <p>首页</p>
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
                <a className="shop-car" onClick={this.goBuyCar.bind(this)}>
                    <i className="shop-car-icon"></i>
                    <p>购物车</p>
                    {
                        this.props.carData.goods_count > 0 ? <span className="car-num" id="goodsInfoCarNum">{this.props.carData.goods_count}</span> : ''
                    }
                    <span id="add_car_num" className="add-car-num">+1</span>
                </a>
                {addCarDom}
            </footer>
        );
    }
}

export default GoodsInfoFooter;