export default{
    methods: {
         getMockData(){
                var _this = this ;
                _this.$http({
                    method: 'GET',
                    url: './mock/rank.json',
                    data: _this.param,
                    header: 'Accept application/json'
                }).then(response =>{
                    _this.list = response.body.data.data;
                    _this.spinShow = false;
                    _this.total = response.body.data.total;
                });
            },
            getsellerMockData(){
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: './mock/sellerdetail.json',
                    data: _this.param,
                    header: 'Accept application/json'
                }).then(response=>{
                        _this.spinShow = false;
                        _this.sellerdetail = response.body.data.data;
                        _this.sellertotal = response.body.data.total;
                    });
            }   
    }
};