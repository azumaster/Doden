<template>
	<div>
	 <div class="layout-header">区域分布</div>
	 <div class="layout-content-main">
	 	<tab :tabs="tabs"></tab>
	 	<router-view></router-view>
	 </div>
	 <Footer></Footer>
	</div>
</template>
<script>
import Tab from '../../components/tab.vue';
import Footer from  '../../components/footer.vue';
export default {
	components: {Tab,Footer},
	data () {
		return {
			tabs: [{key: 'area/', name: '用户分布'},
			{key: 'area/payspread', name: '支付分布'}]
		};
	},
};
</script>