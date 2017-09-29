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
        created(){
            // window.location.href = '#/manageExchangeTicket';
        }
        // http://img.idongpin.com/
    };
</script>