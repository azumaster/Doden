<template>
	<div>
		<div class="layout-header">用户分布和趋势</div>
		<div class="layout-content-main">
			 <Tabs>
			 	<Tab-pane label="分布和趋势">
			 	<!-- 头部筛选项 -->
			 		<div>
						<Row :gutter="10">
					        <Col span="4">
					            <div>
									<Select v-model="timeLenth" style="width:200px" @on-change="timeLenthChange">
				        				<Option v-for="item in timeList" :value="item.value" :key="item">{{ item.label }}</Option>
				    				</Select>
					            </div>
					        </Col>
					        <Col span="6">
					            <div class="timeP">
									<Date-picker type="date" v-model="starttime" format="yyyy-MM-dd" placeholder="选择日期" @on-change="timeBchange" style="width: 200px"></Date-picker>
									<p>至</p>
					            	<Date-picker type="date" v-model="nowTime" format="yyyy-MM-dd" placeholder="选择日期" @on-change="timeEchange" style="width: 200px"></Date-picker>
					            </div>
					        </Col>
					        <Col span="4">
					            <div>
					            	<Select v-model="provincemodel" style="width:200px" @on-change="provinceChange">
        								<Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
    								</Select>
					            </div>
					        </Col>
					         <Col span="4">
					            <div>
					            	<Select v-model="citymodel" style="width:200px" @on-change="cityChange" placeholder="全部市">
        								<Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
    								</Select>
					            </div>
					        </Col>
					         <Col span="4">
					            <div>
									<Select v-model="districtmodel" style="width:200px" placeholder="全部区县" @on-change="districtchange">
        								<Option v-for="item in districtList" :value="item" :key="item">{{ item }}</Option>
    								</Select>
					            </div>
					        </Col>
					        <Col span="2">
					            <div>
									<Button type="primary" icon="ios-search" @click="seeWhat">查看</Button>
					            </div>
					        </Col>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
					<h4 style="margin: 20px 0;">用户分布</h4>
					<div>
						<Row>
					        <Col span="12">
								<div id="trapezoid" style="height: 200px;width: 100%;"></div>
					        </Col>
					        <Col span="12">
					        	<div id="table" style="height: 200px;width: 100%;"></div>
					        </Col>
					    </Row>
					</div>
					<hr/>
					<div  class="selectlist">
						<div style="margin-right: 20px;"><h4>增长趋势</h4></div>
						<Radio-group v-model="linesParams.group" type="button" @on-change="groupChange">
					        <Radio label="day">按日查看</Radio>
					        <Radio label="week">按周查看</Radio>
					        <Radio label="month">按月查看</Radio>
					        <Radio label="year">按年查看</Radio>
					    </Radio-group>
				    </div>
				    <div style="margin: 40px 0;">
				    	<div id="lines" style="width: 100%;height: 500px"></div>
				    </div>
			 	</Tab-pane>
			 </Tabs>
		</div>
		<Footer></Footer>
	</div>
</template>
<script>
	import Footer from  '../../components/footer.vue';
	import Base from './../../common/base.js';
	import eCharts  from 'echarts';
	export default {
		mixins:[Base],
		components: {Footer},
		data () {
			return {
				provincemodel: '',
				provinceList: [],
				citymodel: '',
				cityList:  [],
				districtmodel: '',
				districtList:  [],
				provinceparams: {time: []},
				citysparams: {pid: 0},
				districtparams: {pid: 0,cid: 0},
				allPeopleParams: {time: [],filter: {province_id: [], city_id: []}},
				linesParams: {group: 'day',time: [],filter: {province: [], city: [], district: []}},
				data: {},
				liensdata: {}
			}
		},
		methods: {
			timeBchange (e) {this.allPeopleParams.time[0] = e; this.linesParams.time[0] = e;},
			timeEchange (e) {this.allPeopleParams.time[1] = e; this.linesParams.time[1] = e;},
			timeLenthChange (e) {
			if (e == 0) {this.allPeopleParams.time[0] = '2015-01-01'; this.linesParams.time[0] = '2015-01-01';this.starttime = '2015-01-01';}
			else {this.timeLenth = e;this.getNowTime();this.allPeopleParams.time[0] = this.starttime;this.linesParams.time[0] = this.starttime}
			},
			groupChange (e) {
				this.linesParams.group = e;
				this.getLinesData();
			},
			trapezoid () {  //梯形图
				var trapezoid =  eCharts.init(document.getElementById('trapezoid')),
					total = this.data.white_list + this.data.opened + this.data.paid;
					if(total == 0) {whiteList = 0 ;opened = 0; paid = 0;}
					else {
						var	whiteList = (this.data.white_list/total*100).toFixed(2),
						opened = (this.data.opened/total*100).toFixed(2),
						paid = (this.data.paid/total*100).toFixed(2);
				}
				trapezoid.setOption({
				    tooltip: {
				        trigger: 'item',
				        formatter: "{c}%(已开通人数/白名单人数)"
				    },
    			calculable: true,
				    series: [
				        {
				            type:'funnel',
				            width: '50%',
				            height: '70%',
				            min: 0,
				            max: 100,
				            minSize: '30%',
				            maxSize: '90%',
				            sort: 'descending',
				            gap: 0,
				            label: {
				                normal: {
				                    show: true,
				                    position: 'outside'
				                },
				                emphasis: {
				                    textStyle: {
				                        fontSize: 15
				                    }
				                }
				            },
				            labelLine: {
				                normal: {
				                    length: 10,
				                    lineStyle: {
				                        width: 1,
				                        type: 'solid'
				                    }
				                }
				            },
				           
				            data: [
				                {value: opened, name: '(已开通人数/白名单人数)'},
				                {value: paid, name: '(已支付人数/白名单人数)'},
				                {value: whiteList, name: '白名单'}
				            ]
				        }
				    ]
				});
			},
			table () { //table表格
				var table =  eCharts.init(document.getElementById('table')),
					table_data = [];
					table_data.push(this.data.white_list);
					table_data.push(this.data.opened);
					table_data.push(this.data.paid);
				table.setOption({
					color:['#61A0A8', '#C23531', '#2F4554'],
		            tooltip: {trigger: 'item', formatter: "数量：{b}"},
		            grid: { left: 250},
		            xAxis: {axisLine: {lineStyle: {color: '#ccc'}}
		        },
		            yAxis: [{inverse: true, splitLine: {show: true},
		                axisTick: {length: 100},
		                axisLine: {lineStyle: {color: '#ccc'}},
		            data: table_data
		            }, {
			        name: '           人数',
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
			            inside: true,
			        },      
			        inverse: true,   
			        data: table_data   //
			            }, {
			        name: '                用户',
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
			        data: ['白名单', '已开通', '已支付']      
			            }],
		            series: [{
				        type: 'bar',
				        data: table_data,  //柱状图
		                }]
				});
			},
			lines () {
				var lines =  eCharts.init(document.getElementById('lines')), linesTime = [], white_list = [], paid = [], opened = [], _this= this;
				for (var i in _this.liensdata.white_list) {linesTime.push(_this.liensdata.white_list[i].time); white_list.push(_this.liensdata.white_list[i].num);}
				for (var j in _this.liensdata.paid) {paid.push(_this.liensdata.paid[j].num);}
				for (var e in  _this.liensdata.opened) {opened.push(_this.liensdata.opened[e].num);}
				lines.setOption({
					color: ['#91c7ae', '#61A0A8','#D48265'],
				    xAxis: {
				        data: linesTime
				    },
				    tooltip: {
				    	trigger: 'axis',
				        show: true
				    },
				    yAxis: {},
				    legend: {
				        data: ['新增白名单人数', '新增开通人数', '新增支付人数'],
				        y: 'bottom'
				    },
				    series: [
				    {
				        type: 'bar',
				        name: '新增白名单人数',
				        barWidth: '10%',
				        data: white_list
				    },{
				        type: 'line',
				        name: '新增开通人数',
				        data: opened
				    }, 
				    {
				        type: 'line',
				        name: '新增支付人数',
				        data: paid
				    }]
				});
			},
			seeWhat () { //搜索
				console.log(this.allPeopleParams, this.linesParams);
				this.getAllPeople();
				this.getLinesData();
			},
			//获得省列表
			getProvince () {
				var _this = this;
				_this.$http({
					method: 'POST',
					url: '/bi/loans/filter',
					// method: 'GET',
					// url: './mock/sheng.json',
					header: 'Accept application/json',
					body: _this.provinceparams
				}).then(response => {
					if (response.body.code == 0) {
						_this.provinceList = response.body.data;
						_this.provinceList = Object.assign(_this.provinceList, {'all': '全部'});
					}
				})
			},
			provinceChange() { //省改变获得市
				var _this = this;
				_this.cityList = [];
				_this.allPeopleParams.filter.province_id = [];
				if (_this.provincemodel == '全部') { _this.allPeopleParams.filter.province_id = [];_this.allPeopleParams.filter.city_id = [];_this.allPeopleParams.filter.county_id = [];_this.linesParams.filter.province = [];_this.linesParams.filter.city = [];_this.linesParams.filter.district = [];_this.cityList = [];_this.districtList = [];return;}
				for (var i in _this.provinceList) {
					if (_this.provincemodel ==_this.provinceList[i]) {
						_this.citysparams.pid = i; _this.allPeopleParams.filter.province_id.push(i);
						_this.districtparams.pid  = i;_this.districtList = [];}
				};
				_this.linesParams.filter.province.push(_this.provincemodel);
				_this.getCities();
			},
			getCities () {
				var _this = this;
				_this.$http({
					method: 'GET',
					params: _this.citysparams,
					// url: './mock/shi.json',
					url: '/city',
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code ==0) {_this.cityList = response.body.data;_this.cityList.push('全部');}
				});
			},
			cityChange () {
				var _this = this;
				_this.districtList = [];
				_this.allPeopleParams.filter.city_id = [];
				_this.linesParams.filter.city = [];
				if (_this.citymodel == '全部') {_this.districtList = []; _this.allPeopleParams.filter.city_id = []; ;_this.allPeopleParams.filter.county_id = [];
					 _this.linesParams.filter.city = [];  _this.linesParams.filter.district = [];return;}
				for (var i in _this.cityList) {
					if (_this.citymodel == _this.cityList[i]) {
						
						_this.districtparams.cid =i; _this.allPeopleParams.filter.city_id.push(i);
					}
				}
				_this.linesParams.filter.city.push(_this.citymodel);
				_this.getDistrict();
			},
			getDistrict () {
				var _this = this;
				_this.$http({
					method: 'GET',
					// url: './mock/qu.json',
					url: '/county',
					params: _this.districtparams
				}).then(response => {
					if (response.body.code == 0) {_this.districtList = response.body.data;_this.districtList.push('全部');}
				})
			}, //以上为筛选项里的省市级联
			districtchange () {
				var _this = this;
				if (_this.districtmodel == '全部') {delete _this.allPeopleParams.filter.county_id;delete _this.linesParams.filter.district; return;}
				for (var i in _this.districtList) {
					if(_this.districtmodel == _this.districtList[i]) {_this.allPeopleParams.filter.county_id = [i]}
				}
				_this.linesParams.filter.district.push(_this.districtmodel);
			},
			getAllPeople () { //获得上部分的数据
				var _this = this;
				_this.$http({
					// method: 'GET',
					// url: './mock/allperson.json',
					method: 'POST',
					url: '/bi/loans/user/total',
					body: _this.allPeopleParams,
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {_this.data = response.body.data;_this.trapezoid();_this.table();}
				});
			},
			getLinesData () { //获得柱状图数据
				var _this = this;
				_this.$http({
					// method: 'GET',
					// url: './mock/trend.json',
					method: 'POST',
					url: '/bi/loans/user/trend',
					header: 'Accept application/json',
					body: _this.linesParams
				}).then(response => {
					if (response.body.code == 0) {_this.liensdata = response.body.data;_this.lines();}
				});
			}

		},
		created () {
			this.getNowTime();
			this.provinceparams.time[0] = this.starttime;
			this.provinceparams.time[1] = this.nowTime;
			this.allPeopleParams.time[0] = this.starttime;
			this.allPeopleParams.time[1] = this.nowTime;
			this.linesParams.time[0] = this.starttime;
			this.linesParams.time[1] = this.nowTime;
			this.getProvince();
			this.getAllPeople();
			this.getLinesData();
		}
	}
</script>
<style>
	.selectlist {display: inline-flex;margin-top: 50px;}
	.selectlist h4 {line-height: 32px;}
	.timeP{display: flex;}
	.timeP p {line-height: 32px;padding: 0 10px;}
</style>