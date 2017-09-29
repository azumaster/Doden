<template>
    <Menu theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
            <div><h1>找冻品网OA-营销中心</h1></div>
        </div>
        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                营销中心
                            </template>
                            <router-link to="/manageExchangeTicket" ><Menu-item name="1-1">管理兑换券</Menu-item></router-link>
                            <router-link to="/addExchangeTicket" ><Menu-item name="1-2">新增兑换券</Menu-item></router-link>
                            <router-link to="/exchangeHistory" ><Menu-item name="1-3">兑换记录</Menu-item></router-link>
                        </Submenu>
    </Menu>
</template>
<script>
    export default {
        name: 'nav'
    };
</script>