<template>
    <div class="layout">
        <Row type="flex">
            <i-col span="5" class="layout-menu-left">
                <Affix>
                    <navMenu></navMenu>
                </Affix>
            </i-col>
            <i-col span="19">
                <div class="layout-content">
                    <router-view></router-view>
                </div>
            </i-col>
        </Row>
        <Back-top></Back-top>
    </div>
</template>

<script>
    import './less/style.less';
    import navMenu from './components/nav.vue';

    export default {
        name: 'app',
        components: {
            navMenu
        },
        data () {
            return {
                params: {name: 'abc', age: 1}
            }
        }
        // created(){
        //    req.getUserInfo(this,{},(res) => {
        //     console.log('test',res);
        //    })
        // }
    };
</script>
<style>
    .room_img{
     width: 320px;
     height: 240px;
     margin-right: 10px;
     position: absolute;
     overflow: hidden;
   }
</style>