//首页;
import Home from  './pages/home/main.jsx';

//商贸系统-商贸公司;
import TradeCompany from './pages/trade-company/trade_ctrl.jsx';

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
                        } else if (url.indexOf('trade-company') != -1) {
                            //商贸系统-商贸公司
                            panelContent = <TradeCompany currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
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