<template>
	<div>
		<div class="center">
			<Button type="ghost" shape="circle" class="openindex" @click="openindex" v-if="this.$store.state.middleware.openbtn">开启首页</Button>
			<Button type="ghost" v-else shape="circle" class="openindex" @click="closeindex">关闭首页</Button>
			<p>开启首页后您可以首页设置您常卖的商品分类、品牌和商品</p>
		</div>
		<Footer></Footer>
	</div>
</template>
<script>
	import Footer from './../../components/footer.vue';
	export default {
		components: {Footer},
		data () {
			return {
				params: {enable: 1}
			}
		},
		methods: {
			openindex () {
				this.params.enable = 1;
				this.actionindex();
			},
			actionindex() {
				var _this = this;
				_this.$http({
					method: 'POST',
					url: '/home/status',
					body: _this.params,
					header: 'Accept:application/json'
				}).then(response => {
					if (response.body.code == 0) {
						_this.$store.state.middleware.navbar = !_this.$store.state.middleware.navbar;
						_this.$store.state.middleware.openbtn = !_this.$store.state.middleware.openbtn;
					}
				})
			},
			closeindex () {
				this.params.enable = 0;
				this.actionindex();
			}, 
			//ES7
			// fetchdata1 () {
			// 	var _this = this;
			// 	_this.$http({
			// 		method: 'GET',
			// 		url: './mock/fenxi.json'
			// 	}).then(response =>{
			// 		console.log(response.body.data);
			// 	});
			// },
			// fetchdata2 () {
			// 	var _this = this;
			// 	_this.$http({
			// 		method: 'GET',
			// 		url: './mock/brands.json'
			// 	}).then(response =>{
			// 		console.log(response.body.data);
			// 	});
			// }
		},
		// created () {
		// 	var vm = this;
		// 	async function test () {
		// 		await vm.fetchdata1();
		// 		await vm.fetchdata2();
		// 	}
		// 	test();
		// }
	}
</script>
<style lang="less" scoped>
	.layout-copy { margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
	.openindex{width: 300px;height: 100px;border-radius: 100px;font-size: 30px;color: #fff;background-color: #45c8dc;}
	.ivu-btn-ghost:hover{background-color: #45c8dc;border: 1px solid #fff;color: #fff}
	.center{text-align: center;margin-top: 20%;p{font-size: 14px;color: #525661;line-height: 35px;}}
</style>