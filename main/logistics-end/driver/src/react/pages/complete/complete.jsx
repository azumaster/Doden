/**
 * 司机端-已完成
 * @author 魏华东
 * @date 2016-12-30
 */

import Dialog from './../../components/dialog.jsx';
import Map from './../../components/map.jsx';

class Complete extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            completeList:[],                 // 已完成订单列表
            currentComplete:null,            // 当前完成订单
            currentAddress:null,              // 当前地址
            newAddress:null,                  // 新地址
            showMap:false
        };
        this.createScroll = this.createScroll.bind(this);
        this.getCompleteList = this.getCompleteList.bind(this);
        this.createCompletePanel = this.createCompletePanel.bind(this);
        this.createDialog = this.createDialog.bind(this);
    }

    componentWillMount() {

        this.getCompleteList();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll() {
        var wrapper = document.getElementById('complete'),
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
    }

    // 获取已完成运单列表
    getCompleteList() {
        H.server.get_complete_order({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    completeList: res.data,
                    currentAddress: res.data.address
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                alert(res.message);
            }
        });
    }

    // 创建Dialog
    createDialog(){
        let currentComplete = this.state.currentComplete,
            code = '';

        if(!currentComplete) {
            return null;
        }


        code = H.getLadingCode(currentComplete.code, [2, 3, 4]);

        let dialogInfo = {
            width: '90%',
            title: '地址报错',
            content:(
                <div className="dialog-content">
                    <div className="info">
                        <h5 className="sub-title">订单信息</h5>
                        <div className="detail-info">
                            <span className="mark mark-green detail-mark"></span>
                            <span className="detail-label">运单号</span>
                            <span className="detail-value">{currentComplete.day_no}</span>
                        </div>
                        <div className="detail-info">
                            <span className="mark mark-red detail-mark"></span>
                            <span className="detail-label">提货码</span>
                            <span className="detail-value">{code}</span>
                        </div>
                        <div className="detail-info">
                            <span className="mark detail-mark"></span>
                            <span className="detail-label">收货人</span>
                            <span className="detail-value"><a className="tel-link" href={'tel://'+currentComplete.custom.mobile}>{currentComplete.custom.mobile}</a>（{currentComplete.custom.name}）</span>
                        </div>
                    </div>
                    <div className="info">
                        <div className="des">错误地址：{currentComplete.address.full}</div>
                        <div className="update">更新地址：<a href="javascript:;" onTouchEnd={this.locate.bind(this)} className="click"><span className="icon">&#xe60d;</span><span id="newAddress">请点击选择</span></a></div>
                    </div>
                    <div className="info">
                        <div className="notice">1.请确认你已到达客户的取货地址</div>
                        <div className="notice">2.请打开你的GPS</div>
                    </div>
                </div>
            ),
            confirm: '确认',
            confirmCallback: ()=>{

                if(this.state.newAddress){
                    console.log(newAddress);

                    H.server.update_address({
                        wid: currentComplete.id,
                        id: this.state.newAddress.id,
                        title: this.state.newAddress.title,
                        address: this.state.newAddress.address,
                        type:0,
                        location: {
                            lat: this.state.newAddress.location.lat,
                            lng: this.state.newAddress.location.lng
                        },
                        adcode: this.state.newAddress.adcode
                    }, (res)=>{
                        if(res.code == 0){
                            this.setState({
                                newAddress: null
                            });
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else {
                            alert(res.message);
                        }
                    });
                }

                $('#newAddress').html('请点击选择');
                $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
            },
            cancel: '取消',
            cancelCallback: ()=>{
                $('#newAddress').html('请点击选择');
                $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
            }
        };

        return (
            <Dialog
                width={dialogInfo.width}
                title={dialogInfo.title}
                content={dialogInfo.content}
                confirm={dialogInfo.confirm}
                confirmCallback={dialogInfo.confirmCallback}
                cancel={dialogInfo.cancel}
                cancelCallback = {dialogInfo.cancelCallback}
            />
        );
    }

    // 选择新的地址
    locate() {
        this.setState({
            showMap: true
        });
    }

    // 创建已完成列表项
    createCompletePanel(){
        let panel = [];


        if(this.state.completeList){
            this.state.completeList.map((order, index)=>{
                let completeStyle, completeDes, code='';
                if(order.status==41){
                    completeStyle = ' refuse';
                    completeDes = '已拒绝';
                } else if(order.status == 40) {
                    completeStyle = ' send';
                    completeDes = '已送达';
                }

                code = H.getLadingCode(order.code, [2, 3, 4]);

                panel.push(
                    <div className="complete-item" data-index={index} data-id={order.id}>
                        <div className={'complete-title' + completeStyle}>
                            <span className="icon title-icon">&#xe614;</span>
                            <span className="time">{order.time}</span>
                            <span className="status">{completeDes}</span>
                        </div>
                        <div className="complete-body">
                            <div className="info">
                                <h5 className="sub-title">配送信息</h5>
                                <div className="detail-info">
                                    <span className="mark mark-green detail-mark"></span>
                                    <span className="detail-label">发货人</span>
                                    <span className="detail-value"><a className="tel-link" href={'tel://'+order.shop.mobile}>{order.shop.mobile}</a></span>
                                </div>
                                <div className="detail-info">
                                    <span className="mark mark-red detail-mark"></span>
                                    <span className="detail-label">收货人</span>
                                    <span className="detail-value"><a className="tel-link" href={'tel://'+order.custom.mobile}>{order.custom.mobile}</a>（{order.custom.name}）</span>
                                </div>
                            </div>
                            <div className="info">
                                <h5 className="sub-title">订单信息</h5>
                                <div className="detail-info">
                                    <span className="mark mark-green detail-mark"></span>
                                    <span className="detail-label">运单号</span>
                                    <span className="detail-value">{order.day_no}</span>
                                </div>
                                <div className="detail-info">
                                    <span className="mark mark-red detail-mark"></span>
                                    <span className="detail-label">提货码</span>
                                    <span className="detail-value">{code} <a href="javascript:;" className="error-link" onTouchEnd={this.updateDialog.bind(this)}>地址报错</a></span>
                                </div>
                            </div>
                            {order.status==41?
                                <div className="info">
                                    <div className="detail-info">
                                        <span className="mark mark-green detail-mark"></span>
                                        <span className="detail-label">拒绝理由</span>
                                    </div>
                                    <div className="detail-info">
                                        <p className="detail-describe">{order.refuse}</p>
                                    </div>
                                </div>
                                :''
                            }
                            <div className="info">
                                <div className="detail-info">
                                    <span className="mark mark-orange detail-mark"></span>
                                    <span className="detail-label">备注</span>
                                </div>
                                <div className="detail-info">
                                    <p className="detail-describe">{order.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        return panel;
    }

    // 更新Dialog
    updateDialog(e) {

        // 获取当前的运单的信息
        let index = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.index;


        this.setState({
            currentComplete: this.state.completeList[index]
        }, ()=>{
            this.createDialog();
            $('#dialog').fadeIn('500').find('.dialog').animate({top:'50%'}, '500');
        });
    }

    //设置当前修改或者添加时提交的参数;
    setCurrentAddress(obj) {
        if(obj) {
            $('#newAddress').html(obj.address);
            this.setState({
                newAddress: obj
            });
        }
        console.log(this.state.currentAddress);
        console.log(obj);
        this.setState({
            showMap: false
        });
    }

    render() {
        return (
            <div id="complete"  className="complete-content">

                    <div className="scroller">
                        {this.createCompletePanel()}
                    </div>
                {this.createDialog()}
                {this.state.showMap?
                    <Map currentAddress={this.state.currentAddress} setCurrentAddress={this.setCurrentAddress.bind(this)}/>
                :null}
            </div>
        );
    }
}

export default Complete;