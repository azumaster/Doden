<template>
    <Menu active-name="statistics" theme="dark" width="auto">
        <div class="layout-logo-left">
            <h2>找冻品网OA - 数据统计</h2>
        </div>
        <router-link to="/" ><Menu-item name="statistics">商品咨询</Menu-item></router-link>
        <router-link to="/goodsStatistics"><Menu-item name="buyer">商品数据</Menu-item></router-link>
         <router-link to="/shopStatistics"><Menu-item name="shopStatistics">店铺数据</Menu-item></router-link>
        <router-link to="/sellStatistics"><Menu-item name="sellStatistics">销售数据</Menu-item></router-link>
        <router-link to="/evaluatedata"><Menu-item name="evaluate">评价数据</Menu-item></router-link>
        <router-link to="/order"><Menu-item name="order">订单数据</Menu-item></router-link>
    </Menu>
</template>

<script>
    export default {
        name: 'nav'
    };
</script>