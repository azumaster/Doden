/*
 * 描述：优质供应商
 * 作者：wjz
 * 联系方式：iamnew@zdongpin.com
 * 创建时间：2016-12-26
 **/
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';
import AddHighQualityShop from './add_high_quality_shop.jsx';

class HighQualityShop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            areaList:[],        // 大区列表
            shopList: [],       // 供应商列表

            currentArea:'',     // 当前大区id
            currentStatus:2,    // 当前供应商状态
            put_on_at: '',  //上架时间
            pull_off_at: '', //下架时间
            shop_id: 0,
            page:1,
            size:20,
            total: 0
        };
        this.tableOperate = this.tableOperate.bind(this);
    }

    componentWillMount(){
        this.init();
    }

    //初始化
    init(){
        new Promise((resolve)=>{
            this.getAreaList(resolve);
        }).then(()=>{
            this.getHighQualityShop();
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

    getHighQualityShop() {
        H.server.indexManage_highQualitySuppliers_list({
            area_id: this.state.currentArea,
            status: this.state.currentStatus,
            size: this.state.size,
            page: this.state.page}, (res)=>{
            if(res.code == 0){
                this.setState({
                    shopList: res.data.suppliers,
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
        let shopArea = [];

        this.state.areaList.map((area, index)=>{
            shopArea.push(<option key={index} className="form-control" value={area.area_id}>{area.area_name}</option>);
        });

        return (<form className="form-inline col-lg-12">
            <div className="section-filter" style={{marginBottom:'10px', overflow:'hidden'}}>
                <div className="filter-row">
                    <select id="select-brand-area" className="form-control" onChange={this.toggleArea.bind(this)}>{shopArea}</select>
                </div>
                <div className="filter-row">
                    <a id="add-new-brand" className="btn btn-lg btn-orange" onClick={this.add.bind(this)} href="javascript:;">新增供应商</a>
                </div>
                <div className="filter-row">
                    <BtnGroup btnNames={statusNames} bindData={statusData} clickCallback={this.toggleStatus.bind(this)}
                              style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.currentStatus}/>
                </div>
            </div>
        </form>);
    }

    add() {
        let panel = <AddHighQualityShop closePanel={this.closePanel.bind(this)} areaId={this.state.currentArea}/>;
        this.props.togglePanel && this.props.togglePanel(panel);
    }

    closePanel() {
        this.getHighQualityShop();
        this.props.togglePanel && this.props.togglePanel(null);
    }

    toggleArea(e){
        let areaId = e.target.value;

        this.setState({
            currentArea: areaId,
            currentStatus: 2
        }, ()=>{
            this.getHighQualityShop();
        });
    }

    toggleStatus(e) {
        let status = e.target.dataset.index;

        if(status === this.state.currentStatus) {
            return;
        }

        this.setState({
            currentStatus: status
        }, this.getHighQualityShop);
    }

    //创建店铺列表
    createShopTable(){
        let headlines = ['序号', '店铺ID', '店铺', '位置', '上架时间', '下架时间', '状态', '点击量', '操作'],
            order = ['order', 'shop_id', 'shop_name', 'position', 'put_on_at', 'pull_off_at', 'status', 'pv', 'status'],
            status = {
                6: {
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
                8: this.tableOperate
            };
        this.state.shopList.map((shop, index)=>{
            shop.order = index + 1;
        });
        return(
            <Table key={this.state.currentStatus} id="recommend_shop" values={this.state.shopList} headlines={headlines}
                   status={status} statusOperate={statusOperate} order={order} bodyOperate={fn}/>
        );
    }

    tableOperate(e){
        let operate = $(e.target).html(),
            shop = this.state.shopList[e.target.dataset.reactid.split('$')[4].split('.')[0]];

        switch (operate) {
            case '下架':
                this.soldOut(shop);
                break;
            case '查看图片':
                this.showImg(shop);
                break;
        }
    }

    // 下架
    soldOut(shop){
        H.Modal({
            content:'是否要从首页下架【'+shop.shop_name+'】？',
            okText:'下架',
            cancel:true,
            okCallback: ()=>{
                H.server.indexManage_highQualitySuppliers_pullOff({id: shop.id}, (res)=>{
                    if(res.code == 0){
                        this.getHighQualityShop();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    // 查看图片
    showImg(shop){
        H.Modal({
            title:'查看图片',
            width:600,
            closeBtn: true,
            content:'<div class="cell-row">' +
            '<img src="http://img.idongpin.com/'+shop.image+'" style="width: 100%;height: 100%;margin: 0 auto;display: block">' +
            '</div>',
            okText:'我知道了'
        });
    }

    setPageNum(page){
        this.state.page = page.page;
        this.getHighQualityShop();
    }

    render() {
        return (
            <div className="high-quality-shop">
                {this.createFilter()}
                {this.createShopTable()}
                <Paging key={this.state.currentStatus + 1}   maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />
            </div>
        );
    }
}

HighQualityShop.contextTypes = {
    areaData: React.PropTypes.array
};

export default HighQualityShop;