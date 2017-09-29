import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Table from './../../../../components/table.jsx';
import AddPopUpAd from './add_pop_up_ad.jsx';
import Paging from '../../../../components/page/paging.js';

class PopUpAd extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            areaList: [],           // 地区列表
            adList: [],             // 广告列表
            currentArea:0,          // 当前地区
            currentStatus: 2,       // 当前状态
            page: 1,
            size: 20,
            total: 0
        };
        this.tableOperate = this.tableOperate.bind(this);
    }

    componentWillMount() {
        this.init();
    }

    init() {
        new Promise((resolve)=>{
            this.getAreaList(resolve);
        }).then(()=>{
            this.getAdList();
        });
    }

    getAreaList(resolve) {
        H.server.get_area_list({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    areaList: res.data,
                    currentArea: res.data[0].area_id
                }, ()=>{resolve('Completed');});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    getAdList() {

        let param = {
            area_id: this.state.currentArea,
            status: this.state.currentStatus,
            page: this.state.page,
            size: this.state.size};

        if($('#ad-online').val()){
            param.put_on_at = $('#ad-online').val().split('T').join(' ')+':00';
        }

        if($('#ad-offline').val()){
            param.pull_off_at = $('#ad-offline').val().split('T').join(' ')+':00';
        }

        H.server.indexManage_ad_list(param, (res)=>{
            if(res.code == 0){
                this.setState({
                    adList: res.data.popup_ads,
                    page: res.data.page,
                    total: res.data.total
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createFilter() {
        let statusNames = ['上架', '待上架', '下架'],
            statusData = [2, 1, 3];
        let adArea = [];
        this.state.areaList.map((area, index)=>{
            adArea.push(<option key={index} className="form-control" value={area.area_id}>{area.area_name}</option>);
        });

        return (
            <form className="form-inline col-lg-12">
                <div className="section-filter" style={{marginBottom:'10px', overflow:'hidden'}}>
                    <div className="filter-row">
                        <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.add.bind(this)}>新增弹窗广告</a>
                    </div>
                    <div className="filter-row">
                        <label className="control-label">地区
                            <select id="select-ad-area" className="form-control" style={{marginLeft: '20px'}}
                                    onChange={this.toggleArea.bind(this)}>{adArea}</select></label>
                    </div>
                    <div className="filter-row">
                        <label className="control-label">上架时间上限
                            <input id="ad-online" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
                        <label className="control-label">上架时间下限
                            <input id="ad-offline" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
                        <a href="javascript:;" className="btn btn-lg btn-orange" onClick={this.select.bind(this)}>筛选</a>
                    </div>
                    <div className="filter-row">
                        <BtnGroup btnNames={statusNames} bindData={statusData} clickCallback={this.toggleStatus.bind(this)}
                                  style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.currentStatus}/>
                    </div>
                </div>
            </form>
        );
    }

    add() {
        let panel = <AddPopUpAd closePanel={this.closePanel.bind(this)}/>;
        this.props.togglePanel && this.props.togglePanel(panel);
    }

    closePanel() {
        this.getAdList();
        this.props.togglePanel && this.props.togglePanel(null);
    }

    select(){
        this.getAdList();
    }

    toggleStatus(e) {
        let status = e.target.dataset.index;

        if(status === this.state.currentStatus) {
            return;
        }

        this.setState({
            currentStatus: status
        }, this.getAdList);
    }

    toggleArea(e){
        let areaId = e.target.value;

        this.setState({
            currentArea: areaId,
            currentStatus: 2
        }, ()=>{
            this.getAdList();
        });
    }

    createTable() {
        let headlines = ['序号', '广告标题', '上架时间', '下架时间', '状态', '点击量', '操作'],
            order = ['order', 'ads_title', 'put_on_at', 'pull_off_at', 'status', 'pv', 'status'],
            status = {
                4: {
                    1: '待上架',
                    2: '上架',
                    3: '已下架'
                }
            },
            statusOperate = {
                1: ['下架', '查看图片'],
                2: ['下架', '查看图片'],
                3: ['查看图片']
            },
            fn = {
                6: this.tableOperate
            };

        this.state.adList.map((ad, index)=>{
            ad.order = index + 1;
        });
        return(
            <Table key={this.state.currentStatus} id="brand_house" values={this.state.adList} headlines={headlines}
                   status={status} statusOperate={statusOperate} order={order} bodyOperate={fn}/>
        );
    }

    tableOperate(e){
        let operate = $(e.target).html(),
            ad = this.state.adList[e.target.dataset.reactid.split('$')[4].split('.')[0]];

        switch (operate){
            case '下架':
                this.soldOut(ad);
                break;
            case '查看图片':
                this.showImg(ad);
                break;
        }
    }

    soldOut(ad){
        H.Modal({
            content:'是否要下架弹窗广告【'+ad.ads_title+'】？',
            okText:'下架',
            cancel:true,
            okCallback: ()=>{
                H.server.indexManage_pulloff_ad({id:ad.id}, (res)=>{
                    if(res.code == 0){
                        this.getAdList();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    showImg(ad){
        H.Modal({
            title:'查看图片',
            width: 300,
            height:600,
            content:'<div class="cell-row">' +
            '<img src="http://img.idongpin.com/'+ad.image+'" style="width: 250px;height: auto;margin: 0 auto;display: block">' +
            '</div>',
            okText:'我知道了',
            closeBtn: true
        });
    }

    setPageNum(page){
        this.state.page = page.page;
        this.getAdList();
    }

    render(){
        return (<div className="banner">
            {this.createFilter()}
            {this.createTable()}
            <Paging key={this.state.currentStatus + 1}   maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />

        </div>);
    }
}

export default PopUpAd;