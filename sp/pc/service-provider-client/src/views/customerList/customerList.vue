<template>
	<div id="list">
		<div class="layout-content-main">
			 <Tabs>
			 	<Tab-pane label="客户名单">
			 		<!-- 头部筛选项 -->
			 		<div class="selects">
						<Row :gutter="100">
                              <div class="selects_top">
					            <div>
									<Select  style="width:135px" v-model="way">
				        				<Option v-for="item in selectList" :value="item.value" :key="item">{{ item.label }}</Option>
				    				</Select>
					            </div>
					       
					       
					        	<div><Input  placeholder="请输入..." style="width: 295px" v-model="params.search"></Input></div>
					      
                            <div class-name="btn">
                                <Button type="primary" icon="ios-search" @click="sobtn"></Button>
                            </div>
                            </div>
					    </Row>
			 		</div> <!-- 头部筛选项结束 -->
				    <div class="margin_l">
							<Table :columns="columns" :data="data"></Table>
                            <div style="overflow: hidden;margin-bottom: 20px;">
                            <div class="timeP">
							 <span>共{{last_page}}页</span><Page :total="total" @on-change="pageChange" show-elevator page-size="10" :current="params.page"></Page>
                             </div>
                             </div>
                             
				    </div>
			 	</Tab-pane>
			 </Tabs>
		</div>
      <Footer></Footer>
	</div>
</template>
<script>
	 import expandRow from './table-expand.vue';
    import Footer from './../../components/footer.vue';
	export default {
		components: { expandRow, Footer},
		data () {
			return {
                last_page: 0,
                total: 0,
				selectList: [{value: 'phone', label: '手机号'}, {value: 'name', label: '店铺名'}],
                way: 'name',
				params: {
					search: '',
                    page: 1,
                    size: 10
				},
				columns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: '店铺名',
                        key: 'shop_name'
                    },
                    {
                        title: '注册时间',
                        key: 'created_at'
                    },
                    {
                        title: '手机号',
                        key: 'mobile_phone'
                    },
                    {
                        title: '店铺分类',
                        key: 'shop_type'
                    }
                ],
                data: []
			}
		},
		methods: {
            getBaseData () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/custom',
                    url: './mock/list.json',
                    params: _this.params,
                    header:　'Accept:application/json'
                }).then(response => {
                    if (response.body.code == 0 ) {
                       _this.last_page = response.body.data.last_page;
                       _this.total = _this.params.size  * response.body.data.last_page;
                        _this.data = response.body.data.customs;
                       
                    }
                });
            },
            pageChange (e) {
                this.params.page = e;
                this.getBaseData();
            },
            sobtn () {
                this.params.page = 1;
                this.getBaseData();
            }
		},
		created () {
			this.getBaseData();
		}
	}
</script>
<style lang="less">
#list {
    padding-bottom: 58px;
    .ivu-table-wrapper{border: none;}
    .ivu-select-selection{width: 135px;}
    .selects_top{div{float: left;}margin: 28px 0;height: 40px;border: 1px solid #f0f0f0;width: 483px;border-radius: 4px;.ivu-select-arrow{border-right: 1px solid #f0f0f0;padding:3px 0;padding-right: 13px;}}
        .ivu-btn-primary { background-color: #f0f0f0;border: none;margin-top: -2px;}
    .ivu-icon-ios-search:hover {color: #2d8cf0;}
    .btn {text-align: center;background-color: #f0f0f0;}
    .ivu-input {font-size: 14px;border: none; height: 38px;}
    .ivu-select-selection {border: none;.ivu-select-placeholder {font-size: 14px}}
    .ivu-icon-ios-search {color: #60D0E1;font-size: 28px;font-weight: bold}
    .ivu-select-selected-value {font-size: 14px;padding-left: 23px;padding-top: 3px;}
    .layout-content-main {background-color: #fff;}
    .ivu-table {font-size: 14px;border-left:1px solid #dddee1;}
    .margin_l {margin-left: 70px;}
    .ivu-select-item{font-size: 14px !important;}
    .ivu-col-span-4{padding: 32px 0}
    .selects {margin-left: 123px;}
    // .ivu-tabs-nav .ivu-tabs-tab{font-size: 14px;margin-left: 70px;color:#525661;letter-spacing: 1px;margin-bottom:13px;padding: 16px 16px 0 16px; }
    // .ivu-tabs-nav .ivu-tabs-ink-bar {left: 74px;height: 4px;width: 97px;background-color: #45C8DC;}
    // .ivu-tabs-bar {border-bottom: 1px solid #E5E7E6;margin-bottom: 0}
    .timeP {float:right;display: flex;margin-top: 15px;margin-right: 15px;}
    .timeP span {line-height: 32px; font-size: 12px;margin-right: 15px;}
    .layout-copy{position: fixed;bottom: 0;margin-left: 0;width: 100%;}
}
</style>