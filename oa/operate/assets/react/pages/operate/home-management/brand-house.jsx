/*
 * 品牌馆-OA
 * @author 魏华东
 * @date 2017.2.14 ^_^ ^_^
 **/
import Table from './../../../../components/table.jsx';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import AddBrand from './add-new-brand.jsx';
import Paging from '../../../../components/page/paging.js';

class BrandHouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areaList:[],        // 大区列表
            brandHouseList:[],  // 品牌馆列表

            currentArea:0,      // 当权大区
            currentStatus:2,    // 当前状态
            page:1,
            size:20,
            total:0
        };
        this.tableOperate = this.tableOperate.bind(this);
    }

    componentWillMount() {
        this.initData();
    }

    initData() {
       new Promise((resolve)=>{
           this.getAreaList(resolve);
       }).then(()=>{
            this.getBrandHouseList();
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

    getBrandHouseList() {
        H.server.get_brand_house_list({
            area_id:this.state.currentArea,
            status: this.state.currentStatus,
            size: this.state.size,
            page: this.state.page}, (res)=>{
            if(res.code == 0){
                this.setState({
                    brandHouseList: res.data.brands,
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

    // 创建状态切换
    createFilter(){
        let statusNames = ['上架', '待上架', '下架'],
            statusData = [2, 1, 3];
        let brandArea = [];

        this.state.areaList.map((area, index)=>{
            brandArea.push(<option key={index} className="form-control" value={area.area_id}>{area.area_name}</option>);
        });

        return (
            <form className="form-inline col-lg-12">
                <div className="section-filter" style={{marginBottom:'10px', overflow:'hidden'}}>
                    <div className="filter-row">
                        <select id="select-brand-area" className="form-control" onChange={this.toggleArea.bind(this)}>{brandArea}</select>
                    </div>
                    <div className="filter-row">
                        <a id="add-new-brand" className="btn btn-lg btn-orange" onClick={this.add.bind(this)} href="javascript:;">新增品牌</a>
                    </div>
                    <div className="filter-row">
                        <BtnGroup btnNames={statusNames} bindData={statusData} clickCallback={this.toggleStatus.bind(this)}
                                  style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.currentStatus}/>
                    </div>
                </div>
            </form>
        );
    }

    // 新增品牌
    add() {
        let panel = <AddBrand closePanel={this.closePanel.bind(this)} areaId={this.state.currentArea}/>;
        this.props.togglePanel && this.props.togglePanel(panel);
    }

    closePanel() {
        this.getBrandHouseList();
        this.props.togglePanel && this.props.togglePanel(null);
    }

    // 切换品牌状态
    toggleStatus(e) {
        let status = e.target.dataset.index;

        if(status === this.state.currentStatus) {
            return;
        }

        this.setState({
            currentStatus: status
        }, this.getBrandHouseList);
    }

    // 切换大区
    toggleArea(e) {
        let areaId = e.target.value;

        this.setState({
            currentArea: areaId,
            currentStatus: 2
        }, ()=>{
            this.getBrandHouseList();
        });
    }

    createTable(){
        let headlines = ['序号', '品牌ID', '品牌名称', '位置', '上线时间', '下线时间', '首页点击量', '操作'],
            order = ['order', 'brand_id', 'brand_name', 'position', 'put_on_at', 'pull_off_at', 'pv', 'status'],
            statusOperate = {
                1: ['下架', '查看图片'],
                2: ['下架', '查看图片'],
                3: ['查看图片']
            },
            fn = {
                7: this.tableOperate
            };
        this.state.brandHouseList.map((brand, index)=>{
            brand.order = index + 1;
        });
        return(
            <Table key={this.state.currentStatus} id="brand_house" values={this.state.brandHouseList} headlines={headlines}
                   status={status} statusOperate={statusOperate} order={order} bodyOperate={fn}/>
        );
    }

    tableOperate(e) {
        let operate = $(e.target).html(),
            brand = this.state.brandHouseList[e.target.dataset.reactid.split('$')[4].split('.')[0]];

        switch (operate) {
            case '下架':
                this.soldOut(brand);
                break;
            case '查看图片':
                this.showImg(brand);
                break;
        }
    }

    // 下架
    soldOut(brand){
        H.Modal({
            content:'是否要从首页下架【'+brand.brand_name+'】？',
            okText:'下架',
            cancel:true,
            okCallback: ()=>{
                H.server.sold_out_brand({id: brand.id}, (res)=>{
                    if(res.code == 0){
                        this.getBrandHouseList();
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
    showImg(brand){
        H.Modal({
            title:'查看图片',
            width:600,
            closeBtn: true,
            content:'<div class="cell-row">' +
            '<img src="http://img.idongpin.com/'+brand.image+'" style="width: 100%;height: 100%;margin: 0 auto;display: block">' +
            '</div>',
            okText:'我知道了'
        });
    }

    setPageNum(page){
        this.state.page = page.page;
        this.getBrandHouseList();
    }

    render() {
        return (
            <div className="brand-house">
                {this.createFilter()}
                {this.createTable()}
                <Paging key={this.state.currentStatus + 1}   maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />
            </div>

        );
    }
}

export default BrandHouse;