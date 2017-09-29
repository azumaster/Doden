/**
 * 司机信息
 * @author: 魏华东
 * @date: 2016.12.13
 */

import React from 'react';
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';

class DriverInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            driverList:[],          // 司机的信息数组
            capacityList:[],        // 运力信息的列表
            status:false,           // 是否有弹窗
            page:1,                 // 当前页码
            size:30,                // 一页显示多少条
            total:50                // 司机总数
        };

        this.getData = this.getData.bind(this);
        this.operate = this.operate.bind(this);
    }

    componentWillMount() {
        this.getData();
    }

    // 获取所有的数据
    getData(){
        new Promise((resolve)=>{
            H.server.get_driver_info({page: this.state.page, size:this.state.size}, (res)=>{
                if(res.code == 0) {
                    this.setState({
                        driverList: res.data.drivers,
                        total: res.data.total,
                        page: res.data.page
                    }, ()=>{resolve(res);});
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        }).then(()=>{
                H.server.get_capacity_info({display:'simple'}, (res) => {
                    if(res.code == 0){
                        this.setState({
                            capacityList: res.data
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        );
    }

    // 添加司机信息
    addDriver() {
        H.Modal({
            title: '添加司机',
            width: 400,
            content: '<div class="row"><img src="/images/driverCode.png" class="img-responsive" style="display: block; margin: 0 auto"></div>',
            okText: '已经添加',
            okCallback: ()=>{
                this.getData();
            }
        });
    }

    // 创建表格
    createTable() {
        let headlines = ['ID', '司机姓名', '微信名', '所属公司', '常用电话号码', '车牌号', '运力名称', '状态', '操作'],
            order = ['uid', 'name', 'wx_name', 'firm', 'mobile', 'car_no', 'capacity', 'status', 'operate'],
            status = {7:{0: '已停用', 1: '正常'}},
            statusOperate = {},
            fn= {8: this.operate};

        this.state.driverList.map((driver, index) => {
            driver.operate = index;

            if(driver.status == 1){
                statusOperate[index] = ['停止配送'];
            } else if(driver.status == 0) {
                statusOperate[index] = ['开放配送'];
            }

            statusOperate[index].push('修改');
            statusOperate[index].push('删除');
        });

        return (
            <Table values={this.state.driverList} headlines={headlines} order={order} bodyOperate={fn} id={'driverInfo'}
                   statusOperate={statusOperate} status={status} />
        );
    }

    //表格的相关操作
    operate(e) {
        let html = $(e.target).html(),
            index = index = e.target.dataset.reactid.split('$')[2].split('.')[0],
            name = this.state.driverList[index].name,
            uid = this.state.driverList[index].uid,
            wxName = this.state.driverList[index].wx_name,
            firm = this.state.driverList[index].firm,
            mobile = this.state.driverList[index].mobile,
            carNo = this.state.driverList[index].car_no;

        switch (html){
            case '开放配送':
                H.Modal({
                    content:'<p>是否开放司机【'+name+'】进行配送？</p>',
                    okText:'开放配送',
                    cancel:true,
                    okCallback: () => {
                        H.server.modify_driver_state({uid:uid, status:1}, (res) => {
                            if(res.code == 0) {
                                H.Modal('您已成功开放司机【'+name+'】进行配送');
                                this.getData();
                            } else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '停止配送':
                H.Modal({
                    content:'<p>是否停止司机【'+name+'】的配送？</p>',
                    okText:'停止配送',
                    cancel:true,
                    okCallback: () => {
                        H.server.modify_driver_state({uid:uid, status: 0}, (res) => {
                            if(res.code == 0) {
                                H.Modal('您已成功停止司机【'+name+'】的配送');
                                this.getData();
                            } else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '修改':

                let options = '';
                this.state.capacityList.map((capacity) => {
                    if(capacity.name === name){
                        options += '<option selected="selected" value='+capacity.id+'>'+capacity.name+'</option>';
                    } else{
                        options += '<option value='+capacity.id+'>'+capacity.name+'</option>';
                    }
                });

                H.Modal({
                    title:'修改司机信息',
                    width:400,
                    content: '<div class="form-horizontal" role="form">' +
                    '<div class="form-group"><label class="col-lg-4 control-label">微信昵称：</label>' +
                    '<div class="col-lg-8"><p id="wechatName" class="form-control-static">'+wxName+'</p></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">司机名字：</label>' +
                    '<div class="col-lg-8"><input id="driverName" type="text" class="form-control" value='+name+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">所属公司：</label>' +
                    '<div class="col-lg-8"><input id="companyName" type="text" class="form-control" value='+firm+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">常用号码：</label>' +
                    '<div class="col-lg-8"><input id="phoneNum" type="tel" class="form-control" value='+mobile+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">车牌号：</label>' +
                    '<div class="col-lg-8"><input id="carNumber" type="text" class="form-control" value='+carNo+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">运力名称：</label>' +
                    '<div class="col-lg-8"><select id="capacityName" class="form-control">'  + options +
                    '</select></div></div></div>',
                    okText:'确认修改',
                    cancel:true,
                    okCallback: () => {
                        name = $('#driverName').val();
                        firm = $('#companyName').val();
                        mobile = $('#phoneNum').val();
                        carNo = $('#carNumber').val();
                        let vid = $('#capacityName option:selected').val();

                        // 发送请求
                        H.server.modify_driver({
                            uid: uid,
                            name: name,
                            firm: firm,
                            mobile: mobile,
                            car_no: carNo,
                            vid: vid
                        }, (res) => {
                            if(res.code == 0){
                                H.Modal('修改成功！');
                                this.getData();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '删除':
                H.Modal({
                    content:'确认删除司机【'+name+'】的信息？',
                    okText:'确认删除',
                    cancel:true,
                    okCallback: () => {
                        H.server.delete_driver({uid:uid}, (res) => {
                            if(res.code == 0) {
                                H.Modal('删除成功！');
                                this.getData();
                            } else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
        }
    }

    // 设置分页页码
    setPageNum(page) {
        this.setState({
            page: page.page
        }, this.getData);
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                <a href="javascript:;" onClick={this.addDriver.bind(this)} className="btn btn-lg btn-default pull-right">添加</a>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-12" style={{marginTop:'30px'}}>
                        <div className="row">
                            <p className="col-lg-6">当前结果：{this.state.total}个司机</p>
                            <a href="javascript:;" className="col-lg-6 text-right" onClick={this.getData.bind(this)}>刷新</a>
                        </div>
                        {this.createTable()}
                        <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default DriverInfo;