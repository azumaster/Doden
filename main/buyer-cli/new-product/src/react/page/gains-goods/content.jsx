/*
* 主页
* */
import TouristsFooter from './../../components/tourists-footer.jsx';
import ProductList from './product-list.jsx';
import GoodsInfo from './../../component/goods-info/goods-info.jsx';
import BuyCar from './../../component/buy-car-bar/buy-car.jsx';
import GainsGoodsTop from './gains-goods-toolbar.jsx';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 0,
            goodsId: null,
            isGoodsOften: 0,  //当前ID的商品是否已经加入了常购;
            carData: {   //购物车数据;
                goods_count: 0
            },
            dataStatus: 3,   ////数据类型，1表示降价,2表示涨价，3表示全部;
            isTourists: 1,    //是否是游客;
            isSeller: 1  //是否是一批商;一批商不显示购物车 ,1是一批商,;
        };
        this.goodsInfoPage = this.goodsInfoPage.bind(this);
        this.setTourists = this.setTourists.bind(this);
        this.setDataStatus = this.setDataStatus.bind(this);
        this.getCarData = this.getCarData.bind(this);
    }

    componentWillMount() {
        window.onhashchange = () => {
            H.sheet.hide();
            if(location.hash == '') {
                this.setState({pageStatus: 0});
            }
        };
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

    //visitor为1表示是已注册的用户,seller为1表示一批商，不请求购物车数据;
    setTourists(visitor, seller) {
        if(visitor == 1 && seller != 1) {
            this.getCarData();
        }
        this.setState({
            isTourists: visitor,
            isSeller: seller
        });
    }

    //显示商品详情页，并更改当前显示的商品ID;
    goodsInfoPage(goodsId, isGoodsOften) {
        this.setState({
            pageStatus: 1,
            goodsId: goodsId,
            isGoodsOften: isGoodsOften
        }, () => {
            window.location.href = '#goodsInfo';
        });
    }

    //涨价降价全部的状态切换;
    setDataStatus(status) {
        this.setState({dataStatus: status});
    }

    render() {
        return(
            <div>
                <ProductList
                    goodsInfoPage={this.goodsInfoPage}
                    setTourists={this.setTourists}
                    dataStatus={this.state.dataStatus}
                    getCarData={this.getCarData}
                    goodsId={this.state.goodsId}
                    isGoodsOften={this.state.isGoodsOften}
                    pageStatus={this.state.pageStatus}
                />
                {
                    (this.state.isTourists == 2) ? <TouristsFooter /> : ''
                }
                {
                    (this.state.isTourists == 1) && (this.state.isSeller != 1) && (this.state.carData.goods_count > 0) ? <BuyCar data={this.state.carData} /> : ''
                }
                {
                    this.state.pageStatus == 1 ?
                        <GoodsInfo goodsId={this.state.goodsId} carData={this.state.carData} goodsInfoPage={this.goodsInfoPage} />
                        : ''
                }
                <GainsGoodsTop setDataStatus={this.setDataStatus} dataStatus={this.state.dataStatus} />
            </div>
        );
    }
}

export default Content;