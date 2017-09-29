<template>
  <div id="tradeDetail">
      <h3>订单详情</h3>
      <div class="orderDetail">
          <p><span>{{statue}}</span><span>订单编号{{orderNum}}</span><span>订单ID{{orderID}}</span></p>
          <hr/>
          <!--此部分根据订单状态改变  -->
          <!--待付款显示的按钮组  -->
          <div class="good"><Button type="info">平台确认收款</Button><Button type="info">买家取消订单</Button></div>
          <hr/>
             <Steps :current="1" class="good" >
                <Step title="生成订单" icon="ionic" content="2017-06-23 12:34:45"></Step>
            </Steps>
      </div>
      <div class="goodsDetail">
          <p>商品信息</p>
           <Table border :columns="goodsDetailcolumns" :data="goodsDetaildata"></Table>
      </div>
      <div class="goodsDetail">
          <p>买家信息</p>
           <Table border :columns="buyercolumns" :data="buyerdata"></Table>
      </div>
      <div class="goodsDetail">
          <p>卖家信息</p>
           <Table border :columns="sellercolumns" :data="sellerdata"></Table>
      </div>
       <div class="goodsDetail">
          <p>物流信息</p>
           <Table border :columns="slogistics_seller" :data="logistics_seller_data"></Table>
      </div>
      <div class="goodsDetail">
          <p>物流信息</p>
          <Table border :columns="slogistics_buyer" :data="slogistics_buyer_data"></Table>
      </div> 
  </div>
</template>
<script>
export default {
  name: 'tradeDetail',
  data () {
      return {
        statue : '待付款',
        orderNum: 'sb',
        orderID: '250',
        goodsDetailcolumns: [{
                        title: '商品ID',
                        align: 'center',
                        key: 'goodID'
                    }, {
                        title: '商品标题',
                        align: 'center',
                        key: 'goodTitle'
                    }, {
                        title: '单价(元)',
                        align: 'center',
                        key: 'danjia'
                    }, {
                        title: '数量',
                        align: 'center',
                        key: 'num'
                    }, {
                        title: '优惠金额(元)',
                        align: 'center',
                        key: 'youhui'
                    }, {
                        title: '总价(元)',
                        align: 'center',
                        key: 'amout'
                    }],
        goodsDetaildata: [{goodID: 123, goodTitle: 'haha', danjia: 10, num: 2, youhui: 2, amout: 18}],
        buyercolumns: [{
                        title: '买家店铺名',
                         align: 'center',
                        key: 'buyershop'
                    }, {
                        title: '姓名',
                         align: 'center',
                        key: 'name'
                    }, {
                        title: '联系电话',
                         align: 'center',
                        key: 'tel'
                    }, {
                        title: '店铺地址',
                        width: '40%',
                        align: 'center',
                        key: 'addr'
                    }], 
        buyerdata: [{buyershop: '数鸭子', name: 'haha' , tel: 12345, addr: '武侯区'}],
        sellercolumns: [{
                        title: '卖家店铺名',
                        align: 'center',
                        key: 'sellershop'
                    }, {
                        title: '接单电话',
                        align: 'center',
                        key: 'jiedan'
                    }, {
                        title: '注册电话',
                        align: 'center',
                        key: 'tel'
                    }, {
                        title: '店铺地址',
                        width: '40%',
                        align: 'center',
                        key: 'addr'
                    }], 
        sellerdata: [{sellershop: '数鸭子', jiedan: 1234567890 , tel: 13332345, addr: '武侯区2234'}],
        slogistics_seller: [
            {
                        title: '物流方式',
                        key: 'way'
                    },
            {
                        title: '发货市场',
                        key: 'market'
                    },
            {
                        title: '司机电话',
                        key: 'tel'
                    },
            {
                        title: '车牌号码',
                        key: 'car'
                    },
            {
                        title: '收货人',
                        key: 'name'
                    },
            {
                        title: '收货电话',
                        key: 'shouhuotel'
                    },
            {
                        title: '收货地区',
                        key: 'area'
                    },
            {
                        title: '详细地址',
                        key: 'addr'
                    },
        ],
        logistics_seller_data: [{way: '卖家找车',market: '四川成都郫县海霸王', tel: '-', car: '-', name: 'add', shouhuotel: 12345566, area: '四川省内江市资中县', addr: '鱼溪镇牌坊社上街2号'}],
        slogistics_buyer: [
            {
                        title: '物流方式',
                        key: 'way'
                    },
            {
                        title: '发货市场',
                        key: 'market'
                    },
            {
                        title: '司机电话',
                        key: 'tel'
                    },
             {
                        title: '车牌号码',
                        key: 'carnum'
                    },
            {
                        title: '装车位置',
                        key: 'caraddr'
                    },
            {
                        title: '装车时间',
                        key: 'time'
                    }
        ],
        slogistics_buyer_data: [{way: '买家找车', market: '四川省成都市郫都区海霸王市场', tel: 18614028121, carnum: '川AA2433', caraddr: '冻库区A口', time:　'2017-03-08 9:00'}]
      }
  }
}
</script>
<style lang="less" >
    #tradeDetail {
        padding-left: 10px;
        h3{line-height: 60px;}
        .orderDetail{background: #f5f5f5;padding: 10px;
            p span {padding: 0 75px;}
        }
        .good{padding: 20px 0;}
        .ivu-steps .ivu-steps-title{background-color: #f5f5f5}
        .ivu-steps .ivu-steps-head{background-color: #f5f5f5}
        .ivu-icon-ionic:before{background-color: #f5f5f5}
        .goodsDetail{padding: 10px;
            p {line-height: 30px}
        }
    }
</style>

