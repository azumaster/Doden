/*
*
* 传入的是products
* */

import Goods from './Goods.jsx';
class GoodsInfo extends React.Component{
    constructor(){
        super();
        this.state={
            GoodsId:0,
            page:0
        };
    }
    handle(){
        this.props.lookGoods();
    }

    render(){
        let rows=[];
        this.props.products.map((product) => (
             rows.push(<Goods lookGoods={this.handle.bind(this)} product={product}/>)
        ));
        return(
            <ul class="cells">
                {rows}
            </ul>
        );
    }
}
export default GoodsInfo;