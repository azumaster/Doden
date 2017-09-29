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
                            var tar = params[0];
                            return tar.name + '次数 : <br />' + tar.value;
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
                        data : ['不想买了','订单无法支付','订单信息错误','价格不合适','下错单了', '线下交易', '其他']
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '次数',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:[510, 185, 254, 294, 435, 912, 459]
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