//新品推荐商品列表;

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            page: 1,
            size: 30,
            data: null,
            list: [],
            goods_count: '',  //团购商品总数;
            red_packet_geted: null,  //是否领取红包;
            isTimeCount: false   //是否已经加了计时器;
        };
        this.getData = this.getData.bind(this);
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.addTimeCount = this.addTimeCount.bind(this);
    }

    componentWillMount() {
        H.we_loading.show();
        this.getData();  //获取商品列表;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pageStatus == 0 && this.state.data) {
            //设置分享;
            let name1 = '', name2 = '', desc = '';
            if(this.state.data.goods[0]) {
                name1 = this.state.data.goods[0].goods_name;
            }
            if(this.state.data.goods[1]) {
                name2 = this.state.data.goods[1].goods_name;
            }
            desc = name1+'、'+name2+'等'+this.state.data.goods_count+'种好货，正在补贴促销，错过就得高价购买';
            if(!this.state.data.goods[0] && !this.state.data.goods[1]) {
                desc = '各种好货，正在补贴促销，错过就得高价购买';
            }
            H.share.changeShare({
                img: H.localhost + 'Public/images/buyer-cli/group-buy-share.jpg?v='+version,
                url: window.location.host + '/show_page.php?pageTag=1&showDate=' + $showDate,
                title: '【每日团购】冻品好货，“找冻品网”正在促销！',
                desc: desc
            });
        }
    }

    getData() {
        let server = H.server,
            param = {
                page: this.state.page,
                size: this.state.size,
                date: $showDate
            };
        server.getBulkPurchasingList(param, (res) => {
            let list = this.state.list.concat(res.data.goods);
            if(res.code == 0) {
                if(!this.state.data) {
                    this.props.setTourists(res.data.visitor_status, res.data.is_seller);
                }
                if(param.page == 1) {
                    //设置分享;
                    let name1 = '', name2 = '', desc = '';
                    if(res.data.goods[0]) {
                        name1 = res.data.goods[0].goods_name;
                    }
                    if(res.data.goods[1]) {
                        name2 = res.data.goods[1].goods_name;
                    }
                    desc = name1+'、'+name2+'等'+res.data.goods_count+'种好货，正在补贴促销，错过就得高价购买';
                    if(!res.data.goods[0] && !res.data.goods[1]) {
                        desc = '各种好货，正在补贴促销，错过就得高价购买';
                    }
                    H.share.changeShare({
                        img: H.localhost + 'Public/images/buyer-cli/group-buy-share.jpg?v='+version,
                        url: window.location.host + '/show_page.php?pageTag=1&showDate=' + $showDate,
                        title: '【每日团购】冻品好货，“找冻品网”正在促销！',
                        desc: desc
                    });
                }
                if(res.data.goods.length > 0) {
                    this.setState({
                        data: res.data,
                        list: list,
                        goods_count: res.data.goods_count,
                        red_packet_geted: res.data.red_packet_geted
                    }, () => {
                        this.scrollRefresh();
                        this.addTimeCount();
                    });
                    if(res.data.red_packet_geted == 0) {
                        H.preLoadImg(H.localhost + 'Public/images/buyer-cli/instruction-not.png');
                        H.preLoadImg(H.localhost + 'Public/images/buyer-cli/instruction-has.png');
                        H.preLoadImg(H.localhost + 'Public/images/buyer-cli/share-img.png');
                    }
                }
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator() {
        // 创建iscroll实例
        var wrapper = document.getElementById('group_goods_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                probeType: 1,
                wheelAction: 'zoom',
                click: true,
                scrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true
            });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    //点击商品进入详情页;
    goodsListHandler(goodsId) {
        this.props.goodsInfoPage && this.props.goodsInfoPage(goodsId);
    }

    //加入购物车;
    addBuyCar(goodsId, e) {
        e.stopPropagation();
        if(!goodsId) return;
        //visitor_status:访问者的状态 1=注册用户 2=访客 3=小黑屋;
        if(this.state.data.visitor_status == 1) {
            H.we_loading.show();
            H.server.getGoodsConfirmInfo({goods_id: goodsId}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = goodsId;
                    H.sheet.addCar(options, () => {
                        this.props.getCarData();
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

    //咨询点击事件;
    consultingHandler(goodsId, e) {
        e.stopPropagation();
        H.we_loading.show('');
        H.server.getConsultInfo({goods_id: goodsId}, (res) => {
            if(res.code == 0) {
                H.sheet.consulting(res.data);
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide('');
        });
    }

    //查看团购活动说明;
    instruction() {
        H.sheet.create({
            title: '团购活动说明',
            content: '<div class="actionsheet_cell read-only">' +
            '<div class="actionsheet_item center">' +
                '<p style="line-height: 1.6;">上架规则：</br>1、供应商申请团购后，提供样品给平台；</br>2、样品货好、价优者，进入排队；</br>惩罚规则：' +
            '</br>1、供应商发假冒劣质货，永久取消团购资格；</br>2、线上价格比铺面高，永久取消团购资格；</br>3、鼓励用户私下交易，永久取消团购资格。</p>'+
            '</div></div>',
            confirm: '我知道了',
            confirmCallback: () => {
                H.sheet.hide();
            }
        });
    }

    //判断是否领取红包;
    redPacketGet() {
        this.props.instructionStatus(true);
    }

    //添加时间计时器;
    addTimeCount() {
        let list = this.state.list;
        if(this.state.isTimeCount && list.length == 0) return;
        for(let i in list) {
            new H.countdown({
                start: this.state.data.server_time,
                end: list[i].auto_soldout_time,
                callback: function(time) {
                    if($('#time_goodsId'+list[i].goods_id)) {
                        $('#time_goodsId'+list[i].goods_id).html(time);
                    }
                }
            });
        }
        this.setState({isTimeCount: true});
    }

    render() {
        H.countTimeArr = [];
        return (
            <div id="group_goods_wrap" className="group-goods-wrap">
                <div id="new_product_scroll" className="scroller" style={{paddingBottom: '52px'}}>
                    <header className="product-header flex-box center">
                        <div className="group-buy-header flex-num1">
                            <p><i className="clock-icon"></i>当前{this.state.goods_count}个团购正在进行</p>
                            <p><a className="show-instruction" onClick={this.instruction.bind(this)}>查看团购活动说明</a></p>
                        </div>
                        {
                            this.state.red_packet_geted == 0  && !this.props.isGetRed ?
                                <div>
                                    <a className="red-envelope" onClick={this.redPacketGet.bind(this)}>
                                        <img className="envelope-img" src={H.localhost + 'Public/images/buyer-cli/envelope.png'}/>
                                    </a>
                                </div> : ''
                        }
                    </header>
                    <ul className="product-list">
                        {
                            this.state.list.map((data, index) => {
                                let addCarBtn = '';
                                if(this.state.data.is_seller == 0) {
                                    if(data.goods_surplus > 0) {
                                        addCarBtn = (<a className="btn btn-green btn-addcar" onClick={this.addBuyCar.bind(this, data.goods_id)}>立即抢购</a>);
                                    }else {
                                        addCarBtn = (<a className="btn btn-gray btn-addcar" onClick={this.addBuyCar.bind(this, 0)}>已售磬</a>);
                                    }
                                }
                                return(
                                    <li key={index} className="goods-list" onClick={this.goodsListHandler.bind(this, data.goods_id)}  >
                                        <div className="flex-box">
                                            <div className="goods-img">
                                                <img src={data.goods_image == '' ? H.defaultImg()[2] : H.localhost + data.goods_image + H.imgSize()[110]} />
                                                <span className="pic-num">{data.goods_image_count}张</span>
                                            </div>
                                            <div className="flex-num1">
                                                <div className="goods-title">
                                                    <span className="goods-title-clamp">
                                                    {data.goods_title ? data.goods_title : data.goods_name + '' + data.goods_brand + '' + data.goods_guigei + '' + data.goods_xinghao}
                                                </span>
                                                </div>
                                                <div className="price">
                                                    <span className="color-orange">￥<i className="price-num">{data.goods_price}</i></span>
                                                </div>
                                                <div className="diff-price">
                                                    <i className="group-icon">团</i> 比铺面便宜{data.goods_goodness}元
                                                </div>
                                                <div className="group-count">已售{data.goods_work_off}&nbsp;&nbsp;剩余<span className="color-orange">{data.goods_surplus}</span>件</div>
                                            </div>
                                        </div>
                                        <div className="group-btn flex-box center">
                                            <div className="time"><i className="clock-icon-item"></i>
                                                <span className="time-i" id={'time_goodsId'+data.goods_id}></span>
                                            </div>
                                            <div className="btn-wrap flex-num1" style={{textAlign: 'right'}}>
                                                {addCarBtn}
                                                <a className="btn btn-green-the btn-small" onClick={this.consultingHandler.bind(this, data.goods_id)}>咨询</a>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        }
                    </ul>

                </div>
            </div>
        );
    }
}

export default ProductList;