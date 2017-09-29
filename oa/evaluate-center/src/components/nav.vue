<template>
    <Menu active-name="waitAudit" theme="dark" width="auto" :open-names="['1']">
        <div class="layout-logo-left">
            <div><h1>找冻品网OA-评价中心</h1></div>
        </div>
        <router-link to="/evaluateMain" ><Menu-item name="evaluateMain" class="layout-menu-item">评价管理</Menu-item></router-link>
        <router-link to="/evaluatedata" ><Menu-item name="evaluate" class="layout-menu-item">评价数据统计</Menu-item></router-link>
        <!--评价管理是超然写的需求，以下为续小晨  -->
           <Submenu name="1">
            <template slot="title"><Icon type="ios-navigate"></Icon>全部订单</template>
            <router-link to="/tradeOrderMain" ><Menu-item name="tradeOrderMain" class="layout-menu-item">交易订单</Menu-item></router-link>
            <!-- <router-link to="/refundOrder" ><Menu-item  class="layout-menu-item">退款订单</Menu-item></router-link>
            <router-link to="/returnedGoodsOrder" ><Menu-item  class="layout-menu-item">退货订单</Menu-item></router-link>
            <router-link to="/financeOrder" ><Menu-item  class="layout-menu-item">财务待确认订单</Menu-item></router-link>
            <router-link to="/withdrawOrder" ><Menu-item  class="layout-menu-item">提现订单</Menu-item></router-link>
            <router-link to="/closedOrder" ><Menu-item  class="layout-menu-item">交易关闭</Menu-item></router-link>-->
             <!-- <router-link to="/financeOA" ><Menu-item name="financeOA" class="layout-menu-item">财务后台</Menu-item></router-link>   -->
        </Submenu>
        <Submenu><template slot="title"><Icon type="ios-navigate"></Icon>财务退款</template>
            <router-link to="/financeOA" ><Menu-item name="financeOA" class="layout-menu-item">财务退款订单</Menu-item></router-link>
        </Submenu>
        <router-link to="/orderData" ><Menu-item name="order" class="layout-menu-item">订单数据统计</Menu-item></router-link>
    </Menu>
</template>

<script>
    export default {
        name: 'nav'
    };
</script>