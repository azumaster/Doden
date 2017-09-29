<template>
	<div class="hotbrand">
		<Tabs value="name1" :animated="false" @on-click="tabclick">
        <Tab-pane label="首页品牌" name="name1">
        	<div class="menu">
        		<span>最多推8个品牌到首页</span>
        		<Button @click="addbrand"><Icon type="plus-round"></Icon>添加品牌</Button>
        	</div>
        	<div class="inner">
        		<Table border   :columns="columns" :data="data"></Table>
        	</div>
        </Tab-pane> <!--标签页1结束-->
        <Tab-pane label="品牌库" name="name2" >
        	<div class="kumenu">
        		<p>最多推8个品牌上首页<span>（还能再选择{{leftbrand}}个品牌）</span></p>
        	</div>
        	<div class="soipt">
        		<Input v-model="allbrandsparams.search" placeholder="请输入品牌名" style="width: 250px"></Input>
        		<Button class="sobtn" @click="soso">搜索</Button>
        		<Button @click="refresh"><Icon type="refresh"></Icon>刷新</Button>
        		<div class="sanjiao" v-if="is_inndex"></div>
        		<div class="tips" v-if="is_inndex">提示：此品牌已经被推到首页</div>
        	</div>
        	<div class="tablebar">
        		 <Table border :columns="columns1" :data="data1"></Table>
        		 <div class="pagenation"><Page :total="brandstotal" @on-change="pageChange"  show-elevator style="float: right;margin-right: 220px;"></Page></div>
        	</div>
        </Tab-pane><!--标签页2结束-->
    </Tabs>
		<Footer></Footer>
	</div>
</template>
<script>
	import Footer from './../../components/footer.vue';
	export default {
		components: {Footer},
			data () {
				return {
					leftbrand: 8, //还能推到首页的品牌数
					last: 0,
					brandstotal: 0,
					is_inndex: false,
					columns: [
	                    {
	                        title: '排序',
	                        type: 'index',
	                        width: '16%',
	                        align: 'center'

	                    },
	                    {
	                        title: '分类名称',
	                        key: 'name',
	                        width: '35%',
	                        align: 'center'
	                    },
	                    {
	                        title: '操作',
	                        key: 'address',
	                        align: 'center',
	                        render: (h, params) => {
	                        	if (params.row.sort == 1) {
                                return h('div', [
                                h('Button', {
                                    props: {
                                        disabled: true,
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px',
                                     width: '50px',
                                     height: '26px',
                                     backgroundColor: '#cccccc',
                                     color: '#fff'
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px'
                                    },
                                    on: {
                                        click: () => {
                                            this.rowDown(params.row.id, params.row.sort)
                                        }
                                    }
                                }, '下移'),
                                h('Button',{props: {type: 'text'},on: {
                                        click: () => {
                                            this.deletesort(params.row.id, params.row.sort);
                                        }
                                    }},
                                 [h('Icon',{props:{type: 'trash-b'}})]
                                 )
                            ]); 
                            }
                            else if (params.row.sort == this.last) {
                                return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px'
                                    },
                                    on: {
                                        click: () => {
                                            this.rowUp(params.row.id, params.row.sort)
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        disabled: true,
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px',
                                     width: '50px',
                                     height: '26px',
                                     backgroundColor: '#cccccc',
                                     color: '#fff'
                                    }
                                }, '下移'),
                                h('Button',{props: {type: 'text'},
                            on: {
                                        click: () => {
                                            this.deletesort(params.row.id, params.row.sort);
                                        }
                                    }},
                                 [h('Icon',{props:{type: 'trash-b'}})]
                                 )
                            ]); 
                            }
                            else {
                                  return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px'
                                    },
                                    on: {
                                        click: () => {
                                            this.rowUp(params.row.id, params.row.sort)
                                        }
                                    }
                                }, '上移'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                     marginRight: '40px'
                                    },
                                    on: {
                                        click: () => {
                                            this.rowDown(params.row.id, params.row.sort)
                                        }
                                    }
                                }, '下移'),
                                h('Button',{props: {type: 'text'},
                                    on: {
                                        click: () => {
                                            this.deletesort(params.row.id, params.row.sort);
                                        }
                                    }
                                },
                                 [h('Icon',{props:{type: 'trash-b'}})]
                                 )
                            ]);
                            }
	                        }
	                    }
                	],
                	data: [],
               		columns1: [
                    {
                        title: '品牌名',
                        key: 'brand',
                       	align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
	                            return h('div', [  
	                                h('Button',{props: {type: 'text'},
	                                on: {
                                        click: () => {
                                            this.sendToindex(params.row.id)
                                        }
                                    }
	                            },
	                                	[h('Icon',{props:{type: 'arrow-up-c'}}),'推到首页']
	                                		)
	                            ]);
	                        }
                    }
                	],
                	data1: [ ],
                	setbrandsparams: {brands: []}, //设置首页品牌
                	allbrandsparams: {
                		page: 1,
                		size:10
                	}
				}
			},
			methods: {
				addbrand(){
					var tab1 = document.getElementsByClassName('ivu-tabs-tabpane')[0],
						bar = document.getElementsByClassName('ivu-tabs-ink-bar')[0],
						tab2 = document.getElementsByClassName('ivu-tabs-tabpane')[1];
						tab1.style.display="none";
						tab2.style.display="block";
						bar.style.width="77px";
						bar.style.left="108px";
				},
				tabclick (e) {
					var tab1 = document.getElementsByClassName('ivu-tabs-tabpane')[0],
						bar = document.getElementsByClassName('ivu-tabs-ink-bar')[0],
							tab2 = document.getElementsByClassName('ivu-tabs-tabpane')[1];
					if(e == 'name1') {tab1.style.display="block";tab2.style.display="none";bar.style.width="92px";bar.style.left="0px";}
					else {tab1.style.display="none";tab2.style.display="block";}
				},
				refresh () { //刷新页面
					window.location.reload(); 
				},
				rowDown (e,sort) {
	                var downdata = this.data[sort-1];
	                var ondowndata = this.data[sort];
	                downdata.sort ++;
	                ondowndata.sort --;
	                this.data.splice(sort-1,1);
	                this.data.splice(sort,0, downdata);
	                this.setbrandsparams.brands = [];
	                for (var i in this.data) {
	                    this.setbrandsparams.brands.push(this.data[i].id);
	                }
	                this.savehotbrands()
            	},
	            rowUp (e,sort) {
	                var updata = this.data[sort-1];
	                var onupdata = this.data[sort-2];
	                updata.sort --;
	                onupdata.sort ++;
	                this.data.splice(sort-1,1);
	                this.data.splice(sort-2,0, updata);
	                this.setbrandsparams.brands = [];
	                for (var i in this.data) {
	                    this.setbrandsparams.brands.push(this.data[i].id);
	                }
	                this.savehotbrands()
	            },
	            deletesort (e,sort) {
	                if(sort == 1) {
	                    this.data.splice(sort-1,1);
	                    for(var i in this.data) {this.data[i].sort --}
	                    this.last =this.data.length;
	                 	this.leftbrand = 8 - this.last;
	                }
	               else if(sort == this.last) {
	                     this.data.splice(sort-1,1);
	                     this.last =this.data.length;
	                     this.leftbrand = 8 - this.last;
	                }
	                else{
	                    this.data.splice(sort-1,1);
	                    for(var i in this.data) {
	                        this.data[i].sort = parseInt(i)+1;
	                    }
	                    this.last = this.data.length;
	                    this.leftbrand = 8 - this.last;
	                }
	                this.setbrandsparams.brands = [];
	                for(var i in this.data) {
	                    this.setbrandsparams.brands.push(this.data[i].id)
	                }
	                this.savehotbrands();
	            },
	            soso () { //搜索
	            	this.allbrandsparams.page = 1;
	            	this.getallbrands();
	            },
				gethotbrand () { //获得首页品牌
					var _this =this;
					_this.data = [];
					_this.$http({
						method: 'GET',
						url: './mock/hotbrands.json',
						// url: '/home/hot/brand',
						header: 'Accept:application/json'
					}).then(response => {
						if(response.body.code == 0) {
							_this.data = response.body.data;
							_this.setbrandsparams.brands = [];
							for(var i in _this.data) {
								_this.setbrandsparams.brands.push(_this.data[i].id);
							}
							_this.last = response.body.data.length;
							_this.leftbrand = 8- _this.last;
						}
					})
				},
				savehotbrands (resolve) { //设置首页品牌
					var _this = this;
					_this.$http({
						method: 'POST',
						url: '/home/hot/brand',
						body: _this.setbrandsparams,
						header: 'Accept:application/json'
					}).then(response => {
						if(response.body.code ==0) {
							_this.gethotbrand();
							resolve('ok');
						}
						else{
							var mes = response.body.message;
							_this.$Message.error({
								content: mes,
								duration: 2
							})
						}
					})

				},
				getallbrands () { //获得全部品牌
					var _this = this;
					_this.$http({
						method: 'GET',
						url: '/goods/brands',
						url: './mock/allbrands.json',
						params: _this.allbrandsparams,
						header: 'Accept:application/json'
					}).then(response => {
						if(response.body.code == 0) {
							_this.brandstotal = response.body.data.total;
							_this.data1 = response.body.data.brands;
						}
					})
				},
				pageChange (e) {	//翻页
					this.allbrandsparams.page = e;
					this.getallbrands();
				},
				sendToindex (id) { //推到首页					
					var _this = this;
					var no_repeat = [];
					_this.setbrandsparams.brands.push(id);
					for (var i in _this.setbrandsparams.brands) {
						if(no_repeat.indexOf(_this.setbrandsparams.brands[i]) == -1) {
							no_repeat.push(_this.setbrandsparams.brands[i])
						}
						else{
							_this.is_inndex = true;
							setTimeout(function(){_this.is_inndex = false},2000);
							_this.setbrandsparams.brands.pop();
						}
					}
					_this.setbrandsparams.brands = no_repeat;
					new Promise(function(resolve){
						_this.savehotbrands(resolve);
					}).then(function() {
						_this.getallbrands();
					});
				}
			},
			created () {
				this.gethotbrand();
				this.getallbrands();
			}
		
	}
</script>
<style lang="less" >
.hotbrand{
	margin-right: 50px;
	.ivu-tabs-nav{margin-left: 30px;}
	.ivu-tabs-nav .ivu-tabs-tab{margin-left: 0px;}
	.layout-copy { margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
	.ivu-tabs-bar{margin-bottom: 0px;}
	.menu{text-align: right;width: 100%;height: 70px;line-height: 70px;font-size: 14px;color: #525661;
			.ivu-btn{width: 136px;height: 48px;color: #fff;background-color: #45c8dc;font-size: 16px;border: none;margin-left: 14px;
					.ivu-icon-plus-round{font-size: 20px;margin: 0 10px;}
					}
		}
	.inner{width: 100%;padding-left: 30px;
		.ivu-icon-trash-b{color: #45c8dc;font-size: 20px;}  /*垃圾筐图标*/
			/*上移下移*/
			.ivu-btn-primary{width: 50px;height: 26px;color: #fff;background-color: #45c8dc;border: none;}
			.ivu-table th {background-color: #f0f0f0;}
			.ivu-table-header .ivu-table-cell span{font-size: 14px;}
			.ivu-table-row,.ivu-table-column-center{height: 50px;}
			.ivu-table-border td, .ivu-table-border th{border-right: 1px solid #f0f0f0;}
	}
	.kumenu{font-size: 14px;margin-left: 30px;line-height: 38px; span{color:#45c8dc}}
	.soipt{position: relative;
		margin-left: 30px;
		.ivu-input{height: 40px;outline: none;}
		.sobtn{margin-left: -4px;margin-right: 9px;}
		.sobtn, .ivu-btn{width: 62px;height: 40px;color: #fff;background-color: #45c8dc;border: none;font-size: 14px;}
		.ivu-btn{width: 80px;}
		.sanjiao{width: 14px;height: 9px; 
		/*background: url('./../../../img/sanjiao.png');*/
		background: url('/Public/pc/dcanmou-client/img/sanjiao.png');
		position: absolute;top:42px;left: 20px;z-index: 2;}
	}
	.tablebar{width: 100%;padding-left: 30px;margin-top: 10px;
		.ivu-btn-text{height: 27px;width: 97px;color: #fff;background-color: #45c8dc;line-height: 0px;font-size: 14px;
			.ivu-icon-arrow-up-c{margin-right: 9px;margin-left: -4px;}}
		.ivu-table th {background-color: #f0f0f0;}
			.ivu-table-header .ivu-table-cell span{font-size: 14px;}
			.ivu-table-row,.ivu-table-column-center{height: 50px;}
			.ivu-table-border td, .ivu-table-border th{border-right: 1px solid #f0f0f0;}
		.pagenation{width: 100%;margin-top: 40px;
			.ivu-page-item:hover{border-color: #45c8dc;color: #45c8dc;}
			.ivu-page-options{margin-top: -5px;}
			.ivu-page-item-active{background-color: #45c8dc;border-color: #45c8dc;}
			.ivu-page-item, .ivu-page-item-jump-next, .ivu-page-prev, .ivu-page-next, .ivu-page-options-elevator input{width: 31px;min-width: 31px;border-radius: 0;height: 25px;line-height: 25px;font-size: 12px;}
		}
	}
	.tips{position: absolute;width: 203px;height: 36px;border: 1px solid #45c8dc;z-index: 1;background-color: #fff;top:50px;line-height: 36px;text-align: center;}
}
	

</style>