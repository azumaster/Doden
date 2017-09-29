/*
* 商品列表;
* */
import GoodsInfo from '../../../components/goods-info/goods-info.jsx';
import GoodsItem from '../../../components/GoodsItem.jsx';
import Promise from 'es6-promise';

class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsList: [],
            identity: null,  //身份 1老板  2买家  3访客
            isLoading: false,  //防止多次加载
            pageStatus: 1, //1 是列表 2商品详情
            total: 0,
            defaultParam: null     //提交的参数;
        };
        this.clickCallback = this.clickCallback.bind(this);
        this.collect = this.collect.bind(this);
        this.getGoodsData = this.getGoodsData.bind(this);
    }

    componentWillMount() {
        let promiseList = [
            new Promise((resolve) => {this.getGoodsData(resolve);})
        ];
        Promise.all(promiseList).then(() => {
            this.createGoodsList();
        });
    }

    componentDidMount() {
        this.createScroll();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isGetData) {
            this.props.isGetData = false;
            new Promise((resolve) => {this.getGoodsData(resolve);});
        }
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
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
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scroll', () => {
            if(this.state.goodsList.length >= this.state.total) return;
            if(SCROLL.y < SCROLL.maxScrollY - 50){
                if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                    if(!this.state.isLoading){
                        this.props.defaultParam.page++;
                        new Promise((resolve)=>{this.getGoodsData(resolve);});
                    }
                }
            }
        });
        this.state.SCROLL = SCROLL;
    }

    //获得商品列表
    getGoodsData(resolve){
        let para = this.props.defaultParam;
        H.we_loading.show();
        this.state.isLoading = true;
        H.server.searchGoodsList(JSON.stringify(para), (res)=>{
            if(res.code == 0){
                this.state.total = res.data.total;
                this.state.goodsList = this.state.goodsList.concat(res.data.goods);
                if(resolve){resolve(res.data);}
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

    //创建商品列表
    createGoodsList(){
        let goodsList = this.state.goodsList,
            goodsListXML = [];
        let basicField = ['pic', 'title'],
            dataField = ['is_registered', 'price_expired', 'is_often_buy', 'is_seller'],
            goodsField = ['price', 'sell_num'];
        goodsList.map((goods, index)=>{
            goodsListXML.push(<GoodsItem key={index} goods={goods} index={index} type={goods.goods_category_id}
                                         basicField={basicField} dataField={dataField} goodsField={goodsField}
                                         clickCallback={this.clickCallback} data={{is_registered: this.props.is_registered, is_seller: this.context.is_seller}}/>);
        });
        this.setState({
            goodsListXML: goodsListXML
        });
    }

    //减一
    take(){
        let val = Number($('#ask_price').val()) - 1;
        if(val < 0 ){
            return;
        }
        $('#ask_price').val(val);
    }

    //加一
    add(){
        let val = Number($('#ask_price').val()) + 1;
        $('#ask_price').val(val);
    }

    //求报价
    askPrice(para){
        let name = para.shop_name,
            address = para.market_name;
        H.sheet.create({
            title: '获取报价',
            content: '<div class="ask-price">' + '<div class="cell-row">' +
            '<div class="cell-head">' +
            '<img src=' + para.pic  + '>' +
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
            '<div class="about">大概数量：<div data-operate="take" class="take-icon"></div><input class="cell-input-value" id="ask_price" /><div class="add-icon" data-operate="add"></div></div>' +
            '<p>供应商：' + name + '</p>' +
            '<p>当前价格过期，需要你提出购买需求，供应商才能报价</p></div>',
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
        let identity = this.state.identity;
        if(identity == 2) {
            H.we_loading.show();
            H.server.getGoodsConfirmInfo({goods_id: para.id}, (res) => {
                if(res.code == 0) {
                    let options = res.data;
                    options.goods_id = para.id;
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else if(identity == 1){
            H.operationState('您不能购买自己的商品');
        }else{
            H.operationState('请您先注册平台');
        }
    }

    //咨询
    consult(para){
        if(para.price_expired){
            return;
        }
        H.we_loading.show();
        H.server.getConsultInfo({goods_id: para.id}, (res) => {
            if(res.code == 0) {
                H.sheet.consulting(res.data);
            }else {
                H.operationState(res.message);
            }
        });
        H.we_loading.hide();
    }

    //收藏或者取消收藏
    collect(para){
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
            window.location.href = location.hash + '&/goodsInfo';
            this.state.goodsInfo = <GoodsInfo goodsId={para.id} carData={this.state.carData} goodsInfoPage={this.collect.bind(this, para)}/>;
            this.props.refreshSort && this.props.refreshSort(5);
        }else{
            if(param == '4') {
                this.setState({isFilterShow: true});
            }else {
                this[operate](para);
            }
        }
    }

    //在线下单按钮
    shopping(){

    }

    render() {
        let url = location.hash.substr(1),
            pageStatus = this.state.pageStatus;
        if(url.indexOf('goodsInfo') == -1) {
            pageStatus = 1;
        }else {
            pageStatus = 2;
        }
        return (
            <div>
                <div id="goods_list_wrap" className={this.props.className}>
                    <div className="scroller">
                        {this.state.goodsListXML}
                    </div>

                </div>
                {pageStatus == 1 ? null : this.state.goodsInfo}
            </div>
        );
    }
}

GoodsList.contextTypes = {
    identity: React.PropTypes.string
};

export default GoodsList;