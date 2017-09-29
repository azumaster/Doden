<template>
    <div class="layout-inner">
        <div class="page-operate">
            <Button type="text" icon="ios-arrow-back" @click="back">返回</Button>
            <p class="inner-title">审核店铺</p>
        </div>
        <div class="operate">
            <Button type="primary" size="large" @click="pass" style="margin-right: 30px">通过审核</Button>
        </div>
        <div class="layout-body form">
            <Form  :label-width="80">
                <Form-item label="注册电话">{{SPdetail.lianxiTel}}</Form-item>
                <Form-item label="店铺名称">
                    <Input v-model="SPdetail.dianPuName" placeholder="请输入店铺名称"></Input>
                </Form-item>
                <Form-item label="姓名">
                    <Input v-model="SPdetail.xingming" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="店铺类型">
                    <Row>
                        <Col span="11"><Select style="width:200px"  v-model="SPdetail.trenchnum" @on-change="typeChange">
                            <Option v-for="item in shopType" :value="item.id" :key="item" placeholder="请选择
                            店铺类型">{{ item.name }}</Option>
                        </Select></Col>
                        <Col span="3" style="text-align: center" >微信分组</Col>
                        <Col span="10"><Select style="width:200px" v-model="SPdetail.weChatGroupId">
                            <Option v-for="item in wechatGroup" :value="item.id" :key="item" placeholder="请选择
                            微信分组">{{ item.name }}</Option>
                        </Select></Col>
                    </Row>
                </Form-item>
                <Form-item label="所属市场" v-if="show">
                    <Select v-model="SPdetail.province_id" style="width:200px" @on-change="provinceChange">
                        <Option v-for="item in provinceList1" :value="item.provinceidtxt"  :key="item">{{ item.dividename }}</Option>
                    </Select>
                    <Select v-model="SPdetail.pianquId" style="width:200px" @on-change="pianquChange">
                        <Option v-for="item in marketList1" :value="item.pianquId" :key="item">{{ item.pianqu }}</Option>
                    </Select>
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
        <Modal v-model="refused" title="提示" >
            <Form :model="refuseForm" label-position="top" :rules="refuseRule">
                <Form-item label="请输入拒绝理由" prop="refuse">
                    <Input v-model="refuseForm.refuseInfo" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="不超过40个字"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>

<script>
    // import down from './../../../components/select.vue';
    import Base from './../../../common/base.js';
    export default {
        mixins: [Base],
        name: 'auditing',
        // components: {
        //     down
        // },
        data: function () {
            return {
                imgs:[],
                fd: null,
                path: '',
                show: true,
                module: 'waitAudit',
                refused: false,
                refuseForm: {
                    refuseInfo: ''
                },
                refuseRule: {
                    refuse: []
                },
                SPdetail: {},
                shopDetailparams: {
                    shopId:0
                },
                passparams: {
                    shopId:0,
                    shId: 0

                },
                NotOneparams: {
                    type: 21
                },
                Oneparams: {
                    type: 11
                },
                OneDetail: {
                    id: 0
                },
                OneDetailData: {},
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
                trenchnum: 0
            };
        },
        methods: {
            // back: function () {
            //     window.location.href = '/html/new-operate/index.html#/waitAudit';
            // },
            typeChange (e) {
                this.trenchnum = e;
                if (e != 11) {this.show = false;this.NotOneparams.type = e;this.SPdetail.pianquId=0;}
                else {this.show = true;this.getOnedetal();this.getOneData();}
            },
            pass: function () {
                var _this = this;
                _this.$Modal.confirm({
                    title: '提示',
                    content: '是否通过该店铺的审核？',
                    okText: '通过',
                    onOk: function () {
                        _this.passed();
                    }
                });
            },
            passed () {
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
                    header: 'application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.$http({
                        method: 'POST',
                        url: '/examine/pass',
                        body: _this.passparams,
                        header: 'application/json'
                }).then(response => {
                    if(response.body.code == 0) {
                        _this.$Message.success('店铺通过审核成功');
                         window.location.href = '/html/shop-check/index.html#/audited/';
                    }
                });
                    }
                    else{
                         var mes = response.body.message;
                        mes = mes ==  undefined ? '保存更改失败' : mes; 
                        _this.$Message.error(mes);
                    }
                });
            },
            getShopDetail (resolve) {  //获得店铺详情
            var hash = location.hash,
             Idnum =parseInt(hash.split('=')[1]),
             _this = this;
             _this.shopDetailparams.shopId =Idnum;
             _this.passparams.shopId = Idnum;
             _this.$http({
                // method: 'GET',
                // url: './mock/shopdetail.json',
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
                    _this.passparams.shId = responce.body.data[0].shId;
                    _this.SPdetail.province_id = _this.SPdetail.province_id.toString();
                    if (_this.SPdetail.trenchnum != 11) {
                           _this.NotOneparams.type = _this.SPdetail.trenchnum;
                        _this.show = false;
                    }
                    else {
                        _this.OneDetail.id = _this.SPdetail.pianquId;
                        _this.getOnedetal();_this.getOneData();
                    }
                };
             })
            },
            getOnedetal () {
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
                if (e == _this.cityList1[item]){_this.SPdetail.city_id = item; _this.cityItem = item;}
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
         // 获得一批市场
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
<<<<<<< HEAD
                  
=======
<<<<<<< HEAD
                    resolve('ok');
=======
                  
>>>>>>> 6a8841d7c211541f5098ce4f531993b4520dde61
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
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
                    _this.county = responce.body.data.countyArr;
                    for (var item in _this.city) {
                        if (item == _this.SPdetail.province_id) {
                            _this.provinceItem = item;
                            _this.cityList1 = _this.city[item];
                            for (var item in _this.cityList1) {
                                if (_this.SPdetail.city ==  _this.cityList1[item]) {
                                    _this.cityItem = item;
                            }
                            }
                        }
                    };
                    // 级联县
                    for (var item in _this.county) {
                        if (item == _this.provinceItem) {
                             _this.countyList = _this.county[item][_this.cityItem];
                        }
                    }
                }
            })
        },
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
>>>>>>> 6a8841d7c211541f5098ce4f531993b4520dde61
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
            });
        },

    };
</script>