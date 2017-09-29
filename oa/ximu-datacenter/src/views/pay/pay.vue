<template>
	<div>
		<div class="layout-header">支付分布和趋势</div>
		<div class="layout-content-main">
			 <Tabs>
			 	<Tab-pane label="支付分布和趋势">
			 		<!-- 头部筛选项 -->
			 		<div>
						<Row :gutter="16">
					        <Col span="3">
					            <div>
									<Select v-model="timeLenth" style="width:160px" @on-change="timeLenthChange">
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
					        <Col span="3">
					            <div>
					            	<Select v-model="provincemodel" style="width:160px" @on-change="provinceChange">
								        <Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
								    </Select>
					            </div>
					        </Col>
					         <Col span="3">
					            <div>
					            	<Select v-model="citymodel" style="width:160px" @on-change="cityChange">
								        <Option v-for="item in cityList" :value="item" :key="item">{{ item }}</Option>
								    </Select>
					            </div>
					        </Col>
					         <Col span="3">
					            <div>
					            	<Select v-model="districtmodel" style="width:160px" @on-change="districtChange">
								        <Option v-for="item in districtList" :value="item" :key="item">{{ item }}</Option>
								    </Select>
					            </div>
					        </Col>
					        <Col span="3">
					            <div>
					            	<Select v-model="params.show" style="width:160px">
								        <Option v-for="item in payList" :value="item.value" :key="item">{{ item.label }}</Option>
								    </Select>
					            </div>
					        </Col>
					        <Col span="3">
					            <div><Button type="primary" icon="ios-search" @click="soso">搜索</Button></div>
					        </Col>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
					<div  class="selectlist">
						<div style="margin-right: 20px;"><h4>增长趋势</h4></div>
						<Radio-group v-model="params.group" type="button">
					        <Radio label="day">按日查看</Radio>
					        <Radio label="week">按周查看</Radio>
					        <Radio label="month">按月查看</Radio>
					        <Radio label="year">按年查看</Radio>
					    </Radio-group>
				    </div>
				    <div style="margin: 20px 0">
				    	<div id="linesPic" style="height: 500px;width: 100%;"></div>
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
		components: {Footer},
		mixins:[Base],
		data () {
			return {
				provincemodel: '',
				group: 'day',
				citymodel: '',
				districtmodel: '',
				paymodel: '',
				provinceList: [],
                cityList: [],
                districtList: [],
                payList: [
                	{
                        value: 'shop_num',
                        label: '未支付店铺数'
                    },
                     {
                        value: 'pay_num',
                        label: '支付订单笔数'
                    },
                    {
                        value: 'amount',
                        label: '支付金额'
                    }
                ],
                params: {
                	group: 'day',
                	time: [],
                	filter: {
                		province: [],
                		city: [],
                		district: []
                	},
                	show: 'shop_num'
                },
                data: [],
                provinceparams: {pid: 0},
                cityparsma: {pid: 0, cid: 0}
			}
		},
		methods: {
			soso () {
				this.getData();
				
			},
			timeLenthChange (e) { //时间长度改变
				if (e == 0) {this.starttime = '2015-01-01';}
				else {this.timeLenth = e;this.getNowTime();this.params.time[0] = this.starttime;}
			},
			timeBchange (e) {	//开始时间
				this.params.time[0] = e;
			},
			timeEchange (e) { //结束时间
				this.params.time[1] = e;
			},
			linesInit () {
				var linesPic =  eCharts.init(document.getElementById('linesPic')),
				    timeData = [],
				    yData = [];
				    for (var i in this.data) {
				    	timeData.push(this.data[i].time);
				    	yData.push(this.data[i].value);
				    }
				linesPic.setOption({
					legend: {
						data: ['支付金额']
					},
				    tooltip : {
				        trigger: 'axis'
				    },    
				    xAxis: {
				        data:timeData
				    },
				    yAxis: {

				    },
				    series: [{
				    	name: '支付金额',
				        type: 'line',
				        data:yData
				    }]
				});
			},
			getData () { //获得数据
				var _this = this;
				_this.$http({
					method: 'POST',
					url: '/bi/loans/payment/trend',
					body: _this.params,
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.data = response.body.data;
						_this.linesInit();
					};
				});
			},
			getProvince () { //获得省
				var _this = this;
				_this.$http({
					method: 'POST',
					body: {time: ['2015-01-01', _this.nowTime]},
					url: '/bi/loans/filter',
					header:　'Accept application/json'
				}).then(response => {
					if (response.body.code ==0) {_this.provinceList = response.body.data;_this.provinceList = Object.assign(_this.provinceList, {'all': '全部'});} 
				});
			},
			provinceChange () {
				var _this = this;
				_this.params.filter.province = [];
				if (_this.provincemodel == '全部') {
					_this.params.filter.province = [];_this.params.filter.city = [];_this.params.filter.district = [];_this.cityList = [];_this.districtList = [];}
				else {_this.params.filter.province.push(_this.provincemodel);
					for (var i in _this.provinceList) {
						if (_this.provincemodel == _this.provinceList[i]) {
							_this.provinceparams.pid = i;
							_this.cityparsma.pid = i;
							_this.getCities();
						}
					}
				}
			},
			getCities () {
				var _this = this;
				_this.$http({
					method: 'GET',
					url: '/city',
					params: _this.provinceparams,
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {_this.cityList = response.body.data; _this.cityList.push('全部')}
				});
			},
			cityChange() {
				var _this = this;
				_this.params.filter.city = [];
				if (_this.citymodel == '全部') {_this.districtList = [];}
				else{_this.params.filter.city.push(_this.citymodel);
					for(var i in _this.cityList) {
						if (_this.citymodel == _this.cityList[i]) {this.cityparsma.cid = i; _this.getDistrict();}
					}
				}
			},
			getDistrict () {
				var _this = this;
				_this.$http({
					method: 'GET',
					url: '/county',
					params: _this.cityparsma,
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.districtList = response.body.data;
						_this.districtList.push('全部');
					}
				});
			},
			districtChange() {
				var _this = this;
				_this.params.filter.district = [];
				if(_this.districtmodel == '全部') {_this.params.filter.district = [];}
				else {_this.params.filter.district.push(_this.districtmodel);}
			}
		},
		created () {
			this.getNowTime();
			this.params.time[0] = this.starttime;
			this.params.time[1] = this.nowTime;
			this.getData();
			this.getProvince();
		}
	}
</script>