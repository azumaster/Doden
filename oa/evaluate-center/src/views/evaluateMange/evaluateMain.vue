<template>
    <div id="evaluateMain" >
        <div class="layout-header">评价管理</div>
        <div class="layout-content-main">
            <tab :tabs="tabs"></tab>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import tab from '../../components/tab.vue';

    export default {
        name: 'evaluateMain',
        components: {tab},
        data: function () {
            return {
                tabs: [{key:'evaluateMain', name:'评价管理'}]
            };
        }
    };
</script>