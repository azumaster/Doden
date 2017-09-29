<template>
    <div id="buyer" class="buyer">
        <pageHead title="排行榜-卖家"></pageHead>
      
         <div class="page-filter">
                <div class="filter-group">
            <Date-picker type="datetimerange" placement="bottom-start" placeholder="默认为最近3天"
                                 style="width: 300px" @on-change="dateChange"></Date-picker>
            <Button type="primary" @click="select">确认筛选</Button>
       </div>
       </div>
 
        <Table :context="self" @on-sort-change="sortChange" :columns="seller_list_columns" :stripe=true :data="list" :border=true size="default"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div style="margin: 20px 0">
        <Page class='center' :total="total" @on-change="pageChange"></Page>
        </div>
        <!-- 弹出框 -->
         <Modal
            v-model="modal1"
            width="1090"
            title="卖家详情">
            <div>
                <br/>
                <Date-picker class="inline" type="datetime" :value="this.time[0]"  style="width: 200px" ></Date-picker>
                    至
                <Date-picker class="inline" type="datetime" :value="this.time[1]" style="width: 200px" ></Date-picker>
                <br/>
                <h3>店铺名称：{{this.spname}}</h3>
                <Table :columns="seller_detail_columns" :data="sellerdetail"></Table>
                <div style="margin: 20px 0">
                <Page class='center' :total="sellertotal" @on-change="pageChange"></Page>
                </div>
            </div>
        <Spin size="large" fix v-if="spinShow2"></Spin>
    </Modal>
    </div>
</template>

<script>
    import pageHead from '../../components/pageHead.vue';
   import Base from '../../common/base.js';
  // import BaseMock from '../../common/basemock.js';
    export default {
        mixins: [Base],
        components: {pageHead},
        data () {
            return {
                self: this,
                spinShow: true,
                spinShow2: true,
                spname:'',
                modal1: false,
                deal: 'deal_money',
                sellertotal: 1,
                total:1,
                time:[],
                list: [],
                param:{
                    type: 'seller',
                    page: 1,
                    size: 10
                },
                sellerdetail: [],
                seller_detail_columns: [
                    {title: '商品名', key: 'gname'},
                    {title: '下单件数', key: 'ordered_num'},
                    {title: '成交件数', key: 'deal_num'},
                    {title: '订单金额', key: 'ordered_money'},
                    {title: '成交金额', key: 'deal_money'},
                    {title: '总优惠金额', key: 'diff_money'},
                    {title: '支付率', key: 'percentage'}
                ],
                seller_list_columns: [
                    {'title': '卖家店铺名', 'fixed': 'left', 'align': 'center', 'key': 'name', 'width': 150},
                    {'title': '下单件数', 'align': 'center', 'key': 'ordered_num', 'width': 150},
                    {'title': '成交件数', 'align': 'center', 'key': 'deal_num', 'width': 150},
                    {'title': '订单金额(元)', 'align': 'center', 'key': 'ordered_money', 'width': 150},
                    {'title': '成交金额(元)', 'align': 'center', 'key': 'deal_money', sortable: 'custom', 'width': 150},
                    {'title': '总优惠金额', 'align': 'center', 'key': 'diff_money', 'width': 150},
                    {'title': '成交率', 'align': 'center', 'key': 'percentage', sortable: 'custom', 'width': 150},
                    {'title': '操作', 'align': 'center', 'key': 'action', 'width': 120, render (row, column, index) {
                        return `<i-button :context="self" type="primary" size="small" @click="showDetail(${index})">查看详情</i-button>`;}
                    }
                ]
            };
        },
        methods: {
            showDetail(index){
                var _this = this;
                _this.modal1 = true;
                _this.param.type = 'seller.detail';
                _this.param.other={shop_id: _this.list[index].shopId};
                _this.getSellerData();
            },
            getSellerData(){
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/groupon/rank',
                    body: _this.param,
                    header: 'Accept application/json'
                    }).then(response=>{
                        if(response.data.code == 0){
                            _this.spinShow2 = false;
                           var sellerdetails = response.body.data.data;
                           for(let i = 0;i<sellerdetails.length;i++){
                            sellerdetails[i].percentage = (sellerdetails[i].percentage*100).toFixed(2)+'%';
                           }
                           _this.sellerdetail = sellerdetails;
                            _this.spname = response.body.data.data[0].name;
                        }
                    });
            }
        },
        created() {
            this.getData();
        }
    };
</script>