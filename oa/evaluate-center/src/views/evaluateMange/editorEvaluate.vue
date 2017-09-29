<template>
    <div id="deleteEvaluate">
        <div class="page-operate">
            <Button type="text" icon="ios-arrow-back" @click="back">返回</Button>
            <p class="inner-title">编辑评价</p>
        </div>
        <Button type="info" @click="save">保存评价</Button>
        <div class="context" v-for="item in goodsdata">
            
            <div class="good goodhead"><p><b>商品名称</b><span>{{item.name}}</span></p><p>数量价格{{item.buy_num}}*{{item.good_new_price}} = {{item.count_price}}</p></div>
            <div class="good" @click="qualityChange2(item.id)">
                <Radio-group v-model="item.quality" @on-change="qualityChange">
                    <Radio label=5>好评</Radio>
                    <Radio label=3>中评</Radio>
                    <Radio label=1>差评</Radio>
                </Radio-group>
            </div>
            <div class="good"><Input @on-blur="iptChange(item.id)" v-model="item.content" type="textarea"  :rows="4" placeholder="请输入..."></Input></div>
            <div class="imgbox">
                <div v-for="it in item.img" class="po_re">
                    <img class="img" :class="it.img_url" :src="'http://img.idongpin.com/'+it.img_url"/>
                     <Button class="deleteBtn" :class="it.img_url" type="primary" shape="circle" icon="close" @click="deleteImg(it.img_url, item.id)"></Button>
                </div>
                <template>
                <div  :id="item.id" style="width:100%;display:inline-flex;">

                </div>
                    
                </template>
            </div>
            <div class="btn" @click="imgChange(item.id)">
                        <Button type="info" >图片上传</Button>
                        <input class="ipt" v-if="is_Can" type="file"  @change="previewImg"/>
             </div>
        </div>
        <div class="good shopevaluate">
            <p class="good">店铺评价</p>
            <div class="good">
                 <Radio-group v-model="uploadParams.shop_appraises.delivery_speed">
                    <Radio label=1>龟速</Radio>
                    <Radio label=2>较慢</Radio>
                    <Radio label=3>一般</Radio>
                    <Radio label=4>及时</Radio>
                    <Radio label=5>神速</Radio>
                </Radio-group>
            </div>
            <div class="good">
                 <Radio-group v-model="uploadParams.shop_appraises.sell_service">
                    <Radio label=1>恶劣</Radio>
                    <Radio label=2>冷淡</Radio>
                    <Radio label=3>一般</Radio>
                    <Radio label=4>友善</Radio>
                    <Radio label=5>热情</Radio>
                </Radio-group>
            </div>
        </div>
    </div>
</template>

<script>
let Base64 = require('js-base64').Base64;
export default {
    name: 'editorEvaluate',
    data () {
        return {
            imgs: [],
            goodsName: '牛前',
            goodsNum: 1,
            goodsPrice: 130,
            total: 130,
            evaluatevalue: '卖家服务态度不好',
            shopspeed: 2,
            shopattitude: 3,
            params: {orderIds: 123},
            data: {},
            shopdata: {},
            goodsdata: {},
            signature_data: {signature_data: ''},
            ImgNum: 0, //图片张数
            uploadParams: {sub_order_no: '', shop_appraises:{sell_service: 0, delivery_speed: 0} ,goods_appraises: []},
            is_Can: true, //能否上传
            localimg: null, //本地删除图片的角标
            localbtn: null,
            imgfile: null,
            localPath: [],
            localindex: 0, //本地上传的那张图
            idbox:0  //判断当前点击的是那个DIV
        }
    },
    methods: {
        back () {
            window.location.href = '/html/evaluate-center/index.html#/evaluateMain'
        },
        imgChange (e) {
            this.idbox = e;
            for (var i in this.uploadParams.goods_appraises){
                if (this.idbox == this.uploadParams.goods_appraises[i].id) {
                    this.ImgNum = this.uploadParams.goods_appraises[i].pictures.length;
                    if(this.ImgNum == 5) {
                        this.$Message.warning({
                        content: '每个商品最多上传5张图',
                        duration: 10,
                        closable: true
                        });
                    }
                }
            }
        },
        qualityChange2 (e) {
             this.idbox = e;
        },
        save () {
            var vm = this;
            vm.$http({
                url: '/shop/handle/appraise/update_appraise',
                method: 'POST',
                body: vm.uploadParams,
                header: 'application/json'
            }).then(responce => {
                if(responce.body.code == 0){
                    vm.$Message.success({
                        content: '保存成功',
                        duration: 1
                    });
                    setTimeout(function(){
                         window.location.href = '/html/evaluate-center/index.html#/evaluateMain';
                    },1050);
                }
                else{
                    var mes = responce.body.message;
                    vm.$Message.error({
                        content: mes,
                        duration: 1
                    });
                }
            });
        },
        iptChange (e) {
           for(var i in this.uploadParams.goods_appraises){
               if(this.uploadParams.goods_appraises[i].id == e) {
                   this.uploadParams.goods_appraises[i].content = this.goodsdata[i].content;
               }
           }
        },
        deleteImg(url, id){
            // console.log(url, id);
            var nowImg = 0;
            for(var i in this.uploadParams.goods_appraises){
                if (id == this.uploadParams.goods_appraises[i].id){
                    nowImg = i;
                }
            }
            for(var e in this.uploadParams.goods_appraises[nowImg].pictures){
                if(url == this.uploadParams.goods_appraises[nowImg].pictures[e].img_url){
                   this.uploadParams.goods_appraises[nowImg].pictures.splice(e, 1);
                }
            }
            for(var k in document.getElementsByClassName(url)){
                document.getElementsByClassName(url)[k].style.display = 'none';
            }
        },
        qualityChange (e) {
            for(var i in this.uploadParams.goods_appraises) {
                if (this.idbox == this.uploadParams.goods_appraises[i].id){
                    this.uploadParams.goods_appraises[i].quality = e;
                }
            }
        },
        previewImg (e) {
            //判断图片是否有五张
            this.imgfile = e;
            if(this.ImgNum == 5) {
                return;
            }
            var _this = this;
            var reader =new FileReader();
            var img1=e.target.files[0];
            reader.readAsDataURL(img1);
            var _this = this;
            var t=new Date();
            var iToDay=t.getDate();
            if (iToDay<10) iToDay= '0'+iToDay;
            var iToMon=t.getMonth()+1;
            if (iToMon<10) iToMon= '0'+iToMon;
            var iToYear=t.getFullYear();
            var today =iToYear+''+iToMon+''+iToDay;
            var e = _this.imgfile;
            var img = e.target.files[0];
            var type = e.target.dataset.type;
            var suffix = img.name.substring(img.name.lastIndexOf('.')+1).toLowerCase();
            var allowSuffix = '.jpg,.gif,.png,.jpeg';
            var path = 'Public/Uploads/evaluateImg/'+ today +'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10000)+'.'+ suffix;
            var box = document.getElementById(this.idbox);
            reader.onloadend=function(){
                    var imgNum =  _this.imgs.length; //先判断最开始的图片数量
                   _this.imgs.push(reader.result);
                    for (var i = imgNum; i<_this.imgs.length; i++) {
                    var img = document.createElement('img');
                    var miniimgBox = document.createElement('div');
                    miniimgBox.setAttribute('style', 'position: relative;margin-right:20px;');
                    img.setAttribute('src', _this.imgs[i]);
                    img.setAttribute('style', 'width:200px;height:200px;border:1px solid #2DB7F5;margin-right:20px;');
                    miniimgBox.appendChild(img);
                    var btn = document.createElement('button');
                    if(window.addEventListener) {
                        btn.addEventListener('click',  function () {_this.localdeleteImg(miniimgBox,path)},false)
                    }
                    else{
                        btn.attachEvent('onclick',  function () {_this.localdeleteImg(miniimgBox,path)})
                    }
                    btn.innerText = '×';
                    btn.setAttribute('style', 'width:32px;height:32px;border:1px solid #2DB7F5;margin-right:20px;position: absolute;right: -20px;border-radius: 32px; background: #2d8cf0;font-size: 28px;color: #fff;line-height: 32px;');
                    miniimgBox.appendChild(btn);
                    box.appendChild(miniimgBox);
                }
            };
            
                     //根据点击的商品的ID提交修改商品的图片
            for (var i in _this.uploadParams.goods_appraises){
                        if (_this.idbox == _this.uploadParams.goods_appraises[i].id) {
                            var imgPath = {img_url: path};
                            _this.uploadParams.goods_appraises[i].pictures.push(imgPath);
                            _this.localPath = path;
                        }
                    }
            if(allowSuffix.indexOf(suffix) == -1) {
                        _this.$Message.error('仅支持'+allowSuffix+'为后缀名的文件!');
                    return ;
            };
                    var POLICY_JSON = {
                    'expiration': '2120-12-01T12:00:00.000Z',
                    'conditions': [
                        ['starts-with', path, ''],
                        {'bucket': 'idongpin'},
                        ['starts-with', img.type, ''],
                        ['content-length-range', 0, 104857600]
                        ]
                    };
                        _this.signature_data.signature_data = Base64.encode(JSON.stringify(POLICY_JSON));
                            _this.$http({
                                method: 'GET',
                                url: '/other/oss/signature',
                                params: _this.signature_data,
                                header: 'application/json'
                            }).then(responce => {
                                if (responce.body.code == 0) {
                                    var signature = responce.body.data.signature;
                                    _this.$http({
                                        method: 'GET',
                                        url: '/other/oss/identity/data',
                                        params: {},
                                        header: 'application/json'
                                    }).then( responce => {
                                        if (responce.body.code ==0 ) {
                                            var access_id = responce.body.data.access_id;
                                            var fd = new FormData();
                                            fd.append('key', path);  //上传到的路径信息;
                                            fd.append('Content-Type', img.type);  //文件类型;
                                            fd.append('Content-Length', Math.round(img.size * 100 / 1024) / 100);  //文件大小KB;
                                            fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
                                            fd.append('OSSAccessKeyId', access_id);
                                            fd.append('policy',  _this.signature_data.signature_data);  //参与签名的头信息;
                                            fd.append('signature', signature);  //签名;
                                            fd.append('file', img);  //需上传的文件对像
                                            _this.path = path;
                                            var xhr = new XMLHttpRequest();
                                            xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                                            xhr.send(fd);
                                        }
                                    })
                                }
                            })       
                    
            },
        getOrderDetail () {
            req.getOrder(this, this.params, (res) => {
                if(res.code == 0) {
                    this.shopdata = res.data.shop_appraise;
                    this.goodsdata = res.data.goods_appraise;
                    this.uploadParams.shop_appraises.sell_service = this.shopdata.sell_service;
                    this.uploadParams.shop_appraises.delivery_speed = this.shopdata.delivery_speed;
                    for (var i in this.goodsdata) {
                        var goodsItem = {appraise_id: this.goodsdata[i].appraise_id, id: this.goodsdata[i].id ,quality: this.goodsdata[i].quality,content: this.goodsdata[i].content, 
                        pictures: JSON.parse(JSON.stringify(this.goodsdata[i].img))}
                        this.uploadParams.goods_appraises.push(goodsItem);
                    }
                    for (var i in this.goodsdata) {
                        if (this.goodsdata[i].quality == 3|| this.goodsdata[i].quality == 4) this.goodsdata[i].quality = 3;
                        else if (this.goodsdata[i].quality == 2|| this.goodsdata[i].quality == 1) this.goodsdata[i].quality = 1;
                    }
                }
            });
        },
        localdeleteImg (id,path){
            console.log(path,this.uploadParams.goods_appraises);
            id.style.display = 'none';
            for (var i in this.uploadParams.goods_appraises) {
                if (this.uploadParams.goods_appraises[i].id == this.idbox) {
                    var index = i;
                    for (var k in this.uploadParams.goods_appraises[index].pictures) {
                        if (this.uploadParams.goods_appraises[index].pictures[k].img_url == path) {
                            this.uploadParams.goods_appraises[index].pictures.splice(k,1);
                            console.log(this.uploadParams.goods_appraises[index])
                        }
                    }
                }
            }
        }
    },
    created () {
        this.uploadParams.sub_order_no = this.$store.state.orderIds;
        this.params.orderIds = this.$store.state.orderIds;
        this.getOrderDetail ();
    }
}
</script>
<style lang="less" scoped>
    #deleteEvaluate {
        .page-operate{
            display: flex;
            p{line-height: 32px;padding-left: 10px;}
        }
        .context {
            padding: 20px 0;
            padding-right: 35%;
            .good {padding: 20px 0;}
            .goodhead {
                display: flex;
                justify-content: space-between;
            }
        }
        .imgbox{display: flex;}
        .img{width: 200px;height: 200px;border: 1px solid #2DB7F5; margin-right: 20px;}
        .room_img{
            width: auto;
            height: 200px;
            margin-right: 10px;
            position: absolute;
            overflow: hidden;
            display: inline-flex;
            img {margin-right: 20px;}
   }
   .btn{position: relative;margin-top: 20px;}
    .ipt {
        position: absolute;
        top: 1px;
        left: 1px;
        border:none;
        width: 100px;
        height: 50px;
        opacity: 0;
    }
    .po_re{position: relative;margin-right: 20px;
        .deleteBtn{position: absolute;right: 0;top: 0;
            .ivu-tag-text{visibility: hidden !important;}
        }
    }
    }
</style>
