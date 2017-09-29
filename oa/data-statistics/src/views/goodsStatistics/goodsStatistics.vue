<template>
    <div>
     <div class="layout-header">
        <h1>商品数据</h1>
    </div>
        <Tabs :animated="false">
        <Tab-pane label="分布和趋势">
            <h4>分布状况</h4>
            <div class="selectlist mainselect">
                <Select v-model="charts1provincemodel" style="width:150px" clearable @on-change="charts1provinceChange" placeholder="所有省/市">
                <Option v-for="item in provinceList1" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Select v-model="charts1marketmodel" style="width:150px" clearable @on-change="charts1marketChange" placeholder="全部市场">
                <Option v-for="item in marketList1" :value="item.market" :key="item" >{{ item.market }}</Option>
            </Select>
            <Button type="success" @click="sureSelect1">确认筛选</Button>
            </div>

             <Card :bordered="true" style="width:100%">
                    <Row>
                        <Col span="10">
                            <p>状态分布</p>
                             <Spin size="large" fix v-if="piespinShow"></Spin>
                            <div id="pieCharts" style="width: 100%; height: 200px"></div>
                            <p>合计：{{pieTotal}}</p>
                        </Col>
                        <Col span="14">
                        <Spin size="large" fix v-if="barspinShow"></Spin>
                             <div id="barCharts" style="width: 100%; height: 300px"></div>
                        </Col>
                    </Row>
                    <p>价格分布</p>
                    <Spin size="large" fix v-if="linebarspinShow"></Spin>
                    <div id="linebarCharts" style="width: 100%; height: 100px"></div>
                    <p>合计:{{lineBarTotal}}</p>
             </Card>
        </Tab-pane>
    </Tabs>
    <!-- 折现统计图 -->
        <div class="selectlist">
        <div><h4>趋势和变化</h4></div>
        <Radio-group v-model="lineparams.group" type="button">
        <Radio label="day">按日查看</Radio>
        <Radio label="week">按周查看</Radio>
        <Radio label="month">按月查看</Radio>
        <Radio label="year">按年查看</Radio>
    </Radio-group>
    </div>
         <div class="selectlist mainselect">
            <Select v-model="dayslenthmodel" style="width:150px" @on-change="dayslenthChange">
                    <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
            <Date-picker  format="yyyy-MM-dd" @on-change="startdayChange" v-model="startday" type="date" placeholder="选择日期" style="width: 150px"></Date-picker>至
                <Date-picker format="yyyy-MM-dd" @on-change="enddayChange" v-model="endday" type="date"  placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
            <Select v-model="provicemodel" @on-change="linesproviceChange" clearable style="width:150px" placeholder="所有省/市">
                    <Option v-for="item in provinceList" :value="item" :key="index">{{ item }}</Option>
                </Select>
            <Select v-model="markemodel" @on-change="linesmarketChange" clearable style="width:150px" placeholder="全部市场">
                    <Option v-for="item in marketList2" :value="item.market" :key="index">{{ item.market }}</Option>
                </Select>
                <Button type="success" @click="sureSelect">确认筛选</Button>       
    </div>
     <Card :bordered="true" style="width: 100%; height: 550px">
          <Spin size="large" fix v-if="linesspinShow"></Spin>
          <div id="linesCharts" style="width: 100%; height: 500px"></div>
          </Card>
    </div>
</template>
<script>
    import eCharts from 'echarts';
    export default {
        data () {
            return {
                dayslenth: [{ value: '30', label: '近30天'}, { value: '15', label: '近15天'}, {value: '7', label: '近7天'}],
                dayslenthmodel: '30',
                pieTotal:0,
                lineBarTotal:0,
                charts1provincemodel: '',
                charts1marketmodel: '',
                piespinShow: true,
                linesspinShow: true,
                barspinShow: true,
                linebarspinShow: true,
                provincemodel: '',
                spreaddata: [],  //表格数据
                marketmodel: '',
                provinceList1: [],
                provinceList: [],
                pieData: [],
                LineBarData: [],
                marketList2: [],
                marketList1: [],
                params: {
                    select: ['sale', 'not_sale', 'delete', 'overdue'],
                    filter: {}
                },
                marketparams: {
                    areaName: '',
                    role: 'province',
                    type: 'market'
                },
                marketparams2: {
                    areaName: '',
                    role: 'province',
                    type: 'market'
                },
                lineparams:{
                    time: [],
                    select: ['new', 'delete', 'sale', 'not_sale', 'overdue'],
                    group: 'day',
                    filter: {}
                },
                filterparams: {
                    time:[],
                    filter: ['province', 'market']
                },
                filterparams1: {   //分布状况筛选项
                    time:[],
                    filter: ['province', 'market']
                },
                linesData: []
            };
        },
        methods:{
            sureSelect1 () {
                this.getBaseData();
            },
            // 默认最近30天
            sureSelect (){
                this.getLineData();
            },
            getDefaultDate (){
                var t=new Date();
                var iToDay=t.getDate();
                var iToMon=t.getMonth();
                var iToYear=t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay-30)).toLocaleDateString();
                this.startday = startday;
                this.endday = endday;
                this.lineparams.time = [startday, endday];
                this.filterparams.time = [startday, endday];
                this.filterparams1.time=['2015-01-01', endday];
            },
                dayslenthChange (e) {
                var t=new Date();
                var iToDay=t.getDate();
                var iToMon=t.getMonth();
                var iToYear=t.getFullYear();
                var  endday= t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay-e)).toLocaleDateString();
                this.startday = startday;
                this.endday = endday;
                this.lineparams.time = [startday, endday];
                this.filterparams.time = [startday, endday];
                this.getFilterData();
            },
            startdayChange (e) {
                this.lineparams.time[0] = e;
                this.filterparams.time[0] =e;
                 this.getFilterData();
            },
            enddayChange (e) {
                this.lineparams.time[1] = e;
                this.filterparams.time[1] =e;
                 this.getFilterData();
            },
            linesproviceChange (e) {
                 var obj = this.lineparams.filter;
                 if (e == '' || e == '全部') {
                     delete this.lineparams.filter.province;
                     this.marketList2 = [];
                    return;
                 }
                 obj = Object.assign(obj, {'province':[e]});
                 this.lineparams.filter = obj;
                  this.marketList2 = [];
                 this.marketparams2.areaName = e;
                 this.getmarket2();
            },
            linesmarketChange (e) {
                var obj = this.lineparams.filter;
                if (e =='' || e == '全部') {
                    delete this.lineparams.filter.market;
                    return;
                }
                obj = Object.assign(obj, {'market':[e]});
                this.lineparams.filter = obj;
               
            },
            charts1provinceChange (e) {
                if (e == '' || e == '全部') {
                    delete this.params.filter.province;
                    this.marketList1 =[];
                    return;
                }
                var obj = this.params.filter;
                obj = Object.assign(obj, {'province':[e]});
                this.params.filter = obj;
                this.marketList1 =[];
                this.marketparams.areaName = e;
                this.getmarket1();
            },
            charts1marketChange (e) {
                if (e =='' || e == '全部') {
                    delete  this.params.filter.market;
                    return;
                }
                var obj = this.params.filter;
                obj = Object.assign(obj, {'market':[e]});
                this.params.filter = obj;
            },
            getFilterData () {
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/goodsfilte.json',
                    // data: _this.filterparams,
                    method: 'POST',
                    url: '/bi/goods/filter',
                    body: _this.filterparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.provinceList = response.body.data.province;
                         _this.provinceList.unshift('全部');
                    }
                });
            },
            getFilterData1 () {
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/fenbu1.json',
                    // params: _this.filterparams1,
                    method: 'POST',
                    url: '/bi/goods/filter',
                    body: _this.filterparams1,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.provinceList1 = response.body.data.province;
                         _this.provinceList1.unshift('全部');
                    }
                });
            },
            getmarket1 () {
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/market.json',
                    // params: _this.marketparams,
                    method: 'POST',
                    url: '/bi/goods/series',
                    body: _this.marketparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.marketList1 = response.body.data;
                        var all = {'market': '全部'};
                        _this.marketList1.push(all);
                    }
                });
            },
            getmarket2 () {
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/market.json',
                    // params: _this.marketparams,
                    method: 'POST',
                    url: '/bi/goods/series',
                    body: _this.marketparams2,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.marketList2 = response.body.data;
                        var all = {'market': '全部'};
                        _this.marketList2.push(all);
                    }
                });
            },
            getBaseData () { //饼状图数据
                var _this = this;
                 _this.$Loading.start();
                _this.piespinShow =true;
                _this.barspinShow = true;
                _this.linebarspinShow =true;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/fenbu.json',
                    // data: _this.params,
                    method: 'POST',
                    url: '/bi/goods',
                    body:_this.params,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.piespinShow = false;
                        _this.barspinShow = false;
                        _this.linebarspinShow = false;
                        _this.pieData = response.body.data.status;
                        _this.LineBarData = response.body.data.overdue;
                        _this.initPieCharts();
                        _this.initBarCharts();
                        _this.initLineBarCharts();
                    }
                    if(response.body.code == 10106) {
                        this.$Message.warning('您尚未登录，请登录', 1.5, function () {
                           window.location.href='http://oa.zdongpin.com/';
                        });
                    }
                });
            },
            getLineData () {
                var _this = this;
                _this.$Loading.start();
                _this.linesspinShow =true;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/fenbu3.json',
                    // data: _this.params,
                     method: 'POST',
                    url: '/bi/goods/trend',
                    body:_this.lineparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.linesspinShow = false;
                        _this.linesData = response.body.data.全部;
                        _this.initLinesCharts();
                    }
                });
            },
            initPieCharts () {
                var _this = this,
                myCharts = eCharts.init(document.getElementById('pieCharts'));
                var totalPieData = _this.pieData,
                    totalSale = 0, //上架
                    totalNotSale = 0, //下架
                    totalDelete = 0 ;//已删除
                        totalSale = totalPieData[1][0].total_sale;
                        totalNotSale = totalPieData[2][0].total_not_sale;
                        totalDelete = totalPieData[0][0].total_delete;
                    _this.pieTotal = totalSale+totalNotSale+totalDelete;
                   myCharts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}:{d}%'
                    },
                    legend: {
                         orient: 'vertical',
                         x: 'left',
                         data: ['上架', '下架', '删除']
                    },
                    series: [
                        {
                            type:'pie',
                            data:[
                                {value:totalSale, name:'上架'},
                                {value:totalNotSale, name:'下架'},
                                {value:totalDelete, name:'删除'}
                            ],
                            label: {
                            normal: {
                                show:false,
                                textStyle: {
                                    color: '#999',
                                    fontSize: '14px'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        }}]
                   });
            },
            initBarCharts () {
                var _this = this,
                myBarCharts = eCharts.init(document.getElementById('barCharts'));
                var totalBarData = _this.pieData,
                    totalSale = 0, //上架
                    totalNotSale = 0, //下架
                    totalDelete = 0 ;//已删除
                    
                        totalSale = totalBarData[1][0].total_sale;
                        totalNotSale = totalBarData[2][0].total_not_sale;
                        totalDelete = totalBarData[0][0].total_delete;
                    
                    myBarCharts.setOption({
                  color:['#61A0A8', '#C23531', '#2F4554'],
            tooltip: {trigger: 'item', formatter: '数量：{b}'},
            grid: { left: 250},
            xAxis: {axisLine: {lineStyle: {color: '#ccc'}},
            axisLabel: {textStyle: {color: '#777'}}},
            yAxis: [{inverse: true, splitLine: {show: true},
                axisTick: {length: 100, lineStyle: {color: '#ccc'}},
                axisLine: {lineStyle: {color: '#ccc'}},
            data: [totalSale, totalNotSale, totalDelete]
            }, {
        name: '           商品数',
        nameLocation: 'start',      
        nameTextStyle: {
            fontWeight: 'bold'
        },
        position: 'left',
        offset: 130,
        axisLine: {
            onZero: false,
            show: false          
        },
        axisTick: {
            length: 70,
            inside: true,
            lineStyle: {color: '#ccc'}
        },      
        axisLabel: {
            inside: true
        },      
        inverse: true,   
        data: [totalSale, totalNotSale, totalDelete]   //商品数
            }, {
        name: '                状态',
        nameLocation: 'start',
        nameTextStyle: {
            fontWeight: 'bold'
        },      
        position: 'left',
        offset: 220,
        axisLine: {
            onZero: false,
            show: false
        },
        axisTick: {
            length: 100,
            inside: true,
            lineStyle: {color: '#ccc'}          
        },
        axisLabel: {
            inside: true
        },
        inverse: true,
        data: ['上架', '下架', '删除']      
            }],
            series: [{
        type: 'bar',
        data: [totalSale, totalNotSale, totalDelete],  //柱状图
        label: {
            normal: {
                show: true,
                position: 'right',
                textStyle: {color: '#000'}
            }
        }
                }]
                    });
            },
            initLineBarCharts () {
                var _this = this,
                myCharts = eCharts.init(document.getElementById('linebarCharts'));
                var totalLineBarData = _this.LineBarData,
                    totalOverdue = totalLineBarData.overdue,
                    totalIndue = totalLineBarData.all_goods-totalOverdue;
                   _this.lineBarTotal = totalOverdue+totalIndue;
                    myCharts.setOption({
                        tooltip:{
                        trigger: 'item',
                        formatter: '{a}数量:{c}'
    },
       legend: {
         y: 'bottom',
        data:['未过期', '已过期']
    },
    xAxis: {
        data: [],
        type:'value',
        show:false,
         axisTick: {
                show: false
            }
    },
    yAxis: {
        type: 'category',
        show:false,
         axisTick: {
                show: false
            }
    },
    series: [{
        type: 'bar',
        name:'未过期',
        data:[totalIndue],
        stack: 'income',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: function(obj) {
                        return (obj.value/ _this.lineBarTotal*100).toFixed(0)+'%';
                    }
                }
            }
    }, {
        type:'bar',
         name:'已过期',
        data:[totalOverdue],
        stack: 'income',
            barWidth: 30,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    formatter: function(obj) {
                        return (obj.value/ _this.lineBarTotal*100).toFixed(0) +'%' ;
                    }
                }
            }
    }]
                    });
            },
            // 折线图
            initLinesCharts () {
                 var _this = this,
                myCharts = eCharts.init(document.getElementById('linesCharts'));
                var lineData = _this.linesData,
                    xTime = [],
                    ytotal_new = [], //新增商品
                    ytotal_delete = [],  //已删除商品
                    ytotal_sale = [],   //上架商品
                    ytotal_not_sale = [], //下架商品
                    ytotal_overdue = [];  //过期商品
                    for(var i in lineData){
                            xTime.push(lineData[i].time);
                            ytotal_delete.push(lineData[i].total_delete);
                            ytotal_new.push(lineData[i].total_new);
                            ytotal_overdue.push(lineData[i].total_overdue);
                            ytotal_sale.push(lineData[i].total_sale);
                            ytotal_not_sale.push(lineData[i].total_not_sale);
                        }
                       myCharts.setOption({
                    legend: {
                        data: ['新增商品', '删除商品', '上架商品', '下架商品', '过期商品'],
                        y: 'bottom'
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    tooltip : {
                        trigger: 'axis'
                    },
                    xAxis : [
                        {
                            type: 'category',
                             boundaryGap: true,
                             data : xTime
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : { formatter: '{value} ' }
                        }
                    ],
                    series : [
                {
                            name:'删除商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'green'
                                    }
                                }
                            },
                            data:ytotal_delete
                        },
                          
                         
                           {
                            name:'新增商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'pink'
                                    }
                                }
                            },
                            data:ytotal_new
                        },
                        {
                            name:'过期商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'brown'
                                    }
                                }
                            },
                            data:ytotal_overdue
                        },
                         {
                            name:'上架商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'rgba(0.2,0.1,0,1.0)'
                                    }
                                }
                            },
                            data:ytotal_sale
                        },
                         {
                            name:'下架商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'rgba(0.2,0.1,0,1.0)'
                                    }
                                }
                            },
                            data:ytotal_not_sale
                        }
                    ]
                       });
            }
        },
        created () {
            this.getDefaultDate ();
            this.getFilterData1();
            this.getFilterData();
            this.getBaseData();
            this.getLineData();
        }
    };
</script>