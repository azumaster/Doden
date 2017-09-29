export default {
	data () {
		return {
			current: 2, //当前页
			total: 50, //总条数
		}
	},
	methods: {
		getBrands () {
			req.getbrands(this, this.params, res => {
				 if (res.code == 0) this.loading = false;
				 this.data =  res.data.brands;
			 })
		},
		selectBrands (item) { //单选
			this.params.ids = [];
			for(var i in item) {
				this.params.ids.push(item[i].id)
			}
			console.log(this.params)
		}
		
	},
	created () {
		// this.getBrands ()
	}
}