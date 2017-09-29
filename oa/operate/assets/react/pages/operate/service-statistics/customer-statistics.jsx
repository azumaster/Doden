/*
 * 客户统计*/
import DatePicker from './../../../../components/datePicker/index.jsx';


class CustomerStatistics extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            areaData: [],     //区域的数据;
            currentArea: null,  //当前区域;
            currentDate:0,          // 当前选中的预设日期
            param: {         //获取数据时的参数;
                time: [H.GetDateStr(-6).time1, H.GetDateStr(0).time1],     //第一个数字代表往后推移几天
                group: 'day'
            },
            data: null,             //客户统计数据;
            providerList: [],            //手机号关联的服务商数据;
            currProviderList: [],         //匹配的数据列表;
            searchVal: '',           //显示在输入框的值;
            cacheVal: ''             //输入框的值缓存;
        };
    }

    //获取日期范围
    dateRange(){
        let param = this.state.param;
        param.time[0] = $('#customer_statistics_startTime').val();
        param.time[1] = $('#customer_statistics_endTime').val();
        //传进来的起止时间，通过setState去更新组件的状态
        this.setState({param: param});
    }

    componentDidMount(){
        this.getData();
        this.getProviderHint();
        let that = this;
        document.addEventListener('mousedown', function(e){
            if(!e.target.dataset.cm) {
                that.setState({currProviderList: []});
            }
        }, false);
    }

    //获取数据;
    getData(){
        H.server.customer_statistics(JSON.stringify(this.state.param), (res) => {
            if(res.code == 0) {
                this.state.data = res.data;
                this.initTypeEcharts(res.data.sort_num);
                this.initDateEcharts(res.data.detail);
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //获取手机关联的数据;
    getProviderHint() {
        H.server.provider_hint({}, (res) => {
            if(res.code == 0) {
                this.setState({providerList: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    initTypeEcharts(data) {
        let xAxisData = [],
            seriesData = [];
        for(let i in data) {
            xAxisData.push(i);
            seriesData.push(data[i]);
        }
        let option = {
            color: ['#3398DB'],
            title: {
                text: '每一类店铺用户数量'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},
                    restore: {show: false},
                    saveAsImage: {show: true}
                }
            },
            grid: {
                left: '50',
                right: '50',
                bottom: '20',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'店铺总数',
                    type:'bar',
                    barWidth: '15%',
                    data:seriesData
                }
            ]
        };
        echarts.init(document.getElementById('chart-consult')).setOption(option);
    }

    initDateEcharts(data){
        let xAxisNum = [],
            seriesDate =[];
        for(let i in data){
            let v =data[i];
            xAxisNum.push(v.time);
            seriesDate.push(v.number);
        }
        let option = {
            title: {
                text: '客户用户数量'
            },
            tooltip : {
                trigger: 'cross'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},
                    // restore: {show: false},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['客户数量']
            },
            grid: {
                left: '50',
                right: '50',
                bottom: '20',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : xAxisNum
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [

                {
                    name:'客户数量',
                    type:'line',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {normal: {}},
                    data:seriesDate
                }
            ]
        };
        echarts.init(document.getElementById('chart-num')).setOption(option);


    }

    radioHandler(w) {
        let param = this.state.param;
        param.group = w;
        this.setState({param: param});
    }

    //输入手机号的输入框的值更改时;
    changeMobile(e) {
        let val = e.target.value,
            param = this.state.param;
        if(H.isNumber(val)){
            param.mobile = val;
        }else {
            param.mobile = null;
        }
        this.searchWords(e.target.value);
    }

    //点击关联数据时把对应
    providerHandle(val) {
        let param = this.state.param;
        param.mobile = val.mobile;
        this.setState({param: param, searchVal: val.shop_name+'（'+val.mobile + '）', currProviderList: []});
    }

    //当输入框获取焦点时;
    focusMobile() {
        this.searchWords(this.state.param.mobile || this.state.searchVal, true);
    }

    //根据关键字匹配;
    searchWords(val, bool) {
        let d = this.state.providerList,
            arr = [];
        for(let i = 0 ; i < d.length ; i++) {
            if(d[i].shop_name.indexOf(val) != -1 || d[i].mobile.indexOf(val) != -1) {
                arr.push(d[i]);
            }
        }
        if(bool) {
            this.setState({currProviderList: arr});
        }else {
            this.setState({currProviderList: arr, searchVal: val});
        }
    }

    render(){
        return(
            <div className="customer-wrap">
                <div className="section-filter">
                    <div className="form-inline">
                        <div className="filter-row">
                            <div style={{display: 'inline-block', position: 'relative'}}>
                                <input style={{width: '300px'}} type="tel" onFocus={this.focusMobile.bind(this)}
                                       className="form-control input-sm" onChange={this.changeMobile.bind(this)} value={this.state.searchVal} placeholder="请输入商家名或手机号"/>
                                {
                                    this.state.currProviderList.length > 0 ?
                                        <ul data-cm="1" style={{width: '300px', border: '1px solid #ccc', position: 'absolute', top: '100%', left: '0', backgroundColor: '#fff', marginTop: '-1px',
                                                    paddingLeft: '12px', overflowY: 'auto', maxHeight: '500px', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px 2px', zIndex: '1'}}>
                                            {
                                                this.state.currProviderList.map((val, index) => {
                                                    return (
                                                        <li key={index} style={{lineHeight: '34px', cursor: 'pointer', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}
                                                            onClick={this.providerHandle.bind(this, val)} data-cm="1">{val.shop_name+'('+val.mobile+')'}</li>
                                                    );
                                                })
                                            }
                                        </ul> : null
                                }
                            </div>
                            <DatePicker start={this.state.param.time[0]} end={this.state.param.time[1]}
                                        prefix="customer_statistics_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)}/>

                            <label className="radio-inline" htmlFor="order_statistics_day">
                                <input type="radio" name="radioname" value="day" checked={this.state.param.group == 'day'}
                                       onChange={this.radioHandler.bind(this, 'day')} id="order_statistics_day"/>按日</label>
                            <label className="radio-inline" htmlFor="order_statistics_week">
                                <input type="radio" name="radioname" value="week" checked={this.state.param.group == 'week'}
                                       onChange={this.radioHandler.bind(this, 'week')} id="order_statistics_week"/>按周</label>
                            <label className="radio-inline" htmlFor="order_statistics_month">
                                <input type="radio" name="radioname" value="month" checked={this.state.param.group == 'month'}
                                       onChange={this.radioHandler.bind(this, 'month')} id="order_statistics_month"/>按月</label>
                            <a href="javascript:;" className="btn btn-sm btn-orange" onClick={this.getData.bind(this)}>筛选</a>
                        </div>
                    </div>
                </div>
                <div id="chart-consult" className="customer-consult" style={{
                    width: '100%',
                    height: '400px'
                }}></div>
                <div id="chart-num" className="customer-consult" style={{
                    width: '100%',
                    height: '600px'
                }}></div>
            </div>
        );
    }
}
export default CustomerStatistics;
