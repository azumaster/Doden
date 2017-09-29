/*
* 商品列表部分;
* create: xy , time: 2017-03-09
* */

class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            isLoading: false
        };
        this.createScroll = this.createScroll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.backScrollTop) {
            this.state.SCROLL && this.state.SCROLL.scrollTo(0, 0);
        }
    }

    componentWillUpdate() {
        this.state.isLoading = false;
    }

    componentDidMount() {
        this.createScroll();
        //if(this.props.list.list.length > 0) {
        //    this.state.SCROLL.refresh();
        //    if(getCookie('scrollTop')) {
        //        setTimeout(() => {this.state.SCROLL.scrollTo(0, getCookie('scrollTop'));}, 100);
        //    }
        //}
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }



    createScroll(){
        var wrapper = document.getElementById('goodsListWrap'),
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
        SCROLL.on('scroll', () => {
            if(this.props.list.page >= this.props.list.page_all) return;
            if(SCROLL.y <= SCROLL.maxScrollY){
                if(!this.state.isLoading){
                    this.setState({isLoading: true});
                    this.props.setParam('page', this.props.list.page+1);
                }
            }
        });
    }

    hrefHandler(id) {
        this.props.setBackScrollTop(() => {
            location.hash = $.seller ? '#/seller/mall/result/goodsInfo?&id='+id : '#/buyer/buy/result/goodsInfo?&id='+id;
        });
    }

    createGoodsList() {
        let list = this.props.list.list,
            XML = [];
        for(let i in list) {
            XML.push(
                <a key={i} className="goods-item flex" onClick={this.hrefHandler.bind(this, list[i].id)}>
                    <div><img className="goods-item-img" src={$.cdn() + list[i].pic + $.img(90, 90)} width="60px"/></div>
                    <div className="goods-item-info flex-item">
                        <div className="goods-item-title">{list[i].title}</div>
                        <div className="goods-item-price">￥{list[i].price}
                            {
                                //如果是管理人并且原价数据存在;
                                $.seller && list[i].origin_price ?
                                    <span style={{fontSize: '13px', color: '#5d5f6a', marginLeft: '10px'}}>原价：￥{list[i].origin_price}</span> : null
                            }
                        </div>
                        <div className="goods-item-num">销量：{list[i].sell_num}</div>
                        {
                            list[i].stick ?
                                <div className="recommended"><img width="100%" src={$.cdn() + 'Public/service-provider/images/recommended.png'}/></div> : null
                        }
                    </div>
                </a>
            );
        }

        return XML;
    }

    render() {
        let state = this.props.param.state,
            style = null;
        if(state == 1) {
            style = {top: '45px'};
        }
        return (
            <div id="goodsListWrap" className="goods-list-wrap" style={style}>
                <div className="scroller">
                    {this.createGoodsList()}
                    {
                        this.state.isLoading ? <div><div className="loading-icon sm"><div></div><div></div><div></div><div></div><div></div></div></div> : null
                    }
                    {
                        this.props.list.page == this.props.list.page_all && this.props.list.list.length >= 5 ?
                            <div className="load-end"><span className="text">别扯了，到底了</span></div>
                            : null
                    }
                </div>
            </div>
        );
    }
}

export default GoodsList;