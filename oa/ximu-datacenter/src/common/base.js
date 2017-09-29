export default {
	data () {
		return {
			nowTime: '',
			timeLenth: 0,
			timeList: [{value: 0,label: '开通到今天'}, { value: 30, label: '近30天'},{value: 15,label: '近15天'},{value: 7,label: '近7天'}],
			starttime: '2015-01-01',
		}
	},
	methods: {
		getNowTime () {
			var t=new Date();
                var iToDay=t.getDate();
                var iToMon=t.getMonth();
                var iToYear=t.getFullYear();
                this.nowTime = t.toLocaleDateString();
                if (this.timeLenth == 0) {this.starttime = '2015-01-01';return;} ;
                this.starttime = new Date(iToYear,iToMon,(iToDay-this.timeLenth)).toLocaleDateString();

		},
		// timeLenthChange (e) {
		// 	if (e == 0) {this.starttime = '2015-01-01';}
		// 	else {this.timeLenth = e;this.getNowTime();}
		// }
	}
}