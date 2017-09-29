<template>
  <div id="financeOA">
     <div class="layout-header">退款订单</div>
     <div class="filter_bar">
        <Select v-model="trademodel" style="width:200px">
            <Option v-for="item in tradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="sovalue" placeholder="请输入..." style="width: 300px"></Input>
               <Button>查找</Button><Button>刷新</Button>
     </div>
     <hr/>
     <div style="padding:20px 0;">
         <Select v-model="moneymodel" style="width:200px">
            <Option v-for="item in moneyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button>筛选</Button>
     </div>
     <br/>
      <Table :columns="columns" :data="data"></Table>
  </div>
</template>
<script>
export default {
    data() {
        return {
            trademodel: 1,
            tradeList: [{value: 1,label: '订单编号'},{ value: 2,label: '订单ID'}, { value: 7,label: '退款编号'}, { value: 3,label: '买家店铺'},{ value: 4,label: '卖家店铺'
                   },{value: 5,label: '买家手机号'},{value: 6,label: '卖家手机号'}],
            sovalue: '123',
            moneymodel: 'all',
            moneyList: [{value: 'all', label: '全部退款'}, {value: 1, label: '待处理'}, {value: 2, label: '已撤回'}, {value: 3, label: '处理中'}, {value: 4, label: '已退款'}, {value: 5, label: '失败'}],
            columns: [{
                        title: '退款号',
                        key: 'name'
                    },{
                        title: '订单编号',
                        key: 'order_code'
                    },{
                        title: '买家店铺名',
                        key: 'dianPuName'
                    },{
                        title: '卖家店铺名',
                        key: 'dianPuName'
                    },{
                        title: '收款微信名',
                        key: 'dianPuName'
                    },{
                        title: '实收金额',
                        key: 'name'
                    },{
                        title: '退款金额',
                        key: 'name'
                    },{
                        title: '发起方',
                        key: 'name'
                    },{
                        title: '退款确认人',
                        key: 'name'
                    },{
                        title: '发起时间',
                        key: 'name'
                    },{
                        title: '处理时间',
                        key: 'name'
                    },{
                        title: '订单状态',
                        key: 'name'
                    },{
                        title: '订单操作',
                        render: (h, params) => {
                            return h('div', [
                                h('Button',{
                                     props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row.id)
                                        }
                                    }
                                }, '查看订单')
                            ])
                        }
                    }],
            data: [{name: '杨晓明', id: 123}]
        }
    },
    methods: {
        show (id) {
            console.log(id)
        },
        getData () {
             req.getRefundOrders(this, {}, (res) => {
                 if (res.code ==0) {this.data =res.data.lists}
             })
        }
    },
    created () {
        this.getData();
    }
    
}
</script>

<style lang="less" scoped>
#financeOA {
    padding: 0  10px  50px 10px;
}
</style>
