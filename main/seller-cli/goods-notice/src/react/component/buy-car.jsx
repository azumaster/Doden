/*
* 底部购物车栏*/

class BuyCar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data;
        return (
            <div className="buy-car-bar flex-box center">
                <div className="car-num-wrap">
                    <i className="car-icon"></i>
                    <i className="car-num">{data.goods_count}</i>
                </div>
                <div className="price">
                    ￥<span>{data.goods_total_price}</span>
                </div>
                <div className="flex-num1 breaks">
                    <p>最高可奖励：{data.diamond_num}钻石</p>
                    <p>可减免：{data.preferential_price}元</p>
                </div>
                <div>
                    <a className="car-confirm" href="index.php?m=PublicTemplate&c=ApiPublic&a=shopCartIndex">去确认</a>
                </div>
            </div>
        );
    }
}

export default BuyCar;