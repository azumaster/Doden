<template>
    <div class="layout-inner">
        <div class="page-operate">
            <Button type="text" icon="ios-arrow-back" @click="back">返回</Button>
            <p class="inner-title">管理店铺</p>
        </div>
        <Tabs :animated="false">
        <Tab-pane label="店铺信息">
            <template>
    <div id="shopInfo" class="shop-info">
        <div class="operate">
            <Button type="primary" size="large" @click="save" style="margin-right: 30px">保存更改</Button>
            <Button size="large" @click="close">关闭店铺</Button>
        </div>
        <div class="layout-body form">
            <Form  :label-width="80" :rules="ruleInline">
                <Form-item label="店铺名称">
                    <Input v-model="SPdetail.dianPuName" placeholder="请输入店铺名称"></Input>
                </Form-item>
                <Form-item label="姓名">
                    <Input v-model="SPdetail.xingming" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="店铺类型">
                    <Row>
                        <Col span="11">
                        <Select style="width:200px" v-model="SPdetail.trenchnum" @on-change="typeChange">
                            <Option v-for="item in shopType" :value="item.id" :key="item" placeholder="请选择
                            店铺类型">{{ item.name }}</Option>
                        </Select>
                        </Col>
                        <Col span="3" style="text-align: center">
                        微信分组</Col>
                        <Col span="10">
                        <Select style="width:200px" v-model="SPdetail.weChatGroupId">
                            <Option v-for="item in wechatGroup" :value="item.id" :key="item" placeholder="请选择
                            微信分组">{{ item.name }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="所属市场" v-if="show">
            <Row>
                <Col span="11">
                    <Form-item prop="province">
                        <Select v-model="SPdetail.province_id" style="width:200px" @on-change="provinceChange">
                        <Option v-for="item in provinceList1" :value="item.provinceidtxt"  :key="item">{{ item.dividename }}</Option>
                    </Select>
                    </Form-item>
                </Col>
                <Col span="11">
                    <Form-item prop="market">
                       <Select v-model="SPdetail.pianquId" style="width:200px" @on-change="pianquChange">
                        <Option v-for="item in marketList1" :value="item.pianquId" :key="item">{{ item.pianqu }}</Option>
                    </Select>
                    </Form-item>
                </Col>
            </Row>
        </Form-item>
                <Form-item label="店铺地址">
                <Row v-if="show">
                        <Col span="5">{{OneDetailData.province}}</Col>
                        <Col span="5">{{OneDetailData.city}}</Col>
                        <Col span="5">{{OneDetailData.county}}</Col>
                        <Col span="9"><Input v-model="SPdetail.xiangXiDiZi" placeholder="请输入店铺门牌号"></Input></Col>
                    </Row>
                <Row v-else>
                    <Col>
                        <Select v-model="SPdetail.province_id" style="width:200px" @on-change="provinceChange">
                        <Option v-for="item in provinceList2" :value="item.provinceidtxt"  :key="item">{{ item.dividename }}</Option>
                    </Select>
                    <Select v-model="SPdetail.city"  style="width:200px" @on-change="cityChange">
                        <Option v-for="item in cityList1" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                    <Select v-model="SPdetail.county" clearable style="width:200px" @on-change="countyChange">
                        <Option v-for="item in countyList" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                    <Input v-model="SPdetail.xiangXiDiZi" placeholder="请输入店铺门牌号"></Input>
                        </Col>
                        </Row>
                </Form-item>
                <Form-item label="店铺照片">
                   <div class="img" id="img">
                        <div v-for='(item ,index ) in imgs' class='room_img'>
                        <img :src="item">
                        </div>
                        <img :src="imgpath" >
                    </div>
                    <div class="btn">
                        <Button type="info">图片上传</Button>
                        <input class="ipt" type="file"  @change="previewImg"/>
                    </div>
                </Form-item>
            </Form>
        </div>
    </div>
</template>
        </Tab-pane> 
        <!-- 店铺信息结束 -->
        <Tab-pane label="成员管理">
            <template>
                 <Button type="info" @click="is_addmember= !is_addmember">添加成员</Button>
                  <Button type="info" @click="is_mateCode= !is_mateCode">绑定店铺二维码</Button>
    <div id="member" class="member">
        <div class="table">
            <Table border :columns="th" :data="td"></Table>
        </div>
    </div>
</template>
        </Tab-pane>
        <!-- 成员管理结束 -->
    </Tabs>
    <!-- 添加成员对话框 -->
    <Card  v-if="is_addmember" border class="addCard">
        <p slot="title">
            <Icon type="plus-circled"></Icon>
            添加店铺成员
        </p>
        <Form ref="addparams" :model="addparams" :label-width="80" :rules="addrules">
             <FormItem label="手机号" prop="mobile">
                <Row>
                    <Col span="18">
                        <Input type="text" v-model="addparams.mobile" placeholder="请输入..."></Input>
                    </Col>
                </Row>
             </FormItem>
             <FormItem label="角色" prop="role">
                <Row>
                    <Col span="18">
                        <Select v-model="addparams.role" placeholder="请选择成员角色">
                            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </Col>
                </Row>
             </FormItem>
             <Button size="large" @click="addmember('addparams')">确认</Button>
             <Button size="large" @click="is_addmember = !is_addmember">取消</Button>
        </Form>
    </Card >
    <!-- 绑定员工二维码 -->
    <Card  v-if="is_mateCode" border class="addCard">
        <p slot="title">
            <Icon type="plus-circled"></Icon>
            绑定店铺二维码
        </p>
               <div><img  id="codeImg" class="codeImg" :src="codeImg"/></div>
               
                   <div style="margin-bottom:20px;">
                        <Select v-model="addparams.role" placeholder="请选择成员角色" @on-change="roleChange" style="width:150px">
                            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.name}}</Option>
                        </Select>
                    </div>
             <Button size="large" @click="mateCodeImg">复制</Button>
             <Button size="large" @click="is_mateCode = !is_mateCode">取消</Button>
      
    </Card >
    </div>
</template>

<script>
    import down from './../../../components/select.vue';
    import Base from './../../../common/base.js';
    export default {
        mixins: [Base],
        name: 'manage',
        components: {
            down
        },
        data () {
            return {
                codeImg: 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar',
                roleList: [], 
                is_addmember: false,
                is_mateCode: false,
                addparams: {
                    shop_id: 0,
                    mobile: '',
                    role: 2
                },
                addrules:{
                    mobile: [
                        {required: true, message: '请输入11位手机号',trigger: 'blur'},
                        {type: 'string', min:11,max: 11, message: '请输入11位手机号',trigger: 'blur'}
                    ]
                },
                imgs:[],
                fd: null,
                path: '',
                show: true,
                SPdetail: {},
                module: 'audited',
                refused: false,
                refuseForm: {
                    refuseInfo: ''
                },
                refuseRule: {
                    refuse: []
                },
                // 成员管理
                memberparams: {
                    shopId:0
                },
                NotOneparams: {
                    type: 21
                },
                Oneparams: {
                    type:11
                },
                OneDetail: {
                    id: 0
                },
                shopDetailparams: {
                    shopId:0,
                },
                th:[{title:'姓名', key:'xingming'}, {title: '角色', key:'role'}, {title: '电话', key:'lianxiTel'},
                    {title: '操作', render: (h, memberparams)=>{
                        return h('div', [h('strong', {props: {type: 'primary', size: 'small' }, on: {
                            click: () => { this.delMember(memberparams.index, memberparams.row);}
                        }}, memberparams.row.operate)]);
                    }}],
                td:[],
                delparasm: {
                    shopId:0,
                    shId:0
                },
                OneDetailData: {},
                closedparams: {
                    shopId:0
                },
                pianqu: [],
                city: [],
                county: [],
                marketList1: [],
                provinceList1: [],
                provinceList2: [],
                cityList1: [],
                countyList: [],
                provinceItem: 0,
                cityItem: 0,
                imgpath: '',
                Onedetal: {
                    id: 0
                },
                pianquId: 0,
                ruleInline: {
                    province:[{ required: true, message: '请选择省市', trigger: 'blur' }],
                    market: [{ required: true, message: '请选择市场', trigger: 'blur' }]
                },
                trenchnum: 0
            };
        },
        methods: {
            typeChange (e) {
                this.trenchnum = e;
                if (e != 11) {this.show = false;this.NotOneparams.type = e;this.SPdetail.pianquId=0;}
                else {this.show = true;this.getOnedetal();this.getOneData();}
            },
            save: function () { //提示框
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '你是否保存更改该店铺信息？',
                    okText: '保存',
                    onOk: function () {
                        _this.saved();
                    }
                });
            },
            saved () {  //确认修改
                var _this = this;
                if (_this.SPdetail.trenchnum != 11) {
                    _this.SPdetail.pianquId = 0;
                        delete _this.SPdetail.pianqu_name;
                        delete _this.SPdetail.grounds;
                        delete _this.SPdetail.pianqu_province_id;
                        delete _this.SPdetail.zhuceTime;
                    };
                _this.$http({
                    method: 'POST',
                    url: '/shop/handle/update',
                    body: _this.SPdetail,
                    header: 'application/json',
                }).then(responce => {
                    if (responce.body.code == 0) {
                       _this.$Message.success('店铺保存更改成功');
                       window.location.href = '/html/shop-check/index.html#/audited/';
                       // _this.getShopDetail();
                    }
                    else{
                        var mes = responce.body.message;
                        mes = mes ==  undefined ? '保存更改失败' : mes; 
                        _this.$Message.error(mes);
                    }
                });
            },
            close: function () { //关闭框
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '你是否要关闭此店铺？',
                    okText: '关闭',
                    onOk: function () {
                        _this.closed ()
                    }
                });
            },
            closed () {
                var _this = this;
                _this.$http({
                    url: '/shop/handle/close',
                    body: _this.closedparams,
                    header: 'application/json',
                }).then(responce => {
                    if (responce.body.code == 0) {
                       _this.$Message.success('店铺关闭成功');
                       window.location.href = '/html/shop-check/index.html#/audited/';
                    }
                    else{
                        var mes = responce.body.message;
                        mes = mes ==  undefined ? '店铺关闭失败' : mes; 
                        _this.$Message.error(mes);
                    }
                });
            },
            delMember: function (index,row) {
                var _this = this;
                this.$Modal.confirm({
                    title: '提示',
                    content: '你是否要从店铺中删除该成员？',
                    okText: '删除',
                    onOk: function () {
                        _this.removeMember(index,row)
                    }
                });
            },
            removeMember (index,row) {
                var _this = this;
                _this.delparasm.shId = row.shId;
                _this.delparasm.shopId = row.shopId;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/del.json',
                    method: 'POST',
                    url: '/shop/member/del',
                    body: _this.delparasm,
                    header: 'application/json'
                }).then (response => {
                    if (response.body.code == 0) {
                        _this.$Message.success('成员删除成功');
                        _this.getMember();
                    }
                })
            },
            getMember () {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    // url: './mock/chenyuan.json',
                    url: '/shop/member',
                    body: _this.memberparams,
                    header: 'application/json'
                }).then( response => {
                    if (response.body.code == 0) {
                        var memberData = response.body.data;
                        for (var i in memberData) {
                            if (memberData[i].laoBanHao != 0) {
                               memberData[i] = Object.assign(memberData[i], {'operate': '删除成员'});
                            };
                            if (memberData[i].laoBanHao == 0) {
                                memberData[i] = Object.assign(memberData[i], {'role': '老板'});
                            }
                            else if (memberData[i].laoBanHao == 1) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '库管'});
                            }
                            else if (memberData[i].laoBanHao == 2) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '接单员'});
                            }
                            else if (memberData[i].laoBanHao == 3) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '小老板(合作伙伴)'});
                            }
                            else if (memberData[i].laoBanHao ==4 ) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '普通员工'});
                            };
                        };
                        _this.td = memberData;
                    };
                });
            },
            getOnedetal () {
<<<<<<< HEAD
            var _this = this;
            _this.$http({
                // method: 'GET',
                // url: './mock/yipi.json',
                method: 'POST',
                url: '/shop/handle/preInfo2',
                body: _this.OneDetail,
                header: 'application/json'
            }).then(responce => {
                if (responce.body.code == 0) {
                    _this.OneDetailData = responce.body.data;
                }
            });
        },
        pianquChange (e) {
            var _this = this;
            for (var i in  _this.marketList1){
                if (e == _this.marketList1[i].pianquId) {
                    _this.SPdetail.pianqu_name = _this.marketList1[i].pianqu;
                }
            }
            this.OneDetail.id = e;
            this.getOnedetal();
        },
            getShopDetail (resolve) {  //获得店铺详情
            var hash = location.hash,
             Idnum =parseInt(hash.split('=')[1]),
             _this = this;
             _this.shopDetailparams.shopId =Idnum;
             _this.memberparams.shopId =Idnum;
             _this.closedparams.shopId =Idnum;
             _this.$http({
                // method: 'GET',
                // url: './mock/shopdetail.json',
                // data: _this.shopDetailparams,
                method: 'POST',
                url: '/shop/handle/show',
                body: _this.shopDetailparams,
                header: 'application/json'
             }).then(responce => {
                if (responce.body.code == 0) {
                    resolve('ok');
                    _this.SPdetail = responce.body.data[0];
                    _this.trenchnum =  _this.SPdetail.trenchnum;
                    _this.imgpath = 'http://img.idongpin.com/'+_this.SPdetail.cardPic;
                    _this.OneDetail.id = responce.body.data[0].pianquId;
                    _this.getOnedetal();
                    _this.SPdetail.province_id = _this.SPdetail.province_id.toString();
                    if (_this.SPdetail.trenchnum != 11) {
                        // _this.SPdetail.pianquId = 0;
                        // delete _this.SPdetail.pianqu_name;
                        // delete _this.SPdetail.grounds;
                        // delete _this.SPdetail.pianqu_province_id;
                        // delete _this.SPdetail.zhuceTime;
                        _this.NotOneparams.type = _this.SPdetail.trenchnum;
                        _this.show = false;
=======
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/yipi.json',
                    method: 'POST',
                    url: '/shop/handle/preInfo2',
                    body: _this.OneDetail,
                    header: 'application/json'
                }).then(responce => {
                    if (responce.body.code == 0) {
                        _this.OneDetailData = responce.body.data;
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
                    }
                });
            },
<<<<<<< HEAD
            getOneData () {
=======
<<<<<<< HEAD
            getOneData (resolve) {
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
            var _this = this;
            _this.$http({
                // method: 'GET',
                // url: './mock/yiqushichang.json',
                // data: _this.Oneparams,
                method: 'POST',
                url: '/shop/handle/preInfo1',
                body: _this.Oneparams,
                header: 'application/json'
            }).then(responce => {
                if (responce.body.code == 0) {
                  
                    _this.provinceList1 = responce.body.data.provinceArr;
                    _this.pianqu = responce.body.data.pianquArr;
                for (var item in _this.pianqu) {
                    if(item == _this.SPdetail.province_id) {
                        _this.marketList1 = _this.pianqu[item];
                    };
                };
                }
            });
            _this.$http({ //获得非一批省市县
                // method: 'GET',
                // url: './mock/shengshixian.json',
                method: 'POST',
                url: '/shop/handle/preInfo1',
                body: _this.NotOneparams,
                header: 'application/json'
            }).then( responce => {
                if (responce.body.code == 0) {
<<<<<<< HEAD
                 
=======
<<<<<<< HEAD
                    resolve('ok');
=======
                 
>>>>>>> 6a8841d7c211541f5098ce4f531993b4520dde61
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
                    _this.provinceList2 = responce.body.data.provinceArr;
                    _this.city = responce.body.data.cityArr;
                    _this.county = responce .body.data.countyArr;
                    for (var item in _this.city) {
                        if (item == _this.SPdetail.province_id) {
                            _this.provinceItem = item;
                            _this.cityList1 = _this.city[item];
                            for (var item in _this.cityList1) {
                                if (_this.SPdetail.city ==  _this.cityList1[item]) {
                                    _this.cityItem = item;
=======
            pianquChange (e) {
                var _this = this;
                for (var i in  _this.marketList1){
                    if (e == _this.marketList1[i].pianquId) {
                        _this.SPdetail.pianqu_name = _this.marketList1[i].pianqu;
                    }
                }
                this.OneDetail.id = e;
                this.getOnedetal();
            },
                getShopDetail (resolve) {  //获得店铺详情
                var hash = location.hash,
                Idnum =parseInt(hash.split('=')[1]),
                _this = this;
                _this.shopDetailparams.shopId =Idnum;
                _this.addparams.shop_id = Idnum;
                _this.memberparams.shopId =Idnum;
                _this.closedparams.shopId =Idnum;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/shopdetail.json',
                    // data: _this.shopDetailparams,
                    method: 'POST',
                    url: '/shop/handle/show',
                    body: _this.shopDetailparams,
                    header: 'application/json'
                }).then(responce => {
                    if (responce.body.code == 0) {
                        resolve('ok');
                        _this.SPdetail = responce.body.data[0];
                        _this.trenchnum =  _this.SPdetail.trenchnum;
                        _this.imgpath = 'http://img.idongpin.com/'+_this.SPdetail.cardPic;
                        _this.OneDetail.id = responce.body.data[0].pianquId;
                        _this.getOnedetal();
                        _this.SPdetail.province_id = _this.SPdetail.province_id.toString();
                        if (_this.SPdetail.trenchnum != 11) {
                            // _this.SPdetail.pianquId = 0;
                            // delete _this.SPdetail.pianqu_name;
                            // delete _this.SPdetail.grounds;
                            // delete _this.SPdetail.pianqu_province_id;
                            // delete _this.SPdetail.zhuceTime;
                            _this.NotOneparams.type = _this.SPdetail.trenchnum;
                            _this.show = false;
                        }
                        else{ _this.OneDetail.id = _this.SPdetail.pianquId;_this.getOnedetal();_this.getOneData();}
                    };
                })
                },
                getOneData () {
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/yiqushichang.json',
                    // data: _this.Oneparams,
                    method: 'POST',
                    url: '/shop/handle/preInfo1',
                    body: _this.Oneparams,
                    header: 'application/json'
                }).then(responce => {
                    if (responce.body.code == 0) {
                    
                        _this.provinceList1 = responce.body.data.provinceArr;
                        _this.pianqu = responce.body.data.pianquArr;
                    for (var item in _this.pianqu) {
                        if(item == _this.SPdetail.province_id) {
                            _this.marketList1 = _this.pianqu[item];
                        };
                    };
                    }
                });
                _this.$http({ //获得非一批省市县
                    // method: 'GET',
                    // url: './mock/shengshixian.json',
                    method: 'POST',
                    url: '/shop/handle/preInfo1',
                    body: _this.NotOneparams,
                    header: 'application/json'
                }).then( responce => {
                    if (responce.body.code == 0) {
                    
                        _this.provinceList2 = responce.body.data.provinceArr;
                        _this.city = responce.body.data.cityArr;
                        _this.county = responce .body.data.countyArr;
                        for (var item in _this.city) {
                            if (item == _this.SPdetail.province_id) {
                                _this.provinceItem = item;
                                _this.cityList1 = _this.city[item];
                                for (var item in _this.cityList1) {
                                    if (_this.SPdetail.city ==  _this.cityList1[item]) {
                                        _this.cityItem = item;
                                }
                                }
>>>>>>> evaluate
                            }
                        };
                        // 级联县
                        for (var item in _this.county) {
                            if (item == _this.provinceItem) {
                                _this.countyList = _this.county[item][_this.cityItem]
                            }
                        }
                    }
                })
            },
            provinceChange (e) { //一批市级联
                var _this = this;
                if (_this.trenchnum == 11) {
                        for (var i in _this.provinceList1) {
                        if (e == _this.provinceList1[i].provinceidtxt) {
                        _this.SPdetail.province = _this.provinceList2[i].dividename;
                        _this.SPdetail.pianqu_province_id = _this.provinceList1[i].provinceidtxt;
                        };
                        };
                    for (var item in _this.pianqu) {
                        if(item == e) {
                            _this.marketList1 = _this.pianqu[item];
                        };
                    };
                }
                else {
                    for (var i in _this.provinceList2) {
                        if (e == _this.provinceList2[i].provinceidtxt) {
                        _this.SPdetail.province = _this.provinceList2[i].dividename;
                        }
                    }
                    for (var item in _this.city) {
                    if(item == e) {
                        _this.provinceItem = e;
                        _this.cityList1 = _this.city[item];
                    }
                    _this.countyList = [];
                }
                }
            },
            cityChange (e) {
                var _this = this;
                for (var item in _this.cityList1) {
                    if (e == _this.cityList1[item]) {
                        _this.SPdetail.city_id = item;
                        _this.cityItem = item;
                    }
                };
                for (var item in _this.county) {
                    if (_this.provinceItem == item) {
                        _this.countyList = _this.county[_this.provinceItem][_this.cityItem];
                    }
                }
            },
            countyChange (e) {
                var _this = this;
                for (var i in _this.countyList) {
                    if (e == _this.county_id[i]) {
                        _this.SPdetail.county_id = i;
                    }
                }
            },
            addmember (rules){
                var vm = this;
                this.$refs[rules].validate((valid)=>{
                    if(valid){
                        vm.sureAdd ();
                    }
                    else{
                        this.$Message.error('表单信息填写完整!');
                    }
                })
            },
            sureAdd (){
                var vm = this;
                vm.$http({
                    url: '/shop/member/add',
                    method: 'POST',
                    body: vm.addparams,
                    header: 'application/json'
                }).then(responce => {
                    if (responce.body.code == 0){
                        vm.$Message.success({
                            content: '成员添加成功',
                            duration: 1
                        });
                        vm.is_addmember = false;
                    }
                    else{
                        var mes = responce.body.message;
                        vm.$Message.error({
                            content: mes,
                            duration: 1
                        });
                    }
                })
            },
            roleChange (){
                this.mateCode();
            },
            mateCode (){
                var vm = this;
                vm.$http({
                    method: 'GET',
                    url: '/shop/member/add_code',
                    params: vm.addparams,
                    header: 'application/json'
                }).then(responce => {
                    if(responce.body.code == 0){
                        vm.codeImg = responce.body.data.img_code_url;
                    }
                });
            },
            getRole () {
                var vm = this;
                vm.$http({
                    url: '/shop/member/role',
                    method: 'GET',
                    header: 'application/json'
                }).then(responce => {
                    if(responce.body.code == 0){
                        vm.roleList = responce.body.data;
                    }
                })
            },
            mateCodeImg (){
                    var range = document.createRange(); 
                    range.selectNode(document.getElementById('codeImg'));  
                    window.getSelection().addRange(range); 
                    document.execCommand("Copy");  
                    // console.log(document.execCommand('Copy'));
                    this.$Message.success({
                        content: '图片已复制',
                        duration: 1
                    })
            }
        },
        created () {
            var _this = this;
            new Promise(function(resolve){
<<<<<<< HEAD
                _this.getShopDetail(resolve);
            }).then(function(){
                _this.getOneData();
=======
<<<<<<< HEAD
                _this.getOneData(resolve);
            }).then(function(){
                _this.getShopDetail();
=======
                _this.getShopDetail(resolve);
            }).then(function(){
                _this.getOneData();
<<<<<<< HEAD
>>>>>>> 6a8841d7c211541f5098ce4f531993b4520dde61
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
                _this.getMember();
=======
>>>>>>> evaluate
            });
            _this.getMember();
            _this.getRole();
            _this.mateCode();
        }
    };
</script>
<style lang="less" scoped>
    .addCard{position: fixed;top: 40%;left: 40%;width: 350px;text-align: center;z-index: 10;}
    .codeImg{width: 150px;height: 150px;}
</style>
