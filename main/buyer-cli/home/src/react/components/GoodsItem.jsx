import GoodsStructure from './GoodsStructure.jsx';
import BtnGroup from './BtnGroup.jsx';

/*
* 商品项
* goods: {}      //商品信息
* data: {}       //res.data
* dataField: []  //用户字段
* goodsField: [] //商品字段
* index: int     //商品的索引
* type: ''       //类型
* clickCallback: '', //点击回调
* basicField: ''
* */

class GoodsItem extends React.Component {

    constructor(props) {
        super(props);
    }

    //创建商品项
    //创建商品项
    createGoodsItem(){
        let props = this.props,
            basicField = props.basicField,  //基本字段
            goods = props.goods,            //商品
            data = props.data,              //除了商品的的其他数据
            dataField = props.dataField,    //其他数据的字段
            goodsField = props.goodsField;  //商品的其他字段
        let oftenField = goods[dataField[1]];
        let status = [(oftenField ? {name: '求报价', style: 'btn btn-green btn-gray  btn-mid'}  : {}),
                      (oftenField ? {style: 'btn btn-green btn-gray'}  : {}),
                      (goods[dataField[2]] ? {style: 'has'}  : {})],
            btnNames = [data[dataField[3]] ? '在线下单' : '加入购物车', '咨询', ''],
            buttonStyle= ['btn btn-green btn-mid', 'btn btn-green-the btn-small', 'not'],
            operate = [oftenField ? 'askPrice' : (data[dataField[3]] ? 'shopping' : 'addCar'), 'consult', 'collect'],
            priceRules= [];
        if(goods[dataField[4]]){
            goods[dataField[4]].map((rule)=>{
                let type = rule.rule_type;
                priceRules.push(<div className="price-rule">
                    <span className="color" style={type == '赠' ? {background: '#f87851'} : null}>{type}</span><span>最高{type}{rule.max_preferential}</span>
                </div>);
            });
        }
        return(
            <GoodsStructure style="goods-list-item" basicField={basicField} goods={goods}>
                <div style={{lineHeight: '2', whiteSpace: 'nowrap'}}>
                    <span style={{color: '#d40c21', fontSize: '16px'}}>￥{goods[goodsField[0]]}</span>
                    <span>{data[dataField[0]] ? null : '（登录可见）'}</span>
                    {priceRules}
                </div>
                <p className="shop-position" style={{fontSize: '12px', position: 'absolute', right: '0', bottom: '35px'}}>{goods[goodsField[2]]}</p>
                <BtnGroup style="shop-goods-operate" status={status} btnNames={btnNames}
                          buttonStyle={buttonStyle} operate={operate} />
            </GoodsStructure>
        );
    }

    render() {
        let props = this.props;
        return (
            <div data-index={props.index} data-type={props.type} onClick={props.clickCallback}>
                {this.createGoodsItem()}
            </div>
        );
    }

}
export default GoodsItem;