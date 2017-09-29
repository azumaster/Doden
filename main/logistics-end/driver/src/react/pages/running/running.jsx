
import WaybillInfo from './../../components/waybillInfo.jsx';
import Dialog from './../../components/dialog.jsx';

class Running extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ordersList:[],                           // 订单列表
            driverStatus:0,                          // 司机状态
            map: null,                               // 地图对象
            currentLocation: null,                   // 当前地理信息
            dialogInfo:null,
            choice:false
        };
        this.createMap = this.createMap.bind(this);
        this.createWaybillInfo = this.createWaybillInfo.bind(this);
        this.createDialog = this.createDialog.bind(this);
    }

    componentDidMount(){
        new Promise((resolve)=>{
            // 获取司机当前的状态
            H.server.get_driver_status({}, (res)=>{
                if(res.code == 0){
                    if(res.data.status == 10){
                        this.props.send && this.props.send();
                    } else{
                        resolve(res);
                    }
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    alert(res.message);
                }
            });
        }).then(()=>{
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
        });
    }

    createMap() {

        let location = this.state.ordersList;

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
            AMap.event.addListener(geolocation, 'complete', ()=>{
                map.setFitView();
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
    };

    // 创建配送中的窗口
    createWaybillInfo() {
        let waybillInfo = [];

        waybillInfo.push(
            <WaybillInfo style="waybill-info no-mark" location={this.state.currentLocation} map={this.state.map}/>
        );

        return waybillInfo;
    }

    // 创建模态框
    createDialog() {
        let dialogInfo = this.state.dialogInfo;

        if (!dialogInfo) {
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
                cancelCallback={dialogInfo.cancelCallback}
            />
        );

    }

    start(){
        let hour = new Date().getHours();
        let noSolicitation = false;

        if(this.state.ordersList){
            this.state.ordersList.map((order)=>{
                if(order.status == 10){
                    noSolicitation = true;
                }
            });

            if(hour < 11){
                // 11 点前不能开始配送
                let dialogInfo = {
                    width: '75%',
                    title: '提示',
                    content: (<p style={{margin: '30px', fontSize: '14px'}}>只能11点后才能配送。</p>),
                    confirm: '我知道了',
                    confirmCallback: ()=>{
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    }
                };

                this.setState({
                    dialogInfo: dialogInfo
                }, this.createDialog);

                setTimeout(()=>{
                    $('#dialog').fadeIn('500').find('.dialog').animate({top:'50%'}, '500');
                }, 100);
            } else if(noSolicitation){
                // 判断是否还有未揽货的件
                let dialogInfo = {
                    width: '75%',
                    title: '提示',
                    content: (<p style={{margin: '30px', fontSize: '14px'}}>你还有未揽货的运单，确认要开始配送吗？</p>),
                    confirm: '开始配送',
                    confirmCallback: ()=>{
                        this.props.changePanel && this.props.changePanel();
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    },
                    cancel: '先去揽货',
                    cancelCallback: ()=>{
                        $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                    }
                };

                this.setState({
                    dialogInfo: dialogInfo
                }, this.createDialog);

                setTimeout(()=>{
                    $('#dialog').fadeIn('500').find('.dialog').animate({top:'50%'}, '500');
                }, 100);
            } else {
                this.props.changePanel && this.props.changePanel();
            }
        } else {
            // 12 点前不能开始配送
            let dialogInfo = {
                width: '75%',
                title: '提示',
                content: (<p style={{margin: '30px'}}>今日没有你需要配送的运单。</p>),
                confirm: '我知道了',
                confirmCallback: ()=>{
                    $('#dialog').fadeOut('500').find('.dialog').animate({top:'150%'}, '500');
                }
            };

            this.setState({
                dialogInfo: dialogInfo
            }, this.createDialog);

            setTimeout(()=>{
                $('#dialog').fadeIn('500').find('.dialog').animate({top:'50%'}, '500');
            }, 100);
        }
    }

  render() {
    return (
        <div id="mapContent" className="content">
            <div id="map" className="map"></div>

            <div id="startDelivery" className="start-delivery">
                <button className="btn btn-lg btn-black" type="button" onClick={this.start.bind(this)}>开始配送</button>
            </div>
            {this.createWaybillInfo()}
            {this.createDialog()}
        </div>
        );
    }
}

export default Running;