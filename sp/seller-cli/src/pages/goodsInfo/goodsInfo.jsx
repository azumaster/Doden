/*
* 商品详情;
* create: xy, time: 2017-03-09
* */
import GoodsIntroduce from './goodsIntroduce.jsx';
import GoodsAttr from './goodsAttr.jsx';
import Toolbar from './toolbar.jsx';
class GoodsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            status: 0,
            goodsId: $.urlParam('id'),
            data: null
        };
        this.createScroll = this.createScroll.bind(this);
    }

    componentWillMount() {
        this.getGoodsInfo();
    }

    componentDidUpdate(){
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    getGoodsInfo() {
        $.loading.show();
        $.req.getGoodsInfo(this.state.goodsId, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                this.setState({data: res.data}, () => {
                    setTimeout(() => {this.createScroll();});
                    $.focusImg({
                        box: '#goodsBanner'
                    });
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //商品介绍和型号规则切换事件;
    toggle(e) {
        let status = e.target.dataset.operate;
        if(status) {
            this.setState({status: status}, () => {
                //this.state.SCROLL.refresh();
            });
        }
    }

    scrollRefresh() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('goodsInfoWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        this.state.SCROLL = SCROLL;
    }

    render() {
        let data = this.state.data;
        if(!data) return null;
        return (
            <div>
                <div id="goodsInfoWrap" className="goods-info-wrap" style={{bottom: $.seller && 0}}>
                    <div className="scroller">
                        <div id="goodsBanner" className="goods-banner">
                            <ul className="flex align-items-end picArr">
                                {
                                    data.goods_picture.map((val, index) => {
                                        return (<li key={index}><img src={$.cdn() + val.goods_image + $.img(450, 80)}/></li>);
                                    })
                                }
                            </ul>
                            <ul className="ctrlArr">
                                {
                                    data.goods_picture.map((val, index) => {
                                        return (<li key={index} id={val.goodsid}></li>);
                                    })
                                }
                            </ul>
                        </div>
                        <div className="goods-basic">
                            <div className="goods-price">￥{data.goods_price}/{data.goods_unit}
                                {
                                    //如果是管理人并且原价数据存在;
                                    $.seller && data.origin_goods_price ?
                                        <span style={{fontSize: '13px', color: '#5d5f6a', marginLeft: '20px', fontWeight: '400'}}>原价：￥{data.origin_goods_price}</span> : null
                                }
                            </div>
                            <div className="goods-title">{data.goods_title}</div>
                            <div className="goods-sell-num">已售：{data.goods_sell_num}件</div>
                        </div>
                        <div className="goods-describe">
                            <div className="toggle flex border-bottom" onClick={this.toggle.bind(this)}>
                                <div className="flex-item">
                                    <span className={this.state.status == 0 ?'toggle-item active' : 'toggle-item'} data-operate="0">商品介绍</span>
                                </div>
                                <div className="flex-item">
                                    <span className={this.state.status == 1 ?'toggle-item active' : 'toggle-item'} data-operate="1">型号规格</span>
                                </div>
                            </div>
                            {
                                this.state.status == 0 ? <GoodsIntroduce data={this.state.data} scrollRefresh={this.scrollRefresh.bind(this)} /> : <GoodsAttr data={this.state.data} />
                            }
                        </div>
                    </div>
                </div>
                {
                    !$.seller ? <Toolbar data={data} /> : null
                }

            </div>
        );
    }
}

export default GoodsInfo;