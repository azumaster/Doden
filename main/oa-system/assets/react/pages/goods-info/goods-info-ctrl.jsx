/*
* 商品详情控制页面;
*
* props参数说明：
* closePanel: fn   //关闭商品信息的弹窗;
* goodsId:         //当前查看的这个商品的ID;
* getGoodsList:    //如果修改了商品信息之后重新获取商品列表;
* area:            //片区ID,商品信息用的获取分类会用到;
* */
import React from 'react';
import GoodsInfo from './goods-info.jsx';
import GoodsLogs from './goods_logs.jsx';
import GoodsPrice from './goods_price.jsx';

class GoodsInfoCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            panelStatus: '0'    //0商品信息，1商品处理日志，2商品历史价格的页面状态;
        };
        this.createPanel = this.createPanel.bind(this);
    }

    setPanelStatus(e) {
        let status = e.target.dataset.index;
        if(status) {
            this.setState({panelStatus: status});
        }
    }

    createPanel() {
        let XML = '';
        switch (this.state.panelStatus) {
            case '0':    //商品信息;
                XML = (<GoodsInfo goodsId={this.props.goodsId} area={this.props.areaId} closePanel={this.props.closePanel} getGoodsList={this.props.getGoodsList} />);
                break;
            case '1':    //商品处理日志;
                XML = (<GoodsLogs goodsID={this.props.goodsId} />);
                break;
            case '2':    //商品历史价格;
                XML = (<GoodsPrice goodsID={this.props.goodsId} />);
                break;
        }
        return XML;
    }

    render() {
        return (
            <div className="goods-info-ctrl">
                <div className="goods-info container-fluid">
                    <h3 className="title"><a className="goods-info-back" onClick={this.props.closePanel}>返回上一页</a> 商品信息</h3>
                    <div className="goods-info-container">
                        <div className="nav-tab clearfix" onClick={this.setPanelStatus.bind(this)}>
                            <div className={this.state.panelStatus == 0 ? 'item active' : 'item'} data-index={0}>商品信息</div>
                            <div className={this.state.panelStatus == 1 ? 'item active' : 'item'} data-index={1}>商品处理日志</div>
                            <div className={this.state.panelStatus == 2 ? 'item active' : 'item'} data-index={2}>商品历史价格</div>
                        </div>
                        {this.createPanel()}
                    </div>
                </div>
            </div>
        );
    }
}

export default GoodsInfoCtrl;