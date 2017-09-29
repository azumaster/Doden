import React from 'react';
import Star from '../../components/star/star.jsx';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsInfo: [],
            hash: '',
            starArr: {},
            scroller: {},
            browser: '',
            goodsAppraises: [],
            data: {
                goods_infos: [],
                order_infos: {
                    order_appraise: ''
                }
            }
        };
    }

    scrollCreator = () => {
        // 创建iscroll实例
        var wrapper = document.getElementById('wrapper');
        var myScroll = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                click: true,
                topOffset: 50
            });
        this.state.SCROLL = myScroll;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    componentWillMount = () => {
        let browser={
            versions:function(){
                var u = navigator.userAgent;
                    //app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核;
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == 'qq' //是否QQ
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        };

        this.setState({browser: browser});
    }

    componentDidMount = () => {
        this.scrollCreator();
        this.getData();
    }

    componentDidUpdate() {
        this.state.SCROLL.refresh();
    }

    //获取订单商品列表;
    getData (){
        let hash = window.location.href.split('#')[1] || '',
            server = H.server;
        this.state.hash = hash;
        H.we_loading.show();
        server.order_appraise_list({sub_order_no: hash}, (res) => {
            H.we_loading.hide();
            if( res.code == 0 ) {
                this.setState({
                    goodsInfo: res.data.goods_infos,
                    data: res.data
                });
            }else {
                alert(res.message);
            }
        });
    }

    //删除商品的评价
    delGoodsStar = (o) => {
        let p = {
            sub_order_no: this.state.param.sub_order_no,
            order_goods_id: o.order_goods_id
        },
            server = H.server,
            _this = this;
        let dialog = H.dialog({
            title: '删除评价',
            autoClose: false,
            content: '<p>删除后，评价不可二次修改</br>请您谨慎操作</p>',
            okCallback() {
                var goodsArr = _this.state.goodsInfo;
                server.order_goods_appraise_del(p, (res) => {
                    if(res.code == 0) {
                        for(let i = 0 ; i < goodsArr.length ; i++) {
                            if(goodsArr[i].goods_id == o.goods_id) {
                                goodsArr[i].goods_appraise.status = 2;
                                _this.setState({goodsInfo: goodsArr});
                            }
                        }
                        dialog.reRender({
                            title: '删除成功',
                            content: '评价已删除，其它人将看不到此评价',
                            autoClose: true,
                            okText: '关闭'
                        });
                    }else {
                        dialog.reRender({
                            content: '<p>' + res.message + '</p>',
                            okText: '关闭'
                        });
                    }
                });
            },
            cancel: true,
            cancelCallback() {
                dialog.destroy();
            }
        });
    };

    //提交订单的评价;
    subOrderStar = () => {
        if(!this.state.starArr[0] || !this.state.starArr[1]){
            H.dialog({
                'title': '提交失败',
                'content': '<p style="text-align: center">请先为服务评价打分,再提交</p>'
            });
            return;
        }
        let textDom = document.getElementsByClassName('textVal'),
            data = this.state.data,
            starArr = this.state.starArr,
            p = {
                sub_order_no: data.order_infos.sub_order_no,
                sell_shop_id: data.order_infos.sell_shop_id,
                shop_appraises: {
                    sell_service: starArr[1],
                    delivery_speed: starArr[0]
                },
                goods_appraises: []
            },
            server = H.server;
        for(let i = 0 ; i < textDom.length ; i++) {
            let goodsId = textDom[i].dataset.id;
            if(starArr[goodsId]) {
                p.goods_appraises.push({
                    goods_id: goodsId,
                    order_goods_id: textDom[i].dataset.order,
                    quality: starArr[goodsId]
                });
            }else {
                H.dialog({
                    'title': '提交失败',
                    'content': '<p style="text-align: center">您还有货品品质未打分。</p>'
                });
            }
        }
        server.orderAppraise(JSON.stringify(p), (res) => {
            if(res.code == 0) {
                H.dialog({
                    'title': '提交成功',
                    'content': '系统奖励您'+res.data.reward+'钻石，下次买货可以抵扣现金'
                });
                data.order_infos.order_appraise = p.shop_appraises;
                this.getData();
            }else {
                H.dialog({
                    'title': '提交失败',
                    'content': res.message
                });
            }
        });
    };

    //点击星星记录到starArr里;
    starHandler = (n, id) => {
        let objs = {},
            obj = {};
        objs[id] = n;
        $.extend(obj, this.state.starArr, objs);
        this.setState({starArr: obj});
    };

    render = () => {
        let backXml = '',
            data = this.state.data,
            wrapperStyle = {};
        if(this.state.browser != '') {
            if(!this.state.browser.versions.ios) {
                backXml = (
                    <div className="back-bar"><a href="/index.php?m=PublicTemplate&c=ApiPublic&a=buyerOrder#has-delivered" className="back before-back">返回</a></div>
                );
                wrapperStyle = {
                    top: '36px',
                    bottom: '0px'
                };
            }else {
                wrapperStyle = {
                    top: '0px',
                    bottom: '0px'
                };
            }
        }
        return (
            <div>
                {backXml}
                <div id="wrapper" style={wrapperStyle}>
                    <div id="scroller">
                        <ul>
                            {
                                this.state.goodsInfo.map((val, index) => {
                                    return (
                                        <li className="comment-list" key={index}>
                                            <div className="flex-box">
                                                <img className="goods-img" src={'http://img.idongpin.com/'+val.picture+'@100w_90Q.jpg'} />
                                                {/*<img className="goods-img" src={val.picture} />*/}
                                                <div className="goods-info">
                                                    <p className="title">{val.name}</p>
                                                    <p className="goods-num">{val.price}元*{val.buy_number}件={val.total_price}元</p>
                                                </div>
                                            </div>
                                            <div className="msg-warp">
                                                {
                                                    !data.order_infos.order_appraise ?
                                                        <textarea className="textarea textVal" placeholder="请在此评价商品（100字以内）"
                                                                  data-id={val.goods_id}
                                                                  data-order={val.order_goods_id}>
                                                        </textarea>
                                                        : val.goods_appraise.content || '无评价内容'
                                                }
                                            </div>
                                            <div className="star-warp"><div className="flex-num1">货品品质：</div>
                                                <Star size="1" val={val.goods_appraise.quality}
                                                      goodsId={val.goods_id}
                                                      starEv={this.starHandler}
                                                      arr={['超差', '差', '一般', '好', '超好']}/>
                                            </div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <div className="serve-comment">
                            <div className="title flex-box">
                                <div className="text">店铺评价：</div>
                            </div>
                            <div className="synthesis" key={data.order_infos.order_appraise.delivery_speed}>
                                <div className="star-warp"><div className="flex-num1">发货速度：</div>
                                    <Star size="2" val={data.order_infos.order_appraise.delivery_speed} goodsId="0" starEv={this.starHandler} arr={['超慢', '慢', '一般', '快', '超快']} />
                                </div>
                                <div className="star-warp"><div className="flex-num1">服务态度：</div>
                                    <Star size="2" val={data.order_infos.order_appraise.sell_service} goodsId="1" starEv={this.starHandler} arr={['超差', '差', '一般', '好', '超好']}/>
                                </div>
                            </div>
                        </div>
                        {
                            !data.order_infos.order_appraise ?
                                <div className="star-sub-info">
                                    <a className="sub-info" onClick={this.subOrderStar}>提交</a>
                                </div> : null
                        }
                        <div className="footer_c">您的评价会影响卖家的等级和诚信度</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Comment;