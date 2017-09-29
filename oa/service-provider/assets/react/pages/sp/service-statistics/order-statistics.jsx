/*
 * 订单统计*/
import DatePicker from './../../../../components/datePicker/index.jsx';

class OrderStatistics extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: null,  //订单统计;
            param: {
                time: [H.GetDateStr(-6).time1, H.GetDateStr(0).time1],
                group: 'day',
                select: ['avg']
            },
            providerHint: []    //输入手机号时提示的店铺名数据;
        };
    }

    //获取日期范围
    dateRange(){
        let param = this.state.param;
        param.time[0] = $('#order_statistics_startTime').val();
        param.time[1] = $('#order_statistics_endTime').val();
        //传进来的起止时间，通过setDate去更新组件的状态
        this.setState({param: param});
    }

    componentDidMount(){
        this.getData();
    }

    getData(){
        H.server.order_statistics(JSON.stringify(this.state.param), (res)=> {
            if(res.code == 0){
                this.state.data = res.data;
                this.setState({providerHint: []});
                this.initTypeEcharts(res.data.sort_data);
                this.initDateEcharts(res.data.detail);
            }
        });
    }

    initTypeEcharts(data){
        let xAxisArr = [],
            onArr = [],
            unArr = [],
            amountArr = [];
        for(let i in data) {
            let count = parseFloat(data[i].on_amount||0)+parseFloat(data[i].un_amount||0);
            xAxisArr.push(i+'：总金额'+count+'，总笔数'+((data[i].on_num||0)+(data[i].un_num||0)));
            onArr.push(data[i].on_amount||0);
            unArr.push(data[i].un_amount||0);
            amountArr.push(count);
        }
        let option = {
            title : {
                text: '订单统计各种用户的总金额'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['线上交易金额', '线下交易金额', '总交易金额']
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},
                    restore: {show: false},
                    saveAsImage: {show: true}
                }
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisArr
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            grid: {
                left: '50',
                right: '50',
                bottom: '20',
                containLabel: true
            },
            series : [
                {
                    name:'线上交易金额',
                    type:'bar',
                    barWidth: '20%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: onArr
                },
                {
                    name:'线下交易金额',
                    type:'bar',
                    barWidth: '20%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: unArr
                },
                {
                    name:'总交易金额',
                    type:'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: amountArr
                }
            ]
        };
        echarts.init(document.getElementById('orderTotalCount')).setOption(option);
    }

    initDateEcharts(data){
        let timeArr = [],
            amount = [],
            num = [],
            avg = [];
        for(let i = 0 ; i < data.length ; i++) {
            timeArr.push(data[i].time);
            amount.push(data[i].amount);
            num.push(data[i].num);
            avg.push(Math.round(data[i].amount/data[i].num));
        }
        let option = {
            title: {
                text: '订单统计金额/数量/平均客单价'
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},
                    restore: {show: false},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:['金额', '数量', '平均客单价']
            },
            xAxis: [
                {
                    type: 'category',
                    data: timeArr,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '金额',
                    //min: 0,
                    //max: 250,
                    //interval: 50,
                    //minInterval: 1,
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                },
                {
                    type: 'value',
                    name: '数量',
                    //minInterval: 1,
                    axisLabel: {
                        formatter: '{value} 件'
                    }
                },
                {
                    type: 'value',
                    name: '平均客单价',
                    //minInterval: 1,
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }
            ],
            grid: {
                left: '50',
                right: '50',
                bottom: '20',
                containLabel: true
            },
            series: [
                {
                    name:'金额',
                    type:'bar',
                    yAxisIndex: 0,
                    barWidth: '50%',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: amount
                },
                {
                    name:'数量',
                    type:'line',
                    data: num
                },
                {
                    name:'平均客单价',
                    type:'line',
                    yAxisIndex: 1,
                    data: avg
                }
            ]
        };
        echarts.init(document.getElementById('orderItemCount')).setOption(option);
    }

    radioHandler(w) {
        let param = this.state.param;
        param.group = w;
        this.setState({param: param});
    }

    //输入手机号的输入框的值更改时;
    changeMobile(e) {
        let param = this.state.param;
        param.mobile = e.target.value;
        if(H.isPhone(param.mobile)) {  //判断如果输入了正常的手机号时立即请求提示的数据;
            this.setState({param: param});
            H.server.provider_hint(JSON.stringify({mobile: param.mobile}), (res) =>{
                if(res.code == 0) {
                    this.setState({providerHint: res.data});
                }
            });
        }else {
            this.setState({param: param, providerHint: []});
        }

    }

    //生成店铺名的提示;
    CreateProviderHint() {
        let d = this.state.providerHint;
        if(d.length <= 0) return null;
        let xml = d.map((val, index) => {
            return (<p key={index}>{val.shop_name}</p>);
        });
        return (
            <div style={{position: 'absolute', backgroundColor: '#fff', left: '0', right: '10px', border: '1px solid #ccc', padding: '10px 10px 0 10px', zIndex: 1}}>
                {xml}
            </div>
        );
    }

    render(){
        return(
            <div className="order-statistics-wrap">

                <div className="section-filter">
                    <div className="form-inline">
                        <div className="filter-row">
                            <div style={{display: 'inline-block', position: 'relative'}}>
                                <input type="tel" className="form-control input-sm" onChange={this.changeMobile.bind(this)} value={this.state.param.mobile} placeholder="请输入手机号"/>
                                {this.CreateProviderHint()}
                            </div>

                            <DatePicker start={this.state.param.time[0]} end={this.state.param.time[1]}
                                        prefix="order_statistics_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)}/>

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
                            {/*<a style={{marginLeft: '50px'}} href="javascript:;" className="btn btn-lg btn-default" onClick={this.getData.bind(this)}>导出</a>*/}
                        </div>
                    </div>
                </div>
                <div className="total-count" id="orderTotalCount" style={{height: '400px', width: '100%'}}></div>
                <div className="item-count" id="orderItemCount" style={{height: '600px', width: '100%'}}></div>
            </div>
        );
    }
}

export  default OrderStatistics;