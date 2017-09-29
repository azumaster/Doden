/**
 * 运费管理-已付费
 */

import React from 'react';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import DatePicker from '../../../../components/datePicker/index.jsx';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';

class FreightPay extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            payList:[],                     // 已付费的数组
            currentUser:null,               // 当前用户
            currentDate:0,                  // 当前日期状态
            start:'',                       // 开始日期
            end:'',                         // 结束日期
            senderTotal:0,                  // 发货人总数
            waybillTotal:0,                 // 运单总数
            volumeTotal:0,                  // 货物总数
            chargeTotal:0,                  // 收款总数
            page:1,
            lastPage:1,
            size:30
        };
        this.getPayData = this.getPayData.bind(this);
        this.operate = this.operate.bind(this);
        this.showWaybill = this.showWaybill.bind(this);
        this.createSelectArea = this.createSelectArea.bind(this);
    }

    componentWillMount() {
        // 获取本周的起止日期
        let dayInWeek = new Date().getDay(),
            start = H.getSouroundDate(dayInWeek),
            end = H.getSouroundDate(dayInWeek-6);

        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }

        this.setState({
            start: start,
            end: end
        }, this.getPayData);
    }

    // 获取已付款数据
    getPayData() {
        H.server.get_paid_waybill({
            status:1,
            start:this.state.start,
            end:this.state.end,
            page:this.state.page,
            size:this.state.size
        }, (res)=>{
            if(res.code == 0) {
                this.setState({
                    payList: res.data.charges,
                    senderTotal:res.data.shop_num,
                    waybillTotal:res.data.delivery_num,
                    volumeTotal:res.data.volume_num,
                    chargeTotal:res.data.amount,
                    page:res.data.current,
                    lastPage:res.data.last_page
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
        let date = ['本周', '上周', '本月', '上月'],
            dateData = [0, 1, 2, 3];
        return (
            <div className="section-filter" style={{paddingTop: 0}}>
                <div className="row">
                    <form className="form-inline col-lg-12">
                        <div className="filter-row">
                            <label style={{display: 'inline-block', width: '6em'}}>配送日期</label>
                            <BtnGroup btnNames={date} bindData={dateData} clickCallback={this.toggleDate.bind(this)}
                                      style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentDate}/>
                            <label style={{display: 'inline-block', width: '4em', marginLeft: '50px'}}>日期</label>
                            <DatePicker start={this.state.start} end={this.state.end} prefix="pay_date_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)}/>
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

    // 切换预设日期
    toggleDate(e) {
        let index = e.target.dataset.index,
            start = this.state.start,
            end = this.state.end,
            dayInWeek = new Date().getDay();

        if(index === this.state.currentDate){
            return;
        }

        if(index == 0){
            // 获取本周起止时间
            start = H.getSouroundDate(dayInWeek);
            end = H.getSouroundDate(dayInWeek-6);
        }else if(index == 1){
            // 获取上周起止时间
            start = H.getSouroundDate(dayInWeek+7);
            end = H.getSouroundDate(dayInWeek-6+7);
        }else if(index == 2){
            // 获取本月起止时间
            start = this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
            end = this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), this.getMonthDays(new Date().getMonth())));
        }else if(index == 3){
            // 获取上月起止时间
            let lastMonth = new Date();
            lastMonth.setDate(1);
            lastMonth.setMonth(lastMonth.getMonth()-1);
            start = this.formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1));
            end = this.formatDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), this.getMonthDays(lastMonth.getMonth())));
        }

        $('#pay_date_startTime').val(start);
        $('#pay_date_endTime').val(end);

        this.setState({
            currentDate:index,
            start:start,
            end:end
        });
    }

    // 获取范围时间
    dateRange() {
        let startDate = $('#pay_date_startTime').val(),
            endDate = $('#pay_date_endTime').val();

        this.setState({
            currentDate: 4,
            start: startDate,
            end: endDate
        });
    }

    // 获取某个月的天数
    getMonthDays(month){
        let start = new Date(new Date().getFullYear(), month, 1),
            end = new Date(new Date().getFullYear(), month+1, 1);

        return ((end-start)/(1000*60*60*24));
    }

    // 格式化时间
    formatDate(date){
        let year = date.getFullYear(),
            month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1),
            day = date.getDate()<10?'0'+date.getDate():date.getDate();

        return (year+'-'+month+'-'+day);
    }

    // 开始筛选
    select(){
        this.setState({
            page: 1
        }, this.getPayData);
    }

    // 创建表格
    createTable() {
        let headlines = ['收款号', '发货方', '运单量', '货物量', '收款时间', '金额/元', '操作'],
            order = ['id', 'sender', 'num', 'volume', 'created_at', 'amount', 'operate'],
            statusOperate = {},
            fn= {
                2: this.showWaybill,
                6: this.operate
            };

            this.state.payList.map((pay, index) => {
                pay.operate = index;
                pay.sender = pay.shop.name+' ['+pay.shop.mobile+']';
                this.state.payList.map((pay, index) => {
                    pay.operate = index;
                    pay.sender = pay.shop.name+' ['+pay.shop.mobile+']';
                    pay.num = pay.delivery_num + '单';
                    statusOperate[index] = ['打印单据', '撤销'];
                });
                statusOperate[index] = ['打印单据', '撤销'];
            });
            return (
                <Table values={this.state.payList} headlines={headlines} order={order} bodyOperate={fn} id={'payInfo'}
                       statusOperate={statusOperate} />
            );

    }

    // 表格操作
    operate(e){
        let html = $(e.target).html(),
            index = e.target.parentNode.dataset.index;

        switch (html){
            case '打印单据':
                let printer = '';
                if(localStorage.getItem('print')){
                    printer = JSON.parse(localStorage.getItem('print')).billPrinter;
                }

                H.Modal({
                    title: '打印收据',
                    content: '<p>确认打印收据？</p><p id="notice" class="text-warning"></p><p id="print" class="text-success"></p>',
                    cancel:true,
                    cancelText:'不打印了',
                    okText:'开始打印',
                    okCallback: ()=>{

                        let LODOP = getLodop();

                        this.createPrintModal(this.state.payList[index]);
                        LODOP.SET_PRINT_PAGESIZE(0, 570, 1100, 'note'); // 设置打印单据纸张大小
                        LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                        LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'note'); // 设置自定义的纸张名字

                        LODOP.PRINT();
                    }
                });

                setTimeout(()=>{
                    $('#notice').html('请先在打印机配置页面配置打印机');
                    $('#print').html('');
                    $('#modal-ok').attr('disabled', 'true');

                    if(localStorage.getItem('print')){
                        $('#print').html('当前打印机：'+printer);
                        $('#notice').html('');
                        $('#modal-ok').removeAttr('disabled');
                    }
                }, 100);

                break;
            case '撤销':
                new Promise((resolve)=>{
                    H.server.user_info({}, (res)=>{
                        if(res.code == 0) {
                            this.setState({
                                currentUser:res.data.user_infos
                            }, ()=>{resolve(res);});
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else{
                            H.Modal(res.message);
                        }
                    });
                }).then(()=>{
                    let interval;
                    H.Modal({
                        title: '撤销收款',
                        width: 500,
                        content:'<div class="row">' +
                        '<div class="row col-lg-12">' +
                        '<div class="col-lg-8">操作员：'+this.state.currentUser.name+'['+this.state.currentUser.login_name+']</div>' +
                        '<a href="javascript:;" class="col-lg-4 text-right btn btn-lg pull-right" id="getCode">获取验证码</a></div>' +
                        '<div class="col-lg-12" style="margin-top: 20px"><input id="code" type="text" class="form-control" placeholder="填写验证码"></div>' +
                        '<div class="col-lg-12" style="margin: 20px 0 20px 0"><textarea id="reason" class="form-control" placeholder="撤销原因" style="resize: none"></textarea></div></div>',
                        okText: '确认撤销',
                        cancel: 'true',
                        okCallback: ()=>{
                            $('#getCode').html('获取验证码').removeAttr('disabled');
                            clearInterval(interval);
                            H.server.cancel_charge({
                                id:this.state.payList[index].id,
                                verify: $('#code').val(),
                                reason: $('#reason').val()
                            }, (res)=>{
                                if(res.code == 0) {
                                    H.Modal('撤销成功!');
                                    this.getPayData();
                                }else if(res.code == 10106) {
                                    H.overdue();
                                }else{
                                    H.Modal(res.message);
                                }
                            });
                        },
                        cancelCallback: ()=>{
                            $('#getCode').html('获取验证码').removeAttr('disabled');
                            clearInterval(interval);
                        }
                    });

                    $('#getCode').click(()=>{
                        console.log('aaa');
                        let mobile = this.state.currentUser.login_name,
                            seconds = 60;

                        // 发送验证码
                        $('#mobile').parent().removeClass('has-error');
                        H.server.send_code({mobile: mobile}, (res)=>{
                            if(res.code == 0) {
                                interval = setInterval(()=>{
                                    $('#getCode').html(seconds+'秒后重新发送').attr('disabled', 'true');
                                    seconds --;
                                    if(seconds==0){
                                        $('#getCode').html('获取验证码').removeAttr('disabled');
                                        clearInterval(interval);
                                    }
                                }, 1000);
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });

                    });
                });
                break;
        }
    }

    // 创建打印模块
    createPrintModal(bill){
        LODOP = getLodop();

        console.log(bill);

        LODOP.PRINT_INITA(0, 0, 214, 600, '');
        LODOP.ADD_PRINT_TEXT(17, 39, 100, 35, '冰河物流');
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 15);
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
        LODOP.ADD_PRINT_TEXT(39, 39, 100, 25, '收据');
        LODOP.SET_PRINT_STYLEA(0, 'FontName', '微软雅黑 Light');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2);
        LODOP.ADD_PRINT_TEXT(71, 4, 100, 20, '收款号:'+bill.id);
        LODOP.ADD_PRINT_TEXT(87, 4, 201, 20, '付款人:'+bill.shop.name);
        LODOP.ADD_PRINT_TEXT(103, 4, 201, 20, '电话:'+'['+bill.shop.mobile+']');
        LODOP.ADD_PRINT_TEXT(135, 4, 100, 20, '运单:');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 10);
        LODOP.ADD_PRINT_LINE(125, 2, 126, 182, 4, 1);

        let iCurLine=158;//标题行之后的数据从位置142px开始打印
        bill.deliveries.map((delivery)=>{
            LODOP.ADD_PRINT_TEXT(iCurLine, 12, 100, 20, delivery.day_no);
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            LODOP.ADD_PRINT_TEXT(iCurLine, 145, 50, 20, delivery.volume+'件');
            LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
            iCurLine += 20;
        });

        LODOP.ADD_PRINT_LINE(iCurLine+5, 4, iCurLine+5, 184, 4, 0);
        LODOP.ADD_PRINT_TEXT(iCurLine+15, 5, 100, 20, '合计数量：'+bill.volume);
        LODOP.ADD_PRINT_TEXT(iCurLine+30, 5, 121, 20, '实收金额：'+bill.amount+'元');
        LODOP.ADD_PRINT_TEXT(iCurLine+45, 5, 198, 20, '收款日期：'+bill.created_at);
        LODOP.ADD_PRINT_TEXT(iCurLine+60, 5, 143, 20, '服务电话：028-85171136');
        LODOP.ADD_PRINT_TEXT(iCurLine+75, 5, 195, 20, '服务地址：成都市海霸王C3库外');
        LODOP.ADD_PRINT_IMAGE(iCurLine+130, 61, 75, 72, '<img src="http://'+location.host+'/images/ddayu.png" />');
        LODOP.SET_PRINT_STYLEA(0, 'Stretch', 2);
        LODOP.ADD_PRINT_TEXT(iCurLine+90, 5, 195, 38, '请妥善保管小票。如需办理退款、退货，请出示小票。');
        LODOP.SET_PRINT_STYLEA(0, 'FontSize', 8);
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

    // 查看运单详情
    showWaybill(e) {
        let index = e.target.dataset.index,
            deliveryList = this.state.payList[index].deliveries;

        let list = '';
        deliveryList.map((delivery)=>{
            list += '<div class="row col-lg-12 form-control-static"><div class="col-lg-8">'+delivery.day_no+'</div><div class="col-lg-4">'+delivery.volume+'件</div></div>';
        });

        H.Modal({
            title: '运单详情',
            content:list,
            okText: '我知道了'
        });
    }

    // 设置分页页码
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getPayData);
    }

    refresh() {
        let dayInWeek = new Date().getDay(),
            start = H.getSouroundDate(dayInWeek),
            end = H.getSouroundDate(dayInWeek-6);
        this.setState({
            currentDate:0,
            start:start,
            end:end,
            page:1
        }, this.getPayData);
    }

    render(){
        let url = '/logistics/charge/paid/export?start='+this.state.start+'&end='+this.state.end;

        return(
            <div className="section-warp">
                <div className="section-table">
                    {this.createSelectArea()}
                    <div className="col-lg-12" style={{marginTop:'30px'}}>
                        <div className="row col-lg-12">
                            <p className="col-lg-6 pull-left">当前结果：{this.state.senderTotal}个发货人，共{this.state.waybillTotal}个运单，共{this.state.volumeTotal}件，合计收款{this.state.chargeTotal}元</p>
                            <a href={url} className="btn btn-lg btn-default pull-right" target="_black">导出</a>
                            <a href="javascript:;" className="col-lg-4 text-right pull-right" onClick={this.refresh.bind(this)}>刷新</a>
                        </div>
                        <div className="row col-lg-12" style={{marginTop:'30px'}}>
                            {this.createTable()}
                        </div>
                        <Paging maxPage={this.state.lastPage} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FreightPay;