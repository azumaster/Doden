
import React from 'react';
import Paging from './../../../../components/page/paging.js';

class AddWaybill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep:1,              // 当前步数
            shopList:undefined,         // 商家信息列表
            addressList:[],             // 地址列表
            saveAddress:[],             // 保存后的地址列表
            printAddress:[],            // 打印地址列表
            currentAddress:null,          // 当前的地址信息
            changeAddress:false,
            volumes:[],
            locations:[],
            points:[],
            custom:{},
            currentPoint:null,
            currentShop:null,           // 当前商家信息
            newAddress:null,            // 刷新的地址
            leftStatus:false,
            map:null,                   // map
            panel:null,                 // Panel的内容
            page:1,
            lastPage:1,
            size: 9999999,
            total:0
        };
        this.createLeft = this.createLeft.bind(this);
        this.createRight = this.createRight.bind(this);
        this.refreshPoints = this.refreshPoints.bind(this);
        this.refreshAddress = this.refreshAddress.bind(this);
        this.createMap = this.createMap.bind(this);
        this.addCustom = this.addCustom.bind(this);
        this.movePoint = this.movePoint.bind(this);
    }

    componentWillMount() {
        if($('#mapScript').length <= 0){
            let mapScript = '<script id="mapScript" type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=56e401b127998ede0364e18d6877f0f1&plugin=AMap.Geocoder,AMap.MouseTool,AMap.PolyEditor"></script>';
            $('body').append(mapScript);
        }
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }
    }

    // 创建左边栏
    createLeft() {
        let leftPanel,
            addStatus = this.state.leftStatus,
            shopResult = [];

        if(this.state.shopList){
            let shopList = [];
            if(this.state.shopList instanceof Array){
                shopList = this.state.shopList;
            } else {
                shopList.push(this.state.shopList);
            }
            shopList.map((addWaybillShop, index)=>{
                shopResult.push(
                    <label key={index} htmlFor={'shop_'+index} className="row form-group" data-index={index} style={{display:'block'}}>
                        <div className="col-lg-1">
                            <input name="shop" id={'shop_'+index} type="radio" value={index} className="form-control" onChange={this.changeRadio.bind(this)}/>
                        </div>
                        <div className="col-lg-1 form-control-static">{addWaybillShop.uid}</div>
                        <div className="col-lg-3 form-control-static">{addWaybillShop.name}</div>
                        <div className="col-lg-3 form-control-static">{addWaybillShop.mobile}</div>
                        <div className="col-lg-4 form-control-static">{addWaybillShop.address}</div>
                    </label>
                );
            });
        }

        leftPanel = (
            <div className="col-lg-4">
                <div className="panel panel-default">
                    <div className="panel-heading">选择（填写）发货人</div>
                    <div className="panel-body">
                        <div id="searchBox" className="row form-group">
                            <div className="col-lg-2 form-control-static">店铺名</div>
                            <div className="col-lg-6">
                                <input id="search" type="search" className="form-control" placeholder="搜索店铺名"/>
                            </div>
                            <div className="col-lg-4"><a href="javascript:;" className="btn btn-default btn-lg" onClick={this.search.bind(this)}>搜索</a></div>
                        </div>

                        {this.state.shopList&&!addStatus?
                            (<div id="shopList" className="new-shop" style={{overflow:'auto', height: '500px'}}>
                                <h4 className="text-success">请选择一个店铺，查看提货地址</h4>
                                <label className="row form-group" style={{display:'block'}}>
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-1 form-control-static">ID</div>
                                    <div className="col-lg-3 form-control-static">店铺名</div>
                                    <div className="col-lg-3 form-control-static">联系电话</div>
                                    <div className="colnp-lg-4 form-control-static">详细地址</div>
                                </label>
                                {shopResult}
                                <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.toggleLeft.bind(this)}>手动添加发货人</a>
                            </div>)
                            :
                            (<div className="new-shop">
                                <h4 id="notice" className="text-danger">请先搜索店铺</h4>
                                <div className="row form-group">
                                    <div className="col-lg-2 form-control-static">店铺名：</div>
                                    <div className="col-lg-10"><input id="shop" type="text" className="form-control" disabled="disabled"/></div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 form-control-static">手机号：</div>
                                    <div className="col-lg-10"><input id="mobile" type="tel" className="form-control" disabled="disabled"/></div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-2 form-control-static">地址：</div>
                                    <div className="col-lg-10"><input id="address" type="text" className="form-control" disabled="disabled"/></div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-lg-4 col-lg-push-2">
                                        <a id="register" href="javascript:;" className="btn btn-lg" onClick={this.register.bind(this)} disabled="disabled">注册商家</a>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
            </div>

        );

        return leftPanel;
    }

    // 修改左侧栏
    toggleLeft(){
        this.setState({
            leftStatus: true
        }, ()=>{
            $('#notice').removeClass('text-danger').addClass('text-success').html('未查询到该商家，请创建一个新的商家。');
            $('.new-shop').find('input').removeAttr('disabled');
            $('#register').addClass('btn-default').removeAttr('disabled');
        });
    }

    // 搜索店铺
    search() {
        if($('#search').val()==''){
            $('#searchBox').addClass('has-error');
        } else {
            $('#searchBox').removeClass('has-error');
            H.server.shop_search({
                search: $('#search').val()
            }, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        shopList: res.data,
                        leftStatus: false
                    }, ()=>{
                        $('#notice').removeClass('text-danger').addClass('text-success').html('未查询到该商家，请创建一个新的商家。');
                        $('.new-shop').find('input').removeAttr('disabled');
                        $('#register').addClass('btn-default').removeAttr('disabled');
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }
    }

    // 添加商户
    register() {
        // 获取参数
        let shop = $('#shop').val(),
            mobile = $('#mobile').val(),
            address = $('#address').val(),
            test = [];

        $('.new-shop').find('input').parent().removeClass('has-error');

        if(shop==''){
            $('#shop').parent().addClass('has-error');
            test.push(1);
        }
        if(mobile == ''){
            $('#mobile').parent().addClass('has-error');
            test.push(2);
        }
        if(address == ''){
            $('#address').parent().addClass('has-error');
            test.push(3);
        }

        if(test.length==0) {
            H.server.sign_shop({
                name: shop,
                mobile: mobile,
                address: address
            }, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        currentShop: res.data,
                        shopList: res.data,
                        leftStatus: false
                    }, ()=>{
                        this.createLeft();
                        this.createRight();
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }
    }

    // 切换Radio
    changeRadio(){
        let index = $('#shopList input[type="radio"]:checked').val(),
            id = 0,
            currentShop;

        if(this.state.shopList instanceof Array){
            id = this.state.shopList[index].uid;
            currentShop = this.state.shopList[index];
        } else {
            id = this.state.shopList.uid;
            currentShop = this.state.shopList;
        }

        $('.volume').val(0);

        this.setState({
            currentShop: currentShop,
            currentStep: 1
        }, ()=>{
            this.getAddress(id);
        });
    }

    getAddress(id){
        H.server.get_address({
            id: id,
            page: this.state.page,
            size: this.state.size
        }, (res)=>{
            if(res.code == 0) {
                this.setState({
                    addressList: res.data.customs,
                    page: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建右边栏
    createRight() {
        let rightPanel,
            addressItem = [],
            saveAddress = [],
            addressList = this.state.addressList;

        if(!this.state.currentShop){
            return null;
        }

        this.state.saveAddress.map((save, index)=>{
            let code = H.getLadingCode(save.code, [2, 3, 4]);/*,
                goodsCode = H.getLadingCode(save.code, [2, 3], '-')*/

            //saveAddress.push(
            //    <li key={'list_'+index} className="list-group-item" style={{overflow:'hidden'}} data-index={index}>
            //        <label htmlFor={'addr_'+index} className="control-label col-lg-12">
            //            <div className="col-lg-8">
            //                <p className="form-control-static">运单号：{save.day_no}</p>
            //                <p className="form-control-static">{save.custom.name}，{save.custom.mobile}</p>
            //                <p className="form-control-static">提货码：{code}</p>
            //                <p className="form-control-static">件数：{save.volume}</p>
            //                <p className="form-control-static">货架号：{goodsCode}</p>
            //            </div>
            //            <div className="col-lg-3">
            //                <p className="form-control-static text-center"><a href="javascript:;" data-index={index} className="btn btn-lg" onClick={this.print.bind(this)}>打印运单</a></p>
            //                <p className="form-control-static text-center"><a href="javascript:;" data-index={index} data-volume={save.volume} className="btn btn-lg" onClick={this.print.bind(this)}>打印标签</a></p>
            //            </div>
            //        </label>
            //    </li>
            //);
            saveAddress.push(
                <li key={'list_'+index} className="list-group-item" style={{overflow:'hidden'}} data-index={index}>
                    <label htmlFor={'addr_'+index} className="control-label col-lg-12">
                        <p className="form-control-static">运单号：{save.day_no}</p>
                        <p className="form-control-static">{save.custom.name}，{save.custom.mobile}</p>
                        <p className="form-control-static">提货码：{code}</p>
                        <p className="form-control-static">件数：{save.volume}</p>
                    </label>
                </li>
            );
        });

        this.state.addressList.map((address, index)=>{

            let code = H.getLadingCode(address.code, [2, 3, 4]);

            addressItem.push(
                <li key={'address_'+index} className="list-group-item" style={{overflow:'hidden'}} data-index={index}>
                  <label htmlFor={'addr_'+index} className="control-label col-lg-12">
                      <div className="col-lg-10">
                          <p className="form-control-static">{address.name}，{address.mobile}</p>
                          <p className="form-control-static">提货码：{code}</p>
                          <p className="form-control-static">提货地址：{address.address.full}</p>
                          {address.available==0? <p className="form-control-static text-danger">此地址不可送</p> :
                              <div className="form-group col-lg-5">
                                  <p className="col-lg-4 form-control-static">件数</p>
                                  <div className="col-lg-8"><input type="number" className="volume form-control" defaultValue={0} min={0} step={1} onKeyUp={this.checkNumber.bind(this)}/></div>
                              </div>
                          }
                      </div>
                      <div className="col-lg-1">
                          <p className="form-control-static text-center">
                              <a href="javascript:;" data-uid={address.uid} data-index={index} onClick={this.updateCustom.bind(this)} style={{textDecoration:'underline'}}>修改</a>
                          </p>
                          <p className="form-control-static text-center">
                              {address.available==0?null
                              :<input id={'addr_'+index} className="checked" type="checkbox" style={{visibility:'hidden'}} data-uid={address.uid} data-index={index} defaultChecked="defaultChecked"/>}
                          </p>
                      </div>
                  </label>
              </li>
            );
        });

        if(this.state.currentStep==1){
            rightPanel = (
                <div className="col-lg-8">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            批量选择提货地址
                            <a href="javascript:;" className="btn btn-default pull-right" onClick={this.addCustom.bind(this)}>添加收货人</a>
                        </div>

                        {addressList.length>0?
                            <div className="panel-body" style={{overflow:'auto', height: '640px'}}>
                                <ul id="addressList" className="list-group">
                                    {addressItem}
                                </ul>
                                <Paging maxPage={Math.ceil(this.state.lastPage)} clickCallback={this.setPageNum.bind(this)}/>
                            </div>
                            :
                            <div className="panel-body" style={{overflow:'auto', height: '640px'}}>
                                <h1>暂无收货人</h1>
                            </div>
                        }
                        <div className="panel-footer">
                            {addressList.length>0?
                                <a href="javascript:;" className="btn btn-default btn-lg" onClick={this.saveCustom.bind(this)}>生成运单</a>
                                :
                                <a href="javascript:;" className="btn btn-lg" disabled="disabled">生成运单</a>
                            }
                        </div>
                    </div>
                </div>
            );
        } else if(this.state.currentStep == 2){
            rightPanel = (
                <div className="col-lg-8">
                    <div className="panel panel-default">
                        <div className="panel-heading">保存成功</div>
                        <div className="panel-body">
                            <ul id="addressList" className="list-group">
                                {saveAddress}
                            </ul>
                        </div>
                    </div>
                </div>
            );

        }


        return rightPanel;
    }

    // 检测整数
    checkNumber(e) {
        if (!/^\d+$/.test($(e.target).val())){
            $(e.target).val(/^\d+/.exec($(e.target).val()));
        }
        return false;
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.changeRadio);
    }

    // 添加收货人
    addCustom() {
        let volumes = [];
        volumes.push(0);
        for(let i=0; i<$('.volume').length; i++){
            volumes.push($('.volume').get(i).value);
        }

        this.setState({
            points: [],
            volumes: volumes,
            currentAddress: null,
            changeAddress:false,
            locations:[],
            custom:{}
        });

        let addModal = H.Modal({
            title: '添加收货人',
            width: 600,
            autoClose:false,
            content: '<div class="row">' +
            '<div class="col-lg-12 form-horizontal">' +
            '<div class="form-group"><label class="col-lg-3 control-label">收货人：</label>' +
            '<div class="col-lg-8"><input id="customName" class="form-control" type="text" value=""/></div></div>' +
            '<div class="form-group"><label class="col-lg-3 control-label">收货电话：</label>' +
            '<div class="col-lg-8"><input id="customMobile" class="form-control" type="text" value=""/></div></div>' +
            '<div class="form-group"><label class="col-lg-3 control-label">收货地址：</label>' +
            '<div class="col-lg-8"><input id="customAddress" class="form-control" type="text" value=""/></div></div>' +
            '<div class="form-group"><label class="col-lg-3 control-label">坐标：</label>' +
            '<div class="col-lg-6"><input id="pointsInfo" class="form-control" type="text" value="" readonly /></div>' +
            '<a href="javascript:;" id="refreshMapBtn" class="col-lg-2 form-control-static">刷新坐标</a></div>' +
            '<div id="map" class="map-content col-lg-10 col-lg-push-1" style="width:470px;height:200px"></div>' +
            '</div></div>',
            okText: '确认添加收货人',
            cancel: true,
            okCallback: ()=> {
                let mobile = $('#customMobile').val();
                if(mobile == ''){
                    $('#customMobile').parent().addClass('has-error');
                }else {
                    let index = $('#shopList input[type="radio"]:checked').val(),
                        mobile = $('#customMobile').val(),
                        address = {};

                    let addCustomInfo = {};
                    addCustomInfo.id = this.state.shopList[index].uid;
                    addCustomInfo.name = $('#customName').val();
                    addCustomInfo.mobile = $('#customMobile').val();

                    if(this.state.changeAddress===true){
                        address = {
                            id: this.state.custom.tid,
                            title: this.state.custom.title,
                            address: $('#customAddress').val(),
                            type: 0,
                            location:{
                                lat: $('#pointsInfo').val().split(',')[1],
                                lng: $('#pointsInfo').val().split(',')[0]
                            },
                            adcode: this.state.custom.adcode
                        };
                        addCustomInfo.address = address;
                    }

                    if(mobile == ''){
                        $('#customMobile').parent().addClass('has-error');
                        return;
                    } else if(this.state.changeAddress===false){
                        $('#customAddress').parent().addClass('has-error');
                        $('#pointsInfo').val('请先刷新坐标').parent().addClass('has-error');
                        return;
                    } else {
                        H.server.add_custom_address(addCustomInfo, (res)=>{
                            if(res.code == 0) {
                                H.Modal('新增成功');

                                this.changeRadio('current');
                                console.log(volumes);
                                for(let i=0; i<$('.volume').length; i++){
                                    $('.volume').get(i).value = volumes[i];
                                }
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                    addModal.destroy();
                }
            },
            cancelCallback: ()=>{
                addModal.destroy();
            }
        });
        $('#refreshMapBtn').click(this.refreshPoints);
    }

    // 修改收货人
    updateCustom(e) {
        let index = $(e.target).data('index'),
            currentAddress = this.state.addressList[index],
            points = [[currentAddress.address.lng, currentAddress.address.lat]];

        this.setState({
            points: [currentAddress[index]],
            currentAddress: null,
            changeAddress:false,
            locations:[],
            points: points,
            custom:{}
        }, ()=>{
            let updateModal = H.Modal({
                title: '修改收货人',
                width: 600,
                autoClose:false,
                content: '<div class="row">' +
                '<div class="col-lg-12 form-horizontal">' +
                '<div class="form-group"><label class="col-lg-3 control-label">收货人：</label>' +
                '<div class="col-lg-8"><input id="customName" class="form-control" type="text" value="' + currentAddress.name + '"/></div></div>' +
                '<div class="form-group"><label class="col-lg-3 control-label">收货电话：</label>' +
                '<div class="col-lg-8"><input id="customMobile" class="form-control" type="text" value="' + currentAddress.mobile + '"/></div></div>' +
                '<div class="form-group"><label class="col-lg-3 control-label">收货地址：</label>' +
                '<div class="col-lg-8"><input id="customAddress" class="form-control" type="text" value="' + currentAddress.address.full + '"/></div></div>' +
                '<div class="form-group"><label class="col-lg-3 control-label">坐标：</label>' +
                '<div class="col-lg-6"><input id="pointsInfo" class="form-control" type="text" readonly value="'+currentAddress.address.lng+','+currentAddress.address.lat+'"/></div>' +
                '<a href="javascript:;" id="refreshMapBtn" class="col-lg-2 form-control-static">刷新坐标</a></div>' +
                '<div id="map" class="map-content col-lg-10 col-lg-push-1" style="width:470px;height:200px"></div>' +
                '</div></div>',
                okText: '确认修改收货人',
                cancel: true,
                okCallback: () => {
                    let mobile = $('#customMobile').val();
                    if(mobile == ''){
                        $('#customMobile').parent().addClass('has-error');
                    }else {
                        let index = $('#shopList input[type="radio"]:checked').val(),
                            mobile = $('#customMobile').val(),
                            updateInfo = {};

                        updateInfo.id = this.state.shopList[index].uid;
                        updateInfo.uid = currentAddress.uid;
                        updateInfo.name = $('#customName').val();
                        updateInfo.mobile = $('#customMobile').val();

                        if(this.state.changeAddress === true){
                            let address = {
                                id: this.state.custom.tid,
                                title: this.state.custom.title,
                                address: $('#customAddress').val(),
                                type: 0,
                                location:{
                                    lat: $('#pointsInfo').val().split(',')[1],
                                    lng: $('#pointsInfo').val().split(',')[0]
                                },
                                adcode: this.state.custom.adcode
                            };

                            updateInfo.address = address;
                        }



                        if(mobile == ''){
                            $('#customMobile').parent().addClass('has-danger');
                            return;
                        }else {
                            H.server.update_custom_address(updateInfo, (res)=>{
                                if(res.code == 0) {
                                    H.Modal('修改成功');
                                    this.changeRadio();
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else{
                                    H.Modal(res.message);
                                }
                            });
                        }
                        updateModal.destroy();
                    }
                },
                cancelCallback: ()=>{
                    updateModal.destroy();
                }
            });
            $('#refreshMapBtn').click(this.refreshPoints);
            this.createMap();
        });


    }

    // 根据关键字刷新坐标
    refreshPoints(){
        let address = $('#customAddress').val();

        if(address == ''){
            return;
        }

        $('#customMobile').parent().removeClass('has-error');
        $('#customAddress').parent().removeClass('has-error');
        $('#pointsInfo').parent().removeClass('has-error');

        H.server.get_all_address({keyword: address, region: '成都', policy: 1}, (res)=>{
            if(res.code == 0) {
                let locations = res.data.tips,
                    points = [];
                res.data.tips.map((address)=>{
                    points.push([address.location.lng, address.location.lat]);
                });

                this.setState({
                    points: points,
                    locations: locations
                }, ()=>{
                    this.createMap();
                    $('#tId').val(res.data.tips[0].id);
                    $('#adcode').val(res.data.tips[0].adcode);
                    $('#typecode').val(res.data.tips[0].typecode);
                    $('#pointsInfo').val('必须选择唯一的地址');
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 根据坐标刷新地址
    refreshAddress(index, point){
        let custom = this.state.custom,
            location = this.state.locations[index];

        $('#modal-ok').removeAttr('disabled');
        $('#customAddress').val(location.address);
        $('#pointsInfo').val(point);

        custom.tid = location.id;
        custom.adcode = location.adcode;
        custom.province = location.province;
        custom.city = location.city;
        custom.title = location.title;
        custom.district = location.district;

        this.setState({
            custom: custom,
            changeAddress: true
        }, ()=>{this.state.map.setZoomAndCenter(18, point);});
    }

    movePoint(point) {
        this.setState({
            changeAddress: true
        }, ()=>{
            H.server.gecode_address({lng: point[0], lat:point[1], get_poi: 1}, (res)=>{
                if(res.code == 0){
                    let custom = this.state.custom,
                        locations = res.data.pois,
                        location = null;



                    let min = locations[0]._distance;
                    locations.map((l)=>{
                        if(l._distance==0 || l._distance<=min){
                            min = l._distance;
                            location = l;
                        }
                    });

                    custom.tid = location.id;
                    custom.adcode = location.ad_info.adcode;
                    custom.province = location.ad_info.province;
                    custom.city = location.ad_info.city;
                    custom.title = location.title;
                    custom.district = location.ad_info.district;

                    $('#modal-ok').removeAttr('disabled');
                    $('#customAddress').val(location.address);
                    $('#pointsInfo').val(location.location.lng+','+location.location.lat);

                    this.setState({
                        custom: custom
                    }, ()=>{this.state.map.setZoomAndCenter(18, point);});

                } else if (res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal('刷新失败');
                }
            });
        });
    }

    // 创建地图
    createMap() {
        let map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 16
        });

        map.setFitView();

        for(let i=0; i< this.state.points.length; i++){
            let marker = new AMap.Marker({
                position: this.state.points[i],
                draggable: true
            });

            marker.on('click', (e)=>{
                let point = [e.target.getPosition().lng, e.target.getPosition().lat];
                // 通过坐标获取地址
                this.refreshAddress(i, point);
            });

            marker.on('dragend', (e)=>{
                let point = [e.target.getPosition().lng, e.target.getPosition().lat];

                // 通过坐标获取地址
                this.movePoint(point);
            });

            marker.setMap(map);
        }

        this.setState({
            map: map
        }, ()=>{map.setFitView();});
    }

    // 保存收货人
    saveCustom() {

        H.Modal({
            content: '确认保存今日收货人？',
            okText: '保存收货人',
            cancel: true,
            okCallback: ()=>{

                let index = $('#shopList input[type="radio"]:checked').val(),
                    customs = [],
                    param = {};

                let checked = document.getElementsByClassName('checked'),
                    volume = document.getElementsByClassName('volume');

                for(let i=0; i<checked.length; i++){
                    if(volume[i].value>0){
                        customs.push({
                            uid: checked[i].dataset.uid,
                            volume: volume[i].value
                        });
                    }
                }

                // $('#addressList input[type="checkbox"]:checked').each((index, item) => {
                //     if($('.volume').get(index).value>0){
                //         console.log(index);
                //         customs.push({
                //             uid: item.dataset.uid,
                //             volume: $('.volume').get(index).value
                //         });
                //     }
                // });

                console.log(customs);

                param.id = this.state.shopList[index].uid;
                param.customs = customs;

                H.server.send_order(param, (res)=>{
                    if(res.code == 0) {
                        this.setState({
                            currentStep:2,
                            saveAddress: res.data
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });

            }
        });
    }

    // 打印
    print(e) {
        let operate = $(e.target).html(),
            index = e.target.dataset.index,
            printer = '',
            printModal,
            type = '';

        switch (operate) {
            case '打印运单':
                if(localStorage.getItem('print')){
                    let id = this.state.saveAddress[index].id;
                    H.server.get_current_waybill({id: id}, (res)=>{
                        if(res.code == 0) {
                            type = '运单';
                            printModal = res.data;
                            printer = JSON.parse(localStorage.getItem('print')).waybillPrinter;
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else{
                            H.Modal(res.message);
                        }
                    });
                }
                break;
            case '打印标签':
                if(localStorage.getItem('print')){
                    let id = this.state.saveAddress[index].id;
                    H.server.get_current_waybill({id: id}, (res)=>{
                        if(res.code == 0) {
                            type = '标签';
                            printModal = res.data;
                            printer = JSON.parse(localStorage.getItem('print')).tagPrinter;
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else{
                            H.Modal(res.message);
                        }
                    });
                }
                break;
            case '打印全部运单':
                if(localStorage.getItem('print')){
                    this.setState({
                        printAddress: []
                    }, ()=>{
                        this.state.saveAddress.map((save)=>{
                            let id = save.id;
                            H.server.get_current_waybill({id: id}, (res)=>{
                                if(res.code == 0) {
                                    printModal.push(res.data);
                                    this.setState({
                                        printAddress: printModal
                                    });
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else{
                                    H.Modal(res.message);
                                }
                            });
                        });

                        printModal = this.state.printAddress;
                        type = '运单';
                        printer = JSON.parse(localStorage.getItem('print')).waybillPrinter;
                    });
                }
                break;
            case '打印全部标签':
                if(localStorage.getItem('print')){
                    this.setState({
                        printAddress: []
                    }, ()=>{
                        this.state.saveAddress.map((save)=>{
                            let id = save.id;
                            H.server.get_current_waybill({id: id}, (res)=>{
                                if(res.code == 0) {
                                    printModal.push(res.data);
                                    this.setState({
                                        printAddress: printModal
                                    });
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else{
                                    H.Modal(res.message);
                                }
                            });
                        });
                        type = '标签';
                        printModal = this.state.printAddress;
                        printer = JSON.parse(localStorage.getItem('print')).tagPrinter;
                    });

                }
                break;
        }

        H.Modal({
            title: operate,
            content: '<p>确认'+operate+'</p><p id="notice" class="text-warning"></p><p id="print" class="text-success"></p>',
            cancel:true,
            cancelText:'不打印了',
            okText:'开始打印',
            okCallback: ()=>{
                let LODOP = getLodop();
                if(type=='运单'){
                    this.createWaybillModal(printModal);
                    LODOP.SET_PRINT_PAGESIZE(0, 2200, 1405, 'bills'); // 设置打印单据纸张大小
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'bills'); // 设置自定义的纸张名字
                } else if(type=='标签'){
                    this.createTagModal(printModal);
                    LODOP.SET_PRINT_PAGESIZE(0, 400, 300, 'tags'); // 设置打印单据纸张大小
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'tags'); // 设置自定义的纸张名字
                }

                LODOP.PRINT();
            }
        });

        let printConfig = setInterval(()=>{
            if(printer!=''){
                $('#notice').html('请先在打印机配置页面配置打印机');
                $('#print').html('');
                $('#modal-ok').attr('disabled', 'true');

                if(localStorage.getItem('print')){
                    $('#print').html('当前打印机：'+printer);
                    $('#notice').html('');
                    $('#modal-ok').removeAttr('disabled');
                }
                clearInterval(printConfig);
            }
        }, 200);
    }

    // 创建运单模板
    createWaybillModal(printModal) {
        let printList = [];

        LODOP = getLodop();
        if(printModal instanceof Array){
            printList = printModal;
        } else {
            printList.push(printModal);
        }

        printList.map((print)=>{
            let note = print.info?print.info.note:'';

            LODOP.NewPage();
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '楷体');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#0080FF');
            LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
            LODOP.ADD_PRINT_TEXT(32, 218, 179, 40, '大鱼物流配送单');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 18);
            LODOP.ADD_PRINT_TEXT(47, 44, 151, 22, '服务、投诉电话：130 5864 1397');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
            LODOP.ADD_PRINT_TEXT(64, 42, 155, 20, '网点：成都海霸王冻品区16栋外');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
            LODOP.ADD_PRINT_RECT(97, 46, 330, 160, 0, 1);
            LODOP.ADD_PRINT_RECT(97, 419, 330, 160, 0, 1);
            LODOP.ADD_PRINT_TEXT(18, 540, 90, 25, '运 单 号：');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(37, 540, 90, 26, '配送日期：');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(55, 540, 90, 30, '货 架 号：');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(19, 628, 136, 30, print.day_no);
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#FF0000');
            LODOP.ADD_PRINT_TEXT(38, 628, 100, 30, print.day);
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(58, 628, 100, 31, H.getLadingCode(print.code, [2, 3], '-'));
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(136, 64, 305, 25, '发货人：'+print.shop.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(160, 64, 305, 25, '发货人电话：'+print.shop.mobile);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(113, 228, 141, 25, '发货地：海霸王');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(109, 572, 168, 30, '提货码：'+H.getLadingCode(print.code, [2, 3, 4]));
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(162, 436, 305, 25, '物流区域：'+print.address.area.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(211, 436, 305, 45, '提货地址：'+print.address.full);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(137, 436, 305, 25, '提货人：'+print.custom.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(186, 436, 305, 25, '提货电话：'+print.custom.mobile);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_RECT(277, 47, 330, 135, 0, 1);
            LODOP.ADD_PRINT_RECT(278, 419, 330, 135, 0, 1);
            LODOP.ADD_PRINT_TEXT(292, 65, 40, 25, '货物');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(317, 65, 305, 25, '货物件数（袋、箱）：'+print.volume);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(342, 65, 305, 25, '备注：'+note);
            LODOP.ADD_PRINT_RECT(370, 226, 142, 37, 0, 1);
            LODOP.ADD_PRINT_TEXT(383, 233, 43, 24, '签字');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(292, 437, 61, 24, '代收货款');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(317, 438, 305, 25, '货款：'+print.amount);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(380, 438, 100, 25, '客户签字：');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(447, 59, 38, 21, '说明：');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
            LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#C0C0C0');
            LODOP.ADD_PRINT_TEXT(459, 84, 529, 31, '1、第一联（白单）公司存档，第二联（红单）发货方存档，第三联（蓝单）司机存档，第四联（黄单）提货方存档；\r\n2、本物流公司对货品质量概不负责，退货请双方沟通后联系司机取货，退货费10元起（小件8元，大件10元，泡沫箱20元）；');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 7);
            LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#C0C0C0');
        });
    }

    // 创建货标模板
    createTagModal(printModal){
        let printList = [];
        LODOP = getLodop();
        if(printModal instanceof Array){
            printList = printModal;
        } else {
            printList.push(printModal);
        }

        printList.map((print)=>{
            for(let i=0; i<print.volume; i++){
                LODOP.NewPage();
                LODOP.ADD_PRINT_RECT(2, 0, 70, 25, 0, 1);
                LODOP.ADD_PRINT_TEXT(9, 2, 86, 20, '提货:'+H.getLadingCode(print.code, [2, 3, 4]));
                LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
                LODOP.ADD_PRINT_RECT(2, 73, 70, 25, 0, 1);
                LODOP.ADD_PRINT_TEXT(9, 78, 74, 20, '货架:'+H.getLadingCode(print.code, [2, 3], '-'));
                LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
                LODOP.ADD_PRINT_TEXT(35, -1, 153, 20, '物流线:'+print.address.area.name);
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
                LODOP.ADD_PRINT_TEXT(55, -1, 123, 20, '发货方:'+print.shop.name);
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
                LODOP.ADD_PRINT_TEXT(75, -1, 123, 20, '收货方:'+print.custom.name);
                LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
                LODOP.ADD_PRINT_TEXT(94, -1, 122, 20, '货品：合计'+print.volume+'件');
            }
        });
    }

    // 设置选择的打印机
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

    render() {
        return (
            <div className="waybill-info-container">
                <div className="waybill-info-head container-fluid">
                    <h3 className="title">录单<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                    <hr/>
                    <div className="waybill-info-content">
                        {this.createLeft()}
                        {this.createRight()}
                    </div>
                </div>
            </div>
        );
    }
}

export default AddWaybill;