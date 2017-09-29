//首页;
import Home from  './pages/home/main.jsx';

//运营管理-每日推送
import DailyTweets from './pages/operate/daily-tweets/tweets_ctrl.jsx';

//运营管理-访问日志
import AccessLog from './pages/operate/access-log/access_log.jsx';

//运营管理-首页管理
import HomeManagement from './pages/operate/home-management/home_management.jsx';

//运营管理-服务商管理
import ServiceManagement from './pages/operate/service-provider/serviceManagement.jsx';

//运营管理-服务商统计
import ServiceStatistics from './pages/operate/service-statistics/service-statistics.jsx';

//运营管理-服务商排行榜
import Rank from './pages/operate/rank/rank.jsx';

import SPCustomer from './pages/operate/service-customer/sp_customers_order.jsx';

class TabContentControl extends React.Component {
    render(){
        //console.log(this.props.tabMenuArr);
        return (
            <div className="tab-content" id="tab-content">
                {

                    this.props.tabMenuArr.map((el, index) => {
                        let tid = 'tid_' + el.parentId + '_' + el.id,
                            isActive = el.selected ? 'tab-pane active' : 'tab-pane';
                        let url = el.url,
                            panelContent = null;
                        if (el.id == 0 && el.parentId == 0) {
                            //首页;
                            panelContent = <Home userInfo={this.props.userInfo} />;
                        }if (url.indexOf('daily-tweets') != -1 ) {
                            //运营管理-每日推文
                            panelContent = <DailyTweets currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if(url.indexOf('access-log') != -1 ) {
                            //运营管理-访问日志
                            panelContent = <AccessLog />;
                        } else if(url.indexOf('home-management') != -1) {
                            //运营管理-首页管理
                            panelContent = <HomeManagement />;
                        } else if(url.indexOf('rank')!=-1){
                            //运营管理-服务商排行榜
                            panelContent = <Rank />;
                        } else if(url.indexOf('service-provider') != -1) {
                            //运营管理-服务商管理
                            panelContent = <ServiceManagement/>;
                        }else if(url.indexOf('service-statistics') != -1) {
                            //运营管理-服务商统计
                            panelContent = <ServiceStatistics />;
                        }else if(url.indexOf('sp-customer-order') != -1){
                            panelContent = <SPCustomer/>;
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