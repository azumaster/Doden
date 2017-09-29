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
    createGoodsItem(){
        let props = this.props,
            basicField = props.basicField,  //基本字段
            goods = props.goods,            //商品
            dataField = props.dataField;    //其他数据的字段

        let status = [(goods[dataField[0]] != 0 ? {name: '立即报价', style: 'btn btn-green btn-gray  btn-small'}  : null)],
            btnNames = ['立即报价', '无货下架'],
            buttonStyle= ['btn btn-green btn-small', 'btn btn-green-the btn-small'],
            operate = [goods[dataField[0]] == 0 ? 'tellPrice' : null, 'soldOut'];
        return(
            <GoodsStructure style="goods-list-item" basicField={basicField} goods={goods}>
                <div>
                    <p>大概数量：{goods.need_num}件</p>
                </div>
                <BtnGroup style="shop-goods-operate" btnNames={btnNames} status={status}
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