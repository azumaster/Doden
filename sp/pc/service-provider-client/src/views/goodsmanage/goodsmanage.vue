<template>
  <div id="goodsmanage">
        <Tabs value="goodsmanage">
        <Tab-pane label="商品管理" name="goodsmanage">
            <div id="goodsmanagecontent">
                <div class="top">
                    <div class="left">
                        <ul>
                        <li  :class="{'active':$index ==qwer}"     @click="liclick($index, item.id)" v-for="(item, $index) in oneLevel" :key="item"><p>{{item.name}} <i class="iconfont icon-xiangyou"></i></p></li>
                        </ul>
                    </div>
                    <div class="right">
                        <div v-for="(item, $index) in secondLevel" :key="item" class="flexbox">
                            <div class="secondLevel">{{item.type_name}}</div>
                            <span class="thirdLeve" :class="{'active': it.type_id==second}" @click="spanclick($index, it.type_id)" v-for="(it, $index) in item" :key="it">{{it.type_name}}</span>
                        </div> 
                    </div>
                </div>
                <div class="bottom">
                    <div class="soso">
                         <Input v-model="xiangsiparams.search" v-on:input ="soso" placeholder="          请输入要搜索的品牌名" type="primary" style="width: 314px"></Input>
                         <Button icon="ios-search" @click="sobrands"></Button>
                         <span>屏蔽状态</span>
                         <Select  style="width:156px;margin-left:30px;" v-model="mask" @on-change="pingbiChange">
                                <Option v-for="item in maskList" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                        <div class="xiangsi" v-if="xiangsishow">
                            <div @click="xiangsiclick(item)" v-for="item in xiangsidata" :value="item" :key="item">{{item}}</div>
                        </div>
                    </div>
                    <p class="nowbrand">当前品牌：{{allbrands}}种</p>
                    <div class="brandtable">
                        <Table  :columns="columns" :data="brandsdata" @on-selection-change="selected"></Table>
                    </div>
                    <div class="btns">
                        <Button type="primary" @click="changePrice('noid')">改价</Button>
                        <Button type="primary" @click="lockedbrands">屏蔽</Button>
                    </div>
                </div>
                
            </div>
        </Tab-pane>
    </Tabs>
    <!--恢复销售弹出框-->
    <Modal
        v-model="modal"
        title="恢复销售"
        ok-text="保留加价"
        cancel-text = "不加价"
        @on-cancel="cancelSavePirce(saveAddId)"
        :closable="false"
        :width=500
       >
       <p><Icon type="ios-checkmark-outline"></Icon></p>
        <p style="font-size:16px;line-height:50px;color:#525661;">品牌恢复销售成功</p>
        <p>该品牌上次改价{{gaijiaprice}},是否保留加价？</p>
        <p>若不改价，则按照找冻品网原价销售。</p>
    </Modal>
    <!--改价弹出框-->
    <Modal
        v-model="changePrincemodal"
        title="确认改价"
        ok-text="确认改价"
        cancel-text = "关闭"
        @on-ok="sureChangePrice"
        :closable="false"
        :width=500
       >
       <Row>
        <Col span="12" style="    text-align: right;"> <Select v-model="changePricemodel" style="width:155px;margin-right:13px;margin-bottom:27px;">
        <Option v-for="item in changePriceList" :value="item.value" :key="item">{{ item.label }}</Option>
        </Select></Col>
        <Col span="12"><Input v-model="changePricevalue" placeholder="请输入加价比例" style="width: 140px;margin-left:13px;"><span slot="append">%</span></Input></Col>
    </Row>
        <p>按件卖商品，改价后，向上取整，精确到元。如加价后2.16元，则实际</p>
        <p>显示金额为3.00元。</p>
        <p>按公斤、超码件、袋卖商品，改价后，向上取整，精确到角。如加价后</p>
        <p>2.12元，则实际显示金额为2.20</p>
    </Modal>
    <Footer></Footer>
  </div>
</template>
<script>
import Vue from 'vue';
import Footer from './../../components/footer.vue';
export default {
    components: {Footer},
        data () {
            return {
                allbrands: 0,
                changePricemodel: 'add',
                changePriceList: [{value: 'add',label: '加价'}, {value: 'des',label:'降价'}],
                changePricevalue: '',
                gaijiaprice: 0, //改价百分比
                mask: 'all',
                saveAddId: null,
                modal:false, //恢复销售弹出框
                changePrincemodal: false, //改价弹出框
                xiangsishow: true,
                firstLi: true,
                sureChangePriceparams: { //确认改价参数
                    sort_id:5,
                },
                zhidingparams: {
                     sort_id:5, 
                     brand_ids : []
                },
                maskList: [
                    {
                        value: 'all',
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未屏蔽'
                    },
                    {
                        value: 1,
                        label: '已屏蔽'
                    }
                ],
                xiangsidata: [],
                somodel: '',
                active: false,
                sortdata: [],
                oneLevel: [],
                secondLevel:[],
                thirdLevel:[],
                params: {status: 0},
                columns:[
                    {
                        type: 'selection',
                        title:'全选',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '品牌名',
                        width: 217,
                        key: 'name',
                         align: 'center'
                    },
                    {
                        title: '屏蔽',
                        key: 'pingbi',
                        width: 160,
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.status ==0) {
                                return h('div', [
                                    h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.unlockedbrands(params.row.id,params.row.increase);
                                        }
                                    }
                                }, params.row.pingbi)
                                ])
                            }
                            else {return h('div', [
                                //    h('span',params.row.pingbi)
                                h('Button', {
                                     props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.lockedbrands(params.row.id);
                                        }
                                    }
                                }, params.row.pingbi)
                            ]);}
                        }
                    },
                    {
                        title: '改价',
                        key: 'gaijia',
                        width: 160,
                        align: 'center',
                        render: (h,params) => {
                            return h('div', [
                                    h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.changePrice(params.row.id);
                                        }
                                    }
                                }, params.row.gaijia)
                                ])
                        }
                    },
                    {
                        title: '当前改价',
                         width: 160,
                        key: 'now',
                         align: 'center'
                    },
                    {
                        title: '置顶',
                        key: 'top',
                        width: 160,
                        align: 'center',
                        render: (h,params) => {
                            if (params.row.serial) {
                                return h('div', [
                                    h('Button', {
                                     props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.quxiaozhiding(params.row.id);
                                        }
                                    }
                                }, params.row.top)
                                ])
                            }
                            else {
                                return h('div', [
                                    h('Button', {
                                     props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.zhiding(params.row.id);
                                        }
                                    }
                                }, params.row.top)
                                ])
                            }
                        }
                    },
                    { title: '排序',
                        width: 160,
                        align: 'left',
                       render: (h, params) => {
                           if (params.row.num) {
                                   if(params.row.num>1) {
                               return h('div', [
                                h('span', params.row.num),
                                h('Icon', {
                                    props: {
                                        type: 'arrow-up-c'
                                    }
                                }),
                                h('Button', {
                                    props: {
                                         type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.rowUp(params.row.num)
                                        }
                                    }
                                }),
                            ]);
                           }
                           else {
                               return h('div', [
                                   h('span', {
                                       style: {
                                        marginRight: '50px'
                                    },
                                   }, params.row.num)
                            ]);
                           }
                           }
                        }
                    },
                ],
                xiangsiparams: {
                    sort_id:5
                },
                pingbiparams: {
                    sort_id: 5,
                    brand_ids: []
                },
                unlockparams: {
                    sort_id: 5,
                    brand_ids: [],
                    clear_increase: false
                },
                brandsdata:[],
                qwer: '0',
                second: 5,
                selections: [],
                zhidingbrands: []
            }
        },
        methods: {
            getSort () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: './mock/goodssort.json',
                    // url: '/goods/categories',
                    header: 'Accept:application/json'
                }).then(response => {
                      _this.sortdata = response.body.data[1];
                    if(response.body.code == 0 ) {
                      delete _this.sortdata.type_name;
                      delete _this.sortdata.type_id;
                      delete _this.sortdata.type_pic_url;
                    for (var i in _this.sortdata) {
                        var obj = {name: _this.sortdata[i].type_name, id:_this.sortdata[i].type_id};
                        _this.oneLevel.push(obj);
                    }
                        delete _this.sortdata[2].type_name;
                        delete _this.sortdata[2].type_pic_url;
                        delete _this.sortdata[2].type_id;
                        _this.secondLevel = _this.sortdata[2];
                    }
                });
            },
            getBrand () {
                var _this = this;
                _this.zhidingbrands = [];
                _this.$http({
                    method: 'GET',
                    // url: '/goods/category/brands',
                    url: './mock/brands.json',
                    params:_this.xiangsiparams,
                    header: 'Accept:application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.allbrands = response.body.data.count;
                        _this.brandsdata = response.body.data.brands;
                        for (var i in _this.brandsdata){
                            if (_this.brandsdata[i].status == 0) { //已屏幕的商品
                                _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {pingbi: '恢复销售'});
                            } //未屏蔽的商品
                            else if (_this.brandsdata[i].status != 0) {
                                _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {pingbi: '屏蔽'});
                                _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {gaijia: '改价'});
                                //当前加价
                                if ( _this.brandsdata[i].increase >0) {
                                    _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {now:'+'+ _this.brandsdata[i].increase*100+'%'});
                                }
                                else {_this.brandsdata[i] = Object.assign(_this.brandsdata[i], {now: _this.brandsdata[i].increase*100+'%'});}
                                //置顶与未置顶
                                if ( _this.brandsdata[i].serial) { _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {top: '取消置顶'});
                                    _this.brandsdata[i] = Object.assign(_this.brandsdata[i], {num: parseInt(i)+1});
                                    _this.zhidingbrands.push ( _this.brandsdata[i].id);
                                    var norepeat = [];
                                    for (var i =0 ,len = _this.zhidingbrands.length; i <len; i ++) {
                                        if (norepeat.indexOf(_this.zhidingbrands[i]) == -1 ) {norepeat.push(_this.zhidingbrands[i])}
                                    }
                                    _this.zhidingbrands = norepeat;
                                }
                                else {_this.brandsdata[i] = Object.assign(_this.brandsdata[i], {top: '置顶'});}
                            }
                            
                        }
                    }
                });
                
            },
            liclick (index, id) {
               this.qwer = index;
               this.secondLevel = this.sortdata[id];
            },
            spanclick(index, id) {
                delete this.xiangsiparams.search;
                this.second = id;
                this.xiangsiparams.sort_id = id;
                this.pingbiparams.sort_id = id;
                this.unlockparams.sort_id = id;
                this.sureChangePriceparams.sort_id = id;
                this.zhidingparams.sort_id = id;
                this.getBrand();
            },
            pingbiChange (e) {
                if (e == 'all') {delete this.xiangsiparams.in_blacklist;this.getBrand();return;}
                else{this.xiangsiparams.in_blacklist = e;this.getBrand();}
            },
            rowUp (num) {
                var  updata = this.brandsdata[num-1];
                updata.num --;
                this.brandsdata[num-2].num++;
                this.brandsdata.splice(num-1,1);
                this.brandsdata.splice(num-2,0,updata);
                this.zhidingparams.brand_ids =[];
                for (var i in this.brandsdata) {
                    if (this.brandsdata[i].serial) {
                        this.zhidingparams.brand_ids.push(this.brandsdata[i].id);
                    }
                }
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/goods/category/stick',
                    body: _this.zhidingparams,
                    header: 'Accept:application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.$Message.success('品牌排序成功！');
                        _this.getBrand();
                    }
                })
            },
            zhiding (id) {
                var _this = this;
                _this.zhidingbrands.push(id);
                var norepeat = [];
                 for (var i =0 ,len = _this.zhidingbrands.length; i <len; i ++) {
                     if (norepeat.indexOf(_this.zhidingbrands[i]) == -1 ) {norepeat.push(_this.zhidingbrands[i])}
                 }
                _this.zhidingbrands = norepeat;
                if(_this.zhidingbrands.length > 5) { 
                    _this.zhidingbrands.pop();
                    _this.$Message.warning('品牌置顶最多5个');return;
                    }
                _this.zhidingparams.brand_ids = _this.zhidingbrands;
               _this.$http({
                    method: 'POST',
                    url: '/goods/category/stick',
                    body: _this.zhidingparams,
                    header: 'Accept:application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.$Message.success('品牌置顶成功！');
                        _this.getBrand();
                    }
                })
            },
            quxiaozhiding (id) {  //取消置顶
                var _this = this;
                for (var i in _this.zhidingbrands) {
                    if (id == _this.zhidingbrands[i]) {
                        _this.zhidingbrands.splice(i,1)
                        
                        }
                }
                _this.zhidingparams.brand_ids = _this.zhidingbrands;
                _this.$http({
                    method: 'POST',
                    url: '/goods/category/stick',
                    body: _this.zhidingparams,
                    header: 'Accept:application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.$Message.success('品牌取消置顶成功！');
                        _this.getBrand();
                    }
                })
            },
            sobrands () { //搜索品牌按钮
                if (this.xiangsiparams.search.length == 0) {delete this.xiangsiparams.search;}
                this.xiangsishow = false;
                this.getBrand();
            },
            lockedbrands(id) {    //屏蔽分类品牌
                var _this = this;
                if (_this.selections.length > 0) {_this.pingbiparams.brand_ids = _this.selections;}
                else {_this.pingbiparams.brand_ids.push(id)}
                _this.$http({
                    method: 'POST',
                    body:_this.pingbiparams,
                    url: '/goods/category/blacklist',
                    header: 'Accept:application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Message.success('品牌屏蔽成功');
                        _this.selections = [];
                        _this.getBrand();
                    }
                    else {
                        var mes = response.body.message.length >0 ? response.body.message: '操作未完成，请重试！';
                        _this.$Message.error(mes);
                    }
                })
            },
            changePrice (id) {    //改价
                var _this = this;
                if (id =='noid') { _this.changePrincemodal = true;return;}
                _this.changePrincemodal = true;
                _this.sureChangePriceparams.brand_ids = [];
                _this.sureChangePriceparams.brand_ids.push(id);
            },
            unlockedbrands (id,increase) { //恢复销售
                var _this = this;
                _this.gaijiaprice = increase*100+'%';
                _this.unlockparams.brand_ids = [];
                _this.unlockparams.brand_ids.push(id);
                _this.saveAddId =id;
                _this.$http({
                    method: 'POST',
                    url: '/goods/category/blacklist/cancel',
                    body:_this.unlockparams,
                    header : 'Accept:application/json'
                }).then (response =>{
                        if (response.body.code == 0) {
                            if (_this.gaijiaprice == '0%') {_this.$Message.success('品牌恢复销售成功！');}
                            else{_this.modal = true;}
                            _this.getBrand();
                        }
                })
            },
            saveAdd (id) { //恢复销售之后保留加价
                this.unlockparams.clear_increase = false;
                this.unlockedbrands(id)
            },
            cancelSavePirce (id) {
                this.sureChangePriceparams.brand_ids = [];
                this.sureChangePriceparams.brand_ids.push(id);
                this.sureChangePriceparams.percentage = 0;
                this.sureChangePrice();
                this.getBrand();
            },
            selected (selection) { //多选
                this.selections = [];
               for (var i in selection) {
                    this.selections.push(selection[i].id);
               }
            },
            xiangsiclick (e) { //点击相似商品之后，相似商品消失
                this.xiangsiparams.search = e;
                this.xiangsishow = false;
            },
            sureChangePrice () { //确认改价
                var _this = this;
               if(_this.changePricevalue < 0) {_this.$Message.warning('价格的改变不能小于0'); return;} 
                if (_this.selections.length > 0) { _this.sureChangePriceparams.brand_ids = _this.selections;}
                if (_this.changePricemodel == 'des') {
                    _this.sureChangePriceparams.percentage = -_this.changePricevalue/100;
                }
                else {_this.sureChangePriceparams.percentage = _this.changePricevalue/100;}
               _this.$http({
                   method: 'POST',
                   url: '/goods/category/markup',
                   body:_this.sureChangePriceparams,
                   header: 'Accept:application/json'
               }).then(response=> {
                    if (response.body.code == 0) {
                        _this.$Message.success('品牌改价成功');
                        _this.selections = [];
                        _this.getBrand();
                    }
                    else { _this.$Message.error('品牌改价失败');}
               });
            },
            soso () { //input相似搜索延迟执行1S
                this.xiangsiparams.search =  this.xiangsiparams.search.replace(/(^\s*)|(\s*$)/g, "");
                if(this.xiangsiparams.search.length <=0) {return;}
                var _this = this ;
                clearTimeout(set);
                var set = setTimeout(function () { //延迟两秒获得input值
                     _this.xiangsidata = [];
                    _this.xiangsishow = true;
                    _this.$http({
                    method: 'GET',
                    url: '/goods/category/brands/hint',
                    params:_this.xiangsiparams,
                    header: 'Accept:application/json'
                }).then (response => {
                    if (response.body.code == 0) {
                        _this.xiangsidata = response.body.data;
                    }
                    clearTimeout(set);
                });
                },2000);
            }
        },
        created () {
            this.getSort();
            this.getBrand();
        },
        mounted () {
         
        }
}
</script>
<style lang="less">
    @border: 1px solid #e5e7e6;
    @40:40px;
 #goodsmanage{
    height: 100%;
    .layout-copy{
    width: 100%;
    position: inherit;
    margin-left: 0;.copy-inner{margin-right: 0px !important;}}
    //  .ivu-input{height: 40px;}
    .ivu-table-column-center .ivu-btn-small span {font-size: 14px;}
     font-size: 14px;
     position: relative;
     .left{border: @border;float: left;height: 320px;overflow-y: scroll;
     li {line-height: 40px;border-bottom: @border;padding-left: 30px;padding-right: 24px;
        p{display: inline-block;width: 96px;height: 40px; i {float: right;}}
        }
     }
     
     .top{width: 1119px;height: 320px;}
     .ivu-tabs-bar{margin-bottom: 20px;}
     .ivu-tabs-nav .ivu-tabs-tab{margin-left: 29px;}
     .ivu-tabs-nav .ivu-tabs-ink-bar{left: 32px;}
    #goodsmanagecontent{margin-left: 29px;}
        ::-webkit-scrollbar {height: 100px; width: 6px;background-color: #ffffff; }
        ::-webkit-scrollbar-thumb{height: 100px; border-radius: 6px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); background-color: #999; }
    .right{
        overflow-y: scroll;height: 320px;width: 950px;float: left;border: @border;line-height: 40px;
        padding-left: 40px;
        .flexbox {display: flex;justify-content:flex-start;overflow: hidden; flex-wrap:wrap;}
        .secondLevel{width: 160px;font-weight: bold;}
        .thirdLeve{padding-right: 40px;}
    }
    .active{color:#45c8dc;}
    .bottom{
        .soso{position: relative;padding-top: 20px;
        .xiangsi {position: absolute;top: 60px;left: 0px;z-index: 1000;width: 275px;background: #fff;text-align: center;}
        .ivu-select-single .ivu-select-selection{height:40px;}
        .ivu-select-selected-value{font-size: 14px;padding-left: 30px;line-height: @40;}
        .ivu-input{height: @40;line-height: @40;}
        .ivu-input:hover{border: @border}
        .ivu-input{outline: none!important;}
        .ivu-btn-icon-only { background-color: #f0f0f0;border: none;width: @40;height: @40;color: #45c8dc;font-size: 14px;position: relative;left: -40px;}
        }
    .nowbrand{line-height: 50px;}
    .brandtable {
        width: 1108px;
        .ivu-checkbox-checked .ivu-checkbox-inner{border-color: #45c8dc;color: #45c8dc;background-color: #45c8dc;}
        .ivu-table{font-size: 14px;}
        .ivu-table th{background-color: #f0f0f0;}
        .ivu-table-wrapper{border: 1px solid #f0f0f0;border-bottom: 0;border-right: 0;}
        .ivu-icon-arrow-up-c {margin-left: 30px;display: inline-block;width: 18px;height: 18px;border-radius: 18px;background-color: #45c8dc;color: #fff;text-align: center;line-height: 18px;}
        .ivu-table-column-left {padding-left: 50px;
        .ivu-btn-small {
            height: 18px;width: 18px;position: relative;left: -18px;opacity: 0;filter:alpha(opacity=0);
        }
        }
        
    }
    .btns {
        margin-top: 16px;
        margin-bottom: 33px;
            .ivu-btn-primary{width: 160px;margin-right: 30px;height: 44px;border-radius: 22px;font-size: 16px;color: #fff;background-color:#45c8dc;border: 0; }
        }
    }
 }
</style>

