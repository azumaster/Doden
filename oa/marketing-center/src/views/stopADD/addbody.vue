<template>
	<div style="margin-bottom: 20px;margin-top: 20px;">
		<Row>
		<!-- 网页右侧 -->
        <Col span="16" push="8">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:300px">
          <Form-item label="分类" prop="type_no">
              <Select v-model="formValidate.type_no">
                <Option v-for="item in addTicket" :value="item.type_no" :key="item">{{ item.name }}</Option>
            </Select>
          </Form-item>
        <Form-item label="标题" prop="title">
            <Input v-model="formValidate.title" type="string" placeholder="请输入兑换券标题"></Input>
        </Form-item>
        <Form-item label="消耗钻石" prop="price">
            <Input v-model="formValidate.price" type="number" placeholder="请输入消耗钻石"></Input>
        </Form-item>
        <Form-item label="兑换内容" prop="worth">
           <Input v-model="formValidate.worth" type="number" placeholder="请输入兑换内容">
               <span slot="append">天</span>
           </Input>
        </Form-item>
        <Form-item label="上架时间" prop="sell_time">
            <Date-picker  placeholder="选择上架时间" format="yyyy-MM-dd HH:mm:ss" @on-change="sell_timeChange" placement="right-end" v-model="formValidate.sell_time"></Date-picker>
        </Form-item>
        <Form-item label="下架时间" prop="end_time">
            <Date-picker  placeholder="选择下架时间" format="yyyy-MM-dd HH:mm:ss" @on-change="end_timeChange" placement="right-end" v-model="formValidate.end_time"></Date-picker>
        </Form-item>
        <Form-item>
        <!-- <Button type="primary" @click="getTicketInfos">新增</Button> -->
            <Button type="primary" @click="add2('formValidate')">新增</Button>
        </Form-item>
    </Form>
           
        </Col>
        <!-- 网页左侧上传图片栏 -->
        <Col span="8" pull="16">
<template>

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
</template>
        </Col>
    </Row>
	</div>
</template>
<script>
    let Base64 = require('js-base64').Base64;
    // import Localbase from '../../common/localbase.js';  //本地
    import Base from '../../common/base.js'; //线上
    export default {
        // mixins: [Localbase],
        mixins: [Base],
        data () {
            return {
                path: '',
                imgpath: '',
                imgs: [],
                formValidate: {
                    type_no: '',  //分类编号
                    title: '',  //标题
                    price: 0,  //兑换券出售价格
                    worth: 0,  //兑换券面值（兑换内容）
                    sell_time: '',
                    end_time: '',
                    image: ''
                },
                signature_data: {signature_data: ''},
                ruleValidate: {
                    sell_time: [{ required: true, message: '请选择上架时间', trigger: 'blur' }],
                    end_time: [{ required: true, message: '请选择下架时间', trigger: 'blur' }]
                }   
                
            };
        },
        methods: {
                previewImg (e) {

                    var reader =new FileReader();
                       var img1=e.target.files[0];
                       reader.readAsDataURL(img1);
                       var that=this;
                           reader.onloadend=function(){
                               that.imgs.push(reader.result)
                           };
                    var t=new Date();
                    var iToDay=t.getDate();
                    if (iToDay<10) iToDay= '0'+iToDay;
                    var iToMon=t.getMonth()+1;
                    if (iToMon<10) iToMon= '0'+iToMon;
                    var iToYear=t.getFullYear();
                    var today =iToYear+''+iToMon+''+iToDay;
                    var _this = this;
                    var img = e.target.files[0];
                    var type = e.target.dataset.type;
                    var suffix = img.name.substring(img.name.lastIndexOf('.')+1).toLowerCase();
                    var allowSuffix = '.jpg,.gif,.png,.jpeg';
                    var path = 'Public/Uploads/card/'+ today +'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10000)+'.'+ suffix;
                    _this.path = path;
                    _this.formValidate.image ='/'+path;
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
                                            fd.append('file', img);  //需上传的文件对像;
                                             _this.path = path;
                                            var xhr = new XMLHttpRequest();
                                            xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                                            xhr.send(fd);
                                        }
                                    })
                                }
                            })
            },
            sell_timeChange (e) {
               this.formValidate.sell_time = e;
            },
            end_timeChange (e) {
                this.formValidate.end_time = e;
            },
            getTicketInfos(){
                var ticketInfos = this.getCookie('ticketInfos');
                ticketInfos = JSON.parse(ticketInfos);
                this.formValidate = ticketInfos;
                this.imgpath = 'http://img.idongpin.com'+ ticketInfos.image;
            },
            getCookie (cookieName) {
                var strCookie = document.cookie;
                var arrCookie = strCookie.split("; ");
                for(var i = 0; i < arrCookie.length; i++){
                    var arr = arrCookie[i].split("=");
                    if(cookieName == arr[0]){
                        return arr[1];
                    }
                }
                return "";
            },
            add2 (name) {  //新增兑换券
                var _this = this;
                _this.$refs[name].validate((valid) => {
                    if (valid) {
                        _this.$http({
                    method: 'POST',
                    url: '/marketing/exchange-ticket/add',
                    body: _this.formValidate,
                    header: 'application/json'
                }).then( response => {
                    if (response.body.code == 0) {
                        _this.$Modal.success({
                            title: '    ',
                            content: '兑换券新增成功'
                        });
                         _this.formValidate = {};
                         _this.$refs[name].resetFields();
                    }
                    else {
                        _this.$Modal.error({
                            title: '    ',
                            content: '兑换券新增失败'
                        });
                    }
                });
                    }
                    else {
                        this.$Message.error('请将表单填写完整!');
                    }
                });
            },
        },
       created () {
        this.getTicketList2();
        this.getTicketInfos();
       }
    }
</script>
<style scoped>
    .room_img{
     width: 200px;
     height: 200px;
     margin-right: 10px;
     position: absolute;
     overflow: hidden;
   }
   #img img {
    border: 1px solid #2DB7F5;
    width: 200px;
     height: 200px;
   }
   .btn{position: relative;}
    .ipt {
        position: absolute;
        top: 1px;
        left: 1px;
        border:none;
        width: 100px;
        height: 50px;
        opacity: 0;
    }
</style>
