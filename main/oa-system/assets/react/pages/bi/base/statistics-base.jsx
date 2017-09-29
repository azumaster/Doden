
import React from 'react';
import echarts from 'echarts';

class BaseData extends React.Component {
    constructor(props){
        super(props);
        this.createCharts = this.createCharts.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.createCharts();
    }

    createCharts() {
        let myChart = echarts.init(document.getElementById('charts_base'));
        let option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    render(){
        return(
            <div className="page_head">
                <h1>基本数据统计</h1>
                <div id="charts_base" style={{width: 1000, height: 600}}></div>
            </div>
        );
    }
}

export default BaseData;