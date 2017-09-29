
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';

class FreightCancel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cancelList:[],                              // 已作废运单数组
            senderTotal:0,                              // 发货人总数
            waybillTotal:0,                             // 运单总数
            page:1,
            lastPage:1,
            size:30
        };
        this.getCancelData = this.getCancelData.bind(this);
        this.showWaybill = this.showWaybill.bind(this);
    }

    componentWillMount(){
        this.getCancelData();
    }

    getCancelData() {
        H.server.get_canceled_waybill({
            status: 0,
            start: '2010-01-01',
            end: H.getSouroundDate(-1),
            page: this.state.page,
            size: this.state.size
        }, (res)=>{
            if(res.code == 0) {
                this.setState({
                    cancelList: res.data.charges,
                    senderTotal: res.data.total_shop,
                    waybillTotal: res.data.total_delivery,
                    page: res.data.current,
                    lastPage: res.data.last_page
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建表格
    createTable(){
        let headlines = ['收款号', '发货方', '运单量', '货物量', '收款时间', '金额/元', '撤销人', '撤销时间', '撤销原因'],
            order = ['id', 'sender', 'num', 'volume', 'created_at', 'amount', 'handlerName', 'handlerDate', 'handlerReason'],
            fn = {2: this.showWaybill};

        this.state.cancelList.map((cancel) => {
           cancel.sender = cancel.shop.name+' ['+cancel.shop.mobile+']';
           cancel.handlerName = cancel.cancel_info.name;
           cancel.num = cancel.delivery_num + '单';
           cancel.handlerReason = cancel.cancel_info.reason;

           cancel.handlerDate = cancel.cancel_info.time;
        });

        return (
            <Table values={this.state.cancelList} headlines={headlines} order={order} id={'cancelInfo'} bodyOperate={fn}/>
        );
    }

    // 查看运单详情
    showWaybill(e) {
        let index = e.target.dataset.index,
            deliveryList = this.state.cancelList[index].deliveries;

        let list = '';
        deliveryList.map((delivery)=>{
            list += '<div class="row col-lg-12 form-control-static"><div class="col-lg-8">'+delivery.day_no+'</div><div class="col-lg-4">'+delivery.volume+'件</div></div>';
        });

        H.Modal({
            title: '运单详情',
            content:list,
            okText: '我知道了'
        });
    }

    // 设置页数
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getCancelData);
    }

    render(){
        return (
            <div className="col-lg-12 row">
                <div className="row">
                    <p className="col-lg-6">当前结果：{this.state.senderTotal}个发货人，共{this.state.waybillTotal}个运单</p>
                    <a href="javascript:;" onClick={this.getCancelData.bind(this)} className="col-lg-6 text-right">刷新</a>
                </div>
                {this.createTable()}
                <Paging maxPage={this.state.lastPage} clickCallback={this.setPageNum.bind(this)}/>
            </div>
        );
    }
}

export default FreightCancel;