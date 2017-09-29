/*
* 第三步;
* 运单状态 (delivery.status) -10:已取消, 0:未开始配送, 10:配送中, 20:已送达.
* */

class OrderInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list
        };
        this.createList = this.createList.bind(this);
    }

    createList() {
        let list = this.state.list,
            xml = [];
        xml.push(list.map((val, index) => {
            let statusXml = null;
            switch (val.status) {
                case 0:
                    statusXml = (<span className="grey">未配送</span>);
                    break;
                case 10:
                    statusXml = (<span className="green">配送中</span>);
                    break;
                case 20:
                    statusXml = (<span className="grey">已送达</span>);
                    break;
                case -11:
                    statusXml = (<span className="grey">已取消</span>);
                    break;
            }

            return (
                <li className="car-wrap">
                    <div className="car-hd">
                        <div className="title">{val.custom.mobile}（{val.custom.name}）</div>
                        {
                            val.status == 0 ?  <div className="del-icon" data-index={index}></div> : null
                        }
                    </div>
                    <div className="car-bd">
                        <div className="green">
                            <label>提货码</label>{H.getExtractCode(val.code)}
                        </div>
                        <div className="red">
                            <label>件数</label>{val.volume}
                        </div>
                        <div className="car-note">
                            {statusXml}
                        </div>
                    </div>
                </li>
            );
        }));

        return xml;
    }

    handler(e) {
        let index = e.target.dataset.index;
        if(!index) return;
        let data = this.state.list[index];
        H.dialog({
            title: '是否要取消？',
            content: '<div class="car-wrap"><div class="car-hd"><div class="title">'+data.custom.mobile+'（'+data.custom.name+'）</div></div>'+
                    '<div class="car-bd"><div class="green"><label>地 址</label>'+data.address+'</div><div class="red"><label>提货码</label>' +
                    H.getExtractCode(data.code)+
                    '</div></div></div>',
            cancelText: '取消',
            cancel: true,
            okText: '提交',
            okCallback: () => {
                H.we_loading.show();
                H.server.shop_delivery_cancel_({}, (res) => {
                    H.we_loading.hide();
                    if(res.code == 0) {
                        let list = this.state.list;
                        list.splice(index, 1);
                        this.setState({list: list}, () => {
                            this.props.SCROLL && this.props.SCROLL.refresh();
                        });
                        H.operationState('成功取消运单');
                    }else {
                        H.operationState(res.message);
                    }
                }, data.id);
            }
        });

    }

    render() {
        return (
            <div className="add-order-finish">
                <div className="hd-label">
                    预约成功
                </div>
                <div className="note-wrap">
                    <div className="hd flex-box">
                        <div className="flex-num1">注意事项</div><a className="example">样图</a>
                    </div>
                    <div className="bd">
                        <p>1、请在所有货物上抄写对应的提货码；</p>
                        <p>2、请在每天上午7点-上午11点将货物送到海霸王冻品区16栋外“大鱼物流网点”，咨询电话：13058641397；</p>
                        <p>3、11点后不收货；</p>
                        <p>4、请发货人支付所有，暂不支持到付运费。</p>
                    </div>
                </div>
                <ul className="list" onClick={this.handler.bind(this)}>
                    {this.createList()}
                </ul>
                <div className="expense-wrap">
                    <div className="hd">费用说明</div>
                    <div className="bd">
                        <div className="flex-box item">
                            <div className="flex-num1 center">单箱重量<span className="flex-hd">(同一收货人)</span></div>
                            <div className="flex-num1 center">微信预约<span className="flex-hd">(三环内)</span></div>
                            <div className="flex-num1 center">未预约<span className="flex-hd">(直接派送至网点)</span></div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">0-10kg <span>(每箱)</span></div>
                            <div className="flex-num1 center orange">￥5</div>
                            <div className="flex-num1 center orange">￥8</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">10-20kg<span>(每箱)</span></div>
                            <div className="flex-num1 center orange">￥8</div>
                            <div className="flex-num1 center orange">￥10</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">20-30kg<span>(每箱)</span></div>
                            <div className="flex-num1 center orange">￥10</div>
                            <div className="flex-num1 center orange">￥12</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">泡沫箱<span>(不计重量)</span></div>
                            <div className="flex-num1 center orange">￥20</div>
                            <div className="flex-num1 center orange">￥25</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">编织袋<span>(米袋大小)</span></div>
                            <div className="flex-num1 center orange">￥15</div>
                            <div className="flex-num1 center orange">￥18</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1 center">起步价</div>
                            <div className="flex-num1 center orange">￥10</div>
                            <div className="flex-num1 center orange">￥12</div>
                        </div>
                    </div>
                    <div className="attention red">折扣(同一收货人当天箱数)</div>
                    <div className="bd">
                        <div className="flex-box item">
                            <div className="flex-num1">0-19箱</div>
                            <div className="red">不打折</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1">20-40箱</div>
                            <div className="red">8折</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1">40-60箱</div>
                            <div className="red">6折</div>
                        </div>
                        <div className="flex-box item">
                            <div className="flex-num1">60箱以上</div>
                            <div className="red">5折</div>
                        </div>
                    </div>

                    <div className="ft">请到网点清货后付现金</div>
                </div>
            </div>
        );
    }
}

export default OrderInfo;