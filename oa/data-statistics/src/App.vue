<template>
    <div class="layout">
        <Row type="flex">
            <i-col span="5" class="layout-menu-left">
                <navMenu></navMenu>
            </i-col>
            <i-col span="19">
                <breadcrumb></breadcrumb>
                <div class="layout-content">
                    <div class="layout-content-main">
                        <router-view></router-view>
                    </div>
                </div>
                <div class="layout-copy">2015-2017 &copy; 找冻品网</div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    import './less/style.less';
    import navMenu from './components/nav.vue';
    import breadcrumb from './components/breadcrumb.vue';

    export default {
        name: 'app',
        components: {
            navMenu,
            breadcrumb
        }
    };
</script>
<style>
h1{line-height: 60px;}
h2{margin-bottom: 20px;}
.page {
    margin:20px 0;
}
     .mainselect{background: #E4E4E4;}
    .selectlist{
        padding: 20px 0 20px 40px;
    }
    .selectlist div{display: inline-block;margin-right: 20px;}
</style>