<template>
    <div ref="charts" id="charts" style="height: 500px;"></div>
</template>

<script>
    import echarts from 'echarts';

    export default {
        data: function () {
            return {

            };
        },
        methods: {
            initCharts: function () {
                let myCharts = echarts.init(this.$refs.charts);
                myCharts.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总转化率%']
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        },
                        min: 35
                    },
                    series: [
                        {
                            name:'总转化率%',
                            type:'line',
                            data:[84, 49, 85, 42, 78, 99, 52],
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                });
            }
        },
        mounted: function () {
            this.initCharts();
        }
    }
</script>