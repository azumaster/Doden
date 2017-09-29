let Base64 = require('js-base64').Base64;
export  default {
	data () {
		return {
			wechatGroup: [],
			signature_data: {
                    signature_data: ''
                },
			total: 0,
			provinceparams: {
				page: 1,
				size: 50
			},
			wehcatparams: {},
			shopDetailparams: {
				shopId: 0
			},
			shopType: [{id: 11, name: '供应商'}, {id: 21, name: '采购商'}, {id: 25, name: '餐厅'}],
			searchList: [{type: 'mobile', name: '手机号码'}, {type: 'shop_name', name: '店铺名称'}]
		};
	},
	methods: {
		sousuo () {
			var _this = this;
			_this.params.page = 1;
			_this.$store.state.page = 1;
			_this.$http({
				// method: 'GET',
				// url: './mock/daishenhe.json',
				method: 'POST',
				url: '/shop/handle',
				body: _this.params,
				header: 'Accept application/json'
			}).then(responce => {
				if (responce.body.code == 0) {
					_this.total = responce.body.data.total;  //返回总条数
					_this.data = responce.body.data.detail;
					for (var i in _this.data) {
						if (_this.data[i].trenchnum == '21') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '采购商'});
							_this.data[i] = obj;
						}
						if (_this.data[i].trenchnum == '11') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '供应商'});
							_this.data[i] = obj;
						}
						if (_this.data[i].trenchnum == '25') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '餐厅'});
							_this.data[i] = obj;
						}
					}
				}
			})
		},
		back: function () {
				var _this = this;
				window.location.href = `/html/shop-check/index.html#/${_this.module}`;
                // window.location.href = `${_this.module}`;
            },
        pageChange (e) {
        	this.$store.state.page = e;
        	this.params.page = e;
        	this.getData();
        },
        soProvinceChange (e) {
        	if (e == -1) {
        		delete this.params.province_id;
        	}
        	else {
        		this.params.province_id = e;
        	}
        },
        getProvinceData () {   
        //http://dev.idongpin.com/zdp-dev/zdp-oa/wikis/market
			var _this = this;
			_this.$http({
				// method: 'GET',
				// url: './mock/province.json',
				method: 'GET',
				url: '/province',
				params: _this.provinceparams,
				header: 'Accept application/json'
			}).then(responce => {
				if (responce.body.code == 0) {
					_this.soprovinceList = responce.body.data.detail;
					_this.soprovinceList.unshift({province_id: -1, dividename: '全部'});
				};
				if(responce.body.code == 10106) {
                        this.$Message.warning('您尚未登录，请登录',1.5, function () {
                           window.location.href='http://oa.zdongpin.com/';
                        })
                    };
			});
		},
		getWechatGroup () {
			var _this = this;
			_this.$http({
				method:'GET',
				// url: './mock/wechat.json',
				url: '/wechat',
				body: _this.wehcatparams,
				header: 'application/json'
			}).then(responce => {
				if (responce.body.code == 0) {
					_this.wechatGroup =responce.body.data.groups;
				};
			});
		},
		getData () {
			var _this = this;
			_this.$http({
				// method: 'GET',
				// url: './mock/daishenhe.json',
				method: 'POST',
				url: '/shop/handle',
				body: _this.params,
				header: 'Accept application/json'
			}).then(responce => {
				if (responce.body.code == 0) {
					_this.total = responce.body.data.total;  //返回总条数
					_this.data = responce.body.data.detail;
					for (var i in _this.data) {
						if (_this.data[i].trenchnum == '21') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '采购商'});
							_this.data[i] = obj;
						}
						if (_this.data[i].trenchnum == '11') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '供应商'});
							_this.data[i] = obj;
						}
						if (_this.data[i].trenchnum == '25') {
							var obj = _this.data[i];
							obj = Object.assign(obj, {dianpuType: '餐厅'});
							_this.data[i] = obj;
						}
					}
				}
			})
		},
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
                var path = 'Public/Uploads/card/'+ today +'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10000)+
            '.'+ suffix;
                _this.path = path;
                _this.SPdetail.cardPic ='/'+path;
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
                            _this.fd = fd;
                            var xhr = new XMLHttpRequest();
                            xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                            xhr.send(fd);
                        }
                    })
                }
            })
            }
	},
	created () {
		this.getProvinceData();
		this.getWechatGroup();
	}
};
//供应商：11  采购商：21 餐厅：25
// 微信分组 http://dev.idongpin.com/zdp-dev/zdp-oa/wikis/common-wechat