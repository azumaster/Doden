/**
 * 店铺商品的首页
 * Created by Doden on 2017.07.07
 */

import Level from './../components/home/level.jsx';
import Star from './../components/home/star.jsx';
import Detail from './../components/home/detail.jsx';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shop_id: 0,
            types: [],
            page: {
                page: 1,
                size: 10
            },
            // 样式状态
            tabFixed: false,
            good: false,
            // 当前数据
            currentTab: '全部商品',
            currentCategory: 0,
            currentCategoryX: 0,
            // 获取到的数据
            shopInfo: {},
            shopAppraise: {},
            categories: [],
            goodsList: []
        };
    }


    /**
     * 准备过程
     */

    componentWillMount(){
        if(H.urlParam('shopId')){
            this.setState({
                shop_id: H.urlParam('shopId')
            });
        }
    }

    componentDidMount(){
        this.changeTitle();
        this.createScroll();
        this.createTypeScroll();
        this.getData();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();

        if(this.state.currentTab == '全部商品'){
            this.createTypeScroll();
            this.state.caSCROLL.scrollTo(this.state.currentCategoryX, 0);
        }
    }

    createScroll(){
        var wrapper = document.getElementById('shopHome'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                click: true,
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: true
            });
        this.state.SCROLL = SCROLL;
        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
        SCROLL.on('scroll', () => {
            SCROLL.options.preventDefault = false;
            this.setState({tabFixed: false});

            if(-Math.round(SCROLL.y) >= 150){
                this.setState({tabFixed: true});
            }
        });
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;

            if(this.state.goodsList.length >= this.state.total) return;
            if(this.state.currentTab == '全部商品') {
                if((Math.round(SCROLL.y) - Math.round(SCROLL.maxScrollY) ) < 150) {
                    this.state.page.page++;
                    new Promise(()=>{this.getData();});
                }
            }
        });
    }

    createTypeScroll(){
        var caSCROLL = new IScroll(document.getElementById('shopCategory'), {
            zoom: true,
            scrollX: true,  //是不中可以横向滚动;
            scrollY: false,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            click:true,
            preventDefault: false
        });
        this.state.caSCROLL = caSCROLL;
        caSCROLL.on('beforeScrollStart', () => {
            caSCROLL.refresh();
        });
        caSCROLL.on('scrollEnd', () => {
            caSCROLL.options.preventDefault = false;
            this.setState({
                currentCategoryX: caSCROLL.x
            });
        });
    }

    /**
     * 获取信息
     */

    async getData(){
        H.loading.show();
        await new Promise(resolve => this.getShopInfo(resolve));
        await new Promise(resolve => this.getShopAppraise(resolve));
        await new Promise(resolve => this.getGoodsCategory(resolve));
        await new Promise(resolve => this.getShopGoods(resolve));
        H.loading.hide();
    }

    //获得店铺的基本信息
    getShopInfo(resolve){
        H.server.getShopInfo({shop_id: this.state.shop_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    shopInfo: res.data
                });
                resolve('ok');
            }else {
                H.toast(res.message);
            }
        });
    }

    // 获取店铺评价
    getShopAppraise(resolve){
        H.server.shopAppraise({shop_id: this.state.shop_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    shopAppraise: res.data
                });
            }else {
                H.toast(res.message);
            }
            resolve('ok');
        });
    }

    // 获取商品分类
    getGoodsCategory(resolve){
        let para = { shop_limit: this.state.shop_id };

        H.server.getGoodsCategory(JSON.stringify(para), (res)=>{
            if(res.code == 0){
                let categories = [];
                if(res.data.categories){
                    res.data.categories.map((c)=>{
                        if(c.series == 3){
                            categories.push(c);
                        }
                    });
                }
                this.setState({
                    categories: categories
                });
                resolve('ok');
            }else {
                H.toast(res.message);
            }
        });
    }

    // 获取商品列表
    getShopGoods(resolve){
        let page = this.state.page,
            para = {
                shop_limit: this.state.shop_id,
                page: page.page,
                size: page.size
            };

        if(this.state.types || this.state.types.length>0){
            para.type_ids = this.state.types;
        }

        this.state.isLoading = true;
        H.server.getMainGoodsList(JSON.stringify(para), (res)=>{
            if(res.code == 0){
                let goodsList = this.state.goodsList,
                    allTotal = this.state.allTotal;

                if(!para.type_ids || para.type_ids.length <=0){
                    allTotal = res.data.total;
                }

                if(res.data.goods){
                    res.data.goods.map((g)=>{
                        goodsList.push(g);
                    });

                    this.setState({
                        goodsList: goodsList,
                        total: res.data.total,
                        allTotal: allTotal
                    });
                }
            }else {
                H.toast(res.message);
            }
            resolve('ok');
        });
    }

    /**
     * 创建View
     */

    // 创建店铺信息
    createShopTitle(){
        let shopInfo = this.state.shopInfo,
            favorable = isNaN(Math.round(this.state.shopAppraise.favorable_rate*100))?0:Math.round(this.state.shopAppraise.favorable_rate*100);
        return(
            <div className="shop-title" id="shopTitle">
                <div className="title">
                    <div className="shop-head"><img src="https://www.lgstatic.com/thumbnail_300x300/i/image/M00/00/55/Cgp3O1ZB5vKAdkIRAAAVNuntsO4954.jpg"/></div>
                    <div className="shop-name"><p>{shopInfo.shop_name}</p><Level level={shopInfo.shop_rank}/></div>
                    <div className="shop-reception"><span className="precent">{favorable}%</span><span className="tip">好评</span></div>
                </div>
                <div className="shop-apprise">
                    <div className="apprise-star">
                        <p>发货速度<Star point={this.state.shopAppraise.delivery_speed} /></p>
                        <p>服务态度<Star point={this.state.shopAppraise.service_grade} /></p>
                    </div>
                    <div className="apprise-btn" onClick={this.toAppraise.bind(this)}>全部评价 <i className="icon right"></i></div>
                </div>
            </div>);
    }

    // 创建Tab切换
    createTab(fixed){
        return (<div className={'shop-tab '+(fixed?'fixed':'')}>
            <p className={this.state.currentTab=='全部商品'?'active':null} onClick={this.changeTab.bind(this)}>全部商品</p>
            <p className={this.state.currentTab=='店铺详情'?'active':null} onClick={this.changeTab.bind(this)}>店铺详情</p>
        </div>);
    }

    // 创建商品分类
    createCategory(){
        let btns = [];
        btns.push(<div key={0} onClick={this.changeCategory.bind(this)} data-id="0" className={'category-btn '+(this.state.currentCategory==0?'active':'')}><i data-id="0" className="icon all"></i>全部</div>);
        this.state.categories.map((c, i)=>{
            btns.push(<div key={i+1} onClick={this.changeCategory.bind(this)} data-id={c.id} className={'category-btn '+(this.state.currentCategory==c.id?'active':'')}>{c.sort_name}</div>);
        });
        return (<div id="shopCategory" className="shop-category">
            <div className="scroller">
                {btns}
            </div>
        </div>);
    }

    // 创建商品列表
    createGoods(){
        let category = '',
            categoryList = [],
            goodsList = [];

        categoryList.push(<div key={0} onClick={this.changeCategory.bind(this)} data-id="0" className={'category-btn '+(this.state.currentCategory==0?'active':'')}><i className="icon all"></i>全部</div>);
        this.state.categories.map((c, i)=>{
            if(c.id == this.state.currentCategory){
                category = c.sort_name;
            }else if(this.state.currentCategory == 0){
                category = '全部';
            }
            categoryList.push(<div key={i+1} onClick={this.changeCategory.bind(this)} data-id={c.id} className={'category-btn '+(this.state.currentCategory==c.id?'active':'')}>{c.sort_name}</div>);
        });

        if(categoryList.length >1){
            if(window.innerWidth >=350){
                if(categoryList.length % (3*Math.ceil(categoryList.length/3)-1) ==0){
                    categoryList.push(<div key={categoryList.length} style={{width: '97px', margin: '0 14px'}}></div>);
                }
            }else{
                if(categoryList.length%2 !=0){
                    categoryList.push(<div key={categoryList.length} style={{width: '97px', margin: '0 14px'}}></div>);
                }
            }
        }

        this.state.goodsList.map((good, index)=>{
            let ruleStr = '';
            good.price_rules.map((rule)=>{
                if(rule.rule_type == '减'){
                    ruleStr = '最高'+rule.rule_type+rule.max_preferential;
                }
            });

            goodsList.push(<div key={index} className="good-item" data-id={good.id} onClick={this.toGoods.bind(this)}>
                <div className="good-container" data-id={good.id}>
                    <div data-id={good.id} className={'good-img '+(ruleStr?'img-content':'')} data-content={ruleStr}>
                        <img data-id={good.id} src={H.getCdn()+good.pic+'@160w_100Q.jpg'} />
                        <p className="pv">浏览量：{good.visit_num}</p>
                    </div>
                    <h4 data-id={good.id}>{good.title}</h4>
                    <div data-id={good.id} className="good-info">
                        <p data-id={good.id}><em data-id={good.id} style={{fontWeight:'bold'}}>￥{good.price}</em></p>
                        <p data-id={good.id}>已售：{good.sell_num}</p>
                    </div>
                </div>
            </div>);
        });

        this.state.currentCa = category;
        this.state.categoryList = categoryList;

        return (<div className="shop-goods-list">
            <div className="goods-title">
                <div className="title-name">{category}</div>
            </div>

            <div className="goods-list">{goodsList}</div>
            {this.state.goodsList.length>=this.state.total? <div className="good-footer">没有更多啦~</div> : <div className="good-footer">加载中...</div>}
        </div>);
    }

    /**
     * 一些事件
     */

    // 切换Tab
    changeTab(e){
        let tab = e.target.innerHTML;

        if(tab == this.state.currentTab){
            return;
        }

        this.state.caSCROLL.destroy();

        this.setState({
            currentTab: tab,
            tabFixed: false
        });
    }

    // 切换分类
    changeCategory(e){
        let id = e.target.dataset.id,
            types = [];

        if(this.state.currentCategory == id) return;

        if(id!=0) types.push(id);
        this.setState({
            currentCategory: id,
            types: types,
            page: {page: 1, size:10},
            goodsList: []
        }, ()=>{
            this.getData();
        });
    }

    // 去往商品详情
    toGoods(e){
        let id = e.target.dataset.id;

        window.location.href = '#/goodsInfo/'+id;
        this.setState({
            good: true,
            tabFixed: false
        });
    }

    // 去往新的页面
    toAppraise(){
        window.location.href = '#/appraise/'+this.state.shop_id;
    }

    // 更改头部图片
    changeTitle(){
        let url = 'http://img.idongpin.com/Public/images/shopBg/'+parseInt(Math.random()*9+1)+'.png';
        document.getElementById('shopTitle').style.background = 'url("'+url+'") no-repeat';
    }

    render() {
        return(<div id="shopHome" className="shop-home">
            <div className="scroller">
                {this.createShopTitle()}
                {this.createTab()}
                {this.state.currentTab == '全部商品'?
                    <div className="all-goods">
                        {this.createCategory()}
                        {this.createGoods()}
                    </div> : <Detail shopInfo={this.state.shopInfo}/>}
            </div>
            {this.props.children}
            {this.state.tabFixed?this.createTab('fixed'):null}
        </div>);
    }
}

export default Home;