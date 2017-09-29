<template>
    <div id="orderData">
        <div class="layout-header">订单数据统计</div>
        <div class="layout-content-main" :style="contentStyle">
            <tab :tabs="tabs"></tab>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import Tab from '../../components/tab.vue';
    export default {
        name: 'orderData',
        components: {Tab},
        data () {
            return {
                tabs: [{key: 'orderData/', name: '订单数据统计'},
                    {key: 'orderData/operate', name: '运营介入率统计'},
                    {key: 'orderData/catch', name: '异常订单理由统计'}],
                contentStyle: {minHeight: (window.innerHeight-200)+'px'}
            };
        }
    };
</script>