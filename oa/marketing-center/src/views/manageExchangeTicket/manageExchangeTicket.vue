<template>
	<div>
	 <div class="layout-header">管理兑换券</div>
	 <div class="layout-content-main">
	 	<tab :tabs="tabs"></tab>
	 	<router-view></router-view>
	 </div>
	</div>
</template>
<script>
import Tab from '../../components/tab.vue';
export default {
	name: 'manageExchangeTicket',
	components: {Tab},
	data () {
		return {
			tabs: [{key: 'manageExchangeTicket/', name: '使用中'},
			{key: 'manageExchangeTicket/waitAdd', name: '待上架'},
			{key: 'manageExchangeTicket/stopedUse', name: '已停用'}]
		};
	}
};
</script>