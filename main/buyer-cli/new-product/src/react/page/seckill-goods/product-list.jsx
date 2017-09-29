//平台推荐商品列表;

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            page: 1,
            size: 30,
            data: null,
            dataArr: null,
            list: [],
            textArr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        };
        this.getData = this.getData.bind(this);
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.addTimeCount = this.addTimeCount.bind(this);
        this.CreateTimeCount = this.CreateTimeCount.bind(this);
    }

    componentWillMount() {
        this.getData();  //获取商品列表
    }

    getData() {
        let server = H.server,
            param = {
                page: this.state.page,
                size: this.state.size,
                activity_type_id: 4
            },
            load = false;
        H.we_loading.show();
        server.getActivityGoodsList(param, (res) => {
            if(res.code == 0) {
                if(!this.state.data) {
                    this.props.setTourists(res.data.register_status, res.data.is_seller);
                }
                if(param.page == 1) {
                    //设置分享;
                    H.share.changeShare({
                        img: H.localhost + 'Public/images/buyer-cli/seckill-goods-share.jpg?v='+version,
                        url: window.location.host + '/show_page.php?pageTag=7',
                        title: '【找冻品网】限时秒杀',
                        desc: '冻品限时秒杀，一次省到底'
                    });
                }
                let list = res.data.activitys;
                for(let i in list) {
                    list[i].stateTime = 0;
                }
                this.setState({
                    data: res.data,
                    list: list
                }, () => {
                    this.scrollRefresh();
                    this.addTimeCount();
                });
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
            load = true;
        });
        setTimeout(() => {H.we_loading.timeout(load);}, 10000);
    }

    componentDidMount() {
        this.scrollCreator();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pageStatus == 0 && this.state.data) {
            //设置分享;
            H.share.changeShare({
                img: H.localhost + 'Public/images/buyer-cli/seckill-goods-share.jpg?v='+version,
                url: window.location.host + '/show_page.php?pageTag=7',
                title: '【找冻品网】限时秒杀',
                desc: '冻品限时秒杀，一次省到底'
            });
        }
    }

    scrollCreator() {
        // 创建iscroll实例;
        var wrapper = document.getElementById('seckill_goods_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                probeType: 3,
                wheelAction: 'zoom',
                click: true,
                scrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true
            });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); });
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    //点击商品进入详情页;
    goodsListHandler(goodsId, goods_enshrine) {
        this.props.goodsInfoPage && this.props.goodsInfoPage(goodsId, goods_enshrine);
    }

    //加入购物车;
    addBuyCar(goodsId, num, e) {
        e.stopPropagation();
        if(!goodsId) return;
        //register_status:访问者的状态 1=注册用户 2=访客 3=小黑屋;
        if(this.state.data.register_status == 1) {
            let load = false;
            H.we_loading.show();
            H.server.getGoodsConfirmInfo({goods_id: goodsId}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = goodsId;
                    options.goods_start_num = num;
                    options.disable = true;
                    H.sheet.addCar(options, () => {
                        this.props.getCarData();
                    });
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
                load = true;
            });
            setTimeout(() => {H.we_loading.timeout(load);}, 10000);
        }else {
            H.sheet.promptLogin();
        }
    }

    //咨询点击事件;
    consultingHandler(goodsId, e) {
        e.stopPropagation();
        H.we_loading.show();
        let load = false;
        H.server.getConsultInfo({goods_id: goodsId}, (res) => {
            if(res.code == 0) {
                H.sheet.consulting(res.data);
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
            load = true;
        });
        setTimeout(() => {H.we_loading.timeout(load);}, 10000);
    }

    //添加时间计时器;
    addTimeCount() {
        let list = this.state.list,
            serverTime = this.state.data.service_time;
        if(list.length == 0) return;
        for(let i in list) {
            this.CreateTimeCount(serverTime, list[i].start_time, list[i].end_time, i);
        }
    }

    CreateTimeCount(serverTime, start, end, i) {
        new H.countdown({
            start: serverTime,
            end: start,
            format: ':',
            callback: (time, num) => {
                let isEndStyle = '';
                if(num <= 0) {
                    if(end && serverTime < end) {
                        this.CreateTimeCount(start, end, null, i);
                        let list = this.state.list;
                        list[i].stateTime = 1;
                        this.setState({list: list});
                        return;
                    }else {
                        let list = this.state.list;
                        list[i].stateTime = 2;
                        this.setState({list: list});
                        isEndStyle = 'end';
                    }
                }
                if($('#seckill_time_'+i)) {
                    let str = '<span class="time-item '+isEndStyle+'">'+time[0]+'</span><span class="time-item '+isEndStyle+'">'+time[1]+'</span>:' +
                        '<span class="time-item '+isEndStyle+'">'+time[3]+'</span><span class="time-item '+isEndStyle+'">'+time[4]+'</span>:'+
                        '<span class="time-item '+isEndStyle+'">'+time[6]+'</span><span class="time-item '+isEndStyle+'">'+time[7]+'</span>';
                    $('#seckill_time_'+i).html(str);
                }
            }
        });
    }

    //查看秒杀规则说明;
    instruction() {
        H.sheet.create({
            title: '秒杀活动说明',
            content: '<div class="actionsheet_cell read-only">' +
            '<div class="actionsheet_item center">' +
            '<p style="line-height: 1.6;">1、活动商品均由入住平台的商家提供；</br>2、只有“在线支付”的订单才发货，其它付款方式不发货；' +
            '</br>3、5分钟未付款，秒杀将取消；</br>4、只有四川各市县级批发商才能参加本次活动；</p>'+
            '</div></div>',
            confirm: '我知道了',
            confirmCallback: () => {
                H.sheet.hide();
            }
        });
    }

    createDom() {
        let batchData = this.state.list,
            XML = [];
        if(!batchData) return;
        for(let i in batchData) {
            let goodsData = batchData[i].lists,
                goodsXML = [];
            for(let j in goodsData) {
                let data = goodsData[j],
                    inventory = 0,  //剩余;
                    addCarBtn = '';
                if(batchData[i].stateTime == 0) {   //判断活动是否开始，未开始;
                    addCarBtn = (<a className="btn btn-green btn-addcar" style={{backgroundColor: '#f5f4f5', border: '1px solid #f5f4f5', color: '#b2b2b2'}}
                                    onClick={this.addBuyCar.bind(this, 0)}>未开始</a>);
                }else if(batchData[i].stateTime == 1) {  //活动已经开始，正常进行
                    if(batchData[i].activity_shop_types.indexOf(this.state.data.shop_type_num) != -1 && data.goods_inventory > 0) {  //判断是否是可参加活动的用户类型；
                        if(goodsData[j].buy_num > 0) {  //如果已经购买;显示已售罄;
                            addCarBtn = (<a className="btn btn-gray btn-addcar" style={{backgroundColor: ''}} onClick={this.addBuyCar.bind(this, 0, null)}>已售罄</a>);
                            inventory = 1;
                        }else {
                            addCarBtn = (<a className="btn btn-green btn-addcar" onClick={this.addBuyCar.bind(this, data.goods_id, data.restrict_buy_num)}>开始秒杀</a>);
                        }
                    }else {
                        addCarBtn = (<a className="btn btn-gray btn-addcar" style={{backgroundColor: ''}} onClick={this.addBuyCar.bind(this, 0, null)}>已售罄</a>);
                        inventory = 1;
                    }
                }else if(batchData[i].stateTime == 2) {   //活动已结束;
                    addCarBtn = (<a className="btn btn-gray btn-addcar" style={{backgroundColor: ''}} onClick={this.addBuyCar.bind(this, 0, null)}>已售罄</a>);
                    inventory = 1;
                }
                goodsXML.push(
                    <li key={i+'_'+j} className="goods-list">
                        <div className="flex-box">
                            <div className="goods-img">
                                <img src={H.localhost + data.goods_image + H.imgSize()[110]} />
                                <span className="pic-num">{data.goods_image_count}张</span>
                            </div>
                            <div className="flex-num1">
                                <div className="goods-title">
                                <span className="goods-title-clamp">
                                    {data.goods_title ? data.goods_title : data.goods_name + '' + data.goods_brand + '' + data.goods_standard + '' + data.goods_model}
                                </span>
                                </div>
                                <div className="price">
                                    <span className="color-orange">￥<span className="price-num">{data.goods_price}</span></span>
                                </div>
                                <div className="group-count">商品由“{data.seller_shop_name}”提供</div>
                                <div className="group-count">剩余{inventory == 1 ? 0 : data.goods_inventory}件  每人限购{data.restrict_buy_num}件</div>
                            </div>
                        </div>
                        <div className="group-btn flex-box center">
                            <div className="btn-wrap flex-num1" style={{textAlign: 'right'}}>
                                {addCarBtn}
                                <a className="btn btn-green-the btn-small" onClick={this.consultingHandler.bind(this, data.goods_id)}>咨询</a>
                            </div>
                        </div>
                    </li>
                );
            }
            let label = '未开始';
            if(batchData[i].stateTime == 0) {
                label = '未开始';
            }else if(batchData[i].stateTime == 1) {
                label = '秒杀中';
            }else if(batchData[i].stateTime == 2) {
                label = '已结束';
            }
            XML.push(
                <div key={i}>
                    <header className="product-header flex-box center">
                        <div className="seckill-buy-header flex-num1">
                            <p>第{this.state.textArr[i]}波秒杀</p>
                            <div>{label}：<div id={'seckill_time_'+i} className="seckill-time"></div></div>
                        </div>
                        {
                            i == 0 ? <a className="seckill-rule" onClick={this.instruction.bind(this)}>规则</a> : ''
                        }
                    </header>
                    <ul className="product-list">
                        {goodsXML}
                    </ul>
                </div>
            );
        }
        return XML;
    }

    render() {
        return (
            <div id="seckill_goods_wrap" className="seckill-goods-wrap">
                <div className="scroller">
                    {this.createDom()}
                </div>
            </div>
        );
    }
}

export default ProductList;