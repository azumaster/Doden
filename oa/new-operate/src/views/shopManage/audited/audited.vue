<template>
    <div id="waitAudit" >
        <div class="layout-header">已开通店铺</div>
        <div class="layout-content-main">
            <tab :tabs="tabs"></tab>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import tab from '../../../components/tab.vue';

    export default {
        name: 'waitAudit',
        components: {tab},
        data: function () {
            return {
                tabs: [{key:'audited', name:'已开通店铺'}]
            };
        }
    };
</script>