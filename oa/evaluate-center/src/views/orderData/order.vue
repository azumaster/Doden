<template>
    <section id="orderStatics">
        <div class="page-filer" style="margin: 10px 0;">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem prop="date"><DatePicker type="daterange" :options="dateOptions" :value="dateRange" placeholder="选择日期范围" style="width: 200px"></DatePicker></FormItem>
                <FormItem prop="date">
                    <Select v-model="select" style="width:200px">
                        <Option v-for="item in selectItem" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="date"><Button type="primary">查询</Button></FormItem>
            </Form>
        </div>
        <div class="page-content">
            <div class="page-top-chart">
                <Row>
                    <i-col span="5"><Percent /></i-col>
                    <i-col span="19"><Charts /></i-col>
                </Row>
            </div>
            <div class="page-table">
                <Table border :columns="orderColumns" :data="orders"></Table>
            </div>
        </div>
    </section>
</template>

<script>
    import Charts from './charts.vue';
    import Percent from './percent.vue';

    export default {
        name: 'orderData',
        components: { Charts, Percent },
        data: function () {
            return {
                dateOptions: {
                    shortcuts: [
                        {text: '最近一周', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*7); return [start, end]; }},
                        {text: '最近一月', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*30); return [start, end]; }},
                        {text: '最近三月', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*90); return [start, end]; }}
                    ]
                },
                selectItem: [{value: 0, label: '总转化率%'}, {value: 1, label: '第一步转化率%'}, {value: 2, label: '第二步转化率%'}, {value: 3, label: '第三步转化率%'}],
                dateRange: [],
                select: 0,
                orderColumns: [
                    {title: '总计', key: 'all'},
                    {title: '7-1（六）', key: '1'},
                    {title: '7-2（日）', key: '2'},
                    {title: '7-3（一）', key: '3'},
                    {title: '7-4（二）', key: '4'},
                    {title: '7-5（三）', key: '5'},
                    {title: '7-6（四）', key: '6'},
                    {title: '7-7（五）', key: '7'},
                ],
                orders: [{'all': '流失订单总数', '1': 221, '2': 157}]
            };
        },
        methods: {
            init(){
                let year = new Date().getFullYear(),
                    month = (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1),
                    day = new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate();

                let lastDate= new Date();
                lastDate.setMonth(new Date().getMonth()-1);
                let lastYear = lastDate.getFullYear(),
                    lastMonth = (lastDate.getMonth()+1)<10?'0'+(lastDate.getMonth()+1):(lastDate.getMonth()+1),
                    lastDay = lastDate.getDate()<10?'0'+lastDate.getDate():lastDate.getDate();

                this.dateRange = [lastYear+'-'+lastMonth+'-'+lastDay, year+ '-'+month+'-'+day];
            }
        },
        created: function(){
            this.init();
        }
    };
</script>