import React from "react";
import OrderList from "./order-list.jsx";
import ActionSheet from "../action-sheet/action-sheet.jsx";

const OrderController = React.createClass({
    getInitialState: function() {
        return {
            res: "",
            actionState: 0,
            scroller: {},
            orderInfoArr: [],
            page: 1,
            status: ''
        }
    },
    propTypes: {
        selectIndex: React.PropTypes.number.isRequired,
        isFresh: React.PropTypes.bool.isRequired
    },
    componentDidMount: function() {
        // 获取scroller实例
        let scroller = this.scrollCreator(this.pullToLoadMore);
        this.setState({
            scroller: scroller
        });
    },
    componentWillReceiveProps: function(nextProps) {
        // 判断是否刷新
        if (!nextProps.isFresh) return;

        var params = {
                status: nextProps.selectIndex || '',
                page: 1,
                size: 10
            },
            loading = this.loadingBehavior();

        this.setState({
            orderInfoArr: [],
            status: nextProps.selectIndex,
            page: 1
        },() => {
            this.state.scroller.scrollTo(0,0);
            // loading.show();
            this.getBuyList(params,(data) => {
                // loading.hide();
                this.setState({
                    orderInfoArr: data.order_infos || []
                }, () => {

                    // 隐藏we loading
                    H.we_loading.hide();

                    this.state.scroller.refresh();
                });
            });
        });
        
    },
    getBuyList: function(params,fn){
        H.server.order_buy_list(params,(res) => {
            if(res.code === 0){
                fn && fn(res.data);
            }else {
                H.we_loading.hide();
                H.dialog(res.message);
            }
        });    
    },
    pullToLoadMore: function(scroller) {
        if ( this.state.orderInfoArr.length === 0) return;
        let loading = this.loadingBehavior();

        if (scroller.y <= (scroller.maxScrollY + 40)) {
            let params = {
                status: this.state.status || '',
                page: this.state.page + 1,
                size: 10
            };
            loading.show();
            this.getBuyList(params, (data) => {

                loading.hide();
                // 如果当前请求页没有数据 total_count = 0
                if (data.total_count === 0) return;

                let newOrders = this.state.orderInfoArr.concat(data.order_infos);
                this.setState({
                    orderInfoArr: newOrders,
                    page: this.state.page + 1
                },() => {
                    scroller.refresh();
                });
            });
        } else {
            loading.hide();
        }
    },
    loadingBehavior: function() {
        var $pullUpEl = $('.pullUp'),
            _this = this;
        function show() {
            if (_this.state.orderInfoArr.length === 0) {
               $pullUpEl.addClass('noOrder'); 
            }
            $pullUpEl.addClass('loading').html('<span class="pullUpIcon">&nbsp;</span><span class="pullUpLabel">Loading...</span>');
        }
        function hide() {
            $pullUpEl.removeClass('loading noOrder').html('');
        }
        return {
            show: show,
            hide: hide
        }
    },
    scrollCreator: function(fn){
        // 创建iscroll实例
        var wrapper = document.getElementById("wrapper"),
            myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: false,
                topOffset: 50
            });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        myScroll.on('scrollEnd', () => {
            fn(myScroll);
        });
        return myScroll;
    },
    delOrderGoods: function(p) {  //删除商品;
        var arr = this.state.orderInfoArr;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].sub_order_no == p.orderId || arr[i].parent_order_no == p.orderId) {
                arr[i].order_amount = p.order_new_price;
                arr[i].discount_amount = p.discount_new_amount;
                if (arr[i].order_goods_infos.length > 1) {
                    for (var n = 0; n < arr[i].order_goods_infos.length; n++) {
                        if (arr[i].order_goods_infos[n].order_goods_id == p.goodsId) {
                            arr[i].order_goods_infos.splice(n, 1);
                            this.setState({
                                orderInfoArr: arr
                            },() => {
                                this.state.scroller.refresh();
                            });
                            break;
                        }
                    }
                } else {
                    arr.splice(i, 1);
                    this.setState({
                        orderInfoArr: arr
                    },() => {
                        this.props.refreshBadge(() => {
                            // 删除we loading
                            H.we_loading.hide();
                            this.state.scroller.refresh();
                        });
                    });
                    break;
                }
            }
        }
    },
    takeOrder: function(orderId){  //确认订单之后改成该订单的状态;
        var arr = this.state.orderInfoArr;
        for(var i = 0 ; i < arr.length ; i++){
            if(arr[i].order_id == orderId){
                arr[i].status = 4;
                this.setState({orderInfoArr : arr});
            }
        }
    },
    render: function() {
        var xml = "";

        if(this.state.orderInfoArr) {
            if (this.state.orderInfoArr.length > 0) {
                xml = <OrderList
                    data={this.state.orderInfoArr}
                    actionParam={this.props.actionParam}
                    delOrderGoods={this.delOrderGoods}
                    takeOrder={this.takeOrder}
                />;
            }
        }

        return (
            <div>
                <div id="wrapper">
                    <div id="scroller">
                        {xml}
                        <div className="pullUp">
                            {/*<span className="pullUpIcon">&nbsp;</span>
                            <span className="pullUpLabel">Loading...</span>*/}
                        </div>
                    </div>
                </div>
                {(this.state.orderInfoArr.length === 0) ? <div className="noOrderTip">暂无对应数据</div> : "" }
            </div>
        );
    }

});

export default OrderController;