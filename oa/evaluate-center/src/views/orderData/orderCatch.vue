<template>
    <section id="orderOperate">
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
        <Charts />
    </section>
</template>

<script>
    import Charts from './charts3.vue';

    export default {
        name: 'orderOperate',
        components: { Charts },
        data: function () {
            return {
                dateOptions: {
                    shortcuts: [
                        {text: '最近一周', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*7); return [start, end]; }},
                        {text: '最近一月', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*30); return [start, end]; }},
                        {text: '最近三月', value(){ const end = new Date(), start = new Date(); start.setTime(start.getTime()-3600*1000*24*90); return [start, end]; }}
                    ]
                },
                selectItem: [{value: 0, label: '买家取消订单理由'}, {value: 1, label: '卖家取消订单理由'}, {value: 2, label: '买家退款/退货理由'}],
                dateRange: [],
                select: 0
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
            },
            initCharts() {

            }
        },
        created: function(){
            this.init();
        }
    }
</script>