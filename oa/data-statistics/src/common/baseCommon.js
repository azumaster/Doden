export default {
	methods: {
		dateChange(e){
                this.start = e[0];
                this.end = e[1];
                this.filterparams.time = [this.start, this.end];
                this.params.time = [this.start, this.end];
                this.time = this.params.time;
            },
	}
}