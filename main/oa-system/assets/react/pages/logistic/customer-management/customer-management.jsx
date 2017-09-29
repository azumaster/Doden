/**
 * 客户管理
 * @author: 魏华东
 * @date: 2016.12.16
 */

import React from 'react';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';

class CustomerManagement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            customerList:[],             // 客户信息列表
            areaList:[],                 // 区域信息列表
            locations:[],                // 关键词搜索地址返回的地理位置信息
            currentCode:0,               // 当前选中的提货码状态
            currentArea:0,               // 当前选择的区域index
            points:[],                   // 当前查询出来的坐标
            status:'-1, 0, 1, 2',        // 提货码状态
            searchContext:'',            // 搜索内容
            custom:null,                 // 单一的客户对象
            map:null,                    // 地图对象
            changeAddress:false,
            page:1,                      // 当前页数
            lastPage:1,                  // 最大页数
            size:30,                     // 每一页显示多少条纪录
            total: 100                   // 总共多少个客户
        };
        this.getData = this.getData.bind(this);
        this.operate = this.operate.bind(this);
        this.createMap = this.createMap.bind(this);
        this.refreshByKeywords = this.refreshByKeywords.bind(this);
        this.movePoints = this.movePoints.bind(this);
    }

    componentWillMount() {
        // 预加载地图API
        if($('#mapScript').length <= 0){
            let mapScript = '<script id="mapScript" type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=56e401b127998ede0364e18d6877f0f1&plugin=AMap.Geocoder,AMap.MouseTool,AMap.PolyEditor"></script>';
            $('body').append(mapScript);
        }
        this.getData();
    }

    componentDidMount() {
        $('#searchBox').keypress((e)=>{
            let key = window.event?e.keyCode:e.which;
            if(key.toString() == '13'){
                return false;
            }
        });
    }

    // 获取所有的数据
    getData(){
        let customsInfo = {};
        customsInfo.area_id = this.getAreaId();
        customsInfo.page = this.state.page;
        customsInfo.size = this.state.size;
        if(this.state.status){
            customsInfo.status = this.state.status;
        }
        if(this.state.searchContext!=''){
            customsInfo.search = this.state.searchContext;
        }


        new Promise((resolve)=>{
            H.server.get_all_area({id: 510100}, (res) => {
                if(res.code == 0){
                    this.setState({
                        areaList:res.data.children
                    }, ()=>{resolve(res);});
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            H.server.get_all_customer(customsInfo, (res) => {
                if(res.code == 0){
                    this.setState({
                        customerList: res.data.customs,
                        total: res.data.total,
                        page: res.data.page,
                        lastPage: res.data.last_page
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    // 创建选择的区域
    createSelectArea() {
        let city = ['成都'],
            cityData = [0];
        let area = [],
            areaData = [];
        let codeStatus = ['全部', '未确认', '已确认', '已更正', '已作废'],
            codeStatusData = [0, 1, 2, 3, 4];

        area.push('全部');
        areaData.push(0);
        this.state.areaList.map((areaInfo, index) => {
            area.push(areaInfo.name);
            areaData.push(index+1);
        });

        return (
            <div className="section-filter" style={{paddingTop: 0}}>
                <form className="form-inline">
                    <div className="filter-row">
                        {this.createSearchBar()}
                    </div>
                </form>
                <div className="row">
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>城市</label>
                            <BtnGroup btnNames={city} bindData={cityData}  status={this.state.currentCity}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default"/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>区县</label>
                            <BtnGroup btnNames={area} bindData={areaData}  status={this.state.currentArea}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" clickCallback={this.toggleArea.bind(this)}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>提货码状态</label>
                            <BtnGroup btnNames={codeStatus} bindData={codeStatusData}  status={this.state.currentCode}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" clickCallback={this.toggleCodeStatus.bind(this)}/>
                        </div>
                    </form>
                    <div className="form-inline col-lg-6">
                        <label style={{display: 'inline-block', width: '6em'}}></label>
                        <a className="btn btn-lg btn-orange" onClick={this.select.bind(this)}>筛选</a>
                    </div>
                </div>
            </div>
        );
    }

    // 开始筛选
    select(){
        if($('#searchBox').val() == ''){
            this.setState({
                searchContext: ''
            });
        }
        this.setState({
            page: 1
        }, this.getData);
    }


    // 创建搜素框
    createSearchBar() {
        return (
            <div className="search-bar">
                <input id="searchBox" type="search" style={{width: '400px'}} className="form-control" placeholder="搜索提货码、手机号、地址、收货人姓名、街道、区县"/>
                <a href="javascript:;" className="btn btn-lg" onClick={this.search.bind(this)}>搜索</a>
            </div>
        );
    }

    // 搜索
    search() {
        let search = $('#searchBox').val();

        this.setState({
            searchContext: search,
            currentArea: 0,
            currentCode: 0,
            page: 1
        }, this.getData);
    }

    // 切换区县
    toggleArea(e) {
        let index = e.target.dataset.index;

        if(index == this.state.currentArea) return;

        this.setState({
            page: 1,
            currentArea: index
        });
    }

    // 切换提货码状态
    toggleCodeStatus(e) {
        let index = e.target.dataset.index,
            statusList = [0, 1, 2, '-1'],
            status = '';

        if(index == this.state.currentCode) return;

        if(index == 0) status = statusList.toString();
        else status = statusList[index-1];

        this.setState({
            page: 1,
            currentCode: index,
            status: status
        });
    }

    // 创建表格
    createTable(){
        let headlines = ['ID', '提货码', '店铺名', '收货人', '收货电话', '区县', '街道/乡镇', '地址', '配送状态', '账号状态', '操作'],
            order = ['id', 'code', 'address_title', 'name', 'mobile', 'district', 'street', 'address_full', 'available', 'status', 'operate'],
            status = {8:{0: '未开通', 1: '可送'}, 9:{'-1': '已作废', 0: '未确认', 1: '已确认', 2: '已更正'}},
            statusOperate = {},
            fn= {10: this.operate};
        this.state.customerList.map((customer, index) => {
            customer.operate = index;
            if(customer.status != '-1') statusOperate[index] = ['修改'];
            else customer.operate = '';
        });

        return (
            <Table values={this.state.customerList} headlines={headlines} order={order} bodyOperate={fn} id={'customerManagement'}
                   statusOperate={statusOperate} status={status} />
        );
    }

    // 表格的相关操作
    operate(e) {
        let custom = null,
            points = [],
            index = index = e.target.dataset.reactid.split('$')[2].split('.')[0],
            customId = this.state.customerList[index].id;

        new Promise((resolve) => {
            H.server.get_custom_by_id({id: customId}, (res) => {
                if (res.code == 0) {
                    points.push([res.data.lng, res.data.lat]);
                    custom = res.data;
                    this.setState({
                        custom: custom,
                        points: points
                    }, () => {resolve(res);});
                } else if (res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal(res.message);
                }
            });
        }).then(() => {
            this.setState({
               changeAddress: false
            });
                let updateModal = H.Modal({
                    title: '修改客户信息',
                    width: '800',
                    autoClose:false,
                    content: '<div class="row">' +
                    '<div class="col-lg-5 form-horizontal">' +
                    '<div class="form-group"><label class="col-lg-4 control-label">提货码：</label>' +
                    '<p class="col-lg-8 form-control-static">' + custom.code + '</p></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">区域：</label>' +
                    '<p id="district" class="col-lg-8 form-control-static">' + custom.district +'</p></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">收货人：</label>' +
                    '<div class="col-lg-8"><input id="name" class="form-control" type="text" value="' + custom.name + '"/></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">店铺名：</label>' +
                    '<div class="col-lg-8"><input id="title" class="form-control" type="text" value="' + custom.address_title + '"/></div></div></div>' +
                    '<div class="col-lg-7 form-horizontal">' +
                    '<div class="form-group"><label class="col-lg-3 control-label">地址：</label>' +
                    '<div class="col-lg-9"><input id="fullAddress" class="form-control" type="text" value="' + custom.address_full + '"/></div></div>' +
                    '<div class="form-group"><label class="col-lg-3 control-label">坐标：</label>' +
                    '<div class="col-lg-6"><input id="pointsInfo" class="form-control" type="text" readonly value="'+custom.lng+','+custom.lat+'"/></div>' +
                    '<a href="javascript:;" id="refreshMapBtn" class="col-lg-3 form-control-static">刷新坐标</a></div>' +
                    '<div class="form-group"><label class="col-lg-3 control-label">收货电话：</label>' +
                    '<div class="col-lg-9"><input id="phone" class="form-control" type="tel" value="' + custom.mobile + '"/></div></div>' +
                    '<div class="map-content pull-right" id="map" style="height:250px; width: 400px"></div>' +
                    '</div>' +
                    '</div>',
                    okText: '确认修改',
                    cancel: true,
                    okCallback: () => {
                        let updateInfo = {};
                        updateInfo.id = custom.id;
                        updateInfo.name = $('#name').val();
                        updateInfo.mobile = $('#phone').val();
                        if(this.state.changeAddress === true){
                            updateInfo.address = {
                                id: custom.tid,
                                title: $('#title').val(),
                                address: $('#fullAddress').val(),
                                type: 0,
                                location: {
                                    lat: $('#pointsInfo').val().split(',')[1],
                                    lng: $('#pointsInfo').val().split(',')[0]
                                },
                                adcode: custom.adcode,
                                province: custom.province,
                                district: custom.district,
                                city: custom.city
                            };
                        }


                        if(updateInfo.mobile == '' || !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(updateInfo.mobile))){
                            $('#phone').parent().parent().addClass('has-error');
                        }else {
                            updateModal.destroy();
                            H.server.update_custom(updateInfo, (res) => {
                                if (res.code == 0) {
                                    H.Modal('修改成功！');
                                    this.getData();
                                } else if (res.code == 10106) {
                                    H.overdue();
                                } else {
                                    H.Modal(res.message);
                                }
                            });
                        }
                    },
                    cancelCallback: () => {
                        updateModal.destroy();
                    }


                });
                $('#refreshMapBtn').click(this.refreshByKeywords);
                this.createMap();
            }
        );
    }

    // 创建地图
    createMap(){

        let map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 16
        });

        map.setFitView();

        for(let i=0; i< this.state.points.length; i++){
            let marker = new AMap.Marker({
                position: this.state.points[i],
                draggable: true,
                map: map
            });

            marker.on('click', (e)=>{
                let point = [e.target.getPosition().lng, e.target.getPosition().lat];
                this.refreshAddress(i, point);
            });

            marker.on('dragend', (e)=>{
                let point = [e.target.getPosition().lng, e.target.getPosition().lat];
                this.movePoints(point);
            });

        }

        this.setState({
            map: map
        }, ()=>{map.setFitView();});
    }

    // 地点搜索
    refreshByKeywords() {
        // 获取到用户填写的地址
        let address = $('#fullAddress').val(),
            points = [];

        H.server.get_all_address({keyword: address, policy: 1, region: '成都'}, (res)=>{
            if (res.code == 0) {
                res.data.tips.map((address)=>{
                    points.push([address.location.lng, address.location.lat]);
                });
                this.setState({
                    locations: res.data.tips,
                    points: points,
                    changeAddress: true
                }, ()=>{
                    this.createMap();
                    $('#modal-ok').attr('disabled', 'true');
                    $('#pointsInfo').val('必须选择唯一的地址');
                });
            } else if (res.code == 10106) {
                H.overdue();
            } else {
                H.Modal('刷新失败');
            }
        });
    }

    // 刷新地址
    refreshAddress(index, point) {
        let custom = this.state.custom,
            location = this.state.locations[index];

        $('#modal-ok').removeAttr('disabled');
        $('#fullAddress').val(location.address);
        $('#pointsInfo').val(point);
        $('#district').html(location.district);

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

    // 移动坐标
    movePoints(point){
        this.setState({
            changeAddress: true
        }, ()=>{
            H.server.gecode_address({lng: point[0], lat:point[1], get_poi: 1}, (res)=>{
                if(res.code == 0){
                    let custom = this.state.custom,
                        locations = res.data.pois,
                        location = null;


                    console.log(locations);
                    let min = locations[0]._distance;
                    locations.map((l)=>{
                        if(l._distance==0||l._distance<=min){
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
                    $('#fullAddress').val(location.address);
                    $('#pointsInfo').val(location.location.lng+','+location.location.lat);
                    $('#district').html(location.ad_info.district);

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
    
    // 更改页数
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getData);
    }

    // 获取区域id
    getAreaId() {
        if(this.state.currentArea == 0) return 510100;
        else return this.state.areaList[this.state.currentArea-1].id;
    }

    refresh() {
        this.setState({
            currentCode:0,
            currentArea:0,
            status:'-1, 0, 1, 2',
            searchContext:'',
            page:1
        }, this.getData);
    }

    render() {
        return(
            <div className="section-warp">
                <div className="section-table">
                    {this.createSelectArea()}
                    <div className="col-lg-12" style={{marginTop:'30px'}}>
                        <div className="row">
                            <p className="col-lg-6 pull-left">当前结果：{this.state.total}个客户</p>
                            <a href="javascript:;" onClick={this.refresh.bind(this)} className="col-lg-6 text-right">刷新</a>
                        </div>
                        {this.createTable()}
                        <Paging maxPage={this.state.lastPage} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomerManagement;