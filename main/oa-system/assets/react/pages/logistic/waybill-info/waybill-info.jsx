/**
 * 运单管理（全部运单页）
 * @author: 魏华东
 * @date: 2016.12.14
 */

import React from 'react';
import Table from '../../../../components/table.jsx';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Search from '../../../../components/search/search.js';
import Paging from '../../../../components/page/paging.js';
import DatePicker from '../../../../components/datePicker/index.jsx';
import WaybillDetail from './waybill-detail.jsx';
import Dispatching from './dispatching.jsx';
import AddWaybill from './add-waybill.jsx';

class WaybillInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            areaList:[],                        // 区域的数组信息
            waybillList:[],                     // 全部运单信息

            search:'',                          // 搜索词
            searchType:[],                      // 搜索类型
            start:H.getSouroundDate(0),         // 查询的起始时间
            end:H.getSouroundDate(0),           // 查询的结束时间
            status:[],                          // 运单状态
            adcode:'',                          // 区域编号
            amount:'',                          // 是否代收款
            date:'',

            currentDate:0,          // 当前选中的预设日期
            currentBillStatus:'-1', // 当前选中的运单状态

            area:'成都市',           // 配送区域
            currentArea:0,          // 当前选中的区域
            replace:0,              // 是否代收货款
            currentReplace:0,       // 当前代收货款状态

            page:1,                             // 当前页数
            size:30,                            // 每一页显示多少条纪录
            total:50,                           // 运单总数
            shopTotal:0,                        // 发货人数量
            customTotal:0,                      // 提货人数量
            panel:''                            // 明细的页面
        };

        this.getData = this.getData.bind(this);
        this.operate = this.operate.bind(this);
        this.srOnlyLadingNumber = this.srOnlyLadingNumber.bind(this);
        this.srOnlySender = this.srOnlySender.bind(this);
        this.closePanel= this.closePanel.bind(this);
        this.getAllArea= this.getAllArea.bind(this);
        this.urlEncode= this.urlEncode.bind(this);
    }

    // 初始化获取数据
    componentWillMount() {
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }

        new Promise((resolve)=>{
            this.getAllArea(resolve);
        }).then(()=>{
            this.getData();
        });
    }

    //获取所有大区;
    getAllArea(resolve) {
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
    }

    // 获取全部数据
    getData(){
        let waybillData = {};
        waybillData.start = this.state.start;
        waybillData.end = this.state.end;
        waybillData.status = this.state.status;
        waybillData.page = this.state.page;
        waybillData.size = this.state.size;

        if(this.state.search){
            waybillData.search = this.state.search;
            waybillData.search_type=this.state.searchType;
        }
        if(this.state.amount===false||this.state.amount===true){
            waybillData.amout = this.state.amount;
        }
        if(this.state.adcode){
            waybillData.adcode = this.state.adcode;
        }

        H.server.get_all_waybill(waybillData, (res) => {
            if(res.code == 0) {
                this.setState({
                    total: res.data.total,
                    shopTotal: res.data.shop_num,
                    customTotal: res.data.custom_num,
                    waybillList: res.data.deliveries
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建选择区域
    createSelectArea() {
        let date = ['今天', '明天'],
            dateData = [0, 1];
        let billStatus = ['全部', '待揽货', '待装车', '已装车', '配送中', '已送达', '已拒单', '已取消'],
            billStatusData = ['-1', 0, 10, 20, 30, 40, 41, '-10'];
        let area = [],
            areaData = [];
        let replace = ['全部', '否', '是'],
            replaceData = [0, 1, 2];

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
                            <label style={{display: 'inline-block', width: '6em'}}>配送日期</label>
                            <BtnGroup btnNames={date} bindData={dateData} clickCallback={this.toggleDate.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentDate}/>
                            <label style={{display: 'inline-block', width: '4em', marginLeft: '50px'}}>日期</label>
                            <DatePicker start={this.state.start} end={this.state.end} prefix="waybill_date_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)}/>

                        </div>
                    </form>
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>运单状态</label>
                            <BtnGroup btnNames={billStatus} bindData={billStatusData} clickCallback={this.toggleBillStatus.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentBillStatus}/>
                        </div>
                    </form>

                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>区县</label>
                            <BtnGroup btnNames={area} bindData={areaData} clickCallback={this.toggleArea.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentArea}/>
                        </div>
                    </form>
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>代收货款</label>
                            <BtnGroup btnNames={replace} bindData={replaceData} clickCallback={this.toggleReplace.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentReplace}/>
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
        if($('#component_search_input').val()==''){
            this.setState({
                search: '',
                searchType: []
            });
        }
        this.setState({
            page: 1
        }, this.getData);
    }

    // 创建搜索框
    createSearchBar() {
        return (
            <div className="search-bar">
                <Search dropdownMenus={['全部', '运单号', '提货人手机号', '提货码', '提货人', '发货人']} emit={this.search.bind(this)}
                        onChange={this.changeSelect.bind(this)}/>
            </div>
        );
    }

    // 改变搜索下拉框的选项
    changeSelect(val) {
        let searchType = [],
            search = ['all', 'no', 'mobile', 'code', 'custom', 'shop'];

        if(search[val]=='all'){
            searchType = ['no', 'mobile', 'code', 'custom', 'shop'];
        }else {
            searchType.push(search[val]);
        }

        this.setState({
            searchType: searchType
        });
    }

    // 搜索按钮
    search() {
        let searchContent = $('#component_search_input').val();

        this.setState({
            search: searchContent,
            page: 1
        }, this.getData);

    }

    // 切换预设日期的选择
    toggleDate(e) {
        let index = e.target.dataset.index,
            date = null;

        if(index === this.state.currentDate){
            return;
        }

        switch (e.target.innerHTML) {
            case '今天':
                date = H.getSouroundDate(0);
                $('#waybill_date_startTime').val(date);
                $('#waybill_date_endTime').val(date);
                break;
            case '明天':
                date = H.getSouroundDate(-1);
                $('#waybill_date_startTime').val(date);
                $('#waybill_date_endTime').val(date);
                break;
        }

        this.setState({
            page: 1,
            currentDate: index,
            start:date,
            end:date
        });
    }

    // 切换日期范围
    dateRange() {
        let startDate = $('#waybill_date_startTime').val(),
            endDate = $('#waybill_date_endTime').val();

        this.setState({
            currentDate: 3,
            start: startDate,
            end: endDate
        });
    }

    // 切换代收货款的选项
    toggleReplace(e) {
        let index = e.target.dataset.index,
            amount = null;

        //如果点击的区域index和当前区域index相当，则跳出方法
        if(index === this.state.currentReplace) {
            return;
        }

        if(index == 1){
            amount = Boolean(false);
        } else if (index == 2){
            amount = Boolean(true);
        } else {
            amount = '';
        }

        this.setState({
            page: 1,
            currentReplace: index,
            amount: amount
        });
    }

    // 切换所选区县
    toggleArea(e) {
        let index = e.target.dataset.index,
            adcode = this.state.adcode;

        if(this.state.areaList[index-1]){
            adcode = this.state.areaList[index-1].id;
        }else {
            adcode = '';
        }

        if(index == this.state.currentArea) {
            return;
        }

        this.setState({
            page: 1,
            currentArea: index,
            adcode: adcode
        });
    }

    // 切换运单状态
    toggleBillStatus(e) {
        let index = e.target.dataset.index,
            status = [];

        if(index === this.state.currentBillStatus) {
            return;
        }

        if(index == '-1'){
            status = [];
        } else {
            status.push(index);
        }

        this.setState({
            page: 1,
            currentBillStatus: index,
            status: status
        });
    }

    // 创建表格
    createTable() {
        let headlines = ['运单号', '提货码', '提货人', 'KNO', '件数', '发货方', '状态', '来源', '配送日期', '代收货款', '操作'],
            order = ['day_no', 'lading_code', 'fetch', 'kno', 'volume', 'sender', 'status', 'source', 'day', 'amount', 'operate'],
            status = {
                6: {
                    0: '待揽货',
                    10: '待装车',
                    20: '已装车',
                    30: '配送中',
                    40: '已送达',
                    41: '已拒单',
                    '-10': '已取消',
                    '-11': '已取消（发货人）',
                    '-12': '已取消（后台）',
                    '-13': '已取消（司机发货）'
                }
            },
            statusOperate = {},
            fn= {
                1: this.srOnlyLadingNumber,
                5: this.srOnlySender,
                10: this.operate
            };

        let waybillList = this.state.waybillList;
        waybillList.map((waybill, index) => {
            waybill.operate = index;
            waybill.fetch = waybill.custom.name+' ['+waybill.custom.mobile+']';
            waybill.lading_code = H.getLadingCode(waybill.code, [2, 3, 4]);
            waybill.sender = waybill.shop.name;

            if(waybill.status == '-10' || waybill.status == '-11' || waybill.status == '-12' || waybill.status == '-13'){
                waybill.operate = '';
            } else {
                statusOperate[index] = ['作废', '明细', '打印'];
            }

            if(!waybill.kno){
                waybill.kno = '-';
            }
        });

        return (
            <Table values={this.state.waybillList} headlines={headlines} order={order} bodyOperate={fn} id={'waybillInfo'}
                   statusOperate={statusOperate} status={status} cellStyle={{0:{condition:['location_confirmed', false], style: {color: 'red'}}}} />
        );
    }

    // 表格的相关操作
    operate(e) {
        let oper = $(e.target).html(),
            id = e.target.dataset.reactid.split('$')[2].split('.')[0],
            waybillId = this.state.waybillList[id].id,
            waybill = this.state.waybillList[id];

        switch (oper){
            case '作废':
                H.Modal({
                    content:'确认作废该条运单？',
                    okText:'确认作废',
                    cancel:true,
                    okCallback: () => {
                        H.server.cancel_waybill({
                            id: waybillId
                        }, (res) => {
                            if(res.code == 0){
                                H.Modal('运单已作废！');
                                this.getData();
                            } else if(res.code == 10106) {
                                H.overdue();
                            } else {
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '明细':
                this.setState({
                    panel:<WaybillDetail closePanel={this.closePanel} waybillId={waybillId}/>
                });
                break;
            case '打印':
                this.print(waybill);
                break;
        }
    }

    print(waybill){
        let kno = waybill.kno,
            name = waybill.custom.name;

        setTimeout(this.changePrinter, 100);

        H.Modal({
            title:'选择打印类型',
            content:'<div class="waybill-print">' +
            '<p>即将打印：'+kno+'-'+name+'</p>' +
            '<select class="form-control" id="choice">' +
            '<option value="0">打印标签（多张）</option>' +
            '<option value="1">打印标签（单张）</option>' +
            '<option value="2">打印运单</option>' +
            '</select>' +
            '<p class="text-warning" id="notice"></p>' +
            '<p class="text-success" id="printerInfo"></p>'+
            '</div>',
            okText:'开始打印',
            cancel:true,
            okCallback: ()=>{
                let index = $('#choice').val(),
                    printer = '';

                if(index==0){
                    // 多张打印，这个人有几件货，就打印几个单子
                    if(localStorage.getItem('print')){
                        printer = JSON.parse(localStorage.getItem('print')).labelPrinter;
                    }

                    this.createWaybillLabelModal(waybill, 0);

                    let LODOP = getLodop();
                    LODOP.SET_PRINT_PAGESIZE(0, 600, 400, 'label'); // 设置打印单据纸张大小
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'label'); // 设置自定义的纸张名字

                    LODOP.PRINT();

                } else if(index == 1) {
                    // 单张打印，不论此人有多少件货，都只打印一张
                    if(localStorage.getItem('print')){
                        printer = JSON.parse(localStorage.getItem('print')).labelPrinter;
                    }

                    this.createWaybillLabelModal(waybill, 1);

                    let LODOP = getLodop();
                    LODOP.SET_PRINT_PAGESIZE(0, 600, 400, 'label'); // 设置打印单据纸张大小
                    LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                    LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'label'); // 设置自定义的纸张名字

                    LODOP.PRINT();
                } else if(index == 2){
                    // 打印配送单
                    if(localStorage.getItem('print')){
                        printer = JSON.parse(localStorage.getItem('print')).waybillPrinter;
                    }

                    H.server.get_current_waybill({id: waybill.id}, (res)=>{
                        if(res.code == 0){
                            this.createWaybillModal(res.data);

                            let LODOP = getLodop();
                            LODOP.SET_PRINT_PAGESIZE(0, 2200, 1405, 'bills'); // 设置打印单据纸张大小
                            LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                            LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'bills'); // 设置自定义的纸张名字

                            LODOP.PRINT();
                        } else if(res.code == 10106) {
                            H.overdue();
                        } else {
                            H.Modal(res.message);
                        }
                    });
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
                $('#printerInfo').html('当前打印机：'+JSON.parse(printList).labelPrinter);
            } else if( index==1){
                $('#printerInfo').html('当前打印机：'+JSON.parse(printList).labelPrinter);
            } else if(index ==2 ){
                $('#printerInfo').html('当前打印机：'+JSON.parse(printList).waybillPrinter);
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

    // 创建运单标签模板
    createWaybillLabelModal(modal, type){
        let length = type==0?modal.volume:1,
            date = H.getSouroundDate(0);

        LODOP = getLodop();

        for(let i=0; i<length; i++){
            LODOP.NewPage();
            LODOP.ADD_PRINT_TEXT(20, 10, 350, 60, modal.kno+'-'+modal.custom.name);
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(80, 10, 100, 20, '合计'+modal.volume+'件');
            LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
            LODOP.ADD_PRINT_TEXT(120, 100, 100, 20, date);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
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

    // 只看提货码
    srOnlyLadingNumber(e) {
        let searchType = ['code'],
            search = $(e.target).html();

        this.setState({
            searchType: searchType,
            search: search
        }, this.getData);
    }

    // 只看发货方
    srOnlySender(e) {

        let searchType = ['shop'],
            search = $(e.target).html();

        this.setState({
            searchType: searchType,
            page: 1,
            search: search
        }, this.getData);
    }

    // 设置分页页码
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getData);
    }

    // 关闭panel
    closePanel() {
        this.setState({
            panel: ''
        });
    }

    // 调度分配
    dispatching() {
        this.setState({
            panel:<Dispatching closePanel={this.closePanel}/>
        });
    }

    // 录单
    addFreight() {
        this.setState({
            panel:<AddWaybill closePanel={this.closePanel}/>
        });
    }

    // 刷新
    refresh(){
        this.setState({
            search:'',
            searchType:[],
            start:H.getSouroundDate(0),
            end:H.getSouroundDate(0),
            status:[],
            amount:'',
            currentDate:0,          // 当前选中的预设日期
            currentBillStatus:'-1', // 当前选中的运单状态
            currentArea:0,          // 当前选中的区域
            currentReplace:0,       // 当前代收货款状态
            page:1                             // 当前页数
        }, this.getData);
    }

    //导入运单;
    importWaybill() {
        $('#importWaybill')[0].click();
    }

    urlEncode(param, key, encode) {
        if(param==null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };

    //导出运单;
    exportWaybill() {
            let data = this.state;
        let waybillData = {};
        waybillData.search = data.search;
        waybillData.search_type = data.searchType;
        waybillData.start = data.start;
        waybillData.end = data.end;
        waybillData.status = data.status;
        waybillData.adcode = data.adcode;
        waybillData.amount = data.amount;
        window.open('/logistics/delivery/export?'+this.urlEncode(waybillData));
    }

    importWaybillChange() {
        $.ajax({
            url: '/logistics/delivery/import',
            type: 'POST',
            data: new FormData($('#importWaySubmit')[0]),
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: (res) => {
                $('#importWaybill').val('');
                window.open(res);
                this.refresh();
            },
            error: () => {
                $('#importWaybill').val('');
            }
        });
    }

    render() {
        return (
            <div className="section-warp container-fluid">
                <div className="section-table row">
                    <div className="section-filter">
                        {this.createSelectArea()}
                        <div className="filter-row pull-right">
                            <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.exportWaybill.bind(this)}>导出</a>
                            <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.importWaybill.bind(this)}>导入</a>
                            <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.addFreight.bind(this)}>录单</a>
                            <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.dispatching.bind(this)}>调度分配</a>
                            <form id="importWaySubmit" style={{width: '0', height: '0', overflow: 'hidden'}}>
                                <input id="importWaybill" onChange={this.importWaybillChange.bind(this)} name="file" type="file" />
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="row">
                            <div className="row">
                                <p className="col-lg-6 pull-left">当前结果：{this.state.total}个运单，共{this.state.customTotal}个提货人，共{this.state.shopTotal}个发货人</p>
                                <a href="javascript:;" className="col-lg-6 text-right" onClick={this.refresh.bind(this)}>刷新</a>
                            </div>
                            {this.createTable()}
                            <Paging key={this.state.count} maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                        </div>
                    </div>
                </div>
                {this.state.panel}
            </div>
        );
    }
}

export default WaybillInfo;