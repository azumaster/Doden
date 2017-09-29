
/**
 * 物流区域的设置
 * @author: 魏华东
 * @date: 2016/12/12
 */

import React from 'react';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';

class LogisticArea extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentArea: 0,                         // 当前的区域index
            areaList: [],                           // 区域的数组
            streetList:[],                          // 区街道的数组
            total: 0,           // 区街道的总数
            page: 1,     // 当前页数
            lastPage:1,         // 总页数
            size: 30,           // 每一页的长度
            count: 0            // 页码刷新

        };
        this.getData = this.getData.bind(this);
        this.operate = this.operate.bind(this);

    }

    /**
     * 暂时只获取成都市的全部区域信息
     * 后期可根据需要获取省、市等地理位置信息
     */
    componentWillMount() {
        this.getData();
    }

    // 获取数据
    getData() {
        new Promise((resolve)=>{
            H.server.get_all_area({id: 510100}, (res) => {
                if(res.code == 0){
                    this.setState({
                        areaList:res.data.children
                    }, ()=>{resolve(res);});
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
            let id = this.getAreaId();

            H.server.get_logistic_street({id: id, page: this.state.page, size: this.state.size}, (res) => {
                if(res.code == 0) {
                    this.setState({
                        streetList: res.data.streets,
                        total: res.data.total,
                        page: res.data.page,
                        lastPage: res.data.last_page
                    });
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    //创建区域选择栏
    createArea() {
        let areaNames = [],
            areaData = [];

        areaNames.push('全部');
        areaData.push(0);
        this.state.areaList.map((area, index) => {
            areaNames.push(area.name+'('+((index+1)<10?'0'+(index+1):(index+1))+')');
            areaData.push(index+1);
        });

        return (
            <form className="form-inline col-lg-12">
                <div className="filter-row">
                    <BtnGroup btnNames={areaNames} bindData={areaData} clickCallback={this.toggleArea.bind(this)}
                              style="btn btn-xs" activeStyle="btn btn-xs btn-default" status={this.state.currentArea}/>
                </div>
            </form>
        );
    }

    // 切换区域
    toggleArea(e) {
        let index = e.target.dataset.index;

        if(index === this.state.currentArea) {
            return;
        }

        this.setState({
            page: 1,
            currentArea: index
        }, this.getData);
    }

    //创建表格显示区街道的信息
    createTable() {
        let headlines = ['提货码前缀', '街道名/乡镇', '区县', '用户数', '状态', '操作'],
            order = ['code', 'name', 'district', 'user_num', 'status', 'operate'],
            status = {4:{0: '未开通', 1: '已开通'}},
            statusOperate = {},
            fn = {5: this.operate};

        this.state.streetList.map((street, index) => {
            street.code = H.getLadingCode(street.code, [2, 3]);
            street.operate = index;

           if(street.status == 1) statusOperate[index] = ['暂停'];
           else statusOperate[index] = ['开通'];
        });

        return(
            <Table values={this.state.streetList} headlines={headlines} order={order} bodyOperate={fn} id={'logisticArea'}
                   statusOperate={statusOperate} status={status} />
        );
    }

    // 表格的相关操作
    operate(e) {
        let html = $(e.target).html(),
            index = e.target.dataset.reactid.split('$')[2].split('.')[0],
            streetName = this.state.streetList[index].name,
            areaName = this.state.streetList[index].district,
            id = this.state.streetList[index].id,
            status = this.state.streetList[index].status,
            content = '',
            okText = '',
            noticeText = '';

        switch (html){
            case '暂停':
                status= 0;
                content = '确认暂停'+areaName+streetName+'的配送？';
                okText =  '确认暂停';
                noticeText = '已暂停'+areaName+streetName+'的配送';
                break;
            case '开通':
                status = 1;
                content = '确认开通'+areaName+streetName+'的配送？';
                okText = '确认开通';
                noticeText = '已开通'+areaName+streetName+'的配送了';
                break;
        }

        H.Modal({
            content: content,
            okText: okText,
            cancel: true,
            okCallback: () => {
                H.server.change_street_state({id:id, status:status}, (res) => {
                    if(res.code == 0){
                        H.Modal(noticeText);
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

    // 设置页数
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getData);
    }

    // 获取区域id
    getAreaId() {
        if(this.state.currentArea == 0) return 510100;
        else {
            if(this.state.areaList[this.state.currentArea-1]) return this.state.areaList[this.state.currentArea-1].id;
            else return 510100;
        }
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        {this.createArea()}
                    </div>
                    <div className="col-lg-12">
                        <div className="row">
                            <p className="col-lg-6">当前结果：{this.state.total}个街道</p>
                            <a href="javascript:;" className="col-lg-6 text-right" onClick={this.getData.bind(this)}>刷新</a>
                        </div>
                        {this.createTable()}
                        <Paging maxPage={this.state.lastPage} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogisticArea;