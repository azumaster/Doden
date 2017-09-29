/*
* 商品规则型号;
* create: xy, time: 2017-03-09
* */

class GoodsAttr extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let data = this.props.data;
        let halal = data.halal==1?'是':'否';
        let special = data.special_detail,
            specialAttr = [];

        if(special && special instanceof Array){
            special.map((s, index)=>{
                specialAttr.push(<div className="attr-item" key={index}><div className="attr-name">{s.prope_name}</div><div className="attr-val">{s.prope_value}</div></div>);
            });
        }

        return (
            <div className="goods-attr">
                {data.goods_name?<div className="attr-item"><div className="attr-name">品名</div><div className="attr-val">{data.goods_name}</div></div>:null}
                {data.halal===0 || data.halal?<div className="attr-item"><div className="attr-name">清真</div><div className="attr-val">{halal}</div></div>:null}
                {data.goods_brand?<div className="attr-item"><div className="attr-name">品牌</div><div className="attr-val">{data.goods_brand}</div></div>:null}
                {data.goods_origin?<div className="attr-item"><div className="attr-name">产地</div><div className="attr-val">{data.goods_origin}</div></div>:null}
                {data.goods_xinghao?<div className="attr-item"><div className="attr-name">型号</div><div className="attr-val">{data.goods_xinghao}</div></div>:null}
                {data.goods_net_weight?<div className="attr-item"><div className="attr-name">净重</div><div className="attr-val">{data.goods_net_weight}Kg</div></div>:null}
                {data.goods_meat_weight?<div className="attr-item"><div className="attr-name">解冻后约</div><div className="attr-val">{data.goods_meat_weight}Kg</div></div>:null}
                {data.goods_guigei?<div className="attr-item"><div className="attr-name">规格</div><div className="attr-val">{data.goods_guigei}</div></div>:null}
                {specialAttr}
            </div>
        );
    }
}

export default GoodsAttr;