//首页;
import Home from  './pages/home/main.jsx';

////搜索管理-搜索权限的配置;
import AccessConfig from './pages/search/access-config/access-config.jsx';
//
////搜索管理-关键词;
import GoodsKeyWords from './pages/search/goods-key-words/goods-key-words.jsx';
//
////搜索管理-更新索引;
import UpdateIndex from './pages/search/updata-index/updateIndex.jsx';

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
                        } else if(url.indexOf('search-boost') != -1) {
                            //搜索管理-搜索权限配置
                            panelContent = <AccessConfig />;
                        } else if(url.indexOf('search-dict') != -1) {
                            //搜索管理-词库管理
                            panelContent = <GoodsKeyWords />;
                        } else if(url.indexOf('update-index') != -1) {
                            //搜索管理-更新索引
                            panelContent = <UpdateIndex />;
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