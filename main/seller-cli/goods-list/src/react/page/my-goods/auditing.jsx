import GoodsList from '../../components/goods-list/goods_list.jsx';
import FooterLoading from '../../components/footer-loading/footer-loading.jsx';
import EmptyTemp from './EmptyTemp.jsx';
import ChangePrice from './change-price.jsx';
/*
* 审核中的商品列表
*
*
* */

class Auditing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultPara : {
                shop_id: 0,
                type: 2,
                start: 0,
                end: 0
            },
            goodsList: [],
            isLoad: true,
            loadEnd: false,
            total: 1,                 //是否有数据;
            currentGoodsData: null,  //当前改价格的商品ID;
            currentGoodsIndex: null    //当前改价的商品分类ID和index
        };

        this.delGoods = this.delGoods.bind(this);
        this.changePriceFinish = this.changePriceFinish.bind(this);
    }

    componentWillMount(){
        this.getGoodsList();
    }

    componentDidMount(){
        this.createScroll();
    }

    getGoodsList(){
        let defaultPara = this.state.defaultPara,
            goodsList = this.state.goodsList;
            defaultPara.end = defaultPara.start + 19;
        H.we_loading.show();
        H.server.getList(defaultPara, (res) => {
            if(res.code == 0){
                H.we_loading.hide();
                goodsList = goodsList.concat(res.data.goods);
                if(goodsList.length >= res.data.total) {
                    this.state.loadEnd = true;
                }else {
                    defaultPara.start = defaultPara.end +1;
                }
                this.state.total = res.data.total;
                this.setState({
                    goodsList: goodsList,
                    isLoad: true
                }, () => {
                    this.state.SCROLL.refresh();
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    createScroll(){
        var wrapper = document.getElementById('auditing_goods_list'),
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
        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scroll', () => {
            if(this.state.loadEnd) return;
            if((SCROLL.y - SCROLL.maxScrollY) < 300) {
                if(this.state.isLoad) {
                    this.setState({isLoad: false}, () => {
                        this.getGoodsList();
                    });
                }
            }
        });
    }

    //创建商品列表
    createGoodsList(){
        let order = ['thumb', 'name', 'xinghao', 'price', 'unit'],
            type = (<div className="flex-num1"><div className="flex-box">
                <p className="flex-num1">友情提醒：请仔细阅读商品规范书</p><a href="#my-goods/auditing/spec-article" style={{color: '#888', textDecoration: 'underline'}}>商品规范?</a>
            </div></div>);
        return <GoodsList btnNames={['删除']} goodsList = {this.state.goodsList} order={order} style={'goods-list-audit'} type={type}
                          cellStyle={'goods-list-item'} delGoods={this.delGoods} changePriceHandler={this.changePriceHandler.bind(this)}/>;
    }

    delGoods(e){
        let node = e.target,
            index = node.dataset.index,
            goodsList = this.state.goodsList,
            goods_id = goodsList[index].goods_id;
        H.sheet.create({
            title: '<span>删除商品</span>',
            content: '<div class="actionsheet_cell read-only">' +
            '<div class="actionsheet_item" style="font-size: 14px;color: #888;"><p style="margin: 30px 0;text-align: center;width: 100%;">确定要删除该商品吗，删除之后不可恢复，请谨慎操作</p></div></div>',
            cancel: '取消',
            confirm: '删除',
            confirmCallback: () => {
                H.we_loading.show();
                H.server.delGoods({goods_ids: goods_id}, (res) => {
                    if(res.code == 0){
                        H.we_loading.hide();
                        H.operationState('删除成功');
                        $(node).parents('.goods-list-item').slideUp(400, () => {
                            goodsList.splice(index, 1);
                            $('.goods-list-item').show();
                            this.props.getAuditingNum();
                            this.setState({
                                goodsList: goodsList
                            }, () => {
                                this.state.SCROLL.refresh();
                            });
                        });
                    }else{
                        H.operationState(res.message);
                    }
                });
            }
        });
    }

    //执行改价;
    changePriceHandler(e){
        let data = this.state.goodsList,
            node = e.target,
            index = node.dataset.index;
        this.setState({currentGoodsData: data[index], currentGoodsIndex: index});
    }

    changePriceFinish(price, obj) {
        let index = this.state.currentGoodsIndex,
            data = this.state.goodsList;
        data[index].price = price;
        data[index].price_rules = obj.price_rules;
        this.setState({data: data, currentGoodsData: null, currentGoodsIndex: null});
    }

    closePrice() {
        this.setState({currentGoodsData: null, currentGoodsIndex: null});
    }

    render() {
        return (
            <div>
                <div id="auditing_goods_list" className="auditing-goods-list">
                    <div className="scroller">
                        {this.createGoodsList()}
                        {
                            !this.state.loadEnd && !this.state.isLoad ? <FooterLoading /> : ''
                        }
                        {this.state.total == 0 ? (<EmptyTemp SCROLL={this.state.SCROLL} />) : null}
                    </div>
                </div>
                {
                    this.state.currentGoodsData ?
                        <ChangePrice data={this.state.currentGoodsData}
                                     changePriceFinish={this.changePriceFinish} closePrice={this.closePrice.bind(this)} />
                        : null
                }
            </div>
        );
    }
}

export default Auditing;