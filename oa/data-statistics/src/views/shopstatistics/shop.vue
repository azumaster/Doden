<template>
<div>
<h1>店铺统计</h1>
 <Alert type="error" show-icon closable="true" v-if="alert">
        您还未登录
        <span slot="desc">
            请登录
        </span>
    </Alert>
	<div class="timepicker">
		   <Date-picker type="daterange" placement="bottom-start" placeholder="默认为7天前到今天"
                                 style="width: 300px" @on-change="dateChange1"></Date-picker>
	</div>
	<div>
	
	<div class="margintop20">
		<Radio v-model="provincesingle" >全部</Radio>
		<Checkbox-group v-model="province" @on-change="provinceChange">
        <Checkbox v-for='i in provinceList'  :label="i"></Checkbox>
    </Checkbox-group>
	</div>
	<template>
		<Button type="primary" @click="select1">确认筛选</Button>
	</template>
	</div>
	<Card :bordered="true">
        <div id="totalChart" class="chart" style="width: 100%; height: 500px"></div>
        <Spin size="large" fix v-if="spinShow"></Spin>
	</Card>
    <!-- 折线图 -->
    <div class="timepicker">
    <Date-picker type="daterange" placement="bottom-start" placeholder="默认为7天前到今天"
                                 style="width: 300px" @on-change="dateChange2"></Date-picker></div>
                                 <div class="margintop20">
        <Radio v-model="shoptypesingle" >全部</Radio>
        <Checkbox-group v-model="shoptype" @on-change="shoptypeChange">
        <Checkbox label="11">一批</Checkbox>
        <Checkbox label="21">二批</Checkbox>
        <Checkbox label="25">餐厅</Checkbox>
    </Checkbox-group>
    </div>
    <div class="margintop20">
    <Radio-group v-model="params2.group">
        <Radio label="day">按日</Radio>
        <Radio label="week">按周</Radio>
        <Radio label="month">按月</Radio>
        <Radio label="year">按年</Radio>
    </Radio-group>
    </div>
    <Button type="primary" @click="select2">确认筛选</Button>
    <Card :bordered="true">
        <div id="totalChart2" class="chart" style="width: 100%; height: 500px"></div>
        <Spin size="large" fix v-if="spinShow2"></Spin>
    </Card>
</div>
</template>
<script>
import eCharts from 'echarts';
	export default {
		data(){
			return {
				self: this,
				spinShow: true, //加载中
                spinShow2: true,
				alert: false,
				province: [],
                shoptype: [],
                provinceList: [],
                time: [],
				provincesingle: false,
                shoptypesingle: false,
				params1: {
					time: [],
					filter: {},
                    select: 'trenchnum'
				},
                params2:{
                    time: [],
                    group:'day',
                    split: [{type: []}]
                },
                filterparams2:{
                    time: []
                },
                filterparams1:{
                    time: []
                },
                totalEcharts1: [],
                totalEcharts2: []
			}
		},
		methods:{
			dateChange1(e){
                this.start = e[0];
                this.end = e[1];
                this.filterparams1.time = [this.start, this.end];
                this.params1.time = [this.start, this.end];
                this.time = this.params1.time;
                this.getFilterData();
            },
            dateChange2(e){
                this.start = e[0];
                this.end = e[1];
                this.params2.time = [this.start, this.end];
                this.time = this.params2.time;
            },
            provinceChange () {
            	var _this = this ;
            	_this.provincesingle = false;
            	var obj = _this.params1.filter;
            	obj = Object.assign(obj, {'province': _this.province});
            	_this.params1.filter = obj;
            },
              shoptypeChange () {
                var _this = this;
                _this.shoptypesingle = false ;
                _this.params2.split[0].type = _this.shoptype;
            },
            select1 () {
            	var _this = this;
                var _this = this;
                // if(_this.params1.time.length==0){
                //     _this.$Message.warning('请先选择日期范围');
                //     return;
                // }
            	_this.spinShow = true;
                _this.getBaseData1();
                // _this.getFilterData();
           
            }, 
              select2 () {
                var _this = this;
                var _this = this;
                // if(_this.params2.time.length==0){
                //     _this.$Message.warning('请先选择日期范围');
                //     return;
                // }
                _this.spinShow2 = true;
                _this.getBaseData2();

            },
            getBaseData1 () {
            	var _this = this;
				_this.$http({
					// method: 'POST',
     //                url: '/bi/shop/histogram',
     //                body: _this.params1,
     //                header: 'Accept application/json'
                        method: 'GET',
                        url: './mock/zhuzhuangtu.json',
                        data: _this.params1,
                        header: 'Accept application/json'
				}).then(response =>{
					if(response.body.code ==0){
						_this.spinShow = false ;
						_this.totalEcharts1 = response.body.data.detail;
                        _this.initTotalCharts();
					}
					else if(response.body.code != 0){
						_this.alert = true;
					}
				});
            },
               getBaseData2 () {
                var _this = this;
                _this.$http({
                    // method: 'POST',
                    // url: '/bi/shop/chart',
                    // body: _this.params2,
                    // header: 'Accept application/json'
                        method: 'GET',
                        url: './mock/zhexiantu.json',
                        data: _this.params1,
                        header: 'Accept application/json'
                }).then(response =>{
                    if(response.body.code == 0){
                        _this.spinShow2 = false ;
                        _this.totalEcharts2 = response.body.data.全部;
                        _this.initTotalCharts2();
                    }
                    else if(response.body.code != 0){
                        _this.alert = true;
                    }
                });
            },
            getFilterData () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                     url: '/bi/shop/filter',
                   // url: './mock/shop.json',
                    data: _this.filterparams1,
                    header: 'Accept application/json'
                }).then(response =>{
                    if(response.body.code == 0){
                        _this.provinceList = response.body.data.province;
                    }
                });
            },
            initTotalCharts () {
                var _this =this,
                 myChart = eCharts.init(document.getElementById('totalChart'));
                 var totalEchartsData1 = _this.totalEcharts1,
                 xTime = [],
                 ytotal = [];
                     for(var j in totalEchartsData1){
                        xTime.push(totalEchartsData1[j].trenchnum);
                        ytotal.push(totalEchartsData1[j].num);
                     }
                     for(var i in xTime){
                        if(xTime[i] == '11'){
                            xTime[i] = '一批';
                        }
                        else if(xTime[i] == '12'){
                            xTime[i] = '厂家';
                        }
                        else if(xTime[i] == '21'){
                            xTime[i] = '二批';
                        }
                        else if(xTime[i] == '22'){
                            xTime[i] = '第三方';
                        }
                        else if(xTime[i] == '23'){
                            xTime[i] = '配送公司';
                        }
                        else if(xTime[i] == '24'){
                            xTime[i] = '终端';
                        }
                        else if(xTime[i] == '25'){
                            xTime[i] = '餐厅';
                        }
                        else if(xTime[i] == '26'){
                            xTime[i] = '商超零售';
                        }
                        else if(xTime[i] == '31'){
                            xTime[i] = '司机';
                        }
                        else if(xTime[i] == '100'){
                            xTime[i] = '直营';
                        }
                     }
                 myChart.setOption({                  
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap: true,
                            data : xTime
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    toolbox: {  
                    show:true,  
                    feature: {  
                        dataZoom: {yAxisIndex: 'none'}, 
                        dataView: { readOnly:true },  
                        restore: { show: true },
                        magicType: {//动态类型切换
                        type: ['bar', 'line']
                    },
                        saveAsImage: {show: true}
                    }  
  
                },  
                    series : [
                        {  name: '数量',
                            type:'bar',
                            data:ytotal
                        }
                    ]
                                 })
            },
            initTotalCharts2 () {
                var _this =this,
                myChart2 = eCharts.init(document.getElementById('totalChart2'));
                var totalEchartsData2 = _this.totalEcharts2,
                xTime2 = [],
                ytotal2 = [];
                for(var i in totalEchartsData2){
                    xTime2.push(totalEchartsData2[i].time);
                    ytotal2.push(totalEchartsData2[i].num);
                 }
                 myChart2.setOption({
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : xTime2
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    toolbox: {   
                    show:true,  
                    feature: { 
                        dataZoom: {yAxisIndex: 'none'}, 
                        dataView: { readOnly:true },  
                        restore: { show: true },
                         magicType: {//动态类型切换
                        type: ['bar', 'line']
                    },
                        saveAsImage: {show: true}
                    }  
  
                },  
                    series : [
                        {  name: '数量',
                            type:'line',
                            data:ytotal2
                        }
                    ]
            })
            }

		},
		created(){
			this.getBaseData1();
            this.getBaseData2();
            this.getFilterData();
		}
	}
</script>
<style scoped>
    .ivu-checkbox-group{
        display: inline-block;
    }
     .ivu-btn-primary{display:block;margin:20px 0;}
     .margintop20,.timepicker{margin-top: 20px;}
</style>
