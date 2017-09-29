export default{
	methods:{
		getBaseData(){
				var _this = this;
				_this.$http({
					method: 'GET',
					url: '/mock/nosplitconsult.json',
					data: _this.params
				}).then(response =>{
					if(response.body.code ==0){
						_this.totalEcharts = response.body.data.全部.group;
						_this.initTotalCharts();
						_this.spinShow = false ;
					}
				});
			},
			   getFilterData(){
            	var _this = this;
            	_this.$http({
            		method: 'GET',
            		url: '/mock/consultfilter.json'
            	}).then(response => {
            		_this.provinceList = response.body.data.buyer_province;
            		_this.cityList = response.body.data.buyer_city;
            		_this.goods_sortList = response.body.data.goods_sort;
            		_this.buyer_districtList = response.body.data.buyer_district;
            		_this.goods_brandList =  response.body.data.goods_brand;
            		_this.buyer_typeList = response.body.data.buyer_type;
            		_this.buyer_marketList = response.body.data.buyer_market;
            		_this.buyer_nameList = response.body.data.buyer_name;
            	})
            },
                 select(){
            	var _this = this;
            	console.log(_this.params);
            	_this.$http({
            		method: 'GET',
            		url: '/mock/nosplitconsult.json'
            	}).then(response => {
            		if(response.body.code ==0){
            			_this.spinShow = false ;
            			_this.totalEcharts = response.body.data.全部.group;
            		}
            	})
            }
	}
}