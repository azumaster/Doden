//首页;
import Home from  './pages/home/main.jsx';

//物流管理-物流区域配置;
import LogisticArea from './pages/logistic/logistic-area/logistic-area.jsx';

//物流管理-运力管理;
import CapacityInfo from './pages/logistic/capacity-info/capacity-info.jsx';

//物流管理-司机信息;
import DriverInfo from './pages/logistic/driver-info/driverInfo.jsx';

//物流管理-运单管理（全部运单页）;
import WaybillInfo from './pages/logistic/waybill-info/waybill-info.jsx';

//物流管理-运单实时状态
import WaybillRealTime from './pages/logistic/waybill-info/waybill-real-time.jsx';

//物流管理-客户管理
import CustomerManagement from './pages/logistic/customer-management/customer-management.jsx';

// 物流管理-运费管理
import Freight from './pages/logistic/freight/freight.jsx';

// 物流管理-打印机配置
import Printer from './pages/printer/printer.jsx';

// 物流管理-运费配置;
//import FreightConfig from './pages/logistic/freight-config/freight-config.jsx';

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
                        if (el.id == 0 && el.parentId == 0) {
                            //首页;
                            panelContent = <Home userInfo={this.props.userInfo} />;
                        } else if(url.indexOf('logistic-area') != -1) {
                            // 物流管理-物流区域配置
                            panelContent = <LogisticArea />;
                        } else if(url.indexOf('logistic-capacity-info') != -1) {
                            // 物流管理-运力管理
                            panelContent = <CapacityInfo />;
                        } else if(url.indexOf('logistic-driver-info') != -1) {
                            // 物流管理-司机信息
                            panelContent = <DriverInfo />;
                        } else if(url.indexOf('logistic-waybill-info') != -1) {
                            // 物流管理-运单管理
                            panelContent = <WaybillInfo />;
                        } else if(url.indexOf('logistic-waybill-real-time') != -1) {
                            // 物流管理-运单实时状态
                            panelContent = <WaybillRealTime />;
                        } else if(url.indexOf('logistic-customer-management') != -1) {
                            // 物流管理-客户管理
                            panelContent = <CustomerManagement />;
                        } else if(url.indexOf('logistic-freight-management') != -1){
                            // 物流管理-运费管理
                            panelContent = <Freight />;
                        } else if(url.indexOf('logistic-printer-config')!= -1){
                            // 物流管理-打印机配置
                            panelContent = <Printer />;
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