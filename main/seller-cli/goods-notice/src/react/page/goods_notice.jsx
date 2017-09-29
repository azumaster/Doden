import GoodsItem from '../component/GoodsItem.jsx';
//import GoodsInfo from '../components/goods-info/goods-info.jsx';

class GoodsNotice extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            goodsList: [],
            defaultPara: {
                page: 1,
                size: 20,
                shop_id: 0
            },
            isLoading: false,  //防止多次加载
            total: 0
        };

        this.clickCallback = this.clickCallback.bind(this);
    }

    static defaultProps = {
      quotationStatus: {
          0: '未报价',
          1: '已报价',
          2: '无货下架',
          3: '超时取消'
      }
    };

    componentWillMount(){
        this.state.defaultPara.shop_id = H.urlParam('shop_id');
        this.getGoodsList();
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('shop_info'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 1,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scroll', () => {
            if(this.state.goodsList.length >= this.state.total) return;
            if(SCROLL.y < SCROLL.maxScrollY - 50){
                if((SCROLL.y - SCROLL.maxScrollY ) < 100) {
                    if(!this.state.isLoading){
                        this.state.defaultPara.page++;
                        this.getGoodsList();
                    }
                }
            }
        });
    }

    //获得商品列表
    getGoodsList(){
        H.we_loading.show();
        this.state.isLoading = true;
        H.server.quotationList(this.state.defaultPara, (res)=>{
            if(res.code == 0){
                this.state.total = res.data.total;
                this.state.goodsList = this.state.goodsList.concat(res.data.quotations);
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
        let basicField = ['goods_image', 'goods_name'],
            dataField = ['status'],
            goodsField = ['need_num'];
        goodsList.map((goods, index)=>{
            goodsListXML.push(
                <div className="quotation-goods-wrap">
                    <div className="cell-row quotation-goods">
                        <div className="cell-head">
                            <img src={H.localhost + goods.user_image + H.imgSize()['110']} />
                        </div>
                        <div className="cell-body">
                            <p>{goods.shop_name}</p>
                            <p><span>{goods.province}</span><span>{goods.city}</span><span>{goods.county}</span></p>
                        </div>
                        <div className="cell-foot">
                            <p style={goods.status != 0 ? {color: '#878787'} : null}>{this.props.quotationStatus[goods.status]}</p>
                            <p>{goods.start_time}</p>
                        </div>
                    </div>
                    <GoodsItem key={index} goods={goods} index={index} type={goods.goods_category_id}
                               basicField={basicField} dataField={dataField} goodsField={goodsField}
                               clickCallback={this.clickCallback}/>
                </div>
            );
        });
        this.setState({
            goodsListXML: goodsListXML
        });
    }

    //通知价格
    tellPrice(para) {
        let url = H.localhost + para.goods_image + H.imgSize()['110'];
        H.sheet.create({
            title: '通知客户',
            content: '<div class="ask-price">' + '<div class="cell-row">' +
            '<div class="cell-head">' +
            '<img src=' + url  + '>' +
            '</div>' +
            '<div class="cell-body"><div class="cell-column">' +
            '<div class="cell-head">' +
            para.goods_name +
            '</div>' +
            '<div class="cell-foot">'+ '一口价：<input class="cell-input-value" id="ask_price" /> 元/件' +
            '</div>' +
            '</div></div>' +
            '</div>' +
            '<div class="exp"><p>注意事项：</p>' +
            '<p>1、系统不支持讨价还价请直接一口价；</p>' +
            '<p>2、报价后，系统会通知客户下单；</p>' +
            '<p>3、客户可以拒绝这个价格，从而订单作废。</p></div></div>',
            cancel: '关闭',
            confirm: '通知客户',
            confirmCallback: function() {
                let obj = {
                    goods_id: '',
                    price: 0
                };
                obj.goods_id = para.goods_id;
                obj.price = $('#ask_price').val();
                H.we_loading.show();
                H.server.addSellerQuote(obj, (res) => {
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
    }


    soldOut(para){
        H.sheet.create({
            title: '下架商品',
            content: '<div class="ask-price">' +
            '<p class="exp" style="text-align: center; font-size: 14px; color: #b3b3b; padding: 40px 0">请确认是否下架该商品</p>' +
            '</div>',
            cancel: '取消',
            confirm: '确定',
            confirmCallback: function() {
                H.we_loading.show();
                H.server.addSellerQuote({
                    goods_id: para.goods_id
                }, (res) => {
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
    }

    //说明
    describe(){
        H.sheet.create({
            title: '咨询说明',
            content: '<div>' +
            '<p style="text-align: center; font-size: 14px; color: #b3b3b; padding: 10px 0">1、你当天未更新价格时，客户无法在线下单，此时，客户可以发起“询价”，你需要在30分钟内报价，否则订单作废。</p>' +
            '<p style="text-align: center; font-size: 14px; color: #b3b3b; padding: 10px 0">2、你当天更新了价格后，讲不在收到“询价”通知，客户如果对你的价格满意，将直接在线下单。</p>' +
            '</div>',
            confirm: '关闭',
            confirmCallback: function() {
                H.sheet.hide();
            }
        });
    }

    clickCallback(e){
        let target = e.target,
            parent =  e.currentTarget,
            operate = target.dataset.operate || parent.dataset.operate,
            index = parent.dataset.index,
            para = '';
        e.stopPropagation();
        para = this.state.goodsList[index];

        if(!operate){

        }else{
            this[operate](para);
        }
    }

    render() {
        return (
            <div>
               <div id="shop_info" className="shop-goods">
                    <div className="scroller">
                        <div className="notice-goods-wrap">
                            <p>客户报价<a data-operate="describe" href="javascript:;" onClick={this.clickCallback}>说明?</a></p>
                            {this.state.goodsListXML}
                        </div>
                    </div>
                 </div>
            </div>
        );
    }

}

export default GoodsNotice;