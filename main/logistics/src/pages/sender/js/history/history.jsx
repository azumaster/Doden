/*
* 历史记录;
* */
import OrderInfo from './../order-info.jsx';
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultParam: {   //历史订单列表;
                page: 1,
                size: 10
            },
            list: [],         //历史数据列表;
            total: 0,         //总条数;
            orderInfo: []     //订单详情数据;
        };

        this.getHistoryData = this.getHistoryData.bind(this);
        this.createOrderList = this.createOrderList.bind(this);
    }

    componentWillMount() {
        this.getHistoryData();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
        this.state.SCROLL1 && this.state.SCROLL1.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('historyWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        SCROLL.on('scroll', () => {
            if(this.state.list.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getHistoryData();
            }
        });
        SCROLL.on('scrollEnd', () => {
            if(this.state.list.length >= this.state.total) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getHistoryData();
            }
        });


        var wrapper1 = document.getElementById('orderInfoWrap'),
            SCROLL1 = new IScroll(wrapper1, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });

        this.state.SCROLL = SCROLL;
        this.state.SCROLL1 = SCROLL1;
    }

    getHistoryData() {
        let param = this.state.defaultParam;
        H.we_loading.show();
        H.server.shop_order(param, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                this.state.list = this.state.list.concat(res.data.orders);
                this.state.total = res.data.total;
                this.forceUpdate();
            }else {
                H.operationState(res.message);
            }
        });
    }

    createOrderList() {
        let list = this.state.list,
            xml = [];
        xml.push(list.map((val) => {
            return (
                <li className="flex-box order-item">
                    <div className="flex-num1">
                        <div className="hd">{val.created}</div>
                        <div className="bd">合计数量 <span className="num">{val.volume}件</span></div>
                    </div>
                    <div className="check-order-info" data-id={val.id}>查看</div>
                </li>
            );
        }));

        return (<ul onClick={this.clickHandler.bind(this)}>{xml}</ul>);
    }

    //查看订单详情;
    clickHandler(e) {
        let id = e.target.dataset.id;
        if(!id) return;
        H.we_loading.show();
        H.server.shop_order_({}, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                //this.setState({orderInfo: res.data});
                this.state.orderInfo = res.data;
                window.location.href = '#history/info';
            }else {
                H.operationState(res.message);
            }
        }, id);
    }

    render() {
        let hash = this.props.hash;
        return (
            <div>
                <div id="historyWrap" className="history-wrap">
                    <div className="scroller">
                        {this.createOrderList()}
                    </div>
                </div>
                <div id="orderInfoWrap" className="order-info-wrap" style={hash == 'history/info' ? null : {display: 'none'}}>
                    <div className="scroller">
                        {this.state.orderInfo.length > 0 ? (<OrderInfo SCROLL={this.state.SCROLL1} list={this.state.orderInfo} />) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default History;