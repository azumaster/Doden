<template>
<div>
    <h1>店铺排行</h1>
 <Alert type="error" show-icon closable="true" v-if="alert">
        您还未登录
        <span slot="desc">
            请登录
        </span>
    </Alert>
	<div class="datepicker">
		   <Date-picker type="daterange" placement="bottom-start" placeholder="默认为7天前到今天"
                                 style="width: 300px" @on-change="dateChange"></Date-picker>
	</div>

	
	<div class="margintop20">
		<Radio v-model="provincesingle" >全部</Radio>
		<Checkbox-group v-model="province" @on-change="provinceChange">
        <Checkbox v-for='i in provinceList'  :label="i"></Checkbox>
    </Checkbox-group>
	</div>

	<div class="margintop20">
		<Radio v-model="shoptypesingle" >全部</Radio>
		<Checkbox-group v-model="shoptype" @on-change="shoptypeChange">
        <Checkbox label="11">一批</Checkbox>
        <Checkbox label="21">二批</Checkbox>
        <Checkbox label="25">餐厅</Checkbox>
    </Checkbox-group>
        <Checkbox label="筛选到区县">筛选到区县</Checkbox>
	</div>

	<template>
		<Button type="primary" @click="select">确认筛选</Button>
	</template>

	
	<Card :bordered="true">
    <Spin size="large" fix v-if="spinShow"></Spin>
   
    <Table stripe :columns="rankcolumns" :data="rankdata" :context="self"></Table>
     <Page :total="total" :current="params.page" :page-size="params.size" @on-change="pageChange"></Page>
  
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
				alert: false,
				rankdata: [],
				province: [],
				total:0,
				shoptype: [],
				provinceList: [],
				rate:1,
				provincesingle: false,
				shoptypesingle: false,
				params: {
					time: [],
					filter: {},
					page: 1, 
					size: 20,
					group: 'county'
				},
				filterparams:{
                    time: []
				},
				rankcolumns: [
					{	title: '排名',
                        width: 160,
                        align: 'center',
                        render (row, column, index) {
                            return `<div><p>{{(params.page-1)*20+${index}+1}}</p></div>`;
                        }
                    },
                    {
                        title: '区域',
                        width: 200,
                        render (row, column, index) {
                            return `<div><p>${row.province}-${row.city}${row.county}</p></div>`;
                        }
                    },
                    {
                        title: '店铺数量',
                        width: 160,
                        key: 'num'
                    },
                      {
                        title: '比例图',
                        render (row, column, index,) {
                             return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                        }
                    }
                ],
                rankdata:[]
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
            provinceChange () {
            	var _this = this ;
            	_this.provincesingle = false;
            	var obj = _this.params.filter;
            	obj = Object.assign(obj, {'province': _this.province});
            	_this.params.filter = obj;
            },
            shoptypeChange () {
            	var _this = this;
            	_this.shoptypesingle = false ;
            	var obj = _this.params.filter;
            	obj = Object.assign(obj, {'trenchnum': _this.shoptype});
            	_this.params.filter = obj;
            },
            select () {
            	var _this = this;
            	// if(_this.params.time.length==0){
             //        _this.$Message.warning('请先选择日期范围');
             //        return;
             //    }
            	_this.spinShow = true;
                _this.getBaseData();
       

            }, 
            pageChange (e) {
            	this.params.page = e;
            	this.getBaseData();
            },
            getBaseData () {
            	var _this = this;
                _this.spinShow = true ;
				_this.$http({
					method: 'POST',
                    url: '/bi/shop/rank',
                    body: _this.params,
                    header: 'Accept application/json'
     					// method: 'GET',
          //     			url: './mock/shoprank.json',
          //     			data: _this.params,
          //     			header: 'Accept application/json'
				}).then(response =>{
					if(response.body.code ==0){
						_this.spinShow = false ;
						_this.rankdata = response.body.data.detail;
						_this.total = response.body.data.total;
						if (response.body.data.current == 1) {
							_this.rate = response.body.data.detail[0].num;
						}
                       for(var i=0,len=_this.rankdata.length;i<len;i++){
                        var obj = _this.rankdata[i];
                        var realrate = _this.rankdata[i].num/_this.rate*100;
                        obj = Object.assign(obj,{'realrate':realrate});
                         _this.rankdata[i] = obj;
                       }
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
                    // url: './mock/shop.json',
            		url: '/bi/shop/filter',
            		data: _this.filterparams,
            		header: 'Accept application/json'
            	}).then(response =>{
            		if(response.body.code == 0){
            			_this.provinceList = response.body.data.province;
            		}
            	})
            }
		},
		created(){
			this.getBaseData();
			this.getFilterData();
		}
	}
</script>
<style scoped>
    .ivu-checkbox-group{
        display: inline-block;
    }
    .ivu-btn-primary{display:block;margin:20px 0;}
    .margintop20,.datepicker{margin-top: 20px;}
</style>
