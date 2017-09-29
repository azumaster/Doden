/*
* 正在销售的商品列表*/
import GoodsList from '../../components/goods-list/goods_list.jsx';
import FooterLoading from '../../components/footer-loading/footer-loading.jsx';
import EmptyTemp from './EmptyTemp.jsx';
import ChangePrice from './change-price.jsx';

class Selling extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeList: [],            //分类数据;
            data: {},                //商品列表数据;
            pageSize: 50,            //每一页商品数量;
            param: {                 //拉取商品列表的参数;
                type: 1,
                start: 0,
                end: 49
            },
            recordPage: [],          //记录已经拉取了的数据页数;
            typeListState: false,    //是否显示分类选择弹窗;
            isLoad: true,            //是否正在加载;
            total: 1,                //是否有数据;
            currentGoodsData: null,  //当前改价格的商品ID;
            currentGoodsIndex: []    //当前改价的商品分类ID和index
        };
        this.getGoodsList = this.getGoodsList.bind(this);
        this.createScroll = this.createScroll.bind(this);
        this.createGoodsList = this.createGoodsList.bind(this);
        this.delGoods = this.delGoods.bind(this);
        this.changePriceHandler = this.changePriceHandler.bind(this);
        this.changePriceFinish = this.changePriceFinish.bind(this);
    }

    componentWillMount() {
        //获取商品类型数据;
        H.we_loading.show();
        H.server.getTypeList({type: 1}, (res) => {
            if(res.code == 0) {
                let typeList = res.data.categories,
                    data = {},
                    num = 1;
                for(let i = 0 ; i < typeList.length ; i++) {
                    let obj = $.extend({}, typeList[i]);
                    obj.list = [];
                    obj.start = num;
                    num += obj.num;
                    data[obj.id] = obj;
                }
                this.state.data = data;
                this.state.typeList = typeList;
                this.getGoodsList();
            }else {
                H.operationState(res.message);
            }
        });
    }

    componentDidMount() {
        this.createScroll(this.getGoodsList);
    }

    //创建IScroll;
    createScroll(fn){
        var wrapper = document.getElementById('selling_goods_list'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true,
                preventDefault: false
            });
        SCROLL.on('scroll', () => {
            if(this.state.param.end >= this.state.total - 1) return;
            if((SCROLL.y - SCROLL.maxScrollY) < 300) {
                if(this.state.isLoad) {
                    this.setState({isLoad: false}, () => {
                        this.state.param.start = this.state.param.end + 1;
                        this.state.param.end = this.state.param.start + this.state.pageSize-1;
                        fn && fn();
                        SCROLL.refresh();
                    });
                }
            }
        });
        SCROLL.on('scrollEnd', () => {
            if(this.state.param.end >= this.state.total - 1) return;
            if((SCROLL.y - SCROLL.maxScrollY) < 300) {
                if(this.state.isLoad) {
                    this.setState({isLoad: false}, () => {
                        this.state.param.start = this.state.param.end + 1;
                        this.state.param.end = this.state.param.start + this.state.pageSize-1;
                        fn && fn();
                        SCROLL.refresh();
                    });
                }
            }
        });

        var typeListWrapper = document.getElementById('type_list_wrap'),
            typeSCROLL = new IScroll(typeListWrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.setState({SCROLL: SCROLL, typeSCROLL: typeSCROLL});
    }

    //获取商品列表;
    getGoodsList(fn) {
        let param = this.state.param;
        H.server.getList(param, (res) => {
            if(res.code == 0) {
                this.state.isLoad = true;
                H.we_loading.hide();
                let goodsArr = res.data.goods,
                    data = this.state.data;
                for(let i = 0 ; i < goodsArr.length ; i++) {
                    if(data[goodsArr[i].type]) {
                        data[goodsArr[i].type].list.push(goodsArr[i]);
                    }else {
                        H.operationState('有商品没有所属分类');
                    }
                }

                this.state.total = res.data.total;
                this.setState({data: data}, () => {
                    this.state.SCROLL.refresh();
                    this.state.typeSCROLL.refresh();
                    fn && fn();
                });
            }else {
                H.operationState(res.message);
            }
        });
    }

    //创建商品列表;
    createGoodsList() {
        let order = ['thumb', 'name', 'xinghao', 'price', 'unit'],
            typeList = this.state.typeList,
            data = this.state.data,
            XML = [];
        for(let i = 0 ; i < typeList.length ; i++) {
            let list = data[typeList[i].id].list;
            if(list.length > 0) {
                XML.push(
                    <div id={'goods_list_type_' + [typeList[i].id]}>
                        <GoodsList btnNames={['删除']} goodsList={list} order={order} style={'goods-list-stop'} type={typeList[i].name}
                                   cellStyle={'goods-list-item'} delGoods={this.delGoods} btnGroupStyle={'button-sale'} changePriceHandler={this.changePriceHandler}
                                   operate={typeList[i].id}
                                   iconBtnNames={['下架', '复制', '预览/分享']} iconStyle={['icon-sell-out icon-font', 'icon-copy icon-font', 'icon-share icon-font']}
                                   btnClick={this.btnClickHandler.bind(this)}/>
                    </div>
                );
            }else {
                XML.push(<div id={'goods_list_type_' + [typeList[i].id]}></div>);
            }
        }
        return XML;
    }

    //删除商品;
    delGoods(e){
        let data = this.state.data,
            node = e.target,
            index = node.dataset.index,
            typeId = node.dataset.operate,
            goods_id = data[typeId]['list'][index].goods_id;

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
                            data[typeId]['list'].splice(index, 1);
                            $('.goods-list-item').show();
                            this.setState({
                                data: data
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

    //商品操作区按钮组的点击事件;
    btnClickHandler(index, e) {
        let node = e.target,
            parent = e.target.className.indexOf('cell-column') == -1 ? $(node).parents('.cell-column') : $(node),
            key = parent.data('index'),
            operate = parent.data('operate'),
            para = parent.data('para'),
            data = this.state.data,
            goods = data[operate]['list'][para],
            name = goods.name,
            goods_id = goods.goods_id;
        switch (key) {
            case 0:
                H.sheet.create({
                    title: '<span style="color: #6f6f6f;">下架商品</span>',
                    content: '<div class="actionsheet_cell read-only"><div class="actionsheet_item">商品名：'+ name + '</div>' +
                    '<div class="actionsheet_item" style="font-size: 14px;color: #888;">下架后的商品可在已下架列表中查看或者恢复，下架后无法销售</div></div>',
                    cancel: '取消',
                    confirm: '下架',
                    confirmCallback: () => {
                        H.we_loading.show();
                        H.server.updateSaleStatus({goods_id: goods_id, on_sale: 0}, (res) => {
                            if(res.code == 0){
                                H.we_loading.hide();
                                $(node).parents('.goods-list-item').addClass('right-hide');
                                setTimeout(() => {
                                    $('.goods-list-item').removeClass('right-hide');
                                    data[operate]['list'].splice(index, 1);
                                    this.setState({
                                        data: data
                                    }, () => {
                                        this.state.SCROLL.refresh();
                                    });
                                }, 400);
                            }else{
                                H.operationState(res.message);
                            }
                        });
                    }
                });
                break;
            case 1:
                H.sheet.create({
                    style: 1,
                    title: '复制链接，自由传播',
                    content: '<div class="actionsheet_cell" id="copy_goods_name_or_price">复制商品名+价格</div>' +
                    '<textarea id="copy_goods_name_or_price_content" style="position: absolute;top: 9000px;">646546465465455</textarea>' +
                    '<div class="actionsheet_cell" id="copy_goods_name">复制商品名</div>' +
                    '<div class="actionsheet_cell" id="copy_goods_href">复制链接</div>',
                    confirm: '取消'
                });
                $('#copy_goods_name_or_price').click(function() {
                    document.getElementById('copy_goods_name_or_price_content').select();
                    document.execCommand('Copy');
                    //window.clipboardData.setData('text', '我被复制了，试试');
                });
                $('#copy_goods_name').click(function() {

                });
                $('#copy_goods_href').click(function() {

                });
                break;
            case 2:
                window.location.href = '/show_page.php?pageTag=5&gid=' + goods_id;
                break;
        }
    }

    //执行改价;
    changePriceHandler(e){
        let data = this.state.data,
            node = e.target,
            index = node.dataset.index,
            typeId = node.dataset.operate;
        this.setState({currentGoodsData: data[typeId]['list'][index], currentGoodsIndex: [typeId, index]});
    }

    setTypeListState(bool) {
        this.setState({typeListState: bool});
    }

    //点击分类滑动到对应的分类位置;
    typeListHandler(e) {
        let data = this.state.data,
            param = this.state.param,
            typeId = e.target.dataset.type,
            SCROLL = this.state.SCROLL;
        this.state.typeListState = false;
        if(data[typeId].start < param.end) {    //如果当前分类的start小于已经拉取的结束数据时，说明这个分类已经获取过，直接滚到到该位置;
            this.setState();
            SCROLL.scrollToElement(document.querySelector('#goods_list_type_' + typeId));
        }else {       //如果选择的分类没有被加载过, 这次需要加载的数据是接着上次加载的数据计算出到这个分类的结束的所有数据;
            let end = data[typeId].start+data[typeId].num-2;
            this.state.param.start = this.state.param.end + 1;
            this.state.param.end = end;
            this.getGoodsList(() => {
                SCROLL.scrollToElement(document.querySelector('#goods_list_type_' + typeId));
            });
        }
    }

    changePriceFinish(price, obj) {
        let index = this.state.currentGoodsIndex,
            data = this.state.data;
        data[index[0]]['list'][index[1]].price = price;
        data[index[0]]['list'][index[1]].price_rules = obj.price_rules;
        this.setState({data: data, currentGoodsData: null, currentGoodsIndex: []});
    }

    closePrice() {
        this.setState({currentGoodsData: null, currentGoodsIndex: []});
    }

    render() {
        return (
            <div>
                <div id="selling_goods_list" className="selling-goods-list">
                    <div className="scroller">
                        {this.createGoodsList()}
                        {
                            (this.state.param.end < this.state.total-1) && !this.state.isLoad ? <FooterLoading /> : ''
                        }
                        {this.state.total == 0 ? (<EmptyTemp SCROLL={this.state.SCROLL} />) : null}
                    </div>
                </div>
                {
                    this.state.typeList.length > 0 ? (<div className="goods-type-btn" onClick={this.setTypeListState.bind(this, true)}></div>) : []
                }

                <div className={this.state.typeListState ? 'goods-type-list show' : 'goods-type-list hide'}>
                    <div className="type-list-task" onClick={this.setTypeListState.bind(this, false)}></div>
                    <div className="type-list-wrap">
                        <div id="type_list_wrap" className="type-list">
                            <div className="scroller">
                                <div className="type-list-title">商品分类列表</div>
                                <div onClick={this.typeListHandler.bind(this)}>
                                    {
                                        this.state.typeList.map((val, index) => {
                                            return (
                                                <div className="type-list-item" key={index + Math.random()} data-type={val.id}>{val.name}</div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="type-list-close" onClick={this.setTypeListState.bind(this, false)}></div>
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

export default Selling;