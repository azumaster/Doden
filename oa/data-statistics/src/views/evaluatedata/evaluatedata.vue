<template>
	<div>
	 <div class="layout-header"><h1>评价数据</h1></div>
	 <div class="layout-content-main" :style="contentStyle">
	 	<tab :tabs="tabs"></tab>
		 <h3 class="layout-tip">数据说明：供应商评价为交易得到的评价，采购商评价为交易给出的评价</h3>
	 	<router-view></router-view>
	 </div>
	</div>
</template>
<script>
import Tab from '../../components/tab.vue';
export default {
	name: 'evaluatedata',
	components: {Tab},
	data () {
		return {
			tabs: [{key: 'evaluatedata/', name: '供应商'},
			{key: 'evaluatedata/buyers', name: '采购商'}],
			contentStyle: {minHeight: (window.innerHeight-200)+'px'}
		};
	}
};
</script>