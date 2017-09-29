<template>
    <Menu active-name="waitAudit" theme="dark" width="auto">
        <div class="layout-logo-left">
            <div><h1>找冻品网OA-店铺管理</h1></div>
        </div>
        <router-link to="/waitAudit" ><Menu-item name="waitAudit" class="layout-menu-item">待审核店铺</Menu-item></router-link>
        <router-link to="/audited" ><Menu-item name="audited" class="layout-menu-item">已开通店铺</Menu-item></router-link>
        <router-link to="/refused" ><Menu-item name="refused" class="layout-menu-item">已拒绝店铺</Menu-item></router-link>
        <router-link to="/closed" ><Menu-item name="closed" class="layout-menu-item">已关闭店铺</Menu-item></router-link>
    </Menu>
</template>

<script>
    export default {
        name: 'nav'
    };
</script>