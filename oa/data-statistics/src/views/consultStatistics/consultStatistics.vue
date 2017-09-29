<template>
    <div>
        <div class="layout-header">
            <h1>商品咨询</h1>
        </div>
        <Tabs :animated="false">
            <Tab-pane label="咨询统计">
                <Affix>
                    <span class="demo-affix">数据说明：用户点击咨询后记录一次</span>
                </Affix>
                <div class="selectlist">
                    <div><h4>咨询趋势</h4></div>
                    <Radio-group v-model="params.group" type="button">
                        <Radio label="day">按日查看</Radio>
                        <Radio label="week">按周查看</Radio>
                        <Radio label="month">按月查看</Radio>
                        <Radio label="year">按年查看</Radio>
                    </Radio-group>
                </div>
                <div class="selectlist mainselect">
                    <Select v-model="dayslenthmodel1" style="width:150px" @on-change="dayslenthChange1">
                        <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                    <Date-picker format="yyyy-MM-dd" @on-change="startdayChange" v-model="params1startday" type="date"
                                 placeholder="选择日期" style="width: 150px"></Date-picker>
                    至
                    <Date-picker format="yyyy-MM-dd" @on-change="enddayChange" v-model="params1endday" type="date"
                                 placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                    <Select @on-change="proviceChange" style="width:150px" clearable placeholder="所有省/市">
                        <Option v-for="item in proviceList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                    <Select @on-change="cityChange" style="width:150px" clearable placeholder="所有市">
                        <Option v-for="item in cityList" :value="item.buyer_city" :key="index">{{ item.buyer_city }}
                        </Option>
                    </Select>
                    <Select @on-change="districtChange" style="width:150px" clearable placeholder="所有区">
                        <Option v-for="item in districtList" :value="item.buyer_district" :key="index">
                            {{ item.buyer_district }}
                        </Option>
                    </Select>
                    <Button type="success" @click="select">确认筛选</Button>
                </div>

                <Card style="width:100%" :bordered="true">
                    <Spin size="large" fix v-if="spinShow1"></Spin>
                    <div id="chartPic" style="width: 100%; height: 500px"></div>
                </Card>

            </Tab-pane>
            <Tab-pane label="咨询排行">
                <h4>基础排行</h4>
                <div class="selectlist mainselect">
                    <Select v-model="dayslenthmodel" style="width:150px" @on-change="dayslenthChange2">
                        <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                    <Date-picker format="yyyy-MM-dd" @on-change="startdayChange2" v-model="params2startday" type="date"
                                 placeholder="选择日期" style="width: 150px"></Date-picker>
                    至
                    <Date-picker format="yyyy-MM-dd" @on-change="enddayChange2" v-model="params2endday" type="date"
                                 placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                    <Select @on-change="proviceChange2" clearable style="width:150px" placeholder="所有省/市">
                        <Option v-for="item in proviceList" :value="item" :key="index">{{ item }}</Option>
                    </Select>
                    <Select @on-change="cityChange2" clearable style="width:150px" placeholder="所有市">
                        <Option v-for="item in cityList2" :value="item.buyer_city" :key="index">{{ item.buyer_city }}
                        </Option>
                    </Select>
                    <Select @on-change="districtChange2" clearable style="width:150px" placeholder="所有区">
                        <Option v-for="item in districtList2" :value="item.buyer_district" :key="index">
                            {{ item.buyer_district }}
                        </Option>
                    </Select>
                    <Button type="success" @click="baseRankselect">确认筛选</Button>
                </div>
                <div class="selectlist">
                    <div><h4>基础咨询</h4></div>
                </div>
                <Tabs type="card" :animated="false" @on-click="tabclick">
                    <Tab-pane label="按咨询商品">

                        <Table :columns="goodscolumns" stripe :data="goodsdata" size="small" :context="self">
                        </Table>
                        <Page :current="params2.page" :total="basetotal" :page-size="10" class-name="page" simple
                              show-elevator @on-change="basechangePage"></Page>
                    </Tab-pane>
                    <Tab-pane label="按咨询品牌">
                        <Table :columns="brandcolumns" stripe size="small" :data="goodsdata" :context="self">
                        </Table>
                        <Page :current="params2.page" :total="basetotal" class-name="page" :page-size="10" simple
                              show-elevator @on-change="basechangePage"></Page>
                    </Tab-pane>
                    <Tab-pane label="按咨询商品分类">
                        <Table :columns="sortcolumns" stripe size="small" :data="goodsdata" :context="self">
                        </Table>
                        <Page :current="params2.page" :total="basetotal" :page-size="10" class-name="page" simple
                              show-elevator @on-change="basechangePage"></Page>
                    </Tab-pane>
                </Tabs>


                <div>
                    <div class="selectlist">
                        <Button type="text">咨询买家</Button>
                        <Select style="width:150px" clearable @on-change="buyerChange">
                            <Option v-for="item in buyerConsultList" :value="item.value" :key="item">{{ item.label }}
                            </Option>
                        </Select>
                    </div>
                    <Card :bordered="true" style="width:100%">
                        <Spin size="large" fix v-if="spinShow3"></Spin>
                        <div style="width: 100%">
                            <Table stripe :context="self" :columns="buyerConsultcolumns"
                                   :data="buyerConsultdata"></Table>
                            <Page :current="buyerparams.page" :total="buyertotal" :page-size="10" class-name="page"
                                  show-elevator @on-change="buyerchangePage" simple></Page>
                        </div>
                    </Card>
                </div>

                <div>
                    <h4 style="margin-top: 16px">被咨询卖家排行</h4>
                    <div class="selectlist mainselect">
                        <Select v-model="dayslenthmodel2" style="width:150px" @on-change="dayslenthChange3">
                            <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                        <Date-picker format="yyyy-MM-dd" @on-change="startdayChange3" v-model="params3startday"
                                     type="date" placeholder="选择日期" style="width: 150px"></Date-picker>
                        至
                        <Date-picker format="yyyy-MM-dd" @on-change="enddayChange3" v-model="params3endday" type="date"
                                     placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                        <Select @on-change="proviceChange3" style="width:150px" clearable placeholder="所有省/市">
                            <Option v-for="item in proviceList3" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                        <div @click="provinceSelect">
                            <Select @on-change="marketChange3" style="width:150px" clearable placeholder="全部市场">
                                <Option v-for="item in marketList" :value="item.seller_market" :key="index">
                                    {{ item.seller_market }}
                                </Option>
                            </Select>
                        </div>
                        <Button type="success" @click="sellerRankselect">确认筛选</Button>
                    </div>
                    <Card :bordered="true" style="width:100%;margin-bottom: 40px;">
                        <Spin size="large" fix v-if="spinShow4"></Spin>
                        <div style="width: 100%;">
                            <Table stripe :context="self" :columns="sellerConsultcolumns"
                                   :data="sellerConsultdata"></Table>
                            <Page :current="params3.page" :total="sellertotal" class-name="page" :page-size="10"
                                  show-elevator simple @on-change="sellerpageChange"></Page>
                        </div>
                    </Card>
                </div>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
    import eCharts from 'echarts';

    export default {
        data() {
            return {
                basetotal: 0,    //基础排行总数据条数
                buyerConsultList: [
                    {value: '一批', label: '一批'}, {value: '二批', label: '二批'}, {value: '全部', label: '全部'}],  //买家咨询的下拉选择
                total: 0,
                buyertotal: 0,
                sellertotal: 0,
                self: this,
                params2: { //基础咨询的参数
                    time: [],
                    page: 1,
                    size: 10,
                    column: 'goods_name',
                    filter: {}
                },
                buyerparams: {
                    time: [],
                    page: 1,
                    size: 10,
                    column: 'buyer_name',
                    filter: {
                        buyer_type: []
                    }
                },
                buyerConsultdata: [],
                sellerConsultdata: [],
                goodsrate: 0,   //基础咨询-咨询商品比例
                startday: '',
                goodsdata: [],
                branddata: [],
                sortdata: [],
                markemodel: [],
                provicemodel: [],
                citymodel: [],
                districtmodel: [],
                endday: '',
                params1startday: '',
                params1endday: '',
                goodscolumns: [{
                    title: '排名',
                    width: 160,
                    render(row, column, index) {
                        return `<div>{{(params2.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '商品', width: 160, key: 'goods_name'}, {title: '咨询次数', width: 160, key: 'call_times'},
                    {
                        title: ' ',
                        render(row) {
                            return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                        }
                    }
                ],
                brandcolumns: [{
                    title: '排名',
                    width: 160,
                    render(row, column, index) {
                        return `<div>{{(params2.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '品牌', width: 160, key: 'goods_brand'}, {title: '咨询次数', width: 160, key: 'call_times'},
                    {
                        title: ' ',
                        render(row) {
                            return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                        }
                    }
                ],
                sortcolumns: [{
                    title: '排名',
                    width: 160,
                    render(row, column, index) {
                        return `<div>{{(params2.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '分类', width: 160, key: 'goods_sort'}, {title: '咨询次数', width: 160, key: 'call_times'},
                    {
                        title: ' ',
                        render(row) {
                            return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                        }
                    }
                ],
                buyerConsultcolumns: [
                    {
                        title: '排名',
                        width: 160,
                        render(row, column, index) {
                            return `<div>{{(buyerparams.page-1)*10+${index}+1}}</div>`;
                        }
                    },
                    {
                        title: '店铺名',
                        key: 'buyer_name'
                    },
                    {
                        title: '店铺属性',
                        key: 'buyer_type'
                    },
                    {
                        title: '联系电话',
                        key: 'telnumber'
                    },
                    {
                        title: '咨询商品次数',
                        key: 'call_times'
                    },
                    {
                        title: '咨询卖家数量',
                        key: 'seller_num'
                    }
                ],
                sellerConsultcolumns: [
                    {
                        title: '排名',
                        render(row, column, index) {
                            return `<div>{{(params3.page-1)*10+${index}+1}}</div>`;
                        }
                    },
                    {
                        title: '店铺名', key: 'seller_name'
                    },
                    {
                        title: '被咨询次数',
                        key: 'call_times'
                    },
                    {
                        title: '被咨询商品个数',
                        key: 'goods_num'
                    },
                    {
                        title: '咨询买家数量',
                        key: 'buyer_num'
                    }
                ],
                basedata: [],
                dayslenth: [{value: '30', label: '近30天'}, {value: '15', label: '近15天'}, {value: '7', label: '近7天'}],
                proviceList: [],
                proviceList3: [],
                cityList: [],
                cityList2: [],
                districtList: [],
                districtList2: [],
                marketList: [],  //被咨询卖家排行-全部市场
                goods_sort: [],
                goods_brand: [],
                dayslenthmodel1: '30',
                dayslenthmodel2: '30',
                dayslenthmodel: '30',
                params: { //咨询统计参数
                    time: [],
                    group: 'day',
                    filter: {}
                },
                params3: { //被咨询卖家排行
                    time: [],
                    column: 'seller_name',
                    page: 1,
                    size: 10,
                    filter: {}
                },
                filterparams: { //筛选项参数
                    time: [],
                    filter: ['buyer_province', 'buyer_city', 'buyer_district', 'goods_sort', 'goods_brand', 'buyer_type', 'seller_market', 'seller_province']
                },
                cityparams: {  //市的接口
                    areaName: '四川省',
                    role: 'buyer_province'
                },
                contyparams: {
                    areaName: '成都市',
                    role: 'buyer_city'
                },
                cityparams2: {  //市的接口
                    areaName: '四川省',
                    role: 'buyer_province'
                },
                contyparams2: {
                    areaName: '成都市',
                    role: 'buyer_city'
                },
                cityparams3: {  //市的接口
                    areaName: '四川省',
                    role: 'seller_province',
                    type: 'market'
                },
                spinShow1: true,
                spinShow2: true,
                spinShow3: true,
                spinShow4: true,
                dataList: []
            };
        },
        methods: {
            tabclick(e) {
                var _this = this;
                _this.params2.page = 1;
                if (e == 0) _this.params2.column = 'goods_name';
                if (e == 1) _this.params2.column = 'goods_brand';
                if (e == 2) _this.params2.column = 'goods_sort';
                _this.getBaseConsultData();
            },
            buyerChange(e) {
                if (e == '全部') {
                    delete this.buyerparams.filter.buyer_type;
                }
                else {
                    this.buyerparams.filter.buyer_type = [e];
                }
                this.getbuyerConsultData();
            },
            basechangePage(e) {  //基础排行下一页
                this.params2.page = e;
                this.getBaseConsultData();
            },
            buyerchangePage(e) {
                this.buyerparams.page = e;
                this.getbuyerConsultData();
            },
            sellerpageChange(e) {
                this.params3.page = e;
                this.getSellerConsultData();
            },
            select() { //咨询统计
                this.getBaseData();
            },
            baseRankselect() {  //基础排行
                this.getBaseConsultData();
                // this.getbuyerConsultData();
            },
            sellerRankselect() { //被咨询卖家排行
                var obj = this.params3.filter;
                if (obj.seller_market) {
                    if (obj.seller_province == undefined || obj.seller_province[0] == '') {
                        this.$Message.warning('请先选择省市', 1.5);
                        return;
                    }
                }
                this.params3.page = 1;
                this.getSellerConsultData();
            },
            provinceSelect() {
                var obj = this.params3.filter;
                if (obj.seller_province == undefined || obj.seller_province[0] == '') {
                    this.$Message.warning('请先选择省市', 1.5);
                    return;
                }
            },
            proviceChange(e) {  //咨询统计
                var obj = this.params.filter;
                if (e == '' || e == '全部') {
                    delete this.params.filter.buyer_province;
                    this.cityList = [];
                    this.districtList = [];
                    return;
                }
                obj = Object.assign(obj, {'buyer_province': [e]});
                this.params.filter = obj;
                this.cityList = [];
                this.districtList = [];
                this.cityparams.areaName = e;
                this.getCity();
            },
            proviceChange2(e) {
                var obj = this.params2.filter;
                var obj1 = this.buyerparams.filter;
                if (e == '' || e == '全部') {
                    this.cityList2 = [];
                    this.districtList2 = [];
                    delete this.params2.filter.buyer_province;
                    delete this.buyerparams.filter.buyer_province;
                    return;
                }
                obj = Object.assign(obj, {'buyer_province': [e]});
                this.params2.filter = obj;
                obj1 = Object.assign(obj1, {'buyer_province': [e]});
                this.buyerparams.filter = obj1;
                this.cityList = [];
                this.districtList = [];
                this.cityparams2.areaName = e;
                this.getCity2();
            },
            proviceChange3(e) {
                var obj = this.params3.filter;
                if (e == '' || e == '全部') {
                    delete  this.params3.filter.seller_province;
                    this.marketList = [];
                    return;
                }
                obj = Object.assign(obj, {'seller_province': [e]});
                this.params3.filter = obj;
                this.marketList = [];
                this.cityparams3.areaName = e;
                this.getmarkect();
            },
            cityChange(e) {
                var obj = this.params.filter;
                if (e == '' || e == '全部') {
                    delete this.params.filter.buyer_city;
                    this.districtList = [];
                    return;
                }
                obj = Object.assign(obj, {'buyer_city': [e]});
                this.params.filter = obj;
                this.districtList = [];
                this.contyparams.areaName = e;
                this.getConty();
            },
            cityChange2(e) {
                var obj = this.params2.filter;
                var obj1 = this.buyerparams.filter;
                if (e == '' || e == '全部') {
                    delete this.params2.filter.buyer_city;
                    delete this.buyerparams.filter.buyer_city;
                    return;
                }
                obj = Object.assign(obj, {'buyer_city': [e]});
                this.params2.filter = obj;
                obj1 = Object.assign(obj1, {'buyer_city': [e]});
                this.buyerparams.filter = obj1;
                this.districtList2 = [];
                this.contyparams2.areaName = e;
                this.getConty2();
            },
            districtChange(e) {
                var obj = this.params.filter;
                if (e == '' || e == '全部') {
                    delete this.params.filter.buyer_district;
                    return;
                }
                obj = Object.assign(obj, {'buyer_district': [e]});
                this.params.filter = obj;
            },
            districtChange2(e) {
                var obj = this.params2.filter;
                var obj1 = this.buyerparams.filter;
                if (e == '' || e == '全部') {
                    delete this.params2.filter.buyer_district;
                    delete this.buyerparams.filter.buyer_district;
                    return;
                }
                obj = Object.assign(obj, {'buyer_district': [e]});
                this.params2.filter = obj;
                obj1 = Object.assign(obj1, {'buyer_district': [e]});
                this.buyerparams.filter = obj1;
            },
            marketChange3(e) {
                var obj = this.params3.filter;
                if (e == '' || e == '全部') {
                    delete this.params3.filter.seller_market;
                    return;
                }
                obj = Object.assign(obj, {'seller_market': [e]});
                this.params3.filter = obj;
            },
            startdayChange(e) {
                this.params.time[0] = e;
            },
            enddayChange(e) {
                this.params.time[1] = e;
            },
            startdayChange2(e) {
                this.params2.time[0] = e;
                this.buyerparams.time[0] = e;
                // this.filterparams.time[0] = e;
                // this.getFilterData();
            },
            enddayChange2(e) {
                this.params2.time[1] = e;
                //  this.filterparams.time[1] = e;
                // this.getFilterData();
            },
            startdayChange3(e) {
                // this.filterparams.time[0] = e;
                this.params3.time[0] = e;
                // this.getFilterData();
            },
            enddayChange3(e) {
                this.params3.time[1] = e;
                // this.filterparams.time[1] = e;
                // this.getFilterData();
            },
            dayslenthChange1(e) { //咨询统计里默认天数的改变
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.params1startday = startday;
                this.params1endday = endday;  //咨询统计的默认时间绑定
                this.startday = startday;
                this.endday = endday;
                this.params.time = [startday, endday];
            },
            dayslenthChange2(e) { //咨询排行中基础排行
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.params2startday = startday;
                this.params2endday = endday;  //咨询统计的默认时间绑定
                this.params2.time = [startday, endday];
                this.buyerparams.time = [startday, endday];
                this.getFilterData();
            },
            dayslenthChange3(e) { //被咨询卖家排行
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.params3startday = startday;
                this.params3endday = endday;  //咨询统计的默认时间绑定
                this.params3.time = [startday, endday];
            },
            getDefaultDate() {  //获得默认时间
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - 30)).toLocaleDateString();
                this.params1startday = startday;
                this.params1endday = endday;  //咨询统计的默认时间绑定
                this.params2startday = startday;
                this.params2endday = endday;
                this.params3startday = startday;
                this.params3endday = endday;
                this.filterparams.time = ['2013-02-01', endday];
                this.params.time = [startday, endday];
                this.params2.time = [startday, endday];
                this.buyerparams.time = [startday, endday];
                this.params3.time = [startday, endday];
            },
            getFilterData() {  //获得咨询筛选项
                var _this = this;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/consultfilter.json',
                    // params: _this.filterparams,
                    method: 'POST',
                    url: '/bi/call/filter',
                    body: _this.filterparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.proviceList = response.body.data.buyer_province;
                        _this.proviceList.unshift('全部');
                        _this.proviceList3 = response.body.data.seller_province;
                        _this.proviceList3.unshift('全部');
                    }
                });
            },
            getCity() {
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // params: _this.cityparams, 
                    // url: './mock/city1.json', 
                    method: 'POST',
                    body: _this.cityparams,
                    url: '/bi/call/series',
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.cityList = response.body.data;
                        var all = {'buyer_city': '全部'};
                        _this.cityList.push(all);
                    }
                });
            },
            getCity2() {
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // params: _this.cityparams2, 
                    // url: './mock/city1.json', 
                    method: 'POST',
                    body: _this.cityparams2,
                    url: '/bi/call/series',
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.cityList2 = response.body.data;
                        var all = {'buyer_city': '全部'};
                        _this.cityList2.push(all);
                    }
                });
            },
            getConty() {  //获得区县
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // params: _this.contyparams, 
                    // url: './mock/qu.json', 
                    method: 'POST',
                    body: _this.contyparams,
                    url: '/bi/call/series',
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.districtList = response.body.data;
                        var all = {'buyer_district': '全部'};
                        _this.districtList.push(all);
                    }
                });
            },
            getConty2() {  //获得区县
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // params: _this.contyparams2, 
                    // url: './mock/qu.json', 
                    method: 'POST',
                    body: _this.contyparams,
                    url: '/bi/call/series',
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.districtList2 = response.body.data;
                        var all = {'buyer_district': '全部'};
                        _this.districtList.push(all);
                    }
                });
            },
            getmarkect() {
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // params: _this.cityparams3, 
                    // url: './mock/market.json', 
                    method: 'POST',
                    body: _this.cityparams3,
                    url: '/bi/call/series',
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.marketList = response.body.data;
                        var all = {'seller_market': '全部'};
                        _this.marketList.push(all);
                    }
                });
            },
            getBaseData() {
                var _this = this;
                _this.spinShow1 = true;
                _this.$Loading.start();
                _this.$http({  //获得统计数据
                    // method: 'GET',
                    // url: './mock/zixun.json',
                    // data: _this.params,
                    method: 'POST',
                    url: '/bi/call',
                    body: _this.params,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.spinShow1 = false;
                        _this.dataList = response.body.data.全部.group;
                        _this.initTotalCharts();
                    }
                    if (response.body.code == 10106) {
                        this.$Message.warning('您尚未登录，请登录', 1.5, function () {
                            window.location.href = 'http://oa.zdongpin.com/';
                        });
                    }
                });
            },
            // 获得基础咨询数据
            getBaseConsultData() {
                var _this = this;
                _this.$Loading.start();
                _this.spinShow2 = true;
                _this.spinShow3 = true;
                _this.$http({  //统计排行
                    // method:'GET', 
                    // url: './mock/zixuanpaihang.json', 
                    // data: _this.params2, 
                    method: 'POST',
                    url: '/bi/call/rank',
                    body: _this.params2,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.spinShow2 = false;
                        _this.spinShow3 = false;
                        _this.spinShow4 = false;
                        _this.basetotal = response.body.data.total;
                        _this.goodsdata = response.body.data.detail;
                        if (response.body.data.current == 1) {
                            _this.goodsrate = response.body.data.detail[0].call_times;
                        }
                        for (var i = 0, len = _this.goodsdata.length; i < len; i++) {
                            var obj = _this.goodsdata[i];
                            var realrate = _this.goodsdata[i].call_times / _this.goodsrate * 100;
                            obj = Object.assign(obj, {'realrate': realrate});
                            _this.goodsdata[i] = obj;
                        }
                    }
                });
            },
            getbuyerConsultData() {  //买家咨询
                var _this = this;
                _this.spinShow3 = true;
                _this.$Loading.start();
                _this.$http({
                    // method:'GET', 
                    // url: './mock/zixuanpaihang.json', 
                    // data: _this.buyerparams, 
                    method: 'POST',
                    url: '/bi/call/rank',
                    body: _this.buyerparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.spinShow3 = false;
                        _this.buyerConsultdata = response.body.data.detail;
                        _this.buyertotal = response.body.data.total;
                    }
                });
            },
            getSellerConsultData() {  //被咨询卖家排行
                var _this = this;
                _this.spinShow4 = true;
                _this.$Loading.start();
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/zixuanpaihang.json', 
                    // data: _this.params3, 
                    method: 'POST',
                    url: '/bi/call/rank',
                    body: _this.params3,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.spinShow4 = false;
                        _this.$Loading.finish();
                        _this.sellerConsultdata = response.body.data.detail;
                        _this.sellertotal = response.body.data.total;
                    }
                });
            },
            //echart
            initTotalCharts() {
                var _this = this,
                    myChart = eCharts.init(document.getElementById('chartPic'));
                var totalChartsData = _this.dataList,
                    xTime = [],
                    call_times = [],
                    buyer_times = [],
                    seller_times = [];
                for (let i in totalChartsData) {
                    xTime.push(totalChartsData[i].time);
                    call_times.push(totalChartsData[i].call_times);
                    buyer_times.push(totalChartsData[i].buyer_times);
                    seller_times.push(totalChartsData[i].seller_times);
                }
                myChart.setOption({
                    tooltip: {trigger: 'axis'},
                    calculable: true,
                    legend: {
                        y: 'bottom',
                        data: ['咨询次数', '咨询买家数(不含一批)', '被咨询卖家数']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: xTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    show: true,
                    feature: {
                        dataZoom: {yAxisIndex: 'none'},
                        dataView: {readOnly: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    },
                    series: [
                        {
                            name: '咨询次数',
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            data: call_times
                        },
                        {
                            name: '咨询买家数(不含一批)',
                            type: 'line',
                            smooth: false,
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        shadowColor: 'rgba(0, 0, 0, 0.4)'
                                    }
                                }
                            },
                            data: buyer_times
                        },
                        {
                            name: '被咨询卖家数',
                            type: 'line',
                            smooth: false,
                            data: seller_times
                        }
                    ]
                });


            }
        },
        created() {
            this.getDefaultDate();
            this.getFilterData();
            this.getBaseData();
            this.getBaseConsultData();
            this.getbuyerConsultData();
            this.getSellerConsultData();
        }
    };
</script>