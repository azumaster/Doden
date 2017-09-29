<template>
	<div>
		<!-- 头部筛选项 -->
			 		<div style="margin-top: 16px;">
						<Row :gutter="16">
					        <Col span="4">
					            <div>
									<Select v-model="timeLenth" style="width:200px" @on-change="timeLenthChange">
				        				<Option v-for="item in timeList" :value="item.value" :key="item">{{ item.label }}</Option>
				    				</Select>
					            </div>
					        </Col>
					        <Col span="8">
					            <div class="timeP">
									<Date-picker type="date" v-model="starttime" format="yyyy-MM-dd" placeholder="选择日期" @on-change="timeBchange" style="width: 200px"></Date-picker>
									<p>至</p>
					            	<Date-picker type="date" v-model="nowTime" format="yyyy-MM-dd" placeholder="选择日期" @on-change="timeEchange" style="width: 200px"></Date-picker>
					            </div>
					        </Col>
					        <Col span="4">
					            <div>
					            	<Button type="primary" icon="ios-search" @click="seeWhat">查看</Button>
					            </div>
					        </Col>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
					<h4 style="margin: 20px 0;">省分布</h4>
					<div>
						<Row>
					        <Col span="8"><div id="pie1" style="height: 200px"></div><p>合计：{{pie1total}}</p><p>支付店铺数</p></Col>
					        <Col span="8"><div id="pie2" style="height: 200px"></div><p>合计：{{pie2total}}</p><p>支付订单笔数</p></Col>
					        <Col span="8"><div id="pie3" style="height: 200px"></div><p>合计：{{pie3total}}</p><p>支付金额数</p></Col>
					    </Row>
					    <Row>
					        <Table :columns="provincecolumns" :data="pro_dataList2"></Table>
					        <Page :current="1" :total="prototal" :page-size="5" simple @on-change="pro_page_change"></Page>
					    </Row>
					</div>	
					<!-- 市分布 -->
					<div>
						<div style="margin: 20px 0;">
							市分布：<Select v-model="provincemodel" style="width:200px" @on-change="provinceChange1">
								        <Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
								    </Select>
						</div>
						<div>
						<Row>
					        <Col span="8"><div id="citypie1" style="height: 200px"></div><p>合计：{{citypie1total}}</p><p>支付店铺数</p></Col>
					        <Col span="8"><div id="citypie2" style="height: 200px"></div><p>合计：{{citypie2total}}</p><p>支付订单笔数</p></Col>
					        <Col span="8"><div id="citypie3" style="height: 200px"></div><p>合计：{{citypie3total}}</p><p>支付金额数</p></Col>
					    </Row>
							 <Table :columns="citycolumns" :data="citydata2"></Table>
							<Page :current="1" :total="citytotal" :page-size="5" simple style="margin-top: 20px" @on-change="city_page_change"></Page>
						</div>
					</div>
					<!-- 区县分布 -->
					<div>
						<div style="margin: 20px 0;">
							区县分布：<Select v-model="provincemodel" style="width:200px" @on-change="provinceChange2">
								        <Option v-for="item in provinceList" :value="item.value" :key="item">{{ item.label }}</Option>
								    </Select>
								    <Select v-model="citymodel" style="width:200px" @on-change="cityChange">
								        <Option v-for="item in cityList" :value="item.value" :key="item">{{ item.label }}</Option>
								    </Select>
						</div>
						<Row>
					        <Col span="8"><div id="dispie1" style="height: 200px"></div><p>合计：{{dispie1total}}</p><p>支付店铺数</p></Col>
					        <Col span="8"><div id="dispie2" style="height: 200px"></div><p>合计：{{dispie2total}}</p><p>支付订单笔数</p></Col>
					        <Col span="8"><div id="dispie3" style="height: 200px"></div><p>合计：{{dispie3total}}</p><p>支付金额数</p></Col>
					    </Row>
						<div>
							<Table :columns="disctrictcolumns" :data="disctrictdata2"></Table>
							<Page :current="1" :total="distotal" :page-size="5" simple style="margin-top: 20px" @on-change="dis_page_change"></Page>
						</div>
					</div>
	</div>
</template>
<script>
	import Base from './../../common/base.js';
	import eCharts  from 'echarts';
	export default {
		mixins:[Base],
		data () {
			return {
				prototal: 0, //总条数
				citytotal: 0,
				distotal: 0,
				pie1total:0,
				pie2total:0,
				pie3total:0,
				citypie1total:0,
				citypie2total:0,
				citypie3total:0,
				dispie1total: 0,
				dispie2total:0,
				dispie3total: 0,
				cityList: [],
                citymodel: '0',
                provincemodel: '21',
                provinceList:[],
                citycolumns:[
                    {
                        title: '市',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '支付店铺数',
                        key: 'whiteList',
                         width: 100
                    },
                    {
                        title: '     ',
                        key: 'whiteList',
                        render: (h, params) => {
                        	if (this.city_rate1 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{
                        	return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.whiteList/this.city_rate1*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    },
                    {
                        title: '支付订单笔数',
                         width: 120,
                        key: 'dredged'
                    },{
                        title: '     ',
                        key: 'dredged',
                        render: (h, params) => {
                        	if (this.city_rate2 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.dredged/this.city_rate2*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    },
                    {
                        title: '支付金额数',
                         width: 100,
                        key: 'amount'
                    },
                    {
                        title: '    ',
                        key: 'amount',
                        render: (h, params) => {
                        	if (this.city_rate3 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{
                        	return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.amount/this.city_rate3*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    }
                ],
                disctrictcolumns: [
                    {
                        title: '市',
                        key: 'city',
                        width: 100
                    },
                    {
                        title: '支付店铺数',
                        key: 'whiteList',
                         width: 100
                    },
                    {
                        title: '     ',
                        key: 'whiteList',
                        render: (h, params) => {
                        	if (this.dis_rate1 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.whiteList/this.dis_rate1*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    },
                    {
                        title: '支付订单笔数',
                         width: 120,
                        key: 'dredged'
                    },{
                        title: '      ',
                        key: 'dredged',
                        render: (h, params) => {
                        	if (this.dis_rate2 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.dredged/this.dis_rate2*100+ '%'
                        			}
                        		})
                        		])
                        	}	
                        }
                    },
                    {
                        title: '支付金额数',
                         width: 100,
                        key: 'amount'
                    },
                    {
                        title: '    ',
                        key: 'amount',
                        render: (h, params) => {
                        	if (this.dis_rate3 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.amount/this.dis_rate3*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    }
                ],
                citydata: [],
                citydata2: [],
                provincecolumns: [
                    {
                        title: '省市',
                        key: 'name',
                        width: 100
                    },
                    {
                        title: '支付店铺数',
                        key: 'whiteList',
                         width: 100
                    },
                    {
                        title: '   ',
                        key: 'whiteList',
                        render: (h, params) => {
                        	if (this.pro_rate1 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.whiteList/this.pro_rate1 *100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    },
                    {
                        title: '支付订单笔数',
                        width: 120,
                        key: 'dredged'
                    },{
                        title: '    ',
                        key: 'dredged',
                        render: (h, params) => {
                        	if (this.pro_rate2 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else {
                        	return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.dredged/this.pro_rate2*100+ '%'
                        			}
                        		})
                        		])
                        	}
                        }
                    },
                    {
                        title: '支付金额数',
                         width: 100,
                        key: 'amount'
                    },
                    {
                        title: '    ',
                        key: 'amount',
                        render: (h, params) => {
                        	if (this.pro_rate3 == 0) {
                        		return h('div', [
                        			h('p', ' ')
                        			])
                        	}
                        	else{return h('div', [
                        		h('p', {
                        			style: {
                        				height: '25px',
                        				background: '#61A0A8',
                        				width: params.row.amount/this.pro_rate3 *100+ '%'
                        			}
                        		})
                        		])
                        	} 
                        }
                    }
                ],
                provincedata: [],
                pro_params:{time:[]},
                city_params:{time: [],column: {province_id:21}},
                dis_params: {time:[],column: {province_id:21, city_id: 0}},
                pro_data: {},
                pro_dataList: [],
                pro_dataList2: [],
                city_data: {},
                disctrict_data: {},
                disctrictdata: [],
                disctrictdata2: [],
                pro_rate1: 0,
                pro_rate2: 0,
                pro_rate3: 0,
                city_rate1: 0,
                city_rate2: 0,
                city_rate3:0,
                dis_rate1: 0,
                dis_rate2: 0,
                dis_rate3:0,
                provinceparams: {time: []},
                contyparams: {pid:21}
			}
		},
		methods: {
			pro_page_change (e) {
				 this.pro_dataList2 = this.pro_dataList;
				// this.pro_dataList2 = this.pro_dataList.slice((e-1)*5, e*5);
				this.pro_dataList2 =  this.pro_dataList2.slice((e-1)*5, e*5);
			},
			city_page_change (e) {
				this.citydata2 = [];
				this.citydata2 = this.citydata.slice((e-1)*5, e*5);
			
			},
			dis_page_change (e) {
				this.disctrictdata2 = [];
				this.disctrictdata2 = this.disctrictdata.slice((e-1)*5, e*5);
			},
			timeLenthChange (e) {
				if (e == 0) {this.starttime = '2015-01-01';}
				else {this.timeLenth = e;this.getNowTime();this.pro_params.time[0] = this.starttime;this.city_params.time[0] = this.starttime;this.dis_params.time[0] = this.starttime;}
				
			},
			timeBchange (e) {
				this.pro_params.time[0] = e;this.city_params.time[0] = e;this.dis_params.time[0] = e;
			},
			timeEchange (e) {
				this.pro_params.time[1] = e;this.city_params.time[1] = e;this.dis_params.time[1] = e;
			},
			provinceChange1 (e) {
				this.city_params.column.province_id =e;
				this.getcity_data();
			},
			provinceChange2 (e) {
				this.dis_params.column.province_id = e;
				this.cityList = [];
				this.getCities();
			},
			cityChange (e) {
				this.dis_params.column.city_id = e;
				this.getdis_data();
			},
			seeWhat () {
				this.getpro_data();
				this.getcity_data();
				this.getdis_data();
			},
			pro_pie1 () {
				var pie1 = eCharts.init(document.getElementById('pie1')),
					_this = this,
					pie1data = [];
				for (var i in _this.pro_data) {
						var item = {name: i, value: _this.pro_data[i].shop_num};
						pie1data.push(item);
						_this.pie1total +=  _this.pro_data[i].shop_num;
					};
				pie1.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: pie1data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			pro_pie2 () {
				var pie2 = eCharts.init(document.getElementById('pie2')),
					_this = this,
					pie2data = [];
				for (var i in _this.pro_data) {
						var item = {name: i, value: _this.pro_data[i].pay_num};
						_this.pie2total += _this.pro_data[i].pay_num;
						pie2data.push(item);
					};
					
				pie2.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: pie2data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			pro_pie3 () {
				var pie3 = eCharts.init(document.getElementById('pie3')),
					_this = this,
					pie3data = [];
				for (var i in _this.pro_data) {
						var item = {name: i, value: _this.pro_data[i].amount};
						_this.pie3total +=parseInt(_this.pro_data[i].amount);
						pie3data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: pie3data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			city_pie1 () {
				var pie3 = eCharts.init(document.getElementById('citypie1')),
					_this = this,
					citypie1data = [];
				for (var i in _this.city_data) {
						var item = {name: i, value: _this.city_data[i].shop_num};
						_this.citypie1total += _this.city_data[i].shop_num;
						citypie1data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: citypie1data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			city_pie2 () {
				var pie3 = eCharts.init(document.getElementById('citypie3')),
					_this = this,
					citypie3data = [];
				for (var i in _this.city_data) {
						var item = {name: i, value: _this.city_data[i].amount};
						_this.citypie3total += _this.city_data[i].amount;
						citypie3data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: citypie3data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			city_pie3 () {
				var pie3 = eCharts.init(document.getElementById('citypie2')),
					_this = this,
					citypie2data = [];
				for (var i in _this.city_data) {
						var item = {name: i, value: _this.city_data[i].pay_num};
						_this.citypie2total +=parseInt(_this.city_data[i].pay_num);
						citypie2data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: citypie2data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			dis_pie1 () {
				var pie3 = eCharts.init(document.getElementById('dispie1')),
					_this = this,
					dispie1data = [];
				for (var i in _this.disctrict_data) {
						var item = {name: i, value: _this.disctrict_data[i].shop_num};
						_this.dispie1total += _this.disctrict_data[i].shop_num;
						console.log('区域总数', _this.dispie1total);
						dispie1data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: dispie1data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			dis_pie2() {
				var pie3 = eCharts.init(document.getElementById('dispie2')),
					_this = this,
					dispie2data = [];
				for (var i in _this.disctrict_data) {
						var item = {name: i, value: _this.disctrict_data[i].pay_num};
						_this.dispie2total += _this.disctrict_data[i].pay_num;
						console.log('支付订单笔数', _this.dispie2total);
						dispie2data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: dispie2data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			dis_pie3 () {
				var pie3 = eCharts.init(document.getElementById('dispie3')),
					_this = this,
					dispie3data = [];
				for (var i in _this.disctrict_data) {
						var item = {name: i, value: _this.disctrict_data[i].amount};
						_this.dispie3total +=parseInt(_this.disctrict_data[i].amount);
						dispie3data.push(item);
					};
					
				pie3.setOption({
					tooltip: {
				        trigger: 'item',
				        formatter: "{b} : {c} ({d}%)"
				    },
				    series: [{
				        type: 'pie',
				        radius: '68%',
				        center: ['30%', '40%'],
				        clockwise: false,
				        data: dispie3data,
				        label: {
				            normal: {
				            	 show: false
				            }
				        },
				        labelLine: {
				            normal: {
				                show: false
				            }
				        },
				        itemStyle: {
				            normal: {
				                borderWidth: 1,
				                borderColor: '#ffffff',
				            },
				            emphasis: {
				                borderWidth: 0,
				                shadowBlur: 10,
				                shadowOffsetX: 0,
				                shadowColor: 'rgba(0, 0, 0, 0.5)'
				            }
				        }
				    }],
				    color: [
				        '#00acee',
				        '#79d9f1',
				        '#c8efff'
				    ]
				});
			},
			getpro_data () {
				var _this = this;
				_this.$http({
					// method: 'GET',
					// url: './mock/pie1.json'
					method: 'POST',
					url: '/bi/loans/payment/layout',
					body: _this.pro_params,
					header: '	Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.pro_data = response.body.data.detail;
						_this.pro_pie1();_this.pro_pie2();_this.pro_pie3();
						_this.pro_dataList = [];
						for (var i in _this.pro_data) {
							 var item = {name: i,whiteList: _this.pro_data[i].shop_num, dredged: _this.pro_data[i].pay_num, amount: _this.pro_data[i].amount};
							 _this.pro_dataList.push(item);
						
							 _this.pro_rate1 = _this.pro_dataList[0].whiteList;
							 _this.pro_rate2 = _this.pro_dataList[0].dredged;
							 _this.pro_rate3 = _this.pro_dataList[0].amount;
						}
						_this.prototal = _this.pro_dataList.length;
						
						
						_this.pro_dataList2 = _this.pro_dataList;
						var pro_list1 = this.pro_dataList2.slice(0,5);
						_this.pro_dataList2 = pro_list1;
						// _this.pro_dataList2 = _this.pro_dataList2.splice(0,5);
					}
				});
			},
			getcity_data (){
				var _this = this;
				_this.$http({
					// method: 'GET',
					// url: './mock/shipei.json'
					method: 'POST',
					url: '/bi/loans/payment/layout',
					body: _this.city_params,
					header: '	Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.city_data = response.body.data.detail;
						_this.city_pie1();_this.city_pie2();_this.city_pie3();
						_this.citydata = [];
						for (var i in _this.city_data) {
							var item = {name: i,whiteList: _this.city_data[i].shop_num, dredged:_this.city_data[i].pay_num, amount: _this.city_data[i].amount}
							_this.citydata.push(item);
							_this.city_rate1 = _this.citydata[0].whiteList;
							_this.city_rate2 = _this.citydata[0].dredged;
							_this.city_rate3 = _this.citydata[0].amount;
						}
						_this.citytotal = _this.citydata.length;
						_this.citydata2 = _this.citydata.slice(0,5);
					}
				});
			},
			getdis_data () {
				var _this = this;
				_this.$http({
					// method: 'GET',
					// url: './mock/dispei.json'
					method: 'POST',
					url: '/bi/loans/payment/layout',
					body: _this.dis_params,
					header: '	Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.disctrict_data = response.body.data.detail;
						_this.dis_pie1();_this.dis_pie2();_this.dis_pie3();
						_this.disctrictdata = [];
						for (var i in _this.disctrict_data) {
							var item = {city: i,whiteList: _this.disctrict_data[i].shop_num, dredged:_this.disctrict_data[i].pay_num, amount: _this.disctrict_data[i].amount}
							_this.disctrictdata.push(item);
							_this.dis_rate1 = _this.disctrictdata[0].whiteList;
							_this.dis_rate2 = _this.disctrictdata[0].dredged;
							_this.dis_rate3 = _this.disctrictdata[0].amount;
						}
						_this.distotal = _this.disctrictdata.length;
						_this.disctrictdata2 = _this.disctrictdata.slice(0,5);
					}
				});
			},
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
						// _this.provinceList = response.body.data;
						for (var i in response.body.data) {
							var item = {value: i,label: response.body.data[i]};
							_this.provinceList.push(item);
						}
					}
				})
			},
			getCities () {
				var _this = this;
				_this.$http({
					method: 'GET',
					// url: './mock/qu.json',
					url: '/city',
					params: _this.contyparams,
					header: 'Accept application/json'
				}).then(response => {
					if (response.body.code == 0) {
						for (var i in response.body.data) {
							var item = {value: i, label: response.body.data[i]};
							_this.cityList.push(item);
						};
					};
				});
			},
		},
		created () {
			this.getNowTime();
			this.pro_params.time = [this.starttime, this.nowTime];
			this.city_params.time = [this.starttime, this.nowTime];
			this.dis_params.time = [this.starttime, this.nowTime];
			this.provinceparams.time = [this.starttime, this.nowTime];
			this.getpro_data();
			this.getcity_data();
			this.getProvince();
			this.getdis_data();
			this.getCities();
		}
	}
</script>