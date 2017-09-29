<template>
    <div style="margin-top: 50px">
        <div id="chart" style="height: 500px"></div>
        <!--<section id='charts'>-->
            <!--<div class="charts-item">-->
                <!--<h3>好评</h3>-->
                <!--<div class="charts-divide"></div>-->
                <!--<div class="charts-bar">-->
                    <!--<div class="all-bar">-->
                        <!--<div class="has-img"></div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</section>-->
        <h3>
            <Tag type="border">店铺名称：{{shopInfo.name}}</Tag>
            <Tag type="border">注册时间：{{shopInfo.time}}</Tag>
            <Tag type="border">交易金额：{{shopInfo.money}}</Tag>
            <Tag type="border">评价总数：{{shopInfo.num}}</Tag>
        </h3>
    </div>
</template>



<script>
    import eCharts from 'echarts';

    export default {
        props: ['data'],
        data() {
            return {
                staticData: [],
                radio: {},
                appraise: {},
                shopInfo: {},
                allNum: 0,
                barStyle: {}
            };
        },

        methods: {

            initCharts() {
                var _this = this;
                var chart = eCharts.init(document.getElementById('chart'));
                chart.setOption({
                    title: {
                        show: true,
                        text: '找冻品网-评价数据统计',
                        textStyle: {color: '#2d8cf0'},
                        padding: 10
                    },
                    color: ['#000000', '#66CCFF', '#6666ff', '#ff3300'],
                    legend: {
                        data: [
                            {name: '好评', icon: 'circle'},
                            {name: '中评', icon: 'circle'},
                            {name: '差评', icon: 'circle'},
                            {name: '含图', icon: 'circle'}
                        ],
                        selectedMode: false,
                        bottom: '20px',
                        right: '20px',
                        padding: [100, 0, 0, 0]
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: _this.formatter,
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            label: {
                                show: true
                            },
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '12%',
                        containLabel: true
                    },
                    xAxis: {show: false, type: 'value', max: this.allNum},
                    yAxis: {
                        type: 'category',
                        data: ['差评', '中评', '好评']
                    },
                    series: [
                        {
                            name: '辅助',
                            type: 'bar',
                            stack: '评价',
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
                            data: [
                                _this.staticData[2].value[1] + _this.staticData[0].value[1] + _this.staticData[1].value[2] + _this.staticData[0].value[2],
                                _this.staticData[1].value[2] + _this.staticData[0].value[2], 0]
                        }, // 辅助块……用户看不到
                        {
                            name: '含图',
                            type: 'bar',
                            stack: '评价',
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: _this.staticData[0].value
                        },
                        {
                            name: '好评',
                            type: 'bar',
                            stack: '评价',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'inside'
                                }
                            },
                            data: _this.staticData[1].value
                        },
                        {
                            name: '中评',
                            type: 'bar',
                            stack: '评价',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'inside'
                                }
                            },
                            data: _this.staticData[2].value
                        },
                        {
                            name: '差评',
                            type: 'bar',
                            stack: '评价',
                            label: {
                                normal: {
                                    show: false,
                                    position: 'inside'
                                }
                            },
                            data: _this.staticData[3].value
                        }
                    ]
                });
            },
            formatter(params) {
                var str = '<h3>'+params[0].axisValueLabel+'</h3>',
                    radio = '';
                var _this = this;

                params.map(function (param) {
                    if (param.seriesName != '辅助') {
                        if (param.seriesName == param.name || param.seriesName == '含图') {
                            if(param.seriesName == '含图'){
                                str += '<br />' + param.seriesName + ' ： ' + param.value;
                            }else{
                                str += '<br />' + param.seriesName + ' ： ' + _this.appraise[param.seriesName];
                            }
                            radio = _this.radio[param.seriesName];
                        }
                    }
                });

                str += '<br />' + params[0].axisValueLabel + '率 ： ' + radio;
                return str;
            }
        },
        // 生命周期
        created(){
            let apprise = this.$props.data[0];
            let shopInfo = {};
            shopInfo.name = apprise.name;
            shopInfo.time = apprise.ZhuCe;
            shopInfo.money = apprise.allSale;
            shopInfo.num = apprise.appraiseNum;
            this.shopInfo = shopInfo;

            this.allNum = apprise.appraiseNum;

            this.staticData = [
                {name: '含图', value: [apprise.hasImgPoorAppraiseNum, apprise.hasImgMediumAppraiseNum, apprise.hasImgGoodAppraiseNum]},
                {name: '好评', value: [0, 0, apprise.goodAppraiseNum-apprise.hasImgGoodAppraiseNum]},
                {name: '中评', value: [0, apprise.mediumAppraiseNum-apprise.hasImgMediumAppraiseNum, 0]},
                {name: '差评', value: [apprise.poorAppraiseNum-apprise.hasImgPoorAppraiseNum, 0, 0]}
            ];
            this.radio = {'好评': apprise.goodAppraise, '中评': apprise.mediumAppraise, '差评': apprise.poorAppraise};
            this.appraise = {'好评': apprise.goodAppraiseNum, '中评': apprise.mediumAppraiseNum, '差评': apprise.poorAppraiseNum};
        },
        mounted(){
            this.initCharts();

//            initData();
        }
    };
</script>