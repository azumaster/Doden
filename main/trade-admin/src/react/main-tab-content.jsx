import React from  'react';

//首页;
import Home from  './pages/home/main.jsx';

//系统设置-账户管理;
import AccountManagement from './pages/account_management/account_ctrl.jsx';

//系统设置-部门管理;
import DepartmentManagement from './pages/department_management/department_ctrl.jsx';

//订单管理-转接订单;
import TransferOrderManagement from './pages/order_management/transfer-order/transfer-order-ctrl.jsx';


//import DepositMain from  './pages/deposit/home.jsx';
//import WithDrawMain from  './pages/withdraw/home.jsx';
//import MoneyCheck from  './pages/moneycheck/home.jsx';

//权限管理(只有root用户还会有);
import PrivilegeManagement from  './pages/privilege_management/privilege_ctrl.jsx';
//import Refund from  './pages/refund/home.jsx';

class TabContentControl extends React.Component {
    render(){
        return (
            <div className="tab-content" id="tab-content">
                {

                    this.props.tabMenuArr.map((el, index) => {
                        let tid = 'tid_' + el.parentId + '_' + el.id,
                            isActive = el.selected ? 'tab-pane active' : 'tab-pane';
                        let url = el.url,
                            panelContent = null;
                        if (el.id == -1 && el.parentId == -1) {
                            //个人信息设置;
                            panelContent = <PrivilegeManagement />;
                        } else if (el.id == 0 && el.parentId == 0) {
                            //首页;
                            panelContent = <Home userInfo={this.props.userInfo} />;
                        } else if (url.indexOf('transfer-order') != -1) {
                            //订单管理-转接订单
                            panelContent = <TransferOrderManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('account-management') != -1 ) {
                            //系统设置-账户管理
                            //console.log('系统设置-账户管理');
                            panelContent = <AccountManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('department-management') != -1 ) {
                            //系统设置-部门管理
                            //console.log('系统设置-部门管理');
                            panelContent = <DepartmentManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('messageManagement') != -1 ) {
                            //panelContent = <MessControl currentTabData={el}/>;
                        } else if (url.indexOf('refund/list') != -1 ) {
                            //panelContent = <Refund currentTabData={el}/>;
                        }
                        return (
                            <div key={index} className={isActive} id={tid}>
                                {panelContent}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default TabContentControl;