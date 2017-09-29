/*
* xy 2017-09-12
* 商品型号规格
* */

import Attr from './Attr.jsx';

class BasicAttr extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextTypes = {
        units: React.PropTypes.array,
        rules: React.PropTypes.array
    };

    //设置型号数据;
    setParamTypes(d) {
        let param = this.props.data;
        param.types = d;
        this.props.setBasicAttr && this.props.setBasicAttr(param, this.props.index);
    }

    //设置规格数据;
    setParamSpecs(d) {
        let param = this.props.data;
        param.specs = d;
        this.props.setBasicAttr && this.props.setBasicAttr(param, this.props.index);
    }

    //删除型号;
    delBasicInfo(i) {
        let param = this.props.param;
        param.basic_attributes.splice(i, 1);
        this.props.setParam && this.props.setParam(param);
    }

    createPrice() {
        let data = this.props.data || {},
            units = this.context.units,
            str = '请设置商品价格';
        if(data.goods_price) {
            for(let i = 0 ; i < units.length ; i++) {
                if(units[i].id == data.goods_unit_id) {
                    str = data.goods_price + this.context.units[i].name;
                }
            }
        }
        return(
            <div className="price-foot">{str}</div>
        );
    }

    //重量的两个输入框值改变时;
    weightChange(key, e) {
        let param = this.props.data;
        param[key] = e.target.value;
        this.props.setBasicAttr && this.props.setBasicAttr(param, this.props.index);
    }

    createPriceRuleText() {
        let rules = this.context.rules,
            ruleVal = this.props.data.price_rules,
            ruleIndex = '',
            dom = [];
        if(ruleVal.length <= 0) return null;
        for(let i = 0 ; i < rules.length ; i++) {
            for(let j = 0 ; j < ruleVal.length ; j++) {
                if(ruleVal[j].price_rule_id == rules[i].price_rule_id) {
                    ruleIndex = j;
                    break;
                }
            }
        }
        for(let j = 0 ; j < ruleVal.length ; j++) {
            let typeDom = [],
                arr = ruleVal[j].rules,
                index;
            for(let i = 0 ; i < rules.length ; i++) {
                if(ruleVal[j].price_rule_id == rules[i].price_rule_id) {
                    index = i;
                }
            }
            for(let i = 0 ; i < arr.length ; i ++) {
                typeDom.push(<span>买{arr[i].buy_num}{rules[index] && rules[index].show_name}{arr[i].preferential}元&nbsp; </span>);
            }
            if(arr.length > 0) {
                dom.push(
                    <div className="cell-row input-line signal-prompt">
                        <div className="cell-body"></div>
                        <span className="type">{rules[ruleIndex] && rules[ruleIndex].show_name}</span>
                        <span>{typeDom}</span>
                    </div>
                );
            }
        }
        return dom;
    }

    render() {
        let data = this.props.data || {};
        return (
            <div key={this.props.index} className="basic_attr">
                <div className="plate-title">*型号规格</div>
                <div className="add-goods-item">
                    <Attr label="型号" val={this.props.data.types} data={this.props.attr.type_constraint} setData={this.setParamTypes.bind(this)}/>
                    <Attr label="规格" val={this.props.data.specs} data={this.props.attr.spec_constraint} setData={this.setParamSpecs.bind(this)} />
                    <div className="cell-row input-line">
                        <div className="cell-head">带箱重</div>
                        <div className="cell-body">
                            <input className="cell-input" placeholder="请输入带箱重" type="number" value={data.rough_weight} onChange={this.weightChange.bind(this, 'rough_weight')} />
                        </div>
                        <div className="cell-foot" data-index="2"></div><div>公斤</div></div>
                    <div className="cell-row input-line">
                        <div className="cell-head">去箱重</div>
                        <div className="cell-body">
                            <input className="cell-input" placeholder="请输入去箱重" value={data.net_weight} onChange={this.weightChange.bind(this, 'net_weight')} />
                        </div>
                        <div className="cell-foot"></div>
                        <div>公斤</div>
                    </div>
                    <div className="cell-row input-line signal 0">
                        <div className="cell-head">价格</div>
                        <div className="cell-body" style={{textAlign: 'right'}} onClick={this.props.setChangePricePage.bind(this, this.props.index)}>
                            {this.createPrice()}
                        </div>
                    </div>
                    {this.createPriceRuleText()}
                </div>
                {this.props.index && this.props.index != 0 ? <a className="btn btn-delete" onClick={this.delBasicInfo.bind(this, this.props.index)}>删除型号</a> : null}
            </div>
        );
    }
}

export default BasicAttr;