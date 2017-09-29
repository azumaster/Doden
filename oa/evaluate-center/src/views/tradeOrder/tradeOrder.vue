<template>
    <div id="tradeOrder" >
        <div class="layout-header">交易订单</div>
           <div class="filter_bar">
               <Select v-model="trademodel" style="width:200px">
                    <Option v-for="item in tradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
               </Select>
               <Input v-model="sovalue" placeholder="请输入..." style="width: 300px"></Input>
               <Button>查找</Button><Button>刷新</Button>
           </div>
           <hr/>
           <div class="filter_next">
               <Select v-model="ordermodel" style="width:200px">
                    <Option v-for="item in oderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
               </Select>
               <Select v-model="paymodel" style="width:200px">
                    <Option v-for="item in payList" :value="item.value" :key="item.value">{{ item.label }}</Option>
               </Select>
               <Button>筛选</Button>
           </div>
            <div class="table_bar">
                <Table :columns="columns" :data="data"></Table>
            </div>
        
    </div>
</template>

<script>
    export default {
        name: 'tradeOrder',
        data: function () {
            return {
               trademodel: 1,
               tradeList: [{value: 1,label: '订单编号'},{ value: 2,label: '订单ID'}, { value: 3,label: '买家店铺'},{ value: 4,label: '卖家店铺'
                   },{value: 5,label: '买家手机号'},{value: 6,label: '卖家手机号'}],
                sovalue: 'sb',
                ordermodel: 'all',
                paymodel: 'all',
                payList: [{value: 'all', label: '全部支付方式'}, {value: 1, label: '微信支付'}, {value: 2, label: '银行卡快捷支付'}, {value: 3, label: '网银转账'}],
                oderList: [{value: 1,label: '交易订单'},{ value: 2,label: '待付款'}, { value: 3,label: '待发货'},{ value: 4,label: '已发货'
                   },{value: 5,label: '退款订单'},{value: 6,label: '买家退款/退货'},{value: 7,label: '卖家取消订单'},
                   {value: 8,label: '退货订单'},{value: 9,label: '申请退货'},{value: 10,label: '退货中—待发货'},{value: 11,label: '退货中—已发货'},
                   {value: 12,label: '财务待确认订单'},{value: 13,label: '财务待确认'},{value: 14,label: '财务待确认—已撤回'},{value: 15,label: '提现订单'},
                   {value: 16,label: '可提现订单'},{value: 17,label: '提现中订单'},{value: 18,label: '提现完成订单'},{value: 19,label: '交易关闭'},
                   {value: 20,label: '退款—交易关闭'},{value: 21,label: '退货—交易关闭'},
                   {value: 'all', label: '全部订单'}],
                columns: [{
                        title: '订单编号',
                        key: 'order_code'
                    },{
                        title: '订单ID',
                        key: 'order_code'
                    },{
                        title: '买家店铺名',
                        key: 'buyerName'
                    },{
                        title: '卖家店铺名',
                        key: 'sellerName'
                    },{
                        title: '商品数量(件)',
                        key: 'goodNum'
                    },{
                        title: '订单金额(元)',
                        key: 'amout'
                    },{
                        title: '下单时间',
                        key: 'ordertime'
                    },
                    {
                        title: '订单状态',
                        key: 'status'
                    },
                    {
                        title: '订单操作',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.manageOrder(params.row.id)
                                        }
                                    }
                                }, '管理订单')
                            ]);
                        }
                    }],
                data: [],
                params: {}
            };
        },
        methods: {
            manageOrder (id) {
                window.location.href = '/#/tradeOrderMain/tradeDetail?id' +id;
            },
            getOrders () {
                req.getPJGL(this, this.params, (res) => {
                    if(res.code == 0) {this.data = res.data.lists;}
                })
            }
        },
        created () {
            this.getOrders();
        }
    };
</script>
<style lang="less" scoped>
#tradeOrder{padding:10px }
.table_bar {padding: 20px 0;}
.filter_next{padding: 20px 0;}
</style>
