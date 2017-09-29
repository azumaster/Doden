<template>
	<div class="hotsort">
		 <Tabs value="name1">
        <Tab-pane label="热销分类" name="name1">
        	<div class="inner">
        		<p class="txt">最多推8个分类<span>（还能再选择{{left}}个分类）</span></p>
        		<div class="inner-left">
        			<div class="inner-left-top">
        			 <Input v-model="sorts" placeholder="请选择分类类型进行添加" style="width: 250px"></Input>
        			 <Button type="info" class="add" @click="sureadd">添加</Button>
        			 </div>
        			 <div class="inner-left-bottom">
        			 <Tree :data="baseData" show-checkbox @on-check-change="treeselect"></Tree>
        			 </div>
        		</div>
        		<div class="inner-right">
        			 <Table border   :columns="columns" :data="data"></Table>
        		</div>
        	</div>
        </Tab-pane>
    </Tabs>
		<Footer></Footer>
	</div>
</template>
<script>
	import Footer from './../../components/footer.vue';
	export default {
		components: {Footer},
		data () {
			return{
				left: 0,
                sortsTree: [],
				sorts: [], //选择的分类，最多8个
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
				baseData: [{
                    expand: true,
                    title: '冻品',
                    children: []
                }],
                first: 0,
                last: 0,
                //参数
                sortparams: {categories: []}
			}
		},
		methods: {
            treeselect (e) {
                var _this = this;
                _this.sorts = [];
                 _this.left = 8 - _this.last;
               this.left = this.left - e.length;
                if (this.left< 0) {this.$Message.warning({
                    content: '最多推8个分类',
                    duration: 2
                });this.sorts = [];this.left = 8 - _this.last;return;}
                else{
                    for(var i in e) {
                        _this.sorts.push(e[i].title);
                    }
                }
            },
            sureadd () {    //添加分类
                var _this = this;
                var total = this.sortsTree[1];
                for(var i in this.sorts) {
                    console.log(this.sorts[i]);
                    for(var j in this.sortsTree[1]) {
                        for(var e in this.sortsTree[1][j]) {
                            if (this.sorts[i] == this.sortsTree[1][j][e].type_name) {
                                this.sortparams.categories.push(this.sortsTree[1][j][e].type_id);
                                new Promise(function (resolve) {
                                    _this.savesort(resolve);
                                }).then(function () {
                                    _this.gethotsorts();
                                    _this.getsortsTree();
                                });
                            }
                        }
                    }
                }
            },
            rowDown (e,sort) {
                var downdata = this.data[sort-1];
                var ondowndata = this.data[sort];
                downdata.sort ++;
                ondowndata.sort --;
                this.data.splice(sort-1,1);
                this.data.splice(sort,0, downdata);
                this.sortparams.categories = [];
                for (var i in this.data) {
                    this.sortparams.categories.push(this.data[i].id);
                }
                this.savesort()
            },
            rowUp (e,sort) {
                var updata = this.data[sort-1];
                var onupdata = this.data[sort-2];
                updata.sort --;
                onupdata.sort ++;
                this.data.splice(sort-1,1);
                this.data.splice(sort-2,0, updata);
                this.sortparams.categories = [];
                for (var i in this.data) {
                    this.sortparams.categories.push(this.data[i].id);
                }
                this.savesort()
            },
            deletesort (e,sort) {
                var _this = this;
                if(sort == 1) {
                    this.data.splice(sort-1,1);
                    for(var i in this.data) {this.data[i].sort --}
                    this.last =this.data.length;
                }
               else if(sort == this.last) {
                     this.data.splice(sort-1,1);
                    this.last =this.data.length;
                }
                else{
                    this.data.splice(sort-1,1);
                    for(var i in this.data) {
                        this.data[i].sort = parseInt(i)+1;
                    }
                    this.last = this.data.length;
                }
                this.sortparams.categories = [];
                for(var i in this.data) {
                    this.sortparams.categories.push(this.data[i].id)
                }
                this.left = 8 - this.last;
                new Promise(function (resolve) {
                                    _this.savesort(resolve);
                                }).then(function () {
                                    _this.gethotsorts();
                                    _this.getsortsTree();
                                });

            },
            getsortsTree () {
                var _this = this,obj1,obj2;
                _this.$http({
                    method: 'GET',
                    url: '/goods/categories',
                    header: 'Accept:application/json',
                    url: './mock/shang.json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.sortsTree = response.body.data;
                         _this.baseData[0].children = [];
                        delete _this.sortsTree[1].type_name;
                        delete _this.sortsTree[1].type_id;
                        delete _this.sortsTree[1].type_pic_url;
                       for (var i in _this.sortsTree[1]) {
                            obj1 = {title: _this.sortsTree[1][i].type_name, expand: false, children: []};
                            delete _this.sortsTree[1][i].type_name;
                            delete _this.sortsTree[1][i].type_id;
                            delete _this.sortsTree[1][i].type_pic_url;
                            for (var j in _this.sortsTree[1][i]) {
                                obj2 = {title: _this.sortsTree[1][i][j].type_name};
                                obj1.children.push(obj2);
                                _this.baseData[0].children.push(obj1);
                            }
                       }
                        var no_repeat = [];
                        for (var i = 0,len= _this.baseData[0].children.length;i<len;i++) {
                            if(no_repeat.indexOf(_this.baseData[0].children[i]) == -1) {no_repeat.push(_this.baseData[0].children[i])}
                        }
                             _this.baseData[0].children = [];
                            _this.baseData[0].children = no_repeat;
                        for(var i in _this.baseData[0].children) {
                           for(var j in _this.baseData[0].children[i].children) {
                                for (var e in _this.data) {
                                   if (_this.baseData[0].children[i].children[j].title == _this.data[e].name) {
                                    _this.baseData[0].children[i].children.splice(j,1)
                                   } 
                            }
                           }     
                        }
                    }
                });
            },
            gethotsorts () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/home/hot/category',
                    url: './mock/hotsorts.json',
                    header: 'Accept:application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.data = response.body.data;
                        _this.sortparams.categories = [];
                        for (var i in _this.data) {
                            _this.sortparams.categories.push(_this.data[i].id);
                        }
                        // _this.data[0] = Object.assign(_this.data[0], {first: 1});
                        _this.last = _this.data.length;
                        _this.left = 8 - _this.last;
                        // _this.getsortsTree();
                        // _this.data[_this.last] = Object.assign( _this.data[_this.last], {last: 1});
                    }
                })
            },
            savesort (resolve) {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    body: _this.sortparams,
                    url: '/home/hot/category',
                    header: 'Accept:application/json'
                }).then(response => {
                    if(response.body.code != 0) {
                        var mes = response.body.message;
                        _this.$Message.error({
                            content: mes,
                            duration: 2
                        })
                    }
                    else{ 
                        _this.sorts = [];
                        resolve('ok');
                    }
                    // else {_this.gethotsorts();
                    //     _this.getsortsTree();
                    // }
                })
            }
		},
        created () {
                this.gethotsorts();
                this.getsortsTree();
        }
	}
</script>
<style lang="less" >
.hotsort{
	.ivu-tabs-nav{margin-left: -55px;}
	.inner{margin-left: 15px;font-size: 14px;color: #4d4c4c; overflow: hidden;
		.txt{line-height: 38px; span{color:#45c8dc}}
		.inner-left{float: left;width: 315px; .add{height: 40px;width: 60px;color: #fff;background-color: #45c8dc;border: none;margin-left: -1px;} 
		.ivu-input{height: 40px;outline: none;border: none;}
		.inner-left-top{height: 42px;width: 315px;border: 1px solid #f5f5f5;border-radius: 4px;}
		.inner-left-bottom{margin-top: -20px;padding-top: 20px;;border: 1px solid #f5f5f5;border-top: none;border-radius: 4px;
			.ivu-checkbox{left: 250px;}
			.ivu-checkbox-inner{border-color: #45c8dc}
			.ivu-checkbox-inner{height: 15px;width: 15px;border-radius: 15px;}
			.ivu-checkbox-checked .ivu-checkbox-inner{background-color: #fff;border-color: #45c8dc}
			.ivu-checkbox-inner:after{border: none;width: 9px;height: 9px;border-radius: 9px;background: #45c8dc;top:2px;left: 2px;}
			.ivu-tree-arrow + .ivu-checkbox-wrapper {display: none;}
			.ivu-tree-arrow-hidden + .ivu-checkbox-wrapper {display: inline-block;}
		}
		}
		.inner-right{padding-left: 315px;padding-right: 50px;margin-left: 18px;width: 100%;font-size: 14px;
			.ivu-icon-trash-b{color: #45c8dc;font-size: 20px;}  /*垃圾筐图标*/
			/*上移下移*/
			.ivu-btn-primary{width: 50px;height: 26px;color: #fff;background-color: #45c8dc;border: none;}
			.ivu-table th {background-color: #f0f0f0;}
			.ivu-table-header .ivu-table-cell span{font-size: 14px;}
			.ivu-table-row,.ivu-table-column-center{height: 50px;}
			.ivu-table-border td, .ivu-table-border th{border-right: 1px solid #f0f0f0;}
		}
	}
}
	.layout-copy { margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
</style>