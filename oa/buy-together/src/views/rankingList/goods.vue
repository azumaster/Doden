<template>
    <div id="goods" class="goods">
        <pageHead title="集采商品排行榜"></pageHead>

        <template>
            <div class="page-filter">
                <div class="filter-group">
                    <Date-picker type="datetimerange" placement="bottom-start" placeholder="默认为最近3天"
                                 style="width: 300px" @on-change="dateChange"></Date-picker>
                    <Button type="primary" @click="select">确认筛选</Button>
                </div>
            </div>
        </template>

        <template>
            <Table border :columns="columns" :data="goods" @on-sort-change="sortChange"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </template>

        <template>
            <div style="margin: 20px 0">
                <Page :total="total" :current="params.page" :page-size="params.size" @on-change="changePage"></Page>
            </div>
        </template>
    </div>
</template>

<script>
    import pageHead from '../../components/pageHead.vue';

    export default {
        name: 'goods',
        components: {
            pageHead
        },
        data(){
            return {
                params:{page:1, size: 20},
                columns: [
                    {title: '商品名', key:'gname'},
                    {title: '卖家店铺', key:'name'},
                    {title: '下单件数', key:'ordered_num'},
                    {title: '成交件数', key:'deal_num'},
                    {title: '订单金额', key:'ordered_money'},
                    {title: '成交金额', key:'deal_money', sortable: 'custom'},
                    {title: '总优惠金额', key:'diff_money'},
                    {title: '支付率', key:'percentage', sortable: 'custom'}
                ],
                goods: [],
                total: 0,
                spinShow: false
            };
        },
        methods: {
            getGoodsData(){
                var _this = this;
                _this.params.type = 'goods';
                _this.$Loading.start();
                this.$http({
                    method: 'POST',
                    url: '/bi/groupon/rank',
                    body: _this.params,
                    header: 'Accept application/json'
                }).then(res =>{
                    _this.$Loading.finish();
                    this.spinShow = false;
                    if(res.data.code == 0){
                        var goods = res.data.data.data;
                        for(var i=0; i<goods.length;i++){
                            goods[i].percentage = (goods[i].percentage*100).toFixed(2)+'%';
                        }
                        _this.goods = goods;
                        _this.params.page = res.data.data.current_page;
                        _this.total = res.data.data.total;
                    }else{
                        _this.$Message.error(res.data.message, 5);
                    }
                });
            },
            sortChange(e){
                this.params.order = {};
                if(e.order !== 'normal'){
                    this.params.page = 1;
                    this.params.order = [e.key, e.order];
                }else{
                    delete this.params.order;
                }
                this.getGoodsData();
            },
            changePage(e){
                this.params.page = e;
                this.getGoodsData();
            },
            dateChange(e){
                var time = e.split(' - ');
                this.start = time[0];
                this.end = time[1];
            },
            select(){
                if(this.start == 0 || this.end == 0){
                    this.$Message.warning('请先选择日期范围');
                    return;
                }

                this.params.time = [this.start, this.end];
                this.getGoodsData();
            }
        },
        created(){
            this.getGoodsData();
        }
    };
</script>