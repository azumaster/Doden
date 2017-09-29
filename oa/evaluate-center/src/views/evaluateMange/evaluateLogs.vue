<template>
    <div id="evaluateLogs">
        <div class="page-operate">
            <Button type="text" icon="ios-arrow-back" @click="back">返回</Button>
            <p class="inner-title">操作日志</p>
        </div>
        <div class="context" v-for="item in data">
            <h2>本次编辑人员：{{item.dispose_person_name}}保存时间：{{item.dispose_time.date}}</h2>
            <h4>订单编号：{{params.orderIds}}</h4>
            <div class="good" v-for="it in item.appraise_data.goods_appraise">
                <div class="good goodhead"><p><b>商品名称</b><span>{{it.name}}</span></p><p>数量价格{{it.buy_num}}*{{it.good_new_price}} = {{it.count_price}}</p></div>
                <Radio-group v-model="it.quality">
                    <Radio label=5 disabled>好评</Radio>
                    <Radio label=3 disabled>中评</Radio>
                    <Radio label=1 disabled>差评</Radio>
                </Radio-group>
                <div class="good"><Input v-model="it.content" type="textarea" disabled  :rows="4" placeholder="请输入..."></Input></div>
                <div class="img"><img v-for="img in it.img" :src="'http://img.idongpin.com/'+img.img_url"/></div>
            </div>
            <div class="good shopevaluate">
            <p class="good">店铺评价</p>
            <div class="good">
                 <Radio-group v-model="item.appraise_data.shop_appraise.delivery_speed">
                    <Radio label=1 disabled>龟速</Radio>
                    <Radio label=2 disabled>较慢</Radio>
                    <Radio label=3 disabled>一般</Radio>
                    <Radio label=4 disabled>及时</Radio>
                    <Radio label=5 disabled>神速</Radio>
                </Radio-group>
            </div>
            <div class="good">
                 <Radio-group v-model="item.appraise_data.shop_appraise.sell_service">
                    <Radio label=1 disabled>恶劣</Radio>
                    <Radio label=2 disabled>冷淡</Radio>
                    <Radio label=3 disabled>一般</Radio>
                    <Radio label=4 disabled>友善</Radio>
                    <Radio label=5 disabled>热情</Radio>
                </Radio-group>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'evaluateLogs',
  data () {
        return {
            name: 123,
            time: '2017-01-01 12:20',
            goodname: 'asd',
            goodnum: 2,
            goodjiage: 100,
            goodstotal: 200,
            quality: 3,
            params: {
                orderIds: 0
            },
            data: {}
        }
  },
  methods: {
       back () {
            window.location.href = '/html/evaluate-center/index.html#/evaluateMain'
        },
        getLogsData () {
            req.getLogs(this, this.params, (res) => {
                if (res.code ==0) {
                    console.log(res.data);
                    this.data = res.data;
                }
            });
        }
  },
  created () {
      this.params.orderIds = this.$store.state.orderIds;
      this.getLogsData();
  }
}
</script>
<style lang="less" >
    #evaluateLogs {
        .page-operate{
            display: flex;
            p{line-height: 32px;padding-left: 10px;}
        }
        .context {
            padding: 20px 0;
            padding-right: 35%;
            .good {padding: 20px 0;}
            .goodhead {
                display: flex;
                justify-content: space-between;
            }
        }
        // .img{width: 200px;height: 200px;border: 1px solid red}
        .ivu-radio-disabled .ivu-radio-inner:after {background: #2d8cf0 !important}
        .ivu-input-disabled{background-color: #f5f5f5;color: #495060}
        .img{display: flex;}
        .img img {width: 200px;height: 200px;margin-right: 20px;}
    }
</style>