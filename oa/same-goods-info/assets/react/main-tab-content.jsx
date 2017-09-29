//首页;
import Home from  './pages/home/main.jsx';

//商品管理-分类管理;
import GoodsClass from './pages/goods/goods-class-management/goods-class.jsx';

//商品管理-品牌管理;
import BrandManagement from './pages/goods/brand-management/brand_management.jsx';

//商品管理-普通商品;
import GeneralGoods from './pages/goods/general-goods/general_goods_ctrl.jsx';

//商品管理-商品转移;
import GoodsTransfer from './pages/goods/goods-transfer/goods-transfer.jsx';

//商品管理-商品审核;
import GoodsAudit from './pages/goods/goods-audit/goods-audit-ctrl.jsx';

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
                        } else if(url.indexOf('same-goods-info-class') != -1) {
                            //商品管理-商品分类
                            panelContent = <GoodsClass />;
                        } else if(url.indexOf('same-goods-info-brand') != -1){
                            //商品管理-品牌管理
                            panelContent = <BrandManagement />;
                        } else if(url.indexOf('ordinary-same-goods-info') != -1){
                            //商品管理-普通商品
                            panelContent = <GeneralGoods />;
                        } else if(url.indexOf('same-goods-info-transfer') != -1){
                            //商品管理-商品转移
                            panelContent = <GoodsTransfer />;
                        } else if(url.indexOf('same-goods-info-audit') != -1) {
                            //商品管理-商品审核
                            panelContent = <GoodsAudit />;
                        } else if(url.indexOf('activity-same-goods-info') != -1) {
                            //商品管理-活动商品
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