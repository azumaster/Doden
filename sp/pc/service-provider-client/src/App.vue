<template>
    <div class="layout">
                <div class="layout-ceiling">
                    <p class="title"><span>冻参谋</span>OA管理系统</p>
                            <div class="layout-ceiling-main">
                                <div><span><i class="iconfont icon-ic_person_px"></i><span>{{user}}</span></span></div> 
                                <div><router-link to="/settings"><i class="iconfont icon-chilun"></i></router-link></div> 
                                <div><Button style="padding-left:42px; border-left:1px solid #32A9BB" type="text" @click="quit"><i class="iconfont icon-exit"></i></Button></div>
                            </div>
                </div>
                <div class="main">
                    <div class="layout-menu-left">
                            <navMenu></navMenu>
                    </div>
                    <div class="layout-content">
                            <router-view></router-view>
                    </div>
                </div>
            <Back-top></Back-top>
        
       <!--  <Footer></Footer> -->
    </div>
</template>

<script>
    import './less/style.less';
    import './iconfont/iconfont.css';
    import navMenu from './components/nav.vue';
    
    export default {
        name: 'app',
        components: {navMenu},
        data () {
            return {
                user: 'haha',
                username: '',
                leftheight: 0
            }
        },
        methods: {
            quit () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/user/logout',
                    header:'Accept:application/json'
                }).then(response => {
                    if(response.body.code ==0 ) {
                        window.location.href="/user/logout";
                    }
                    else{
                        _this.$Modal.error({
                            content: '退出失败，请重试'
                        });
                    }
                });
            },
             getShopInfo () {
				var _this = this;
				_this.$http ({
					method: 'GET',
					url: '/user/info',
					header:　'Accept:application/json'
				}).then (response =>{
					if(response.body.code == 0 ) {
						_this.user = response.body.data.shop_name;
                        _this.removeCookie('username');
					}
				}); 
			},
            getCookie(name){
            var arr=document.cookie.split('; ');
            var i=0;
                for(i=0;i<arr.length;i++){
                    var arr2=arr[i].split('=');
                    if(arr2[0]==name){  var getC = decodeURIComponent(arr2[1]); return getC;}
                }
            return;
            },
            removeCookie(name){this.setCookie(name, '1', -1);},
            de_fun () {
                var vm = this;
                setInterval(function (){
                    var name = vm.getCookie('username');
                    if (name == 'yangyumei') {
                        vm.getShopInfo();
                    }
                },2000);
            },
            setCookie(name, value, iDay){
            var oDate=new Date();
            oDate.setDate(oDate.getDate()+iDay);
            document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
            },
            isopenindex () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/home/status',
                    header: 'Accept:application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        if (response.body.data == 0) {
                            _this.$store.state.middleware.navbar = false;
                            _this.$store.state.middleware.openbtn = true;
                        }
                        else if(response.body.data == 1) {
                            _this.$store.state.middleware.navbar = true;
                            _this.$store.state.middleware.openbtn = false;
                        }
                    }
                })
            },
        },
        created(){
          this.leftheight = document.body.clientHeight ;
          this.getShopInfo();
          this.de_fun();
          this.isopenindex();
    }
    };
</script>
<style scoped>
.main{height: 100%;width: 100%;padding-top: 50px;margin-top: -50px;}
.ivu-col-span-20 {background: #ffffff;}
    .ivu-col-span-4{width: 265px;}
    .layout .title {display: inline-block;color: #fff;font-size: 18px;letter-spacing: 2px;width: 203px;text-align: center;background: #3FB4C6}
    .layout .title span {color: #9DD4DF;}
    .layout-ceiling div span span{letter-spacing: 3px;padding-left: 18px;}
    .layout-ceiling-main .iconfont {font-size: 18px;}
   .layout-ceiling .icon-exit {color: #228D9F; position: relative;top: -4px;font-size: 18px;}
   .layout-ceiling .layout-ceiling-main span {color: #FFFFFF;font-size: 14px;}
   .layout-ceiling-main div{float: left; padding: 0 20px;}
   .layout-ceiling .layout-ceiling-main .icon-chilun {color: #228D9F;font-size: 18px;}
</style>
