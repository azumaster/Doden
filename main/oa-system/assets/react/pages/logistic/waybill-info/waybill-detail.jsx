/**
 * 运单明细页
 * @author: 魏华东
 * @date: 2016.12.15
 */

import React from 'react';

class WaybillDetail extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            btnNames: ['保存'],
            waybillId:0,
            waybillInfo:null,
            driverList:[],
            address:null,
            changeAddress:false,
            volume: null             //货量信息;
        };
        this.getData = this.getData.bind(this);
        this.createDriverSelect = this.createDriverSelect.bind(this);
    }

    componentWillMount() {
        let id = this.props.waybillId;

        // 预加载地图API
        if($('#mapScript').length <= 0){
            let mapScript = '<script id="mapScript" type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=56e401b127998ede0364e18d6877f0f1&plugin=AMap.Geocoder,AMap.MouseTool,AMap.PolyEditor"></script>';
            $('body').append(mapScript);
        }

        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }

        this.setState({
            waybillId: id
        }, this.getData);

    }

    // 获取数据
    getData() {
        new Promise((resolve)=>{
            H.server.get_driver_info({page:1, size:40}, (res)=>{
                if(res.code == 0){
                    this.setState({
                        driverList: res.data.drivers
                    }, ()=>{resolve(res);});
                } else if(res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            H.server.get_current_waybill({id: this.state.waybillId}, (res)=>{
                if(res.code == 0){
                    let waybillInfo = res.data;

                    switch (waybillInfo.status){
                        case '-12':
                            waybillInfo.statusDes = '已取消（后台）';
                            break;
                        case '-11':
                            waybillInfo.statusDes = '已取消（发货人）';
                            break;
                        case '-10':
                            waybillInfo.statusDes = '已取消';
                            break;
                        case 0:
                            waybillInfo.statusDes = '待揽货';
                            break;
                        case 10:
                            waybillInfo.statusDes = '待装车';
                            break;
                        case 20:
                            waybillInfo.statusDes = '已装车';
                            break;
                        case 30:
                            waybillInfo.statusDes = '配送中';
                            break;
                        case 40:
                            waybillInfo.statusDes = '已送达';
                            break;
                    }
                    this.state.waybillInfo = waybillInfo;
                    let address = waybillInfo.address;
                    address.address = waybillInfo.address.full;
                    address.adcode = waybillInfo.address.area.id;
                    address.location = {'lng': waybillInfo.address.lng, 'lat': waybillInfo.address.lat};
                    this.state.old_address = waybillInfo.address.full;
                    this.setState({address: address});
                } else if(res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal(res.message);
                }
            });
        });
    }

    //创建运单信息的panel
    createWaybillInfoPanel() {
        let waybill = this.state.waybillInfo;

        if(!waybill) return null;

        return (
            <div className="panel panel-default">
                <div className="panel-heading">运单信息</div>
                <div className="panel-body">
                    <div className="row">
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">运单号：</label>
                                <div className="col-lg-8"><p className="form-control-static">{waybill.day_no}</p></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">配送日期：</label>
                                <div className="col-lg-8"><input id="waybillDay" type="date" className="form-control" min={H.getSouroundDate(0)} defaultValue={waybill.day}/></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">合计件数：</label>
                                <div className="col-lg-8"><input id="waybillVolume" type="number" className="form-control" defaultValue={waybill.volume}/></div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">运单状态：</label>
                                <div className="col-lg-8"><p className="form-control-static">{waybill.statusDes}</p></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">代收货款：</label>
                                <div className="col-lg-8"><input id="waybillAmount" type="number" defaultValue={waybill.amount} className="form-control"/></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">备注：</label>
                                <div className="col-lg-8"><textarea id="waybillNote" rows="2" className="form-control" style={{resize:'none'}} defaultValue={waybill.info!==null?waybill.info.note:null} /></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="panel-footer" style={{height: '55px'}}>
                    <button className="btn btn-lg btn-default pull-right" onClick={this.saveBasic.bind(this)}>保存</button>
                </div>
            </div>
        );
    }

    addNum() {
        //console.log(1);
    }

    //创建货量信息;
    createVolumePanel() {
        let volume = this.state.volume;
        return (
            <div className="panel panel-default">
                <div className="panel-heading">货量信息</div>
                <div className="panel-body">
                    <div className="row volume-wrap">
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon" onClick={this.addNum.bind(this)}>+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon">+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon">+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon">+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon">+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <label className="col-lg-4 control-label">小件（0-10kg）{volume}</label>
                            <div className="col-lg-6">
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">-</div>
                                        <input type="text" className="form-control text-center"/>
                                        <div className="input-group-addon">+</div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="panel-footer" style={{height: '55px'}}>
                    <button className="btn btn-lg btn-default pull-right" onClick={this.saveBasic.bind(this)}>保存</button>
                </div>
            </div>
        );
    }

    // 创建司机列表
    createDriverSelect(){
        let options = [],
            waybill = this.state.waybillInfo,
            driverList = this.state.driverList,
            driverIndex = 0;

        if(driverList){
            driverIndex = -1;
            for(let i=0; i<driverList.length; i++){
                if(waybill.driver){
                    if(driverList[i].uid == waybill.driver.uid){
                        options.push(<option key={i} data-index={i} value={i}>{driverList[i].car_no+' '+driverList[i].name}</option>);
                        driverIndex = i;
                    } else {
                        options.push(<option key={i} data-index={i} value={i}>{driverList[i].car_no+' '+driverList[i].name}</option>);
                    }
                } else {
                    options.push(<option key={i} data-index={i} value={i}>{driverList[i].car_no+' '+driverList[i].name}</option>);
                }
            }
        }

        return(
            <select id="waybillDriver" defaultValue={driverIndex} className="form-control" onChange={this.changeDriver.bind(this)}>
                <option value={-1}>选择司机</option>
                {options}
            </select>
        );
    }

    //创建车辆信息的panel
    createCarInfoPanel() {
        let waybill = this.state.waybillInfo,
            driverList = this.state.driverList;

        if(!waybill||!driverList) {
            return null;
        }

        return (
            <div className="panel panel-default">
                <div className="panel-heading">车辆信息</div>
                <div className="panel-body">
                    <div className="row">
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">司机：</label>
                                <div className="col-lg-8">
                                    {this.createDriverSelect()}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">车辆状态：</label>
                                <div className="col-lg-8"><p className="form-control-static">{waybill.statusDes?waybill.statusDes:''}</p></div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">运力类型：</label>
                                <div className="col-lg-8"><p className="form-control-static">{waybill.driver?waybill.driver.capacity:''}</p></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">今日运力：</label>
                                <div className="col-lg-8"><p className="form-control-static">已分配{waybill.driver?waybill.driver.customs?waybill.driver.customs:0:0}户，共{waybill.driver?waybill.driver.volume?waybill.driver.volume:0:0}件</p></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="panel-footer" style={{height: '55px'}}>
                    <button className="btn btn-lg btn-default pull-right" onClick={this.saveDriver.bind(this)}>保存</button>
                </div>
            </div>
        );
    }

    //创建发货人信息的panel
    createSenderPanel() {
        let waybill = this.state.waybillInfo;

        if(!waybill) {
            return null;
        }

        return (
            <div className="panel panel-default">
                <div className="panel-heading">发货人信息</div>
                <div className="panel-body">
                    <div className="row">
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">发货人：</label>
                                <div className="col-lg-8"><input id="waybillShopName" type="text" className="form-control" defaultValue={waybill.shop.name}/></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">电话：</label>
                                <div className="col-lg-8"><input id="waybillShopMobile" type="tel" className="form-control" defaultValue={waybill.shop.mobile}/></div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">地址：</label>
                                <div className="col-lg-8"><input id="waybillShopAddress" type="text" className="form-control" defaultValue={waybill.shop.address}/></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="panel-footer" style={{height: '55px'}}>
                    <button className="btn btn-lg btn-default pull-right" style={{marginLeft:'30px'}} onClick={this.saveShop.bind(this)}>永久保存</button>
                    <button className="btn btn-lg btn-default pull-right" onClick={this.saveShop.bind(this)}>保存本次</button>
                </div>
            </div>
        );
    }

    //创建收货人信息的panel
    createConsigneePanel() {
        let waybill = this.state.waybillInfo,
            code = '';

        if(!waybill) {
            return null;
        }

        code = H.getLadingCode(waybill.code, [2, 3, 4]);

        return (
            <div className="panel panel-default">
                <div className="panel-heading">收货人信息</div>
                <div className="panel-body">
                    <div className="row">
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">提货码：</label>
                                <div className="col-lg-8"><p className="form-control-static">{code}</p></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">区域：</label>
                                <div className="col-lg-8"><p className="form-control-static">{waybill.address.area.name}</p></div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">收货人：</label>
                                <div className="col-lg-4"><input id="waybillCustomName" type="text" className="form-control" defaultValue={waybill.custom.name}/></div>
                                <div className="col-lg-4" style={{lineHeight: '34px'}}>（{waybill.address.title}）</div>
                            </div>
                        </form>
                        <form className="col-lg-6 form-horizontal">
                            <div className="form-group">
                                <label className="col-lg-2 control-label">地址：</label>
                                <div className="col-lg-6"><input id="waybillCustomAddress" type="text" className="form-control" defaultValue={waybill.address.full}/></div>
                                <a href="javascript:;" className="col-lg-2 form-control-static" onClick={this.watchMap.bind(this)}>查看地图</a>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">坐标：</label>
                                <div className="col-lg-6"><input id="waybillCustomLocation" type="text" className="form-control" readOnly="readOnly" defaultValue={waybill.address.lng&&waybill.address.lat ? waybill.address.lng + ',' + waybill.address.lat : null}/></div>
                                <a href="javascript:;" className="col-lg-2 form-control-static" onClick={this.refreshMap.bind(this)}>刷新坐标</a>
                            </div>
                            <div className="form-group">
                                <label className="col-lg-2 control-label">收货电话：</label>
                                <div className="col-lg-8"><input id="waybillCustomMobile" type="tel" className="form-control" defaultValue={waybill.custom.mobile}/></div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="panel-footer" style={{height: '55px'}}>
                    <button id="saveCustomL" className="btn btn-lg pull-right btn-default" style={{marginLeft:'30px'}} onClick={this.saveCustom.bind(this)}>永久保存</button>
                    <button id="saveCustom" className="btn btn-lg pull-right btn-default" onClick={this.saveCustom.bind(this)}>保存本次</button>
                </div>
            </div>
        );
    }

    // 查看地图
    watchMap() {
        // 获取坐标
        let points = $('#waybillCustomLocation').val().split(','),
            map = null,
            marker = null;
        H.Modal({
            title: '确认地图',
            width: 640,
            content: '<div style="position: relative;"><div id="map" style="width:590px; height:300px;"></div><div style="position: absolute;top: 0; left: 10px;">' +
            '<div class="form-inline"><input id="searchInputAddress" style="width: 300px;" type="text" class="form-control" value="'+$('#waybillCustomAddress').val()+'" />' +
            '<button id="searchLocation" type="button" class="btn btn-sm btn-default">定位</button></div></div></div>',
            okText: '保存',
            cancel: true,
            cancelText: '关闭',
            okCallback: () => {
                $('#waybillCustomLocation').val(points.join(','));
                $('#waybillCustomAddress').val($('#searchInputAddress').val());
            }
        });

        //创建地点标记;
        function createMarker(points){
            marker = new AMap.Marker({
                position: points,
                map: map,
                draggable: true,
                cursor: 'move'
            });
            marker.on('dragend', () => {   //给点标记加拖拽事件，拖拽结束时执行;
                let position = marker.getPosition();
                map.setCenter([position.lng, position.lat]);
                map.setZoom(16);
                let param = {
                    lng: position.lng,
                    lat: position.lat,
                    get_poi: 1
                };
                H.server.gecode_address(param, (res) => {  //通过坐标获取详细的地址,取最近的一个点;
                    if(res.code == 0) {
                        let pois = res.data.pois;
                        pois.sort(function(a, b){
                            return a._distance-b._distance;
                        });
                        points = [pois[0].location.lng, pois[0].location.lat];
                        marker.setPosition(points);
                        $('#searchInputAddress').val(pois[0].address);
                    }
                });
            });
        };

        setTimeout(()=>{
            let mapParam = {
                resizeEnable: true,
                zoom: 16
            };
            if(points.length == 2) {   //有坐标时;根据坐标生成地址并且创建点标记;
                mapParam = {
                    resizeEnable: true,
                    zoom: 16,
                    center: points
                };
                map = new AMap.Map('map', mapParam);
                createMarker(points);
            }else {        //没有坐标时根据地址创建点标记;
                map = new AMap.Map('map', mapParam);
                $('#searchLocation')[0].click();
            }
        }, 100);
        $('#searchLocation').click(() => {
            let a = $('#searchInputAddress').val();
            H.server.get_all_address({keyword: a, policy: 1}, (res) => {
                if(res.code == 0) {
                    let data = res.data.tips;
                    this.state.address = data[0];
                    this.state.changeAddress = true;
                    if(data[0]) {
                        points = [data[0].location.lng, data[0].location.lat];
                        if(marker) {
                            marker.setPosition(points);
                        }else {
                            createMarker(points);
                        }
                        map.setCenter(points);
                        //$('#searchInputAddress').val(data[0].address);
                    }
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    // 刷新坐标
    refreshMap() {
        let address = $('#waybillCustomAddress').val(),
            points = [];

        H.server.get_all_address({keyword: address, region: '成都', policy: 1}, (res)=>{
            if (res.code == 0) {
                this.setState({
                    address: res.data.tips[0],
                    changeAddress: true
                }, ()=>{
                    res.data.tips.map((address)=>{
                        points.push([address.location.lng, address.location.lat]);
                    });

                    $('#waybillCustomAddress').val(res.data.tips[0].address);
                    $('#waybillCustomLocation').val(points[0]);
                    $('#saveCustomL').addClass('btn-default').removeAttr('disabled').click(this.saveCustom.bind(this));
                    $('#saveCustom').addClass('btn-default').removeAttr('disabled').click(this.saveCustom.bind(this));
                });
            } else if (res.code == 10106) {
                H.overdue();
            } else {
                H.Modal('刷新失败');
            }
        });
    }

    // 改变司机的选项
    changeDriver(e) {
        let index = e.target.selectedIndex -1,
            currentDriver = this.state.waybillInfo;
        if(index==-1){
            return;
        }

        if(!currentDriver.driver){
            currentDriver.driver = {};
        }

        currentDriver.driver.capacity = this.state.driverList[index].capacity?this.state.driverList[index].capacity:currentDriver.driver.capacity;
        currentDriver.driver.customs = this.state.driverList[index].customs?this.state.driverList[index].customs:currentDriver.driver.customs;
        currentDriver.driver.volume = this.state.driverList[index].volume?this.state.driverList[index].volume:currentDriver.driver.volume;


        this.setState({
           waybillInfo: currentDriver
        });
    }

    // 保存运单信息
    saveBasic(){
        // 获取数据
        let day = $('#waybillDay').val(),
            volume = $('#waybillVolume').val(),
            amount = $('#waybillAmount').val(),
            note = $('#waybillNote').val();

        H.Modal({
            title:'保存运单信息',
            content:'确认保存这条运单信息？',
            cancel:true,
            okText: '确认保存',
            okCallback: ()=>{
                H.server.update_waybill_detail({
                    method: 'basic',
                    id: this.props.waybillId,
                    day: day,
                    volume: volume,
                    amount: amount,
                    note:note
                }, (res)=>{
                    if(res.code == 0){
                        H.Modal('保存成功！');
                        this.getData();
                    } else if(res.code == 10106) {
                        H.overdue();
                    } else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    // 保存司机信息
    saveDriver() {
        let select = $('#waybillDriver').get(0).selectedIndex-1;
        console.log(select);
        let driverId = this.state.driverList[select].uid;

        H.Modal({
            title: '保存司机信息',
            content: '确定选择该司机？',
            cancel: true,
            okText: '确认修改',
            okCallback: ()=>{
                H.server.update_waybill_detail({
                    id: this.props.waybillId,
                    method: 'driver',
                    driver_id: driverId
                }, (res)=>{
                    if(res.code == 0){
                        H.Modal('保存成功！');
                        this.getData();
                    } else if(res.code == 10106) {
                        H.overdue();
                    } else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    // 保存发货人信息
    saveShop(e) {
        let operate = $(e.target).html(),
            method = '',
            name = $('#waybillShopName').val(),
            mobile = $('#waybillShopMobile').val(),
            address = $('#waybillShopAddress').val();

        switch (operate) {
            case '保存本次':
                method = 'shop';
                break;
            case '永久保存':
                method = 'persist_shop';
                break;
        }

        if(mobile == '' || !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))){
            $('#waybillShopMobile').parent().addClass('has-error');
        }else {
            $('#waybillShopMobile').parent().removeClass('has-error');
            H.Modal({
                title: '保存发货人信息',
                content: '确定保存该发货人信息？',
                cancel: true,
                okText: '确认修改',
                okCallback: ()=>{
                    H.server.update_waybill_detail({
                        id: this.props.waybillId,
                        method: method,
                        name: name,
                        mobile: mobile,
                        address: address
                    }, (res)=>{
                        if(res.code == 0){
                            H.Modal('保存成功！');
                            this.getData();
                        } else if(res.code == 10106) {
                            H.overdue();
                        } else {
                            H.Modal(res.message);
                        }
                    });
                }
            });
        }
    }

    // 保存收货人信息
    saveCustom(e) {
        let operate = $(e.target).html(),
            method = '';

        switch (operate) {
            case '保存本次':
                method = 'custom';
                break;
            case '永久保存':
                method = 'persist_custom';
                break;
        }

        let customInfo = {};
        customInfo.id = this.props.waybillId;
        customInfo.name = $('#waybillCustomName').val();
        customInfo.mobile = $('#waybillCustomMobile').val();
        customInfo.method = method;
        //if(this.state.changeAddress === true){
        //    customInfo.address = this.state.address;
        //}
        customInfo.address = this.state.address;
        customInfo.old_address = this.state.old_address;
        customInfo.address.address = $('#waybillCustomAddress').val();

        if(customInfo.mobile == '' || !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(customInfo.mobile))){
            $('#waybillCustomMobile').parent().addClass('has-error');
        }else {
            $('#waybillCustomMobile').parent().removeClass('has-error');

            H.Modal({
                title: '保存收货人信息',
                content: '确定保存该收货人信息？',
                cancel: true,
                okText: '确认修改',
                okCallback: () => {
                    H.server.update_waybill_detail(customInfo, (res) => {
                        if (res.code == 0) {
                            H.Modal('保存成功！');
                            this.getData();
                        } else if (res.code == 10106) {
                            H.overdue();
                        } else {
                            H.Modal(res.message);
                        }
                    });
                }
            });
        }
    }

    // 确认收揽
    buyOver() {
        H.Modal({
            content:'确认收揽该条运单？',
            cancel:true,
            okCallback: ()=>{
                H.server.waybill_buy_over({id: this.props.waybillId}, (res)=>{
                    if(res.code == 0){
                        H.Modal('成功收揽！');
                    } else if(res.code == 10106) {
                        H.overdue();
                    } else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    // 打印
    print() {

        setTimeout(this.changePrinter, 100);

        H.Modal({
            title: '选择打印的类型',
            content:'<select class="form-control" id="choice">' +
            '<option value="0">配送单</option>' +
            '<option value="1">货标</option>' +
            '</select>' +
            '<p class="text-warning" id="notice"></p>' +
            '<p class="text-success" id="printerInfo"></p>',
            okText: '开始打印',
            cancelText: '不打印了',
            cancel: true,
            okCallback: ()=>{
                let index = $('#choice').val(),
                    printer = '';

                if(index==0){
                    if(localStorage.getItem('print')){
                        printer = JSON.parse(localStorage.getItem('print')).waybillPrinter;
                    }

                    this.createWaybillModal(this.state.waybillInfo);

                    let LODOP = getLodop();
                    LODOP.SET_PRINT_PAGESIZE(0, 2200, 1405, 'bills'); // 设置打印单据纸张大小
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'bills'); // 设置自定义的纸张名字

                    LODOP.PRINT();

                } else if(index == 1) {
                    if(localStorage.getItem('print')){
                        printer = JSON.parse(localStorage.getItem('print')).tagPrinter;
                    }

                    this.createTag(this.state.waybillInfo);

                    let LODOP = getLodop();
                    LODOP.SET_PRINT_PAGESIZE(0, 400, 300, 'tag');
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'tag'); // 设置自定义的纸张名字

                    LODOP.PRINT();
                }
            }
        });

        $('#choice').change(this.changePrinter);
    }

    // 切换打印机
    changePrinter(){
        let index = $('#choice').get(0).selectedIndex,
            printList = localStorage.getItem('print');

        $('#printerInfo').html('');

        if(printList){
            $('#modal-ok').removeAttr('disabled');
            $('#notice').html('');
            if(index==0){
                $('#printerInfo').html('当前打印机：'+JSON.parse(printList).waybillPrinter);
            } else if( index==1){
                $('#printerInfo').html('当前打印机：'+JSON.parse(printList).tagPrinter);
            }
        } else {
            $('#modal-ok').attr('disabled', 'true');
            $('#notice').html('请先到打印机配置页面配置打印机');
        }
    }

    // 确定打印机
    confirmPrinter(printer){
        let LODOP = getLodop(),
            iPrinterCount = LODOP.GET_PRINTER_COUNT();

        for(let i=0; i<iPrinterCount; i++){
            if(LODOP.GET_PRINTER_NAME(i)===printer){
                return i;
            }
        }
    }

    // 创建配送单的模板
    createWaybillModal(waybill) {
        LODOP = getLodop();
        let note = ((waybill.info!==null)?waybill.info.note:'');

        LODOP.PRINT_INIT('');
        LODOP.ADD_PRINT_TEXT(32, 218, 179, 40, '大鱼物流配送单');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18);
        LODOP.ADD_PRINT_TEXT(47, 44, 151, 22, '服务、投诉电话：173 1300 6160');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
        LODOP.ADD_PRINT_TEXT(64, 42, 155, 20, '网点：成都海霸王冻品区16栋外');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
        LODOP.ADD_PRINT_RECT(97, 46, 330, 160, 0, 1);
        LODOP.ADD_PRINT_RECT(97, 419, 330, 160, 0, 1);
        LODOP.ADD_PRINT_TEXT(10, 520, 90, 25, '运 单 号：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(29, 520, 90, 26, '配送日期：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(47, 520, 90, 30, '配送司机：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(65, 520, 90, 30, '运单Ｋ值：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(10, 608, 156, 30, waybill.day_no);
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#FF0000');
        LODOP.ADD_PRINT_TEXT(29, 608, 156, 30, waybill.day);
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(47, 608, 156, 31, waybill.driver?waybill.driver.name+' '+waybill.driver.car_no:'');
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(65, 608, 156, 31, waybill.kno?waybill.kno:'-');
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
        LODOP.ADD_PRINT_TEXT(136, 64, 305, 25, '发货人：'+waybill.shop.name);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(160, 64, 305, 25, '发货人电话：'+waybill.shop.mobile);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(103, 258, 141, 25, '发货地：海霸王');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(109, 602, 168, 30, '提货码：'+H.getLadingCode(waybill.code, [2, 3, 4]));
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(162, 436, 305, 25, '物流区域：'+waybill.address.area.name);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(211, 436, 305, 45, '提货地址：'+waybill.address.full);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(137, 436, 305, 25, '提货人：'+waybill.custom.name);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(186, 436, 305, 25, '提货电话：'+waybill.custom.mobile);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_RECT(277, 47, 330, 135, 0, 1);
        LODOP.ADD_PRINT_RECT(278, 419, 330, 135, 0, 1);
        LODOP.ADD_PRINT_TEXT(292, 65, 40, 25, '货物');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(317, 65, 305, 25, '货物件数（袋、箱）：'+waybill.volume);
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(342, 65, 305, 25, '备注：'+note);
        LODOP.ADD_PRINT_RECT(370, 226, 142, 37, 0, 1);
        LODOP.ADD_PRINT_TEXT(383, 233, 43, 24, '签字');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(292, 437, 61, 24, '代收货款');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(317, 438, 305, 25, '货款：'+waybill.amount+'元');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(380, 438, 100, 25, '客户签字：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_TEXT(447, 59, 38, 21, '说明：');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
        LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#C0C0C0');
        LODOP.ADD_PRINT_TEXT(459, 84, 529, 31, '1、第一联（白单）公司存档，第二联（红单）发货方存档，第三联（蓝单）司机存档，第四联（黄单）提货方存档；\r\n2、本物流公司对货品质量概不负责，退货请双方沟通后联系司机取货，退货费10元起（小件8元，大件10元，泡沫箱20元）；');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
        LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#C0C0C0');
    }

    // 创建货标
    createTag(waybill){
        LODOP = getLodop();

        for(let i=0; i<waybill.volume; i++){
            LODOP.NewPage();
            LODOP.ADD_PRINT_RECT(2, 0, 70, 25, 0, 1);
            LODOP.ADD_PRINT_TEXT(9, 2, 86, 20, '提货:'+H.getLadingCode(waybill.code, [2, 3, 4]));
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_RECT(2, 73, 70, 25, 0, 1);
            LODOP.ADD_PRINT_TEXT(9, 78, 74, 20, '货架:'+H.getLadingCode(waybill.code, [2, 3], '-'));
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_TEXT(35, -1, 153, 20, '物流线:'+waybill.address.area.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_TEXT(55, -1, 123, 20, '发货方:'+waybill.shop.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_TEXT(75, -1, 123, 20, '收货方:'+waybill.custom.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_TEXT(94, -1, 122, 20, '货品：合计'+waybill.volume+'件');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
        }

    }

    render() {
        return (
            <div className="goods-info-ctrl">
                <div className="goods-info container-fluid">
                    <h3 className="title">运单明细<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                    <hr/>
                    <div className="goods-info-content">
                        {this.createWaybillInfoPanel()}
                        {this.createVolumePanel()}
                        {this.createCarInfoPanel()}
                        {this.createSenderPanel()}
                        {this.createConsigneePanel()}
                        <button className="btn btn-default btn-lg" style={{marginRight:'30px'}} onClick={this.buyOver.bind(this)}>确认收揽</button>
                        <button className="btn btn-lg" onClick={this.print.bind(this)}>打印</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default WaybillDetail;