<template>
	<div id="exchangeHistory">
	 <div class="layout-header">兑换记录</div>
	 <div class="layout-content-main">
	 	<tab :tabs="tabs"></tab>
	 	<router-view></router-view>
	 </div>
	</div>
</template>
<script>
	import Tab from '../../components/tab.vue';
	export default {
		name: 'exchangeHistory',
		components: {Tab},
		data () {
			return {
				tabs: [{key: 'exchangeHistory', name: '兑换记录'}
			]
			}
		}
	}
</script>