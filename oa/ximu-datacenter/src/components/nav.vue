<template>
    <Menu theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
            <div><h1>找冻品网OA-数据中心</h1></div>
        </div>
        <Submenu name="1">
                            <template slot="title">
                                <Icon type="home"></Icon>
                                徙木金融-冻品贷数据
                            </template>
                            <router-link to="/user" ><Menu-item name="1-1"><Icon type="person-stalker"></Icon>用户分布和趋势</Menu-item></router-link>
                            <router-link to="/area" ><Menu-item name="1-2"><Icon type="pie-graph"></Icon>区域分布</Menu-item></router-link>
                            <router-link to="/pay" ><Menu-item name="1-3"><Icon type="arrow-graph-up-right"></Icon>支付分布和趋势</Menu-item></router-link>
                        </Submenu>
    </Menu>
</template>
<script>
    export default {
        name: 'nav'
    };
</script>