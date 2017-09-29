import GoodsInfo from './goods_info.jsx';


/*
* goodsList: [], 商品列表
* type: 商品类型
* style: []  cells的样式
* cellStyle: [] cell样式
* */

class GoodsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocus: false
        };
    }

    componentDidMount(){
        let that = this,
            node = $('.goods-list-items');
        //node.undelegate('input', 'focus blur');
        //node.delegate('input', 'focus', function(){
        //    value = this.value;
        //    this.value = '';
        //});
        //node.delegate('input', 'blur', function(e){
        //    if(this.value){
        //        that.props.onBlur(e);
        //    }else {
        //        this.value = value;
        //    }
        //    that.state.isFocus = true;
        //});
        node.delegate('.cell-row', 'click', function(e) {
            if(e.target.dataset.events) {
                that.props[e.target.dataset.events](e);
            }
            if(!e.target.dataset.index && !that.state.isFocus) {
                window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=addGoodsPage&pageName=auditing&goodsID='+$(this).data('para');
            }else {
                that.state.isFocus = false;
            }
        });
    }

    createCells(){
        let goodsList = [],
            props = this.props,
            cellStyle = props.cellStyle,
            order = props.order,
            btnNames = props.btnNames,
            clickCallback = props.clickCallback,
            btnGroupStyle = props.btnGroupStyle,
            iconBtnNames = props.iconBtnNames,
            iconStyle = props.iconStyle,
            operate = props.operate,
            btnClick = props.btnClick;
        this.props.goodsList.map((goods, index)=>{
                let arr = [index, index, index];
                goodsList.push(
                    <GoodsInfo index={index} goods={goods} style={cellStyle} order={order} iconBtnNames={iconBtnNames} operate={operate}
                               btnGroupStyle={btnGroupStyle} btnNames={btnNames} clickCallback={clickCallback} iconStyle={iconStyle}
                                btnClick={btnClick} para={arr}/>
                );
        });
        return goodsList;
    }

    render() {
        return (
            <div className={this.props.style ? 'goods-list-items ' + this.props.style : 'goods-list-items'} >
                <div className="goods-list-title">{this.props.type}</div>
                {this.createCells()}
            </div>
        );
    }
}
export default GoodsList;