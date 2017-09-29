//首页;
import Home from  './pages/home/main.jsx';

//运营管理-服务商管理
import ServiceManagement from './pages/sp/service-provider/serviceManagement.jsx';

//运营管理-服务商统计
import ServiceStatistics from './pages/sp/service-statistics/service-statistics.jsx';

//运营管理-服务商排行榜
import Rank from './pages/sp/rank/rank.jsx';

class TabContentControl extends React.Component {
    render(){
        console.log(this.props.tabMenuArr);
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
                        }
                        console.log(url);
                        if(url.indexOf('rank')!=-1){
                            //运营管理-服务商排行榜
                            panelContent = <Rank />;
                        } else if(url.indexOf('service-provider') != -1) {
                            //运营管理-服务商管理
                            panelContent = <ServiceManagement/>;
                        }else if(url.indexOf('service-statistics') != -1) {
                            //运营管理-服务商统计
                            panelContent = <ServiceStatistics />;
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