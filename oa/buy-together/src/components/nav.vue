<template>
    <Menu active-name="statistics" theme="dark" width="auto">
        <div class="layout-logo-left">
            <h2>找冻品网OA - 集采管理</h2>
        </div>
        <router-link to="/" ><Menu-item name="statistics"><Icon type="stats-bars"></Icon>集采统计</Menu-item></router-link>
        <Submenu name="rankingList">
            <template slot="title"><Icon type="ios-keypad"></Icon>排行榜</template>
            <router-link to="/seller" ><Menu-item name="seller">卖家详情</Menu-item></router-link>
            <router-link to="/buyer"><Menu-item name="buyer">买家详情</Menu-item></router-link>
            <router-link to="/goods"><Menu-item name="goods">商品详情</Menu-item></router-link>
        </Submenu>
    </Menu>
</template>

<script>
    export default {
        name: 'nav'
    };
</script>