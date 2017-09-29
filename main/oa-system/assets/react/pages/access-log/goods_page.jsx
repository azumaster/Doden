/*
* 商品统计页面
* */
import React from 'react';
import Table from '../../../components/table/tables.js';
import Paging from '../../../components/page/paging.js';

class GoodsPage extends React.Component{

    constructor(){
        super();
        this.state = {
            infoPanel: {
                isShow: false,
                infoPanelTitle: ''
            },
            goodsDetail: '',
            pageNo: 1
        };
    }

    static defaultProps = {
        shopType:{
            11: '一批',
            12: '其他',
            21: '二批',
            22: '其他',
            23: '其他',
            24: '终端',
            25: '其他',
            26: '其他',
            31: '其他',
            100: '其他',
            0: '未注册'
        }
    }

    //创建数据行
    createRow(data, index){
        return(
            <tr key={index}>
                <td>{data.goods_id}</td>
                <td>{data.goods_name}</td>
                <td>{data.supplier}</td>
                <td>{data.viewed_person}<a href="javascript:;" onClick={this.handleInfoPanel.bind(this, data.goods_id, data.goods_name)} style={{color: 'blue'}}>明细</a></td>
                <td>{data.viewed_times}</td>
                <td>{data.share_times}</td>
                <td>{data.start_time}</td>
                <td>{data.stop_time}</td>
            </tr>
        );
    }

    setParentPageNum(page){
        this.props.setPageNum(page);
    }

    createTable(){
        let tableTile = ['商品ID', '商品名', '供应商', '浏览人数', '浏览次数', '分享次数', '时间起', '时间止'];
        let rows = [];
        let total = this.props.result.total;
        console.log(total);
        this.props.result.detail.map((data, index) => {
            rows.push(this.createRow(data, index));
        });
        return(
            <div>
                <Table titles={tableTile}>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                <Paging key={this.props.currentPage} maxPage={total%20 == 0 ? total/20 : parseInt(total/20+1)} clickCallback={this.setParentPageNum.bind(this)} />
            </div>
        );
    }

    /*
    弹出面板
    */
    //弹出项
    createPanelItem(goods, index){
        return(
            <tr className="item" key={index}>
                <td>{goods.user_id}</td>
                <td>{goods.shop_name}</td>
                <td>{goods.phone_number}</td>
                <td>{goods.wechat_name}</td>
                <td>{this.props.shopType[goods.shop_type]}</td>
                <td>{goods.viewed_times}</td>
                <td>{goods.share_times}</td>
                <td>{goods.start_time}</td>
                <td>{goods.stop_time}</td>
            </tr>
        );
    }

    //获得商品详情数据
    getGoodsDetailData(goodsId){
        let para = {
            goods_id: goodsId,
            query_time: this.props.para.query_time,
            end_time: this.props.para.end_time,
            orderby: this.props.para.orderby,
            page: this.state.pageNo,
            size: this.props.para.size
        };
        H.server.statistic_goodsSpecific_detail(para, (res) => {
            if(res.code == 0){
                this.setState({
                    goodsDetail: res.data
                });
            }
        });
    }

    //处理弹出面板的显示
    handleInfoPanel(goodsId, goodsName){
        let bool = this.state.infoPanel.isShow; //是否显示
        if(!bool){
           this.getGoodsDetailData(goodsId);
        }
        this.setState({
            infoPanel:{
                isShow: !bool,
                infoPanelTitle: goodsName
            },
            pageNo: 1
        });
    }

    setPageNum(page){
        this.setState({
            pageNo: page.page
        }, this.getGoodsDetailData);
    }

    //弹出面板
    infoPanel(){
        if(!this.state.goodsDetail) return null;
        let items = [];
        let total = this.state.goodsDetail.total;
        this.state.goodsDetail.detail.map((goods, index) => {
            items.push(this.createPanelItem(goods, index));
        });
        return(
            <div className={ this.state.infoPanel.isShow ? 'section-tr-info show' : 'section-tr-info' }>
                <i className="info-close-btn" title="点击隐藏弹出层" onClick={this.handleInfoPanel.bind(this)}>close</i>
                <div className="info-w">
                    <h3 className="info-title">
                        {this.state.infoPanel.infoPanelTitle}
                    </h3>
                    <div className="info-main-w">
                        <div className="infoPanel-form">
                            <table className="table table-bordered table-hover table-responsive">
                                <thead>
                                <tr>
                                    <th>用户ID</th>
                                    <th>店铺名</th>
                                    <th>手机号</th>
                                    <th>微信名</th>
                                    <th>类型</th>
                                    <th>浏览次数</th>
                                    <th>主动分享次数</th>
                                    <th>时间起</th>
                                    <th>时间止</th>
                                </tr>
                                </thead>

                                <tbody>
                                    {this.state.goodsDetail ? items : null}
                                </tbody>
                            </table>
                            <Paging maxPage={total%20 == 0 ? total/20 : total/20+1} clickCallback={this.setPageNum.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div>
                <h4>当前结果：共{this.props.aboveTableResult.total_goods}件商品，
                    总浏览人数：{this.props.aboveTableResult.total_person}人，
                    总浏览次数：{this.props.aboveTableResult.total_view}，
                    总分享次数：{this.props.aboveTableResult.total_share}
                </h4>

                {this.createTable()}

                {this.infoPanel()}
            </div>
        );
    }
}
export default GoodsPage;