/*
* 商品
* */

class Goods extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="flex-box goods-list">
                <div className="goods-img">
                    <img src="/Public/buyer-cli/mall/images/goods.jpg"/>
                    <span className="pic-num">4张</span>
                </div>
                <div className="flex-num1">
                    <div className="goods-title">
                        <p>精品六和鸡腿，每个约180g精品六和鸡腿，每个约180</p>
                    </div>
                    <div className="price">
                        <span className="color-orange">一口价：￥133.3</span>(登录可见)
                    </div>
                    <div className="time">
                        上架时间：2016年8月28号
                    </div>
                    <div className="flex-box btn-wrap">
                        <button className="btn btn-green">加入购物车</button>
                        <button className="btn btn-green-the btn-small">咨询</button>
                        <div className="flex-num1 collection">
                            <a className="has"></a>
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

export default Goods;