
import IconBtnGroup from '../icon-btn-group/icon_btn_group.jsx';
/*
* 商品信息
* goods: {} 商品信息
* clickCallback: fn 回调函数
* style: '' 样式
* cellsStyle: ''按钮组的样式
* */

class GoodsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnClassName: ''
        };
        this.switchClass = this.switchClass.bind(this);
    }

    //componentDidMount(){
    //    //this.refs.input.value = Number(this.props.goods[this.props.order[3]]);
    //}
    //
    //componentWillReceiveProps(nextProps) {
    //    //this.refs.input.value = Number(nextProps.goods[this.props.order[3]]);
    //}

    switchClass() {
        switch (this.props.goods.shenghe_act) {
            case 1:
                this.state.btnClassName = 'auditing-gray';
                break;
            case 5:
                this.state.btnClassName = 'refused-red';
                break;
            case 6:
                this.state.btnClassName = 'auditing-gray';
                break;
            case 100:
                this.state.btnClassName = 'refused-red';
                break;
        }
    }
    /*直接改价：<input ref="input" data-para={goods.goods_id} data-index={1} type="number" className="input-inline"/>元/{goods[order[4]]}*/
    render() {
        let props = this.props,
            goods = props.goods,
            order = props.order,
            imgSrc = H.localhost + goods[order[0]] + H.imgSize()[110];
        if(goods[order[0]].indexOf('.jpg') == -1 && goods[order[0]].indexOf('.jpeg') == -1 && goods[order[0]].indexOf('.png') == -1) {
            imgSrc = H.localhost + 'Public/images/seller-cli/uploader-img.png';
        }
        this.switchClass();
        return (
            <div className={this.props.style}>
                <div className="cell-row" data-para={goods.goods_id}>
                    <div className="cell-head">
                        <img src={imgSrc} />
                    </div>

                    <div className="cell-body">
                        <div className="cell-column">
                            <div className="cell-head">
                                {goods[order[1]]}
                            </div>

                            <div className="cell-body">
                                型号：{goods[order[2]]}
                            </div>

                            <div className="cell-foot">
                                直接改价：<div data-operate={props.operate} data-index={props.index} data-events="changePriceHandler" className="input-inline input-price">{goods.price}</div>元/{goods[order[4]]}
                            </div>
                        </div>
                    </div>

                    <div className="cell-foot">
                        <div className="cell-column">
                            <div className="cell-head">
                                <a className="btn btn-lg" data-operate={props.operate} data-index={props.index} data-events="delGoods">删除</a>
                            </div>

                            <div className="cell-body">

                            </div>

                            <div className="cell-foot">

                            </div>
                        </div>
                    </div>
                </div>
                {
                    goods.price_rules.length > 0 ?
                        <div className="price-rules">
                            {
                                goods.price_rules.map((val, index) => {
                                    let xml = [],   //每个规则的多个层级;如：买10减1，买20减3......
                                        ruleXml = null;
                                    for(let i = 0 ; i < val.rules.length ; i++) {
                                        xml.push(
                                            <p className="price-rules-item" key={index+''+i}>满{val.rules[i].buy_num}{goods[order[4]]}合计{val.rule_type}{val.rules[i].preferential}</p>
                                        );
                                    }
                                    switch (val.rule_type) {
                                        case '减':
                                            ruleXml = (<div className="rules-reduce">{val.rule_type}</div>);
                                            break;
                                        case '赠':
                                            ruleXml = (<div className="rules-give">{val.rule_type}</div>);
                                    }
                                    return (
                                        <div className="price-rules-cells" key={index}>{ruleXml}{xml}</div>
                                    );
                                })
                            }
                        </div> : null
                }
                <IconBtnGroup  style={props.btnGroupStyle ? props.btnGroupStyle : this.state.btnClassName} btnNames={props.iconBtnNames || ['审核结果：' + goods.remark]} iconStyle={props.iconStyle}
                                clickCallback={props.btnClick} para={props.para} operate={props.operate}/>
            </div>
        );
    }
}
export default GoodsInfo;