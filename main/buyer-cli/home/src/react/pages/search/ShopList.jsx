/*
* 搜索结果商品列表;
* */
import Promise from 'es6-promise';
import Level from '../../components/level/level.jsx';

class ShopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList: null,
            defaultParam: {
                page: 1,
                size: 20,
                area_id: this.props.areaId,
                search: this.props.keyWords
            },             //分页
            isLoading: false,  //防止多次加载
            pageStatus: 1, //1 是列表 2商品详情
            total: 0,
            carData: {},
            isShow: false
        };
        this.clickCallback = this.clickCallback.bind(this);
    }

    componentWillMount(){
        new Promise(() => {this.getShopSearchList();});
    }

    componentWillReceiveProps(nextProps) {
        let param = this.state.defaultParam,
            keyWords = nextProps.keyWords,
            area_id = nextProps.areaId;
        if(window.location.href.indexOf('goodsInfo') == -1){
            this.setState({
                pageStatus: 1
            });
        }
        if(param.search != keyWords || param.area_id != area_id) {
            param.search = keyWords;
            param.page = 1;
            param.area_id = area_id;
            this.getShopSearchList();
        }
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('shop_list_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scroll', () => {
            if(this.state.shopList.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                if(!this.state.isLoading){
                    this.state.defaultParam.page++;
                    new Promise(()=>{this.getShopSearchList();});
                }
            }
        });
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if(this.state.shopList.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                if(!this.state.isLoading){
                    this.state.defaultParam.page++;
                    new Promise(()=>{this.getShopSearchList();});
                }
            }
        });
    }

    //获得店铺的基本信息
    getShopSearchList(){
        let para = this.state.defaultParam;
        if(para.page == 1) {
            this.state.shopList = null;
        }
        H.we_loading.show();
        this.state.isLoading = true;
        H.server.getShopSearchList(para, (res)=>{
            if(res.code == 0){
                let shops = [];
                if(para.page == 1) this.state.shopList = [];

                if(this.props.type == 'more'){
                    res.data.shops.map((shop)=>{
                        if(parseInt(shop.goods_num)>3&&parseInt(shop.sell_num)>0){
                            shops.push(shop);
                        }
                    });
                }else {
                    shops = res.data.shops;
                }
                this.state.shopList = this.state.shopList.concat(shops);
                this.setState({
                    shopList: this.state.shopList,
                    total: res.data.total
                });
            }else {
                H.operationState(res.message);
            }
            this.state.isLoading = false;
            H.we_loading.hide();
        });
    }

    //创建店铺信息
    createShopList(){
        if(!this.state.shopList) return null;
        let shopList = this.state.shopList,
            shopListXML = [];
        shopList.map((shopInfo, index)=>{
            let shopPics = [],
                shopIndex = index;

            shopInfo.goods.map((good, index)=>{
                let ruleStr = '';
                good.price_rules.map((rule)=>{
                    if(rule.rule_type == '减'){
                        ruleStr = rule.rule_type + rule.max_preferential;
                    }
                });

                if(index<3){
                    shopPics.push(<div className={index==0?'cell-head':index==1?'cell-body':'cell-foot'} onClick={this.openGoodInfo.bind(this)}
                                       data-index={index} data-shop={shopIndex}>
                        <div className="goods-img-item" data-price={'￥'+good.price} data-index={index} data-shop={shopIndex}>
                            {ruleStr?<div className="reduce" data-index={index} data-shop={shopIndex}>最高{ruleStr}</div>:null}
                            <img src={H.localhost + good.pic + '@110w_90Q.jpg'} data-index={index} data-shop={shopIndex}/>
                        </div>
                    </div>);
                }

                if(shopInfo.goods.length == 2 && index == 1){
                    shopPics.push(<div className="cell-foot">
                        <div className="goods-img-item"></div>
                    </div>);
                }
                if(shopInfo.goods.length == 1 && index == 0){
                    shopPics.push(<div className="cell-body">
                        <div className="goods-img-item"></div>
                    </div>);
                    shopPics.push(<div className="cell-foot">
                        <div className="goods-img-item"></div>
                    </div>);
                }
            });

            shopListXML.push(
                <div className="cells-column" data-index={index}>
                    <div className="cell-row shop-info" onClick={this.clickCallback} data-index={index}>
                        <div className="cell-head">
                            <p>{shopInfo.name}</p>
                        </div>
                        <div className="cell-body">
                            <div className="cell-column">
                                <div className="cell-head">
                                    <p>{shopInfo.name}</p>
                                    <Level level={shopInfo.level} />
                                </div>
                                <div className="cell-body">
                                    <p>销量：{shopInfo.sell_num}件 共{shopInfo.goods_num}种商品</p>
                                </div>
                                <div className="cell-foot">
                                    {shopInfo.main_business?<p>主营：{shopInfo.main_business}</p>:null}
                                </div>
                            </div>
                        </div>
                        <div className="cell-foot">
                            &nbsp;{shopInfo.market_name}
                        </div>
                    </div>

                    {shopInfo.goods_num>1?
                        <div className="cell-row goods-img" style={(shopInfo.goods[1] && !shopInfo.goods[2]) || !shopInfo.goods[1] ? {float: 'left'} : null}>
                            {shopPics}
                        </div>:null
                    }
                </div>
            );
        });
        if(shopListXML.length <= 0) {
            shopListXML = (
                <div style={{marginTop: '30px'}}><img src={H.localhost + 'Public/images/buyer-cli/nothing.png'} width="100%"/></div>
            );
        }
        return shopListXML;
    }

    openGoodInfo(e) {
        let good = this.state.shopList[e.target.dataset.shop].goods[e.target.dataset.index];
        window.location.href = '#/goodsInfo';
        // this.state.goodsInfo = <GoodsInfo goodsId={good.id} carData={this.state.carData}/>;
        this.setState({
            pageStatus: 2
        });
        this.props.openGoodInfo && this.props.openGoodInfo(good);

        // window.location.href = '#/goodsInfo';
        // this.state.goodsInfo = <GoodsInfo goodsId={good.id} carData={this.state.carData}/>;
        // this.setState({
        //     pageStatus: 2
        // });
    }

    clickCallback(e){
        let target = e.target,
            parent =  e.currentTarget,
            operate = target.dataset.operate || parent.dataset.operate,
            index = parent.dataset.index || parent.dataset.operate,
            para = '';
        e.stopPropagation();
        para = this.state.shopList[index];

        if(!operate){
            window.location.href = '/index.php?m=PublicTemplate&c=ApiPublic&a=shopShow&shopId=' + para.id;
        }
    }

    shopLevel(level) {
        let xml = '';
        switch (level) {
            case 1:
                xml = (<span className="shop-level"><i className="low"></i></span>);
                break;
            case 2:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i></span>);
                break;
            case 3:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 4:
                xml = (<span className="shop-level"><i className="low"></i><i className="low"></i><i className="low"></i><i className="low"></i></span>);
                break;
            case 5:
                xml = (<span className="shop-level"><i className="middle"></i></span>);
                break;
            case 6:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 7:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 8:
                xml = (<span className="shop-level"><i className="middle"></i><i className="middle"></i><i className="middle"></i><i className="middle"></i></span>);
                break;
            case 9:
                xml = (<span className="shop-level"><i className="high"></i></span>);
                break;
            case 10:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i></span>);
                break;
            case 11:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
            case 12:
                xml = (<span className="shop-level"><i className="high"></i><i className="high"></i><i className="high"></i><i className="high"></i></span>);
                break;
        }
        return xml;
    }

    render() {
        return (
            <div id="shop_list_wrap" className="shop-list-wrap" style={this.props.type=='more'?{top:0}:null}>
                <div className="scroller">
                    {this.createShopList()}
                </div>
            </div>
        );
    }
}

export default ShopList;