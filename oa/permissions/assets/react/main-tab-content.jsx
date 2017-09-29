//首页;
import Home from  './pages/home/main.jsx';

//系统设置-账户管理;
import AccountManagement from './pages/account-management/account_ctrl.jsx';

//系统设置-部门管理;
import DepartmentManagement from './pages/department-management/department_ctrl.jsx';

////系统设置-每日推文设置;
import  SetDailyTweets from './pages/set-daily-tweets/set_daily_tweets.jsx';

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
                        if (url.indexOf('account-management') != -1 ) {
                            //系统设置-账户管理
                            panelContent = <AccountManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('department-management') != -1 ) {
                            //系统设置-部门管理
                            panelContent = <DepartmentManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if(url.indexOf('set-daily-tweets') !=-1 ){
                            //系统设置-推文设置
                            panelContent = <SetDailyTweets />;
                        } else if (el.id == 0 && el.parentId == 0) {
                            //首页;
                            panelContent = <Home userInfo={this.props.userInfo} />;
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