<template>
	<div>
	 <div class="layout-header">白名单管理</div>
	 <div class="layout-content-main">
	 	<Tabs>
	 		 <Tab-pane label="白名单管理">
	 		 	<div><Input v-model="telnum" placeholder="请输入手机号" style="width: 300px"></Input> <Button type="info" @click="soso">搜索</Button></div>
	 		 	<div class="filter">
			 		<Select v-model="place" style="width:200px;margin-right: 40px;" placeholder="全部地区" @on-change="placeChange">
		        		<Option v-for="item in placeList" :value="item.key" :key="item">{{ item.value }}</Option>
		    		</Select>
                    <span>开通状态&nbsp;&nbsp;&nbsp;</span>
		    		<Select v-model="status" style="width:200px;margin-right: 40px;" placeholder="全部状态" @on-change="kaitongChange">
		        		<Option v-for="item in statusList" :value="item.value" :key="item">{{ item.label }}</Option>
		    		</Select>
                     <span>支付状态&nbsp;&nbsp;&nbsp;</span>
		    		<Select v-model="paystatus" style="width:200px" placeholder="全部状态" @on-change="zhifuChange">
		        		<Option v-for="item in paystatusList" :value="item.value" :key="item">{{ item.label }}</Option>
		    		</Select>
	 		 	</div>
	 		 	<Table :columns="columns" border  :data="data"></Table>
                  <div class="pageBar">
                  <Page :current="1" :total="total" simple @on-change="pageChange"></Page>
                  </div>
	 		 </Tab-pane>
	 	</Tabs>
	 </div>
	 <div class="layout-copy">
            2015-2017 &copy; 找冻品网
        </div>
	</div>
</template>
<script>
    export default {
        data () {
            return {
                place: '',
                placeList: [],
                status: '',
                statusList: [{ value: 5, label: '已开通'},{value: 1,label: '未开通'},{value: 0,label: '全部状态'}],
                paystatus: '',
                paystatusList: [{ value: 2, label: '已支付'},{value: 1,label: '未支付'},{value: 0,label: '全部状态'}],
                columns:[
                    {
                        title: '店铺名',
                        align: 'center',
                        key: 'shop_name'
                    },
                    {
                        title: '地区',
                        align: 'center',
                        key: 'area_province'
                    },
                    {
                        title: '手机号',
                        align: 'center',
                        key: 'mobile'
                    },
                    {
                        title: '开通状态',
                        align: 'center',
                        render: (h, params) => {
                           if (params.row.open_status == 1) {
                            return h('span', '未开通')
                           }
                           if (params.row.open_status == 5) {
                             return h('span', '已开通')
                           } 
                        }
                    },
                    {
                        title: '授信额度(元)',
                        align: 'center',
                        key: 'total_limit'
                    },
                    {
                        title: '支付状态',
                        align: 'center',
                        render: (h, params) => {
                            if(params.row.pay_status == 1) {
                                return h('span', '未支付')
                            }
                            else if(params.row.pay_status == 2) {
                                return h('span', '已支付')
                            }
                        }
                    },
                    {
                        title: '支付金额(元)',
                        align: 'center',
                        key: 'pay_money'
                    }
                ],
                data: [],
                params: {page: 1, size: 20},
                telnum: '',
                total: 0
            }
        },
        methods: {
        	soso () {
                this.params.page = 1;
                if (!this.telnum) {delete this.params.mobile;}
                else {this.params.mobile = this.telnum;}
                this.getList();
        	},
            placeChange (e) { //大区
                this.params.page = 1;
                delete this.params.mobile;
                if (e == 'all') {delete this.params.province_id;this.getList(); return;}
                this.params.province_id = e;
                this.getList();
            },
            kaitongChange (e) { //开通状态
                this.params.page =1;
                delete this.params.mobile;
                this.params.open_status = e;
                this.getList();
                
            },
            zhifuChange (e) { //支付状态
                this.params.page = 1;
                delete this.params.mobile;
                this.params.pay_status = e;
                this.getList();
            },
            pageChange (e) {
                this.params.page = e;
                this.getList();
            },
            getList () {
                req.getWhiteList(this, this.params, (res) => {
                    if (res.code == 0) {
                        this.data = res.data.lists;
                        this.total = res.data.total;
                    }
                });
                // var vm = this;
                // vm.$http({
                //     params: vm.params,
                //     url: '/external/ious/ximu/list',
                //     method: 'GET',
                //     header: 'Accept:application/json'
                // }).then(response => {
                //     if(response.body.code == 0) {
                //         vm.data = response.body.data.lists;
                //         vm.total = response.body.data.total;
                //     }
                // })
            },
            getPlacelist () {
               req.getPlace(this, {}, (res) => {
                if (res.code == 0) {
                    this.placeList = res.data.provinces;
                    var obj = {key: 'all', value: '全部地区'};
                    this.placeList.push(obj);
                }
                })
            }

        },
        created () {
            this.getList();
            this.getPlacelist();
        }
    }
</script>
<style scoped>
	.filter{margin: 20px 0;}
    .pageBar{float: right;margin-top: 20px;}
</style>