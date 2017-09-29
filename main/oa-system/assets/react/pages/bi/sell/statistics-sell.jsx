import React from 'react';

import DatePicker from '../../../../components/datePicker/index.jsx';
import RadioGroup from '../../../../components/radio/radio.jsx';
import Input from '../../../../components/input/input.js';
import DropDown from '../../../../components/drop_down/drop-down.js';
import Btn from '../../../../components/btn/btn.js';
import Filter from './statistics-sell-filter.jsx';

import Echarts from 'echarts';

class SellData extends React.Component {
    constructor(props) {
        super(props);

        this.initEcharts = this.initEcharts.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onDataLoaded = this.onDataLoaded.bind(this);
        this.refreshData = this.refreshData.bind(this);

        this.lineBarChart = this.lineBarChart.bind(this);
        this.pieChart = this.pieChart.bind(this);
        this.geoChart = this.geoChart.bind(this);

        this.isLineBar = this.isLineBar.bind(this);
        this.isPie = this.isPie.bind(this);
        this.isGeo = this.isGeo.bind(this);

        this.useLineBarChart = this.useLineBarChart.bind(this);
        this.usePieChart = this.usePieChart.bind(this);
        this.useGeoChart = this.useGeoChart.bind(this);

        this.onGeoSelected = this.onGeoSelected.bind(this);
        this.onGeoGoBack = this.onGeoGoBack.bind(this);
        this.showGeoGoBack = this.showGeoGoBack.bind(this);
        this.hideGeoGoBack = this.hideGeoGoBack.bind(this);

        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.resize = this.resize.bind(this);

        this.chartsType = 'line';

        this.request = {
            time: [],
            select: ['price'],
            group: 'day',
            split: {},
            filter: {}
        };

        this.toolbox = {
            feature: {
                myFullscreen: {
                    show: true,
                    title: '全屏',
                    icon: 'M642 428l205 204l-1 -115q0 -8 5 -13t12 -5h13q17 0 17 15l1 173v9q1 8 -4 12q-5 6 -12 5h-9v0l-171 1q-8 0 -13 -5.5t-5 -12.5v-12q1 -9 6.5 -13.5t13.5 -4.5l113 -1l-205 -203q-7 -7 -7 -17t7 -17t17 -7t17 7v0zM383 235l-205 -204v116q1 7 -4.5 12.5t-12.5 4.5h-13q-17 0 -17 -15l-1 -173v-9q-1 -8 4 -12q5 -6 12 -5h9v0l172 -1q7 0 12.5 5.5t5.5 12.5v12q-1 9 -7 13.5t-13 4.5l-113 1l205 203q7 7 7 17t-7 17t-17 7t-17 -7v0zM894 -24v173q-1 15 -18 15h-12q-8 1 -13 -4.5t-5 -12.5l1 -116l-205 204q-7 7 -17 7t-17 -7t-7 -17t7 -17l204 -203l-112 -1q-8 0 -13.5 -4.5t-6.5 -13.5v-12q0 -7 5 -12.5t12 -5.5l172 1v0h9q7 -1 12 5q4 4 4 12v9v0v0zM212 665l113 1q7 0 13 4.5t7 13.5v12q0 7 -5.5 12.5t-12.5 5.5l-172 -1v0h-9q-7 1 -12 -5q-5 -4 -4 -12v-9v-173q1 -15 18 -15h13q7 -1 12 4.5t5 12.5v116l205 -204q7 -7 17 -7t17 7t7 17t-7 17l-205 203v0zM212 665z',
                    onclick: this.toggleFullScreen
                },
                myConfig: {
                    show: true,
                    title: '时间范围',
                    icon: 'M512 697.6c102.4 0 182.4-83.2 182.4-185.6 0-102.4-83.2-185.6-182.4-185.6-102.4 0-182.4 83.2-182.4 185.6C329.6 614.4 412.8 697.6 512 697.6L512 697.6zM512 646.4c-73.6 0-134.4-60.8-134.4-134.4 0-73.6 60.8-134.4 134.4-134.4 73.6 0 134.4 60.8 134.4 134.4C646.4 585.6 585.6 646.4 512 646.4L512 646.4z" p-id="1071"></path><path d="M249.015232 843.178592c35.2 28.8 73.6 51.2 112 67.2 41.6-38.4 96-60.8 150.4-60.8 57.6 0 108.8 22.4 150.4 60.8 41.6-16 80-38.4 112-67.2-12.8-54.4-3.2-112 22.4-163.2 28.8-48 73.6-86.4 128-102.4 3.2-22.4 6.4-44.8 6.4-67.2 0-22.4-3.2-44.8-6.4-67.2-54.4-16-99.2-54.4-128-102.4-28.8-48-35.2-108.8-22.4-163.2-35.2-28.8-73.6-51.2-112-67.2-41.6 38.4-92.8 60.8-150.4 60.8-54.4 0-108.8-22.4-150.4-60.8-41.6 16-80 38.4-112 67.2 12.8 54.4 3.2 112-22.4 163.2-28.8 48-73.6 86.4-128 102.4-3.2 22.4-6.4 44.8-6.4 67.2 0 22.4 3.2 44.8 6.4 67.2 54.4 16 99.2 54.4 128 102.4C252.215232 731.178592 261.815232 788.778592 249.015232 843.178592M361.015232 958.378592c-54.4-19.2-105.6-48-150.4-89.6-6.4-6.4-9.6-16-6.4-22.4 16-48 9.6-99.2-16-140.8-25.6-44.8-64-73.6-112-83.2-9.6-3.2-16-9.6-16-19.2-6.4-28.8-9.6-60.8-9.6-89.6 0-28.8 3.2-57.6 9.6-89.6 3.2-9.6 9.6-16 16-19.2 48-12.8 89.6-41.6 112-83.2 25.6-44.8 28.8-92.8 16-140.8-3.2-9.6 0-19.2 6.4-22.4 44.8-38.4 96-67.2 150.4-89.6 9.6-3.2 16 0 22.4 6.4 35.2 35.2 80 57.6 128 57.6 48 0 96-19.2 128-57.6 6.4-6.4 16-9.6 22.4-6.4 54.4 19.2 105.6 48 150.4 89.6 6.4 6.4 9.6 16 6.4 22.4-16 48-9.6 99.2 16 140.8 25.6 44.8 64 73.6 112 83.2 9.6 3.2 16 9.6 16 19.2 6.4 28.8 9.6 60.8 9.6 89.6 0 28.8-3.2 57.6-9.6 89.6-3.2 9.6-9.6 16-16 19.2-48 12.8-89.6 41.6-112 83.2-25.6 44.8-28.8 92.8-16 140.8 3.2 9.6 0 19.2-6.4 22.4-44.8 38.4-96 67.2-150.4 89.6-9.6 3.2-16 0-22.4-6.4-35.2-35.2-80-57.6-128-57.6-48 0-96 19.2-128 57.6-3.2 3.2-9.6 6.4-16 6.4C364.215232 958.378592 361.015232 958.378592 361.015232 958.378592z',
                    onclick: function () {
                        $('.chart-modal').toggleClass('active');
                        $('#chart-order').toggleClass('blur');
                    }
                },
                myGeo: {
                    show: true,
                    title: '地图',
                    icon: 'M498.16797 127.819131l25.449625 0c44.163849 2.050706 88.164992 10.604522 129.219014 27.243481 85.606727 33.871435 157.853168 99.920734 199.441355 182.036963 26.436092 51.462069 40.429805 109.030206 41.668005 166.821423l0 13.72049c-1.221828 57.046251-14.838963 113.863281-40.634466 164.821883C828.190359 732.651422 791.747355 777.09668 747.660254 811.822576c-45.108361 35.57524-98.339726 60.815087-154.485467 73.03541-22.803355 5.14416-46.112224 7.537673-69.40779 8.930393l-25.475208 0c-30.538527-1.614777-61.011562-5.729491-90.456175-14.121626-71.304999-19.761066-136.410809-60.948117-185.036273-116.687606-34.199916-38.912242-60.307527-84.919065-76.271104-134.209678-11.685133-35.845393-17.638729-73.442686-18.582217-111.11161l0-13.690814c1.363044-69.925582 21.932522-139.396817 59.632145-198.358697 39.975457-62.997799 98.697883-113.964588 166.875658-144.349619C399.562185 140.745535 448.75149 130.048915 498.16797 127.819131L498.16797 127.819131zM425.054789 209.516828c-24.264637 30.491455-40.10951 66.635653-52.974515 103.167684 18.056238 4.53427 36.592406 6.507204 54.965869 9.277294 22.782889 2.349511 45.629223 4.425799 68.565609 4.604878-0.017396-55.547107 0.013303-111.093191-0.017396-166.657694C466.437292 166.057013 442.992323 186.686866 425.054789 209.516828L425.054789 209.516828zM526.278191 326.554404c31.000038-0.555655 61.986773-3.128247 92.610234-8.093329 10.413164-1.332345 20.736277-3.27765 30.92329-5.806239-15.048741-42.75885-34.43937-85.333504-66.246797-118.366851-15.545044-16.293081-34.929534-29.650297-57.238632-34.380018C526.236236 215.459167 526.314007 271.006274 526.278191 326.554404L526.278191 326.554404zM394.790508 178.132026c-54.157457 18.877953-103.561657 51.265594-142.4432 93.439112 28.439726 15.023158 58.913784 26.123984 90.032526 34.097586 16.250102-48.979528 39.049365-97.42182 75.778894-134.478807C410.168754 172.760692 402.493957 175.543062 394.790508 178.132026L394.790508 178.132026zM603.582835 170.965813c7.644097 7.046486 13.793144 15.468296 20.467147 23.381523 25.031093 33.435507 42.536792 71.88726 55.534827 111.411439 31.101345-8.109702 61.489446-19.269879 90.049922-34.093493C725.171054 223.475747 667.001213 187.840132 603.582835 170.965813L603.582835 170.965813zM231.922117 295.52469c-44.01547 57.132208-70.134337 127.864156-72.934103 199.99087 51.04763-0.090051 102.095259-0.030699 153.138796-0.030699 0.986467-54.038754 7.91732-108.013039 21.51399-160.347988C298.377668 325.866742 263.955694 312.995597 231.922117 295.52469L231.922117 295.52469zM688.246073 335.137897c13.599739 52.333926 20.526499 106.309234 21.500687 160.331615 51.077306-0.013303 102.151541 0 153.228847 0-3.003404-72.109318-28.930913-142.884244-73.070202-199.974497C757.952668 313.085648 723.449853 325.776691 688.246073 335.137897L688.246073 335.137897zM342.737992 495.348762c50.958602 0.26913 101.916181 0.047072 152.869666 0.12075L495.607658 357.191168c-44.35623-0.820692-88.747253-5.430686-132.115993-14.930037C350.309434 392.18517 343.874885 443.766966 342.737992 495.348762L342.737992 495.348762zM526.278191 357.177865c0 46.108131 0 92.199888 0.017396 138.291646 50.958602-0.090051 101.912088 0.165776 152.869666-0.132006-1.149173-51.586912-7.584746-103.168708-20.766976-153.105027C615.043864 351.789135 570.639538 356.353081 526.278191 357.177865L526.278191 357.177865zM158.959362 526.121626c2.871397 72.126714 28.936029 142.858662 72.979128 199.99087 31.999808-17.519002 66.468854-30.30726 101.703333-39.642882-13.613042-52.329832-20.48045-106.321514-21.543665-160.347988C261.054621 526.151301 210.006991 526.151301 158.959362 526.121626L158.959362 526.121626zM342.755388 526.241352c1.136893 51.599192 7.493671 103.245456 20.807908 153.165402 43.314505-9.665127 87.717807-14.121626 132.031059-14.97711 0.017396-46.090734 0.017396-92.199888 0.017396-138.290623C444.654172 526.211676 393.696594 526.002922 342.755388 526.241352L342.755388 526.241352zM526.278191 526.139022l0 138.278343c44.391023 0.807389 88.781022 5.473665 132.168182 14.915711 12.984732-50.013067 19.85214-101.612259 20.527522-153.271826C628.075669 526.241352 577.177442 526.097066 526.278191 526.139022L526.278191 526.139022zM709.733457 526.139022c-0.896416 54.021358-7.91732 107.995643-21.471011 160.330592 35.218106 9.28855 69.673849 22.081924 101.660354 39.630602 44.13315-57.075927 70.049403-127.851876 73.052806-199.947891C811.898301 526.121626 760.806669 526.151301 709.733457 526.139022L709.733457 526.139022zM372.109949 708.851367c14.912641 42.860157 34.45165 85.46551 66.276473 118.528534 15.527648 16.262382 34.918277 29.607318 57.207933 34.30327 0.047072-55.530734 0-111.076818 0.017396-166.624948C454.153524 695.877891 412.667667 700.100052 372.109949 708.851367L372.109949 708.851367zM526.278191 695.040826c0.017396 55.547107-0.029676 111.11161 0.034792 166.657694 29.093619-6.148024 52.525284-26.705222 70.433142-49.505507 24.312732-30.53341 40.258912-66.720587 53.052287-103.34267-18.59552-4.491291-37.614689-6.65763-56.507992-9.395998C570.998719 697.284937 548.690644 695.177949 526.278191 695.040826L526.278191 695.040826zM252.286933 749.959623c44.446281 48.154743 102.586446 83.83743 165.991522 100.639095-36.729529-37.148062-59.665915-85.58933-75.886341-134.671189C311.200718 723.792661 280.876062 735.222991 252.286933 749.959623L252.286933 749.959623zM679.555134 715.89683c-16.322757 49.112558-39.211047 97.614202-76.018348 134.808312 63.362096-16.950044 121.54524-52.495608 166.009941-100.667747C741.134631 734.98763 710.644199 723.972762 679.555134 715.89683L679.555134 715.89683zM679.555134 715.89683',
                    onclick: this.useGeoChart
                },
                myPie: {
                    show: true,
                    title: '饼状图',
                    icon: 'M467 732q-93 0 -177.5 -36t-146 -97.5t-97.5 -146t-36 -178t36 -178t97.5 -146t146 -97.5t177.5 -36t178 36t146 97.5t97.5 146t36.5 177.5h-458v458zM515 786v-457l314 333q-135 124 -314 124zM1018 303q0 97 -38 183.5t-106 149.5l-314 -333v-3h458v3z',
                    onclick: this.usePieChart
                },
                myLine: {
                    show: true,
                    title: '折线/柱状图',
                    icon: 'M199 299h-66q-14 0 -23.5 -9.5t-9.5 -23.5v-197q0 -13 9.5 -23t23.5 -10h66q13 0 23 10t10 23v197q0 14 -10 23.5t-23 9.5zM363 365h-66q-13 0 -22.5 -9.5t-9.5 -23.5v-263q0 -13 9.5 -23t22.5 -10h66q14 0 23.5 10t9.5 23v263q0 14 -9.5 23.5t-23.5 9.5zM528 464h-66q-14 0 -23.5 -10t-9.5 -23v-362q0 -13 9.5 -23t23.5 -10h66q13 0 22.5 10t9.5 23v362q0 13 -9.5 23t-22.5 10zM692 398h-66q-13 0 -23 -9.5t-10 -23.5v-296q0 -13 10 -23t23 -10h66q14 0 23.5 10t9.5 23v296q0 14 -9.5 23.5t-23.5 9.5zM856 529h-65q-14 0 -23.5 -9.5t-9.5 -22.5v-428q0 -13 9.5 -23t23.5 -10h65q14 0 23.5 10t9.5 23v428q0 13 -9.5 22.5t-23.5 9.5zM166 404q25 0 42.5 17.5t17.5 42.5q0 7 -2 14l67 40q17 -15 39 -15q25 0 42.5 17.5t17.5 41.5q0 11 -4 21l77 60q14 -9 32 -9q34 0 51 29l54 -10q3 -22 20 -37t39 -15q25 0 42.5 17.5t17.5 42.5q0 10 -4 20l75 62q15 -10 33 -10q25 0 42.5 17.5t17.5 42t-17.5 42t-42 17.5t-42 -17.5t-17.5 -42.5q0 -10 3 -20l-75 -62q-15 11 -33 11q-36 0 -52 -32l-53 10q-2 23 -19 38.5t-40 15.5q-25 0 -42.5 -17t-17.5 -42q0 -12 4 -22l-75 -60q-16 10 -34 10q-24 0 -41.5 -17.5t-17.5 -42.5q0 -6 1 -13l-68 -39q-17 13 -38 13q-25 0 -42.5 -17.5t-17.5 -42t17.5 -42t42.5 -17.5z',
                    onclick: this.useLineBarChart
                },
                saveAsImage: {}
            },
            itemSize: 22,
            itemGap: 12,
            showTitle: false,
            orient: 'vertical'
        };

        this.lineGrid = {
            left: 'auto',
            right: 60,
            show: true,
            containLabel: true
        };

        this.data = {};

        this.state = {
            group: {show: false},
            split: {show: false},
            select: {show: false},
            filter: {show: false, items: {}}
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.initEcharts();

        this.loadData();
    }

    initEcharts() {
        this.charts = Echarts.init(document.getElementById('chart-order'));
        this.charts.on('mapselectchanged', this.onGeoSelected);
        $(window).resize(this.resize);
    }

    loadData(request) {
        this.charts.showLoading();

        if (typeof request === 'object') {
            this.request = request;
        }

        H.server.bi_order(this.request, this.onDataLoaded);

        return this;
    }

    onDataLoaded(res) {
        this.data = res.data;
        this.refreshData();

        this.charts.hideLoading();
    }

    refreshData() {
        if (this.isLineBar()) {
            this.lineBarChart();
        } else if (this.isPie()) {
            this.pieChart();
        } else if (this.isGeo()) {
            this.geoChart();
        }
    }

    isPie() {
        return !this.isGeo() && this.request.hasOwnProperty('group') && this.request.group === 'none';
    }

    isLineBar() {
        return !this.isPie() && !this.isGeo();
    }

    isGeo() {
        return this.chartsType === 'geo';
    }

    useLineBarChart() {
        if (this.chartsType === 'line') {
            return;
        }

        if (this.hasOwnProperty('request') &&
            this.request.hasOwnProperty('group') &&
            this.request.group == 'none') {
            if (this.hasOwnProperty('previousGroup')) {
                this.request.group = this.previousGroup;
                delete this.previousGroup;
            } else {
                delete this.request.group;
            }
        }

        if (this.hasOwnProperty('previousSplit')) {
            this.request.split = this.previousSplit;
        }

        if (this.hasOwnProperty('previousBuyerFilter')) {
            this.request.filter.buyer = this.previousBuyerFilter;
        }

        this.hideGeoGoBack();

        this.loadData();

        this.chartsType = 'line';
    }

    lineBarChart() {
        let series = [];

        let price_data = {};
        let num_data = {};

        let legend = {data: []};

        let yAxis = [];

        for (let i in this.data) {
            let d = this.data[i];
            for (let n in d) {
                if (d[n].hasOwnProperty('total_price')) {
                    if (!price_data.hasOwnProperty(n)) {
                        price_data[n] = {
                            name: n + '销售额',
                            type: 'line',
                            stack: '总销售额',
                            areaStyle: {normal: {}},
                            data: [],
                            legendHoverLink: true
                        };
                        legend.data.push(n + '销售额');
                    }
                    price_data[n].data.push(Number(d[n]['total_price']));
                } else if (d[n].hasOwnProperty('total_num')) {
                    if (!num_data.hasOwnProperty(n)) {
                        num_data[n] = {
                            name: n + '销量',
                            type: 'line',
                            stack: '总销量',
                            data: [],
                            legendHoverLink: true
                        };
                        legend.data.push(n + '销量');
                    }
                    num_data[n].data.push(Number(d[n]['total_num']));
                }
            }
        }

        let hasPriceData = Object.keys(price_data).length > 0;
        let hasNumData = Object.keys(num_data).length > 0;

        let priceYAxisIndex = 0;
        let numYAxisIndex = 0;

        if (hasPriceData) {
            priceYAxisIndex = yAxis.push({
                    type: 'value',
                    name: '销售额',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                }) - 1;

            for (let i in price_data) {
                price_data[i].yAxisIndex = priceYAxisIndex;
                series.push(price_data[i]);
            }
        } else if (hasNumData) {
            numYAxisIndex = yAxis.push({
                    type: 'value',
                    name: '销量',
                    axisLabel: {
                        formatter: '{value} 件'
                    }
                }) - 1;

            for (let i in num_data) {
                num_data[i].yAxisIndex = numYAxisIndex;
                series.push(num_data[i]);
            }
        }

        this.options = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: $.extend({}, this.toolbox),
            lineGrid: this.lineGrid,
            xAxis: [
                {
                    type: 'category',
                    data: Object.keys(this.data)
                }
            ],
            yAxis: yAxis,
            series: series,
            legend: legend
        };

        this.charts.setOption(this.options, true);
    }

    usePieChart() {
        if (this.chartsType === 'pie') {
            return;
        }

        if (this.chartsType === 'line') {
            this.previousGroup = this.request.group;
        }

        this.request.group = 'none';

        if (this.hasOwnProperty('previousSplit')) {
            this.request.split = this.previousSplit;
        }

        if (this.hasOwnProperty('previousBuyerFilter')) {
            this.request.filter.buyer = this.previousBuyerFilter;
        }

        this.hideGeoGoBack();

        this.loadData();

        this.chartsType = 'pie';
    }

    pieChart() {
        let legend = {
            data: []
        };

        let series = [];

        let price_data = [];
        let num_data = [];

        for (let n in this.data) {
            legend.data.push(n);

            if (this.data[n].hasOwnProperty('total_price')) {
                price_data.push({
                    name: n,
                    value: Number(this.data[n]['total_price'])
                });
            }

            if (this.data[n].hasOwnProperty('total_num')) {
                num_data.push({
                    name: n,
                    value: Number(this.data[n]['total_num'])
                });
            }
        }

        let bothOption = {
            radius: [0, '37.5%']
        };

        if (price_data.length > 0) {
            let price_series = {
                name: '销售额(元)',
                type: 'pie',
                data: price_data
            };

            if (bothOption) {
                price_series = $.extend({
                    center: ['25%', '50%']
                }, bothOption, price_series);
            }

            series.push(price_series);
        }

        if (num_data.length > 0) {
            let num_series = {
                name: '销量(件)',
                type: 'pie',
                data: num_data
            };

            if (bothOption) {
                num_series = $.extend({
                    center: ['75%', '50%']
                }, bothOption, num_series);
            }

            series.push(num_series);
        }

        this.options = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            toolbox: $.extend({}, this.toolbox),
            series: series,
            legend: legend
        };

        this.charts.setOption(this.options, true);
    }

    useGeoChart() {
        if (this.chartsType === 'geo') {
            return;
        }

        if (this.chartsType === 'line') {
            this.previousGroup = this.request.group;
        }

        if (this.hasOwnProperty('previousBuyerFilter')) {
            this.request.filter.buyer = this.previousBuyerFilter;
        }

        this.request.group = 'none';

        this.chartsType = 'geo';

        if (this.request.hasOwnProperty('split')) {
            this.previousSplit = $.extend({}, this.request.split);
        }

        this.request.split = {
            buyer: {
                geo: '1'
            }
        };

        this.isGeoProvince = false;

        this.loadData();
    }

    geoChart() {
        let series = [];

        let province = {
            '安徽省': 'anhui',
            '澳门': 'aomen',
            '北京市': 'beijing',
            '重庆市': 'chongqing',
            '福建省': 'fujian',
            '甘肃省': 'gansu',
            '广东省': 'guangdong',
            '广西': 'guangxi',
            '贵州省': 'guizhou',
            '海南省': 'hainan',
            '河北省': 'hebei',
            '黑龙江': 'heilongjiang',
            '河南省': 'henan',
            '湖北省': 'hubei',
            '湖南省': 'hunan',
            '江苏省': 'jiangsu',
            '江西省': 'jiangxi',
            '吉林省': 'jilin',
            '辽宁省': 'liaoning',
            '内蒙古': 'neimenggu',
            '宁夏': 'ningxia',
            '青海省': 'qinghai',
            '山东省': 'shandong',
            '上海市': 'shanghai',
            '山西省': 'shanxi',
            '陕西省': 'shanxi1',
            '四川省': 'sichuan',
            '台湾省': 'taiwan',
            '天津市': 'tianjin',
            '香港': 'xianggang',
            '新疆': 'xinjiang',
            '西藏': 'xizang',
            '云南省': 'yunnan',
            '浙江省': 'zhejiang'
        };

        let nameMap = {
            '安徽': '安徽省',
            '澳门': '澳门',
            '北京': '北京市',
            '重庆': '重庆市',
            '福建': '福建省',
            '甘肃': '甘肃省',
            '广东': '广东省',
            '广西': '广西',
            '贵州': '贵州省',
            '海南': '海南省',
            '河北': '河北省',
            '黑龙': '黑龙江',
            '河南': '河南省',
            '湖北': '湖北省',
            '湖南': '湖南省',
            '江苏': '江苏省',
            '江西': '江西省',
            '吉林': '吉林省',
            '辽宁': '辽宁省',
            '内蒙古': '内蒙古',
            '宁夏': '宁夏',
            '青海': '青海省',
            '山东': '山东省',
            '上海': '上海市',
            '山西': '山西省',
            '陕西': '陕西省',
            '四川': '四川省',
            '台湾': '台湾省',
            '天津': '天津市',
            '香港': '香港',
            '新疆': '新疆',
            '西藏': '西藏',
            '云南': '云南省',
            '浙江': '浙江省'
        };

        let map = 'china';
        let url = 'http://echarts.baidu.com/asset/map/json/';

        if (this.request.filter.hasOwnProperty('buyer') && this.request.filter.buyer.hasOwnProperty('geo') &&
            this.request.filter.buyer.geo.hasOwnProperty('province')) {
            map = province[this.request.filter.buyer.geo.province];
            url = url + 'province/';
        }

        url = url + map + '.json';

        $.ajax({
            url: url,
            async: false,
            success: function (json) {
                echarts.registerMap(map, json);
            }
        });

        let geo = {
            type: 'map',
            roam: true,
            map: map,
            scaleLimit: {
                min: 1,
                max: 3
            },
            zoom: 2,
            nameMap: nameMap,
            selectedMode: 'single'
        };

        let visualMap = {
            min: 0,
            max: 0,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            calculable: true
        };

        let price_data = [];
        let num_data = [];

        let max_price = 0;
        let max_num = 0;

        let group_name = 'buyer_province';
        if (this.isGeoProvince) {
            group_name = 'buyer_city';
        }

        for (var p in this.data) {
            if (this.data[p].hasOwnProperty('total_price')) {
                let v = Number(this.data[p]['total_price']);
                if (v > max_price) {
                    max_price = v;
                }
                price_data.push({
                    name: this.data[p][group_name],
                    value: v
                });
            }

            if (this.data[p.hasOwnProperty('total_num')]) {
                let v = Number(this.data[p]['total_num']);
                if (v > max_num) {
                    max_num = v;
                }
                num_data.push({
                    name: this.data[p][group_name],
                    value: v
                });
            }
        }

        if (num_data.length > 0) {
            visualMap.seriesIndex = series.push($.extend({}, geo, {
                    data: num_data,
                    name: '销量(件)'
                })) - 1;
            visualMap.max = max_num;
        } else if (price_data.length > 0) {
            // 优先使用销售额数据
            visualMap.seriesIndex = series.push($.extend({}, geo, {
                    data: price_data,
                    name: '销售额(元)'
                })) - 1;
            visualMap.max = max_price;
        }

        this.options = {
            tooltip: {
                trigger: 'item'
            },
            toolbox: $.extend({}, this.toolbox),
            series: series,
            visualMap: visualMap
        };

        if (this.isGeoProvince) {
            this.showGeoGoBack();
        }

        this.charts.setOption(this.options, true);
    }

    onGeoSelected(event) {
        if (this.isGeoProvince) {
            return;
        }

        let province = event.name;

        if (!this.request.filter.hasOwnProperty('buyer')) {
            this.request.filter.buyer = {};
            this.previousBuyerFilter = {};
        } else {
            this.previousBuyerFilter = $.extend({}, this.request.filter.buyer);
        }

        this.request.filter.buyer.geo = {province: province};

        this.request.split = {
            buyer: {
                geo: '1,1'
            }
        };

        this.loadData();

        this.isGeoProvince = true;
    }

    onGeoGoBack() {
        delete this.request.filter.buyer.geo;
        this.request.split = {
            buyer: {
                geo: '1'
            }
        };

        this.loadData();
        this.isGeoProvince = false;
        this.hideGeoGoBack();
    }

    showGeoGoBack() {
        this.toolbox.feature.myGeoGoBack = {
            show: true,
            title: '后退',
            icon: 'M531.6803 366.1998h-6.3539200000000005c0-71.1414 0-126.9494 0-143.1818 0-53.5388-30.72-75.8436-68.5312-45.4236L104.9661 460.6413c-37.8112 30.4292-37.7856 80.1372 0.0584 110.5039l349.1471 280.1306c37.8399 30.3432 71.1547-0.4844 71.1547-45.5434 0-14.5111 0-74.5359 0-151.0339h52.885504000000005c152.6743 0 269.1236 65.9579 340.5445 193.2196 13.995 23.0943 28.673 18.0582 28.673 0C944.3871 621.1676 752.3512 366.1998 531.6803 366.1998z',
            onclick: this.onGeoGoBack
        };
    }

    hideGeoGoBack() {
        delete this.toolbox.feature.myGeoGoBack;
    }

    toggleFullScreen() {
        $('.charts-wrap').toggleClass('fullscreen');
        this.resize();
    }

    render() {
        let self = this;
        return (
            <div className="charts-wrap">
                <div id="chart-order" className="charts" style={{
                    height: window.innerHeight - 140,
                    marginTop: 20,
                    marginRight: '1%'
                }}></div>
                <div className="chart-modal">
                    <div className="form col-lg-4">
                        <legend>基本设置</legend>
                        <div className="form-group">
                            <label>统计项</label>
                            <RadioGroup param={[
                                {id:'price', name:'销售收入'},
                                {id:'num', name:'销量'}
                            ]}
                                        defaultVal={this.request.select[0]}
                                        name="select"
                                        index="2"
                                        identify="2"
                                        changeHandler={function(i, e){
                                            self.request.select = [e.target.value];
                                            this.props.defaultVal = self.request.group[0];
                                            this.forceUpdate();
                                        }}
                                />
                        </div>
                        <div className="form-group">
                            <label>分组方式</label>
                            <RadioGroup param={[
                                {id:'day', name:'按日'},
                                {id:'week', name:'按周'},
                                {id:'month', name:'按月'},
                                {id:'year', name:'按年'},
                                {id:'none', name: '无'}
                            ]}
                                        defaultVal={this.request.group}
                                        name="group"
                                        index="1"
                                        identify="1"
                                        changeHandler={function(i, e) {
                                            self.request.group = e.target.value;
                                            this.props.defaultVal = self.request.group;
                                            this.forceUpdate();
                                        }}
                                />
                        </div>
                        <div className="form-group">
                            <label>日期范围</label>
                            <DatePicker start={this.request.time[0]}
                                        end={this.request.time[1]}
                                        prefix="charts_order_date_"
                                        otherClass="input"
                                        changeCallback={function() {
                                            self.request.time = [
                                                $('#charts_order_date_startTime').val(),
                                                $('#charts_order_date_endTime').val()
                                            ];
                                        }}/>
                        </div>
                    </div>
                    <div className="form col-lg-4">
                        <legend>数据分组</legend>
                        <div className="form-group">
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="buyer.type" handler={function(v, e) {
                                    if (!self.request.split.hasOwnProperty('buyer')) {
                                        self.request.split.buyer = {};
                                    }

                                    if (e.target.checked) {
                                        self.request.split.buyer.type = 1;
                                    } else {
                                        delete self.request.split.buyer.type;
                                    }
                                }}/>
                                <span>买家类型</span>
                            </label>
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="buyer.market" handler={function(v, e) {
                                    if (!self.request.split.hasOwnProperty('buyer')) {
                                        self.request.split.buyer = {};
                                    }

                                    if (e.target.checked) {
                                        self.request.split.buyer.market = 1;
                                    } else {
                                        delete self.request.split.buyer.market;
                                    }
                                }}/>
                                <span>买家市场</span>
                            </label>

                            <label className="checkbox-inline">
                                <Input type="checkbox" name="seller.type" handler={function(v, e) {
                                    if (!self.request.split.hasOwnProperty('seller')) {
                                        self.request.split.seller = {};
                                    }

                                    if (e.target.checked) {
                                        self.request.split.seller.type = 1;
                                    } else {
                                        delete self.request.split.seller.type;
                                    }
                                }}/>
                                <span>卖家类型</span>
                            </label>
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="seller.market" handler={function(v, e) {
                                    if (!self.request.split.hasOwnProperty('seller')) {
                                        self.request.split.seller = {};
                                    }

                                    if (e.target.checked) {
                                        self.request.split.seller.market = 1;
                                    } else {
                                        delete self.request.split.seller.market;
                                    }

                                }}/>
                                <span>卖家市场</span>
                            </label>
                            <br />
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="goods.brand" handler={function(v, e) {
                                    if (!self.request.split.hasOwnProperty('goods')) {
                                        self.request.split.goods = {};
                                    }

                                    if (e.target.checked) {
                                        self.request.split.goods.brand = 1;
                                    } else {
                                        delete self.request.split.goods.brand;
                                    }
                                }}/>
                                <span>商品品牌</span>
                            </label>
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="delivery" handler={function(v, e) {
                                    if (e.target.checked) {
                                        self.request.split.delivery = 1;
                                    } else {
                                        delete self.request.split.delivery;
                                    }
                                }}/>
                                <span>配送方式</span>
                            </label>
                            <label className="checkbox-inline">
                                <Input type="checkbox" name="status" handler={function(v, e) {
                                    if (e.target.checked) {
                                        self.request.split.status = 1;
                                    } else {
                                        delete self.request.split.status;
                                    }
                                }}/>
                                <span>订单状态</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>买家区域</label>
                            <DropDown changeEv={function(v) {
                                if (!self.request.split.hasOwnProperty('buyer')) {
                                    self.request.split.buyer = {};
                                }
                                if (v != '0') {
                                    self.request.split.buyer.geo = v;
                                } else {
                                    delete self.request.split.buyer.geo;
                                }
                            }}
                                      dropdownData={[
                                    '-- 请选择 --', '省', '市', '区'
                                  ]}
                                      checkData={[
                                    '0', '1', '1.1', '1.1.1'
                                  ]}/>
                        </div>
                        <div className="form-group">
                            <label>卖家区域</label>
                            <DropDown changeEv={function(v) {
                                if (!self.request.split.hasOwnProperty('seller')) {
                                    self.request.split.seller = {};
                                }
                                if (v != '0') {
                                    self.request.split.seller.geo = v;
                                } else {
                                    delete self.request.split.seller.geo;
                                }
                            }}
                                      dropdownData={[
                                    '-- 请选择 --', '省', '市', '区'
                                  ]}
                                      checkData={[
                                    '0', '1', '1.1', '1.1.1'
                                  ]}/>
                        </div>
                        <div className="form-group">
                            <label>价格分段</label>
                            <Input placeholder="价格分段单位"
                                   type="number"
                                   name="goods.price"
                                   class="form-control"
                                   handler={function(v) {
                                        if (!self.request.split.hasOwnProperty('goods')) {
                                            self.request.split.goods = {};
                                        }

                                        if (v.length > 0 && v != 0) {
                                            self.request.split.goods.price = v;
                                        } else {
                                            delete self.request.split.goods.price;
                                        }
                                }}/>
                        </div>
                        <div className="form-group">
                            <label>订单件数分段</label>
                            <Input placeholder="件数分段单位"
                                   type="number"
                                   name="num"
                                   class="form-control"
                                   handler={function(v) {
                                        if (v.length > 0 && v != 0) {
                                            self.request.split.num = v;
                                        } else {
                                            delete self.request.split.num;
                                        }
                                }}/>
                        </div>
                        <div className="form-group">
                            <label>订单总价分段</label>
                            <Input placeholder="件数分段单位"
                                   type="number"
                                   name="price"
                                   class="form-control"
                                   handler={function(v) {
                                        if (v.length > 0 && v != 0) {
                                            self.request.split.price = v;
                                        } else {
                                            delete self.request.split.price;
                                        }
                                }}/>
                        </div>
                        <div className="form-group">
                            <label>支付</label>
                            <DropDown changeEv={function(v) {
                                if (v != '0') {
                                    self.request.split.pay = v;
                                } else {
                                    delete self.request.split.pay;
                                }
                            }}
                                      dropdownData={[
                                    '-- 请选择 --', '支付方式', '支付渠道(付款到平台)'
                                  ]}
                                      checkData={['0', 'method', 'channel']}/>
                        </div>
                    </div>
                    <Filter parent={self}/>

                    <div className="clearfix"></div>
                    <div className="row">
                        <Btn otherClass="btn-lg btn-default"
                             btnEvent={function() {
                        self.loadData();
                        $('.chart-modal').toggleClass('active');
                        $('#chart-order').toggleClass('blur');
                     }}
                             name="应用"
                            />
                        <Btn otherClass="btn-lg"
                             btnEvent={function() {
                        $('.chart-modal').toggleClass('active');
                        $('#chart-order').toggleClass('blur');
                     }}
                             name="取消"
                            />
                    </div>
                </div>
            </div>
        );
    }

    resize() {
        $('.charts-wrap .charts').height(window.innerHeight - 140);
        this.charts.resize();
    }
}

export default SellData;