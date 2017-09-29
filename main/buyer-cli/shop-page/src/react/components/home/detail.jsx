/**
 * Created by Doden on 2017.07.07
 */

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenMain: false,
            isBrands: false
        };
    }

    // 打开主营业务
    openMain() {
        this.setState({
            isOpenMain: !this.state.isOpenMain
        });
    }

    // 打开销售品牌
    openBrands() {
        this.setState({
            isBrands: !this.state.isBrands
        });
    }

    render() {
        let shop = this.props.shopInfo,
            brands = [];

        this.props.shopInfo.brands.map((b, i)=>{
            brands.push(<div className="brand" key={i}>{b}</div>);
        });

        return (<div className="shop-detail">
            <div className="detail-item">
                <div className="detail-word"><i className="icon clock"></i>入驻时长：<p>{shop.join_age}</p></div>
                <div className="detail-word"><i className="icon shop"></i>在售商品：<p>{shop.goods_num}种</p>近期已售：<p>{shop.recent_sales}件</p></div>
            </div>
            <div className="detail-item">
                <div className="detail-word detail-border"><i className="icon address"></i>发货地址：<p>{shop.sell_market}</p></div>
                <div className="detail-word detail-border"><i className="icon shop"></i>店铺地址：<p>{shop.shop_address}</p></div>
                <div className={'detail-word main '+(this.state.isOpenMain?'active':'')}><em><i className="icon business"></i>主营业务：</em>
                    <div onClick={this.openMain.bind(this)} className={'down-icon '+(this.state.isOpenMain?'active':'')}><i className="icon down" style={{float: 'right'}}></i></div>
                    <p className="more-p">{shop.main_business}</p></div>
            </div>
            <div className="detail-item">
                <div className="item-title"><i className="icon brand"></i>销售品牌</div>
                <div id="brands" className={'item-body brands '+(this.state.isBrands?'active':'')}>{brands}</div>
                <div className={'item-footer '+(this.state.isBrands?'active':'')}><i className="icon down" onClick={this.openBrands.bind(this)}></i></div>
            </div>
        </div>);
    }
}

export default Detail;