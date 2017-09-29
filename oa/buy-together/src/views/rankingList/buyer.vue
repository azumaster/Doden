<template>
    <div id="seller" class="seller">
        <pageHead title="排行榜-买家"></pageHead>
            <div class="page-filter">
                <div class="filter-group">
            
             <Date-picker type="datetimerange" placement="bottom-start" placeholder="默认为最近3天"
                                 style="width: 300px" @on-change="dateChange"></Date-picker>
            <Button type="primary" @click="select">确认筛选</Button>
       </div>
       </div>
    
        <Table :context="self" :columns="buyer_column" @on-sort-change="sortChange" :stripe=true :data="list" :border=true size="default" ref="table"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <div style="margin: 20px 0">
        <Page class='center' :total="total" @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script>
    import pageHead from '../../components/pageHead.vue';
    import Base from '../../common/base.js';
  //  import BaseMock from '../../common/basemock.js';
    export default {
        mixins: [Base],
        components: {pageHead},
        data () {
            return {
                list: [],
                spinShow: true,
                deal: 'deal_money',
                total:1,
                param:{
                    type: 'buyer',
                    page: 1,
                    size: 10
                },
                buyer_column: [
                    { 'title': '买家店铺名', 'align': 'center', 'key': 'name', 'width': 150},
                    { 'title': '下单件数', 'align': 'center', 'key': 'ordered_num', 'width': 150},
                    {'title': '成交件数', 'align': 'center', 'key': 'deal_num', 'width': 150},
                    {'title': '订单金额', 'align': 'center', 'key': 'ordered_money',  'width': 150},
                    { 'title': '成交金额', 'align': 'center', 'key': 'deal_money', sortable: 'custom', 'width': 150},
                    { 'title': '总优惠金额', 'align': 'center', 'key': 'diff_money', 'width': 150},
                    {'title': '支付率', 'align': 'center', 'key': 'percentage', sortable: 'custom', 'width': 150}
                ]
            };
        },

        created () {
         //   this.getMockData();
            this.getData();
        }
    };
</script>
<style scoped>
    .inline{
        display: inline-block;
    }
</style>