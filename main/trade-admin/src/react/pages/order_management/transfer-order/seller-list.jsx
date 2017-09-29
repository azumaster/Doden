import React from 'react';
import Refresh from '../../../../components/refresh/refresh.js';
import PageCtrlBar from '../../../../components/page/paging.js';
import SearchKey from '../../../../components/search/search.js';
import DatePicker from '../../../../components/datePicker/index.jsx';
import Modal from '../../../../components/modal/modal.js';
import DataLoading from '../../../../components/data_loading/loading.jsx';

class SellerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: {  //搜索参数;
                seller_shop_name: '',
                specified_date: H.GetDateStr().time1,
                date_begin: '',
                date_end: '',
                page: 1,
                size: 10
            },
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            },
            totalPage: 1,   //总页数;
            data: null,
            modalState: 0,  //交互弹窗 0表示没有，1打印/导出;
            loading: false
        };
        this.getDataList = this.getDataList.bind(this);
        this.createTable = this.createTable.bind(this);
        this.isHavePrivilege = this.isHavePrivilege.bind(this);
        this.changePage = this.changePage.bind(this);
        this.searchKey = this.searchKey.bind(this);
        this.refresh = this.refresh.bind(this);
        this.selectTimeHandler = this.selectTimeHandler.bind(this);
        this.filterSub = this.filterSub.bind(this);
        this.setParam = this.setParam.bind(this);
        this.createCount = this.createCount.bind(this);
    }

    componentWillMount() {
        this.getDataList();
    }

    getDataList() {
        let param = this.state.param;
        this.setState({loading: true});
        H.server.order_seller_list(param, (res) => {
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

    //一键进货;
    purchase(time, goodsId, sellerName, goodsName, num) {
        H.Modal({
            title: '一键进货',
            content: '<p>卖家：'+sellerName+'<p>商品名：'+goodsName+'</p><div class="form-inline">购买数量：' +
            '<input id="purchase_num" type="text" class="form-control" style="border-radius: 0;" value="'+num+'" /></div>',
            cancel: true,
            okCallback: () => {
                let param = {
                    goods_id: goodsId,
                    delivery_date: time,
                    purchase_num: $('#purchase_num').val()
                };
                H.server.order_goods_purchase(param, (res) => {
                    if(res.code == 0) {
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

    //生成表数据;
    createTable() {
        if(!this.state.data) return '';
        let data = this.state.data.delivery_infos,
            xml = [];
        xml.push(<tr key="0" className="hr-tr"><td colSpan="6"></td></tr>);
        for(let i in data) {
            xml.push(
                <tr key={'hr_' + i}><td colSpan="6" className="col-row">
                    <div style={{float: 'left'}}>
                        {data[i].seller.seller_name}&nbsp;&nbsp;&nbsp;&nbsp;
                        {data[i].seller.seller_tel}&nbsp;&nbsp;&nbsp;&nbsp;
                        {data[i].seller.shop_address}&nbsp;&nbsp;&nbsp;&nbsp;
                        发货时间：{data[i].delivery_date}
                    </div>
                </td></tr>
            );
            let orderData = data[i].orders;
            for(let k in orderData) {
                let goods = orderData[k].goods_infos;
                if(goods.goods_id != 0) {
                    xml.push(
                        <tr key={'goods_' + i + k}>
                            <td>{goods.goods_name}&nbsp;&nbsp;{goods.goods_brand}/{goods.goods_guigei}</td>
                            <td>{orderData[k].order.buy_num}</td>
                            <td>
                                {
                                    orderData[k].purchase == 1 ?
                                        <a key={'goods_' + k}
                                           onClick={this.purchase.bind(this, data[i].delivery_date, goods.goods_id, data[i].seller.seller_name, goods.goods_name, orderData[k].order.buy_num)}>
                                            一键进货</a> : null
                                }

                            </td>
                        </tr>
                    );
                }
            }
        }
        return xml;
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
            seller_shop_name: '',
            specified_date: dataStr,
            date_begin: dataStr,
            date_end: dataStr,
            page: 1,
            size: 10
        };

    }

    //刷新;
    refresh() {
        this.setParam();
        $('#seller-key-search').val('');
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
            param.seller_shop_name = keyword;
        }
        param.specified_date = '';
        param.date_begin = '';
        param.date_end = '';
        $('#transfer_order_seller_startTime').val('');
        $('#transfer_order_seller_endTime').val('');
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
        $('#transfer_order_seller_startTime').val(param.specified_date);
        $('#transfer_order_seller_endTime').val(param.specified_date);
        this.setState({param: param});
    }

    //提交筛选;
    filterSub() {
        let param = this.state.param;
        param.date_begin = $('#transfer_order_seller_startTime').val();
        param.date_end = $('#transfer_order_seller_endTime').val();
        this.setParam(this.state.param);
    }

    //时间筛选中选择时间之后需要把“今天，明天，全部时间的状态取消”;
    selectTimeHandler() {
        $('.filter-time').removeClass('btn-default');
    }

    //打印导出;
    printExport() {
        this.setState({
            modalState: 1
        });
    }

    //导出;
    export() {
        let param = this.state.param,
            str = '/order/seller/data/download?';
        for(let i in param) {
            str += i + '=' + param[i] + '&';
        }
        window.open(str);
    }

    //生成表格下面的统计;
    createCount() {
        let data = this.state.data,
            xml = '';
        if(data) {
            xml = (
                <div className="page-nav-left">当前结果：
                    共{data.goods_num ? data.goods_num : ''}件
                </div>
            );
        }
        return xml;
    }

    render() {

        let param = this.state.param;

        let modalXml = '';
        if(this.state.modalState == 1) {
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
                    closeCallback={() => {
                        this.setState({modalState: 0});
                    }}
                >
                    <div>模板：
                        <label className="radio-inline">
                            <input type="radio" name="printExport" value="option1" defaultChecked />卖家版
                        </label>
                    </div>
                </Modal>
            );
        }
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <div className="buyer-or-seller">
                        <a onClick={this.props.setPage.bind(this, 1)}>买家 </a> / <a className="active" onClick={this.props.setPage.bind(this, 2)}>卖家</a>
                    </div>
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <SearchKey dropdownMenus={['卖家店铺名']} emit={this.searchKey} id="seller-key-search"/>
                        <div className="filter-row">
                            <div className="btn-group">
                                <a id="timeFilter_1"
                                   className={param.specified_date == H.GetDateStr().time1 ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, 1)}>今天</a>
                                <a id="timeFilter_2"
                                   className={param.specified_date == H.GetDateStr(1).time1 ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, 2)}>明天</a>
                                <a id="timeFilter_3"
                                   className={param.specified_date == '' ? 'btn btn-lg btn-default filter-time' : 'btn btn-lg filter-time'}
                                   onClick={this.timeFilter.bind(this, '')}>全部时间</a>
                            </div>
                            <DatePicker prefix="transfer_order_seller_" title="时间筛选"
                                        styles={{marginLeft: '40px'}} searchEvt={this.filterSub}
                                        selectTimeHandler={this.selectTimeHandler} />
                            <div style={{float: 'right', marginRight: '20px'}}>
                                {this.isHavePrivilege('导出/打印') ? <a className="btn" onClick={this.printExport.bind(this)}>导出/打印</a> : ''}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                        <tr className="tr-bg">
                            <th>商品</th>
                            <th>数量</th>
                            <th>操作</th>
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

export default SellerList;