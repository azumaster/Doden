<template>
    <div id="evaluateManage">
                    <div class="filter_bar">
                        <Row :gutter="16">
                            <Col span="1"><span>店铺名称</span></Col>
                            <Col span="3"><Input v-model="table_params.shop_name"  @on-blur="dianpuNamechange"></Input></Col>
                             <Col span="1"><span>订单编号</span></Col>
                            <Col span="3"><Input v-model="table_params.orderIds" @on-blur="orderIDchange"  ></Input></Col>
                             <Col span="1"><span>商品名称</span></Col>
                            <Col span="3"><Input v-model="table_params.goods_name"   @on-blur="goodsNamechange"></Input></Col>
                            <Col span="1"><span>时间范围</span></Col>
                            <Col span="3"><Date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" @on-change="BtimeChange"></Date-picker></Col>
                             <Col span="1"><span>——</span></Col>
                            <Col span="4"><Date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" @on-change="EtimeChange"></Date-picker></Col>
                            <Col span="2"> <Button type="info" @click="soso">搜索</Button></Col>
                        </Row>
		            </div>
                    <div class="tableBar">
                        <Table stripe :columns="columns" :data="data" border></Table>
                        <Page  :total="total"  :current="$store.state.nowPage"  simple @on-change="pageChange" style="margin-top: 20px;"></Page>
                    </div>
    </div>
</template>

<script>
export default {
    name: 'evaluateManage',
    data () {
        return {
            total: 0, //数据总条数
            columns: [{
                        title: '店铺名称',
                        key: 'dianPuName'

                    },{
                        title: '订单号',
                        key: 'order_code'
                    },{
                        title: '订单时间',
                        width:200,
                        key: 'addtime'
                    },{
                        title: '商品概况',
                        key: 'gname'
                    },{
                        title: '订单与评价',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '5px'
                                    }
                                },  params.row.orderacttxt),
                                h('span', '-'),
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    }
                                }, params.row.appraise_status)
                            ])
                        },
                        width: 180
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            if(params.row.appraise_status == '未评价') {
                                return h('div', '')
                            }
                            else{
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
                                                this.editor(params.row.order_code)
                                            }
                                        }
                                    }, '编辑评价'),
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
                                                this.showlogs(params.row.order_code)
                                            }
                                        }
                                    }, '操作日志'),
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
                                                this.remove(params.row.order_code, params.index)
                                            }
                                        }
                                    }, '删除'),
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
                                                this.reset(params.row.order_code)
                                            }
                                        }
                                    }, '重置')
                                ]);
                            }
                       }
                    }],
            data: [],
            table_params: {
                shop_name: '',
                orderIds: '',
                goods_name: '',
                size: 10,
                page: 1
            },
            params: {
                orderIds: 123
            }
        }
        
    },
    methods: {
        editor (id) {
            // window.location.href = '/#/evaluateMain/editorEvaluate?id='+id;
            window.location.href = '/html/evaluate-center/index.html#/evaluateMain/editorEvaluate?id='+id;
            this.$store.state.orderIds = id;
        },
        showlogs (id) {
            window.location.href = '/html/evaluate-center/index.html#/evaluateMain/evaluateLogs?id='+id;
            // window.location.href = '/#/evaluateMain/evaluateLogs?id='+id;
            this.$store.state.orderIds = id;
        },
        orderIDchange (){this.$store.state.soOrderIds = this.table_params.orderIds},
        dianpuNamechange (){this.$store.state.dianpuName = this.table_params.shop_name },
        goodsNamechange () {this.$store.state.goods_name = this.table_params.goods_name},
        reset (id) { //点击重置按钮
           this.params.orderIds = id;
           this.$Modal.confirm({
                    title: '重置评价对话框',
                    content: '<p>是否确认重置该评价</p>',
                    onOk: () => {
                        this.resetData();
                    },
                    onCancel: () => {
                       
                    }
            });
        },
        remove (id, index) { //删除日志
            // this.data.splice(index, 1)
            this.params.orderIds = id;
            this.$Modal.confirm({
                    title: '删除评价对话框',
                    content: '<p>确定要抹除该评价并关闭改订单的评价入口？</p>',
                    onOk: () => {
                        this.delete();
                    },
                    onCancel: () => {
                    }
            });
           
            
        },
        BtimeChange (e) { //开始时间
            this.table_params.start_time = e;
            this.$store.state.beginTime = e;
        },
        EtimeChange (e) { //结束时间
            this.table_params.end_time = e;
            this.$store.state.endTime = e;
        },
        pageChange (e) { //翻页
            this.$store.state.nowPage = e;
            this.table_params.page = e;
            this.getPJdata ();
        },
        soso () {
            this.table_params.page = 1;
            this.getPJdata ();
        },
        getPJdata () {
            req.getPJGL (this, this.table_params, (res) => {
                if(res.code == 0) {
                    this.total = res.data.total;
                    this.data = res.data.lists;
                    for(var i in this.data) {
                        if (this.data[i].orderact == 0) {var obj = {orderacttxt: '新订单'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 1) {var obj = {orderacttxt: '已电联'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 2) {var obj = {orderacttxt: '卖家已确认'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 3) {var obj = {orderacttxt: '已发货'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 4) {var obj = {orderacttxt: '已完成'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 5) {var obj = {orderacttxt: '无效订单'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 6) {var obj = {orderacttxt: '买家删除'}; this.data[i] = Object.assign(this.data[i], obj) }                        
                        else if (this.data[i].orderact == 7) {var obj = {orderacttxt: '提现处理中'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 8) {var obj = {orderacttxt: '已提现'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 9) {var obj = {orderacttxt: '已做评价'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 10) {var obj = {orderacttxt: '提现处理失败'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 20) {var obj = {orderacttxt: '超时定单'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 101) {var obj = {orderacttxt: '收款待财务确认'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else if (this.data[i].orderact == 102) {var obj = {orderacttxt: '退款冻结'}; this.data[i] = Object.assign(this.data[i], obj) }
                        else {var obj = {orderacttxt: '退款订单'}; this.data[i] = Object.assign(this.data[i], obj)}
                    }
                }
                else if (res.code == 10106) {
                    this.$Modal.confirm({
                    title: '',
                    content: '<p>您尚未登录，请登录</p>',
                    // onOk: () => {
                    //     this.$Message.info('点击了确定');
                    // },
                    // onCancel: () => {
                    //     this.$Message.info('点击了取消');
                    // }
                });
                }
            })
        },
        delete () {
            var vm = this;
            vm.$http({
                method: 'POST',
                url: '/shop/handle/appraise/appraise_delete',
                body: vm.params,
                header: 'application/json'
            }).then(response => {
                if (response.body.code == 0) {
                     vm.getPJdata();
                }
            });
        },
        resetData () {
            var vm = this;
            vm.$http({
                method: 'POST',
                url: '/shop/handle/appraise/appraise_reset',
                body: vm.params,
                header: 'application/json'
            }).then(response => {
                if (response.body.code == 0) {
                     vm.$Message.info({
                    content: '评价重置成功',
                    duration: 10,
                    closable: true
                });
                vm.getPJdata();
                }
            });
        }
    },
    created () {
        this.table_params.page = this.$store.state.nowPage;
        // console.log(this.$store.state);
        if(this.$store.state.soOrderIds) this.table_params.orderIds = this.$store.state.soOrderIds;
        if(this.$store.state.dianpuName) this.table_params.shop_name = this.$store.state.dianpuName;
        if(this.$store.state.goods_name) this.table_params.goods_name = this.$store.state.goods_name;
        if(this.$store.state.beginTime) this.table_params.start_time = this.$store.state.beginTime;
        if(this.$store.state.endTime) this.table_params.end_time = this.$store.state.endTime;
        this.getPJdata ();
    }
}
</script>
<style lang="less" scoped>
.ivu-table-body{overflow: hidden}
.ivu-col-span-4, .ivu-col-span-3{display: flex;}
.ivu-col-span-1 span{margin-top: 5px;display: block;}
.tableBar{padding: 20px 0;}
</style>
