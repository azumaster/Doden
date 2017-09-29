<template>
<div>
    <h1>商品统计</h1>
<Alert type="error" show-icon closable="true" v-if="alert">
        您还未登录
        <span slot="desc">
            请登录
        </span>
    </Alert>
    <div class="datepicker">
           <Date-picker type="daterange" placement="bottom-start" placeholder="默认为最近7天" style="width: 300px" @on-change="dateChange"></Date-picker>
    </div>
    <div>
    
    <div class="margintop20">
        <Radio-group v-model="params.group">
        <Radio label="day">按日</Radio>
        <Radio label="week">按周</Radio>
        <Radio label="month">按月</Radio>
        <Radio label="year">按年</Radio>
    </Radio-group>
    </div>
    <div class="margintop20"><span>省</span>
        <Checkbox-group v-model="provincemodel"  @on-change="provinceChange">
        <Checkbox v-for='i in provinceList'  :label="i"></Checkbox>
    </Checkbox-group>
    </div>

   
    <div class="margintop20"><span>区</span>
        <Checkbox-group v-model="districtmodel"  @on-change="districtChange">
        <Checkbox v-for='i in districtList'   :label="i"></Checkbox>
    </Checkbox-group>
    </div>
    <div class="margintop20"><span>种类</span>
    <Checkbox-group v-model="sortmodel"  @on-change="sortChange">
        <Checkbox v-for='i in sortList'  :label="i"></Checkbox>
    </Checkbox-group>
    </div>

    
    <div class="margintop20"><span>市场</span>
        <Checkbox-group v-model="marketmodel"  @on-change="marketChange">
        <Checkbox v-for='i in marketList'  :label="i"></Checkbox>
    </Checkbox-group>
    </div>
    
    <div>
        <Button type="primary" @click="select">确认筛选</Button>
    </div>
    </div>
    <Card :bordered="true">
    <div id="totalChart" class="chart" style="width: 100%; height: 500px"></div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
</div>
</template>
<script>
import eCharts from 'echarts';
import Static from '../../common/static.js'; //引入请求本地的数据，上线时注释即可
    export default {
        mixins: [Static],   //引入请求本地的数据，上线时注释即可
        data(){
            return {
                spinShow: true,   //加载中
                provincemodel: '',
                provinceList: [],
                alert: false,
                districtmodel: '',
                districtList: [],
                sortmodel: '',
                sortList: [],
                marketmodel: '',
                marketList: [],
                totalEcharts: [],  //存储返回的数据
                filterparams:{
                    time: [],
                    filter: ['sort', 'provice', 'district', 'market']
                },
                params:{
                    time: [],
                    group: 'day',
                    filter: {
                        // 'provice': [],
                        // 'city': [],
                        // 'market': [],
                        // 'sort':[]
                    },
                    split:[
                        // {'provice': []},
                        // {'city': []}
                    ]
                }
            }
        },
        methods:{
            dateChange(e){
                this.start = e[0];
                this.end = e[1];
                this.filterparams.time = [this.start, this.end];
                this.params.time = [this.start, this.end];
                this.time = this.params.time;
                this.getFilterData();
            },
            provinceChange(){
                var _this= this;
                var obj = _this.params.filter;
                obj = Object.assign(obj, {'province': _this.provincemodel});
                _this.params.filter = obj;
            },
            sortChange(){
                var _this = this;
                 var obj = _this.params.filter;
                 obj = Object.assign(obj, {'sort': _this.sortmodel});
                  _this.params.filter = obj;
            },
            districtChange(){
                var _this =this;
                var obj = _this.params.filter;
                obj = Object.assign(obj, {'district': _this.districtmodel});
                _this.params.filter = obj;
            },
            marketChange(){
                var _this =this;
                var obj = _this.params.filter;
                obj = Object.assign(obj, {'market': _this.marketmodel});
                _this.params.filter = obj;
            },
              //最开始获得数据 提交时，提交这部分代码，混入的注释掉
            getBaseData(){
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/goods',
                    body: _this.params,
                    header: 'Accept application/json'
                }).then(response =>{
                    if(response.body.code == 0){
                         _this.spinShow = false ;
                        _this.totalEcharts = response.body.data.全部;
                        _this.initTotalCharts();
                    }
                    else if(response.body.code != 0){
                        _this.alert = true;
                    }
                });
            },
            //获取筛选项
            getFilterData(){
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/goods/filter',
                    body: _this.filterparams,
                    header: 'Accept application/json'
                }).then(response => {
                    _this.provinceList = response.body.data.province;
                    _this.sortList = response.body.data.sort;
                    _this.districtList = response.body.data.district;
                    _this.marketList = response.body.data.market;
                })
            },
            //晒选结果
            select(){
                this.spinShow = true;
                this.getBaseData();
            },
            //图表
            initTotalCharts(){
                var _this =this,
                    myChart = eCharts.init(document.getElementById('totalChart'));
                    var  totalEchartsData = _this.totalEcharts,
                        yTime = [],
                        ytotal_audit = [], //待审核的商品
                        ytotal_normal = [], //已审核的商品
                        ytotal_close = [],  //已下架的商品
                        ytotal_delete = [],  //已删除商品
                        ytotal_reject = [], //已拒绝商品
                        ytotal_modify_audit = [], //修改待审核的商品
                        ytotal_perfect = [],  //待完善的商品
                        ytotal_new = [], //新增商品
                        ytotal_overdue = [],   //过期商品
                        ytotal_sale = [],   //上架商品
                        ytotal_not_sale = [];//下架商品
                        for(var i in totalEchartsData){
                            yTime.push(totalEchartsData[i].time);
                            ytotal_audit.push(totalEchartsData[i].total_audit);
                            ytotal_normal.push(totalEchartsData[i].total_normal);
                            ytotal_close.push(totalEchartsData[i].total_close);
                            ytotal_delete.push(totalEchartsData[i].total_delete);
                            ytotal_reject.push(totalEchartsData[i].total_reject);
                            ytotal_modify_audit.push(totalEchartsData[i].total_modify_audit);
                            ytotal_perfect.push(totalEchartsData[i].total_perfect);
                            ytotal_new.push(totalEchartsData[i].total_new);
                            ytotal_overdue.push(totalEchartsData[i].total_overdue);
                            ytotal_sale.push(totalEchartsData[i].total_sale);
                            ytotal_not_sale.push(totalEchartsData[i].total_not_sale);
                        }
                    myChart.setOption({
                legend: {
                        data: ['待审核的商品', '已审核的商品', '已下架的商品', '已删除的商品', '已拒绝的商品', '修改待审核的商品', '待完善的商品', '新增商品', '过期商品', '上架商品', '下架商品']
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
                             data : yTime
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
                            name:'待审核的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'red'
                                    }
                                }
                            },
                            data:ytotal_audit
                        },
                         {
                            name:'已审核的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'yellow'
                                    }
                                }
                            },
                            data:ytotal_normal
                        },
                         {
                            name:'已下架的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'blue'
                                    }
                                }
                            },
                            data:ytotal_close
                        },
                         {
                            name:'已删除的商品',
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
                            name:'已拒绝的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'rgba(0.2,0.1,1.0,0)'
                                    }
                                }
                            },
                            data:ytotal_reject
                        },
                         {
                            name:'修改待审核的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'black'
                                    }
                                }
                            },
                            data:ytotal_modify_audit
                        },
                         {
                            name:'待完善的商品',
                            type:'line',
                            smooth:false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor : 'gray'
                                    }
                                }
                            },
                            data:ytotal_perfect
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
                    })
            }
        },
        created(){
            this.getBaseData();
            this.getFilterData();
        }
    }
</script>div
<style scoped>
    .ivu-checkbox-group{
        display: inline-block;
    }
     .ivu-btn-primary{display:block;margin:20px 0;}
     .datepicker,.margintop20{margin-top:20px;}
</style>
