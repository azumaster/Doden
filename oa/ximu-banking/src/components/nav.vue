<template>
    <Menu theme="dark" active-name="1-1" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
            <div><h1>外部供应链服务</h1></div>
        </div>
        <Submenu name="1" >
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                徙木金融-冻品贷
                            </template>
                            <router-link to="/whiteList" ><Menu-item name="1-1"><Icon type="document-text"></Icon>白名单管理</Menu-item></router-link>
                        </Submenu>
    </Menu>
</template>
<script>
    export default {
        name: 'nav'
    };
</script>