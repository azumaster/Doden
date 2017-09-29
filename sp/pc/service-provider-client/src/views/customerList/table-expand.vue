<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div id="expand">
        <Row class="expand-row"><p>收货地址</p></Row>
        <Row class="expand-row" v-for="item in row.address" :key="item">
            <Col span="6">
                <span class="expand-value">{{ row.user_name }}</span>
            </Col>
            <Col span="6">
                <span class="expand-value">{{ row.mobile_phone }}</span>
            </Col>
            <Col span="8" >
                <span  class="expand-value">{{ item.full_address }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
<style lang="less">
    #expand {
        font-size: 14px;
        p {font-weight: bold}
    }
</style>
