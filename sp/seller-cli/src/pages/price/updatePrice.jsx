/**
 * Created by Doden on 2017.03.08
 */

import { connect } from 'react-redux';
import Action from '../../redux/actions/action.js';

class UpdatePrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL:null,
            goodsPrice:[]
        };
    }

    componentWillMount(){
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        let SCROLL = new IScroll('#sellerUpdatePrice', {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    getData(){
        $.loading.show();
        $.req.getGoodsPrice({sort_id: this.props.params.id, status: this.props.params.status}, (res)=>{
            if(res.code==0){
                $.loading.hide();
                this.setState({
                    goodsPrice: res.data
                });
            }else{
                $.loading.hide();
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    createPriceList(){
        let priceList = [],
            goodsPrice = this.state.goodsPrice;

        if(goodsPrice){
            if(goodsPrice.length>0){
                goodsPrice.map((goodPrice, index)=>{
                    let brands = [];
                    goodPrice.brands.map((b, i)=>{
                        let increase = 0;
                        if(b.increase>0){
                            increase = '+' + Number(b.increase*100).toFixed(1);
                        }else if(b.increase < 0){
                            increase = Number(b.increase*100).toFixed(1);
                        }

                        brands.push(<div className="add-btn" key={i}><button type="button" className="btn btn-list"><em>{b.brand_name}</em><em>{increase}%</em></button></div>);
                    });

                    priceList.push(<div key={index} className="price-item">
                        <div className="ul">
                            <div className="li">
                                <div className="grid-row">
                                    <div className="grid-col-8 price-info">
                                        <h4>{goodPrice.sort_name}</h4>
                                    </div>
                                    <div className="grid-col-4 price-operate">
                                        <button type="button" className="btn btn-info pull-right" data-type={goodPrice.type} data-id={goodPrice.id} data-increase={goodPrice.increase}
                                                onClick={this.openPriceList.bind(this)}>改价</button>
                                    </div>
                                </div>
                            </div>
                            <div className="li">
                                <div className="add-btn-group">{brands}</div>
                            </div>
                        </div>
                    </div>);
                });
            }else {
                priceList.push(<div className="page-notice">~ 该分类下没有可改价的商品 ~</div>);
            }
        }

        return priceList;
    }

    openPriceList(e){
        let id = e.target.dataset.id,
            tId = this.props.params.id;
        window.location.href = '#/seller/price/priceList/'+id+'/'+tId;
    }

    render() {
        return (<div id="sellerUpdatePrice" className="seller-update-price">
            <div id="scroll">
                {this.createPriceList()}
            </div>
        </div>);}
}

const mapStateToProps = (state) => {
    return {
        goodsPrice: state.goodsPrice,
        addPrice: state.addPrice
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getGoodsPrice: (data)=>{Action(dispatch, 'fetchGoodsPrice', data);},
        addPrice: (data)=>{Action(dispatch, 'fetchAddPrice', JSON.stringify(data));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdatePrice);