class OrderItem extends React.Component{
    constructor(){
        super();
    }
    
    render(){
        return(
            <li className = "cell order">
                <div className = "cell-head"><img src = {this.props.order_goods_info.goods_pic} alt = "desc" style = {{height:'70px', width:'70px'}} /></div>
                <div className = "cell-primary order-content">
                    <div className = "cell-head">{this.props.order_goods_info.goods_name}</div>
                    <div className = "cell-primary">{this.props.order_goods_info.buy_price*this.props.order_goods_info.buy_num}元</div>
                </div>
                <div className = "cell-ft"><a class = "btn btn-mini btn-primary" href = "javascript:;">删除</a></div>
            </li>
        );
    }
}
export default OrderItem;


