<template>
    <div class="product-menu">
        <Menu mode="horizontal" active-name="1">
            <router-link to="/products"><MenuItem name="1">最新上传商品 <span style="color: red">(17)</span></MenuItem></router-link>
            <router-link to="/products/putaway"><MenuItem name="2">已上架</MenuItem></router-link>
            <router-link to="/products/unputaway"><MenuItem name="4">未上架</MenuItem></router-link>
        </Menu>
        <p>最新上传时间：<span style="color: #ff3333">2017-08-30 10:30</span></p>
    </div>
</template>

<script>
    export default {
        name: 'productsMenu'
    }
</script>