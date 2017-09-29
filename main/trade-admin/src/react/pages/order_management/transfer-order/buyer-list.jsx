import React from 'react';
import Refresh from '../../../../components/refresh/refresh.js';
import PageCtrlBar from '../../../../components/page/paging.js';
import SearchKey from '../../../../components/search/search.js';
import DatePicker from '../../../../components/datePicker/index.jsx';
import Modal from '../../../../components/modal/modal.js';
import DeliveryDate from './delivery-date.jsx';
import CancelGoods from './cancel-goods.jsx';
import GoodsPrepare from './goods-prepare.jsx';
import DataLoading from '../../../../components/data_loading/loading.jsx';

class BuyerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: {  //搜索参数;
                buyer_shop_name: '',
                logistic_num: '',
                specified_date: H.GetDateStr().time1,
                date_begin: '',
                date_end: '',
                prepare_status: '',
                pay_method: '',
                delivery_status: '',
                page: 1,
                size: 10
            },
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            },
            totalPage: 1,   //总页数;
            data: null,
            orderIdArr: [], // 批量操作的ID;
            modalState: 0,  //交互弹窗 0表示没有，1改期，2取消商品，3是改备货状态和填成本价, 4导出和打印;
            thisOrderData: null,   //当前操作的订单数据;比如操作改期、取消;
            loading: false
        };
        this.getDataList = this.getDataList.bind(this);
        this.createTable = this.createTable.bind(this);
        this.isHavePrivilege = this.isHavePrivilege.bind(this);
        this.changePage = this.changePage.bind(this);
        this.searchKey = this.searchKey.bind(this);
        this.refresh = this.refresh.bind(this);
        this.selectTimeHandler = this.selectTimeHandler.bind(this);
        this.getOrderId = this.getOrderId.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createCount = this.createCount.bind(this);
    }

    componentWillMount() {
        this.getDataList();
    }

    getDataList() {
        let param = this.state.param;
        this.setState({loading: true});
        H.server.order_buyers_list(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    data: res.data,
                    totalPage: Math.ceil(res.data.total/param.size)
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            this.setState({loading: false});
        });
    }

    //判断是否有这个权限;
    isHavePrivilege(str) {
        let privilege = this.props.privilege;
        for (let i in privilege) {
            if(privilege[i].name == str) {
                return true;
            }
        }
        return false;
    }

    //对当前页面的设置;
    changePage(n) {
        let param = this.state.param,
            newParam = Object.assign(param, n);
        this.setState({param: newParam}, () => {
            this.getDataList();
        });
    }

    //生成表数据;
    createTable() {
        if(!this.state.data) return '';
        let data = this.state.data.delivery_infos,
            xml = [];
        xml.push(<tr key="0" className="hr-tr"><td colSpan="7"></td></tr>);
        for(let i in data) {
            xml.push(
                <tr key={'hr_' + i}><td colSpan="7" className="col-row">
                    <div style={{float: 'left'}}>
                        {data[i].buyers.shop_name}&nbsp;&nbsp;&nbsp;&nbsp;
                        {data[i].buyers.contact_phone}&nbsp;&nbsp;&nbsp;&nbsp;
                        {data[i].buyers.shop_address}&nbsp;&nbsp;&nbsp;&nbsp;
                        发货号：{data[i].logistic_num}&nbsp;&nbsp;&nbsp;&nbsp;
                        发货时间：{data[i].delivery_date}
                    </div>
                    配送费：{data[i].freight}元&nbsp;&nbsp;
                    合计：{data[i].total_amount}元（<span style={data[i].pay_method == '货到付款' ? {color: 'red'} : {}}>{data[i].pay_method}</span>）
                    <div style={{float: 'right'}}>
                        {this.isHavePrivilege('打印') ? <a>打印</a> : ''}
                        {this.isHavePrivilege('发货') && data[i].delivery_status == 1 ?
                            <a onClick={this.batchDelivery.bind(this, data[i].logistic_id)}>发货</a> : ''}
                        {data[i].delivery_status == 2 ? <a className="disabled">已发货</a> : ''}
                        <input className="buyer-order-sel" type="checkbox" onChange={this.selChange.bind(this, data[i].logistic_id)} />
                    </div>
                </td></tr>
            );
            let orderData = data[i].orders;
            for(let k in orderData) {
                let goods = [], shop = [], operationDom = [],
                    goodsArr = orderData[k].goods_infos,
                    shopArr = orderData[k].sellers;
                for(let n in goodsArr) {
                    goods.push(
                        <span style={{display: 'inline-block', marginRight: '15px'}} key={'goods_' + k + '_' + n}>{goodsArr[n].goods_name} {goodsArr[n].buy_num}{goodsArr[n].goods_unit}*{goodsArr[n].goods_price}</span>
                    );
                }
                for(let m in shopArr) {
                    shop.push(<a style={{display: 'inline-block'}} key={'shop_' + k + '_' + m} onClick={this.getShopInfo.bind(this, shopArr[m].shop_id)}>{shopArr[m].shop_name}</a>);
                }

                switch (orderData[k].order_status) {
                    case 1:
                        if(this.isHavePrivilege('确认有效')) {
                            operationDom.push(<a key={'operationDom_' + k} onClick={this.orderConfirm.bind(this, orderData[k].sub_order_no)}>确认有效</a>);
                        }
                        break;
                    case 2:
                        if(this.isHavePrivilege('改期')) {
                            operationDom.push(<a key={'operationDom_' + k} onClick={this.deliveryDate.bind(this, orderData[k], data[i].buyers.shop_name, data[i].delivery_date)}>改期</a>);
                        }
                        if(this.isHavePrivilege('取消')) {
                            operationDom.push(<a key={'operationDom_1' + k} onClick={this.cancelGoods.bind(this, orderData[k], data[i].buyers.shop_name)}>取消</a>);
                        }
                        break;
                    case 3:
                        if(this.isHavePrivilege('确认收货')) {
                            operationDom.push(<a key={'operationDom_' + k} onClick={this.orderTake.bind(this, orderData[k].sub_order_no)}>确认收货</a>);
                        }
                        break;
                    case 4:
                        operationDom.push(<a key={'operationDom_' + k} className="disabled">已收货</a>);
                        break;
                }

                xml.push(
                    <tr key={'order_' + i + '_' + k}>
                        <td>{orderData[k].sub_order_no}</td>
                        <td>{orderData[k].create_time}</td>
                        <td className="buyer-list-goods">{goods}</td>
                        <td>{orderData[k].order_amount}</td>
                        <td>{shop}</td>
                        <td>{
                            orderData[k].goods_prepare_status == 1 ?
                                <a className="error-icon" onClick={this.goodsPrepare.bind(this, orderData[k])}>
                                </a> :
                                <a className="success-icon" onClick={this.goodsPrepareCancel.bind(this, orderData[k])}>
                                </a>
                        }</td>
                        <td>
                            {operationDom}
                        </td>
                    </tr>
                );
            }
        }
        return xml;
    }

    //获取原始卖家信息;
    getShopInfo(sellerId) {
        H.server.shop_seller_info({seller_shop_id: sellerId}, (res) => {
            if(res.code == 0) {
                H.Modal({
                    title: '原始卖家信息',
                    cancel: true,
                    cancelText: '关闭',
                    ok: false,
                    content: '<p>卖家：'+res.data.shop_name+'</p>'+
                    '<p>电话：'+res.data.order_phone+'【接单电话】</p>'+
                    '<p>市场：'+res.data.market_name+'</p>'+
                    '<p>地址：'+res.data.shop_address+'</p>'
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //搜索参数初始化;
    paramInit(d) {
        let dataStr = '';
        if(typeof d) {
            dataStr = H.GetDateStr(d).time1;
            $('#transfer_order_seller_startTime').val(dataStr);
            $('#transfer_order_seller_endTime').val(dataStr);
        }
        return {  //搜索参数;
            buyer_shop_name: '',
            logistic_num: '',
            specified_date: dataStr,
            date_begin: dataStr,
            date_end: dataStr,
            prepare_status: '',
            pay_method: '',
            delivery_status: '',
            page: 1,
            size: 10
        };
    }

    //刷新;
    refresh() {
        this.setParam();
        $('#buyer-key-search').val('');
    }

    //设置param;
    setParam(par) {
        let param = par || this.paramInit(0);
        param.page = 1;
        this.setState({
            param: param,
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            }
        }, () => {
            this.getDataList();
        });
    }

    //点击关键词的搜索;
    searchKey(keyFlag, keyword) {
        let param = this.paramInit();
        if(keyFlag == 0) {
            param.buyer_shop_name = keyword;
        }else if(keyFlag == 1) {
            param.logistic_num = keyword;
        }
        param.specified_date = '';
        param.date_begin = '';
        param.date_end = '';
        $('#transfer_order_buyer_startTime').val('');
        $('#transfer_order_buyer_endTime').val('');
        this.setParam(param);
    }

    //筛选选择时间;
    timeFilter(state) {
        $('.filter-time').removeClass('btn-default');
        $('#timeFilter_' + state).addClass('btn-default');
        let param = this.state.param;
        if(state == 1) {
            param.specified_date = H.GetDateStr().time1;
        }else if(state == 2) {
            param.specified_date = H.GetDateStr(1).time1;
        }else {
            param.specified_date = '';
        }
        $('#transfer_order_buyer_startTime').val(param.specified_date);
        $('#transfer_order_buyer_endTime').val(param.specified_date);
        this.setState({param: param});
    }

    //筛选选择是否备货;
    prepareFilter(state) {
        let param = this.state.param;
        param.prepare_status = state;
        this.setState({param: param});
    }

    //提交筛选;
    filterSub() {
        let param = this.state.param;
        param.date_begin = $('#transfer_order_buyer_startTime').val();
        param.date_end = $('#transfer_order_buyer_endTime').val();
        this.setParam(this.state.param);
    }

    //筛选付款方式选择;
    payWayFilter(state) {
        let param = this.state.param;
        param.pay_method = state;
        this.setState({param: param});
    }

    //筛选订单状态;
    orderStateFilter(state) {
        let param = this.state.param;
        param.delivery_status = state;
        this.setState({param: param});
    }

    //时间筛选中选择时间之后需要把“今天，明天，全部时间的状态取消”;
    selectTimeHandler() {
        $('.filter-time').removeClass('btn-default');
    }

    //全选反选时获取所有ID;
    getOrderId() {
        let arr = [],
            orderData = this.state.data.delivery_infos;
        for(var i in orderData) {
            arr.push(orderData[i].logistic_id);
        }
        return arr;
    }

    //全选;
    allSel(e) {
        let arr = [];
        if($(e.target).is(':checked')) {
            arr = this.getOrderId();
            $('.buyer-order-sel').prop('checked', 'true');
        }else {
            arr = [];
            $('.buyer-order-sel').removeAttr('checked');
        }
        this.setState({orderIdArr: arr});
    }

    //checkbox 状态改变事件;
    selChange(number, e) {
        let arr = this.state.orderIdArr,
            newArr = this.getOrderId();
        if($(e.target).is(':checked')) {
            arr.push(number);
            if(arr.length == newArr.length) {
                $('#order_buyer_sel_all').prop('checked', 'true');
            }
        }else {
            for(var i in arr) {
                if(arr[i] == number) {
                    arr.splice(i, 1);
                    break;
                }
            }
            $('#order_buyer_sel_all').removeAttr('checked');
        }
        this.setState({orderIdArr: arr});
    }

    //订单（批量）发货;
    batchDelivery(id) {
        let paramArr = id == 'all' ? this.state.orderIdArr : [id],
            data = this.state.data.delivery_infos,
            param = null;
        if(paramArr <= 0) return;
        param = {
            logistic_ids: paramArr.join(',')
        };

        //判断下面是否有未备货的，如果不能执行批量发货;
        for(let i in data) {
            if(paramArr.indexOf(data[i].logistic_id) != -1) {
                let orderData = data[i].orders;
                for(let k in orderData) {
                    if(orderData[k].goods_prepare_status == 1) {
                        H.Modal('只有完成备货的订单才可以发货，请确认选中的订单是否都完成了备货');
                        return ;
                    }
                }
            }
        }

        H.Modal({
            title: '发货',
            content: '<p style="text-align: center;">此操作不可逆，是否确认收货？</p>',
            cancel: true,
            okText: '确认',
            okCallback: () => {
                H.server.order_delivery(param, (res) => {
                    if(res.code == 0) {
                        let reason = '';
                        if(res.data.failure_num != 0) {
                            reason = '<p style="margin-left: 50px;">失败原因：'+res.data.errors+'</p>';
                        }
                        H.Modal({
                            title: '发货',
                            content: '<p style="margin-left: 50px;">成功：'+res.data.succeed_num+'单&nbsp;&nbsp;失败：'+res.data.failure_num+'单</p>' +
                             reason,
                            cancel: true,
                            ok: false
                        });
                        this.getDataList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //改期, info: 当前选择订单的数据, shop_name: 买家信息， delivery_date: 原发货时间;
    deliveryDate(info, shop_name, delivery_date) {
        let data = info;
        data.shop_name = shop_name;
        data.delivery_date = delivery_date;
        this.setState({
            modalState: 1,
            thisOrderData: data
        });
    }

    //提交改期，orderNo: 订单Id;
    deliveryDateSub(orderId) {
        let param = {
            order_id: orderId,
            'delivery-date': $('#delivery-date').val()  //新的发货时间;
        };
        H.server.order_deliveryDate_update(param, (res) => {
            if(res.code ==0) {
                H.Modal(res.message);
                this.getDataList();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            this.setState({modalState: 0});
        });
    }

    //点击取消，取得当前订单信息,info: 当前订单数据，shop_name: 买家名字;
    cancelGoods(info, shop_name) {
        let data = info;
        data.shop_name = shop_name;
        this.setState({
            modalState: 2,
            thisOrderData: data
        });
    }

    //提交取消商品;
    cancelGoodsSub(orderNo) {
        let arr = [], selArr = $('.goods-sel');
        for(var i = 0 ; i < selArr.length ; i++) {
            if(selArr.eq(i).is(':checked')) {
                let goodsId = selArr.eq(i).attr('data-goods-id');
                arr.push(goodsId);
            }
        }
        if(arr.length <= 0) {
            alert('您没有选择取消的商品');
            return ;
        }else if($('#cancel-note').val() == '') {
            $('#cancel-note')[0].focus();
            return ;
        }
        let param = {
            sub_order_no: orderNo,
            order_goods_ids: arr.join(','),
            del_reason: $('#cancel-note').val()
        };
        H.server.order_goods_del(param, (res) => {
            if(res.code ==0) {
                H.Modal(res.message);
                this.getDataList();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            this.setState({modalState: 0});
        });
    }

    //点击未备货的订单更改备货状态;
    goodsPrepare(info) {
        if(info.order_status == 1) {
            H.Modal('未确认的订单不能操作备货');
            return;
        }
        this.setState({
            modalState: 3,
            thisOrderData: info
        });
    }

    //更改备货状态和提交成本价的弹窗中点击保存；
    goodsPrepareSub(info) {
        let goodsArr = info.goods_infos, arr = [];
        for (let i in goodsArr) {
            if(goodsArr[i].goods_id != 0) {
                let price = $('#prepare_' + goodsArr[i].order_goods_id).val();
                if(!H.isNumber(price)) {
                    $('#prepare_' + goodsArr[i].order_goods_id)[0].focus();
                    return ;
                }
                arr.push({
                    order_goods_id: goodsArr[i].order_goods_id,
                    goods_cost_price: price
                });
            }
        }
        let param = {
            order_id: info.order_id,
            goods_id_cost_price: JSON.stringify(arr),
            prepare_status: 2
        };
        H.server.order_goodsPrepare(param, (res) => {
            if(res.code ==0) {
                H.Modal(res.message);
                this.getDataList();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
            this.setState({modalState: 0});
        });
    }

    //点击已备货的订单取消备货;
    goodsPrepareCancel(info) {
        if(info.order_status == 4 || info.order_status == 3) {
            H.Modal('已经发货的订单不能取消备货');
            return;
        }
        let goodsArr = info.goods_infos, arr = [];
        for (let i in goodsArr) {
            if(goodsArr[i].goods_id != 0) {
                arr.push({
                    order_goods_id: goodsArr[i].order_goods_id,
                    goods_cost_price: 0
                });
            }
        }
        let param = {
            order_id: info.order_id,
            goods_id_cost_price: JSON.stringify(arr),
            prepare_status: 1
        };
        H.Modal({
            title: '取消备货',
            content: '<p>如果您取消备货，再次标记备货需要重新填成本价格</p>',
            cancel: true,
            okText: '确认',
            okCallback: () => {
                H.server.order_goodsPrepare(param, (res) => {
                    if(res.code ==0) {
                        H.Modal(res.message);
                        this.getDataList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                    this.setState({modalState: 0});
                });
            }
        });
    }

    //确认订单有效;
    orderConfirm(orderNo) {
        H.Modal({
            title: '确认有效',
            content: '<p style="text-align: center">该订单是货到付款，请先确认是否有效</p>',
            cancel: true,
            okText: '确认',
            okCallback: () => {
                H.server.order_confirm({sub_order_no: orderNo}, (res) => {
                    if(res.code ==0) {
                        H.Modal(res.message);
                        this.getDataList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //确认收货;
    orderTake(orderNo) {
        H.Modal({
            title: '确认有效',
            content: '<p style="text-align: center">请先确认用户是否已经收到货，恶意操作将被平台严重处罚</p>',
            cancel: true,
            okText: '确认',
            okCallback: () => {
                H.server.order_goods_take({sub_order_no: orderNo}, (res) => {
                    if(res.code ==0) {
                        H.Modal(res.message);
                        this.getDataList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //导出和打印;
    printExport() {
        this.setState({
            modalState: 4
        });
    }

    //导出并下载文件;
    export() {
        let param = this.state.param,
            str = '/order/buyer/data/download?';
        for(let i in param) {
            str += i + '=' + param[i] + '&';
        }
        window.open(str);
    }

    //关闭弹窗, 组件中的弹窗;
    closeModal() {
        this.setState({modalState: 0});
    }

    //生成表格下面的统计;
    createCount() {
        let data = this.state.data,
            xml = '';
        if(data) {
            xml = (
                <div className="page-nav-left">当前结果：
                    {data.buyer_num ? data.buyer_num : ''}人，
                    {data.goods_num ? data.goods_num : ''}件，
                    {data.order_total_amount ? data.order_total_amount : ''}元
                </div>
            );
        }
        return xml;
    }

    render() {

        let modalXml = '';
        if(this.state.modalState == 1) {
            modalXml = (
                <Modal
                    width="450"
                    header="改期"
                    confirm="确定"
                    cancel="取消"
                    confirmCallback={this.deliveryDateSub.bind(this, this.state.thisOrderData.order_id)}
                    closeCallback={this.closeModal}
                >
                    <DeliveryDate data={this.state.thisOrderData} />
                </Modal>
            );
        }else if(this.state.modalState == 2) {
            modalXml = (
                <Modal
                    width="480"
                    header="请选择取消的商品"
                    confirm="确定"
                    cancel="取消"
                    confirmCallback={this.cancelGoodsSub.bind(this, this.state.thisOrderData.sub_order_no)}
                    closeCallback={this.closeModal}
                >
                    <CancelGoods data={this.state.thisOrderData} />
                </Modal>
            );
        }else if(this.state.modalState == 3) {
            modalXml = (
                <Modal
                    width="340"
                    header="请确认本次的成本价"
                    confirm="保存"
                    cancel="取消"
                    confirmCallback={this.goodsPrepareSub.bind(this, this.state.thisOrderData)}
                    closeCallback={this.closeModal}
                >
                    <GoodsPrepare data={this.state.thisOrderData} />
                </Modal>
            );
        }else if(this.state.modalState == 4) {
            modalXml = (
                <Modal
                    width="340"
                    header="打印导出"
                    confirm="导出"
                    cancel="打印"
                    cancelDisabled="true"
                    confirmCallback={this.export.bind(this)}
                    cancelCallback={() => {
                                alert('暂时不提供打印功能');
                            }}
                    closeCallback={this.closeModal}
                >
                    <div>模板：
                        <label className="radio-inline disabled">
                            <input type="radio" name="printExport" value="option1" disabled />发货单
                        </label>
                        <label className="radio-inline">
                            <input type="radio" name="printExport" value="option1" defaultChecked />买家版
                        </label>
                    </div>
                </Modal>
            );
        }

        let param = this.state.param;

        return (
            <div className="section-warp">
                <div className="section-filter">
                    <div className="buyer-or-seller">
                        <a className="active" onClick={this.props.setPage.bind(this, 1)}>买家 </a> / <a onClick={this.props.setPage.bind(this, 2)}>卖家</a>
                    </div>
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <SearchKey dropdownMenus={['买家店铺名', '发货号']} emit={this.searchKey} id="buyer-key-search" />
                        <div className="filter-row">
                            <div className="btn-group">
                                <a id="timeFilter_1"
                                   className={param.specified_date === H.GetDateStr().time1 ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, 1)}>今天</a>
                                <a id="timeFilter_2"
                                   className={param.specified_date === H.GetDateStr(1).time1 ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, 2)}>明天</a>
                                <a id="timeFilter_3"
                                   className={param.specified_date === '' ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, '')}>全部时间</a>
                            </div>
                            <DatePicker prefix="transfer_order_buyer_" title="时间筛选" styles={{marginLeft: '40px'}} selectTimeHandler={this.selectTimeHandler} />
                        </div>
                        <div className="filter-row">
                            <div className="btn-group">
                                <a id="prepareFilter_0"
                                   className={param.prepare_status === '' ? 'btn btn-sm btn-default filter-prepare-state' : 'btn btn-sm filter-prepare-state'}
                                   onClick={this.prepareFilter.bind(this, '')}>全部</a>
                                <a id="prepareFilter_1"
                                   className={param.prepare_status === 1 ? 'btn btn-sm btn-default filter-prepare-state' : 'btn btn-sm filter-prepare-state'}
                                   onClick={this.prepareFilter.bind(this, 1)}>未备货</a>
                                <a id="prepareFilter_2"
                                   className={param.prepare_status === 2 ? 'btn btn-sm btn-default filter-prepare-state' : 'btn btn-sm filter-prepare-state'}
                                   onClick={this.prepareFilter.bind(this, 2)}>已备货</a>
                            </div>
                        </div>
                        <div className="filter-row">
                            <div className="btn-group">
                                <a id="payWayFilter_0"
                                   className={param.pay_method === '' ? 'btn btn-sm btn-default filter-pay-way' : 'btn btn-sm filter-pay-way'}
                                   onClick={this.payWayFilter.bind(this, '')}>全部</a>
                                <a id="payWayFilter_1"
                                   className={param.pay_method === 1 ? 'btn btn-sm btn-default filter-pay-way' : 'btn btn-sm filter-pay-way'}
                                   onClick={this.payWayFilter.bind(this, 1)}>平台收款</a>
                                <a id="payWayFilter_5"
                                   className={param.pay_method === 5 ? 'btn btn-sm btn-default filter-pay-way' : 'btn btn-sm filter-pay-way'}
                                   onClick={this.payWayFilter.bind(this, 5)}>货到付款</a>
                            </div>
                            <div style={{float: 'right', marginRight: '20px'}}>
                                {this.isHavePrivilege('导出/打印') ? <a className="btn" onClick={this.printExport.bind(this)}>导出/打印</a> : ''}
                                {this.isHavePrivilege('批量发货') ? <a className="btn" onClick={this.batchDelivery.bind(this, 'all')}>批量发货</a> : ''}
                            </div>
                        </div>
                        <div className="filter-row">
                            <div className="btn-group">
                                <a id="orderStateFilter_0"
                                   className="btn btn-sm btn-default filter-order-way"
                                   className={param.delivery_status === '' ? 'btn btn-sm btn-default filter-order-way' : 'btn btn-sm filter-order-state'}
                                   onClick={this.orderStateFilter.bind(this, '')}>全部</a>
                                <a id="orderStateFilter_0"
                                   className={param.delivery_status === 0 ? 'btn btn-sm btn-default filter-order-way' : 'btn btn-sm filter-order-state'}
                                   onClick={this.orderStateFilter.bind(this, 0)}>未确认</a>
                                <a id="orderStateFilter_1"
                                   className={param.delivery_status === 1 ? 'btn btn-sm btn-default filter-order-way' : 'btn btn-sm filter-order-state'}
                                   onClick={this.orderStateFilter.bind(this, 1)}>未发货</a>
                                <a id="orderStateFilter_2"
                                   className={param.delivery_status === 2 ? 'btn btn-sm btn-default filter-order-way' : 'btn btn-sm filter-order-state'}
                                   onClick={this.orderStateFilter.bind(this, 2)}>已发货</a>
                            </div>
                            <a style={{marginLeft: '40px', width: '180px'}} className="btn btn-lg btn-orange" onClick={this.filterSub.bind(this)}>筛选</a>
                            <div className="checkbox" style={{float: 'right', marginRight: '20px'}}>
                                <label>
                                    <input id="order_buyer_sel_all" type="checkbox" style={{position: 'absolute', marginLeft: '-20px'}} onChange={this.allSel.bind(this)} />全选
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                        <tr className="tr-bg">
                            <th>订单号</th>
                            <th style={{minWidth: '102px'}}>下单时间</th>
                            <th>商品名</th>
                            <th>金额</th>
                            <th style={{minWidth: '100px'}}>原始卖家</th>
                            <th>备货状态</th>
                            <th style={{width: '220px'}}>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                    {this.createCount()}
                    <PageCtrlBar pageNum={this.state.param.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
                </div>
                <div className={ this.state.infoPanel.infoPanelIsShow ? 'section-tr-info show' : 'section-tr-info' }>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <div className="info-w">
                        <h3 className="info-title">
                            {this.state.infoPanel.infoPanelTitle}
                        </h3>
                        <div className="info-main-w">
                            <div className="infoPanel-form">

                            </div>
                        </div>
                    </div>
                </div>
                {modalXml}
                {this.state.loading ? <DataLoading /> : ''}
            </div>
        );
    }
}

export default BuyerList;