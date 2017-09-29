/*
* 商品详情页面;
* */

import Supplier from './supplier.jsx';
import Evaluation from './evaluation.jsx';
import Details from './Details.jsx';
import GoodsInfoFooter from './goods-info-footer.jsx';

class GoodsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            infoStatus: -1,  //0为商品详情，1为评价，2为供应商
            data: null,   //商品信息;
            detailsData: null,   //商品细节;
            evaluationData: null,   //商品评价;
            supplierData: null,   //供应商信息;
            countdownTime: '',    //商品倒计时;
            goodsEnshrine: 0,   //是否加入常购;
            goodsStatus: 1,  // 商品是否可以正常购买，1正常购买，其它表示商品已下架，0表示活动已结束;
            watermark: ''  //图片水印;
        };
        this.createTabContent = this.createTabContent.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
        this.createGoodsInfo = this.createGoodsInfo.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.setGoodsEnshrine = this.setGoodsEnshrine.bind(this);
        this.consultingHandler = this.consultingHandler.bind(this);
    }

    //获取OSS的图片请求水印;
    getOssImagesWatermark() {
        if(H.localhost.indexOf('192.168.') == -1) {  //不是本地开发环境才加图片加水印;
            H.server.getOssImagesWatermark({}, (res) => {
                if(res.code == 0) {
                    this.setState({watermark: res.data.images_watermark});
                }else {
                    H.operationState(res.message);
                }
            });
        }
    }

    componentWillMount() {
        this.getOssImagesWatermark();
        let server = H.server,
            param = {
                goods_id: this.props.goodsId
            };
        H.we_loading.show();

        //获取商品详情的数据;
        server.getGoodsInfo(param, (res) => {
            if(res.code == 0) {
                //设置分享内容;
                H.share.changeShare({
                    img: H.localhost + res.data.goods.goods_image[0] + H.imgSize()[110],
                    url: window.location.host + '/show_page.php?pageTag=5&gid='+this.props.goodsId,
                    title: '【找冻品网】' + res.data.goods.goods_description,
                    desc: '（'+res.data.details.goods_name+'）支持在线下单了，平台补贴进行中，使用“钻石”即可减免10元。'
                });
                let details = res.data.details;
                details.goods_image = res.data.goods.goods_image;
                details.goods_description = res.data.goods.goods_description;
                details.inspection_report = res.data.goods.inspection_report;
                details.special_detail = res.data.special_detail;
                this.setState({
                    data: res.data,
                    detailsData: details,
                    infoStatus: 0,
                    goodsEnshrine: res.data.goods_enshrine
                }, () => {
                    if(this.state.data.activity.type != 1 && this.state.data.activity.end_time) {
                        new H.countdown({
                            start: this.state.data.server_time,
                            end: this.state.data.activity.end_time,
                            callback: this.updateTime
                        });
                    }
                    setTimeout(() => {
                        this.scrollRefresh();
                        H.focusImg({box: '#goods_big_pic'});
                    }, 50);

                    //当商品基本信息获取完成之后，再预加载评价及供应商信息数据
                    let param = {
                        goods_id: res.data.goods.goods_id
                    };

                    //获取评价;
                    server.evaluate(param, (res) => {
                        if(res.code == 0) {
                            this.setState({
                                evaluationData: res.data,
                                infoStatus: status
                            });
                        }else {
                            H.operationState(res.message);
                        }
                    });

                    //获取供应商信息;
                    server.getSellerShopInfo(param, (res) => {
                        if(res.code == 0) {
                            this.setState({
                                supplierData: res.data,
                                infoStatus: status
                            });
                        }else {
                            H.operationState(res.message);
                        }
                    });
                });
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    componentDidMount() {
        this.scrollCreator();
    }

    scrollCreator() {
        // 创建iscroll实例
        var wrapper = document.getElementById('goods_info_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true
            });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        //SCROLL.on('scroll', () => {
        //    this.scrollRefresh();
        //});
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    //生成商品或者评价或者供应商;
    createTabContent() {
        let infoStatus = this.state.infoStatus,
            infoXml = '';
        if(infoStatus == 0) {
            infoXml = (<Details scrollRefresh={this.scrollRefresh} data={this.state.detailsData} watermark={this.state.watermark} />);
        }else if(infoStatus == 1) {
            infoXml = (<Evaluation scrollRefresh={this.scrollRefresh} data={this.state.evaluationData} />);
        }else if(infoStatus == 2) {
            infoXml = (<Supplier scrollRefresh={this.scrollRefresh} data={this.state.supplierData} />);
        }
        return infoXml;
    }

    //切换商品详情、评价、供应商的事件;
    tabHandler(status) {
        this.setState({infoStatus: status});
    }

    //时间更新倒计时;
    updateTime(time) {
        if(time == '00 : 00 : 00') {
            this.setState({
                countdownTime: time,
                goodsStatus: 0
            });
        }else {
            this.setState({countdownTime: time});
        }
    }

    //加入常购，更改常购状态;
    setGoodsEnshrine() {
        H.we_loading.show();
        if(this.state.goodsEnshrine == 0) {  //等于0表示未加入常购，执行加入常购操作;
            H.server.addOftenBuyGoods({goods_id: this.props.goodsId}, (res) => {
                if(res.code == 0) {
                    this.props.goodsInfoPage && this.props.goodsInfoPage(this.props.goodsId, 1);
                    this.setState({goodsEnshrine: 1});
                    H.operationState('加入常购成功');
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else {
            H.server.delOftenBuyGoods({goods_id: this.props.goodsId}, (res) => {
                if(res.code == 0) {
                    this.props.goodsInfoPage && this.props.goodsInfoPage(this.props.goodsId, 0);
                    this.setState({goodsEnshrine: 0});
                    H.operationState('取消常购成功');
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }
    }

    //跳到大图的位置;
    gotoBigPic() {
        this.tabHandler(0);
        let top = $('#goods_info_content')[0].offsetTop;
        this.state.SCROLL.scrollTo(0, -top, 600, IScroll.utils.ease.circular);
    }

    //生成dom;
    createGoodsInfo() {
        if(!this.state.data) return '';
        let brWidth = document.documentElement.clientWidth,  //屏幕宽;
            data = this.state.data,  //商品信息;
            imgList = [],     //图片列表;
            activity = '';    //活动;

        for(let i in data.goods.goods_image) {  //循环生成图片列表;
            imgList.push(
                <li className="flex-num1" data-index={i} style={{width: brWidth}} onClick={this.gotoBigPic.bind(this)}>
                    <img data-url={H.localhost + data.goods.goods_image[i]+ H.imgSize()[640] + this.state.watermark} src={H.defaultImg()[1]}/>
                </li>
            );
        }
        if(data.goods.inspection_report) {  //如果该商品有检验报告图片，就把检验报告图片加在图片列表后面;
            imgList.push(
                <li className="flex-num1" data-index={data.goods.goods_image.length} style={{width: brWidth}} onClick={this.gotoBigPic.bind(this)}>
                    <img data-url={H.localhost + data.goods.inspection_report+ H.imgSize()[640] + this.state.watermark} src={H.defaultImg()[1]}/>
                </li>
            );
        }

        if(data.activity.type == 2) {
            activity = (
                <div className="by-the-time">
                    <span className="label-icon">团购</span>
                    <p className="end-time">活动截止：<span id="countdown">{this.state.countdownTime}</span></p>
                </div>
            );
        }

        let sliderLeft = {left: 0};
        if(this.state.infoStatus == 0) {
            sliderLeft.left = 0;
        }else if(this.state.infoStatus == 1) {
            sliderLeft.left = '33.3333%';
        }else {
            sliderLeft.left = '66.66666%';
        }

        let xml = (
            <div>
                <div id="goods_big_pic" className="goods-big-pic">
                    <ul className="flex-box flex-end" style={{width: (brWidth * imgList.length)}}>
                        {imgList}
                    </ul>
                    <div id="num" className="goods-pic-num">1/4</div>
                </div>
                <div className="basic-info">
                    <div className="title">
                        {
                            data.activity.type == 2 ? <span className="label-icon">团购</span> : ''
                        }
                        <p className="title-txt">
                            {data.details.goods_title ? data.details.goods_title : data.details.goods_name + '' + data.details.goods_brand + '' + data.details.goods_guigei + '' + data.details.goods_xinghao}
                        </p>
                        <div className="price flex-box center color-orange">
                            <div className="flex-num1">￥<span className="price-num">{data.goods.goods_price}</span>/件</div>
                            <div className="sales">已售：{data.goods.goods_sell_num}件</div>
                        </div>
                    </div>
                    <div className="describe">
                        {
                            data.goods.goods_description && data.goods.goods_description != '' ? <p>描述：{data.goods.goods_description}</p> : ''
                        }
                        {
                            data.goods.goods_rough_weight && data.goods.goods_rough_weight != '' ? <p>毛量：{data.goods.goods_rough_weight}Kg</p> : ''
                        }
                        {
                            data.goods.goods_net_weight && data.goods.goods_net_weight != '' ? <p>净量：{data.goods.goods_net_weight}</p> : ''
                        }
                        {
                            data.goods.goods_meat_weight && data.goods.goods_meat_weight != '' ? <p>解冻后约：{data.goods.goods_meat_weight}Kg</p> : ''
                        }
                    </div>
                </div>
                {activity}
                <div className="goods-info-content" id="goods_info_content">
                    <div className="tab flex-box">
                        <a className="flex-num1" onClick={this.tabHandler.bind(this, 0)}>
                            <i className={this.state.infoStatus == 0 ? 'tab-btn active' : 'tab-btn'}>商品详情</i>
                        </a>
                        <a className="flex-num1" onClick={this.tabHandler.bind(this, 1)}>
                            <i className={this.state.infoStatus == 1 ? 'tab-btn active' : 'tab-btn'}>评价（{data.details.goods_grade_count <= 99 ? data.details.goods_grade_count : '99+' }）</i>
                        </a>
                        <a className="flex-num1" onClick={this.tabHandler.bind(this, 2)}>
                            <i className={this.state.infoStatus == 2 ? 'tab-btn active' : 'tab-btn'}>供应商</i>
                        </a>
                        <span className="slider" style={sliderLeft}>
                        </span>
                    </div>
                    <div className="tab-content">
                        {this.createTabContent()}
                    </div>
                </div>
            </div>
        );
        return xml;
    }

    //咨询点击事件;
    consultingHandler(e) {
        e.stopPropagation();
        H.we_loading.show();
        H.server.getConsultInfo({goods_id: this.state.data.goods.goods_id}, (res) => {
            if(res.code == 0) {
                H.sheet.consulting(res.data);
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    render() {
        return (
            <div className="goods-info-page">
                <div id="goods_info_wrap" className="goods-info-wrap">
                    <div id="goods_info_scroll" className="scroller">
                        {this.createGoodsInfo()}
                    </div>
                </div>
                {
                    this.state.data ?
                        <GoodsInfoFooter
                            goodsEnshrine={this.state.goodsEnshrine}
                            setGoodsEnshrine={this.setGoodsEnshrine}
                            consultingHandler={this.consultingHandler}
                            carData={this.props.carData}
                            isTourists={this.state.data.visitor_status}
                            goodsId={this.props.goodsId}
                            goodsStatus={this.state.goodsStatus}
                            isSeller={this.state.data.isSeller}
                        /> : ''
                }
            </div>
        );
    }
}

export default GoodsInfo;