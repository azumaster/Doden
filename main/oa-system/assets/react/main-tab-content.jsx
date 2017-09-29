import React from  'react';

//首页;
import Home from  './pages/home/main.jsx';

//系统设置-账户管理;
import AccountManagement from './pages/account-management/account_ctrl.jsx';

//系统设置-部门管理;
import DepartmentManagement from './pages/department-management/department_ctrl.jsx';

//商贸系统-商贸公司;
import TradeCompany from './pages/trade-company/trade_ctrl.jsx';

//运营管理-每日推文;
import DailyTweets from './pages/daily-tweets/tweets_ctrl.jsx';

//系统设置-每日推文设置;
import  SetDailyTweets from './pages/set-daily-tweets/set_daily_tweets.jsx';

//运营管理-访问日志;
import AccessLog from './pages/access-log/access_log.jsx';

//商品管理-分类管理;
import GoodsClass from './pages/goods-class-management/goods-class.jsx';

//商品管理-品牌管理;
import BrandManagement from './pages/brand-management/brand_management.jsx';

//商品管理-普通商品;
import GeneralGoods from './pages/general-goods/general_goods_ctrl.jsx';

//商品管理-商品转移;
import GoodsTransfer from './pages/goods-transfer/goods-transfer.jsx';

//商品管理-商品审核;
import GoodsAudit from './pages/goods-audit/goods-audit-ctrl.jsx';

//搜索管理-搜索权限的配置;
import AccessConfig from './pages/access-config/access-config.jsx';

//搜索管理-关键词;
import GoodsKeyWords from './pages/goods-key-words/goods-key-words.jsx';

//搜索管理-更新索引;
import UpdateIndex from './pages/updata-index/updateIndex.jsx';

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
import FreightConfig from './pages/logistic/freight-config/freight-config.jsx';

//系统设置-版本管理
import Version from './pages/version/Version.jsx';

//首页管理
import HomeManagement from './pages/home-management/home_management.jsx';

// 服务商管理
import ServiceManagement from './pages/service-provider/serviceManagement.jsx';

// 服务商统计
import ServiceStatistics from './pages/service-statistics/service-statistics.jsx';
//排行榜
import Rank from './pages/rank/rank.jsx';
//数据统计-销售数据
import SellData from './pages/bi/sell/statistics-sell.jsx';

// 数据统计-咨询数据
import ConsultData from './pages/bi/consult/statistics-consult.jsx';

// 数据统计-基础数据
//import BaseData from './pages/bi/base/statistics-base.jsx';

// 数据统计-浏览数据
//import BrowseData from './pages/bi/browse/statistics-browse.jsx';

// 数据统计-价格数据
//import PriceData from './pages/bi/price/statistics-price.jsx';

//权限管理(只有root用户还会有);
import PrivilegeManagement from  './pages/privilege-management/privilege_ctrl.jsx';
//import Refund from  './pages/refund/home.jsx';

// 省市管理
import Province from './pages/system/province.jsx';

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
                        } else if (url.indexOf('trade-company') != -1) {
                            //商贸系统-商贸公司
                            panelContent = <TradeCompany currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('account-management') != -1 ) {
                            //系统设置-账户管理
                            panelContent = <AccountManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if (url.indexOf('department-management') != -1 ) {
                            //系统设置-部门管理
                            panelContent = <DepartmentManagement currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if(url.indexOf('set-daily-tweets') !=-1 ){
                            //系统设置-推文设置
                            panelContent = <SetDailyTweets />;
                        } else if (url.indexOf('daily-tweets') != -1 ) {
                            //运营管理-每日推文
                            panelContent = <DailyTweets currentTabData={el} userNavigate={this.props.userNavigate.execute_privilege} />;
                        } else if(url.indexOf('access-log') != -1 ) {
                            //运营管理-访问日志
                            panelContent = <AccessLog />;
                        } else if(url.indexOf('goods-class') != -1) {
                            //商品管理-商品分类
                            panelContent = <GoodsClass />;
                        } else if(url.indexOf('goods-brand') != -1){
                            //商品管理-品牌管理
                            panelContent = <BrandManagement />;
                        } else if(url.indexOf('ordinary-goods') != -1){
                            //商品管理-普通商品
                            panelContent = <GeneralGoods />;
                        } else if(url.indexOf('goods-transfer') != -1){
                            //商品管理-商品转移
                            panelContent = <GoodsTransfer />;
                        } else if(url.indexOf('goods-audit') != -1) {
                            //商品管理-商品审核
                            panelContent = <GoodsAudit />;
                        } else if(url.indexOf('activity-goods') != -1) {
                            //商品管理-活动商品
                        } else if(url.indexOf('search-boost') != -1) {
                            //搜索管理-搜索权限配置
                            panelContent = <AccessConfig />;
                        } else if(url.indexOf('search-dict') != -1) {
                            //搜索管理-词库管理
                            panelContent = <GoodsKeyWords />;
                        } else if(url.indexOf('update-index') != -1) {
                            //搜索管理-更新索引
                            panelContent = <UpdateIndex />;
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
                        } else if(url.indexOf('version') != -1) {
                            // 系统设置-版本管理
                            panelContent = <Version />;
                        }else if(url.indexOf('home-management') != -1) {
                            panelContent = <HomeManagement />;
                        } else if(url.indexOf('sell-data')!=-1){
                            //数据统计-销售数据
                            panelContent = <SellData />;
                        } else if(url.indexOf('rank')!=-1){
                            //运营管理-排行榜
                            panelContent = <Rank />;
                        }
                        else if(url.indexOf('consult-data')!=-1){
                            // 数据统计-咨询数据
                            panelContent = <ConsultData/>;
                        }/* else if(url.indexOf('base-data')!=-1){
                            // 数据统计-基础数据
                            panelContent = <BaseData/>;
                        } else if(url.indexOf('browse-data')!=-1){
                            // 数据统计-浏览数据
                            panelContent = <BrowseData/>;
                        } else if(url.indexOf('price-data')!=-1){
                            // 数据统计-价格数据
                            panelContent = <PriceData/>;
                        }*/ else if(url.indexOf('logistic-freight-config') != -1){
                            panelContent = <FreightConfig />;
                        }else if(url.indexOf('service-provider') != -1) {
                            panelContent = <ServiceManagement/>;
                        }else if(url.indexOf('service-statistics') != -1) {
                            //服务商管理- 服务商统计
                            panelContent = <ServiceStatistics />;
                        } else if(url.indexOf('province') != -1){
                            panelContent = <Province />;
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