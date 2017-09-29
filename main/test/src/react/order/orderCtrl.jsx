import OrderList from './orderList.jsx';
class Order extends React.Component{
    constructor(){
        super();
        this.state={
            res: '',
            actionState: 0,
            scroller: {},
            orderInfoArr: [],
            page: 1,
            status: ''
        };
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.pullToLoadMore=this.pullToLoadMore.bind(this);
        this.getOrderId=this.getOrderId.bind(this);
    }

    pullToLoadMore(scroller) {
        if (this.state.orderInfoArr.length === 0) return;
        console.log(scroller.y, scroller.maxScrollY );
        if (scroller.y <= (scroller.maxScrollY)) {
            let params = {
                status: this.state.status || '',
                page: this.state.page + 1,
                size: 10
            };
            this.getBuyList(params, (data) => {
                // 如果当前请求页没有数据 total_count = 0
                if (data.total_count === 0) return;
                let newOrders = this.state.orderInfoArr.concat(data.order_infos);
                this.setState({
                    orderInfoArr: newOrders,
                    page: this.state.page + 1
                }, () => {
                    scroller.refresh();
                });
            });
        }
    }

    componentDidMount() {
    // 获取scroller实例
        this.scrollCreator(this.pullToLoadMore);//将更新数据的与scroll绑定
        var params = {
            page: 1,
            size: 10
        };
        this.getBuyList(params, (data) => {
            this.setState({
                orderInfoArr: data.order_infos|| []
            }, ()=>{
                this.state.SCROLL.refresh();
            });
        });
    }

    scrollCreator(fn) {
        // 创建iscroll实例
        let wrapper = document.getElementById('order_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true
            });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scrollEnd', () => {
            fn(SCROLL);
        });
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    getBuyList(params, fn){
        H.server.order_buy_list(params, (res) => {
            if(res.code === 0){
                fn && fn(res.data);
            }else {
                H.we_loading.hide();
                H.dialog(res.message);
            }
        });
    }
    //得到order
    getOrderId(order){
        this.props.getOrderId(order);
    }

    render(){
        return(
                <div id="order_wrap" >
                    <div id="order_scroll" >
                        <OrderList orderInfoArr={this.state.orderInfoArr} status={this.props.status} getOrderId={this.getOrderId}/>
                    </div>
                </div>
        );
    }
}

export  default Order;