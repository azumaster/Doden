/**
 * 运单实时状态
 * @author: 魏华东
 * @date: 2016.12.16
 */

import React from 'react';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Table from '../../../../components/table.jsx';

class WaybillRealTime extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentStatus: '-1',                    // 当前司机运送状态
            waybillStatus:0,
            waybillList: [],
            waybillDetail: [],
            detailInfo: [],
            detail: null
        };
        this.getRealTimeList = this.getRealTimeList.bind(this);
    }

    componentWillMount() {
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }
        this.getRealTimeList();
    }

    // 获取实时运单列表
    getRealTimeList() {
        let todayStatus;
        this.state.currentStatus=='-1'?todayStatus=null:todayStatus=this.state.currentStatus;

        H.server.get_real_time_waybill({status: todayStatus}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    detailInfo: res.data.driver
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建卡片
    createCard() {
        let detailInfo = this.state.detailInfo,
            panel = [];

        if(detailInfo.length>0){
            detailInfo.map((detail, index)=>{

                let today = ['未发车', '配送中', '配送完成'],
                    todayStatus = today[detail.today_status/10];

                if(this.state.currentStatus == detail.today_status || this.state.currentStatus == '-1'){
                    panel.push(
                        <div key={index} className="col-lg-3">
                            <div className="thumbnail" data-index={index} data-uid={detail.uid}>
                                <div className="caption">
                                    <div className="row">
                                        <p className="col-lg-7">{detail.car_no}</p>
                                        <p className="col-lg-5">{detail.capacity}</p>
                                    </div>
                                    <div className="row">
                                        <p className="col-lg-7">{detail.name + '['+detail.mobile+']'}</p>
                                        <p className="col-lg-5">状态：{todayStatus}</p>
                                    </div>
                                    <hr/>
                                    {detail.statics[0]?
                                        <div className="row">
                                            <span className="col-lg-3">待揽货</span>
                                            <span className="col-lg-4">{detail.statics[0].customs}户，{detail.statics[0].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>待揽货名单</a>
                                        </div>
                                        :null}
                                    {detail.statics[10]?
                                        <div className="row">
                                            <span className="col-lg-3">待装车</span>
                                            <span className="col-lg-4">{detail.statics[10].customs}户，{detail.statics[10].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>待装车名单</a>
                                        </div>
                                    :null}
                                    {detail.statics[20]?
                                        <div className="row">
                                            <span className="col-lg-3">已装车</span>
                                            <span className="col-lg-4">{detail.statics[20].customs}户，{detail.statics[20].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>已装车名单</a>
                                        </div>
                                    :null}
                                    {detail.statics[30]?
                                        <div className="row">
                                            <span className="col-lg-3">配送中</span>
                                            <span className="col-lg-4">{detail.statics[30].customs}户，{detail.statics[30].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>配送中名单</a>
                                        </div>
                                        :null}
                                    {detail.statics[40]?
                                        <div className="row">
                                            <span className="col-lg-3">已送达</span>
                                            <span className="col-lg-4">{detail.statics[40].customs}户，{detail.statics[40].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>已送达名单</a>
                                        </div>
                                    :null}
                                    {detail.statics[41]?
                                        <div className="row">
                                            <span className="col-lg-3">被拒单</span>
                                            <span className="col-lg-4">{detail.statics[41].customs}户，{detail.statics[41].volume}件</span>
                                            <a href="javascript:;" className="col-lg-4" onClick={this.openDetailPanel.bind(this)}>被拒单名单</a>
                                        </div>
                                    :null}
                                    <hr/>
                                    <div onClick={this.print.bind(this)} className="row" style={{marginLeft: '10px'}}>
                                        <button data-uid={detail.uid} className="btn btn-sm btn-default" style={{marginRight: '10px'}}>打印K单</button>
                                        <button data-uid={detail.uid} className="btn btn-sm btn-default">打印清货单</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            });
        }


        return (
            <div className="row">
                {panel}
            </div>
        );
    }

    // 创建发车状态选择
    createStatus() {
        let statusNames = ['全部', '未发车', '配送中', '已结束'],
            statusData = ['-1', 0, 10, 20];

        return (
            <BtnGroup btnNames={statusNames} bindData={statusData} clickCallback={this.toggleStatus.bind(this)}
                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentStatus}/>
        );
    }

    // 发车状态的切换
    toggleStatus(e) {
        let index = e.target.dataset.index;

        if(index === this.state.currentStatus) return;

        this.setState({
            currentStatus: index
        });
    }

    // 运单状态的切换
    toggleWaybillStatus(e) {
        let index = e.target.dataset.index;

        if(index === this.state.waybillStatus) {
            return;
        }

        this.setState({
            waybillStatus: index
        });
    }

    // 创建右侧的详细信息的栏目
    createDetail() {
        let btnNames = ['待揽货', '待装车', '已装车', '配送中', '已送达', '被拒单'],
            bindData = [0, 10, 20, 30, 40, 41],
            detail = this.state.detail;

        if(!detail){
            return null;
        }

        let today = ['未发车', '配送中', '配送完成'],
            todayStatus = today[detail.today_status/10];

        return (
            <div id="detail" className="detail">
                <div className="btn-slide" onClick={this.closeDetail.bind(this)}>收起</div>
                <div className="detail-content">
                    <div className="row">
                        <div className="col-lg-6">{detail.car_no + ' ' + detail.capacity}</div>
                        <div className="col-lg-4 pull-right">状态：{todayStatus}</div>
                    </div>
                    <div className="row">
                        <p className="col-lg-12">{detail.name} [{detail.mobile}]</p>
                    </div>
                    <div className="row" style={{marginBottom: '30px'}}>
                        <BtnGroup btnNames={btnNames} bindData={bindData} clickCallback={this.toggleWaybillStatus.bind(this)}
                                  style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.waybillStatus}/>
                    </div>
                    {this.createTable()}
                </div>
            </div>
        );
    }

    // 关闭右侧的详细栏
    closeDetail() {
        $('#detail').removeClass('active');
    }

    // 打开右侧的详细栏
    openDetailPanel(e) {
        let html = $(e.target).html(),
            waybillStatus = this.state.waybillStatus,
            uid = e.target.parentNode.parentNode.parentNode.dataset.uid,
            waybill = {'待揽货名单':0, '待装车名单':10, '已装车名单':20, '配送中名单':30, '已送达名单':40, '被拒单名单':41};

        for(let key in waybill){
            if(key == html){
                waybillStatus = waybill[key];
            }
        }

        H.server.get_real_time_detail({id: uid}, (res)=>{
            if(res.code == 0) {

                this.setState({
                    waybillStatus: waybillStatus,
                    detail: res.data
                }, ()=>{
                    $('#detail').addClass('active');
                });
            } else if (res.code == 10106) {
                H.overdue();
            } else {
                H.Modal(res.message);
            }
        });
    }

    // 创建表格
    createTable() {
        let headlines = ['运单号', '提货码', '件量', '发货方'],
            order = ['day_no', 'codes', 'volume', 'sender'],
            fn = {},
            status = {},
            statusOperate = {};
        let delivers = [];

        this.state.detail.deliveries.map((delivery)=>{
            delivery.codes = H.getLadingCode(delivery.code, [2, 3, 4]);
            delivery.sender = delivery.shop.name;

            if(this.state.waybillStatus == delivery.status){
                delivers.push(delivery);
            }

        });

        return (
            <Table values={delivers} headlines={headlines} order={order} bodyOperate={fn} id={'InTimeInfo'}
                   statusOperate={statusOperate} status={status} />
        );
    }

    // 刷新页面
    refresh() {
        this.setState({
            currentStatus: '-1'
        }, this.getRealTimeList);
    }

    // 打印控制
    print(e){
        let operate = e.target.innerHTML,
            id = e.target.dataset.uid?e.target.dataset.uid:0;

        switch (operate){
            case '打印K单':
                this.printK(id);
                break;
            case '打印清货单':
                this.printDriver(id);
                break;
        }
    }

    // 打印K单
    printK(id){
        let waybills = [],
            printer = '';

        new Promise((resolve)=>{
            H.server.get_real_time_detail({id: id}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        waybillList: res.data.deliveries
                    }, ()=>{resolve('ok');});
                } else if (res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal(res.message);
                }
            });
        }).then(()=> {
            for (let i = 0; i < this.state.waybillList.length; i++) {
                H.server.get_current_waybill({id: this.state.waybillList[i].id}, (res) => {
                    if (res.code == 0) {
                        if(res.data.kno && res.data.status != '-10' && res.data.status != '-11' && res.data.status != '-12'){
                            waybills.push(res.data);
                        }
                    } else if (res.code == 10106) {
                        H.overdue();
                    } else {
                        H.Modal(res.message);
                    }
                });
            }

            let interval = setInterval(()=>{
                if(waybills.length > 0){
                    clearInterval(interval);
                    H.Modal({
                        title: '确认打印',
                        content:'确认批量打印K单？',
                        cancel: true,
                        okText:'开始打印',
                        okCallback: ()=>{
                            if(localStorage.getItem('print')){
                                printer = JSON.parse(localStorage.getItem('print')).waybillPrinter;
                            }

                            this.createWaybillModal(waybills);

                            let LODOP = getLodop();
                            LODOP.SET_PRINT_PAGESIZE(0, 2200, 1405, 'bills'); // 设置打印单据纸张大小
                            LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                            LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'bills'); // 设置自定义的纸张名字

                            LODOP.PRINT();

                        }
                    });
                }
            }, 0);
        });
    }

    // 打印清货单
    printDriver(id){
        console.log('打印清货单：'+id);
        let print = [],
            allHouse = 0,
            allVolume = 0,
            printer = '';


        // 获取已分配的运单，
        H.server.get_all_points({}, (res)=>{
            if(res.code == 0) {
                let points = res.data,
                    a = false;
                points.map((point)=>{
                    if(a){
                        allHouse += point.customs.length;
                        a = false;
                    }
                    point.customs.map((c)=>{
                       c.deliveries.map((d)=>{
                           if(d.driver){
                               d.area = point.area.parent + '-' + point.area.name;
                               if(id == d.driver.uid){
                                   a = true;
                                   allVolume += d.volume;
                                   print.push(d);
                               }
                           }
                       });
                    });
                });

                print.map((pr)=>{
                    pr.allHouse = allHouse;
                    pr.allVolume = allVolume;
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }

        });

        H.Modal({
            title: '确认打印',
            content:'确认司机清货单？',
            cancel: true,
            okText:'开始打印',
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
        // 单条打印
        let driver = {};

        console.log(bill);

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

    // 创建配送单的模板
    createWaybillModal(waybills) {
        LODOP = getLodop();

        for(let i=0; i<waybills.length; i++){
            let note = ((waybills[i].info!==null)?waybills[i].info.note:'');

            LODOP.NewPage();
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
            LODOP.ADD_PRINT_TEXT(10, 608, 156, 30, waybills[i].day_no);
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.SET_PRINT_STYLEA(0, 'FontColor', '#FF0000');
            LODOP.ADD_PRINT_TEXT(29, 608, 156, 30, waybills[i].day);
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(47, 608, 156, 31, waybills[i].driver?waybills[i].driver.name+' '+waybills[i].driver.car_no:'');
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(65, 608, 156, 31, waybills[i].kno?waybills[i].kno:'-');
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12);
            LODOP.ADD_PRINT_TEXT(136, 64, 305, 25, '发货人：'+waybills[i].shop.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(160, 64, 305, 25, '发货人电话：'+waybills[i].shop.mobile);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(103, 258, 141, 25, '发货地：海霸王');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(109, 602, 168, 30, '提货码：'+H.getLadingCode(waybills[i].code, [2, 3, 4]));
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(162, 436, 305, 25, '物流区域：'+waybills[i].address.area.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(211, 436, 305, 45, '提货地址：'+waybills[i].address.full);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(137, 436, 305, 25, '提货人：'+waybills[i].custom.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(186, 436, 305, 25, '提货电话：'+waybills[i].custom.mobile);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_RECT(277, 47, 330, 135, 0, 1);
            LODOP.ADD_PRINT_RECT(278, 419, 330, 135, 0, 1);
            LODOP.ADD_PRINT_TEXT(292, 65, 40, 25, '货物');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(317, 65, 305, 25, '货物件数（袋、箱）：'+waybills[i].volume);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(342, 65, 305, 25, '备注：'+note);
            LODOP.ADD_PRINT_RECT(370, 226, 142, 37, 0, 1);
            LODOP.ADD_PRINT_TEXT(383, 233, 43, 24, '签字');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(292, 437, 61, 24, '代收货款');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(317, 438, 305, 25, '货款：'+waybills[i].amount+'元');
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

    render() {
        return (
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                {this.createStatus()}
                                <a href="javascript:;" className="form-control-static" style={{marginLeft: '50px'}} onClick={this.refresh.bind(this)}>刷新</a>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-12">
                        {this.createCard()}
                        {this.createDetail()}
                    </div>
                </div>
            </div>
        );
    }
}

export default WaybillRealTime;