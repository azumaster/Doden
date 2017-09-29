<template>
    <div class="layout">
        <Row>
            <Col span="4" class="layout-menu-left"> 
                    <navMenu></navMenu>
            </Col>
            <Col span="20">
                <div class="layout-content">
                    <router-view></router-view>
                </div>
            </Col>
        </Row>
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
        },
        methods: {
            increment () {
                 this.$store.commit('increment', 9);

            },
            decrement () {
                console.log(this.$store.state.count);
            }
        },
         created(){
        //    req.getUserInfo(this,{},(res) => {
        //     console.log('test',res);
        //    })
        }
    };
</script>
<style>
    .ivu-row,.ivu-col-span-4{height: 100% !important;}
</style>