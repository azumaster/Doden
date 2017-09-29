<template>
	<div id="analysis">
	 <div class="layout-content-main">
	 	 <Tabs>
	 	 	<Tab-pane label="客户增长">
	 	 		<router-view></router-view>
	 	 	</Tab-pane>
	 	 </Tabs>
	 </div>
	 <Footer></Footer>
	</div>
</template>
<script>
import Footer from './../../components/footer.vue';
	export default {
		components: {Footer}
	}
</script>
<style lang="less">
#analysis {
	.ivu-select-arrow{right: 17px;}
	// .ivu-select-dropdown {width: 146px !important;}
background-color: #FFFFFF;height:100%;
.ivu-select-selection { .ivu-select-placeholder {font-size: 14px}}
.ivu-select-selected-value {font-size: 14px;padding-left: 23px;}
.ivu-input {font-size: 14px;}
// .ivu-tabs-nav .ivu-tabs-tab{font-size: 14px;margin-left: 70px;color:#525661;letter-spacing: 1px;margin-bottom:13px;padding: 16px 16px 0 16px; }
// .ivu-tabs-nav .ivu-tabs-ink-bar {left: 74px;height: 4px;width: 97px; background-color: #45C8DC;}
// .ivu-tabs-bar {border-bottom: 1px solid #E5E7E6;margin-bottom: 0}
.layout-copy{margin-left: 0px;position: fixed;bottom: 0;width: 100%;}
}
</style>
