/*
 *传入的是props product(url, price,time)
 *
 * */
class Goods extends React.Component{
    constructor(){
        super();
    }
    handleClick() {
        this.props.lookGoods();
    }
    render(){
        return(
            <li className="cell" onClick={this.handleClick.bind(this)}>
                <div className="cell-head">
                    <img src={this.props.product.url} style={{height:'70px', width:'70px'}} />
                </div>

                <div className="cell-primary">
                    <div className="cell goods-cell">
                        <div className="cell-head ">
                            就是说明而已
                        </div>

                        <div className="cell-primary goods-primary">
                            一口价：{this.props.product.price}<br/>
                            上架时间：{this.props.product.time}
                        </div>

                        <div className="cell-ft">
                            <a className="btn btn-mini btn-primary btn-space" href="javascript:;">加入购物车</a>
                            <a className="btn btn-mini btn-default" href="javascript:;">咨询</a>
                        </div>
                     </div>
                </div>

                <div className="cell-ft like">
                </div>
            </li>
            );
    }
}
export default Goods;
