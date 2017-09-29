/**
 * Created by Doden on 2017.03.09
 */

import { connect } from 'react-redux';
import Action from '../../redux/actions/action.js';

import Tab from '../../components/tab/tab.jsx';

class Ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticketList: [],
            page:1,
            size: 10,
            total:1,
            currentStatus: 0
        };
    }

    componentWillMount(){
        this.getTicketList();
    }

    getTicketList(){
        let data = {
            page: this.state.page,
            size: this.state.size
        };
        if(this.state.currentStatus != 0){
            data.status = this.state.currentStatus;
        }
        $.loading.show();

        $.req.getTicketList(data, (res)=>{
            if(res.code == 0){
                let ticketList = this.state.ticketList;

                if(this.state.page == 1) ticketList = [];

                ticketList = ticketList.concat(res.data.sales);

                this.setState({
                    page: res.data.current,
                    total: res.data.total,
                    ticketList: ticketList
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll() {
        let scrollOptions = {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };

        let SCROLL = new IScroll('#ticketList', scrollOptions);

        this.setState({SCROLL: SCROLL}, ()=>{
            SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if(this.state.ticketList){
                    if(this.state.ticketList.length >= this.state.total) return;
                    if((SCROLL.y - SCROLL.maxScrollY)<300){
                        this.state.page ++;
                        new Promise(()=>{this.getTicketList();});
                    }
                }
            });
        });
    }

    createTab(){
        let tabNames = ['全部', '待确认', '待发货', '待收货'],
            tabData = [0, 1, 2, 3];

        return(<Tab tabNames={tabNames} tabData={tabData} style="tab-item" activeStyle="tab-item active"
                    clickCallback={this.toggleTab.bind(this)} status={this.state.currentStatus}/>);
    }

    toggleTab(e){
        let index = e.target.dataset.index;

        this.setState({
            currentStatus: index,
            page: 1
        }, this.getTicketList);
    }

    createTicketList(){
        let ticketList = [],
            ticketListInfo = this.state.ticketList;

        if(ticketListInfo&&ticketListInfo.length>0){
            ticketListInfo.map((ticket, index)=>{
                let ticketGoodsList = [],
                    ticketStatus = this.ticketStatus(ticket.order_status);

                ticket.goods_info.map((good, i)=>{
                    ticketGoodsList.push(<div key={i} className="ticket-good">
                        <div className="good-info">
                            <div className="good-img pull-left"><img src={$.cdn()+good.goods_picture+$.img(80, 80)} className="img-rounded"/></div>
                            <div className="good-des">
                                <div className="grid-row">
                                    <div className="grid-col-9"><h5 className="good-name">{good.goods_title?good.goods_title:good.goods_brand}</h5></div>
                                    <div className="grid-col-3">
                                        <h5 className="text-right">￥{good.goods_price_add}</h5>
                                        <h5 className="text-assist text-right"><del>￥{good.goods_price_pre}</del></h5>
                                    </div>
                                    <div className="grid-col-9"><h6>{good.goods_market}-{good.goods_shop}</h6></div>
                                    <div className="grid-col-3"><h6 className="text-right text-assist">X{good.goods_num}</h6></div>
                                </div>
                            </div>
                        </div>
                        <div className="good-state">
                            {good.goods_status==2?<div className="status">
                                <h5 className="pull-right">已进货</h5><h2 className="pull-right"><i className="icon completed"/></h2>
                            </div>:
                                <div className="status" onClick={this.stock.bind(this)} data-oid={ticket.order_id} data-title={good.goods_title} data-num={good.goods_num}
                                     data-shop={good.goods_shop} data-market={good.goods_market} data-gid={good.goods_id} data-img={$.cdn()+good.goods_picture+$.img(80, 80)}>
                                    <h5 className="pull-right text-pink">一键进货</h5><h2 className="pull-right text-pink"><i className="icon take-goods"/></h2>
                                </div>}
                        </div>
                    </div>);
                });

                ticketList.push(<div key={index} className="ticket-item">
                    <div className="ticket-title">
                        <h4 className="shop-name pull-left"><i className="icon head"/>{ticket.buyer_info.buyer_name}</h4><h5 className="text-orange pull-right">{ticketStatus}</h5>
                    </div>
                    <div className="ticket-goods-list">
                        {ticketGoodsList}
                    </div>
                    <div className="ticket-footer">
                        <div className="ticket-info">
                            <div className="date pull-left"><h6 className="text-assist">下单时间:{ticket.created_at}</h6></div>
                            <div className="price pull-right"><h3 className="pull-right">￥{ticket.order_amount}</h3><h6 className="pull-right">共{ticket.goods_count}件 合计 </h6></div>
                        </div>
                        {this.createTicketOperate(ticket)}
                    </div>
                </div>);
            });
        }

        return ticketList;
    }

    createNone(){
        return(
            <div className="no-ticket">
                <img src="images/complete.png" alt=""/>
                <h3 className="text-assist">暂无销售单</h3>
            </div>
        );
    }

    createTicketOperate(ticket){
        let btnArr = [],
            status = ticket.order_status;

        if(status == 1 || status == 101){
            btnArr.push(<button key={2} data-id={ticket.order_id} onClick={this.orderOperate.bind(this)} className="btn btn-info btn-sm pull-right">取消订单</button>);
            btnArr.push(<button key={1} data-id={ticket.order_id} onClick={this.orderOperate.bind(this)} className="btn btn-default btn-sm pull-right">确认订单</button>);
            btnArr.push(<button key={0} data-name={ticket.buyer_info.buyer_name} data-mobile={ticket.buyer_info.buyer_mobile} data-address={ticket.buyer_info.buyer_address}
                                onClick={this.showBuyer.bind(this)} className="btn btn-default btn-sm pull-right">买家信息</button>);
        }else if(status == 2){
            btnArr.push(<button key={1} data-id={ticket.order_id} onClick={this.orderOperate.bind(this)} className="btn btn-info btn-sm pull-right">确认发货</button>);
            btnArr.push(<button key={0} data-name={ticket.buyer_info.buyer_name} data-mobile={ticket.buyer_info.buyer_mobile} data-address={ticket.buyer_info.buyer_address}
                                onClick={this.showBuyer.bind(this)} className="btn btn-default btn-sm pull-right">买家信息</button>);
        }else if(status == 3){
            btnArr.push(<button key={1} data-id={ticket.order_id} onClick={this.orderOperate.bind(this)} className="btn btn-info btn-sm pull-right">确认收货</button>);
            btnArr.push(<button key={0} data-name={ticket.buyer_info.buyer_name} data-mobile={ticket.buyer_info.buyer_mobile} data-address={ticket.buyer_info.buyer_address}
                                onClick={this.showBuyer.bind(this)} className="btn btn-default btn-sm pull-right">买家信息</button>);
        }else if(status == 4 || status == 5){
            btnArr.push(<button key={0} data-name={ticket.buyer_info.buyer_name} data-mobile={ticket.buyer_info.buyer_mobile} data-address={ticket.buyer_info.buyer_address}
                                onClick={this.showBuyer.bind(this)} className="btn btn-default btn-sm pull-right">买家信息</button>);
        }

        return (<div className="ticket-operate">
            {btnArr}
        </div>);
    }

    ticketStatus(status){
        let s = ['待确认', '待发货', '待收货', '已收货', '已取消'];

        return s[status-1];
    }

    //订单操作
    orderOperate(e){
        let operate = e.target.innerHTML,
            handle = -1,
            orderId = e.target.dataset.id,
            dialogDes = '';

        switch (operate) {
            case '取消订单':
                handle = 0;
                dialogDes = '确定要取消订单？';
                break;
            case '确认订单':
                handle = 1;
                dialogDes = '确定要确认订单？';
                break;
            case '确认发货':
                handle = 2;
                dialogDes = '确定要已经发货？';
                break;
            case '确认收货':
                handle = 3;
                dialogDes = '确定要已经收货？';
                break;
        }

        $.dialog({
            content: '<h4>'+dialogDes+'</h4>',
            seller: true,
            cancel: true,
            okCallback: ()=>{
                $.req.operateTicket(JSON.stringify({handle:handle, order_ids:[orderId]}), (res)=>{
                    if(res.code == 0){
                        this.getTicketList();
                    }else{
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });
    }

    // 展示买家信息
    showBuyer(e){
        let name = e.target.dataset.name,
            mobile = e.target.dataset.mobile,
            address = e.target.dataset.address;

        $.dialog({
            title: '买家信息',
            seller: true,
            content: '<h4 class="text-left">买家姓名：'+name+'</h4>' +
            '<h4 class="text-left">联系电话：'+mobile+'</h4>' +
            '<h4 class="text-left">店铺地址：'+address+'</h4>',
            okText: '联系买家',
            cancel: true,
            okCallback: ()=>{
                window.location.href = 'tel:'+mobile;
            }
        });
    }

    // 进货
    stock(e){
        let orderId = e.target.parentNode.dataset.oid,
            goodId = e.target.parentNode.dataset.gid;

        $.dialog({
            title: '加入找冻品网进货单',
            okText: '加入进货单',
            seller: true,
            cancel: true,
            content: '<div id="addCar" class="add-car">' +
            '<div class="add-car-good">' +
            '<div class="add-good-img"><img src="'+e.target.parentNode.dataset.img+'" class="img-rounded pull-left"></div>' +
            '<div class="add-good-des">' +
            '<h4>商品名：'+e.target.parentNode.dataset.title+'</h4><h4>店铺：'+e.target.parentNode.dataset.shop+'</h4><h4>发货地：'+e.target.parentNode.dataset.market+'</h4></div></div>' +
            '<hr />' +
            '<div class="add-car-num">' +
            '<h4 class="inline">请输入你要购买的数量</h4>' +
            '<div class="good-num inline"><i id="numSub" class="icon sub"></i>' +
            '<input type="number" id="purchaseInput" class="add-car-input" min="1" value="'+e.target.parentNode.dataset.num+'" step="1" readonly>' +
            '<i id="numAdd" class="icon add"></i></div>' +
            '</div></div>',
            okCallback: ()=>{
                $.req.purchase(JSON.stringify({order_id:orderId, goods_id:goodId, purchase_num: $.selector('#purchaseInput').value}), (res)=>{
                    if(res.code ==0 ){
                        $.toast({text:'进货成功'});
                        this.getTicketList();
                    }else{
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });

        $.selector('#numSub').addEventListener('click', ()=>{
            if($.selector('#purchaseInput').value<=0){
                return;
            }
            $.selector('#purchaseInput').value --;
        }, false);

        $.selector('#numAdd').addEventListener('click', ()=>{
            $.selector('#purchaseInput').value ++;
        }, false);
    }

    render() {
        
        return (<div id="sellerSellTicket" className="seller-sell-ticket">
            {this.createTab()}
            <div id="ticketList" className="ticket-list">
                <div id="scroll">
                    {this.state.ticketList.length>0?this.createTicketList():this.createNone()}
                </div>
            </div>
        </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        ticket: state.ticket,
        orderCustom: state.orderCustom,
        ticketOperate: state.ticketOperate,
        purchase:state.purchase
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getTicketList: (data)=>{Action(dispatch, 'fetchTicketList', data);},
        operate:(data)=>{Action(dispatch, 'fetchOrderOperate', JSON.stringify(data));},
        getCustomInfo: (data)=>{Action(dispatch, 'fetchCustomInfo', data);},
        purchase:(data)=>{Action(dispatch, 'fetchPurchase', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Ticket);