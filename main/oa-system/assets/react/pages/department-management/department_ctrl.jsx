/*
* 部门管理*/
import React from 'react';
import Refresh from '../../../components/refresh/refresh.js';
import PageCtrlBar from '../../../components/page/paging.js';

class DepartmentManagementCtrl extends React.Component {
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
            departmentStatus: 1,  //判断添加还是修改部门的状态,添加为1，修改为2
            defaultParam: {  //获取列表提交的参数;
                page: 1,
                size: 40
            },
            infoItem: {  //当前被操作的用户信息;
                department_id: 1,
                department_name: ''
            }
        };
        this.getDataList = this.getDataList.bind(this);
        this.hideInfoPanel = this.hideInfoPanel.bind(this);
        this.changePage = this.changePage.bind(this);
        this.commitDepartmentInfo = this.commitDepartmentInfo.bind(this);
        this.refresh = this.refresh.bind(this);
        this.isHavePrivilege = this.isHavePrivilege.bind(this);
    }

    componentDidMount() {
        this.getDataList();

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

        //获取部门列表;
        server.department_list(param, (res) => {
            if(res.code == 0) {
                this.setState({
                    data: res.data.departments,
                    totalPage: Math.ceil(res.data.total/param.size)
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //点击创建部门按钮;
    createDepartment() {
        this.setState({
            infoItem: {
                department_id: 1,
                department_name: ''
            },
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: '创建部门'},
            departmentStatus: 1
        });
    }

    //点击修改部门;
    modifyDepartment(val) {
        this.setState({
            infoPanel: {infoPanelIsShow: true, infoPanelTitle: '修改' + val.name},
            departmentStatus: 2,
            infoItem: {
                department_id: val.id,
                department_name: val.name
            }
        });
    }

    //修改部门和添加部分时输入框触发change事件时;
    departmentChange(e) {
        let info = this.state.infoItem;
        info.department_name = e.target.value;
        this.setState({infoItem: info});
    }

    //创建部门和修改部门的提交接口;
    commitDepartmentInfo() {
        let server = H.server;
        if(this.state.infoItem.department_name == '' || this.state.infoItem.department_name == null) {
            H.Modal('使用者姓名必须填写');
            return;
        }
        if(this.state.departmentStatus == 1) {
            server.department_add({department_name: this.state.infoItem.department_name}, (res) => {
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
            let info = this.state.infoItem,
                data = this.state.data,
                currentDepartmentIndex = 0;
            for(var i = 0 ; i < data.length ; i++) {
                if(data[i].id == info.department_id) {
                    if(data[i].name == info.department_name) {
                        $('#department_name')[0].focus();
                        return;
                    }
                    currentDepartmentIndex = i;
                    break;
                }
            }
            server.department_info_update(this.state.infoItem, (res) => {
                if(res.code == 0) {
                    H.Modal(res.message);
                    data[currentDepartmentIndex].name = info.department_name;
                    this.setState({data: data});
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }
    }

    //删除部门;
    delDepartment(id) {
        let param = {
            department_id: id,
            status: 3
        };
        H.server.department_status_update(param, (res) => {
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

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.isHavePrivilege('创建') ? <btn className="btn btn-lg" onClick={this.createDepartment.bind(this)} >创建</btn> : ''}
                        </div>
                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>部门ID</th>
                                <th>部门名称</th>
                                <th>创建时间</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.data.map((value, index) => {

                                    let dom1 = '',
                                        dom2 = '',
                                        privilege = this.state.privilege;

                                    if(value.id != 1) {
                                        for (let i in privilege) {
                                            if(privilege[i].name == '修改') {
                                                dom1 = (<a onClick={this.modifyDepartment.bind(this, value)}>修改</a>);
                                            }else if(privilege[i].name == '删除') {
                                                dom2 = (<a onClick={this.delDepartment.bind(this, value.id)}>删除</a>);
                                            }
                                        }
                                    }

                                    return (
                                        <tr key={index}>
                                            <td>{value.id}</td>
                                            <td>{value.name}</td>
                                            <td>{value.create_time}</td>
                                            <td>{dom1}{dom2}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                    <PageCtrlBar pageNum={this.state.defaultParam.page}  maxPage={this.state.totalPage} clickCallback={this.changePage}/>
                </div>
                <div className={ this.state.infoPanel.infoPanelIsShow ? 'section-tr-info show' : 'section-tr-info' }>
                    <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.hideInfoPanel}>close</i>
                    <div className="info-w">
                        <h3 className="info-title">
                            {this.state.infoPanel.infoPanelTitle}
                        </h3>
                        <div className="info-main-w">
                            <div className="infoPanel-form">
                                <div className="item"><label>部门名称：</label>
                                    <input type="text" id="department_name" value={this.state.infoItem.department_name} onChange={this.departmentChange.bind(this)} />
                                </div>
                                <div className="item"><label></label><input type="button" value="保存" onClick={this.commitDepartmentInfo} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DepartmentManagementCtrl;