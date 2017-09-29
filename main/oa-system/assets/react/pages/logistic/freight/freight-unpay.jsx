/**
 * 运费管理：未付款
 * @author 魏华东
 * @date 2017.1.9
 */

import React from 'react';
import Paging from '../../../../components/page/paging.js';

class FreightUnPay extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            unPayList:[],               // 未付款的运费列表
            senderTotal:0,              // 发货人总数
            waybillTotal:0,             // 运单总数
            page:1,
            lastPage:1,
            size:10
        };
        this.getUnPayData = this.getUnPayData.bind(this);
    }

    componentWillMount() {
        if($('#printScript').length<=0){
            let printScript = '<script id="printScript" type="text/javascript" src="/js/LodopFuncs.js">';
            $('body').append(printScript);
        }
        this.getUnPayData();
    }

    // 获取未付款信息
    getUnPayData() {
        H.server.get_unpaid_waybill({page: this.state.page, size:this.state.size}, (res)=>{
            if(res.code == 0) {

               this.setState({
                   unPayList: res.data.shops,
                   page: res.data.page,
                   lastPage: res.data.last_page,
                   senderTotal:res.data.total,
                   waybillTotal:res.data.delivery_num
               });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建表格
    createTable() {
        let table,
            headlines = ['运单号', '货物量/件', '金额/元', '运单日', '操作'],
            heads = [],
            senderList = [],
            bodyList = [],
            tbody = null;

        headlines.map((head, index)=>{
            heads.push(<th key={'head_'+index} data-index={index}>{head}</th>);
        });

        this.state.unPayList.map((unPay, index)=>{
            let billList = [];
            let sender = (
                <tr key={index} className="active" data-index={index}>
                    <td colSpan="5" className="form-group">
                        <div className="col-lg-10">发货方：{unPay.name} [{unPay.mobile}]</div>
                        <div className="col-lg-2">
                            合计：15元
                            <span style={{marginLeft: '15px', color: 'red'}}>未收款</span>
                        </div>
                    </td>
                </tr>
            );
            unPay.deliveries.map((delivery, i)=>{
                billList.push(
                    <tr key={'delivery_'+i} data-index={i}>
                        <td>{delivery.day_no}</td>
                        <td>{delivery.volume}</td>
                        <td>金额/元</td>
                        <td>{delivery.day}</td>
                        {
                            i == 0 ? (
                                <td className="text-center col-lg-2" rowSpan={unPay.deliveries.length}>
                                    <div className="form-group"><btn className="btn btn-sm">推送账单</btn></div>
                                    <div className="form-group"><btn className="btn btn-sm">人工收款</btn></div>
                                    <div className="form-group"><btn className="btn btn-sm">修改账单</btn></div>
                                </td>
                            ) : null
                        }
                    </tr>
                );
            });
            senderList.push({sender: sender, billList: billList});
        });

        senderList.map((sender)=>{
            bodyList.push([sender.sender, sender.billList]);
        });

        tbody = (
            <tbody id="unPay_table">
                {bodyList}
            </tbody>);

        table = (
            <table className="table table-bordered table-hover table-responsive">
                <thead><tr>{heads}</tr></thead>
                {tbody}
            </table>
        );

        return table;
    }

    // 表格操作
    operate(e) {
        let html = $(e.target).html(),
            unPay = this.state.unPayList[e.target.parentNode.parentNode.parentNode.dataset.index];

        switch (html){
            case '人工收款':
                let mobile = unPay.mobile;
                // 获取选择了哪些条目
                let checked = $('#unPay_table input[name=delivery_'+mobile+']:checked'),
                    delivery = [],
                    deliveryInfo = [],
                    printInfo = {},
                    volume = 0;
                for(let i=0; i<checked.length;i++){
                    delivery.push(unPay.deliveries[parseInt(checked.parent().parent().parent()[i].dataset.index)].id);
                    deliveryInfo.push(unPay.deliveries[parseInt(checked.parent().parent().parent()[i].dataset.index)]);
                }

                if(delivery.length<=0){
                    H.Modal('请先选中要收款的运单。');
                    return;
                }

                printInfo.deliveries = deliveryInfo;
                printInfo.name = unPay.name;
                printInfo.mobile = unPay.mobile;

                printInfo.deliveries.map((del)=>{
                    volume += del.volume;
                });

                H.Modal({
                    title: '请确认实收费用',
                    width: 400,
                    content:'<div class="row">' +
                    '<div class="row col-lg-12 form-control-static">' +
                    '<div class="col-lg-4">运单数：</div><div class="col-lg-7">'+printInfo.deliveries.length+'单</div></div>' +
                    '<div class="row col-lg-12 form-control-static">' +
                    '<div class="col-lg-4">总数量：</div><div class="col-lg-7">'+volume+'（件/袋/箱）</div></div>' +
                    '<div class="row col-lg-12 form-control-static">' +
                    '<div class="col-lg-4 form-control-static">实收金额：</div><div class="col-lg-6">' +
                    '<input id="chargeValue" type="number" step="0.01" class="form-control" min="0"></div><p class="col-lg-1 form-control-static">元</p></div>' +
                    '<p class="row col-lg-12 text-warning text-center" style="margin-top: 30px">保存后不允许修改。</p>' +
                    '</div>',
                    cancel: true,
                    okText: '保存',
                    okCallback:()=>{
                        printInfo.charge = $('#chargeValue').val();
                        H.server.create_charge({
                            delivery_ids: delivery,
                            charge: printInfo.charge
                        }, (res)=>{
                            if(res.code == 0) {
                                let printer = '';
                                if(localStorage.getItem('print')){
                                    printer = JSON.parse(localStorage.getItem('print')).billPrinter;
                                }

                                H.Modal({
                                    title: '请确认实收费用',
                                    content: '<p>确认打印收据？</p><p id="notice" class="text-warning"></p><p id="print" class="text-success"></p>',
                                    okText:'开始打印',
                                    cancelText:'不打印了',
                                    okCallback:()=>{
                                        let LODOP = getLodop();

                                        this.createPrintModal(printInfo);
                                        LODOP.SET_PRINT_PAGESIZE(0, 570, 1350, 'note'); // 设置打印单据纸张大小
                                        LODOP.SET_PRINTER_INDEX(this.confirmPrinter(printer)); // 设置选择的打印机
                                        LODOP.SET_PRINT_MODE('CREATE_CUSTOM_PAGE_NAME', 'note'); // 设置自定义的纸张名字

                                        LODOP.PRINT();
                                        this.getUnPayData();
                                    },
                                    cancel:true,
                                    cancelCallback:()=>{
                                        this.getUnPayData();
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
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '推送账单':
                let senderId = e.target.parentNode.dataset.reactid.split('.')[16].split(':')[0],
                    ids = this.state.unPayList[senderId].deliveries[e.target.parentNode.parentNode.dataset.index].id,
                    deliveryIDs = [ids];

                console.log(ids);

                H.Modal({
                    content:'确认对该条运单免单？',
                    okText:'确认免单',
                    cancel:true,
                    okCallback: () => {
                        H.server.unpay_waybill({delivery_ids: deliveryIDs}, (res) => {
                            if(res.code == 0){
                                H.Modal('运单已免单！');
                                this.getUnPayData();
                            } else if(res.code == 10106) {
                                H.overdue();
                            } else {
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '修改账单':
                break;
        }
    }

    // 全选
    choice(e) {
        let mobile = e.target.id.split('_')[1];

        if(e.target.checked == true){
            $('#unPay_table input[name="delivery_'+mobile+'"]').prop('checked', 'true');
        }else {
            $('#unPay_table input[name="delivery_'+mobile+'"]').removeAttr('checked');
        }
    }

    // 创建打印模块
    createPrintModal(bill){
        let date = new Date(),
            now = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

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
        LODOP.ADD_PRINT_TEXT(71, 4, 100, 20, '收款号:');
        LODOP.ADD_PRINT_TEXT(87, 4, 201, 20, '付款人:'+bill.name);
        LODOP.ADD_PRINT_TEXT(103, 4, 201, 20, '电话:'+'['+bill.mobile+']');
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
        LODOP.ADD_PRINT_TEXT(iCurLine+15, 5, 100, 20, '合计数量：'+bill.deliveries.length);
        LODOP.ADD_PRINT_TEXT(iCurLine+30, 5, 121, 20, '实收金额：'+bill.charge+'元');
        LODOP.ADD_PRINT_TEXT(iCurLine+45, 5, 198, 20, '收款日期：'+now);
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

    // 设置分页页码
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getUnPayData);
    }

    render(){
        return(
            <div className="section-warp">
                <div className="section-table">
                    <div className="col-lg-12" style={{marginTop:'15px'}}>
                        <div className="row">
                            <p className="col-lg-9 pull-left">当前结果：{this.state.senderTotal}个发货人，共{this.state.waybillTotal}个运单</p>
                            <div className="col-lg-2 text-right"><btn className="btn btn-lg default">一键推送账单</btn></div>
                            <a href="javascript:;" className="col-lg-1 text-right" onClick={this.getUnPayData.bind(this)}>刷新</a>
                        </div>

                        {this.createTable()}
                        <Paging maxPage={this.state.lastPage} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default FreightUnPay;