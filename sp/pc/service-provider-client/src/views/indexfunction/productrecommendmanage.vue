<template>
	<div class="single">
		<Tabs :animated="false" @on-click="tabclick">
        <Tab-pane label="首页商品" name="name1">
        	<div class="menu">
        		<p>商品在找冻品网上过期、下架、删除会上商品无法显示在您的首页，商品显示情况可查看列表中“显示情况”。</p>
        		<div><p>最多推80件商品到首页</p>
        		<Button @click="addbrand"><Icon type="plus-round"></Icon>添加商品</Button></div>
        	</div>
        	<div class="inner">
        		<Table border   :columns="columns" :data="data"></Table>
        	</div>
        </Tab-pane>
        <Tab-pane label="商品库" name="name2">
			<div class="inner2">
        		<p class="txt">最多推80件上首页<span>（还能再选择{{leftgoods}}件商品）</span></p>
        		<div class="inner2-left">
        			 <div class="inner2-left-bottom">
        			 <Tree :data="baseData" show-checkbox  @on-select-change="nodeclick" @on-check-change="checknode" :multiple="false"></Tree>
        			 </div>
        		</div>
        		<div class="inner2-right">
	        		<div class="soipt">
	        		<div class="sanjiao" v-if="is_inndex"></div>
        			<div class="tips" v-if="is_inndex">提示：此商品已经被推到首页</div>
	        		<Input v-model="goodsparams.search" placeholder="请输入商品名" style="width: 250px" ></Input>
	        		<Button class="sobtn" @click="sogoods">搜索</Button>
	        		<Button @click="refresh"><Icon type="refresh"></Icon>刷新</Button>
	        	</div>
        			 <Table border   :columns="columns2" :data="data2" @on-sort-change="sorttable"></Table>
        			 <div class="pagenation"><Page :total="goodstotal" show-elevator style="float: right;margin-right: 220px;" @on-change="pageChange"></Page></div>
        		</div>
        	</div>
        </Tab-pane><!--商品库结束-->
    </Tabs>
		<Footer></Footer>
		<div class="mask" v-if="showgoodsdetail">
			<div class="gooddetailDiv" v-if="showgoodsdetail">
				<div class="d_header">
					<p>冻参谋 - 商品详情</p>
					<p><Button @click="closediv"><Icon type="close-round"></Icon></Button></p>
				</div>
				<div class="sub_header">商品介绍</div>
				<div class="d_table">
					<Row>
				        <Col span="3">商品标题</Col>
				        <Col span="21">{{gooddetail.goods_title}}</Col>
	    			</Row>
	    			<Row>
	    				 <Col span="3">商品介绍</Col>
	    				 <Col span="21">{{gooddetail.goods_description}}</Col>
	    			</Row>
	    			<Row>
				        <Col span="3">单价</Col>
				        <Col span="9">￥{{gooddetail.origin_goods_price}}/{{gooddetail.goods_unit}}</Col>
				        <Col span="3">加价后单价</Col>
				        <Col span="9">￥{{gooddetail.goods_price}}/{{gooddetail.goods_unit}}</Col>
	    			</Row>
	    			<Row>
				        <Col span="3">已售</Col>
				        <Col span="9">{{gooddetail.goods_sell_num}}</Col>
				        <Col span="3"></Col>
				        <Col span="9"></Col>
	    			</Row>
				</div>
				<div class="sub_header">型号规格</div>
				<div class="d_table" style="overflow: hidden;">
						<Row>
					        <Col span="3">品名</Col>
					        <Col span="9">{{gooddetail.goods_name}}</Col>
					        <Col span="3">清真</Col>
					        <Col span="9">{{gooddetail.qingzhen}}</Col>
	    				</Row>
	    				<Row>
					        <Col span="3">品牌</Col>
					        <Col span="9">{{gooddetail.goods_brand}}</Col>
					        <Col span="3">产地</Col>
					        <Col span="9">{{gooddetail.goods_origin}}</Col>
	    				</Row>
	    				<Row>
					        <Col span="3">型号</Col>
					        <Col span="9">{{gooddetail.goods_xinghao}}</Col>
					        <Col span="3">净重</Col>
					        <Col span="9">{{gooddetail.goods_net_weight}}</Col>
	    				</Row>
	    				<!-- <div style="display: inline-flex;"> -->
	    					<p class="ivu-col ivu-col-span-3">规格</p><p class="ivu-col ivu-col-span-9">{{gooddetail.goods_guigei}}</p>
	    					<div v-for="item in gooddetail.special_detail" style="line-height: 40px;">
	    						<p class="ivu-col ivu-col-span-3">{{item.prope_name}}</p><p class="ivu-col ivu-col-span-9">{{item.prope_value}}</p>
	    					</div>
	    				<!-- </div> -->
				</div>
				<div class="sub_header">检查报告</div>
					<div class="pic jianchapic">
						<img :src="'http://img.idongpin.me/'+gooddetail.inspection_report" >
					</div>
				<div class="sub_header">商品照片</div>
				<div class="pic">
					<img v-for="item in gooddetail.goods_picture" :src="'http://img.idongpin.me/'+item.goods_image">
				</div>
			</div>
		</div>
	</div>
	
</template>
<script>
	import Footer from './../../components/footer.vue';
	export default {
		components: {Footer},
		data () {
			return {
				leftgoods: 80, //还能选择商品数
				last: 0,
				showgoodsdetail: false,
				is_inndex: false,
				params: {size:100},
				setgoodsparams: {goods: []},
				goodsparams:{
					size:10,
					page: 1,
					order: [0,1]
				},
				catelen: 0,
				goodstotal: 0,
				columns: [
		                    {
		                        title: '排序',
		                        type: 'index',
		                        width: '6%',
		                        align: 'center'

		                    },
		                    {
		                        title: '分类',
		                        key: 'type',
		                        width: '6%',
		                        align: 'center'
		                    },
		                    {
		                        title: '品牌',
		                        key: 'brand',
		                        width: '6%',
		                        align: 'center'
		                    },
		                    {
		                        title: '商品标题',
		                        key: 'title',
		                        width: '27%',
		                        align: 'center'
		                    },
		                    {
		                        title: '显示情况',
		                        key: 'display',
		                        width: '6%',
		                        align: 'center',
		                        render: (h, params) =>{
		                        	if (params.row.display) {
		                        		return h('div','显示')
		                        	}
		                        	else{return h('span','未显示')}
		                        }
		                    },
		                    {
		                        title: '单价',
		                        key: 'origin_price',
		                        width: '6%',
		                        align: 'center'
		                    },
		                    {
		                        title: '加价后单价',
		                        key: 'price',
		                        width: '8%',
		                        align: 'center'
		                    },
		                    {
		                        title: '单位',
		                        key: 'unit',
		                        width: '6%',
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
			                                        type: 'text',
			                                        size: 'small'
			                                    },
			                                    style: {
			                                    	marginRight: '40px'
			                                    },
			                                    on: {
			                                        	click: () => {
			                                            this.show(params.row.id)
			                                        }
		                                    	}
		                                	}, '详情'),
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
			                                    	marginRight: '45px'
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
		                        			])
		                        	}
		                        	else if (params.row.sort == this.last) {
		                        		return h('div', [
		                        			h('Button', {
			                                    props: {
			                                        type: 'text',
			                                        size: 'small'
			                                    },
			                                    style: {
			                                    	marginRight: '40px'
			                                    },
			                                    on: {
			                                        	click: () => {
			                                            this.show(params.row.id)
			                                        }
		                                    	}
		                                	}, '详情'),
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
	                                       	}
		                           			},	
		                                	[h('Icon',{props:{type: 'trash-b'}})]
		                                	)
		                        			])
		                        	}
		                        	else {
		                        		return h('div', [
		                            	h('Button', {
		                                    props: {
		                                        type: 'text',
		                                        size: 'small'
		                                    },
		                                    style: {
		                                    	marginRight: '40px'
		                                    },
		                                    on: {
	                                        	click: () => {
	                                            this.show(params.row.id)
	                                        }
	                                    }
		                                }, '详情'),
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
		                                    	marginRight: '45px'
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
                columns2: [
                    {
                        title: '序号',
                        type: 'index',
                        width: '6.8%',
                        align: 'center'

                    },
                    {
                        title: '分类',
                        width: '6.8%',
                        align: 'center',
                        render: (h, params) => {
                        	return h ('span', params.row.cate[3].name)
                        }
                    },
                    {
                        title: '品牌',
                        width: '6.8%',
                        align: 'center',
                        render: (h, params) => {
                        	return h('span', params.row.brand)
                        }

                    },
                    {
                        title: '商品标题',
                        key: 'title',
                        width: '25%',
                        align: 'center'
                    },
                    {
                        title: '单价(元)',
                        sortable: true,
                        key: 'origin_price',
                        width: '10%',
                        align: 'center'
                    },
                    {
                        title: '加价后单价(元)',
                        sortable: true,
                        key: 'price',
                        width: '12%',
                        align: 'center'
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        width: '6.8%',
                        align: 'center'
                    }, 
                    {
                        title: '销量',
                        sortable: true,
                        key: 'sell_num',
                        width: '6.8%',
                        align: 'center'

                    },
                    {
                        title: '操作',
                        key: 'address',
                        // width: 638,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style: {
                                    	marginRight: '40px'
                                    },
                                    on: {
		                                    click: () => {
		                                            this.show(params.row.id)
		                                    }
	                                    }
                                }, '详情'),
                                
                               h('Button',{props: {type: 'ghost'},on: {
                                        click: () => {
                                            this.sendToindex(params.row.id)
                                        }
                                    }},
	                                	[h('Icon',{props:{type: 'arrow-up-c'}}),'推到首页']
	                                		)
                            ]);
                        }
                    }
                ],
                data2: [],
				baseData: [{
                    expand: true,
                    title: '冻品',
                    children: []
                }],
                gooddetail: {}
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
			pageChange (e) {
				this.goodsparams.page = e;
				this.getgoodslist();
			},
			tabclick (e) {
					var tab1 = document.getElementsByClassName('ivu-tabs-tabpane')[0],
						bar = document.getElementsByClassName('ivu-tabs-ink-bar')[0],
							tab2 = document.getElementsByClassName('ivu-tabs-tabpane')[1];
					if(e == 'name1') {tab1.style.display="block";tab2.style.display="none";bar.style.width="92px";bar.style.left="0px";}
					else {tab1.style.display="none";tab2.style.display="block";}
			},
			nodeclick (e) { //节点被选取
				var _this = this;
				delete this.goodsparams.search;
				this.goodsparams.page = 1;
				_this.goodsparams.type_ids = [];
				if (e[0].title == '冻品') {
					_this.goodsparams.type_ids.push(1);
					this.getgoodslist();
				}
				else {
					for (var a in _this.sortsTree[1]) { //二级
						if(e[0].title == _this.sortsTree[1][a].type_name) {
							_this.goodsparams.type_ids.push(a);
							_this.getgoodslist();
						}
						else {
							if (typeof _this.sortsTree[1][a] === 'object') {
								for (var b in _this.sortsTree[1][a]) { //三级
									if (e[0].title == _this.sortsTree[1][a][b].type_name) {_this.goodsparams.type_ids.push(b);this.getgoodslist();}
									else { //四级
										if (typeof _this.sortsTree[1][a][b] === 'object') {
											for (var c in  _this.sortsTree[1][a][b]) {
												if (e[0].title == _this.sortsTree[1][a][b][c].type_name) {_this.goodsparams.type_ids.push(c);this.getgoodslist();}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			checknode (e) {
				var _this = this;
				_this.goodsparams.type_ids = [];
				for(var i in e) {
				
					if (e[i].children) {
						var arr = [];
						arr.push(e[i]);
						_this.nodeclick(arr);
						return;
					}
					else {
						
							for (var a in _this.sortsTree[1]) {
						 	if (typeof _this.sortsTree[1][a] === 'object') {
						 		for (var b in _this.sortsTree[1][a]) {
						 			if (typeof _this.sortsTree[1][a][b] === 'object') {
						 				for (var c in _this.sortsTree[1][a][b]) {
						 					if (e[i].title == _this.sortsTree[1][a][b][c].type_name) {
						 						
						 						_this.goodsparams.type_ids.push(c);
						 						_this.getgoodslist();
						 					}
						 				}
						 			}
						 		}
				 			}
						}
					}
				}  //单选框被点击
			},
			refresh () {
				window.location.reload(); 
			},
			getindexgoods () {  //获得首页商品
				var _this = this;
				_this.$http({
					method: 'GET',
					url: '/home/hot/goods',
					url: './mock/recommond.json',
					params: _this.params,
					header: 'Accept:application/json'
				}).then(response => {
					if(response.body.code == 0) {
						_this.data = response.body.data.goods;
						_this.last = _this.data.length;
						_this.leftgoods = 80-_this.last;
						if (_this.data) {
							for (var i in _this.data) {
								if (_this.setgoodsparams.goods.indexOf(_this.data[i].id) == -1) {
									_this.setgoodsparams.goods.push(_this.data[i].id);
								}
							}
						}
						
					}
				})
			},
			show (e) { //商品详情
				var _this = this;
				_this.$http({
					method: 'GET',
					url: '/goods/'+e,
					url: './mock/gooddetail.json',
					header: 'Accept:application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.gooddetail = response.body.data;
						if (!_this.gooddetail.goods_description) {_this.gooddetail.goods_description='暂无商品介绍';}
						if (_this.gooddetail.halal) {
							var obj = {qingzhen: '是'}; _this.gooddetail = Object.assign(_this.gooddetail, obj);
						}
						else {var obj2 = {qingzhen: '否'}; var obj = Object.assign(_this.gooddetail, obj2);}
						_this.showgoodsdetail = ! _this.showgoodsdetail;
					}
				})
			},
			sorttable (e) { //排序
				if (e.key == 'origin_price') {
					this.goodsparams.order=[3,1];
				}
				if (e.key == 'price') {
					this.goodsparams.order=[4,1];
				}
				if (e.key == 'sell_num') {
					this.goodsparams.order=[2,1];
				}
				if (e.order == 'desc') {
					this.goodsparams.order[1] = 0;
				}
				if (e.order == 'asc') {this.goodsparams.order[1] = 1;}
				this.getgoodslist();
			},
			sogoods () { //搜索商品
				this.goodsparams.page = 1;
				this.getgoodslist();
			},
			closediv () { //关闭商品详情弹窗
				this.showgoodsdetail = false;
			},
			sendToindex (id) { //推到首页
				var _this = this;
				if (_this.setgoodsparams.goods.indexOf(id) != -1) {
					_this.is_inndex = true;
					setTimeout(function(){_this.is_inndex = false},2000);
					return;
				}
				_this.setgoodsparams.goods.push(id);
				new Promise (function (resolve) {
					_this.setindexgoods(resolve)
				}).then(function () {
					_this.getindexgoods();
				});
				// _this.setindexgoods();
			},
			rowDown (e,sort) {
				this.setgoodsparams.goods = [];
				var downdata = this.data[sort-1];
	            var ondowndata = this.data[sort];
	            downdata.sort ++;
	            ondowndata.sort --;
	            this.data.splice(sort-1,1);
	            this.data.splice(sort,0, downdata);
	            for (var i in this.data) {
	                	this.setgoodsparams.goods.push(this.data[i].id);
	            }
	            this.setindexgoods();
	        },
	        rowUp (e,sort) {
	                var updata = this.data[sort-1];
	                var onupdata = this.data[sort-2];
	                updata.sort --;
	                onupdata.sort ++;
	                this.data.splice(sort-1,1);
	                this.data.splice(sort-2,0, updata);
	                this.setgoodsparams.goods = [];
	                for (var i in this.data) {
	                	this.setgoodsparams.goods.push(this.data[i].id);
	           		}
	            	this.setindexgoods();
	        },
	        deletesort (e,sort) {
	        	this.setgoodsparams.goods = [];
                if(sort == 1) {
                    this.data.splice(sort-1,1);
                    for(var i in this.data) {this.data[i].sort --}
                    this.last =this.data.length;
                 	this.leftbrand = 80 - this.last;
                }
               else if(sort == this.last) {
                     this.data.splice(sort-1,1);
                     this.last =this.data.length;
                     this.leftbrand = 80 - this.last;
                }
                else{
                    this.data.splice(sort-1,1);
                    for(var i in this.data) {
                        this.data[i].sort = parseInt(i)+1;
                    }
                    this.last = this.data.length;
                    this.leftbrand = 80 - this.last;
                }
                for (var i in this.data) {
                	this.setgoodsparams.goods.push(this.data[i].id);
           		}
           		
            	this.setindexgoods();
	        },
	        setindexgoods (resolve) { //设置首页商品
	        	var _this = this;
	            	_this.$http({
	            		method: 'POST',
	            		url: '/home/hot/goods',
	            		body: _this.setgoodsparams,
	            		header: 'Accept:application/json'
	            	}).then(response => {
	            		if (response.body.code == 0) {
	            			console.log('首页商品推送成功');
	            			resolve('ok');
	            			// _this.getindexgoods();
	            		}
	            		
	            	})
	        },
	        getsortsTree () {
		        	 var _this = this,
		        	 parentNode = null,
		        	 node = null;
		        	 _this.$http({
	                    method: 'GET',
	                    url: '/goods/categories',
	                    header: 'Accept:application/json',
	                    url: './mock/shang.json'
	                	}).then(response => {
	                	if (response.body.code == 0) {
	                		 _this.sortsTree = response.body.data;
	                		 _this.formatToTreeData();
	                	}
	                });
            },
          	formatToTreeData() {
          		let _this = this;
          			for (var a in _this.sortsTree[1]) {
          					if (typeof _this.sortsTree[1][a] === 'object') {
          						var obj = {title: _this.sortsTree[1][a].type_name, children: []};
          						for (var b in _this.sortsTree[1][a]) {
          							if (typeof _this.sortsTree[1][a][b] === 'object') {
          								var obj1 = {title: _this.sortsTree[1][a][b].type_name, children: []};
          								for (var c in  _this.sortsTree[1][a][b]) {
          									if (typeof _this.sortsTree[1][a][b][c] === 'object') {
          										var obj2 = {title: _this.sortsTree[1][a][b][c].type_name}
          										obj1.children.push(obj2);
          									}
          								}
          								obj.children.push(obj1);
          							}
          						}
          						_this.baseData[0].children.push(obj);
          					}
          			}
          	},
            getgoodslist () {
            	var _this = this;
            	_this.$http({
            		method: 'GET',
            		url: './mock/goodslist.json',
            		// method: 'POST',
            		// url: '/goods',
            		// body: _this.goodsparams,
            		header: 'Accept application/json'
            	}).then(response => {
            		if (response.body.code == 0) {
            			_this.data2 = response.body.data.goods;
            			_this.goodstotal = response.body.data.total;
            			delete _this.goodsparams.search;
            		}
            	})
            }
		},
		created () {
			this.getsortsTree();
			this.getindexgoods();
			this.getgoodslist();
		}
	}
</script>
<style lang="less" >
	.single{
		.ivu-page li {line-height: 25px;}
		padding-bottom: 58px;
		.ivu-tabs-bar{margin-bottom: 0;}
		.ivu-tabs-nav .ivu-tabs-tab{margin-left: 0px;}
		.ivu-tabs-nav{margin-left: 30px;}
		.layout-copy { margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
		.menu{width: 100%;height: 70px;line-height: 70px;font-size: 14px;color: #525661;display: flex;justify-content: space-between;margin-left: 30px;padding-right: 70px;
			div{display: inline-flex;}
			.ivu-btn{width: 136px;height: 48px;color: #fff;background-color: #45c8dc;font-size: 16px;border: none;margin-left: 14px;margin-top: 10px;
					.ivu-icon-plus-round{font-size: 20px;margin: 0 10px;}
					}
		}
		.inner{width: 100%;padding-left: 30px;padding-right: 50px;
		.ivu-icon-trash-b{color: #45c8dc;font-size: 20px;}  /*垃圾筐图标*/
			/*上移下移*/
			.ivu-btn-primary{width: 50px;height: 26px;color: #fff;background-color: #45c8dc;border: none;}
			.ivu-table th {background-color: #f0f0f0;}
			.ivu-table-header .ivu-table-cell span{font-size: 14px;}
			.ivu-table-row,.ivu-table-column-center{height: 50px;}
			.ivu-table-border td, .ivu-table-border th{border-right: 1px solid #f0f0f0;}
		}
		.pagenation{width: 100%;margin-top: 40px;
			.ivu-page-item:hover{border-color: #45c8dc;color: #45c8dc;}
			.ivu-page-options{margin-top: -5px;}
			.ivu-page-item-active{background-color: #45c8dc;border-color: #45c8dc;}
			.ivu-page-item, .ivu-page-item-jump-next, .ivu-page-prev, .ivu-page-next, .ivu-page-options-elevator input{width: 31px;min-width: 31px;border-radius: 0;height: 25px;line-height:inner2 25px;font-size: 12px;}
		}
		.inner2{margin-left: 15px;font-size: 14px;color: #4d4c4c; overflow: hidden;
		.txt{line-height: 38px; span{color:#45c8dc}}
		.inner2-left{float: left;width: 325px; .add{height: 40px;width: 60px;color: #fff;background-color: #45c8dc;border: none;margin-left: -1px;} 
		.ivu-input{height: 40px;outline: none;border: none;}
		.inner2-left-top{height: 42px;width: 315px;border: 1px solid #f5f5f5;border-radius: 4px;}
		.inner2-left-bottom{border: 1px solid #f5f5f5;
			.ivu-checkbox{left: 250px;}
			.ivu-checkbox-inninner2er{border-color: #45c8dc}
			.ivu-checkbox-inner{height: 15px;width: 15px;border-radius: 15px;}
			.ivu-checkbox-checked .ivu-checkbox-inner{background-color: #fff;border-color: #45c8dc}
			.ivu-checkbox-inner:after{border: none;width: 9px;height: 9px;border-radius: 9px;background: #45c8dc;top:2px;left: 2px;}
			.ivu-tree-arrow + .ivu-checkbox-wrapper {display: none;}
			.ivu-tree-arrow-hidden + .ivu-checkbox-wrapper {display: inline-block;}
		}
		}
		.inner2-right{margin-left: 18px;width: 100%;font-size: 14px;padding-left: 315px;padding-right:50px;
			.ivu-icon-trash-b{color: #45c8dc;font-size: 20px;}  /*垃圾筐图标*/
			/*上移下移*/
			.ivu-btn-primary{width: 50px;height: 26px;color: #fff;background-color: #45c8dc;border: none;}
			.ivu-table th {background-color: #f0f0f0;}
			.ivu-table-header .ivu-table-cell span{font-size: 14px;}
			.ivu-table-row,.ivu-table-column-center{height: 50px;}
			.ivu-table-border td, .ivu-table-border th{border-right: 1px solid #f0f0f0;}
			.ivu-btn-ghost{height: 27px;width: 97px;color: #fff;background-color: #45c8dc;line-height: 0px;font-size: 14px;border: none;
			.ivu-icon-arrow-up-c{margin-right: 9px;margin-left: -4px;}}
			}
			.soipt{position: relative;margin-bottom: 14px;
				.sanjiao{width: 14px;height: 9px; 
				// background: url('./../../../img/sanjiao.png');
				background: url('/Public/pc/dcanmou-client/img/sanjiao.png');
				position: absolute;top:42px;left: 20px;z-index: 2;}
				.tips{position: absolute;width: 203px;height: 36px;border: 1px solid #45c8dc;z-index: 1;background-color: #fff;top:50px;line-height: 36px;text-align: center;}
				.ivu-input{height: 40px;outline: none;}
				.sobtn{margin-left: -4px;margin-right: 9px;}
				.sobtn, .ivu-btn{width: 62px;height: 40px;color: #fff;background-color: #45c8dc;border: none;font-size: 14px;}
				.ivu-btn{width: 80px;}
			}
		}
		.ivu-btn-text{color: #45c8dc;text-decoration: underline;}
	}
	.mask {
		    width: 100%;
		    height: 100%;
		    background: rgba(0,0,0,0.4);
		    z-index: 1;
		    position: fixed;
		    top: 0;
    left: 0;
		.gooddetailDiv {
			height:80%;
			width: 60%;
			background: #fff;
			color: #525661;
			font-size: 16px;
			z-index: 10;
			position: fixed;
			top:1%;
			overflow-y:scroll;
			left:20%;
			.d_header{
				display: flex;
				justify-content: space-between;
				height: 50px;line-height: 50px;
				color: #45c8dc;
				font-weight: bolder;
				padding: 0 20px;
			}
			.sub_header{
				font-size: 16px;
				line-height: 36px;
				padding: 0 20px;
				background: #f0f0f0;
			}
			.ivu-col{line-height: 40px;border: 1px solid #f0f0f0;border-top: none;border-right: none;padding-left:20px;}
			img {width: 220px;height: 150px;padding-right: 10px;}
			/*.d_table{padding: 0 20px;}*/
			.pic{padding: 10px 15px 20px 20px;}
			.ivu-btn{border: none;;background: #fff;color: #45c8dc;}
		}
	}
</style>