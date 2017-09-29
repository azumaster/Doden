/**
 * 调度分配
 * @author: 魏华东
 * @date: 2016.12.19
 */

class Dispatching extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            merchant:[],                    // 已经定位的商家的坐标信息的数组
            points:[],                      // 获取到的所有商户的信息
            markers:[],                     // 初始化标记点的数组
            unMarkers:[],                   // 未分配的标记点的数组
            distributedArea:{},             // 已被分配到的区域信息，每个司机uid作为一个对象存储分给该司机的markers和polygon
            disCount:{},                    // 已分配的件数和户数
            listPanelInfo:[],               // 左侧列表内容信息
            driverList:[],                  // 司机列表信息
            checkedDriverList:[],           // 被选中当值的司机信息的列表
            checkedColor:{},                // 被分配的颜色纪录对象
            capacityInfo:{},                // 运力信息
            waybillStatics:{},             // 今日运单信息的统计
            map:null,                       // 地图对象
            dbEvent:null,                   // 双击事件
            totalCustoms:0,
            currentPage:1,
            size: 50,
            currentStep:1                   // 当前的步骤
        };
        this.getData = this.getData.bind(this);
        this.initData = this.initData.bind(this);
        this.initDriver = this.initDriver.bind(this);
        this.buildTodayDriver = this.buildTodayDriver.bind(this);
        this.operate = this.operate.bind(this);
        this.drawDistribution = this.drawDistribution.bind(this);
        this.updateDistribution = this.updateDistribution.bind(this);
        this.createTask = this.createTask.bind(this);
    }

    componentWillMount() {
        // 预加载地图的js
        if($('#mapScript').length <= 0){
            let mapScript = '<script id="mapScript" type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=56e401b127998ede0364e18d6877f0f1&plugin=AMap.Geocoder,AMap.MouseTool,AMap.PolyEditor"></script>';
            $('body').append(mapScript);
        }
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }

        this.getData();

    }

    initData(){
        let merchant = this.state.merchant;
        if(this.state.points){
            this.state.points.map((point)=>{
                merchant.push({
                    points:[point.address.lng, point.address.lat],
                    title: point.address.title,
                    address: point.address.full,
                    driver: point.driver,
                    area:point.address.area.name,
                    code: point.code,
                    id: point.id,
                    dayNo: point.day_no,
                    volume: point.volume
                });
            });
        }

        this.setState({
            merchant:merchant
        }, ()=>{
            if($('#mapScript').length > 0) {
                this.initMap();
            }
        });
    }

    // 初始化地图
    initMap() {
        let map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 12,
            doubleClickZoom:false
        });
        let markers = [],
            points = this.state.points,
            distributedArea = {},
            totalCustoms = this.state.waybillStatics.customs;

        // 设置地图上的工具栏
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], ()=>{
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
        });

        // 把定位的Marker放置到地图上
        points.map((point)=> {

            if(point.lng && point.lat){
                // 初始化Marker
                let marker = new AMap.Marker({
                    extData: {point: point},
                    position: [point.lng, point.lat],
                    draggable: false,
                    icon:'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    cursor: 'pointer'
                });

                // 点击Marker弹出说明窗
                let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}),
                    customInfo = '';

                marker.setMap(map);
                marker.emit('click', {target: marker});
                marker.on('click', (e)=> {
                    infoWindow.setContent(customInfo);
                    infoWindow.open(map, e.target.getPosition());
                });

                let flag = false;
                point.customs.map((custom)=>{
                    custom.deliveries.map((delivery)=>{
                        customInfo += '运单号：'+delivery.day_no+'<br/>'+delivery.custom.name+'<br/>'+point.full+'<br/>'+'共'+delivery.volume+'件货<hr/>';

                        if(delivery.driver){
                            if(!distributedArea[delivery.driver.uid]){
                                distributedArea[delivery.driver.uid] = {markers:[], polygon:null};
                                distributedArea[delivery.driver.uid].markers.push(marker);
                            }
                            marker.setIcon('');
                        }else {
                            flag = true;
                        }
                    });
                });
                if(flag){
                    markers.push(marker);
                }
            }
        });

        this.setState({
            map:map,
            markers:markers,
            unMarkers:markers,
            merchant: points,
            totalCustoms:totalCustoms,
            distributedArea:distributedArea
        });

        $('#driver-panel').fadeIn('slow');
        $('#task').fadeIn('slow');
    }

    // 初始化司机列表信息
    initDriver() {
        let listInfo = [];
        this.state.driverList.map((driver, index) => {

            let c = false;

            this.state.checkedDriverList.map((checked)=>{
                if(checked.uid == driver.uid){
                    c = true;
                }
            });

           if(this.state.capacityInfo[driver.capacity]){
               if(driver.status == 1){
                   listInfo.push(
                       <li key={index} className="list-group-item" data-index={index}>
                           <label htmlFor={'driver-info-'+index} className="col-lg-11">
                               <div className="row" style={{marginBottom:'10px'}}>
                                   <div className="col-lg-5">{driver.name}</div>
                                   <div className="col-lg-6">{driver.mobile}</div>
                               </div>
                               <div className="row">
                                   <div className="col-lg-5">{driver.capacity}</div>
                                   <div className="col-lg-6">[{driver.car_no}]</div>
                               </div>
                               <div className="row"><div className="col-lg-12" style={{marginTop:'10px'}}>
                                   上限数：{this.state.capacityInfo[driver.capacity][0]+'户'+'，'+this.state.capacityInfo[driver.capacity][1]+'件'}
                               </div></div>
                           </label>
                           {c?<input id={'driver-info-'+index} data-index={index} className="col-lg-1 check" type="checkbox" defaultChecked={c}/>
                               :<input id={'driver-info-'+index} data-index={index} className="col-lg-1 check" type="checkbox"/>}

                       </li>
                   );
               }
           }

        });

        this.setState({
            listPanelInfo: listInfo
        });
    }

    // 获取数据
    getData() {
        new Promise((resolve)=>{
            // 获得司机
            console.log(this.state.currentPage);
            console.log(this.state.size);
            H.server.get_driver_info({page: this.state.currentPage, size: this.state.size}, (res) => {
                if(res.code == 0) {
                    this.setState({
                        driverList: res.data.drivers
                    }, ()=>{resolve(res);});
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            // 获得运力
            let info = {};
            H.server.get_capacity_info({display:'all'}, (res) => {
                if(res.code == 0) {
                    res.data.map((data)=>{
                        info[data.name] = [data.bill_max, data.pack_max];
                    });
                    this.setState({
                        capacityInfo: info
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            // 获得今日运单统计
            H.server.get_today_waybill({}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        waybillStatics: res.data
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            // 获得今日的坐标集合
            H.server.get_all_points({}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        points: res.data
                    }, ()=>{
                        setTimeout(()=>{
                            this.initDriver();
                            if($('#mapScript').length > 0) {
                                this.initMap();
                            }
                        }, 500);

                        // this.initData();
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    // 创建当值司机的Panel
    createDriver() {
        let panel = [],
            title = null,
            btnName = null;

        if(this.state.currentStep == 1) {
            title = '请勾选今日出勤的司机';
            btnName = '下一步';
        } else if(this.state.currentStep == 2) {
            title = '今日出勤的司机';
            btnName = '保存';
        } else if(this.state.currentStep == 3) {
            title = '今日出勤的司机';
            btnName = '全部打印';
        }

        panel = (
            <div id="driver-panel" className="driver-panel">
                <div className="driver-head">
                    {this.state.currentStep==2?<span className="back" onClick={this.backTo.bind(this)}></span>:''}
                    <h5 id="driverHead">{title}</h5>
                </div>
                <div className="driver-list list-group">
                    {this.state.listPanelInfo}
                </div>
                <div id="btnOperate" className="driver-footer" onClick={this.operate.bind(this)}><h5>{btnName}</h5></div>
            </div>
        );

        return panel;
    }

    // 左侧栏的操作
    operate(e) {
        let html = $(e.target).html(),
            listInfo = [];

        switch (html) {
            case '下一步':

                this.setState({
                    checkedDriverList: []
                });

                H.Modal({
                    content: '选好司机，准备开始分配配送区域咯？',
                    okText: '开始分配',
                    cancel: true,
                    okCallback: ()=>{
                        let driverInfo = [];

                        // 将选中的司机信息，加入到被选中司机的数组信息里面
                        $('input[type="checkbox"]:checked').each((index, item) => {
                            driverInfo.push(this.state.driverList[item.dataset.index]);
                        });

                        if(driverInfo.length>0) {
                            setTimeout(()=>{
                                this.setState({
                                    checkedDriverList: driverInfo,
                                    currentStep: 2
                                });

                                // 构建司机列表信息
                                listInfo = this.buildTodayDriver();

                                this.setState({
                                    listPanelInfo: listInfo
                                });
                            }, 200);

                            // 更新左侧栏的内容
                            this.createDriver();
                        } else {
                            H.Modal('至少勾选一名司机才能进行调度分配！');
                        }
                    }
                });
                break;
            case '保存':
                let count = 0,
                    distributedArea = this.state.distributedArea,
                    noDriver = false;

                for(let key in distributedArea){
                    count += distributedArea[key].markers.length;
                }
                this.state.checkedDriverList.map((driver)=>{
                    if(!this.state.distributedArea[driver.uid]||this.state.distributedArea[driver.uid].markers.length<=0){
                        noDriver =true;
                    }
                });

                if(noDriver){
                    H.Modal('还有未分配运力的司机。');
                    return;
                } else {
                    H.Modal({
                        content:'检查所有的区域已经被分配了吗？保存后，不可再修改司机分配区域了，请谨慎操作。',
                        okText: '确认保存',
                        cancel: true,
                        okCallback: ()=>{

                            let assign = {};

                            for(let key in this.state.distributedArea){;
                                this.state.distributedArea[key].markers.map((marker)=>{
                                    marker.getExtData().point.customs.map((custom)=>{
                                        custom.deliveries.map((delivery)=>{
                                            assign[delivery.id] = key;
                                        });
                                    });
                                });
                            }

                            H.server.assign_delivery(assign, (res)=>{
                                if(res.code == 0) {
                                    setTimeout(()=>{
                                        this.setState({
                                            currentStep: 3
                                        });

                                        listInfo = this.buildTodayDriver();

                                        this.setState({
                                            listPanelInfo: listInfo
                                        });
                                    }, 200);

                                    this.createDriver();
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else{
                                    H.Modal(res.message);
                                }
                            });
                        }
                    });
                }
                break;
            case '全部打印':
                let print = [],
                    printer = '';
                this.state.checkedDriverList.map((driver, index)=>{
                    let goods = [];
                    driver.goods = [];
                    print.push(driver);
                    H.server.get_all_points({}, (res)=>{
                        if(res.code == 0) {
                            this.setState({
                                points: res.data
                            }, ()=>{
                                this.state.points.map((point)=>{
                                    point.customs.map((c)=>{
                                        c.deliveries.map((d)=>{
                                            if(d.driver){
                                                d.area = point.area.name;
                                                d.area = point.area.parent +'-'+point.area.name;
                                                if(driver.uid == d.driver.uid){
                                                    goods.push(d);
                                                    print[index].allHouse = this.state.disCount[d.driver.uid][0];
                                                    print[index].allVolume = this.state.disCount[d.driver.uid][1];
                                                }
                                            }
                                        });
                                    });

                                });
                                print[index].goods =goods;

                            });
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else{
                            H.Modal(res.message);
                        }
                    });
                });

                H.Modal({
                    title: '确认打印',
                    content:'确认打印司机清火单',
                    cancel: true,
                    okText:'开始打印',
                    cancelText:'我不打印',
                    okCallback: ()=>{
                        if(localStorage.getItem('print')){
                            printer = JSON.parse(localStorage.getItem('print')).driverPrinter;
                        }

                        this.createPrintTable(print);
                        let LODOP = getLodop();
                        LODOP.SET_PRINT_PAGESIZE(0, 2100, 2970, 'driver'); // 设置打印单据纸张大小
                        LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                        LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'driver'); // 设置自定义的纸张名字

                        LODOP.PRINT();
                    }
                });


                break;
        }


    }

    // 构建司机的列表
    buildTodayDriver(checked) {
        let listInfo = [],
            disCount = this.state.disCount,
            color = this.state.checkedColor;

        if(this.state.currentStep == 1){

            this.initMap();

            this.setState({
                distributedArea:{},
                disCount:{},
                checkedColor:{}
            }, ()=>{
                this.initDriver();
                listInfo = this.state.listPanelInfo;
            });


        }else if(this.state.currentStep == 2) {
            this.state.checkedDriverList.map((cdriver, index) => {

                let c = false;

                if(checked){
                    for(let i=0; i< checked.length; i++){
                        if(checked[i] == index){
                            c = true;
                        }
                    }
                }

                listInfo.push(
                    <li key={index} className="list-group-item driver-list" style={{height:'135px'}} data-index={index}
                        onMouseEnter={this.driverMoveEnter.bind(this)} onMouseLeave={this.driverMoveLeave.bind(this)}>
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-6">{cdriver.name}</div>
                                <div className="col-lg-6">{cdriver.mobile}</div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">{cdriver.capacity}</div>
                                <div className="col-lg-6">[{cdriver.car_no}]</div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    运力上限：{this.state.capacityInfo[cdriver.capacity][0]+'户，'+this.state.capacityInfo[cdriver.capacity][1]+'件'}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    已分配：<span className="households">{disCount[index]?disCount[index][0]:0}</span>户，<span className="cases">0</span>件
                                </div>
                            </div>
                            <div className="row" style={{marginTop:'10px'}}>
                                <div className="col-lg-2 badge" style={{background:color[index]}}></div>
                                {c?<button className="col-lg-10 btn distribute" type="button" disabled="true" onClick={this.distributeArea.bind(this)}>双击区块修改配送区域</button>
                                :<button className="col-lg-10 btn distribute" type="button" onClick={this.distributeArea.bind(this)}>分配配送区域</button>}
                            </div>
                        </div>
                    </li>
                );
            });
        } else if(this.state.currentStep == 3) {
            this.state.checkedDriverList.map((checkdriver, index) => {

                let maxBill = this.state.capacityInfo[checkdriver.capacity][0],
                    maxPack = this.state.capacityInfo[checkdriver.capacity][1];

                listInfo.push(
                    <li key={index} className="list-group-item driver-list" style={{height:'120px'}} data-index={index}  onMouseEnter={this.driverMoveEnter.bind(this)} onMouseLeave={this.driverMoveLeave.bind(this)}>
                        <div className="col-lg-12">
                            <div className="row" style={{marginBottom:'10px'}}>
                                <div className="col-lg-6">{checkdriver.name}</div>
                                <div className="col-lg-6">{checkdriver.mobile}</div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">{checkdriver.capacity}</div>
                                <div className="col-lg-6">[{checkdriver.car_no}]</div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    运力上限：{maxBill}户，{maxPack}件
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    已分配：{disCount[checkdriver.uid]?disCount[checkdriver.uid][0]:0}户，{disCount[checkdriver.uid]?disCount[checkdriver.uid][1]:0}件
                                </div>
                                <div className="col-lg-2 badge" style={{background:color[index]}}></div>
                                <button className="col-lg-4 btn" type="button" onClick={this.print.bind(this)}>打印</button>
                            </div>
                        </div>
                    </li>
                );
            });
        }
        return listInfo;
    }

    // 鼠标移入出勤司机，高亮显示分配到该司机的多边形
    driverMoveEnter(e) {
        let index = e.target.dataset.index,
            currentDriver = this.state.checkedDriverList[index],
            distributedArea = {};

        if(currentDriver) {
            distributedArea = this.state.distributedArea[currentDriver.uid];
        }

        if(distributedArea && distributedArea.markers && distributedArea.polygon){

            if(distributedArea.polygon){
                distributedArea.polygon.setOptions({
                    fillOpacity: .8
                });
            }
        }
    }

    // 鼠标移出出勤司机
    driverMoveLeave(e) {
        let index = e.target.dataset.index,
            currentDriver = this.state.checkedDriverList[index],
            distributedArea = {};

        if(currentDriver) {
            distributedArea = this.state.distributedArea[currentDriver.uid];
        }


        if(distributedArea){
            if(distributedArea.polygon){
                distributedArea.polygon.setOptions({
                    fillOpacity: .35
                });
            }
        }

    }

    // 分配配送区域
    distributeArea(e) {

        let mouseTool = new AMap.MouseTool(this.state.map),
            node = e.target,
            serial = parseInt(e.target.dataset.reactid.split('$')[2].split('.')[0]);      // 第几个出勤司机（序号）

        if($(node).hasClass('btn-default')){
            $(node).removeClass('btn-default').html('分配配送区域');
            mouseTool.close();
            return;
        } else {
            $(node).addClass('btn-default').html('右键单击结束配送区域的绘制');
            mouseTool.polygon();
            /**
             * mouseTool: 鼠标工具
             * serial：出勤司机列表中该司机的序号
             * node：所操作的button按钮
             */
            this.drawDistribution(mouseTool, serial, node);
        }
    }

    /**
     * 新增绘制的区域
     * @param mouseTool：鼠标工具
     * @param serial：当前司机的序号
     * @param node：btn按钮对象
     */
    drawDistribution(mouseTool, serial, node) {
        AMap.event.addListener(mouseTool, 'draw', (e)=> {
            let colorVal = this.color(),                             // 随机颜色
                unMarkers = this.state.unMarkers,                    // 未分配的Marker
                distributedArea = this.state.distributedArea,                   // 已分配到每个司机下的Marker
                checkedColor = this.state.checkedColor,                         // 存储保存到的颜色信息
                currentDriver = this.state.checkedDriverList[serial];           // 当前选中的司机
            let polygon = e.obj,                                                // 获取到当前绘制或编辑的多边形
                editor = new AMap.PolyEditor(this.state.map, e.obj);            // 获取到当前多边形的编辑状态对象
            let disCount = this.state.disCount,                                 // 存储分配件数的对象
                totalCustoms = this.state.totalCustoms,
                customs = 0,
                volume = 0;

            editor.close();

            // 设置相应的样式
            $(node.parentNode.children[0]).css({background:colorVal});
            checkedColor[serial] = colorVal;
            e.obj.setOptions({
                fillColor: colorVal,
                strokeColor: colorVal
            });

            // 在循环遍历之前先把存储当前司机的分配Marker给清空
            if(!distributedArea[currentDriver.uid]){
                distributedArea[currentDriver.uid] = {markers:[], polygon:null};
            }

            // 通过循环计算Marker是否在多边形内
            for(let i=0; i<unMarkers.length; i++){
                customs += unMarkers[i].getExtData().point.customs.length;

                if(polygon.contains([unMarkers[i].getPosition().lng, unMarkers[i].getPosition().lat])){
                    /**
                     * 如果Marker在多边形内：
                     * 1、该变Marker的样式
                     * 2、将这几个点从UnMarker中移除
                     * 3、将这几个点加入CheckMarkers下该司机中
                     */
                    distributedArea[currentDriver.uid].markers.push(unMarkers[i]);
                    unMarkers[i].setIcon('');
                    customs -= unMarkers[i].getExtData().point.customs.length;
                    unMarkers[i].getExtData().point.customs.map((c)=>{
                        c.deliveries.map((d)=>{
                            volume += d.volume;
                        });
                    });

                    unMarkers.splice(i, 1);
                    i--;
                }
            }
            distributedArea[currentDriver.uid].polygon = polygon;

            // 绘制完成后，对按钮的样式进行设置，并且停止鼠标事件
            $(node).removeClass('btn-default').html('双击区块修改配送区域').attr('disabled', 'true');
            mouseTool.close();

            // 保存分配的户数和件数
            disCount[currentDriver.uid] = [distributedArea[currentDriver.uid].markers.length, volume];

            $('.households')[serial].innerHTML = disCount[currentDriver.uid][0];
            $('.cases')[serial].innerHTML = disCount[currentDriver.uid][1];
            $('#disHouse').html(totalCustoms - customs);
            $('#unDisHouse').html(customs);

            this.state.points.map((point)=>{
                if(point.driver){
                    if(point.driver.uid == currentDriver.uid){
                        this.state.distributedArea[currentDriver.uid].markers.map((marker)=>{
                            distributedArea[currentDriver.uid].markers.push(marker);
                        });
                    }
                }
            });

            $.extend(distributedArea, this.state.distributedArea);

            // 最后保存一次选中的点和未分配点的信息
            this.setState({
                disCount: disCount,
                totalCustoms: totalCustoms,
                distributedArea:distributedArea,
                unMarkers: unMarkers,
                checkedColor: checkedColor
            }, ()=>{
                this.buildTodayDriver();
                // 修改绘制区域
                this.updateDistribution(e.obj, editor, serial, polygon);
            });
        });
    }

    /**
     * 修改绘制区域
     * @param obj：e.obj
     * @param editor：多边形编辑对象
     * @param serial：当前司机的序号
     * @param polygon：多边形对象
     */
    updateDistribution(obj, editor, serial, polygon){
        let _this = this,
            dbEvent = null;

        // 双击开始编辑配送区域
        dbEvent = AMap.event.addListener(obj, 'dblclick', function() {
            let distributedArea = _this.state.distributedArea,
                currentDriver = _this.state.checkedDriverList[serial],
                unMarkers = _this.state.unMarkers,
                disCount = _this.state.disCount,
                volume = 0,
                customs = _this.state.totalCustoms;

            if(editor.edit == 1) {
                // 在循环之前，先将未分配的Markers和当前司机选中区块的Marker合二为一
                unMarkers.push.apply(unMarkers, distributedArea[currentDriver.uid].markers);
                // unMarkers = unMarkers.concat(distributedArea[currentDriver.uid].markers);

                // 在每次循环遍历之前先把存储当前司机的分配Marker给清空
                distributedArea[currentDriver.uid] = {markers:[], polygon:null};

                // 循环判断点是否在多边形之中
                for(let i=0; i<unMarkers.length; i++) {
                    if(polygon.contains([unMarkers[i].getPosition().lng, unMarkers[i].getPosition().lat])){
                        /**
                         * 如果Marker在多边形内：
                         * 1、该变Marker的样式
                         * 2、将这几个点从UnMarker中移除
                         * 3、将这几个点加入CheckMarkers下该司机中
                         */
                        distributedArea[currentDriver.uid].markers.push(unMarkers[i]);
                        unMarkers[i].setIcon('');
                        customs -= unMarkers[i].getExtData().point.customs.length;
                        unMarkers[i].getExtData().point.customs.map((c)=>{
                            c.deliveries.map((d)=>{
                                volume += d.volume;
                            });
                        });
                        unMarkers.splice(i, 1);

                        i--;
                    } else {
                        /**
                         * 如果Marker不在多边形内：
                         * 1、该变Marker的样式
                         * 2、将这几个点从CheckMarkers移除
                         */
                        unMarkers[i].setIcon('http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png');

                    }
                }

                distributedArea[currentDriver.uid].polygon = polygon;

                // 修改完成后，更新分配的户数
                disCount[currentDriver.uid] = [distributedArea[currentDriver.uid].markers.length, volume];
                $('.households')[serial].innerHTML = disCount[currentDriver.uid][0];
                $('.cases')[serial].innerHTML = disCount[currentDriver.uid][1];
                $('#disHouse').html(_this.state.totalCustoms-customs);
                $('#unDisHouse').html(customs);

                _this.state.points.map((point)=>{
                    if(point.driver){
                        if(point.driver.uid == currentDriver.uid){
                            _this.state.distributedArea[currentDriver.uid].markers.map((marker)=>{
                                distributedArea[currentDriver.uid].markers.push(marker);
                            });
                        }
                    }
                });

                $.extend(distributedArea, _this.state.distributedArea);

                _this.setState({
                    disCount: disCount,
                    unMarkers: unMarkers,
                    distributedArea: distributedArea
                });
                editor.edit = 0;
                editor.close();
            }else {
                editor.edit = 1;
                editor.open();
            }
        });


        this.setState({
            dbEvent: dbEvent
        });
    }

    // 创建今日任务量
    createTask() {
        return (
            <div id="task" className="task-panel">
                <div className="panel panel-default">
                    <div id="taskHead" className="panel-heading">
                        <h3 className="panel-title">今日总任务量</h3>
                    </div>
                    <div className="panel-body" id="panelBody">
                        <p className="col-lg-12">配送户数：{this.state.waybillStatics.customs}户</p>
                        <p className="col-lg-12">配送件数：{this.state.waybillStatics.volume}件</p>

                        <p className="col-lg-12">预计车辆：{this.state.waybillStatics.cars}个车；平均{this.state.waybillStatics.car_volume}件货物</p>
                        <p className="col-lg-12">已分配<span id="disHouse">{this.state.waybillStatics.customs_has_driver}</span>户；未分配<span id="unDisHouse">{this.state.waybillStatics.customs_has_no_driver}</span>户</p>
                    </div>
                    <div className="panel-footer" onClick={this.togglePanelBody.bind(this)}>展开</div>
                </div>
            </div>
        );
    }

    // 展开/收缩今日任务量
    togglePanelBody(e) {
        $('#panelBody').slideToggle('slow');
        $(e.target).html($(e.target).html()=='展开'?'收起':'展开');
    }

    // 返回
    backTo() {
        let listInfo = [];

        if(this.state.currentStep == 2) {

            H.Modal({
                content:'此时返回，会清空地图上所有已分配的区域。确认返回？',
                okText:'确认返回',
                cancel: true,
                okCallback: ()=>{
                    // 从第二个页面返回第一个个页面，需要将已勾选的用户设置为选中，且清除画面上的所有多边形
                    this.setState({
                        currentStep:1
                    }, ()=>{
                        listInfo = this.buildTodayDriver();
                        this.setState({
                            listPanelInfo: listInfo
                        }, this.createDriver);
                    });
                }
            });
        } else if(this.state.currentStep == 3) {
            let distributedArea = this.state.distributedArea,
                disDriver = [];

            // 从第三个页面返回第二个页面，需要获取到被选中的司机哪些是被分配到的
            for(let key in distributedArea){
                disDriver.push(parseInt(key));
            }

            this.setState({
                currentStep:2
            }, ()=>{
                listInfo = this.buildTodayDriver(disDriver);

                this.setState({
                    listPanelInfo: listInfo
                }, ()=>{
                    this.createDriver();
                });
            });
        }
    }

    // 打印单独一条
    print(e) {
        let index = e.target.dataset.reactid.split('$')[2].split('.')[0],
            uid = this.state.checkedDriverList[index].uid,
            print = [],
            printer = '';

        // 获取已分配的运单，
        H.server.get_all_points({}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    points: res.data
                }, ()=>{
                    this.state.points.map((point)=>{
                        point.customs.map((c)=>{
                            c.deliveries.map((d)=>{
                                if(d.driver){
                                    d.area = point.area.parent +'-'+point.area.name;
                                    if(uid == d.driver.uid){
                                        d.allHouse = this.state.disCount[d.driver.uid][0];
                                        d.allVolume = this.state.disCount[d.driver.uid][1];
                                        print.push(d);
                                    }
                                }
                            });
                        });
                    });
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }

        });

        H.Modal({
            title: '确认打印',
            content:'确认打印司机清货单',
            cancel: true,
            okText:'开始打印',
            cancelText:'我不打印',
            okCallback: ()=>{
                if(localStorage.getItem('print')){
                    printer = JSON.parse(localStorage.getItem('print')).driverPrinter;
                }

                this.createPrintTable(print);
                let LODOP = getLodop();
                LODOP.SET_PRINT_PAGESIZE(0, 2100, 2970, 'driver'); // 设置打印单据纸张大小
                LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'driver'); // 设置自定义的纸张名字

                LODOP.PRINT();
            }
        });
    }

    // 创建打印表格模板
    createPrintTable(bill) {
        let drivers = [];
        if(bill[0].goods){
            // 全部打印
            drivers = bill;
            drivers.map((driver)=>{
                driver.allBills = driver.goods.length;
                driver.deliveries = {};
                if(driver.goods.length<=1){
                    driver.deliveries[H.getLadingCode(driver.goods[0].code, [2, 3, 4])] = [driver.goods[0]];
                }

                for(let i=0; i<driver.goods.length-1; i++){
                    if(driver.goods.length>1){
                        let code1 = H.getLadingCode(driver.goods[i].code, [2, 3, 4]);
                        let code2 = H.getLadingCode(driver.goods[i+1].code, [2, 3, 4]);
                        if(!driver.deliveries[code1]) driver.deliveries[code1] = [];
                        if(!driver.deliveries[code2]) driver.deliveries[code2] = [];
                        if(code1 == code2){
                            if(driver.deliveries[code1].length>0){
                                driver.deliveries[code1].push(driver.goods[i+1]);
                            }else{
                                driver.deliveries[code1].push(driver.goods[i]);
                                driver.deliveries[code1].push(driver.goods[i+1]);
                            }
                        } else {
                            if(driver.deliveries[code1].length>0){
                                driver.deliveries[code2].push(driver.goods[i+1]);
                            } else {
                                driver.deliveries[code1].push(driver.goods[i]);
                                driver.deliveries[code2].push(driver.goods[i+1]);
                            }
                        }
                    } else {
                        driver.deliveries[H.getLadingCode(driver.goods[i].code, [2, 3, 4])].push(driver.goods[i]);
                    }

                }
            });
        } else {
            // 单条打印
            let driver = {};
            driver = bill[0].driver;
            driver.allVolume = bill[0].allVolume;
            driver.allHouse = bill[0].allHouse;
            driver.allBills = bill.length;
            driver.deliveries = {};

            if(bill.length<=1){
                driver.deliveries[H.getLadingCode(bill[0].code, [2, 3, 4])] = [bill[0]];
            }
            // 将同一个提货码
            for(let i=0; i<bill.length-1; i++){
                if(bill.length>1){
                    let code1 = H.getLadingCode(bill[i].code, [2, 3, 4]);
                    let code2 = H.getLadingCode(bill[i+1].code, [2, 3, 4]);
                    if(!driver.deliveries[code1]) driver.deliveries[code1] = [];
                    if(!driver.deliveries[code2]) driver.deliveries[code2] = [];
                    if(code1 == code2){
                        if(driver.deliveries[code1].length>0){
                            driver.deliveries[code1].push(bill[i+1]);
                        }else{
                            driver.deliveries[code1].push(bill[i]);
                            driver.deliveries[code1].push(bill[i+1]);
                        }
                    } else {
                        if(driver.deliveries[code1].length>0){
                            driver.deliveries[code2].push(bill[i+1]);
                        } else {
                            driver.deliveries[code1].push(bill[i]);
                            driver.deliveries[code2].push(bill[i+1]);
                        }

                    }
                } else {
                    driver.deliveries[H.getLadingCode(bill[i].code, [2, 3, 4])].push(bill[i]);
                }

            }
            driver.goods = bill;
            drivers.push(driver);
        }

        let trContent = '',
            date = new Date(),
            table = '',
            keys = [],
            deliveries = [],
            now = H.getSouroundDate(0)+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

        drivers.map((driver)=>{
            keys = Object.keys(driver.deliveries).sort();
            keys.map((key)=>{
                deliveries.push(driver.deliveries[key]);
            });

            deliveries.map((deliverie)=>{
                let code = H.getLadingCode(deliverie[0].code, [2, 3, 4]),
                    counter = H.getLadingCode(deliverie[0].code, [2, 3], '-');

                for(let k =0, len = deliverie.length ; k<len; k++){
                    let td1 = k==0?'<td rowspan="'+len+'">'+code+'</td>':'';
                    let td2 = k==0?'<td rowspan="'+len+'">'+counter+'</td>':'';
                    let td6 = k==0?'<td rowspan="'+len+'">'+deliverie[0].area+'</td>':'';
                    let td7 = k==0?'<td rowspan="'+len+'">'+'</td>':'';

                    trContent +='<tr>'+ td1 + td2 +
                        '<td>'+deliverie[k].day_no+'</td>' +
                        '<td>'+deliverie[k].volume+'</td>' +
                        '<td>'+deliverie[k].custom.name+'</td>' + td6+td7 + '</tr>';
                }

            });

            table = '<style> table,td,th {border: 1px solid black;border-style: solid;border-collapse: collapse;' +
                'line-height: 20px; text-align: center; font-size: 14px}</style><table border="1" width="705px">' +
                '<thead>' +
                '<tr> ' +
                '<th wdith="15%">提货码</th>' +
                '<th width="10%">货架号</th>' +
                '<th width="20%">运单号</th>' +
                '<th width="10%">数量</th>' +
                '<th width="20%">收货人</th>'+
                '<th width="20%">物流线</th>' +
                '<th width="10%">排序</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +trContent+ '</tbody>' +
                '</table>';


            LODOP.NewPage();
            LODOP.ADD_PRINT_TABLE(111, 27, 710, 920, table);
            LODOP.ADD_PRINT_TEXT(35, 313, 118, 31, '司机清货单');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15);
            LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
            LODOP.SET_PRINT_STYLEA(0, 'Horient', 2);
            LODOP.ADD_PRINT_TEXT(80, 30, 211, 26, '司机：'+driver.car_no+' '+driver.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(79, 242, 173, 25, '合计：'+driver.allHouse+'户，'+driver.allBills+'票，'+driver.allVolume+'件');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(81, 512, 221, 25, '打印时间：'+now);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        });
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

    // 定义绘图区块的颜色
    color() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    render() {
        return (
            <div className="waybill-info-container">
                <div className="waybill-info-head container-fluid">
                    <h3 className="title">调度分配<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                    <hr/>
                    <div className="waybill-info-content">
                        {this.createDriver()}
                        <div id="map" className="map-container">
                            <div className="loader">
                                <div className="loading-1"></div>
                                <div className="loading-2"><h3>地图加载中...</h3></div>
                            </div>
                        </div>
                        {this.createTask()}
                    </div>
                </div>
            </div>
        );
    }
}

export default Dispatching;