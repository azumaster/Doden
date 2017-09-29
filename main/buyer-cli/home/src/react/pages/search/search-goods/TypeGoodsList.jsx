import Filter from './Filter.jsx';
import TypesFilter from './Types.jsx';
import Sort from './Sort.jsx';
import GoodsInfo from '../../../components/goods-info/goods-info.jsx';
import GoodsItem from '../../../components/GoodsItem.jsx';
//import Promise from 'es6-promise';
/*
* 根据3级分类搜索结果的商品列表;
* */

class TypeGoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultParam: {              //搜索商品提交的参数;
                page: 1,
                size: 20,
                area_id: this.props.areaId,           //大区ID
                search: null,            //搜索词
                type_ids: [this.props.typeId],          //类型ID数组
                brand_ids: null,         //品牌ID数组
                xinghaos: null,          //型号文字数组
                halal: null,             //是否清真, 不传则不筛选此项
                market_ids: null,        //市场ID数组
                order: {0: 0, 1: true},         //排序
                typesData: null,             //当前三级分类下面的所有四级分类;
                typesId: null                //当前被选中的四级分类ID;
            },
            goodsList: [],
            isLoading: false,  //防止多次加载
            pageStatus: 1, //1 是列表 2商品详情
            total: 0,
            isFilterShow: false,         //是否进行筛选;
            //childTypeId: H.urlParam('typeId', hash) ? [H.urlParam('typeId', hash)] : null,    //从地址中获取的第三级typeId
            filterArr: ['brands', 'halal', 'markets'],               //筛选接口中的需要的数据字段名;
            isGetData: true              //是否需要重新摘取筛选的数据;
        };
        this.clickCallback = this.clickCallback.bind(this);
        this.getGoodsData = this.getGoodsData.bind(this);
        this.initData = this.initData.bind(this);
        this.getTypesData = this.getTypesData.bind(this);
    }

    componentWillMount() {
        this.getTypesData();
        //let promiseList = [
        //    new Promise((resolve) => {this.getTypesData(resolve);}),
        //    new Promise((resolve) => {this.getGoodsData(resolve);})
        //];
        //Promise.all(promiseList).then(() => {
        //    this.createGoodsList();
        //});
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    //初始化请求参数，如：设置了第四级分类的时候;
    initData(typeId) {
        this.state.defaultParam =  {              //搜索商品提交的参数;
            page: 1,
                size: 20,
                area_id: this.props.areaId,           //大区ID
                search: null,            //搜索词
                type_ids: typeId ? [typeId] : [this.props.typeId],          //类型ID数组
                brand_ids: null,         //品牌ID数组
                xinghaos: null,          //型号文字数组
                halal: null,             //是否清真, 不传则不筛选此项
                market_ids: null,        //市场ID数组
                order: {0: 0, 1: true}         //排序
        };
    }

    //如果点击了3级分类进来的，地址上会有一个typeId;获取当前3级分类下面的4级分类;
    getTypesData() {
        let param = {
            area_id: this.state.defaultParam.area_id,
            type_ids: this.state.defaultParam.type_ids,
            select: ['categories']
        };
        H.we_loading.show();
        H.server.getGoodsFilter(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                let arr = res.data.categories,
                    newArr = [];
                for(let i = 0 ; i < arr.length ; i++) {
                    if(arr[i].series == 4) {
                        newArr.push(arr[i]);
                    }
                }
                this.state.typesData = newArr;
                if(newArr.length == 1) {
                    this.state.typesId = newArr[0].id;
                    this.state.defaultParam.type_ids = [newArr[0].id];
                    this.state.filterArr = ['brands', 'xinghaos', 'halal', 'markets'];
                }
                this.getGoodsData();
            }else {
                H.operationState(res.message);
            }
        });
    }

    //接收筛选的值并进行筛选;
    saveFilter(val) {
        let defaultParam = $.extend(this.state.defaultParam, val);
        defaultParam.page = 1;
        this.state.isGetData = false;
        this.state.isFilterShow = false;
        this.setState({
            defaultParam: defaultParam
        }, () => {
            this.getGoodsData();
        });
    }

    refreshSort(val) {
        let defaultParam = this.state.defaultParam;
        if(val == 0 || val == 1 || val == 2 || val == 3) {
            defaultParam.page = 1;
            this.getGoodsData();
        }else if(val == 4) {   //点击排序栏中筛选时;
            this.state.isFilterShow = true;
            this.forceUpdate();
        }else if(val == 5) {
            this.state.isGetData = false;
            this.state.isFilterShow = false;
            this.forceUpdate();
        }
    }

    //获得商品列表
    getGoodsData(){
        let para = this.state.defaultParam;
        if(para.page == 1) {
            if(this.state.goodsList.length > 0) {
                this.state.SCROLL.scrollTo(0, 0);
                this.state.goodsList = [];
            }
        }
        H.we_loading.show();
        this.state.isLoading = true;
        H.server.searchGoodsList(JSON.stringify(para), (res)=>{
            if(res.code == 0){
                this.state.total = res.data.total;
                this.state.goodsList = this.state.goodsList.concat(res.data.goods);
                //if(resolve){resolve(res.data);}
            }else {
                H.operationState(res.message);
            }
            if(this.state.isLoading){
                this.createGoodsList();
            }
            this.state.isLoading = false;
            H.we_loading.hide();
        });
    }

    createScroll(){
        var wrapper = document.getElementById('goods_list_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;$('#keyWordsVal')[0].blur();});
        SCROLL.on('scroll', () => {
            if(this.state.goodsList.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                if(!this.state.isLoading){
                    this.state.defaultParam.page++;
                    this.getGoodsData();
                }
            }
        });
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if(this.state.goodsList.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                if(!this.state.isLoading){
                    this.state.defaultParam.page++;
                    this.getGoodsData();
                }
            }
        });
        this.state.SCROLL = SCROLL;
    }

    //筛选4级分类;
    optionTypes(typeId) {
        let defaultParam = this.state.defaultParam;
        defaultParam.page = 1;
        this.state.filterArr = ['brands', 'xinghaos', 'halal', 'markets'];
        this.state.isGetData = true;
        this.initData(typeId);
        this.state.typesId = typeId;
        this.getGoodsData();
    }

    //创建商品列表
    createGoodsList(){
        let goodsList = this.state.goodsList,
            goodsListXML = [];
        let basicField = ['pic', 'title', 'shop_name'],
            dataField = ['is_registered', 'price_expired', 'is_often_buy', 'is_seller', 'price_rules'],
            goodsField = ['price', 'sell_num', 'market_name'];
        goodsList.map((goods, index)=>{
            goodsListXML.push(<GoodsItem key={index} goods={goods} index={index} type={goods.goods_category_id}
                                         basicField={basicField} dataField={dataField} goodsField={goodsField}
                                         clickCallback={this.clickCallback}  data={{is_registered: this.props.is_registered, is_seller: this.context.is_seller}}/>);
        });
        if(goodsListXML.length <= 0) {
            goodsListXML = (
                <div style={{marginTop: '30px'}}><img src={H.localhost + 'Public/images/buyer-cli/nothing.png'} width="100%"/></div>
            );
        }
        this.setState({
            goodsListXML: goodsListXML
        });
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

    //求报价
    askPrice(para){
        if(!this.props.is_registered) {
            H.sheet.promptLogin();
            return;
        }
        let name = para.shop_name,
            address = para.market_name;
        H.sheet.create({
            title: '获取报价',
            content: '<div class="ask-price">' + '<div class="cell-row">' +
            '<div class="cell-head">' +
            '<img src=' + H.localhost + para.pic + H.imgSize()[110]  + '>' +
            '</div>' +
            '<div class="cell-body"><div class="cell-column">' +
            '<div class="cell-head">' +
            para.title +
            '</div>' +
            '<div class="cell-foot">' +
            address +
            '</div>' +
            '</div></div>' +
            '</div>' +
            '<div class="about askPrice">大概数量：<div data-operate="take" class="take-icon"></div><input type="number" class="cell-input-value" id="ask_price" value="1" /><div class="add-icon" data-operate="add"></div></div>' +
            '<p class="askPrice">供应商：' + name + '</p>' +
            '<p style="line-height: 1.6;padding: 10px 0;">当前价格过期，需要你提出购买需求，供应商才能报价</p></div>',
            cancel: '关闭',
            confirm: '通知供应商',
            confirmCallback: function() {
                let obj = {
                    goods_id: '',
                    need_num: ''
                };
                obj.goods_id = para.id;
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
        $('.take-icon').click(this.clickCallback);
        $('.add-icon').click(this.clickCallback);
    }

    //添加购物车
    addCar(para){
        let identity = this.context.identity;
        if(identity == 2) {
            H.we_loading.show();
            H.server.getGoodsConfirmInfo({goods_id: para.id}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = para.id;
                    H.sheet.addCar(options, () => {
                        this.context.getCarData(() => {}, 1);
                    });
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else if(identity == 1){
            H.operationState('您不能购买自己的商品');
        }else{
            H.sheet.promptLogin();
        }
    }

    //咨询
    consult(para){
        if(!this.props.is_registered) {
            H.sheet.promptLogin();
            return;
        }
        if(para.price_expired){
            return;
        }

        H.we_loading.show();
        H.server.getConsultInfo({goods_id: para.id}, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                if(this.context.userShopType != 25) {
                    let obj = res.data;
                    obj.id = para.id;
                    obj.title = para.title;
                    H.sheet.sendGoodsConsultNotice(obj);
                }else {
                    H.sheet.consulting(res.data);
                }
            }else {
                H.operationState(res.message);
            }
        });
    }

    //收藏或者取消收藏
    collect(para){
        if(!this.props.is_registered) {
            H.sheet.promptLogin();
            return;
        }
        if(para.is_often_buy){
            H.we_loading.show();
            H.server.delOftenBuyGoods({goods_id: para.id}, (res) => {
                if(res.code == 0) {
                    H.operationState('取消常购成功');
                    para.is_often_buy = !para.is_often_buy;
                    this.createGoodsList();
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else{
            H.we_loading.show();
            H.server.addOftenBuyGoods({goods_id: para.id}, (res) => {
                if(res.code == 0) {
                    H.operationState('加入常购成功');
                    para.is_often_buy = !para.is_often_buy;
                    this.createGoodsList();
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }
    }

    clickCallback(e){
        let target = e.target,
            parent =  e.currentTarget,
            operate = target.dataset.operate || parent.dataset.operate,
            index = parent.dataset.index,
            param = target.dataset.param,
            para = '';
        e.stopPropagation();
        if(operate == 'order' && !param) return;
        para = param ? param : this.state.goodsList[index];
        if(!operate){
            H.searchBack = 2;
            H.searchBool = false;
            let p = location.hash.split('?')[1] ? '?'+location.hash.split('?')[1] : '';
            window.location.href = location.hash.split('?')[0] + '/goodsInfo' + p;
            H.searchBool = true;
            this.state.goodsInfo = <GoodsInfo goodsId={para.id} carData={this.state.carData} goodsInfoPage={this.collect.bind(this, para)}/>;
        }else{
            if(param == '4') {
                this.setState({isFilterShow: true});
            }else {
                this[operate](para);
            }
        }
    }

    //在线下单按钮
    shopping(para) {
        H.we_loading.show();
        H.server.getGoodsBuyData({goods_id: para.id}, (res) => {
            H.we_loading.hide();
            let buyInfo = res.data;
            H.sheet.create({
                title: '在线下单',
                content: '<div class="ask-price" style="font-size: 16px;">' + '<div class="cell-row">' +
                '<div class="cell-head">' +
                '<img src=' + H.localhost + para.pic + H.imgSize()[110]  + '>' +
                '</div>' +
                '<div class="cell-body"><div class="cell-column">' +
                '<div class="cell-head">' +
                para.title +
                '</div>' +
                '<div style="position: absolute;bottom: 10px;"><span style="color: #d40c21;">￥<span>'+para.price+'</span></span>' +
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
                        goods_id: para.id,
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
            $('.take-icon').click(this.clickCallback);
            $('.add-icon').click(this.clickCallback);
            $('#ask_price').change(() => {
                let price = $('#ask_price').attr('data-price');
                let val = $('#ask_price').val();
                $('#totalPrice').html((val*price).toFixed(2));
            });
        });
    }

    //渲染
    render() {
        let url = location.hash.substr(1),
            pageStatus = this.state.pageStatus;
        if(url.indexOf('goodsInfo') == -1) {
            pageStatus = 1;
        }else {
            pageStatus = 2;
        }

        return (
            <div className="search-container">
                <TypesFilter areaId={this.state.defaultParam.area_id} defaultParam={this.state.defaultParam} typesData={this.state.typesData}
                             refresh={this.optionTypes.bind(this)} type_ids={this.state.defaultParam.type_ids} typesId={this.state.typesId}/>
                <Sort defaultParam={this.state.defaultParam} sort={this.refreshSort.bind(this)}/>
                <div id="goods_list_wrap" className="goods-list-wrap-type">
                    <div className="scroller">
                        {this.state.goodsListXML}
                    </div>
                </div>
                {pageStatus == 1 ? null : this.state.goodsInfo}
                {
                    this.state.typesData ? <Filter show={this.state.isFilterShow}
                                                   saveFilter={this.saveFilter.bind(this)}
                                                   filterArr={this.state.filterArr}
                                                   refreshSort={this.refreshSort.bind(this)}
                                                   isGetData={this.state.isGetData}
                                                   type_ids={this.state.defaultParam.type_ids}
                                                   areaId={this.props.areaId}/> : null
                }

            </div>
        );
    }
}

TypeGoodsList.contextTypes = {
    is_seller: React.PropTypes.bool,
    userShopType: React.PropTypes.bool,
    identity: React.PropTypes.number,
    getCarData: React.PropTypes.fn
};

export default TypeGoodsList;