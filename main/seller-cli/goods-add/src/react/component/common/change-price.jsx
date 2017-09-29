/*
* 改价的弹窗;
* */

class ChangePrice extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            param: JSON.parse(JSON.stringify(props.data)),
            date: 0,
            priceRule: null,     //价格体系规则数据;
            goodsPriceRule: null    //当前商品的价格规则;
        };
        this.createPrice = this.createPrice.bind(this);
    }

    static contextTypes = {
        units: React.PropTypes.array,
        rules: React.PropTypes.array
    };

    componentDidMount() {
        this.createScroll();
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
                click: false,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
    }

    clickHandler(e) {
        //let date = new Date();
        //if(date - this.state.date < 1200) return;
        //this.state.date = date;
        let events = e.target.dataset.events;
        if(!events) return;
        this[events](e);
    }

    //规则里面的输入框值改变时;
    changeHandler(e) {
        let index = e.target.dataset.index,
            key = e.target.dataset.key,
            rules = e.target.dataset.rules,
            param = this.state.param;
        param.price_rules[rules].rules[index][key] = e.target.value;
        this.setState({param: param});
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
        e.stopPropagation();
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
                    preferential: ''
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
                    preferential: ''
                }
            );
        }
        this.setState({param: param}, () => {
            this.state.SCROLL.refresh();
        });
    }

    //价格的输入框改变时
    changePrice(e) {
        let value = e.target.value,
            param = this.state.param;
        if(/^\d{1,4}(\.\d{0,2})?$/.test(value) || value == ''){
            param.goods_price = value;
            this.setState({param: param});
        }
    }

    //单位选择框改变时
    unitChange(e) {
        let value = e.target.value,
            param = this.state.param;
        param.goods_unit_id = value;
        this.setState({param: param});
    }

    createPrice() {
        if(!this.context.rules) return null;
        let rules = this.context.rules,
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
                                    <input type="number" data-rules={j} data-index={k} data-key="preferential" placeholder="输入金额" value={o.preferential} />
                                </div>{rules[i].preferential_unit}<span className="del-set-price" data-rules={j} data-index={k} data-events="del"></span>
                            </div>
                        );
                    }
                }
            }

            xml.push(
                <div className="set-prices" onClick={this.clickHandler.bind(this)}>
                    <div className="set-prices-title flex-box center">
                        <div>买{rules[i].show_name}</div><div className="flex-num1 aaa">如买家买10{rules[i].buy_unit}合计{rules[i].show_name}20{rules[i].preferential_unit}</div>
                        <a className="add-set-price" data-id={rules[i].price_rule_id} data-events="add">{'添加买' + rules[i].show_name}</a>
                    </div>
                    <div className="set-prices-item" onChange={this.changeHandler.bind(this)}>
                        {item}
                    </div>
                </div>
            );
        }
        return xml;
    }

    priceFocus(e) {
        let param = this.state.param;
        this.state.spacePrice = e.target.value;
        param.goods_price = '';
        this.setState();
    }

    priceBlur(e) {
        if(!e.target.value) {
            let param = this.state.param;
            param.goods_price = this.state.spacePrice;
            this.setState();
        }
    }

    savePrice() {
        let param = this.state.param.price_rules,
            arr = [];
        for(let j = 0 ; j < param.length ; j++) {
            let arr1 = [],
                item = param[j].rules;
            for(let i = 0 ; i < item.length ; i++) {
                if(item[i].buy_num && item[i].preferential) arr1.push(item);
            }
            if(arr1.length > 0) {
                arr.push(param[j]);
            }
        }

        this.state.param.price_rules = arr;
        this.props.setBasicAttr && this.props.setBasicAttr(this.state.param, this.props.index);
        this.props.updatePrice && this.props.updatePrice(this.state.param);
        this.props.closePrice(-1);
    }

    render() {
        return (
            <div id="changePriceWrap" className="change-price-wrap">
                <div className="change-Price">
                    <div className="hd">设置价格<i className="close-icon" onClick={this.props.closePrice.bind(this, -1)}></i></div>
                    <div id="changePriceContent" className="change-Price-content">
                        <div className="scroller">
                            <div id="changePriceEvents" className="bd">
                                <div className="set-price-title flex-box center">设置单件价</div>
                                <div className="flex-box center basic-price-wrap"><div>单位：</div>
                                    <div className="select-wrap flex-num1">
                                        <select className="select" value={this.state.param.goods_unit_id} onChange={this.unitChange.bind(this)}>
                                            {
                                                this.context.units.map((val, index) => {
                                                    return (
                                                        <option key={index} value={val.id}>{val.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-box center basic-price-wrap"><div>单价：</div>
                                    <input onFocus={this.priceFocus.bind(this)}
                                           onBlur={this.priceBlur.bind(this)}
                                           onChange={this.changePrice.bind(this)}
                                           className="basic-price flex-num1"
                                           type="number" placeholder="请输入价格" value={this.state.param.goods_price}
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