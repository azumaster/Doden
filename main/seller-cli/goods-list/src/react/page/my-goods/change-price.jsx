/*
* 改价的弹窗;
* */

class ChangePrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: null,
            date: 0,
            priceRule: null,     //价格体系规则数据;
            goodsPriceRule: null    //当前商品的价格规则;
        };
        this.changePriceSend = this.changePriceSend.bind(this);
        this.createPrice = this.createPrice.bind(this);
        this.getPriceRule = this.getPriceRule.bind(this);
        this.getGoodsPriceRule = this.getGoodsPriceRule.bind(this);
    }

    componentWillMount() {
        let data = this.props.data;
        this.state.param = {
            goods_id: data.goods_id,
            new_price: data.price,
            price_rules: []
        };
        let promiseList = [
            new Promise((resolve) => {this.getPriceRule(resolve);}),
            new Promise((resolve) => {this.getGoodsPriceRule(resolve);})
        ];
        Promise.all(promiseList).then(() => {
            this.forceUpdate();
        });

    }

    componentDidMount() {
        this.createScroll();
    }

    //获取价格体系规则;
    getPriceRule(resolve) {
        H.server.getPriceRule({}, (res) => {
            if(res.code == 0) {
                this.state.priceRule = res.data.price_rules;
                resolve(1);
            }else {
                H.operationState(res.message);
            }
        });
    }

    //获取商品的价格规则;
    getGoodsPriceRule(resolve) {
        let param = {
            goods_id: this.props.data.goods_id
        };
        H.server.getGoodsPriceRule(param, (res) => {
            if(res.code == 0) {
                let param = this.state.param,
                    data = res.data.price_rules;
                this.state.goodsPriceRule = data;
                param.price_rules = data;
                resolve(1);
            }else {
                H.operationState(res.message);
            }
        });
    }

    //创建IScroll;
    createScroll(){
        var wrapper = document.getElementById('changePriceContent'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
    }

    changePriceSend() {
        H.server.changePrice({goods_id: this.props.data.goods_id, new_price: new_price}, (res) => {
            if(res.code == 0){
                H.operationState('价格修改成功');
            }else{
                H.operationState(res.message);
            }
        });
    }

    clickHandler(e) {
        let date = new Date();
        if(date - this.state.date < 1200) return;
        this.state.date = date;
        let events = e.target.dataset.events;
        if(!events) return;
        this[events](e);
    }

    changeHandler(e) {
        let events = e.target.dataset.events;
        if(events) {
            this[events](e);
        }else {
            let index = e.target.dataset.index,
                key = e.target.dataset.key,
                rules = e.target.dataset.rules,
                param = this.state.param;
            param.price_rules[rules].rules[index][key] = e.target.value;
            this.setState({param: param});
        }
    }

    del(e) {
        let node = e.target.dataset,
            param = this.state.param,
            rules = node.rules,
            index = node.index,
            arr = param.price_rules[rules].rules;
        arr.splice(index, 1);
        this.setState({param: param}, () => {
            this.state.SCROLL.refresh();
        });
    }

    add(e) {
        let node = e.target.dataset,
            param = this.state.param,
            rulesId = node.id,
            index = null;
        for(let i = 0 ; i < param.price_rules.length ; i++) {
            if(param.price_rules[i].price_rule_id == rulesId) {
                index = i;
            }
        }

        if(index === null) {
            let obj = {
                price_rule_id: rulesId,
                rules: [{
                    buy_num: '',
                    preferential_value: ''
                }]
            };
            param.price_rules.push(obj);
        }else {
            if(param.price_rules[index].rules.length >= 3) {
                return ;
            }
            param.price_rules[index].rules.push(
                {
                    buy_num: '',
                    preferential_value: ''
                }
            );
        }
        this.setState({param: param}, () => {
            this.state.SCROLL.refresh();
        });
    }

    changePrice(e) {
        let value = e.target.value,
            param = this.state.param;
        if(/^\d{1,4}(\.\d{0,2})?$/.test(value) || value == ''){
            param.new_price = value;
            this.setState({param: param});
        }
    }

    createPrice() {
        if(!this.state.priceRule || !this.state.goodsPriceRule) return null;
        let rules = this.state.priceRule,
            goodsRule = this.state.param.price_rules,
            xml = [];
        for(let i = 0 ; i < rules.length ; i++) {
            let item = [];
            for(let j = 0 ; j < goodsRule.length ; j++) {
                if(goodsRule[j].price_rule_id == rules[i].price_rule_id) {
                    for(let k = 0 ; k < goodsRule[j].rules.length ; k++) {
                        let o = goodsRule[j].rules[k];
                        item.push(
                            <div className="set-item flex-box center">买
                                <div className="flex-num1">
                                    <input type="number" data-rules={j} data-index={k} data-key="buy_num" value={o.buy_num} placeholder="输入数量"/>
                                </div>{rules[i].buy_unit}，合计{rules[i].show_name}
                                <div className="flex-num1">
                                    <input type="number" data-rules={j} data-index={k} data-key="preferential_value" placeholder="输入金额" value={o.preferential_value} />
                                </div>{rules[i].preferential_unit}<span className="del-set-price" data-rules={j} data-index={k} data-events="del"></span>
                            </div>
                        );
                    }
                }
            }

            xml.push(
                <div className="set-prices">
                    <div className="set-prices-title flex-box center">
                        <div>买{rules[i].show_name}</div><div className="flex-num1 aaa">如买家买10{rules[i].buy_unit}合计{rules[i].show_name}20{rules[i].preferential_unit}</div>
                        <a className="add-set-price" data-id={rules[i].price_rule_id} data-events="add">{'添加买' + rules[i].show_name}</a>
                    </div>
                    <div className="set-prices-item">
                        {item}
                    </div>
                </div>
            );
        }
        return xml;
    }

    savePrice(){
        let date = new Date();
        if(date - this.state.date < 1200) return;
        this.state.date = date;
        let param = this.state.param;
        if(!param.new_price) {
            H.operationState('请填写单价');
            return;
        }
        for(let i = 0 ; i < param.price_rules.length ; i++) {
            let arr = param.price_rules[i].rules;
            if(arr.length <= 0 ){
                param.price_rules.splice(i, 1);
            }else {
                for(let j = 0 ; j < arr.length ; j++) {
                    if(!arr[j].buy_num || !arr[j].preferential_value) {
                        H.operationState('请把多件价的填写完');
                        return;
                    }
                    if(arr[j].preferential_value) {
                        param.price_rules[i].rules[j].preferential = arr[j].preferential_value;
                    }
                }
            }
        }
        H.we_loading.show();
        H.server.changePrice(JSON.stringify(param), (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                this.props.changePriceFinish && this.props.changePriceFinish(param.new_price, res.data);
            }else {
                H.operationState(res.message);
            }
        });
    }

    priceFocus(e) {
        let param = this.state.param;
        this.state.spacePrice = e.target.value;
        param.new_price = '';
        this.setState();
    }

    priceBlur(e) {
        if(!e.target.value) {
            let param = this.state.param;
            param.new_price = this.state.spacePrice;
            this.setState();
        }
    }

    render() {
        return (
            <div id="changePriceWrap" className="change-price-wrap">
                <div className="change-Price">
                    <div className="hd">改价<i className="close-icon" onClick={this.props.closePrice}></i></div>
                    <div id="changePriceContent" className="change-Price-content">
                        <div className="scroller">
                            <div id="changePriceEvents" className="bd" onClick={this.clickHandler.bind(this)} onChange={this.changeHandler.bind(this)}>
                                <div className="flex-box center basic-price-wrap"><div>单价：</div>
                                    <input onFocus={this.priceFocus.bind(this)}
                                           onBlur={this.priceBlur.bind(this)}
                                           className="basic-price flex-num1"
                                           type="number" placeholder="请输入价格"
                                           data-events="changePrice"
                                           value={this.state.param.new_price}
                                    /><div>元/件</div></div>
                                <div className="set-price-title flex-box center">设置多件价</div>
                                {
                                    this.createPrice()
                                }
                            </div>
                            <div id="changePriceBtn" className="change-price-btn" onClick={this.savePrice.bind(this)}>保存</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChangePrice;