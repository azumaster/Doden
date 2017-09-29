export  default {
	data () {
		return {
			ticketList: [],
			addTicket: [],
			nowTime: '',
			pretime: ''
		};
	},
	methods: {
		getTicketList () {
			var _this = this;
			_this.$http({
				methods: 'GET',
				url: './mock/tiketfen.json',
				params: {},
				header: 'application/json'
			}).then(response => {
					if (response.body.code == 0) {
						_this.ticketList = response.body.data;
						var all_ticket = {'type_no':'all_ticket', 'name':'全部券'};
						_this.ticketList = Object.assign(_this.ticketList, {"all_ticket": all_ticket});
					}
					else if (response.body.code == 10106) {
						this.$Message.warning('您尚未登录，请登录',1.5, function () {
                           window.location.href='http://oa.zdongpin.com/';
                        })
					}
			});
		},
		getTicketList2 () {
			var _this = this;
			_this.$http({
				methods: 'GET',
				url: './mock/tiketfen.json',
				params: {},
				header: 'application/json'
			}).then(response => {
					if (response.body.code == 0) {
						_this.addTicket = response.body.data;
					}
					else if (response.body.code == 10106) {
						this.$Message.warning('您尚未登录，请登录',1.5, function () {
                           window.location.href='http://oa.zdongpin.com/';
                        })
					}
			});
		},
		getExchangeHistory () {
			var _this = this;
			_this.$http({
				methods: 'GET',
				url: './mock/duihuanlishi.json',
				params: {},
				header: 'application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.data = response.body.data.lists;
					for (var item in _this.data) {
						if (_this.data[item].status == 1) {
							_this.data[item] = Object.assign(_this.data[item], {'audit': '未兑换'});
						}
						else {_this.data[item] = Object.assign(_this.data[item], {'audit': '已兑换'});}
					}
				}
			})
		},
		ticketstatusChange () { //兑换券状态改变
			var _this = this;
			_this.$http({
				method: 'GET',
				url: './mock/duihuanlishi.json',
				params: _this.ticketstatusparams,
				header: 'application/json'
			}).then(response => {
				if (response.body.code == 0) {
					_this.$Modal.success({
						title: '   ',
						content: '兑换权状态更改成功'
					});
				}
				else {
					_this.$Modal.error({
						title: '   ',
						content: '兑换权状态更改失败，请重试'
					});
				}
			});
		},
		add (name) {  //新增兑换券
                var _this = this;
                _this.$refs[name].validate((valid) => {
                	if (valid) {
                       _this.$http({
                	method: 'GET',
                	url: './mock/duihuanlishi.json',
                	params: _this.formValidate,
                	header: 'application/json'
                }).then( response => {
                	if (response.body.code == 0) {
                		_this.$Modal.success({
                			title: '    ',
                			content: '兑换券新增成功'
                		});
                		 _this.$refs[name].resetFields();

                	}
                	else {
                		_this.$Modal.error({
                			title: '    ',
                			content: '兑换券新增失败'
                		});
                	}
                });
                    } else {
                        this.$Message.error('请将表单填写完整!');
                    }
                });
            },
             getNowTime () {
                var date = new Date(),
                Y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate(),
                H = date.getHours(),
                i = date.getMinutes(),
                s = date.getSeconds(),
                pre = date.getSeconds()+1;
                if (m < 10) {
                m = '0' + m;
                }
                if (d < 10) {
                d = '0' + d;
                }
                if (H < 10) {
                H = '0' + H;
                }
                if (i < 10) {
                i = '0' + i;
                }
                if (s < 10) {
                s = '0' + s;
                }
                if (pre < 10) {pre = '0'+pre;}
                var t = Y+'-'+m+'-'+d+' '+H+':'+i+':'+s;
                this.pretime = Y+'-'+m+'-'+d+' '+H+':'+i+':'+pre;
                this.nowTime = t;
                return ;
            }
	},
	created () {
		this.getTicketList();
	}
};
//供应商：  采购商： 餐厅：25