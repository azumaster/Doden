/*
* 主页
* */
import GoodsInfo from './../../component/goods-info/goods-info.jsx';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsId: H.urlParam('gid'),
            carData: {   //购物车数据;
                goods_count: 0
            }
        };
        this.getCarData = this.getCarData.bind(this);
    }

    componentWillMount() {
        window.onhashchange = () => {
            this.setState();
        };
        this.getCarData();
    }

    //获取购物车数据;
    getCarData() {
        H.server.shopCartInfo({}, (res) => {
            if(res.code == 0) {
                this.setState({carData: res.data});
            }else {
                H.operationState(res.message);
            }
        });
    }

    render() {
        return(
            <div>
                <GoodsInfo goodsId={this.state.goodsId} carData={this.state.carData} isTourists={this.state.isTourists}/>
            </div>
        );
    }
}

export default Content;