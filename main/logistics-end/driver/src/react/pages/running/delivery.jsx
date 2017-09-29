/**
 * 司机端-配送中
 * @author 魏华东
 * @date 2016.12.30
 */

import Dialog from './../../components/dialog.jsx';
import WaybillInfo from '../../components/waybillInfo.jsx';
import Map from './../../components/map.jsx';

class Delivery extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ordersList:[],
            dialogInfo: null,
            currentPoints: [],                       // 当前定位点
            currentInfo: null,
            map: null,                               // 地图对象
            showMap: false,                           // 是否显示地图
            currentAddress: null,                    //当前修改的地址信息;
            currentLocation: null,                   // 当前地理信息
            currentMarker:null                       // 当前Marker
        };
        this.touch = this.touch.bind(this);
        this.createMap = this.createMap.bind(this);
        this.createDialog = this.createDialog.bind(this);
        this.createWaybillInfo = this.createWaybillInfo.bind(this);
    }

    componentDidMount(){
        // 司机获取未完成的订单
        H.server.get_unfinish_waybill({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    ordersList: res.data
                }, this.createMap);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                alert(res.message);
            }
        });
    }

    // 创建地图
    createMap() {
        let _this = this,
            location = this.state.ordersList;

        let map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 14
        });

        // 第一次打开地图的时候，根据司机所在位置进行定位
        map.plugin('AMap.Geolocation', function () {
            let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: false,
                buttonPosition:'RT'
            });

            map.addControl(geolocation);
            geolocation.getCurrentPosition();

            AMap.event.addListener(geolocation, 'complete', (data)=>{
                _this.setState({
                    currentPoints: data.position
                }, ()=>{map.setFitView();});
            });
        });

        AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker)=> {

            for (let i = 0; i < location.length; i++) {
                //创建信息窗
                let div = document.createElement('div');
                div.className = 'marker-content';
                div.innerHTML = H.getLadingCode(location[i].code, [2, 3, 4]);

                //创建SimpleMarker实例
                let marker = new SimpleMarker({
                    //前景文字
                    iconLabel: '<div class="marker-content">'+H.getLadingCode(location[i].code, [2, 3, 4])+'</div>',
                    position: [location[i].address.lng, location[i].address.lat],
                    animation: 'AMAP_ANIMATION_DROP',
                    map: map
                });

                marker.on('touchend', () => {
                    // 将点击的marker居中显示

                    let allMarker = map.getAllOverlays('marker');
                    allMarker.map((m)=>{
                        m.setIconStyle('http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png');
                    });
                    marker.setIconStyle('http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png');
                    map.setCenter([location[i].address.lng, location[i].address.lat]);
                    map.panBy(0, -180);

                    this.setState({
                        currentMarker: marker,
                        currentLocation: location[i]
                    });

                    // 弹出下拉框
                    $('#waybillInfo').addClass('active');
                });
            }
        });

        this.setState({
            map: map
        });
    }

    // 创建订单页卡
    createWaybillInfo() {

        let waybillInfo = [],
            operate=['确认送达', '拒收'];

        waybillInfo.push(
            <WaybillInfo style="waybill-info has-mark" location={this.state.currentLocation} error='地址报错' remark="remark"
                operate={operate} touchCallback={this.touch.bind(this)} map={this.state.map}/>
        );

        return waybillInfo;
    }

    // 订单页卡的操作
    touch(e) {
        let html = $(e.target).html(),
            node = e.target,
            currentLocation = this.state.currentLocation,
            dialogInfo = null;

        switch (html) {
            case '地址报错':
                let current = currentLocation;

                if(!current){
                    return null;
                }

                let code = '';
                for(let i=0; i<current.code.length; i++) {
                    code += current.code[i]<10?'0'+current.code[i]:current.code[i];
                }

                this.setState({
                    currentInfo: current,
                    currentAddress: current.address
                }, ()=>{
                    console.log(this.state.currentAddress);
                });

                dialogInfo = {
                    width: '90%',
                    title: '地址报错',
                    content:(
                        <div className="dialog-content">
                            <div className="info">
                                <h5 className="sub-title">订单信息</h5>
                                <div className="detail-info">
                                    <span className="mark mark-green detail-mark"></span>
                                    <span className="detail-label">运单号</span>
                                    <span className="detail-value">{current.day_no}</span>
                                </div>
                                <div className="detail-info">
                                    <span className="mark mark-red detail-mark"></span>
                                    <span className="detail-label">提货码</span>
                                    <span className="detail-value">{code}</span>
                                </div>
                                <div className="detail-info">
                                    <span className="mark detail-mark"></span>
                                    <span className="detail-label">收货人</span>
                                    <span className="detail-value"><a className="tel-link" href={'tel://'+current.custom.mobile}>{current.custom.mobile}</a>（{current.custom.name}）</span>
                                </div>
                            </div>
                            <div className="info">
                                <div className="des">错误地址：{current.address.full}</div>
                                <div className="update">更新地址：<a href="javascript:;" className="click" onTouchEnd={this.updateAddress.bind(this)}><span className="icon">&#xe60d;</span><span id="newAddress">请点击选择</span></a></div>
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
                            H.server.update_address({
                                wid: current.id,
                                id: this.state.newAddress.id,
                                title: this.state.newAddress.title,
                                address: this.state.newAddress.address,
                                type: 0,
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
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    }
                };
                break;
            case '确认送达':
                dialogInfo = {
                    width: '75%',
                    title: '提示',
                    content: (<p style={{margin: '30px', fontSize: '14px'}}>确认该运单已送达？</p>),
                    confirm: '确认送达',
                    confirmCallback: ()=>{
                        H.server.remark_waybill({
                            id: currentLocation.id,
                            note: $('#remark').val()
                        }, (res)=>{
                            if(res.code == 0){
                                H.server.finish_waybill({
                                    id: currentLocation.id
                                }, (res)=>{
                                    if(res.code == 0){
                                        this.state.currentMarker.hide();
                                        $(node).removeClass('active');
                                        $(node).find('.address').html('');
                                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                                        $('#waybillInfo').removeClass('active');
                                    }else if(res.code == 10106) {
                                        H.overdue();
                                    }else {
                                        alert(res.message);
                                    }
                                });
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else {
                                alert(res.message);
                            }
                        });
                    },
                    cancel:'还未送达',
                    cancelCallback: ()=>{
                        $(node).removeClass('active');
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    }
                };
                break;
            case '拒收':
                $(node).addClass('active');
                dialogInfo = {
                    width: '90%',
                    title: '拒收原因',
                    content:(
                        <div className="dialog-content">
                            <textarea id="refuse" className="info textarea" placeholder="请写下收货人拒收理由"></textarea>
                        </div>
                    ),
                    confirm: '确认拒收',
                    confirmCallback:()=> {
                        if($('#refuse').val()!=''){
                            H.server.refuse_waybill({
                                id: currentLocation.id,
                                refuse: $('#refuse').val()
                            }, (res)=>{
                                if(res.code == 0){
                                    this.state.currentMarker.hide();
                                    $(node).removeClass('active');
                                    $(node).find('.address').html('');
                                    $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                                    $('#waybillInfo').removeClass('active');
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else {
                                    alert(res.message);
                                }
                            });
                        } else {
                            alert('拒收理由不能为空哦~');
                        }
                    },
                    cancel: '取消',
                    cancelCallback: ()=>{
                        $(node).removeClass('active');
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    }
                };
                break;
            default:

                // 调起地图导航

                AMap.plugin(['AMap.Driving'], ()=>{

                    let currentPoint = this.state.currentPoints,
                        points = [this.state.currentLocation.address.lng, this.state.currentLocation.address.lat];

                    let driving = new AMap.Driving({policy:AMap.DrivingPolicy.LEAST_TIME, map:map});

                    driving.searchOnAMAP({
                        origin: currentPoint,
                        destination: points
                    });

                });

                break;
        }

        this.setState({
            dialogInfo: dialogInfo
        }, this.createDialog);

        setTimeout(()=>{
            $('#dialog').fadeIn('500').find('.dialog').animate({top:'50%'}, '500');
        }, 100);

    };

    // 更新地址
    updateAddress() {
        this.setState({showMap: true});
    }

    setCurrentAddress(obj) {
        if(obj) {
            $('#newAddress').html(obj.address);
            this.setState({
                newAddress: obj
            });
        }
        this.setState({
            showMap: false
        });
    }

    // 创建模态框
    createDialog() {
        let dialogInfo = this.state.dialogInfo;

        if(!dialogInfo){
            return null;
        }

        return (
            <Dialog
                width={dialogInfo.width}
                height={dialogInfo.height}
                title={dialogInfo.title}
                content={dialogInfo.content}
                confirm={dialogInfo.confirm}
                confirmCallback={dialogInfo.confirmCallback}
                cancel={dialogInfo.cancel}
                cancelCallback = {dialogInfo.cancelCallback}
            />
        );
    }

    render() {
        return (
            <div id="mapContent" className="content delivery-content">
                <div>
                    <div id="map" className="map"></div>
                    {this.createWaybillInfo()}
                    {this.createDialog()}
                </div>
                {this.state.showMap?<Map currentAddress={this.state.currentAddress} setCurrentAddress={this.setCurrentAddress.bind(this)} />:null}
            </div>
        );
    }
}

export default Delivery;