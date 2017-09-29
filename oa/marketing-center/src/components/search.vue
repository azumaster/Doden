<template>
    <div class="operate">
        <down :options="area" placeholder="请选择省市" style="margin-right: 30px"></down>
        <down :options="filter" placeholder="请选择搜索项"></down>
        <Input v-model="search" placeholder="请输入搜索内容" style="width: 300px"></Input>
        <Button type="primary" icon="ios-search">搜索</Button>
    </div>
</template>

<script>
    import down from './select.vue';
    import Base from './../common/base.js';
    export default {
        mixins: [Base],
        name: 'search',
        components: {down},
        data: function () {
            return {
                area: [],
                filter: [{divide_id: 0, dividename: '手机号码'}, {divide_id: 1, dividename: '店铺名称'}],
                search: ''
            };
        }
    };
</script>