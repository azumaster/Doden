import Goods from  './Goods.jsx';
import GoodsDetailedInfo from './GoodsDetailedInfo.jsx';
import GoodsList from './GoodsList.jsx';
/*
 加入了五组数据;
 */
/**let products=[{url:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', price:127, time:'2015-08-10', name:'水晶虾', brand:'国产牌', origin:'台湾', model:'北极洲产出', specification:'1500g/包', imgurl:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', commentsNum:19999},
 {url:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', price:128, time:'2015-08-10'},
 {url:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', price:129, time:'2015-08-10'},
 {url:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', price:130, time:'2015-08-10'},
 {url:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', price:131, time:'2015-08-10'}];

 let seller=[{name:'食品房子', grade:'7级', place:'成都海霸王冻库', commentStar:4, commentSpeed:2, averageComment:3, breakRuleTimes:5}];

 let comments=[{shopIcon:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', shopName:'天天肉铺', starNum:1, comments:'不是太新鲜，别冷冻的时间太长吧，并且应该告诉我冷冻的时间好吗？我这个货完全没有办法卖出，大家别买'},
 {shopIcon:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', shopName:'天地肉铺', starNum:2, comments:'不是太新鲜，别冷冻的时间太长吧，并且应该告诉我冷冻的时间好吗？我这个货完全没有办法卖出，大家别买'},
 {shopIcon:'http://shp.qpic.cn/weixinsrc_pic/pScBR7sbqjOBJomcuvVJ6iacVrbMJaoJZkFUIq4nzQZUIqzTKziam7ibg/', shopName:'天下肉铺', starNum:3, comments:'不是太新鲜，别冷冻的时间太长吧，并且应该告诉我冷冻的时间好吗？我这个货完全没有办法卖出，大家别买'}];
 //<GoodsInfo products={products}/>
 <PageCtrl products={products} seller={seller[0]} comments={comments} product={products[0]}/>
 */
class Sell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            pageStatus: 0,
            SCROLL: null,
            goodsId:0
        };
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.lookGoods = this.lookGoods.bind(this);
    }

    componentWillMount() {
        window.onhashchange = () => {
            if(location.hash == '') {
                this.setState({goodsId: 0});
            }
        };
    }


    scrollCreator() {
        // 创建iscroll实例
        var wrapper = document.getElementById('new_product_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true,
                topOffset: 50
            });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        SCROLL.on('scroll', () => {
            console.log(SCROLL.y);
        });
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    //显示商品详情页，并更改当前显示的商品ID;
    lookGoods(){
        this.setState({
            goodsId:1,
            page:1
        }, ()=>{
            window.location.href='#goodsInfo';
        });
    }

    render(){
        let xml=[];
        xml.push(<Goods product={this.props.product}/>, <GoodsDetailedInfo product={this.props.product} seller={this.props.seller} comments={this.props.comments}/> );
        return(
            <div id="new_product_wrap">
                <div id="new_product_scroll" className="scroller">
                    {this.state.goodsId===0? <GoodsList lookGoods={this.lookGoods} products={this.props.products}/>:xml}
                </div>
            </div>
        );
    }
}
export default Sell;