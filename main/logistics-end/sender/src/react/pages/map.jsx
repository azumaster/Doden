/*
* 添加和修改地址时用的地图;
* */

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: '',                  //搜索输入框的值;
            lastTime: 0,              //记录上一次输入的时间;
            list: [],                 //搜索出来的地址列表数据;
            showSearchList: false,    //是否显示搜索的地址列表;
            currentMarker: null,      //当前被选中的点的信息;
            confirm: false,           //是否显示确认的弹窗;
            showNotice:true,          // 是否显示提示
            showAddressNotice:false,        // 是否显示地址提示
            noPlace:false,            // 是否无地点
            searchActive:0,
            status: false             //修改的时候初始化地址位置时不需要地址逆解析;
        };
        this.createScroll = this.createScroll.bind(this);
        this.createList = this.createList.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.updateMarker = this.updateMarker.bind(this);
        this.mapGeocodeRegeo = this.mapGeocodeRegeo.bind(this);
        this.closeNotice = this.closeNotice.bind(this);
    }

    componentDidMount() {
        this.createScroll();
        let map = new AMap.Map('mapContent', {
            zoom: 11
        });
        this.state.map = map;
        if(this.state.currentMarker) {
            if(this.state.currentMarker.location){
                this.addMarker(this.state.currentMarker.location);
            }else {
                this.addMarker(this.state.currentMarker);
            }
        }
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('mapAddressListWrap'),
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

    //搜索地址的输入框值变化时;
    searchChange(e) {
        let val = e.target.value,
            time = e.timeStamp;
        this.state.lastTime = time;
        this.setState({val: val, confirm:false, search: true, shopNotice:false});
        setTimeout(() => {
            //如果时间差为0，也就是你停止输入0.5s之内都没有其它的change事件产生，这个时候就可以去请求服务器了
            if(this.state.lastTime - time == 0 && val){

                // 弹窗提示
                if(this.state.searchActive === 0 && /\d+楼|小区|\d+层|附\d+|副\d+|高新区|高新西区|天府新区/g.test(val)){
                    val = val.replace(/\d+楼|小区|\d+层|附\d+|副\d+|高新区|高新西区|天府新区/g, '');
                    this.setState({
                        showAddressNotice: true,
                        searchActive:1
                    }, ()=>{
                        H.server.map_search_hint(JSON.stringify({keyword: val, policy: 1, region: '成都'}), (res) => {
                            if(res.code == 0) {
                                if(res.data.tips.length>0){
                                    this.setState({list: res.data.tips, showSearchList: true, noPlace:false, showNotice:false});
                                }else {
                                    this.setState({noPlace:true});
                                }
                            }
                        });
                    });
                } else {
                    val = val.replace(/\d+楼|小区|\d+层|附\d+|副\d+|高新区|高新西区|天府新区/g, '');
                    H.server.map_search_hint(JSON.stringify({keyword: val, policy: 1, region: '成都'}), (res) => {
                        if(res.code == 0) {
                            if(res.data.tips.length>0){
                                this.setState({list: res.data.tips, showSearchList: true, noPlace:false, showNotice:false});
                            }else {
                                this.setState({noPlace:true});
                            }
                        }
                    });
                }
            }
        }, 500);
    }

    createList() {
        let list = this.state.list,
            xml = [];

        if(list.length>0){
            xml.push(
                list.map((val, index) => {
                    return (
                        <li className="flex-box center" onClick={this.mapLocation.bind(this, index)}>
                            <div className="location-icon"></div>
                            <div className="flex-num1">
                                <div className="hd">{val.title}</div>
                                <div className="bd">{val.address}</div>
                            </div>
                        </li>
                    );
                })
            );
        }
        return (<ul className="map-address-list">{xml}</ul>);
    }

    //逆地址解析, 通过经纬度获取相关的坐标的详细信息;
    mapGeocodeRegeo(lng, lat) {
        let param = {
            lng: lng,
            lat: lat,
            get_poi: 1
        };
        H.server.map_geocode_regeo(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                let pois = res.data.pois;
                pois.sort(function(a, b){
                    return a._distance-b._distance;
                });
                this.state.currentMarker = {
                    id: pois[0].id,
                    title: pois[0].title,
                    address: pois[0].address,
                    location: {
                        lng: pois[0].location.lng,
                        lat: pois[0].location.lat
                    },
                    adcode: pois[0].ad_info.adcode
                };
                this.state.marker.setPosition([pois[0].location.lng, pois[0].location.lat]);
                this.setState({confirm: true});
            }
        });
    }

    mapLocation(index) {
        let data = this.state.list[index];
        if(this.state.marker) {
            this.updateMarker(data.location);
        }else {
            this.addMarker(data.location);
        }
        this.setState({showSearchList: false, showNotice: true, currentMarker: data, confirm: true});
    }

    //地图上添加点标记;
    addMarker(location) {
        let marker = new AMap.Marker({
            position: [location.lng, location.lat],
            map: this.state.map,
            draggable: true
        });
        this.state.marker = marker;
        this.state.map.setCenter([location.lng, location.lat]);
        this.state.map.setZoom(16);
        marker.on('touchend', ()=>{
            let position = marker.getPosition();
            this.state.map.setCenter([position.lng, position.lat]);
            this.state.map.setZoom(16);
            this.mapGeocodeRegeo(position.lng, position.lat);   //通过新的坐标解析的接口;
        });

    }

    //更新地图上的点标记;
    updateMarker(location) {
        this.state.marker.setPosition([location.lng, location.lat]); //更新点标记位置;
        this.state.map.setCenter([location.lng, location.lat]);
        if(this.state.map.getZoom() != 16) {
            this.state.map.setZoom(16);
        }
    }

    confirmAddress() {
        let data = this.state.currentMarker;
        this.props.setCurrentAddress && this.props.setCurrentAddress(data);
    }

    closeNotice(){
        this.setState({
            showAddressNotice: false
        });
    }

    render() {
        let address = null,
            notice = '';
        if(this.state.currentMarker) {
            if(this.state.currentMarker.full) {
                address = this.state.currentMarker.full;
            }else {
                address = this.state.currentMarker.address;
            }
        }


        // 确定提示的内容
        if(this.state.noPlace){
            notice = '"高德地图"中没有这个地址，建议您确认后重新填写，或拨打客服电话咨询：13058941397';
        }else {
            notice = '"高德地图"暂时只能精确到"xxx街xxx号"，不能搜索"附x号"、"x楼"、"x栋"';
        }

        return (
            <div className="map-wrap" id="send-map">
                <div className="search-bar">
                    <div className="search-wrap flex-num1"><input type="text" placeholder="查找小/大厦/街道等" onChange={this.searchChange.bind(this)} /></div>
                    <div className="cancel" onClick={this.props.setCurrentAddress.bind(this, false)}>取消</div>
                </div>
                {this.state.showNotice?<div id="mapNotice" className="map-notice-bar">{notice}</div>:null}
                <div id="mapContent" className="map-content"></div>
                <div id="mapAddressListWrap" className="map-address-list-wrap" style={this.state.showSearchList ? null : {display: 'none'}}>
                    <div className="scroller">
                        {this.createList()}
                    </div>
                </div>
                {this.state.showAddressNotice?
                    <div id="mapAddressNotice" className="map-address-notice">
                        <div className="map-address-notice-content">
                            <p>为保障配送效率，我们暂时无法提供上楼、进院、进商场服务，请联系收货人接到电话后到路边取货，谢谢理解与支持。</p>
                            <p>客服电话：<a href="tel://13058641397">13058641397</a> </p>
                            <a className="button" href="javascript:;" onClick={this.closeNotice}>我知道了</a>
                        </div>
                    </div>
                :null}
                {
                    this.state.confirm ?
                        <div className="confirm-address-wrap">
                            <div className="confirm-address-title">确认“{this.props.currentAddress.name || this.state.currentMarker.address.title}”在这个地方吗？</div>
                            <div className="confirm-address-info">
                                {address}
                            </div>
                            <div className="confirm-address-btn" onClick={this.confirmAddress.bind(this)}>确认</div>
                        </div> : null
                }
            </div>
        );
    }
}

export default Map;