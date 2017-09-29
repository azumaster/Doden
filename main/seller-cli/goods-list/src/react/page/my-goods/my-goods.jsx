/*
* 我的商品页面*/

import Selling from './selling.jsx';
import Auditing from './auditing.jsx';
import StopSales from './stop-sales.jsx';
import IconBtnGroup from '../../components/icon-btn-group/icon_btn_group.jsx';

class MyGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auditNum: 0   //待审核商品数量;
        };
        this.getAuditingNum = this.getAuditingNum.bind(this);
    }

    getAuditingNum() {
        //获取我的商品待审核数量;
        H.server.getGoodsNum({type: 2}, (res) => {
            if(res.code == 0) {
                this.setState({auditNum: res.data.total});
            }else {
                H.operationState(res.message);
            }
        });
    }

    componentWillMount() {
        this.getAuditingNum();
    }

    //创建顶部的tab切换;
    createWrap () {
        let hash = this.props.hash,
            XML = null,
            pageState = 0;

        if(hash.indexOf('/auditing') != -1) {
            XML = (<Auditing getAuditingNum={this.getAuditingNum} />);
            pageState = 1;
        }else if(hash.indexOf('/stop-sales') != -1) {
            XML = (<StopSales />);
            pageState = 2;
        }else {
            XML = (<Selling />);
            pageState = 0;
        }
        return {
            XML: XML,
            pageState: pageState
        };
    }

    tabHandler(index) {
        switch (index) {
            case 0:
                window.location.href = '#my-goods/';
                break;
            case 1:
                window.location.href = '#my-goods/auditing';
                break;
            case 2:
                window.location.href = '#my-goods/stop-sales';
                break;
        }
    }

    createTab(pageState) {
        let btnNames = ['在售', '审核中', '已下架'],
            iconStyle = ['', this.state.auditNum ? 'icon-auditNum' : '', ''],
            num = [null, this.state.auditNum ? this.state.auditNum : null, null];
        return (
            <div className="flex-box head-tab center">
                <div className="flex-num1">
                    <IconBtnGroup btnNames={btnNames} style="tab" active={pageState} iconStyle={iconStyle} num={num}
                                  clickCallback={this.tabHandler.bind(this)} slider="slider"/>
                </div>
                <a className="add-goods-btn" href="index.php?m=PublicTemplate&c=ApiPublic&a=addGoodsPage">添加商品</a>
            </div>
        );
    }

    render() {
        let obj = this.createWrap();
        return (
            <div>
                {this.createTab(obj.pageState)}
                <div>{obj.XML}</div>
            </div>
        );
    }
}

export default MyGoods;