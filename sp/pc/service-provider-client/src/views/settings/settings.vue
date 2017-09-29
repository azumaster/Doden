<template>
	<div id="setting">
		<Tabs value="setting">
			<Tab-pane label="店铺信息设置" name="setting">
				<div class="marginl">
					<template>
						<Form :model="formItem" :label-width="100" label-position="left">
							<Form-item label="店铺名">
								<Input placeholder="请输入" v-model="formItem.shop_name"></Input>
							</Form-item>
							<Form-item label="联系电话">
								<Input placeholder="请输入" v-model="formItem.mobile"></Input>
							</Form-item>
							<Form-item label="店铺地址">
								<Row>
	
									<Select placeholder="请选择" style="width: 155px" v-model="formItem.province_id" @on-change="provinceChange">
										<Option v-for="item in province" :value="item.id" :key="item">{{item.name}}</Option>
									</Select>
	
									<Select placeholder="请选择" style="width: 155px" v-model="formItem.city_id" @on-change="cityChange">
										<Option v-for="item in city" :value="item.id" :key="item">{{item.name}}</Option>
	
									</Select>
	
									<Select placeholder="请选择" style="width: 155px" v-model="formItem.county_id">
										<Option v-for="item in conty" :value="item.id" :key="item">{{item.name}}</Option>
									</Select>
	
								</Row>
								<Row>
									<Col span="18">
									<Input v-model="formItem.address" type="text" placeholder="请输入..."></Input>
									</Col>
								</Row>
							</Form-item>
							<Form-item label="服务区域">
								<span class="district" v-for="server in formItem.service_area">{{server}} </span>
							</Form-item>
						</Form>
						<template>
							<div class="center">
								<p>店铺照片</p>
								<img :src="'http://img.dongpin.me/'+formItem.avatar" class="img" ref="img" v-if="this.$store.state.editor.cropdiv"/>
								<img :src="this.$store.state.editor.imgbase64" class="img" ref="img" v-if="!this.$store.state.editor.cropdiv"/>
								<div class="uploadbar"  v-if="this.$store.state.editor.cropinit">
									<header  style="height: 53px; text-align: center;line-height: 53px; color: #737373; position: fixed;bottom: 40px;left: 30%;    z-index: 10000; " >
									<!-- <span>编辑门店照片</span> -->
								      <navbar @change="change"></navbar>
								    </header>
								    <main  style="background: rgba(255,255,255,.5); position: absolute; left:0; right: 0; top:50px; bottom: 0;">
								      <div style="max-width: 600px;margin:5pt auto 0">
									      <editor ref="editor" v-if="$store.state.loader.loaded"></editor>
								      </div>
								    </main>
								</div>
								<div class="btndiv">
								<Button type="primary" class="virtualBtn">上传照片</Button>
									<loader ref="loader"></loader>
								</div>
							</div>
						</template>
						<div class="txt">
							<div class="flexbox">
								<p>店铺介绍</p>
								<Input type="textarea" v-model="formItem.introduction" @on-focus="leavetxt1Change" @on-blur="leavetxt1blur" placeholder="店铺介绍会展示在“联系店铺”，向客户介绍您的店铺信息。"></Input>
								<span class="leavetxt1 leavetxt">{{leavetxt1}}</span>
							</div>
							<div class="flexbox">
								<p>配送说明</p>
								<span class="leavetxt2 leavetxt">{{leavetxt2}}</span>
								<Input type="textarea" v-model="formItem.delivery_remark" @on-focus="leavetxt2Change" @on-blur="leavetxt2blur" placeholder="配送说明会展示在“联系店铺”和“确认订单”中，向客户介绍你的配送规则。(如：早上9点到下午5点下单，当天配送。5点以后下单，第二天配送。)"></Input>
							</div>
						</div>
						<Button type="primary" @click="saveInfo">保存</Button>
						<Button type="primary" @click="preview">预览</Button>
					</template>
				</div>
			</Tab-pane>
		</Tabs>
		<div class="previewmask" v-if="is_preview">
			<div class="previewcss" >
				<div class="previewinfo">
				 <Button type="primary" shape="circle" class="closebtn" icon="close" @click="closediv"></Button>
					<img class="preview_img" :src="formItem.avatar" v-if="!this.$store.state.editor.cropdiv">
					<img class="preview_img" :src="'http://img.dongpin.me/'+formItem.avatar" v-if="this.$store.state.editor.cropdiv">
					<p class="dianpu">店铺联系方式</p>
					<p class="dianpu dianpu_add"><Icon type="location"></Icon><span>{{formItem.address}}</span></p>
					<p class="dianpu dianpu_add"><Icon type="ios-telephone"></Icon><span>{{formItem.mobile}}</span></p>
					<p class="dianpu">店铺介绍</p>
					<p class="dianpu_jieshao">{{formItem.introduction}}</p>
					<p class="dianpu">配送说明</p>
					<p class="dianpu_peisong">{{formItem.delivery_remark}}</p>
					<p class="orangebtn"></p>
				</div>
			</div>
			</div>
			<Footer></Footer>
	</div>
</template>
<script>
// import VueCoreImageUpload from 'vue-core-image-upload';
import Footer from './../../components/footer.vue';
// import Cropper from 'cropperjs';
export default {
	components: {Footer},
	data() {
		return {
			iscropipt: true,
			formItem: {},
			leavetxt1: 100,
			leavetxt2: 40,
			province: [],
			city: [],
			conty: [],
			cityparams: { id: 0 },
			shopName: '',
			data: {},
			set: null,
			set2: null,
			is_preview: false,
			withoutpic: ''
		}
	},
	methods: {
		shangchuanPic () {
			this.$store.state.editor.cropinit = true;
		},
		change(action) {
        switch (action) {
          case 'crop':
            this.$refs.editor.crop();
            // console.log(this.loader.url);
            break;
          case 'clear':
            this.$refs.editor.clear();
            break;

          case 'restore':
            this.$refs.editor.restore();
            break;
          case 'remove':
            // this.$refs.editor.reset();
            this.$store.state.editor.cropinit = false;
            break;
          default:
        }
    },
		imagechanged(e) {
			this.formItem.avatar = e;
		},
		leavetxt1Change() { //店铺描述长度检测
			var _this = this;
			clearInterval(_this.set);
			_this.set = setInterval(function () {
				_this.leavetxt1 = 100;
				_this.leavetxt1 = _this.leavetxt1 - _this.formItem.introduction.length;
				if (_this.leavetxt1 <= -1) {
					_this.$Message.warning({content: '店铺介绍字数超出指定长度',duration: 2});
					_this.formItem.introduction = _this.formItem.introduction.substr(0,100);
					_this.leavetxt1 = 0;
				}
			}, 1000);

		},
		leavetxt2Change() { //配送方式长度检测
			var _this = this;
			clearInterval(_this.set2);
			_this.set2 = setInterval(function () {
				_this.leavetxt2 = 40;
				_this.leavetxt2 = _this.leavetxt2 - _this.formItem.delivery_remark.length;
				if (_this.leavetxt2 <= -1){
					_this.$Message.warning({content: '配送方式说明字数超出指定长度',duration: 2});
					_this.formItem.delivery_remark = _this.formItem.delivery_remark.substr(0,40);
					_this.leavetxt2 = 0;
				}
			}, 1000);

		},
		leavetxt1blur() {
			clearInterval(this.set);
		},
		leavetxt2blur() {
			clearInterval(this.set2);
		},
		getShopInfo() {
			var _this = this;
			_this.$http({
				method: 'GET',
				// url: './mock/info.json',
				url: '/user/info',
				header: 'Accept:application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.formItem = response.body.data;
					_this.withoutpic = _this.formItem.avatar;
					
					if (_this.formItem.avatar.length == 0) {_this.formItem.avatar = 'http://img.dongpin.me/default/nopic.png'} //默认没有图片
					else {_this.formItem.avatar = _this.formItem.avatar};
					_this.formItem.province_id = parseInt(response.body.data.province_id);
					_this.leavetxt1 = _this.leavetxt1 - _this.formItem.introduction.length;
					_this.leavetxt2 = _this.leavetxt2 - _this.formItem.delivery_remark.length;
					_this.cityparams.id = _this.formItem.province_id;
					_this.getCity();
					_this.formItem.city_id = parseInt(response.body.data.city_id);
					_this.formItem.county_id = parseInt(response.body.data.county_id);
					_this.getConty();
				}
			});
		},
		provinceChange(e) {
			this.formItem.province_id = e;
			this.getCity();
			this.conty = [];
		},
		cityChange(e) {
			this.formItem.city_id = e;
			this.getConty();
		},
		getProvince() {
			var _this = this;
			_this.$http({
				method: 'GET',
				// url: './mock/sheng.json',
				url: 'api/other/provinces',
				header: 'Accept:application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.province = response.body.data;
				}
			});
		},
		getCity() {
			var _this = this;
			_this.$http({
				method: 'GET',
				// url: './mock/shi.json',
				// params: _this.cityparams,
				url: 'api/other/children/' + _this.formItem.province_id,
				header: 'Accept:application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.city = response.body.data;
				}
			});
		},
		getConty() {
			var _this = this;
			_this.$http({
				method: 'GET',
				// url: './mock/shi.json',
				// params: _this.cityparams,
				url: 'api/other/children/' + _this.formItem.city_id,
				header: 'Accept:application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.conty = response.body.data;
				}
			});
		},
		saveInfo() {
			var _this = this;
			if (!_this.$store.state.editor.imgbase64) {
				_this.formItem.avatar =  _this.withoutpic;}
			else{_this.formItem.avatar = _this.$store.state.editor.imgbase64;}
			_this.shopName = _this.formItem.shop_name;
			_this.$http({
				method: 'POST',
				url: '/user/info',
				body: _this.formItem,
				header: 'Accept:application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.$Message.success({
						content: '店铺信息修改成功',
                		duration: 3
					});
					_this.setCookie('username', 'yangyumei', 1);
				}
				else {
					var mes = response.body.message;
					 _this.$Message.error({
                	content: mes,
                	duration: 3
            });
				}
			});
		},
		preview() { //预览店铺效果
			if (!this.$store.state.editor.imgbase64) {
				this.formItem.avatar =  this.withoutpic;}
			else{this.formItem.avatar = this.$store.state.editor.imgbase64;}
			this.is_preview = true;
		},
		closediv () {
			this.is_preview = false;
		},
		setCookie(name, value, iDay){
			var oDate=new Date();
			oDate.setDate(oDate.getDate()+iDay);
			document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
			},
	},
	mounted () {
	},
	created() {
		this.getProvince();
		this.getShopInfo();
	}
}
</script>
<style lang="less">
#setting {
	padding-bottom: 50px;
	.copy-inner{margin-left: 70px !important;margin-right: 0px !important;}
	.previewmask{width: 86%;height: 100%;position: absolute;top: 0;background: rgba(255,255,255,0.8);z-index: 999999;}
	.previewcss{font-size: 14px;position: absolute;
   /* background: url('./../../../img/phoneback.png');*/
   	background: url('/Public/pc/dcanmou-client/img/phoneback.png');
    background-size: contain;
    width: 317px;
    height: 660px;
    top: 50%;
   	right: 50%;
    margin-top: -330px;
    margin-left:-160px;
    z-index: 10000;
	.previewinfo{height: 490px;width:274px;background: #f5f5f5;margin-top:85px;margin-left:23px;  
		.preview_img{width: 100%;height: 140px;border-bottom: 1px solid #8a8a8a;display: block;}
		.dianpu{line-height: 32px;background: #f5f5f5;padding-left: 10px;color: #cfcfcf;}
		.dianpu_add{background: #fff;border-bottom: 1px solid #f5f5f5;line-height: 45px;
			span {padding-left: 6px;}}
		.dianpu_jieshao {height: 85px;color: #7e7f88;padding-left: 10px;padding-top: 8px;line-height: 16px;background: #fff;}
		.dianpu_peisong {color: #7e7f88;padding-left: 10px;padding-top: 8px;line-height: 16px;height: 48px; margin-bottom:8px;background: #fff;}
		.orangebtn{height: 21px;background: #f2582a}
	}
	.closebtn{position: absolute;top:0px;left: 300px;padding: 0;margin: 0;width: 50px;height: 50px;font-size: 35px;line-height: 50px;border-radius: 0;background:none;color: #7e7f88;}
}
	.ivu-input {
		border: none;
		border-radius: 4px !important;
	}
	.ivu-select-single {
		margin-bottom: 20px;
		margin-right: 30px;
	}
	.district {
		font-size: 14px;
		line-height: 35px;
		padding-right: 80px;
		color: #A2A2A2
	}
	.ivu-select-selected-value {
		font-size: 14px
	}
	.ivu-tabs {
		background: #fff
	}
	.ivu-select-dropdown-list {
		.ivu-select-item {
			font-size: 14px !important;
		}
	}
	.ivu-select-selection {
		.ivu-select-placeholder {
			font-size: 14px
		}
	}
	.ivu-select-selected-value {
		font-size: 14px;
	}
	.ivu-col-span-4 {
		margin-right: 25px;
	}
	.ivu-form-item {
		margin: 0 0 20px 0
	}
	.ivu-input-wrapper {
		width: 263px;
	}
	.ivu-input {
		height: 35px;
		background-color: #F5F5F5;
		font-size: 14px;
		border-radius: 0;
	}
	.ivu-form-item-label {
		font-size: 14px;
		padding: 0;
		line-height: 32px;
	}
	.marginl {
		margin-left: 70px;
		margin-top: 20px;
		p {
			font-size: 14px;
			line-height: 32px;
		}
	}
	.ivu-btn-primary {
		height: 44px;
		width: 200px;
		background-color: #45C8DC;
		border: none;
		font-size: 16px;
		border-radius: 20px;
		margin-right: 30px;
		margin-bottom: 40px;
	}
	.img {
		width: 420px;
		height: 210px;
		border: 1px solid #f0f0f0;
	}
	.center {
		margin-bottom: 20px;
		display: inline-flex;
		p {
			margin-right: 45px;
		}
	}
	.virtualBtn {height: 40px;
		width: 100px;
		height: 40px; 
		border: 1px solid #45C8DC;
		background: #fff;
		font-size: 16px;
		text-align: center;
		color: #45C8DC;
		border-radius: 4px;
		margin: 0;
		margin-left: 40px;
		margin-top: 170px;}
	.uplondImgBtn {
		opacity: 0.5;
		height: 40px;
		width: 100px;
		height: 40px; 
		border: 1px solid #45C8DC;
		background: #fff;
		font-size: 16px;
		text-align: center;
		color: #45C8DC;
		border-radius: 4px;
		margin: 0;
		margin-left: 40px;
		margin-top: 170px;

	}
	.g-resize-bar{top:5%;z-index: 500;}
	.g-rotate-bar{top:10%;z-index: 500;}
	.g-core-image-corp-container { background: rgba(0,0,0,0.5);width: 75%;height: 100%;}
	.crop-box{border: 2px solid #45c8dc !important;}
	/*.crop-box{top:95px! important;}*/
	.g-crop-image-box{height: 100%;width: 100%;}
	/*.image-mask{top:-207px !important;}*/
	.g-crop-image-principal {margin-left: 0 !important;height: 100% !important;width: 100% !important;} 
	.g-core-image-corp-container .info-aside {
		p{margin: 0;}
		top: 0;
		background: #fff;
		height: 70px;
		padding:0;
	}
	.g-core-image-corp-container .btn-upload {background: #45c8dc}
	.g-core-image-corp-container .btn{height: 70px;line-height: 70px;font-size: 14px;width: 49.8%;padding: 0;border: none;margin: 0;}
	.g-core-image-corp-container .btn-groups {text-align: center;}
	.txt {
		p {
			margin-right: 45px;
		}
		;
		position: relative;
		margin-bottom: 20px;
		.ivu-input-wrapper {
			width: 610px;
			height: 100px;
			.ivu-input {
				width: 100%;
				height: 100%;
				resize: none;
				background-color: #fff;
				border: 1px solid #f0f0f0
			}
		}
		.leavetxt1 {
			position: absolute;
			top: 72px;
			z-index: 100;
			font-size: 14px;
			left: 645px;
		}
		.leavetxt2 {
			position: absolute;
			top: 192px;
			z-index: 100;
			font-size: 14px;
			left: 645px;
		}
		.flexbox {
			display: flex;
			margin-bottom: 20px;
		}
		.leavetxt {
			display: block;
			height: 24px;
			width: 62px;
			line-height: 24px;
			color: #fff;
			background: #8f8f8f;
			text-align: center;
			border-radius: 4px;
		}
	}
	.uploadbar {position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.5);
    z-index: 10000;}
    .cropipt {
    	.nav__button_upload {
			    position: fixed;
			    top: 452px;
			    left: 630px;
			    background: red;
    	}
    }
    
   .btndiv{display: inline-flex;}
}
</style>
