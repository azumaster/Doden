import Index from './pages/index/Index.jsx';
import SearchEntry from './pages/search/SearchEntry.jsx';
import MoreShop from './pages/shop/more_shop.jsx';
import Nav from './components/nav/nav.jsx';
import GoodsInfo from './components/goods-info/goods-info.jsx';
import Promise from 'es6-promise';

class Main extends React.Component {
    constructor(props) {
        super(props);
        const hash = location.hash.substr(1);
        this.state = {
            route: hash,  //地址上的hash值;
            isLoadIndex: (hash.indexOf('/search') == -1) ? true : false,        //是否加载首页的数据，进入页面时如果有search字段，暂时不加载首页;
            goodsTypeData: [],   //商品分类的数据;
            goodInfo:null,
            userInfo: null,      //当前登录的这个用户的信息;
            areaId: 2,        //当前这个用户所在的区域ID或者更改后的区域ID;
            identity: null,        //身份 1老板  2买家  3访客,
            keyWords: H.hashParam('keyWords', hash),  //初次进来的关键词获取;
            identityData: [11, 12, 21, 22, 23, 24, 25, 26, 31, 100],
            typeId: H.urlParam('typeId', hash),        //第三级分类;如果分享的地址里带了typeId,需要进入到分类搜索页面;
            carData: {   //购物车数据;
                goods_count: 0
            },
            typeInfo: {     //当前三级分类
                name: H.hashParam('typeName', hash),   //获取地址栏中的商品分类Id;
                pic_url: H.hashParam('typeImg', hash)   //获取地址栏中的商品分类的图片;
            },
            searchWay: H.urlParam('searchWay', hash),   //是搜的店铺还是商品;
            is_seller: false,
            userShopType: null     //当前用户的店铺类型;
            /*11	一批商
            12	厂商
            21	二批商
            22	第三方
            23	配送公司
            24	终端
            25	餐厅
            26	商超零售
            31	司机
            100	直营*/
        };
        if(this.state.route.indexOf('&/goodsInfo') != -1) {
            window.location.href = '#' + this.state.route.replace('&/goodsInfo', '');
        }else if(this.state.route.indexOf('/search/results') != -1) {
            window.location.href = '#/search/results';
        }

        this.getSpecifiedList = this.getSpecifiedList.bind(this);
        this.getCarData = this.getCarData.bind(this);
        this.setLoadIndex = this.setLoadIndex.bind(this);
        this.setKeyWords = this.setKeyWords.bind(this);
        this.setTypeId = this.setTypeId.bind(this);
    }

    getChildContext() {
        return {
            goodsTypeData: this.state.goodsTypeData,
            getSpecifiedList: this.getSpecifiedList,
            route: this.state.route,
            userInfo: this.state.userInfo,
            areaId: this.state.areaId,
            identity: this.state.identity,
            is_seller: this.state.is_seller,
            userShopType: this.state.userShopType,
            getCarData: this.getCarData,
            keyWords: this.state.keyWords,
            setKeyWords: this.setKeyWords,
            typeId: this.state.typeId,
            setTypeId: this.setTypeId
        };
    }

    componentWillMount() {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        window.onhashchange = () => {   //监听浏览器地址栏变化;
            let hash = location.hash.substr(1);
            if(!this.state.isLoadIndex) {
                if(hash == '') {
                    this.state.isLoadIndex = true;
                }
            }
            H.sheet.hide();
            this.indexShare();

            if(hash === '/search') {
                this.state.searchWay = '';
            }
            this.setState({
                route: hash
            });
        };
        let promiseList = [
            new Promise((resolve) => {this.getInfo(resolve);}),
            new Promise((resolve) => {this.getCarData(resolve);})
        ];
        Promise.all(promiseList).then(() => {
            this.forceUpdate();
        });
    }

    //设置搜索和首页的分享内容;
    indexShare() {
        let hash = '',
            img = '',
            title = '最全的冻货商品库',
            desc = '我发现了一个最齐全的冻货商品库，推荐给你，快去看。';
        if(location.hash === ''){   //首页;
            hash = '';
        }else if(location.hash === '#/search') {   //搜索入口页;
            hash = '#/search';
        }else if(location.hash === '#/search/results') {   //搜索结果页;
            if(this.state.keyWords || this.state.keyWords == '') {
                hash = '#/search/results/&areaId='+this.state.areaId+'&searchWay='+this.state.searchWay+'&keyWords='+encodeURIComponent(this.state.keyWords);
                //#/search/results/&areaId=123&searchWay=goods&typeId=12&keyWords=4565;
            }else {
                hash = '#/search/results/&areaId='+this.state.areaId+'&searchWay='+this.state.searchWay+'&typeId='+
                    this.state.typeId+'&typeName='+encodeURIComponent(this.state.typeInfo.name)+'&typeImg='+encodeURIComponent(this.state.typeInfo.pic_url);
                img = H.localhost + (this.state.typeInfo.pic_url ? this.state.typeInfo.pic_url : 'Public/images/buyer-cli/default-img1.png');
                title = '找冻品网-'+this.state.typeInfo.name+'商品库';
                desc = '你要找的'+this.state.typeInfo.name+'都在这里，快来挑选吧';
            }
        }else {
            return;
        }
        H.share.changeShare({
            img: img,
            url: location.host + location.search + hash,
            title: title,
            desc: desc
        });
    }

    //获取当前用户信息;
    getInfo(resolve) {
        let visitor = '';
        var _hmt = _hmt || [];
        H.server.getInfo({}, (res) => {
            if(res.code == 0) {
                let shopInfo = res.data.shop_infos;
                if(shopInfo) {
                    this.state.userInfo = shopInfo;
                    this.state.areaId = shopInfo.area_id;
                    if(shopInfo.shop_type_number == 11 || shopInfo.shop_type_number == 12) {
                        this.state.identity = 1;
                        visitor = '商家';
                        this.state.is_seller = true;
                    }else {
                        this.state.identity =2;
                        visitor = '买家';
                    }
                    this.state.userShopType = shopInfo.shop_type_number;
                }else {
                    this.state.identity = 3;
                    visitor = '访客';
                }
                _hmt.push('_setCustomVar', 1, 'visitor', visitor, 1);
                resolve();
            }else {
                H.operationState(res.message);
            }
        });
    }

    //获取购物车数据;
    getCarData(resolve, state) {
        H.server.shopCartInfo({}, (res) => {
            if(res.code == 0) {
                this.state.carData = res.data;
            }else {
                H.operationState(res.message);
            }
            if(state) {
                this.forceUpdate();
            }
            resolve();
        });
    }

    //获取2,3级分类的树形结构;
    getSpecifiedList(bool) {
        if(bool) {
            H.we_loading.show();
        }
        H.server.getSpecifiedList({area_id: this.state.areaId}, (res) => {
            if(bool) {
                H.we_loading.hide();
            }
            if(res.code == 0) {
                this.setState({goodsTypeData: res.data});
            }else {
                H.operationState(res.message);
            }
        });
    }

    //在首页根据路由判断是否进入搜索入口页面;
    createPage() {
        let route = this.state.route;
        if(!this.state.identity) return;
        if(route.indexOf('/search') != -1) {
            return (<SearchEntry route={route} searchWay={this.state.searchWay} openGoodInfo={this.openGoodInfo.bind(this)}/>);
        } else if(route.indexOf('/more')!= -1){
            return (<MoreShop />);
        } else if(route.indexOf('/goodsInfo') != -1){
            return this.state.goodInfo?<GoodsInfo goodsId={this.state.goodInfo.id} carData={this.state.carData}/>:null;
        }
    }

    openGoodInfo(good){
        this.setState({
            goodInfo: good
        });
    }

    //设置关键词;
    setKeyWords(key, index) {
        if(index == 0) {
            this.state.searchWay = 'goods';
        }else if(index == 1) {
            this.state.searchWay = 'shop';
        }else {
            this.state.searchWay = '';
        }
        this.setState({keyWords: key, typeId: null}, this.indexShare);
    }

    //设置第三级分类Id;
    setTypeId(val) {
        this.setState({typeId: val.id, typeInfo: val, searchWay: 'goods'}, this.indexShare);
    }

    setAreaId(val) {
        this.setState({areaId: val});
    }

    setLoadIndex() {     //应该加载首页了;
        this.setState({isLoadIndex: true});
    }

    render() {
        return (
            <div>
                {
                    this.state.isLoadIndex ? <Index areaId={this.state.areaId} goodsTypeData={this.state.goodsTypeData} getSpecifiedList={this.getSpecifiedList} /> : null
                }

                {this.createPage()}
                {
                    this.state.identity ?
                        <Nav index='0' identity={this.state.identity} num={this.state.carData.goods_count > 0 ? {1: this.state.carData.goods_count} : null} /> : null
                }
            </div>
        );
    }
}

Main.childContextTypes = {
    goodsTypeData: React.PropTypes.array,
    getSpecifiedList: React.PropTypes.fn,
    route: React.PropTypes.string,
    userInfo: React.PropTypes.object,
    areaId: React.PropTypes.string,
    identity: React.PropTypes.string,
    is_seller: React.PropTypes.bool,
    userShopType: React.PropTypes.bool,
    getCarData: React.PropTypes.fn,
    keyWords: React.PropTypes.string,
    setKeyWords: React.PropTypes.fn,
    typeId: React.PropTypes.string,
    setTypeId: React.PropTypes.fn
};
export default Main;