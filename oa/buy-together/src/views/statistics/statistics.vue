<template>
    <Card>
        <p slot="title">概况</p>
        <div slot="extra">
            <Radio-group v-model="select" style="float:left" @on-change="changeRadio">
                <Radio label="paid.money,ordered.money"><span>成交/订单金额</span></Radio>
                <Radio label="paid.num,ordered.num, modified.num"><span>成交/下单数量</span></Radio>
                <Radio label="ordered.count,paid.count"><span>报价/支付单数</span></Radio>
                <Radio label="ordered.seller,modified.seller"><span>通知/改价卖家</span></Radio>
            </Radio-group>
            <Radio-group v-model="currentModal" type="button" @on-change="changeTimeModal" style="float:right">
                <Radio label="时"></Radio>
                <Radio label="日"></Radio>
                <Radio label="周"></Radio>
                <Radio label="月"></Radio>
            </Radio-group>
        </div>
        <div id="totalChart" class="chart" style="width: 100%; height: 500px"></div>
    </Card>
</template>

<script>
    import eCharts from 'echarts';

    export default {
        name: 'survey',
        data(){
            return {
                params:{},
                select:'paid.money,ordered.money',
                currentModal:'日',
                total:null
            };
        },
        methods: {
            getBaseData1(){
                var _this = this;
                _this.params.select = _this.select;
                this.$http({
                    method: 'GET',
                    url: '/mock/baseData.json',
                    data: _this.params
                }).then(res =>{
                    if(res.body.code == 0){
                        _this.total = res.body.data;
                        _this.initTotalCharts();
                    }else{
                        _this.$Message.error(res.body.message, 5);
                    }
                });
            },
            getBaseData(){
                var _this = this;
                _this.params.select = _this.select.split(',');
                _this.$Loading.start();
                this.$http({
                    method: 'POST',
                    url: '/bi/groupon',
                    body: _this.params,
                    header: 'Accept application/json'
                }).then(res =>{
                    _this.$Loading.finish();
                    if(res.data.code == 0){
                        _this.total = res.data.data;
                        _this.initTotalCharts();
                    }else{
                        _this.$Message.error(res.data.message, 5);
                    }
                });
            },
            initTotalCharts(){
                var myChart = eCharts.init(document.getElementById('totalChart'));

                var xAxis = [],
                    legend = [],
                    seriesData = [],
                    series = [];

                var finishPrice = [],
                    finishNum = [],
                    orderPrice = [],
                    orderNum = [],
                    ordered = [],
                    modifiedNum = [],
                    orderedCount = [],
                    paidCount = [],
                    modifiedSeller = [];
                for(var key in this.total){
                    xAxis.push(key);
                    legend = [];
                    for(var name in this.total[key]){
                        legend.push(name);
                        if(name=='成交金额') finishPrice.push(this.total[key][name]);
                        else if(name=='订单金额') orderPrice.push(this.total[key][name]);
                        else if(name=='成交数量') finishNum.push(this.total[key][name]);
                        else if(name == '下单数量') orderNum.push(this.total[key][name]);
                        else if(name == '通知卖家') ordered.push(this.total[key][name]);
                        else if(name == '改价数量') modifiedNum.push(this.total[key][name]);
                        else if(name == '改价卖家') modifiedSeller.push(this.total[key][name]);
                        else if(name == '报价单数') orderedCount.push(this.total[key][name]);
                        else if(name == '支付单数') paidCount.push(this.total[key][name]);
                    }
                }

                if(finishPrice.length>0) seriesData.push({name: '成交金额', type: 'line', data: finishPrice});
                if(finishNum.length>0) seriesData.push({name:'成交数量', type:'line', data:finishNum});
                if(orderPrice.length>0) seriesData.push({name:'订单金额', type: 'line', data: orderPrice});
                if(orderNum.length>0) seriesData.push({name:'下单数量', type: 'line', data: orderNum});
                if(modifiedSeller.length>0) seriesData.push({name:'改价卖家', type: 'line', data: modifiedSeller});
                if(modifiedNum.length>0) seriesData.push({name:'改价数量', type: 'line', data: modifiedNum});
                if(orderedCount.length>0) seriesData.push({name:'报价单数', type: 'line', data: orderedCount});
                if(paidCount.length>0) seriesData.push({name:'支付单数', type: 'line', data: paidCount});
                if(ordered.length>0) seriesData.push({name:'通知卖家', type: 'line', data: ordered});

                series = seriesData;

                myChart.setOption({
                    tooltip: {trigger: 'axis'},
                    legend: {data:legend},
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {yAxisIndex: 'none'},
                            dataView: {readOnly: true},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: true,
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {formatter: '{value}'}
                    },
                    series: series
                });
            },
            changeTimeModal(e){
                if(e == '时') this.params.group = 'hour';
                else if(e == '日') this.params.group = 'day';
                else if(e == '周') this.params.group = 'week';
                else if(e == '月') this.params.group = 'month';
                this.currentModal = e;
                this.getBaseData();
            },
            changeRadio(e){
                this.params.select = e.split(',');
                this.getBaseData();
            }
        },
        created(){
            this.getBaseData();
        }
    };
</script>