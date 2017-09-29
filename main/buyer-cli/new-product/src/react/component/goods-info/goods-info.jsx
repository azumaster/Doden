/*
* 商品详情页面;
* */

import Supplier from './supplier.jsx';
import Evaluation from './evaluation.jsx';
import Details from './Details.jsx';
import GoodsInfoFooter from './goods-info-footer.jsx';
import Comments from './comments.jsx';

class GoodsInfo extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      SCROLL: null,
      infoStatus: -1,  //0为商品详情，1为评价，2为供应商
      data: null,   //商品信息;
      detailsData: null,   //商品细节;
      evaluationData: {      //商品评价;
        data: [],     //评价列表;
        diffGrade: {}     //评价数量;
      },
      goodsId: this.props.goodsId, // 商品ID;
      supplierData: null,   //供应商信息;
      countdownTime: '',    //商品倒计时;
      goodsEnshrine: 0,   //是否加入常购;
      goodsStatus: 1,  //活动是否结束，0表示活动已结束，当倒计时跑完时状态改为0;
      watermark: '',  //图片水印;
      userShopType: null   //用户店铺类型;
    };
    this.createTabContent = this.createTabContent.bind(this);
    this.scrollRefresh = this.scrollRefresh.bind(this);
    this.createGoodsInfo = this.createGoodsInfo.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.setGoodsEnshrine = this.setGoodsEnshrine.bind(this);
    this.consultingHandler = this.consultingHandler.bind(this);
  }

  //获取OSS的图片请求水印;
  getOssImagesWatermark () {
    if (H.localhost.indexOf('192.168.') === -1) {  //不是本地开发环境才加图片加水印;
      H.server.getOssImagesWatermark({}, (res) => {
        if (parseInt(res.code) === 0) {
          this.setState({watermark: res.data.images_watermark});
        } else {
          H.operationState(res.message);
        }
      });
    }
  }

  componentWillMount () {
    this.getOssImagesWatermark();
    let server = H.server,
      param = {
        goods_id: this.state.goodsId
      };
    H.we_loading.show();

    //获取商品详情的数据;
    server.getGoodsInfo(param, (res) => {
      if (res.code == 0) {
        //设置分享内容;
        H.share.changeShare({
                              img: H.localhost + res.data.goods.goods_image[0] + H.imgSize()[110],
                              url: window.location.host + '/show_page.php?pageTag=5&gid=' + this.state.goodsId,
                              title: '【找冻品网】' + res.data.details.goods_title,
                              desc: '（' + res.data.details.goods_name + '）支持在线下单了，平台补贴进行中，使用“钻石”即可减免10元。'
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
          if (this.state.data.activity.type != 1 && this.state.data.activity.end_time) {
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

          //获取供应商信息;
          server.getSellerShopInfo(param, (res) => {
            if (res.code == 0) {
              this.setState({
                supplierData: res.data,
                infoStatus: status
              });
            } else {
              H.operationState(res.message);
            }
          });

          //获取当前访问用户信息;
          server.getInfo({}, (res) => {
            if (res.code == 0) {
              this.state.userShopType = res.data.shop_infos.shop_type_number;
            } else {
              H.operationState(res.message);
            }
          });
        });
      } else {
        H.operationState(res.message);
      }
      H.we_loading.hide();
    });

    //获取评价;
    server.getAppraiseGoods({good_id: this.state.goodsId, page_size: 1, page_num: 1, type: 1}, (res) => {
      if (res.code == 0) {
        this.setState({
          evaluationData: res.data
        });
      } else {
        H.operationState(res.message);
      }
    });
  }

  componentDidMount () {
    this.scrollCreator();
  }

  scrollCreator () {
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
    document.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, false);
    SCROLL.on('scroll', () => {
      SCROLL.refresh();
    });
  }

  scrollRefresh () {
    this.state.SCROLL.refresh();
  }

  //生成商品或者评价或者供应商;
  createTabContent () {
    let infoStatus = this.state.infoStatus,
      infoXml = '';
    if (infoStatus == 0) {
      infoXml = (<Details scrollRefresh={this.scrollRefresh} data={this.state.detailsData}
                          watermark={this.state.watermark} goods={this.state.data.goods}/>);
    } else if (infoStatus == 1) {
      infoXml = (<Evaluation scrollRefresh={this.scrollRefresh} data={this.state.evaluationData}/>);
    } else if (infoStatus == 2) {
      infoXml = (<Supplier scrollRefresh={this.scrollRefresh} data={this.state.supplierData}/>);
    }
    return infoXml;
  }

  //切换商品详情、评价、供应商的事件;
  tabHandler (status) {
    this.setState({infoStatus: status});
  }

  //时间更新倒计时;
  updateTime (time) {
    if (time == '00 : 00 : 00') {
      this.setState({
                      countdownTime: time,
                      goodsStatus: 0
                    });
    } else {
      this.setState({countdownTime: time});
    }
  }

  //加入常购，更改常购状态;
  setGoodsEnshrine () {
    H.we_loading.show();
    if (this.state.goodsEnshrine == 0) {  //等于0表示未加入常购，执行加入常购操作;
      H.server.addOftenBuyGoods({goods_id: this.state.goodsId}, (res) => {
        if (res.code == 0) {
          this.props.goodsInfoPage && this.props.goodsInfoPage(this.state.goodsId, 1);
          this.setState({goodsEnshrine: 1});
          H.operationState('加入常购成功');
        } else {
          H.operationState(res.message);
        }
        H.we_loading.hide();
      });
    } else {
      H.server.delOftenBuyGoods({goods_id: this.state.goodsId}, (res) => {
        if (res.code == 0) {
          this.props.goodsInfoPage && this.props.goodsInfoPage(this.state.goodsId, 0);
          this.setState({goodsEnshrine: 0});
          H.operationState('取消常购成功');
        } else {
          H.operationState(res.message);
        }
        H.we_loading.hide();
      });
    }
  }

  //跳到大图的位置;
  gotoBigPic () {
    this.tabHandler(0);
    let top = $('#goods_info_content')[0].offsetTop;
    this.state.SCROLL.scrollTo(0, -top, 600, IScroll.utils.ease.circular);
  }

  jump(status, e) {
    this.state.status = status;
    window.location.href = '#' +e.target.dataset.hash;
  }
  //生成dom;
  createGoodsInfo () {
    if (!this.state.data) return '';
    let brWidth = document.documentElement.clientWidth,  //屏幕宽;
      data = this.state.data,  //商品信息;
      imgList = [],     //图片列表;
      activity = '';    //活动;

    for (let i in data.goods.goods_image) {  //循环生成图片列表;
      imgList.push(
        <li className="flex-num1" data-index={i} style={{width: brWidth}} onClick={this.gotoBigPic.bind(this)}>
          <img data-url={H.localhost + data.goods.goods_image[i] + H.imgSize()[640] + this.state.watermark}
               src={H.defaultImg()[1]}/>
        </li>
      );
    }
    if (data.goods.inspection_report) {  //如果该商品有检验报告图片，就把检验报告图片加在图片列表后面;
      imgList.push(
        <li className="flex-num1" data-index={data.goods.goods_image.length} style={{width: brWidth}}
            onClick={this.gotoBigPic.bind(this)}>
          <img data-url={H.localhost + data.goods.inspection_report + H.imgSize()[110] + this.state.watermark}
               src={H.defaultImg()[1]}/>
        </li>
      );
    }

    if (data.activity.type == 2) {
      activity = (
        <div className="by-the-time">
          <span className="label-icon">团购</span>
          <p className="end-time">活动截止：<span id="countdown">{this.state.countdownTime}</span></p>
        </div>
      );
    }

    let sliderLeft = {left: 0};
    if (this.state.infoStatus == 0) {
      sliderLeft.left = 0;
    } else if (this.state.infoStatus == 1) {
      sliderLeft.left = '33.3333%';
    } else {
      sliderLeft.left = '66.66666%';
    }

    let priceRule = data.price_rules,
      priceRuleXml = [];
    for (let i = 0; i < priceRule.length; i++) {
      priceRuleXml.push(
        <div key={'r' + i} className="preferential-item flex-box">
          <div className="preferential-label">{priceRule[i].rule_type}</div>
          <div className="flex-num1">
            {
              priceRule[i].rules.map((val, index) => {
                return (
                  <span key={'ri' + index}
                        className="item">{'买' + val.buy_num + data.goods.goods_unit + '合计' + priceRule[i].rule_type + val.preferential}</span>
                );
              })
            }
          </div>
        </div>
      );
    }
    let preferentialXml = (
      <div className="preferential">
        {priceRuleXml}
      </div>
    );
    if (priceRule.length <= 0) {
      preferentialXml = null;
    }

    let comment = (
      <div className="goods-detail-comment">
        <div className="goods-detail-comment-tab-title-list">
          <div
            className="goods-detail-comment-tab-title-item active"
            onClick={this.jump.bind(this, 1)}
          data-hash="comments">好评({this.state.evaluationData.diffGrade.goodCount})</div>
          <div
            className="goods-detail-comment-tab-title-item"
            onClick={this.jump.bind(this, 2)}
            data-hash="comments">中评({this.state.evaluationData.diffGrade.mediumCount})</div>
          <div
            className="goods-detail-comment-tab-title-item"
            onClick={this.jump.bind(this, 3)}
            data-hash="comments">差评({this.state.evaluationData.diffGrade.poorCount})</div>
          <div
            className="goods-detail-comment-tab-title-item"
            onClick={this.jump.bind(this, 5)}
            data-hash="comments">有图({this.state.evaluationData.diffGrade.imgCount})</div>
        </div>
        {
          this.state.evaluationData.data[0] ?
              <div className="goods-detail-comment-tab-content">
                <div className="member-info">
                  <div className="member-avatar">
                    <img src={this.state.evaluationData.data[0] && this.state.evaluationData.data[0].buyer.unionPic} alt=""/>
                  </div>
                  <div className="member-username">
                    {this.state.evaluationData.data[0] && this.state.evaluationData.data[0].buyer.unionName}
                  </div>
                </div>
                <div className="comment-content">
                  {this.state.evaluationData.data[0] && this.state.evaluationData.data[0].content}
                </div>
                <div className="more-comment">
                  <div className="button"
                       onClick={this.jump.bind(this, 1)}
                       data-hash="comments">查看全部</div>
                </div>
              </div> : <div className="goods-detail-comment-tab-content"><p style={{marginTop: '3rem', textAlign: 'center'}}>暂无评价</p></div>
        }

      </div>
    );

    let xml = (
      <div>
        <div id="goods_big_pic" className="goods-big-pic">
          <ul className="flex-box flex-end" style={{width: (brWidth * imgList.length)}}>
            {imgList}
          </ul>
          {!H.browser.versions.ios ? <a className="goods-info-back" href="javascript: history.back();"></a> : null}
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
              <div className="flex-num1"><span className="price-item">￥<span
                className="price-num">{data.goods.goods_price}</span></span>/{data.goods.goods_unit}</div>
              <div className="sales">已售：{data.goods.goods_sell_num}件</div>
            </div>
          </div>
          {preferentialXml}
        </div>
        {comment}
        {activity}
        <div className="goods-info-content" id="goods_info_content">
          {/*<div className="tab flex-box">*/}
          {/*<a className="flex-num1" onClick={this.tabHandler.bind(this, 0)}>*/}
          {/*<i className={this.state.infoStatus == 0 ? 'tab-btn active' : 'tab-btn'}>商品详情</i>*/}
          {/*</a>*/}
          {/*<a className="flex-num1" onClick={this.tabHandler.bind(this, 1)}>*/}
          {/*<i className={this.state.infoStatus == 1 ? 'tab-btn active' : 'tab-btn'}>评价（{data.details.goods_grade_count <= 99 ? data.details.goods_grade_count : '99+' }）</i>*/}
          {/*</a>*/}
          {/*<a className="flex-num1" onClick={this.tabHandler.bind(this, 2)}>*/}
          {/*<i className={this.state.infoStatus == 2 ? 'tab-btn active' : 'tab-btn'}>供应商</i>*/}
          {/*</a>*/}
          {/*<span className="slider" style={sliderLeft}>*/}
          {/*</span>*/}
          {/*</div>*/}
          <span style={{
            marginLeft: '5px',
            marginTop: '10px'
          }}>商品详情</span>
          <div className="tab-content">
            {this.createTabContent()}
          </div>
        </div>
      </div>
    );
    return xml;
  }

  //咨询点击事件;
  consultingHandler (e) {
    e.stopPropagation();
    if (this.state.data.visitor_status == 2) {
      H.sheet.promptLogin();
      return;
    }
    H.we_loading.show();
    H.server.getConsultInfo({goods_id: this.state.data.goods.goods_id}, (res) => {
      if (res.code == 0) {
        if (this.state.userShopType != 25) {
          let obj = res.data;
          obj.id = this.state.data.goods.goods_id;
          obj.title = this.state.data.details.goods_title;
          H.sheet.sendGoodsConsultNotice(obj);
        } else {
          H.sheet.consulting(res.data);
        }
      } else {
        H.operationState(res.message);
      }
      H.we_loading.hide();
    });
  }


  render () {
    let url = location.hash.substr(1),
        comments = null;
      if(url.indexOf('comments') != -1) {
          comments = <Comments goodsId={this.state.goodsId} status={this.state.status || 1} />;
      }
    return (
      <div className="goods-info-page">
        <div id="goods_info_wrap" className="goods-info-wrap">
          <div id="goods_info_scroll" className="scroller">
            {this.createGoodsInfo()}
          </div>
        </div>
        {comments}
        {
          this.state.data ?
            <GoodsInfoFooter
              goodsEnshrine={this.state.goodsEnshrine}
              setGoodsEnshrine={this.setGoodsEnshrine}
              consultingHandler={this.consultingHandler}
              carData={this.props.carData}
              goodsId={this.state.goodsId}
              goodsStatus={this.state.goodsStatus}
              data={this.state.data}
              supplierData={this.state.supplierData}
            /> : ''
        }
      </div>
    );
  }
}

export default GoodsInfo;
