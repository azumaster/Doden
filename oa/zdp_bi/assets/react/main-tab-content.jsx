//首页;
import Home from  './pages/home/main.jsx';

//数据统计-销售数据
import SellData from './pages/bi/sell/statistics-sell.jsx';

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
                        } else if(url.indexOf('sell-data')!=-1){
                            //数据统计-销售数据
                            panelContent = <SellData />;
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