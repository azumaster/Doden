<template>
    <div ref="charts" id="charts" style="height: 600px;"></div>
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
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            var tar = params[1];
                            return tar.name + '次数 : ' + tar.value;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        data : ['总退款','买家退款','卖家退款','运营（买家）','运营（卖家）']
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '辅助',
                            type: 'bar',
                            stack:  '总量',
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                }
                            },
                            data: [0, 1400, 1100, 900, 0]
                        },
                        {
                            name: '介入次数',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:[2700, 1300, 300, 200, 900]
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