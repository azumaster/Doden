<template>
  <div class="body">
    <div class="body-content">
      <div class="top-status">
        <div class="status-item">
          <div class="status-item-left">
            <span style="color: #249af9">买家已确认收货</span>
          </div>
        </div>
        <div class="status-item">
          <div class="status-item-left">
            订单编号: 23453246534234533
          </div>
          <div class="status-item-right">
            <span>复制编号</span>
          </div>
        </div>
      </div>
      <div class="time-axis">
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">创建订单 2017-08-18 12:09:27</div>
          </div>
          <div class="item-content">
            <div class="goods-info">
              <div class="shop-title">
                <div class="desc">购买商品</div>
                <div class="name">
                  <div class="iconfont">&#xe736;</div>
                  <div class="text">山河食品山河食品山河食品</div>
                </div>
              </div>
              <div
                v-for="i in 3"
                class="goods-item">
                <div class="thumb"></div>
                <div class="title">
                  渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg
                </div>
                <div class="price-nums">
                  <div class="price">￥200.00</div>
                  <div class="nums">×5</div>
                </div>
              </div>
              <div class="statistics">
                <span class="sub">(不含运费)</span>
                <span class="price">￥400.00</span>
                <span>共2件商品 优惠10元 合计:</span>
              </div>
            </div>
            <div class="pay-method">
              <div class="left">支付方式</div>
              <div class="right">银行卡快捷支付</div>
            </div>
            <div class="receiving-mode">
              <div class="receiving-item">
                <div class="item-title">收货方式:</div>
                <div class="item-text">
                  <div class="call">
                    <div class="iconfont">&#xe60a;</div>
                    <span>联系司机</span>
                  </div>
                  <span>买家找车</span>
                </div>
              </div>
              <div class="receiving-item">
                <div class="item-title">司机电话:</div>
                <div class="item-text">13123144888</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">车牌号码:</div>
                <div class="item-text">川A888888</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">装车时间:</div>
                <div class="item-text">2017-06-06 23:00</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">装车位置:</div>
                <div class="item-text">冻库C2门口</div>
              </div>
            </div>
            <div class="receiving-mode">
              <div class="receiving-item">
                <div class="item-title">收货方式:</div>
                <div class="item-text">卖家找车</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">收货信息:</div>
                <div class="item-text">张三 13123144888</div>
              </div>
              <div class="receiving-item">
                <div class="item-text">四川省 成都市 武侯区 创业路49号(火炬大厦对面)</div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">支付成功 2017-08-18 12:09:27</div>
          </div>
          <div class="item-content">
          </div>
        </div>
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">买家申请退货 2017-08-18 12:09:27</div>
          </div>
          <div class="item-content">
            <div class="goods-info">
              <div class="shop-title">
                <div class="desc">退货商品</div>
                <div class="name">
                  <div class="iconfont">&#xe736;</div>
                  <div class="text">山河食品山河食品山河食品</div>
                </div>
              </div>
              <div
                v-for="i in 3"
                class="goods-item">
                <div class="thumb"></div>
                <div class="title">
                  渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg
                </div>
                <div class="price-nums">
                  <div class="price">￥200.00</div>
                  <div class="nums">×5</div>
                </div>
              </div>
              <div class="statistics">
                <span class="sub">(不含运费)</span>
                <span class="price">￥400.00</span>
                <span>共2件商品 优惠10元 合计:</span>
              </div>
              <div class="return-reason">
                <span>买家退货原因</span>
                <p>商品不是很新鲜,规格也不一样,品质感觉一般商品不是很新鲜,规格也不一样,品质感觉一般商品不是很新鲜,规格也不一样,品质感觉一般</p>
                <span>退货凭证</span>
                <div class="return-voucher">
                  <div class="thumb"></div>
                  <div class="thumb"></div>
                  <div class="thumb"></div>
                  <div class="thumb"></div>
                  <div class="thumb"></div>
                  <div class="thumb"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">卖家申请取消订单 2017-08-18 12:09:27</div>
          </div>
          <div class="item-content">
            <div class="goods-info">
              <div class="shop-title">
                <div class="desc">取消商品</div>
                <div class="name">
                  <div class="iconfont">&#xe736;</div>
                  <div class="text">山河食品山河食品山河食品</div>
                </div>
              </div>
              <div
                v-for="i in 3"
                class="goods-item">
                <div class="thumb"></div>
                <div class="title">
                  渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg渝达鸭肠16kg
                </div>
                <div class="price-nums">
                  <div class="price">￥200.00</div>
                  <div class="nums">×5</div>
                </div>
              </div>
              <div class="statistics">
                <span class="sub">(不含运费)</span>
                <span class="price">￥400.00</span>
                <span>共2件商品 优惠10元 合计:</span>
              </div>
              <div class="return-reason">
                <span>卖家取消订单</span>
                <p>对不起明天要刮好大好大的台风,所有今天不做生意</p>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">卖家发货 2017-08-18 12:09:27</div>
          </div>
          <div class="item-content">
            <div class="receiving-mode">
              <div class="receiving-item">
                <div class="item-title">收货方式:</div>
                <div class="item-text">
                  <div class="call">
                    <div class="iconfont">&#xe60a;</div>
                    <span>联系司机</span>
                  </div>
                  <!--<span>买家找车</span>-->
                </div>
              </div>
              <div class="receiving-item">
                <div class="item-title">司机电话:</div>
                <div class="item-text">13123144888</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">车牌号码:</div>
                <div class="item-text">川A888888</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">装车时间:</div>
                <div class="item-text">2017-06-06 23:00</div>
              </div>
              <div class="receiving-item">
                <div class="item-title">装车位置:</div>
                <div class="item-text">冻库C2门口</div>
              </div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">买家确认收货 2017-08-18 12:09:27</div>
          </div>
        </div>
        <div class="item real-last">
          <div class="status">
            <div class="status-node">
              <div class="mark">
                <div class="hollow-circle">
                  <div class="solid-circle"></div>
                </div>
              </div>
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="status-text">交易完成 2017-08-18 12:09:27</div>
          </div>
        </div>
      </div>
    </div>
    <div class="body-footer">

    </div>
  </div>
</template>
<script>

</script>
<style scoped lang="stylus" src="@styl/modules/order/order_detail.styl"></style>
