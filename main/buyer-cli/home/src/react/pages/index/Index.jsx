import GoodsInfo from '../../components/goods-info/goods-info.jsx';
import HistoryBack from '../../components/HistoryBack.jsx';
import Promise from 'es6-promise';
/*
* 首页;
* @author: 魏华东 2017.02
* */
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPara: {
                area_id: this.props.areaId,
                page: 1,
                size: 20
            },
            ad:null,        // 广告
            recommendPage: 1, //推荐商品的页数
            focusImg: [],   //焦点图列表
            focusImgId:[],
            newGoodsList: [], //新上好货列表
            goodsList: [],  //好货列表
            shopList: [],    //优质店铺列表
            brandList: [],    // 品牌馆
            hotCategoryList:[], //热销分类
            pageStatus: 1,    //1 是列表 2商品详情
            carData: {},
            areaList: [],
            isLoading: false,
            hrefs: []
        };
        this.clickCallback = this.clickCallback.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    static defaultProps = {
        clientWidth: document.body.clientWidth
    };

    componentWillMount(){
        this.init();
    }

    init(){
        H.we_loading.show();

        /*固定只有四川区时不需要获取地址接口*/
        this.getNewGoods();
        new Promise((resolve)=>{
            let saveTime = window.localStorage.getItem('time');

            if(!saveTime){
                let time = new Date();
                time = time.getFullYear() + '-' + (parseInt(time.getMonth())+1) + '-' + time.getDate();
                this.getAd(resolve, time);
            } else {
                let time = new Date();
                time = time.getFullYear() + '-' + (parseInt(time.getMonth())+1) + '-' + time.getDate();
                if(saveTime == time){
                    resolve('ok');
                } else{
                    this.getAd(resolve, time);
                }
            }

        }).then(()=>{
            let promiseList = [
                new Promise((resolve)=>{
                    this.getHighQualitySupplier(resolve);
                }),
                new Promise((resolve)=>{
                    this.getRecommendGoods(resolve);
                }),
                new Promise((resolve)=>{
                    this.getBrandHouse(resolve);
                }),
                new Promise((resolve)=>{
                    this.getHotCategory(resolve);
                }),
                new Promise((resolve)=>{
                    this.getFocusImg(resolve);
                }).then(()=>{
                    if(this.state.focusImg.length>0){
                        this.fsImg('#focus_img');
                    }
                })
            ];
            Promise.all(promiseList).then(
                () => {

                    this.setState();
                    if(!this.props.goodsTypeData[0]){
                        this.props.getSpecifiedList();
                    }
                }
            ).then(()=>{
                H.we_loading.hide();
            });
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
        if(this.state.showRecommendGoods){
            var wrapper = document.getElementById('recommend_goods_page'),
                SCROLL = new IScroll(wrapper, {
                    zoom: true,
                    scrollX: false,  //是不中可以横向滚动;
                    scrollY: true,  //是否可以纵向滚动;
                    mouseWheel: true, //是否监听鼠标滚轮;
                    wheelAction: 'zoom',
                    probeType: 2,
                    preventDefault: false
                });
            this.state.GOODSSCROLL = SCROLL;
            this.state.GOODSSCROLL.refresh();
            SCROLL.on('scroll', () => {
                SCROLL.options.preventDefault = true;
                if(this.state.goodsList.length >= this.state.total) return;
                if(SCROLL.y < SCROLL.maxScrollY - 50){
                    if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                        if(!this.state.isLoading){
                            this.state.recommendPage++;
                            new Promise((resolve)=>{this.getRecommendGoods(resolve);});
                        }
                    }
                }
            });
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if(this.state.goodsList.length >= this.state.total) return;
                if(SCROLL.y < SCROLL.maxScrollY - 50){
                    if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                        if(!this.state.isLoading){
                            this.state.recommendPage++;
                            new Promise((resolve)=>{this.getRecommendGoods(resolve);});
                        }
                    }
                }
            });
        }
    }

    componentWillReceiveProps() {
        if(window.location.href.indexOf('goodsInfo') == -1){
            this.setState({
                pageStatus: 1
            });
        }
        if(window.location.href.indexOf('RecommendGoodsListPage') == -1){
            this.setState({
                showRecommendGoods: false
            });
        }
    }

    createScroll(){
        var wrapper = document.getElementById('home_page_wrap'),
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
    }

    getAreaList(resolve){
        if(this.state.defaultPara.area_id){
            resolve();
            return;
        }
        H.server.customArea(null, (res) =>{
            if(res.code == 0){
                this.state.areaList = res.data;
                this.state.defaultPara.area_id = res.data[0].area_id;
                resolve();
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得焦点图
    getFocusImg(resolve){
        H.server.getIndexBannerList({area_id: this.state.defaultPara.area_id}, (res) =>{
            if(res.code == 0){
                res.data = res.data.reverse();
                if(res.data.length > 0){
                    res.data.map((img)=>{
                        this.state.focusImgId.push(img.banner_id);
                        this.state.hrefs.push(img.link_url);
                        this.state.focusImg.push(img.cover_pic);
                    });
                }
                this.setState();
                resolve('OK');
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得新上好货
    getNewGoods(){
        H.server.getNewGoods({area_id: this.state.defaultPara.area_id}, (res) =>{
            if(res.code == 0){
                this.state.newGoodsList = res.data.goods;
                this.setState();
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得推荐好货
    getRecommendGoods(resolve){
        let defaultPara = this.state.defaultPara;
        this.state.isLoading = true;
        H.server.recommendGoods({
            area_id: defaultPara.area_id,
            page: this.state.recommendPage,
            size: defaultPara.size
        }, (res) =>{
            if(res.code == 0){
                this.state.goodsList  = this.state.goodsList.concat(res.data.goods);
                this.state.total = res.data.total;

                this.setState({
                    goodsList: this.state.goodsList,
                    total: this.state.total
                }, ()=>{
                    this.state.isLoading = false;
                    resolve('成功');
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得推荐供应商
    getHighQualitySupplier(resolve){
        H.server.highQualitySuppliers({area_id: this.state.defaultPara.area_id}, (res) =>{
            if(res.code == 0){
                let shops = [];
                res.data.shops.map((shop)=>{
                    shops[shop.position-1] = shop;
                });

                this.setState({
                    shopList: shops
                }, ()=>{resolve('成功');});

            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得品牌馆
    getBrandHouse(resolve) {
        H.server.brandHouse({area_id: this.state.defaultPara.area_id}, (res)=>{
            if(res.code == 0) {
                let brands = [];
                res.data.map((brand)=>{
                    brands[brand.position-1] = brand;
                });

                this.setState({
                    brandList: brands
                }, ()=>{resolve('成功');});
            } else {
                H.operationState(res.message);
            }
        });
    }

    //获得热销分类
    getHotCategory(resolve) {
        H.server.hotCategory({area_id: this.state.defaultPara.area_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    hotCategoryList: res.data
                }, ()=>{resolve('成功');});
            } else {
                H.operationState(res.message);
            }
        });
    }

    //获得AD
    getAd(resolve, time) {
        H.server.get_index_ad({area_id: this.state.defaultPara.area_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    ad: res.data.ads
                }, ()=> {
                    window.localStorage.setItem('time', time);
                    resolve('成功');
                });
            } else {
                H.operationState(res.message);
            }
        });
    }

    //创建大区列表
    createAreaList(){
        //let options = [],
        //    width;
        //this.state.areaList.map((area)=>{
        //    if(area.area_id == this.state.defaultPara.area_id){
        //        width = area.area_name.length;
        //    }
        //    options.push(<option value={area.area_id}>{area.area_name}</option>);
        //});
        //return(
        //    <div className="area-list">
        //        <select className="select-list" onChange={this.onChange} style={{width: (width * 14 + 3) + 'px'}}>
        //            {options}
        //        </select>
        //        <span className="down-arrow"></span>
        //    </div>
        //);
        return(
            <div className="area-list">
                <span className="select-list">四川</span>
            </div>
        );
    }

    //创建焦点图
    createFocusImg(){
        let images = [];
        this.state.focusImg.map((img, index)=>{
            let link = this.state.hrefs[index],
                suffix = link.split('.');
            suffix = suffix[suffix.length-1];

            if(/jpg|jpeg|png|gif|bmp/.test(suffix)){
                link = 'http://img.idongpin.com/'+link;
            } else {
                if(/^http:|^https:/.test(link)){

                } else {
                    if(link.indexOf('http://') == -1){
                        link = 'http://'+link;
                    }
                }
            }

            images.push(
                <li>
                    <a href="javascript:;" onClick={this.toBannerPage.bind(this)}><img data-link={link} data-id={this.state.focusImgId[index]} src={H.localhost + img + H.imgSize()[960]} data-index={index}/></a>
                </li>
            );
        });

        if(images.length>0){
            return (
                <ul className="fs-img">
                    {images}
                </ul>
            );
        }else {
            return null;
        }
    }

    //创建指示器
    createPointer(){
        let num = this.state.focusImg.length,
            pointer = new Array(num);
        for(let i = 0; i<num; i++){
            pointer[i] = (
                <span style={this.state.currentPic == i ? {color: '#999'} : null}>{null}</span>
            );
        }
        return (
            <p className="pointer">{pointer}</p>
        );
    }

    //创建头部
    createTitle(symbol){
        let title,
            titleInfo = {};

        switch (symbol){
            case 'category':
                titleInfo.img = 'Public/images/buyer-cli/hotCategory.png';
                titleInfo.link = '分类大全';
                titleInfo.aLink = '#/search';
                break;
            case 'brand':
                titleInfo.img = 'Public/images/buyer-cli/brandRoom.png';
                break;
            case 'shop':
                titleInfo.img = 'Public/images/buyer-cli/shopSet.png';
                // titleInfo.link = '12000家服务店铺';
                // titleInfo.aLink = '#/more';
                titleInfo.des = '好店铺好服务';
                break;
            case 'goods':
                titleInfo.img = 'Public/images/buyer-cli/goodGoods.png';
                titleInfo.des = '好货不容错过';
                break;
        }

        title = (<div className="title-content">
            <div className="title-logo"><img src={H.localhost+titleInfo.img}/>{titleInfo.des?<span>{titleInfo.des}</span>:null}</div>
            {titleInfo.link?<div className="title-link"><a href={titleInfo.aLink?titleInfo.aLink:'#'}>{titleInfo.link}</a></div>:null}
        </div>);

        return title;
    }

    //创建热销分类页
    createHotCategory() {
        let categoryList = [];

        this.state.hotCategoryList.map((hotCategory, index)=>{
            categoryList.push(
                <div className="index-category-item" data-index={index} data-type="HC" data-operate="toHotCategory" onClick={this.clickCallback}>
                    <div className="category-img">
                        <img src={H.localhost+hotCategory.image+H.imgSize()[110]}/>
                        <p>{hotCategory.sort_name}</p>
                    </div>
                </div>
            );
        });

        return categoryList;
    }

    // 创建品牌馆页
    createBrandRoom(){
        let brandRoom,
            brandImg = [];

        this.state.brandList.map((brand)=>{
            brandImg[brand.position-1] = brand.image;
        });
        brandRoom = (brandImg.length>0?
            <div className="index-brand-room">
                <div className="brand-img brand-img-big">
                    <img src={H.localhost+brandImg[0]}/>
                </div>
                <div className="brand-img brand-img-group">
                    <div className="brand-img-middle">
                        <img src={H.localhost+brandImg[1]}/>
                    </div>
                    <div className="brand-img-down">
                        <div className="brand-img-small">
                            <img src={H.localhost+brandImg[2]}/>
                        </div>
                        <div className="brand-img-small">
                            <img src={H.localhost+brandImg[3]}/>
                        </div>
                    </div>
                </div>
            </div>:null
        );

        return brandRoom;
    }

    // 创建店铺集页面
    createShopSet() {
        let shopSet,
            shopList = [];

        this.state.shopList.map((shopImg)=>{
            shopList[shopImg.position-1] = shopImg.image;
        });

        shopSet = (shopList.length>0?<div className="index-shop-set">
            <div className="shop-set-big">
                {shopList[0]?<img src={H.localhost+shopList[0]} data-index="0" data-type="HQShop" data-operate="toShopPage" onClick={this.clickCallback} />
                :null}
            </div>
            <div className="shop-set-group">
                {shopList[1]?<img src={H.localhost+shopList[1]} data-index="1" data-type="HQShop" data-operate="toShopPage" onClick={this.clickCallback}/>
                :null}
                {shopList[2]?<img src={H.localhost+shopList[2]} data-index="2" data-type="HQShop" data-operate="toShopPage" onClick={this.clickCallback}/>
                :null}
            </div>
        </div>:null);

        return shopSet;
    }

    // 创建推荐好货页
    createGoodGoods() {
        let goodGoods = [];

        this.state.goodsList.map((good, index)=>{
            let ruleStr = '';

            if(good.price_rules){
                good.price_rules.map((rule)=>{
                    if(rule.rule_type == '减'){
                        ruleStr = rule.rule_type + rule.max_preferential;
                    }
                });
            }

            goodGoods.push(
                <div className="good-goods-item" data-index={index} data-type="goodGoods" data-operate="toGoods" onClick={this.clickCallback}>
                    <div className="good-goods-img">
                        {ruleStr?<div className="rule">最高{ruleStr}</div>:null}
                        <img src={H.localhost+good.image+H.imgSize()[150]}/>
                    </div>
                    <div className="good-goods-des">
                        <p>{good.goods_name}</p>
                        <div className="index-price">
                            <span className="price-money">￥{good.price}</span><span className="price-num">已售{good.sell_num}</span>
                        </div>
                    </div>
                </div>
            );
        });

        if(window.innerWidth > 350){
            if((this.state.goodsList.length - 3*parseInt(this.state.goodsList.length/3)) - 2 == 0){

                goodGoods.push(<div className="good-goods-item" data-index={this.state.goodsList.length}></div>);
            }
        }

        return (<div className="index-good-goods">
            {goodGoods}
        </div>);
    }

    //事件适配器
    clickCallback(e) {
        let parent = e.currentTarget,
            dataset = parent.dataset,
            operate = dataset.operate,
            index = dataset.index,
            type = dataset.type,
            para = '';

        switch (type){
            case 'newGoods':
                para = this.state.newGoodsList[index].goods_id;
                break;
            case 'recommendGoods':
                para = this.state.goodsList[index].goods_id;
                break;
            case 'HQShop':
                para = this.state.shopList[index];
                break;
            case 'HC':
                para = this.state.hotCategoryList[index].id;
                break;
            case 'goodGoods':
                para = this.state.goodsList[index];
                break;
        }
        this[operate](para);
    }

    onChange(e){
        this.state.defaultPara.area_id = e.currentTarget.value;
        this.state.goodsList = [];
        this.state.focusImg = [];
        this.state.recommendPage = 1;
        this.init();
    }

    //下面都是页面的跳转
    toNewGoodsPage(para){
        window.location.href = '#/goodsInfo';
        this.state.goodsInfo = <GoodsInfo goodsId={para} carData={this.state.carData}/>;
        this.setState({
            pageStatus: 2
        });
    }

    toRecommendGoodsPage(para){
        window.location.href = '#/goodsInfo';
        this.state.goodsInfo = <GoodsInfo goodsId={para} carData={this.state.carData}/>;
        this.setState({
            pageStatus: 2
        });
    }

    toShopPage(para){
        H.server.clickTotal({source: 'high_quality_suppliers', id: para.id}, (res)=>{
            if(res.code == 0) {
                window.location.href = '/index.php?m=PublicTemplate&c=ApiPublic&a=shopShow&shopId=' + para.shop_id;
            } else {
                H.operationState(res.message);
            }
        });
    }

    toRecommendGoodsList(){
        let goodsXML = [];
        this.state.goodsList.map((goods, index)=>{
            goodsXML.push(
                <div className="cell-row index-goods-item" data-index={index} data-type="recommendGoods" data-operate="toRecommendGoodsPage" onClick={this.clickCallback}>
                    <div className="cell-head">
                        <img src={H.localhost + goods.image + H.imgSize()[110]} />
                    </div>
                    <div className="cell-body">
                        <div className="cell-column">
                            <div className="cell-head">
                                <span>{goods.brand}</span>&nbsp;&nbsp;{goods.goods_name}
                            </div>
                            <div className="cell-body">
                                ￥<span style={{color: '#cc3a3a', fontSize: '16px'}}>{goods.price}</span><span style={{fontSize: '14px'}}>{goods.unit}</span>
                            </div>
                            <div className="cell-foot">
                                {goods.spec}&nbsp;&nbsp;
                            </div>
                        </div>
                    </div>
                    <div className="cell-foot">
                        已售{goods.sell_num}
                    </div>
                </div>
            );
        });

        this.state.recommendGoodsPage = (
            <div>
                <HistoryBack />
                <p className="nav">
                    &nbsp;&nbsp;推荐好货&nbsp;&nbsp;
                </p>
                <div id="recommend_goods_page">
                    <div className="scroller">
                        <div className="recommend-goods cells-column">
                            {goodsXML}
                        </div>
                    </div>
                </div>
            </div>

        );

        window.location.href = '#RecommendGoodsListPage';
        this.setState({
            showRecommendGoods: true
        });
    }

    toSearchPage(){
        window.location.href = '#/search';
    }

    toHotCategory(para) {
        window.location.href = '#/search?id='+para;
    }

    toGoods(para){
        if(para.id == 0){
            window.location.href = '#/goodsInfo';
            this.state.goodsInfo = <GoodsInfo goodsId={para.goods_id} carData={this.state.carData}/>;
            this.setState({
                pageStatus: 2
            });
        } else {
            H.server.clickTotal({source: 'recommend_goods', id: para.id}, (res)=>{
                if(res.code == 0) {
                    window.location.href = '#/goodsInfo';
                    this.state.goodsInfo = <GoodsInfo goodsId={para.goods_id} carData={this.state.carData}/>;
                    this.setState({
                        pageStatus: 2
                    });
                } else {
                    H.operationState(res.message);
                }
            });
        }
    }

    toShopGoods(good) {
        window.location.href = '#/goodsInfo';
        this.state.goodsInfo = <GoodsInfo goodsId={good.id} carData={this.state.carData}/>;
        this.setState({
            pageStatus: 2
        });
    }

    toBannerPage(e){
        let link = e.target.dataset.link,
            id = e.target.dataset.id;

        if(id<0){
            window.location.href = link;
        }else{
            H.server.clickTotal({source:'banner', id: id}, (res)=>{
                if(res.code == 0) {
                    window.location.href = link;
                } else {
                    H.operationState(res.message);
                }
            });
        }

    }

    //轮播图
    fsImg(id){
        let container = document.querySelector(id),
            pics = container.querySelectorAll('li');
        if(pics.length == 1){
            return;
        }
        let pointer = document.querySelector('.pointer'),
            pointers = pointer.querySelectorAll('span'),
            width = container.offsetWidth,
            startX, index, moveOffset, next,
            len = pics.length - 1, startPic = len, currentPointer;

        let autoPlayTime = setInterval(autoPlay, 2000);
        for(let i = 0; i <= len - 1; i++) {
            pics[i].style.zIndex = 0;
        }

        currentPointer = Math.abs(startPic - len);
        $(pointers[currentPointer]).css({
            opacity: 1,
            width: '6px',
            height: '6px',
            borderRadius: '6px'
        });
        container.addEventListener('touchstart', touchStart, false);
        container.addEventListener('touchmove', touchMove, false);
        container.addEventListener('touchend', touchEnd, false);
        container.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        function touchStart(e){
            e.stopPropagation();
            index = Number(e.target.dataset.index);
            startX = e.targetTouches[0].clientX;
            clearInterval(autoPlayTime);
            for(let i = 0; i <= len; i++) {
                pics[i].style.webkitTransition = 'all ' + 0 + 'ms ease';
            }
        }

        function touchMove(e){
            e.stopPropagation();
            index = Number(e.target.dataset.index);
            if(isNaN(index)){
                return;
            }
            moveOffset = e.targetTouches[0].clientX - startX;
            pics[index].style.webkitTransform = 'translate3d(' + moveOffset + 'px, 0px, 0px)';
            if(moveOffset < 0 ){
                if(index == 0){
                    next = len;
                    pics[len].style.zIndex = 1;
                    pics[len].style.webkitTransform = 'translate3d(' + (width + moveOffset) + 'px, 0px, 0px)';
                }else {
                    next = index - 1;
                    pics[index - 1].style.zIndex = 1;
                    pics[index - 1].style.webkitTransform ='translate3d(' + (width + moveOffset) + 'px, 0px, 0px)';
                }
            }else {
                if(index == len){
                    next = 0;
                    pics[0].style.zIndex = 1;
                    pics[0].style.webkitTransform = 'translate3d(' + (-width + moveOffset) + 'px, 0px, 0px)';
                }else{
                    next = index + 1;
                    pics[index + 1].style.zIndex = 1;
                    pics[index + 1].style.webkitTransform = 'translate3d(' + (-width + moveOffset) + 'px, 0px, 0px)';
                }
            }
        }

        //结束的效果
        function touchEnd(e){
            e.stopPropagation();
            if(isNaN(index) || !moveOffset){
                return;
            }
            if(Math.abs(moveOffset) < 50){
                if(moveOffset < 0){
                    pics[index].style.webkitTransform = 'translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[next].style.zIndex = 0;
                    pics[next].style.webkitTransform = 'translate3d(' + (width) + 'px, 0px, 0px)';
                    pics[next].style.webkitTransition = 'all ' + 300 + 'ms ease';
                }else{
                    pics[index].style.webkitTransform = 'translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[next].style.zIndex = 0;
                    pics[next].style.webkitTransform = 'translate3d(' + (-width) + 'px, 0px, 0px)';
                    pics[next].style.webkitTransition = 'all ' + 300 + 'ms ease';
                }
            }else if(moveOffset < 0){
                if(index == 0){
                    pics[index].style.zIndex = 0;
                    pics[index].style.webkitTransform = 'translate3d(' + (-width) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[len].style.zIndex = 1;
                    pics[len].style.webkitTransform ='translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[len].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    startPic = len;
                    $(pointers[currentPointer]).css({
                        opacity: 0.7,
                        width: '5px',
                        height: '5px',
                        borderRadius: '5px'
                    });
                    currentPointer =  Math.abs(startPic - len);
                    $(pointers[currentPointer]).css({
                        opacity: 1,
                        width: '6px',
                        height: '6px',
                        borderRadius: '6px'
                    });
                }else{
                    pics[index].style.zIndex = 0;
                    pics[index].style.webkitTransform = 'translate3d(' + (-width) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[index - 1].style.zIndex = 1;
                    pics[index - 1].style.webkitTransform ='translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[index - 1].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    startPic = index - 1;
                    $(pointers[currentPointer]).css({
                        opacity: 0.7,
                        width: '5px',
                        height: '5px',
                        borderRadius: '5px'
                    });
                    currentPointer =  Math.abs(startPic - len);
                    $(pointers[currentPointer]).css({
                        opacity: 1,
                        width: '6px',
                        height: '6px',
                        borderRadius: '6px'
                    });
                }
            }else{
                if(index  == len){
                    pics[index].style.zIndex = 0;
                    pics[index].style.webkitTransform = 'translate3d(' + (width) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[0].style.zIndex = 1;
                    pics[0].style.webkitTransform = 'translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[0].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    startPic = 0;
                    $(pointers[currentPointer]).css({
                        opacity: 0.7,
                        width: '5px',
                        height: '5px',
                        borderRadius: '5px'
                    });
                    currentPointer =  Math.abs(startPic - len);
                    $(pointers[currentPointer]).css({
                        opacity: 1,
                        width: '6px',
                        height: '6px',
                        borderRadius: '6px'
                    });
                }else{
                    pics[index].style.zIndex = 0;
                    pics[index].style.webkitTransform = 'translate3d(' + (width) + 'px, 0px, 0px)';
                    pics[index].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    pics[index + 1].style.zIndex = 1;
                    pics[index + 1].style.webkitTransform = 'translate3d(' + (0) + 'px, 0px, 0px)';
                    pics[index + 1].style.webkitTransition = 'all ' + 300 + 'ms ease';
                    startPic = index + 1;
                    $(pointers[currentPointer]).css({
                        opacity: 0.7,
                        width: '5px',
                        height: '5px',
                        borderRadius: '5px'
                    });
                    currentPointer =  Math.abs(startPic - len);
                    $(pointers[currentPointer]).css({
                        opacity: 1,
                        width: '6px',
                        height: '6px',
                        borderRadius: '6px'
                    });
                }
            }
            moveOffset = 0;
            autoPlayTime = setInterval(autoPlay, 5000);
        }

        //轮播
        function autoPlay(){
            //let refresh;
            for(let i = 0; i <= len; i++) {
                pics[i].style.webkitTransition = 'all ' + 0 + 'ms ease';
            }
            pics[startPic].style.webkitTransform = 'translate3d(' + (-width) + 'px, 0px, 0px)';
            pics[startPic].style.webkitTransition = 'all ' + 300 + 'ms ease';
            if(startPic == 0){
                pics[len].style.webkitTransform = 'translate3d(' + (width) + 'px, 0px, 0px)';
                container.offsetWidth;
                pics[len].style.zIndex = 1;
                pics[startPic].style.zIndex = 0;
                pics[len].style.webkitTransform = 'translate3d(' + (0) + 'px, 0px, 0px)';
                pics[len].style.webkitTransition = 'all ' + 300 + 'ms ease';
                startPic = len;
                $(pointers[currentPointer]).css({
                    opacity: 0.7,
                    width: '5px',
                    height: '5px',
                    borderRadius: '5px'
                });
                currentPointer =  Math.abs(startPic - len);
                $(pointers[currentPointer]).css({
                    opacity: 1,
                    width: '6px',
                    height: '6px',
                    borderRadius: '6px'
                });
            }else {
                pics[startPic - 1].style.webkitTransform = 'translate3d(' + (width) + 'px, 0px, 0px)';
                container.offsetWidth;
                pics[startPic - 1].style.zIndex = 1;
                pics[startPic].style.zIndex = 0;
                pics[startPic - 1].style.webkitTransform ='translate3d(' + (0) + 'px, 0px, 0px)';
                pics[startPic - 1].style.webkitTransition = 'all ' + 300 + 'ms ease';
                startPic = startPic - 1;
                $(pointers[currentPointer]).css({
                    opacity: 0.7,
                    width: '5px',
                    height: '5px',
                    borderRadius: '5px'
                });
                currentPointer =  Math.abs(startPic - len);
                $(pointers[currentPointer]).css({
                    opacity: 1,
                    width: '6px',
                    height: '6px',
                    borderRadius: '6px'
                });
            }
        }
    }

    // 创建广告
    createAd() {
        let time = this.state.ad.time,
            allTime = time,
            _this = this;

        setTimeout(()=>{
            let oImg = document.getElementById('pupAd'),
                suffix = '.'+_this.state.ad.image.split('.')[1];
            oImg.onload = function () {
                let adInterval = setInterval(()=>{
                    allTime --;
                    $('#adTime').html(allTime);
                    if(allTime<0){
                        clearInterval(adInterval);
                        _this.setState({
                            ad: null
                        });
                    }
                }, 1000);
            };
            oImg.src = H.localhost+_this.state.ad.image+'@'+brWidth+'w_100Q'+suffix;

        }, 100);

        return (
            <div className="ad">
                <img id="pupAd" onClick={this.openAd.bind(this)}/>
                <p onClick={()=>{this.setState({ad: null});}}><span id="adTime">{allTime}</span> 跳过广告</p>
            </div>
        );
    }

    openAd(){
        if(this.state.ad.ads_url){
            let link = this.state.ad.ads_url,
                suffix = link.split('.');
            suffix = suffix[suffix.length-1];

            if(/jpg|jpeg|png|gif|bmp/.test(suffix)){
                link = 'http://img.idongpin.com/'+link;
            } else {
                if(/^http:|^https:/.test(link)){

                } else {
                    if(link.indexOf('http://') == -1){
                        link = 'http://'+link;
                    }
                }
            }

            H.server.clickTotal({source: 'popup_ads', id: this.state.ad.id}, (res)=>{
                if(res.code == 0) {
                    window.location.href = link;
                } else {
                    H.operationState(res.message);
                }
            });
        } else {
            return;
        }
    }

    render() {
        return (
            <div className="home-page">
                <div className="flex-box center search-bar">
                    {this.createAreaList()}
                    <div className="flex-num1" data-operate="toSearchPage" onClick={this.clickCallback}>
                        <div className="flex-box center search-content">
                            <i className="search-icon"></i>
                            &nbsp;&nbsp;请输入商品、店铺名
                        </div>
                    </div>
                </div>
                <div id="home_page_wrap" className="home-page-wrap">
                    <div className="scroller">
                        {this.state.focusImg.length>0?<div id="focus_img" className="focus-img">
                            {this.createFocusImg()}
                            {this.state.focusImg.length > 1 ? this.createPointer() : null}
                            </div>:null}
                        <div className="cells-column hot-category">
                            <div className="index-title">
                                {this.createTitle('category')}
                            </div>
                            <div className="cells-row">
                                <div className="index-hot-category">
                                    {this.createHotCategory()}
                                </div>
                            </div>
                        </div>

                        <div className="cells-column brand-room">
                            <div className="index-title">
                                {this.createTitle('brand')}
                            </div>
                            <div className="cells-row">
                                {this.createBrandRoom()}
                            </div>
                        </div>

                        <div className="cell-column shop-set">
                            <div className="index-title">
                                {this.createTitle('shop')}
                            </div>
                            <div className="cells-row">
                                {this.createShopSet()}
                            </div>
                        </div>

                        <div className="cell-column good-goods">
                            <div className="index-title">
                                {this.createTitle('goods')}
                            </div>
                            <div className="cell-row">
                                {this.createGoodGoods()}
                            </div>
                        </div>

                        <p className="index-foot">没有更多啦</p>
                    </div>
                </div>
                {this.state.pageStatus == 1 ? null : this.state.goodsInfo}
                {this.state.showRecommendGoods ? this.state.recommendGoodsPage : null}
                {this.state.ad?this.state.ad.image?this.createAd():null:null}
            </div>
        );
    }
}

export default Index;