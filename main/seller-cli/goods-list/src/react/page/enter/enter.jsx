/*
* 入口页面
* */
import CellRow from '../../components/cell-row/cell-row.jsx';

class Enter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsNum: 0,     //商品总数;
            informs: 0,      //系统通知数量; >0 表示有通知;
            noticeNum: 0     //未读通知数量;
        };
    }

    componentWillMount() {
        let server = H.server;
        //获取我的商品总数;
        server.getGoodsNum({type: 4}, (res) => {
            if(res.code == 0) {
                this.setState({goodsNum: res.data.total});
            }else {
                H.operationState(res.message);
            }
        });

        //获取系统通知未读的数量;
        server.getNoticeNum({}, (res) => {
            if(res.code ==0) {
                this.setState({noticeNum: res.data.num});
            }else {
                H.operationState(res.message);
            }
        });
    }

    clickHandler(e) {
        let node = e.target,
            para = '',
            href = '#';
        if(node.dataset.para) {
            para = node.dataset.para;
        }else {
            para = $(node).parents('.cell-row-item')[0].dataset.para;
        }
        switch (para) {
            case '0':
                href = '#my-goods';
                break;
            case '1':
                href = '#sales-promotion';
                break;
            case '2':
                href = '#system-informs';
                break;
        }
        window.location.href = href;
    }

    render() {
        return (<div className="enter-page" onClick={this.clickHandler.bind(this)}>
            <CellRow options={{icon: 'icon-myGoods', label: '我的商品', foot: this.state.goodsNum+'种商品', para: 0}}/>
            <CellRow options={{icon: 'icon-salesPromotion', label: '促销活动', para: 1}}/>
            <CellRow options={{icon: 'icon-systemInforms', label: '系统通知', para: 2}}>
                {this.state.noticeNum > 0 ? <i className="new-informs"></i> : []}
            </CellRow>
        </div>);
    }
}

export default Enter;