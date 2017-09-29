/**
 * Created by Doden on 2017.03.01
 */

import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Search from '../../../../components/search/search.js';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';
import ServiceDetail from './serviceDetail.jsx';

class  ServiceProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList:[],
            currentState: 1,
            showPanel:null,
            searchType:2,
            page:1,
            size:20,
            total:21
        };
        this.operate = this.operate.bind(this);
        this.closePanel = this.closePanel.bind(this);
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.service_list({page: this.state.page, size: this.state.size, status: this.state.currentState}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    serviceList: res.data.list,
                    total: res.data.total,
                    page: res.data.current
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建页卡
    createMenu() {
        let menuNames = ['待审核', '已开通', '已拒绝'],
            btnData = [1, 2, 3];

        return (<BtnGroup btnNames={menuNames} bindData={btnData} clickCallback={this.toggle.bind(this)}
                          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentState}/>);
    }

    toggle(e){
        let index = e.target.dataset.index;

        if(index === this.state.currentState){
            return;
        }

        this.setState({
            currentState:index
        }, this.getData);
    }

    // 创建搜索
    createSearch(){
        return (
            <div className="section-filter" style={{paddingTop: 0}}>
                <form className="form-inline">
                    <div className="filter-row">
                        <div className="search-bar">
                            <Search dropdownMenus={['手机号', '店铺名']} emit={this.search.bind(this)} onChange={this.changeSearch.bind(this)}/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    search(selVal, keyVal){
        let key = keyVal,
            searchType = this.state.searchType;

        H.server.search_service({search_type: searchType, content: key}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    serviceList: res.data,
                    page: 1
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    changeSearch(val){
        let searchType = this.state.searchType;
        if(val == 0){
            searchType = 2;
        } else if(val == 1){
            searchType = 1;
        }

        this.setState({
            searchType: searchType
        });
    }

    // 创建表格
    createTable() {
        let headlines = ['店铺名', '联系人', '手机号', '公众号', '地区', '申请时间', '操作'],
            order = ['shop_name', 'user_name', 'mobile', 'we_chat', 'address', 'created_at', 'operate'],
            statusOperate = {},
            fn= {
                6: this.operate
            };

        this.state.serviceList.map((service, index)=>{
            service.operate = index;
            service.we_chat = service.wechat_account.wechat_name;

            if(service.status == 1){
                statusOperate[index] = ['查看', '完善微信信息', '初始化微信配置', '确认开通'];
            } else if(service.status == 2) {
                statusOperate[index] = ['查看', '完善微信信息', '初始化微信配置', '关闭'];
            } else if(service.status == 3){
                statusOperate[index] = ['查看', '完善微信信息', '初始化微信配置', '重新开通'];
            }

        });

        return (
            <Table values={this.state.serviceList} headlines={headlines} order={order} bodyOperate={fn} id={'sp'}
                   statusOperate={statusOperate} />
        );

    }

    operate(e){
        let operate = $(e.target).html(),
            shopId = this.state.serviceList[e.target.parentNode.dataset.index].uid,
            wechat =  this.state.serviceList[e.target.parentNode.dataset.index].wechat_account;

        switch (operate){
            case '查看':
                this.setState({
                    showPanel: <ServiceDetail closePanel={this.closePanel} shopId={shopId} source={wechat.source}/>
                });
                break;
            case '完善微信信息':
                this.completeWechat(wechat);
                break;
            case '确认开通':
            case '重新开通':
                this.handleOperate(2, shopId);
                break;
            case '关闭':
                this.handleOperate(3, shopId);
                break;
            case '初始化微信配置':
                this.initWechat(wechat.source);
                break;
        }
    }

    initWechat(source){
        H.Modal({
            content: '确认要初始化微信配置？',
            cancel: true,
            okText: '确认',
            okCallback: ()=>{
                H.server.init_wechat({source: source}, (res)=>{
                    if(res.code == 0) {
                        H.Modal('# 操作成功 #');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    completeWechat(obj){
        H.Modal({
            title:'完善微信信息',
            content: '<form class="form-horizontal">' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">appid</div><input id="appid" type="text" class="form-control" value="'+(obj.appid?obj.appid:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">secret</div><input id="secret" type="text" class="form-control" value="'+(obj.secret?obj.secret:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">token</div><input id="token" type="text" class="form-control" value="'+(obj.token?obj.token:'')+'">'+
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">aes_key</div><input id="aes_key" type="text" class="form-control" value="'+(obj.aes_key?obj.aes_key:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">wechat_name</div><input id="wechat_name" type="text" class="form-control" value="'+(obj.wechat_name?obj.wechat_name:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">merchant_id</div><input id="merchant_id" type="text" class="form-control" value="'+(obj.merchant_id?obj.merchant_id:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">sp_id</div><input id="sp_id" disabled type="text" class="form-control" value="'+(obj.sp_id?obj.sp_id:'')+'">' +
            '</div>' +
            '<div class="input-group" style="margin-bottom: 10px">' +
            '<div class="input-group-addon">source</div><input id="source" disabled type="text" class="form-control" value="'+(obj.source?obj.source:'')+'">' +
            '</div>' +
            '</form>',
            cancel: true,
            okCallback:()=>{
                let data = {};
                data.appid = $.trim($('#appid').val());
                data.secret = $.trim($('#secret').val());
                data.token = $.trim($('#token').val());
                data.aes_key = $.trim($('#aes_key').val());
                data.sp_id = $.trim($('#sp_id').val());
                data.wechat_name = $.trim($('#wechat_name').val());
                data.source = $.trim($('#source').val());
                if($.trim($('#merchant_id').val()) || $.trim($('#merchant_id').val())!=''){
                    data.merchant_id = $.trim($('#merchant_id').val());
                }

                H.server.update_wechat_service(data, (res)=>{
                    if(res.code == 0) {
                        H.Modal('# 操作成功 #');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }

        });
    }

    handleOperate(handle, shopId){
        H.server.handle_service({sp_ids: [shopId], handle: handle}, (res)=>{
            if(res.code == 0) {
                H.Modal('# 操作成功 #');
                this.getData();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    closePanel() {
        this.setState({showPanel: null});
    }

    // 分页
    setPageNum(page){
        this.setState({
            page: page.page
        });
    }

    // 刷新
    refresh(){
        this.setState({
            page: 1
        }, this.getData);
    }

    createPanel() {
        return (
            <div className="section-warp">
                <div className="section-table">
                    {this.createSearch()}
                    <div className="col-lg-12" >
                        <div className="row col-lg-12">
                            <p className="col-lg-6 pull-left">当前结果：{this.state.total}个服务商</p>
                            <p><a href="javascript:;" className="pull-right" onClick={this.refresh.bind(this)}>刷新</a></p>
                        </div>
                        <div className="row col-lg-12">
                            {this.createTable()}
                        </div>
                        <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createMenu()}
                        </div>
                    </form>
                </div>
                <div className="section-table" >
                    {this.createPanel()}
                </div>
                {this.state.showPanel}
            </div>
        );
    }
}

export default ServiceProvider;