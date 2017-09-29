export default{
	methods:{
		getBaseData(){
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/mock/goodsnofilter.json',
                    data: _this.params
                }).then(response =>{
                    if(response.body.code == 0){
                         _this.spinShow = false ;
                        _this.totalEcharts = response.body.data.全部;
                        _this.initTotalCharts();
                    }
                });
            },
             getFilterData(){
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: '/mock/goodsfilte.json'
                }).then(response => {
                    _this.provinceList = response.body.data.province;
                    _this.sortList = response.body.data.sort;
                    _this.districtList = response.body.data.district;
                    _this.marketList = response.body.data.market;
                })
            }
	}
}