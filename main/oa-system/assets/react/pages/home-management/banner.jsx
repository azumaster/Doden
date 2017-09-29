
import React from 'react';
import Table from './../../../components/table.jsx';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import AddBanner from './add_banner.jsx';
import Paging from '../../../components/page/paging.js';

class Banner extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            areaList:[],        // 地区列表
            bannerList:[],      // bannerList
            currentArea:0,      // 当前地区
            currentStatus:2,    // 当前状态
            page:1,
            size:20,
            total:0
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
            this.getBannerList();
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

    getBannerList() {

        let param = {
            area_id: this.state.currentArea,
            status: this.state.currentStatus,
            page: this.state.page,
            size: this.state.size};

        if($('#ba-online').val()){
            param.put_on_at = $('#ba-online').val().split('T').join(' ')+':00';
        }

        if($('#ba-offline').val()){
            param.pull_off_at = $('#ba-offline').val().split('T').join(' ')+':00';
        }

        H.server.indexManage_banner_list(param, (res)=>{
            if(res.code == 0){
                this.setState({
                    bannerList: res.data.banner_lists,
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
        let bannerArea = [];
        this.state.areaList.map((area, index)=>{
            bannerArea.push(<option key={index} className="form-control" value={area.area_id}>{area.area_name}</option>);
        });

        return (
            <form className="form-inline col-lg-12">
                <div className="section-filter" style={{marginBottom:'10px', overflow:'hidden'}}>
                    <div className="filter-row">
                        <a href="javascript:;" className="btn btn-lg btn-default" onClick={this.add.bind(this)}>新增Banner</a>
                    </div>
                    <div className="filter-row">
                        <label className="control-label">地区
                            <select id="select-brand-area" className="form-control" style={{marginLeft: '20px'}}
                                    onChange={this.toggleArea.bind(this)}>{bannerArea}</select></label>
                    </div>
                    <div className="filter-row">
                        <label className="control-label">上架时间上限
                            <input id="ba-online" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
                        <label className="control-label">上架时间下限
                            <input id="ba-offline" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
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
        let panel = <AddBanner closePanel={this.closePanel.bind(this)}/>;
        this.props.togglePanel && this.props.togglePanel(panel);
    }

    closePanel() {
        this.getBannerList();
        this.props.togglePanel && this.props.togglePanel(null);
    }

    select() {
        this.getBannerList();
    }

    toggleStatus(e) {
        let status = e.target.dataset.index;

        if(status === this.state.currentStatus) {
            return;
        }

        this.setState({
            currentStatus: status
        }, this.getBannerList);
    }

    toggleArea(e){
        let areaId = e.target.value;

        this.setState({
            currentArea: areaId,
            currentStatus: 2
        }, ()=>{
            this.getBannerList();
        });
    }

    createTable() {
        let headlines = ['序号', '标题', '位置', '上架时间', '下架时间', '点击量', '操作'],
            order = ['order', 'banner_title', 'position', 'put_on_at', 'pull_off_at', 'pv', 'status'],
            statusOperate = {
                1: ['下架', '下移', '上移', '查看图片'],
                2: ['下架', '下移', '上移', '查看图片'],
                3: ['查看图片']
            },
            fn = {
                6: this.tableOperate
            };

        this.state.bannerList.map((banner, index)=>{
            banner.order = index + 1;
        });
        return(
            <Table key={this.state.currentStatus} id="brand_house" values={this.state.bannerList} headlines={headlines}
                   status={status} statusOperate={statusOperate} order={order} bodyOperate={fn}/>
        );
    }

    tableOperate(e) {
        let operate = $(e.target).html(),
            index = parseInt(e.target.dataset.reactid.split('$')[4].split('.')[0]),
            banner = this.state.bannerList[index],
            bannerUp = index==0?null:this.state.bannerList[index-1],
            bannerDown = index==(this.state.bannerList.length-1)?null:this.state.bannerList[index+1];

        switch (operate) {
            case '下架':
                this.soldOut(banner);
                break;
            case '上移':
                this.move(banner, bannerUp);
                break;
            case '下移':
                this.move(bannerDown, banner);
                break;
            case '查看图片':
                this.showImg(banner);
                break;
        }
    }

    move(up, down){
        if(up == null || down == null){
            H.Modal('你不能这样操作 @_@');
            return;
        }

        let upId = up.banner_id,
            downId = down.banner_id;

        H.server.indexManage_banner_position({up_id: upId, down_id: downId}, (res)=>{
            if(res.code == 0){
                this.getBannerList();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 下架
    soldOut(banner){
        H.Modal({
            content:'是否要下架Banner【'+banner.banner_title+'】？',
            okText:'下架',
            cancel:true,
            okCallback: ()=>{
                H.server.indexManage_update_banner({banner_id: banner.banner_id, status: 3}, (res)=>{
                    if(res.code == 0){
                        this.getBannerList();
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
    showImg(banner){
        H.Modal({
            title:'查看图片',
            width:600,
            content:'<div class="cell-row">' +
            '<img src="http://img.idongpin.com/'+banner.cover_pic+'" style="width: 100%;height: 100%;margin: 0 auto;display: block">' +
            '</div>',
            okText:'我知道了',
            closeBtn: true
        });
    }

    setPageNum(page){
        this.state.page = page.page;
        this.getBannerList();
    }

    render() {
        return (<div className="banner">
            {this.createFilter()}
            {this.createTable()}
            <Paging key={this.state.currentStatus + 1}   maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />
        </div>);
    }
}

export default Banner;