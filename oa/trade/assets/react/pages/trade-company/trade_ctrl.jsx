import Refresh from '../../../components/refresh/refresh.js';
import PageCtrlBar from '../../../components/page/paging.js';
import TransferRules from './transfer_rules.jsx';
//import Input from '../../../components/input/input.js';

class TradeCompanyCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],   //用户列表数据;
            privilege: null,  //当前用户的所有权限;
            totalPage: 1,   //总页数;
            infoPanel: {    //附体部分状态及标题;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            },
            tradeStatus: 1,  //判断添加还是修改部门的状态,添加为1，修改为2;
            defaultParam: {  //获取列表提交的参数;
                page: 1,
                size: 40
            },
            infoItem: null,   //当前被操作的用户信息;
            shopType: null,
            areas: null,
            tradeFeesList: null   //商品公司运费规则列表;
        };
        this.getDataList = this.getDataList.bind(this);
        this.hideInfoPanel = this.hideInfoPanel.bind(this);
        this.changePage = this.changePage.bind(this);
        this.refresh = this.refresh.bind(this);
        this.isHavePrivilege = this.isHavePrivilege.bind(this);
        this.dataRecord = this.dataRecord.bind(this);
    }

    componentDidMount() {
        this.getDataList();
        let server = H.server;

        //获取用户类型;
        server.shop_type_list({}, (res) => {
            if(res.code == 0) {
                this.setState({shopType: res.data});
            }
        });

        //获取省市县;
        server.other_area_list({}, (res) => {
            if(res.code == 0) {
                this.setState({areas: res.data});
            }
        });

        //商贸公司运费规则列表;
        server.trade_fees_list({}, (res) => {
            if(res.code == 0) {
                this.setState({tradeFeesList: res.data});
            }
        });

        //当前用户的所有权限获取;
        let tabData = this.props.currentTabData,
            userNavigate = this.props.userNavigate;
        if(this.props.userNavigate && this.props.userNavigate != '') {
            if(userNavigate[tabData.parentId] && userNavigate[tabData.parentId][tabData.id]){
                this.setState({privilege: this.props.userNavigate[tabData.parentId][tabData.id]});
            }
        }
    }

    //获取数据列表;
    getDataList() {
        let server = H.server,
            param = this.state.defaultParam;

        //获取公司列表;
        server.trade_list(param, (res) => {
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
        });
    }

    //点击创建商贸公司按钮;
    createCompany() {
        this.setState({
            infoItem: { //当前被操作的用户信息;
                'trade_infos': {
                    'shop_id': '',
                    'login_name': '',
                    'login_password': ''
                },
                'transfer_rules': [
                    {
                        'province_id': -1,
                        'city_id': -1,
                        'county_id': -1,
                        'shop_types': '',
                        'free_freight_order_time': 0,
                        'free_freight_max_amount': 0,
                        'freight_min_amount': 0,
                        'payment_after_arrival_time': 0,
                        'abort_time': '',
                        'delivery_date_rule': 0,
                        'delivery_time': '',
                        'fees_rule_type_id': 0,
                        'rest_day': '',
                        'fees_rules': [
                            {
                                'from_min_amount': 0,
                                'to_max_amount': 0,
                                'freight_amount': 0
                            }
                        ]
                    }
                ]
            },
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: '创建商贸公司'},
            tradeStatus: 1
        });
    }

    //点击修改商贸公司;
    modifyCompany(val) {
        let param = {
            trade_id: val
        };
        H.server.trade_info(param, (res) => {
            if(res.code == 0) {
                let data = res.data;
                data.trade_infos.login_password = '';
                this.setState({
                    infoItem: data,
                    infoPanel: {infoPanelIsShow: true, infoPanelTitle: '修改商贸公司'},
                    tradeStatus: 2
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //创建或者修改商贸公司信息及转接规则;
    commitCompanyInfo() {
        let server = H.server,
            data = this.state.infoItem,
            param = {data: JSON.stringify(data)};
        if(!H.isPhone(data.trade_infos.login_name)) {
            H.Modal('ROOT管理账号必须填写手机号');
            return;
        }
        for(let i in data.transfer_rules) {
            if(data.transfer_rules[i].rest_day.split(',').length > 6) {
                H.Modal('休息时间最多可选6天');
                return;
            }
        }

        if(this.state.tradeStatus == 1) {
            if(data.trade_infos.shop_id == ''){
                H.Modal('店铺ID必须填写');
                return;
            }
            if(data.trade_infos.login_password == ''){
                H.Modal('ROOT管理密码必须填写');
                return;
            }
            server.trade_add(param, (res) => {
                if(res.code == 0) {
                    H.Modal(res.message);
                    this.getDataList();
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }else {
            server.trade_info_update(param, (res) => {
                if(res.code == 0) {
                    H.Modal(res.message);
                    this.getDataList();
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }
    }

    //隐藏附体部分;
    hideInfoPanel(){
        this.setState({
            infoPanel: {infoPanelIsShow: false, infoPanelTitle: ''}
        });
    }

    //对当前页面的设置;
    changePage(n) {
        let param = this.state.defaultParam,
            newParam = Object.assign(param, n);
        this.setState({defaultParam: newParam}, () => {
            this.getDataList();
        });
    }

    //刷新;
    refresh() {
        this.getDataList();
        this.setState({
            infoPanel: {    //附体部分状态及标题初始化;
                infoPanelIsShow: false,
                infoPanelTitle: ''
            }
        });
    }

    //改变状态;
    statusUpdate(id, status) {
        let param = {
            trade_id: id,
            status: status
        };
        H.server.trade_status_update(param, (res) => {
            if(res.code == 0) {
                H.Modal(res.message);
                this.getDataList();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //判断是否有这个功能;
    isHavePrivilege(name) {
        let privilege = this.state.privilege;
        for (let i in privilege) {
            if(privilege[i].name == name) {
                return true;
            }
        }
        return false;
    }

    //修改后的数据与现有的数据合并;
    dataRecord(index, res) {
        let data = this.state.infoItem;
        data.transfer_rules[index] = res;
        this.setState({infoItem: data});
    }

    //添加转移规则;
    addRuleHandler() {
        let infoItem = this.state.infoItem;
        infoItem.transfer_rules.push({
            'province_id': -1,
            'city_id': -1,
            'county_id': -1,
            'shop_types': '',
            'free_freight_order_time': 0,
            'free_freight_max_amount': 0,
            'freight_min_amount': 0,
            'payment_after_arrival_time': 0,
            'abort_time': '',
            'delivery_date_rule': 0,
            'delivery_time': '',
            'fees_rule_type_id': 0,
            'rest_day': '',
            'fees_rules': [
                {
                    'from_min_amount': 0,
                    'to_max_amount': 0,
                    'freight_amount': 0
                }
            ]
        });
        this.setState({
            infoItem: infoItem
        });
    }

    //删除转移规则;
    delRuleHandler(index) {
        let infoItem = this.state.infoItem;
        infoItem.transfer_rules.splice(index, 1);
        this.setState({
            infoItem: infoItem
        });
    }

    //Root管理账号改变;
    rootAccountChange(e) {
        let info = this.state.infoItem;
        info.trade_infos.login_name = e.target.value;
        this.setState({infoItem: info});
    }

    //Root管理密码改变;
    rootPwdChange(e) {
        let info = this.state.infoItem;
        info.trade_infos.login_password = e.target.value;
        this.setState({infoItem: info});
    }

    //店铺ID改变;
    shopIdChange(e) {
        let info = this.state.infoItem;
        info.trade_infos.shop_id = e.target.value;
        this.setState({infoItem: info});
    }

    render() {
        let infoPanelXml = '';
        if(this.state.infoItem && this.state.shopType && this.state.areas) {
            infoPanelXml = (
                <div className="info-main-w" style={{height: '482px'}}>
                    <div className="infoPanel-form">
                        <div className="item"><label>店铺ID：</label>
                            {
                                this.state.tradeStatus == 1 ?
                                    <input type="text" value={this.state.infoItem.trade_infos.shop_id} onChange={this.shopIdChange.bind(this)} />
                                    :
                                    <input type="text" defaultValue={this.state.infoItem.trade_infos.shop_id} disabled />
                            }
                        </div>
                        <div className="item"><label>ROOT管理账号：</label>
                            <input type="text" value={this.state.infoItem.trade_infos.login_name} onChange={this.rootAccountChange.bind(this)} />
                        </div>
                        <div className="item"><label>ROOT管理密码：</label>
                            <input type="password" value={this.state.infoItem.trade_infos.login_password} onChange={this.rootPwdChange.bind(this)} />
                        </div>
                        <div className="item"><label></label><input type="button" value="保存" onClick={this.commitCompanyInfo.bind(this)} /></div>
                    </div>
                    <div className="rules-warp">
                        <p>转接对象</p>
                        {
                            this.state.infoItem.transfer_rules.map((val, index) => {
                                let length = this.state.infoItem.transfer_rules.length - 1;
                                return (
                                    <div key={index} className="rules-item">
                                        <TransferRules
                                            index={index}
                                            val={val}
                                            length={length}
                                            shopType={this.state.shopType}
                                            areas={this.state.areas}
                                            tradeFeesList={this.state.tradeFeesList}
                                            dataRecord={this.dataRecord}
                                            addRuleHandler={this.addRuleHandler.bind(this)}
                                            delRuleHandler={this.delRuleHandler.bind(this)}
                                        />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            );
        }

        return (
            <div className="section-warp">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.isHavePrivilege('创建') ? <btn className="btn btn-lg" onClick={this.createCompany.bind(this)} >创建</btn> : ''}
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>店铺名</th>
                                <th>店铺ID</th>
                                <th>root管理账号</th>
                                <th>转接对象</th>
                                <th>状态</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data.map((value, index) => {

                                    let dom1 = '',
                                        dom2 = '',
                                        dom3 = '',
                                        privilege = this.state.privilege;

                                    if(value.trade_infos.status != 3) {
                                        for (let i in privilege) {
                                            if(privilege[i].name == '启用' || privilege[i].name == '停用') {
                                                if(value.trade_infos.status == 1) {
                                                    dom3 = (<a onClick={this.statusUpdate.bind(this, value.trade_infos.trade_id, 2)}>停用</a>);
                                                }else {
                                                    dom3 = (<a onClick={this.statusUpdate.bind(this, value.trade_infos.trade_id, 1)}>启用</a>);
                                                }
                                            }else if(privilege[i].name == '修改') {
                                                dom1 = (<a onClick={this.modifyCompany.bind(this, value.trade_infos.trade_id)}>修改</a>);
                                            }else if(privilege[i].name == '删除') {
                                                dom2 = (<a onClick={this.statusUpdate.bind(this, value.trade_infos.trade_id, 3)}>删除</a>);
                                            }
                                        }
                                    }

                                    return (
                                        <tr key={index}>
                                            <td>{value.trade_infos.trade_id}</td>
                                            <td>{value.shop_infos.shop_name}</td>
                                            <td>{value.shop_infos.shop_id}</td>
                                            <td>{value.trade_infos.login_name}</td>
                                            <td>{
                                                value.transfer_rules.map((val, indexs) => {
                                                    return (<div key={indexs}>城市：{val.province}-{val.city}-{val.county} 类型：{val.shop_type}</div>);
                                                })
                                            }</td>
                                            <td>{value.trade_infos.status == 1 ? '正常' : <div style={{color: 'red'}}>已停用</div>}</td>
                                            <td>{value.trade_infos.create_date}</td>
                                            <td>{dom3}{dom1}{dom2}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <PageCtrlBar pageNum={this.state.defaultParam.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
                </div>
                <div className="section-tr-info" style={{height: this.state.infoPanel.infoPanelIsShow ? '550px' : 0}}>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <div className="info-w">
                        <h3 className="info-title">
                            {this.state.infoPanel.infoPanelTitle}
                        </h3>
                        {infoPanelXml}
                    </div>
                </div>
            </div>
        );
    }
}

export default TradeCompanyCtrl;