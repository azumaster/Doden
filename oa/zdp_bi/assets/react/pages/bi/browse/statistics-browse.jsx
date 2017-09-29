
import React from 'react';
import echarts from 'echarts';
import RadioGroup from './../../../../components/radio/radio.jsx';

class BrowseData extends React.Component {
    constructor(props){
        super(props);
        this.createCharts = this.createCharts.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.state = {
            test: 0
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.createCharts();
    }

    createCharts() {
        let myChart = echarts.init(document.getElementById('charts_browser'));
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

    inputChange(){
        let test = this.state.test == 0?1:0;

        this.setState({
            test: test
        });
    }

    render(){
        return(
            <div className="page_head">
                <h1>浏览数据统计</h1>
                <div id="charts_browser" style={{width: 1000, height: 600}}></div>
                <RadioGroup
                    param={[{id: 0, name: '否'}, {id: 1, name: '是'}]}
                    defaultVal={this.state.test}
                    name="halal"
                    changeHandler={this.inputChange}
                    identify={9}
                    index={0}
                />
            </div>
        );
    }
}

export default BrowseData;