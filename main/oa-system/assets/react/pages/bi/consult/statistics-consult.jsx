
import React from 'react';
import echarts from 'echarts';

class ConsultData extends React.Component {
    constructor(props){
        super(props);
        this.request = {
            time: ['2017-01-01', '2017-01-07'],
            select: ['price', 'num'],
            //group: 'none',
            split: {
                seller: {
                    market: 1
                }
            }
        };

        this.initEcharts = this.initEcharts.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
        this.refreshData = this.refreshData.bind(this);

        this.lineBar = this.lineBar.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.initEcharts();
        this.loadData();
    }

    initEcharts() {
        this.charts = echarts.init(document.getElementById('chart-consult'));
    }

    loadData(request) {
        // this.charts.showLoading();

        if (typeof request === 'object') {
            this.request = request;
        }

        // H.server.bi_order(this.request, this.onDataLoaded);

        return this;
    }

    onDataLoaded(res) {
        this.data = res.data;
        this.refreshData();

        this.charts.hideLoading();
    }

    refreshData() {

        // if (this.isLineBar()) {
        //     this.lineBarChart();
        // } else if (this.isPie()) {
        //     this.pieChart();
        // } else if (this.isGeo()) {
        //     this.geoChart();
        // }
    }

    lineBar(){
        let option, grid;

        grid = {
            show: true,
            left: 'auto',
            right: 60,
            containLabel: true
        };
        option = {
            tooltip: {trigger: 'axis'},
            // toolbox: this.toolbox,
            grid: grid,
            xAxis: [
                {
                    type: 'category',
                    data: Object.keys(this.data)
                }
            ],
            yAxis: yAxis,
            series: series,
            legend: legend,
            animation: true
        };
        this.charts.setOption(option, true);
    }

    render(){
        return(
            <div className="charts-wrap">
                <div id="chart-consult" className="charts" style={{
                    width: '96%',
                    marginLeft: '2%',
                    marginTop: window.innerHeight * 0.05,
                    height: window.innerHeight * 0.85
                }}></div>
            </div>
        );
    }
}

export default ConsultData;