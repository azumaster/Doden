<template>
	<div id="analysisBody">
		<!-- 头部筛选项 -->
			 		<div id="border_bottom">
						<Row>
					        <Col span="3">
					            <div style="margin:30px 0">
									<Select   @on-change="timeLenthChange" v-model="timeLenth" style="width:146px">
				        				<Option v-for="item in timeList" :value="item.value" :key="item">{{ item.label }}</Option>
				    				</Select>
					            </div>
					        </Col>
					        <Col span="6">
					            <div class="timeP">
									<Date-picker type="date" v-model="params.time[0]"  format="yyyy-MM-dd" placeholder="选择日期" @on-change="kaishitimeChange" style="width: 130px;"></Date-picker>
									<p>至</p>
					            	<Date-picker type="date" v-model="params.time[1]" format="yyyy-MM-dd" placeholder="选择日期" @on-change="jieshutimeChange" style="width: 130px;"></Date-picker>
					            </div>
					        </Col>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
			<!-- 底部表格 -->
					<div id="eChartsPic"  style="width: 100%;height: 550px;margin-bottom: 20px; margin-left:-130px;"></div>
	
	</div>
</template>
<script>
// 按需引入折线图
	var eCharts  =require ('echarts/lib/echarts');
		require('echarts/lib/chart/line');
		require('echarts/lib/component/tooltip');
		require('echarts/lib/component/title');

	import Base from './../../common/base.js';
	
	export default {
		
		mixins: [Base],
			data () {
				return {
					timeList: [
						{value: 7, label: '最近7天'},{value: 15, label: '最近15天'},{value: 30, label: '最近30天'}
					],
					params: {
						time: []
					},
					time_0: '',
					time_1: '',
					xData: [],
					yData: [],
					lineData: [],
				}
			},
			methods: {
				kaishitimeChange (e) {
					this.time_0 = e;
					this.params.time[0] = e;
					this.params.time[1] = this.time_1;
					this.getBaseData();
				},
				jieshutimeChange (e) {
					this.time_1 = e;
					this.params.time[0] = this.time_0;
					this.params.time[1] = e;
					this.getBaseData();
				},
				getBaseData () {
					var _this = this;
					_this.$http({
						method: 'GET',
						params: _this.params,
						url: './mock/fenxi.json',
						// url: '/statics/custom',
						header: 'Accept:application/json'
					}).then(response => {
						if (response.body.code == 0) {
							_this.lineData = response.body.data.detail;
							_this.initeChartsPic();
						}
					})
				},
				initeChartsPic () {
					var eChartsPic = eCharts.init(document.getElementById('eChartsPic'));
					this.xData = [];
					this.yData = [];
						for (var i in this.lineData) {
									this.xData.push(this.lineData[i].time);
									this.yData.push(this.lineData[i].number);
								}
					eChartsPic.setOption({
            		tooltip: {},
					color: ['#A4D4DB'],
					grid: {
						show:true,
						borderColor: '#DCDCDC',
						backgroundColor: '#FFFFFF',
						containLabel: true
					},
					legend: {
						data:['新增客户数'],
						y: 'bottom'
					},
					xAxis: {
						data: this.xData
					},
					yAxis: {},
					series: [{
						name: '新增客户数',
						type: 'line',
						data: this.yData
					}]
							});
				}
			},
			created () {
				this.getNowTime();
				this.getBaseData();
			}
	}
</script>
<style lang="less">
	#analysisBody {margin-left: 70px;
		
	#border_bottom {border-bottom: 1px solid #F2F3F2;}
	.timeP{display: flex;margin: 30px 0;}
	.timeP p {line-height: 32px;padding: 0 10px; font-size: 14px;}
	}
</style>