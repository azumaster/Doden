<template>
	<div id="addExchangeTicket">
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
		name: 'addExchangeTicket',
		components: {Tab},
		data () {
			return {
				tabs: [{key: 'addExchangeTicket', name: '新增兑换券'}
			]
			}
		}
	}
</script>