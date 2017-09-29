//新品推荐商品列表;

import FooterLoading from '../../component/footer-loading/footer-loading.jsx';
import DataEnd from '../../component/data-end/data-end.jsx';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            size: 20,
            riseList: [],  //涨价的数据;
            fallList: [],  //降价的数据;
            allList: [],  //全部数据;
            risePage: 0,
            fallPage: 0,
            allPage: 0,
            loadEnd: false,  //数据加载完了;
            data: null,  //每次拿到的数据;;
            isLoad: true,   //是否可加载数据;
            dataStatus: 3   //数据类型，1表示降价,2表示涨价，3表示全部;
        };
        this.getData = this.getData.bind(this);
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.createList = this.createList.bind(this);
    }

    componentWillMount() {
        H.we_loading.show();
        this.getData();  //获取商品列表;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.pageStatus == 0 && this.state.data) {
            //设置分享;
            H.share.changeShare({
                img: H.localhost + 'Public/images/buyer-cli/gains-goods-share.jpg?v='+version,
                url: window.location.host + '/show_page.php?pageTag=4&showDate=' + $showDate,
                title: '【找冻品网】冻品大数据分析，来看有哪些货今日涨价了？',
                desc: this.state.data.goods_rise_total + '种冻货正在涨价，' + this.state.data.goods_fall_total + '种降价，来看看吧，涨价降价提前知道！'
            });
        }
        if(nextProps.goodsId) {
            this.setOftenBuyStatus(nextProps.goodsId, nextProps.isGoodsOften);
        }
        if(nextProps.dataStatus != this.state.dataStatus) {
            this.setState({
                dataStatus: nextProps.dataStatus,
                loadEnd: false
            }, () => {
                this.state.SCROLL.scrollTo(0, 0);
                if(this.props.dataStatus == 1) {  //降价数据;
                    if(this.state.fallList.length <= 0) {
                        H.we_loading.show();
                        this.getData();
                    }
                }else if(this.props.dataStatus == 2) {  //涨价的数据;
                    if(this.state.riseList.length <= 0) {
                        H.we_loading.show();
                        this.getData();
                    }
                }else if(this.props.dataStatus == 3) {  //全部数据
                    if(this.state.allList.length <= 0) {
                        H.we_loading.show();
                        this.getData();
                    }
                }
            });
        }
    }

    getData() {
        let server = H.server,
            param = {
                page: 1,
                size: this.state.size,
                order_price: this.props.dataStatus,
                date: $showDate
            };
        if(this.props.dataStatus == 1) {  //降价数据;
            param.page = this.state.fallPage+1;
        }else if(this.props.dataStatus == 2) {  //涨价的数据;
            param.page = this.state.risePage+1;
        }else if(this.props.dataStatus == 3) {  //全部数据;
            param.page = this.state.allPage+1;
        }
        server.getPriceChangeList(param, (res) => {
            if(res.code == 0) {
                if(!this.state.data) {
                    this.props.setTourists(res.data.visitor_status, res.data.is_seller);
                }

                if(param.page == 1) {
                    //设置分享;
                    H.share.changeShare({
                        img: H.localhost + 'Public/images/buyer-cli/gains-goods-share.jpg?v='+version,
                        url: window.location.host + '/show_page.php?pageTag=4&showDate=' + $showDate,
                        title: '【找冻品网】冻品大数据分析，来看有哪些货今日涨价了？',
                        desc: res.data.goods_rise_total + '种冻货正在涨价，' + res.data.goods_fall_total + '种降价，来看看吧，涨价降价提前知道！'
                    });
                    H.scrollY = 0;
                }

                if(this.props.dataStatus == 1) {  //降价数据;
                    let list = this.state.fallList.concat(res.data.goods);
                    this.setState({
                        fallList: list,
                        data: res.data,
                        isLoad: true,
                        fallPage: param.page
                    }, () => {
                        this.scrollRefresh();
                        H.imgLoad({box: '.gains-list-fall'});
                    });

                }else if(this.props.dataStatus == 2) {  //涨价的数据;
                    let list = this.state.riseList.concat(res.data.goods);
                    this.setState({
                        riseList: list,
                        data: res.data,
                        isLoad: true,
                        risePage: param.page
                    }, () => {
                        this.scrollRefresh();
                        H.imgLoad({box: '.gains-list-rise'});
                    });
                }else if(this.props.dataStatus == 3) {  //全部数据
                    let list = this.state.allList.concat(res.data.goods);
                    this.setState({
                        allList: list,
                        data: res.data,
                        isLoad: true,
                        allPage: param.page
                    }, () => {
                        this.scrollRefresh();
                        H.imgLoad({box: '.gains-list-all'});
                    });
                }
                if(res.data.goods.length < param.size) {
                    this.setState({loadEnd: true});
                }else {
                    this.setState({loadEnd: false});
                }
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    componentDidMount() {
        this.scrollCreator(this.getData);
    }

    scrollCreator(fn) {
        // 创建iscroll实例
        var wrapper = document.getElementById('gains_goods_wrap'),
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
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scroll', () => {
            let css = '';
            if(this.props.dataStatus == 1) {  //降价数据;
                css = '.gains-list-fall';
            }else if(this.props.dataStatus == 2) {  //涨价的数据;
                css = '.gains-list-rise';
            }else if(this.props.dataStatus == 3) {  //全部数据;
                css = '.gains-list-all';
            }
            if((H.scrollY - SCROLL.y) > 30) {
                H.imgLoad({box: css});
                H.scrollY = SCROLL.y;
            }
            if(this.state.loadEnd) return;
            if((SCROLL.y - SCROLL.maxScrollY) < 300) {
                if(this.state.isLoad) {
                    this.setState({isLoad: false});
                    fn && fn();
                }
            }
        });
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

    //加入常购;
    addOftenBuyGoods(goodsId, e) {
        e.stopPropagation();
        if(goodsId == 0) return;
        H.we_loading.show();
        H.server.addOftenBuyGoods({goods_id: goodsId}, (res) => {
            if(res.code == 0) {
                this.setOftenBuyStatus(goodsId, 1);
                H.operationState('加入常购成功');
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    //取消常购;
    delOftenBuyGoods(goodsId, e) {
        e.stopPropagation();
        H.we_loading.show();
        H.server.delOftenBuyGoods({goods_id: goodsId}, (res) => {
            if(res.code == 0) {
                this.setOftenBuyStatus(goodsId, 0);
                H.operationState('取消常购成功');
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    //加入常购之后，把加入的标记;
    setOftenBuyStatus(goodsId, status) {
        let list = this.state.list;
        for(let i in list) {
            if(list[i].goods_id == goodsId) {
                list[i].goods_enshrine = status;
                this.setState({list: list});
                break;
            }
        }
    }

    createList(id) {
        let style = {
            display: 'none'
        };
        let list = [];
        if(id == 'all') {
            list = this.state.allList;
            if(this.props.dataStatus == 3) {
                style.display = 'block';
            }
        }else if(id == 'rise') {
            list = this.state.riseList;
            if(this.props.dataStatus == 2) {
                style.display = 'block';
            }
        }else if(id == 'fall') {
            list = this.state.fallList;
            if(this.props.dataStatus == 1) {
                style.display = 'block';
            }
        }

        return (
            <ul className={'product-list ' + 'gains-list-' + id} style={style}>
                {
                    list.map((data, index) => {
                        let addCarBtn = '';
                        if(this.state.data.is_seller == 0) {
                            addCarBtn = (<a className="btn btn-green btn-addcar" onClick={this.addBuyCar.bind(this, data.goods_id)}>加入购物车</a>);
                        }
                        return(
                            <li key={index} className="flex-box goods-list" onClick={this.goodsListHandler.bind(this, data.goods_id)}  >
                                <div className="goods-img">
                                    <img data-url={data.goods_image == '' ? H.defaultImg()[2] : H.localhost + data.goods_image + H.imgSize()[110]} src={H.defaultImg()[2]} />
                                    <span className="pic-num">{data.goods_image_count}张</span>
                                </div>
                                <div className="flex-num1">
                                    <div className="goods-title">
                                        <span className="goods-title-clamp">
                                            {data.goods_title ? data.goods_title : data.goods_name + '' + data.goods_brand + '' + data.goods_guigei + '' + data.goods_xinghao}
                                        </span>
                                    </div>
                                    <div className="old-price">
                                        <span>昨日：￥{data.goods_yesterday_price}</span>
                                    </div>
                                    <div className="price">
                                        <span className="color-orange">现价：￥{data.goods_now_price}</span>
                                        {
                                            this.state.data.visitor_status != 1 ? '(登录可见)' : ''
                                        }
                                    </div>
                                    <div className="flex-box btn-wrap">
                                        {addCarBtn}
                                        <a className="btn btn-green-the btn-small" onClick={this.consultingHandler.bind(this, data.goods_id)}>咨询</a>
                                        {
                                            this.state.data.visitor_status == 1 ?
                                                <div className="flex-num1 collection">
                                                    {
                                                        data.goods_enshrine == 1 ?
                                                            <a className="has" onClick={this.delOftenBuyGoods.bind(this, data.goods_id)}></a>
                                                            : <a className="not" onClick={this.addOftenBuyGoods.bind(this, data.goods_id)}></a>
                                                    }
                                                </div> :
                                                ''
                                        }
                                    </div>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    render() {
        let dataEndXml = '';
        if(this.state.loadEnd) {
            if(this.props.dataStatus == 1 && this.state.fallList.length > 7) {  //降价数据;
                dataEndXml = (<DataEnd />);
            }else if(this.props.dataStatus == 2 && this.state.riseList.length > 7) {  //涨价的数据;
                dataEndXml = (<DataEnd />);
            }else if(this.props.dataStatus == 3 && this.state.allList.length > 7) {  //全部数据;
                dataEndXml = (<DataEnd />);
            }
        }
        return (
            <div id="gains_goods_wrap" className="gains-goods-wrap">
                <div className="scroller" style={{paddingBottom: '52px'}}>
                    {
                        this.createList('all')
                    }
                    {
                        this.createList('rise')
                    }
                    {
                        this.createList('fall')
                    }
                    {dataEndXml}
                    {
                        !this.state.isLoad && !this.state.loadEnd ? <FooterLoading /> : ''
                    }
                </div>
            </div>
        );
    }
}

export default ProductList;