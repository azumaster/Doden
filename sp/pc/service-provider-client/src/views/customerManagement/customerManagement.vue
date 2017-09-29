<template>
	<div class="index">
		<div class="layout-content-main">
			 <Row>
			 	<Col span="24" style="margin-bottom:32px;">
			 		<b></b><span>昨日情况</span>
			 	</Col>
			 </Row>
			 <Row>
			 	<Col span="10" >
			 		 <div class="ivu-card">
			 		 	<div>
						  <p><i class="iconfont icon-account-star"></i></p>
						  <p>新增用户</p>
						</div>
						<div></div>
		               <div><p>{{basedata.ytd_new_usr}}</p></div>
			 		 </div>
			 	</Col>
			 	<Col span="10" offset="2">
			 		<div class="ivu-card">
			 		 	<div>
						  <p><i class="iconfont icon-accountbalancewallet"></i></p>
						  <p class="wallet">交易金额(元)</p>
						</div>
						<div></div>
		               <div><p class="wallet">{{basedata.ytd_money}}</p></div>
			 		 </div>
			 	</Col>
			 </Row>
			 <Row>
			 	<Col span="24">
				 <div class="mg75">
			 		<b></b><span>累计情况</span><span>(截止到昨日)</span>
				 </div>
			 	</Col>
			 </Row>
			 <Row>
			 	<Col span="10">
			 		 <div class="ivu-card">
			 		 	<div>
						  <p><i class="iconfont icon-account-star"></i></p>
						  <p>新增用户</p>
						</div>
						<div></div>
		               <div><p>{{basedata.total_usr}}</p></div>
			 		 </div>
			 	</Col>
			 	<Col span="10" offset="2">
			 		<div class="ivu-card">
			 		 	<div>
						  <p><i class="iconfont icon-accountbalancewallet"></i></p>
						  <p class="wallet">交易金额(元)</p>
						</div>
						<div></div>
		               <div><p class="wallet">{{basedata.total_money}}</p></div>
			 		 </div>
			 	</Col>
			 </Row>
		</div>
		<Footer></Footer>
	</div>
</template>
<script>
import '../../iconfont/iconfont.css';
import Footer from './../../components/footer.vue';
	export default {
		components: {Footer},
		data () {
			return {
				baseparams:{
					fields: 'ytd_new_usr,ytd_money,total_usr,total_money',
				},
				basedata: {}
			}
		},
		methods: {
			getBase () {
				var _this = this;
				_this.$http({
					method: 'GET',
					// params: _this.baseparams,
					url: './mock/management.json',
					// url: '/statics',
					header: 'Accept:application/json'
				}).then(response => {
					if(response.body.code == 0) {
						console.log(response.body.data)
						_this.basedata = response.body.data;
					}
				})
			}
		},
		created () {
			this.getBase();
		}
	}
</script>
<style scoped>
	.copy-inner{margin-left: 0px !important; margin-right: 265px;}
	.ivu-col-span-20 {background: #ffffff;}
	.index { padding: 63px 0 0 63px;}
	.layout-content-main b {display: inline-block;width: 14px;height: 14px;background: #838993;margin-right: 5px;}
	.layout-content-main span {font-size: 14px;color:#838993 }
	.ivu-card {width: 687px;height: 178px;border: 1px solid #F0F0F0;}
	.ivu-card div{ float: left;padding: 70px 0;}
	.ivu-card div:first-child {width: 200px;text-align: center}
	.ivu-card .icon-account-star {font-size: 24px;color: #45C8DC}
	.ivu-card .icon-accountbalancewallet {font-size: 24px;color: #FF775C}
	.ivu-card div:nth-child(2) {width: 1px;height: 178px;background: #F0F0F0}
	.ivu-card .wallet {color: #FF775C}
	.ivu-card p {font-size: 16px;color: #838993}
	.ivu-card div:last-child p{font-size: 30px;color: #45C8DC;width: 398px;text-align: center}
	.ivu-card div:last-child .wallet {color: #FF775C}
	.layout-content-main .mg75 {margin: 32px 0;}
	.layout-copy{position: fixed;bottom: 0;width: 100%;margin-left: -63px;}
</style>