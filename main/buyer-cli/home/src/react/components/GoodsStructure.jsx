/*
* 商品项的骨架
* goods: {} //商品信息
* basicField: [] //字段
* style：'' //样式
*
* */

class GoodsStructure extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
      imgSize: H.imgSize()[110]
    };

    render() {
        let props = this.props,
            style = props.style, //样式
            goods = props.goods, //商品信息
            basicField = props.basicField; //字段
        return (
            <div className={style ? 'cell-row ' + style : 'cell-row'}>
                <div className="cell-head">
                    <img  src={H.localhost + (goods[basicField[0]] ? goods[basicField[0]] : 'Public/images/buyer-cli/default-img1.png') + props.imgSize} />
                </div>

                <div className="cell-body">
                    <div className="cell-column">
                        <div className="cell-head">
                            <p>{goods[basicField[1]]}</p>
                        </div>
                        <div className="cell-body">
                        </div>
                        <div className="cell-foot">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default GoodsStructure;