<template>
    <div>
        <div class="layout-header">
            <h1>销售数据</h1>
        </div>
        <Tabs :animated="false">
            <Tab-pane label="销售排行">
                <h4 style="margin-bottom: 20px;">基础排行</h4>
                <!-- 基础排行包括销售数据和买家排行 -->
                <Card :bordered="true">
                    <div class="selectlist mainselect">
                        <Select v-model="dayslenthmodel1" style="width:150px" @on-change="dayslenthChange1">
                            <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                        <Date-picker format="yyyy-MM-dd" @on-change="startdayChange1" v-model="startday1" type="date"
                                     placeholder="选择日期" style="width: 150px"></Date-picker>
                        至
                        <Date-picker format="yyyy-MM-dd" @on-change="enddayChange1" v-model="endday1" type="date"
                                     placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                        <Select @on-change="proviceChange1" style="width:150px" placeholder="所有省/市">
                            <Option v-for="item in provinceList" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                        <Select @on-change="cityChange1" style="width:150px" placeholder="所有市">
                            <Option v-for="item in cityList" :value="item.city" :key="index">{{ item.city }}</Option>
                        </Select>
                        <Select @on-change="districtChange1" style="width:150px" placeholder="所有区县">
                            <Option v-for="item in districtList" :value="item.county" :key="index">{{ item.county }}
                            </Option>
                        </Select>
                        <Button type="success" @click="baseSelect">确认筛选</Button>
                    </div>

                    <!-- 销售数据表 -->
                    <div><h6>销售数据</h6>
                        <Tabs :animated="false" type="card" @on-click="tabchange">
                            <Tab-pane label="销售商品">
                                <Table :columns="sellgoodscolumns" :data="selldata" :context="self"
                                       @on-sort-change="sortchange"></Table>
                                <Page :current="baserankparams.page" class-name="page" show-elevator :page-size="10"
                                      :total="selltotal" @on-change="basePagechange" simple></Page>
                                <Spin size="large" fix v-if="basespinShow"></Spin>
                            </Tab-pane>
                            <Tab-pane label="销售品牌">
                                <Table :columns="sellbrandcolumns" :data="selldata" :context="self"
                                       @on-sort-change="sortchange"></Table>
                                <Page :current="baserankparams.page" :page-size="10" :total="selltotal"
                                      class-name="page" @on-change="basePagechange" show-elevator simple></Page>
                                <Spin size="large" fix v-if="basespinShow"></Spin>
                            </Tab-pane>
                            <Tab-pane label="销售分类">
                                <Table :columns="sellsortcolumns" :data="selldata" :context="self"
                                       @on-sort-change="sortchange"></Table>
                                <Page :current="baserankparams.page" :page-size="10" :total="selltotal"
                                      class-name="page" @on-change="basePagechange" show-elevator simple></Page>
                                <Spin size="large" fix v-if="basespinShow"></Spin>
                            </Tab-pane>
                        </Tabs>
                    </div>
                    <!-- 买家排行 -->
                    <div>
                        <div class="selectlist">
                            <div><h5>买家排行</h5></div>
                            <Select @on-change="shopTypeChange" clearable style="width:150px" placeholder="全部店铺">
                                <Option v-for="item in typeList" :value="item.value" :key="index">{{ item.label }}
                                </Option>
                            </Select>
                            <Select @on-change="payWayChange" clearable style="width:150px" placeholder="全部支付方式">
                                <Option v-for="item in paywayList" :value="item.value" :key="index">{{ item.label }}
                                </Option>
                            </Select>
                        </div>  <!-- selectlist end-->

                        <div>
                            <Table border stripe :columns="buyerdatacolumns" :data="buyerdata" :context="self"></Table>
                            <Page :current="buyerrankparams.page" :total="buyertotal" class-name="page" :page-size="10"
                                  show-elevator simple @on-change="buyerpageChange"></Page>
                            <Spin size="large" fix v-if="buyerdataspinShow"></Spin>
                        </div>

                    </div>
                </Card>
                <!-- 卖家排行 -->
                <h4 style="margin:20px 0;">卖家排行</h4>
                <Card :bordered="true">
                    <!-- selectlist start -->
                    <div class="selectlist mainselect">
                        <Select v-model="dayslenthmodel2" style="width:150px" @on-change="dayslenthChange2">
                            <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                        <Date-picker format="yyyy-MM-dd" @on-change="startdayChange2" v-model="startday2" type="date"
                                     placeholder="选择日期" style="width: 150px"></Date-picker>
                        至
                        <Date-picker format="yyyy-MM-dd" @on-change="enddayChange2" v-model="endday2" type="date"
                                     placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                        <Select @on-change="proviceChange2" style="width:150px" placeholder="所有省/市">
                            <Option v-for="item in provinceList2" :value="item" :key="index">{{ item }}</Option>
                        </Select>
                        <Select @on-change="marketChange2" style="width:150px" placeholder="所有市场">
                            <Option v-for="item in marketList" :value="item.market" :key="index">{{ item.market }}
                            </Option>
                        </Select>
                        <Select @on-change="paywayChange2" clearable style="width:150px" placeholder="全部支付方式">
                            <Option v-for="item in paywayList" :value="item.value" :key="index">{{ item.label }}
                            </Option>
                        </Select>
                        <Button type="success" @click="sellerRankSelect">确认筛选</Button>
                    </div>
                    <!-- selectlist end -->
                    <div>
                        <Table border stripe :columns="sellererdatacolumns" :data="sellerdata" :context="self"
                               @on-sort-change="sellersortchange"></Table>
                        <Page :current="sellerrankparams.page" :total="sellertotal" class-name="page" :page-size="10"
                              show-elevator simple @on-change="sellerpageChange"></Page>
                        <Spin size="large" fix v-if="sellerdataspinShow"></Spin>
                    </div>
                </Card>
                <!-- 地区排行 -->
                <h4 style="margin:20px 0;">地区排行</h4>
                <Card :bordered="true">
                    <div class="selectlist mainselect">
                        <Select v-model="dayslenthmodel3" style="width:150px" @on-change="dayslenthChange3">
                            <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                        </Select>
                        <Date-picker format="yyyy-MM-dd" @on-change="startdayChange3" v-model="startday3" type="date"
                                     placeholder="选择日期" style="width: 150px"></Date-picker>
                        至
                        <Date-picker format="yyyy-MM-dd" @on-change="enddayChange3" v-model="endday3" type="date"
                                     placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                        <Select @on-change="paywayChange3" clearable style="width:150px" placeholder="全部支付方式">
                            <Option v-for="item in paywayList" :value="item.value" :key="index">{{ item.label }}
                            </Option>
                        </Select>
                        <Button type="success" @click="districtRankSelect">确认筛选</Button>
                    </div> <!--筛选end-->
                    <div>
                        <h5 class="selectlist">省市排行</h5>
                        <div>
                            <Table border stripe :columns="provinceRankdatacolumns" :data="provincedata" :context="self"
                                   @on-sort-change="provincesortchange"></Table>
                            <Spin size="large" fix v-if="provinceRankspinShow"></Spin>
                        </div>
                    </div>
                    <!-- 市排行 -->
                    <div>
                        <div class="selectlist">
                            <div><h5>市排行</h5></div>
                            <Select @on-change="city_provinceChange" style="width:150px" placeholder="四川省">
                                <Option v-for="item in provinceList2" :value="item" :key="index">{{ item }}</Option>
                            </Select>
                        </div>
                        <div>
                            <Table border stripe :columns="cityRankdatacolumns" :data="cityRankdata" :context="self"
                                   @on-sort-change="citysortchange"></Table>
                            <Spin size="large" fix v-if="cityRankspinShow"></Spin>
                        </div>
                    </div>
                    <!-- 区县排行 -->
                    <div>
                        <div class="selectlist">
                            <div><h5>区县排行</h5></div>
                            <Select @on-change="district_provinceChange" style="width:150px" placeholder="四川省">
                                <Option v-for="item in provinceList2" :value="item" :key="index">{{ item }}</Option>
                            </Select>
                            <Select @on-change="district_cityChange" style="width:150px" placeholder="成都市">
                                <Option v-for="item in cityList2" :value="item.city" :key="index">{{ item.city }}
                                </Option>
                            </Select>
                        </div>
                        <div>
                            <Table border stripe :columns="districtRankdatacolumns" :data="districtRankdata"
                                   :context="self" @on-sort-change="districtsortchange"></Table>
                            <Spin size="large" fix v-if="districtRankspinShow"></Spin>
                        </div>

                    </div>
                </Card>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                buyertotal: 0,
                sellertotal: 0,
                provincedata: [],
                selltotal: 0,
                selldata: [],
                sellerdata: [],
                dayslenthmodel1: '30',
                dayslenthmodel2: '30',
                dayslenthmodel3: '30',
                self: this,
                startday1: [],
                endday1: [],
                startday2: [],
                endday2: [],
                startday3: [],
                endday3: [],
                sell: 'goods',
                startday: [],
                endday: [],
                buyerdata: [],  //买家排行
                basespinShow: true,
                buyerdataspinShow: true,
                sellerdataspinShow: true,
                provinceRankspinShow: true,
                cityRankspinShow: true,
                districtRankspinShow: true,
                provinceList: [],
                provinceList2: [],
                cityList: [],
                cityList2: [],
                typeList: [{value: 11, label: '一批'}, {value: 12, label: '厂家'}, {value: 21, label: '二批'}, {
                    value: 22,
                    label: '第三方'
                }, {value: 23, label: '配送公司'}, {value: 24, label: '终端'}, {value: 25, label: '餐厅'}, {
                    value: 26,
                    label: '商超零售'
                }, {value: 31, label: '司机'}, {value: 100, label: '直营'}, {value: 0, label: '全部店铺'}],
                marketList: [],
                paywayList: [{value: 1, label: '付款到平台'}, {value: 2, label: '上车收钱'}, {
                    value: 3,
                    label: '自行协商'
                }, {value: 100, label: '全部支付方式'}],
                districtList: [],
                dayslenth: [{value: '30', label: '近30天'}, {value: '15', label: '近15天'}, {value: '7', label: '近7天'}],
                baserankparams: {
                    time: [],
                    column: 'name',
                    order: 'amount',
                    sc: 'desc',
                    filter: {},
                    page: 1,
                    size: 10
                },
                buyerrankparams: {
                    time: [],
                    column: 'uid',
                    type: 'shop',
                    filter: {},
                    page: 1,
                    size: 10
                },
                sellerrankparams: {
                    time: [],
                    sc: 'desc',
                    column: 'shopid',
                    order: 'amount',
                    type: 'shop',
                    filter: {},
                    page: 1,
                    size: 10
                },
                provincerankparams: {  //省市排行
                    time: [],
                    order: 'amount',
                    sc: 'desc',
                    column: 'province',
                    type: 'area',
                    filter: {},
                    page: 1,
                    size: 10
                },
                cityrankparams: {
                    time: [],
                    order: 'amount',
                    sc: 'desc',
                    column: 'city',
                    type: 'area',
                    filter: {province: ['四川省']},
                    page: 1,
                    size: 10
                },
                cityparams: {
                    areaName: '',
                    role: 'province'
                },
                cityparams2: {
                    areaName: '',
                    role: 'province',
                    type: 'market'
                },
                cityparams3: {
                    areaName: '',
                    role: 'province'
                },
                disparams: {
                    areaName: '',
                    role: 'city'
                },
                districtrankparams: {
                    time: [],
                    order: 'amount',
                    sc: 'desc',
                    column: 'county',
                    type: 'area',
                    filter: {
                        province: ['四川省'],
                        city: ['成都市']
                    },
                    page: 1,
                    size: 10
                },
                filterparams: {  //销售商品
                    time: []
                },
                filterparams2: {
                    time: [],
                    column: ['province', 'city', 'pianquId', 'method', 'trenchnum']
                },
                sellgoodsdata: [],
                sellbranddata: [],
                sellsortdata: [],
                sellgoodscolumns: [{
                    title: '排名', width: 160, render(row, column, index) {
                        return `<div>{{(baserankparams.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '商品', width: 200, key: 'goods_name'}, {
                    title: '销售额(元)',
                    width: 160,
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', width: 160, key: 'num'}, {
                    title: ' ', render(row) {
                        return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                    }
                }],
                sellbrandcolumns: [{
                    title: '排名', width: 160, render(row, column, index) {
                        return `<div>{{(baserankparams.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '品牌', width: 200, key: 'brand'}, {
                    title: '销售额(元)',
                    width: 160,
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', width: 160, key: 'num'}, {
                    title: ' ', render(row) {
                        return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                    }
                }],
                sellsortcolumns: [{
                    title: '排名', width: 160, render(row, column, index) {
                        return `<div>{{(baserankparams.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '分类', width: 200, key: 'sort'}, {
                    title: '销售额(元)',
                    width: 160,
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', width: 160, key: 'num'}, {
                    title: ' ', render(row) {
                        return `<div><p style="background: gray;height:30px;width:${row.realrate}%"></p></div>`;
                    }
                }],
                buyerdatacolumns: [{
                    title: '排名', render(row, column, index) {
                        return `<div>{{(buyerrankparams.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '店铺名', key: 'dianPuName'}, {title: '联系电话', key: 'user_tel'}, {
                    title: '购买金额',
                    key: 'amount'
                }, {title: '购买数量', key: 'num'}, {title: '订单笔数', key: 'order'}],
                sellererdatacolumns: [{
                    title: '排名', render(row, column, index) {
                        return `<div>{{(sellerrankparams.page-1)*10+${index}+1}}</div>`;
                    }
                }, {title: '店铺名', key: 'dianPuName'}, {title: '联系电话', key: 'user_tel'}, {
                    title: '销售金额',
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', key: 'num'}, {title: '订单笔数', key: 'order'}],
                provinceRankdatacolumns: [{title: '排名', type: 'index'}, {title: '省市', key: 'province'}, {
                    title: '销售金额',
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', key: 'num'}, {title: '订单笔数', key: 'order'}],
                cityRankdatacolumns: [{title: '排名', type: 'index'}, {title: '省市', key: 'city'}, {
                    title: '销售金额',
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', key: 'num'}, {title: '订单笔数', key: 'order'}],
                districtRankdatacolumns: [{title: '排名', type: 'index'}, {title: '区县', key: 'county'}, {
                    title: '销售金额',
                    key: 'amount',
                    sortable: 'custom'
                }, {title: '销售数量', sortable: 'custom', key: 'num'}, {title: '订单笔数', key: 'order'}],
                cityRankdata: [],
                baserate: 0
            };
        },
        methods: {
            shopTypeChange(e) { //买家排行--店铺类型改变
                if (e == '' || e == '0') {
                    delete this.buyerrankparams.filter.trenchnum;
                    return;
                }
                var obj = this.buyerrankparams.filter;
                obj = Object.assign(obj, {'trenchnum': [e]});
                this.buyerrankparams.filter = obj;
            },
            buyerpageChange(e) {   //买家排行 --页数改变
                this.buyerrankparams.page = e;
                this.getBuyerData();
            },
            payWayChange(e) {//买家排行--支付方式改变
                if (e == '' || e == '100') {
                    delete this.buyerrankparams.filter.method;
                    this.getBuyerData();
                    return;
                }
                var obj = this.buyerrankparams.filter;
                obj = Object.assign(obj, {'method': [e]});
                this.buyerrankparams.filter = obj;
                this.getBuyerData();
            },
            paywayChange2(e) {  //卖家排行-支付方式改变
                if (e == '' || e == '100') {
                    delete this.sellerrankparams.filter.method;
                    return;
                }
                var obj = this.sellerrankparams.filter;
                obj = Object.assign(obj, {'method': [e]});
                this.sellerrankparams.filter = obj;
            },
            paywayChange3(e) {
                if (e == '' || e == '100') {
                    delete this.districtrankparams.filter.method;
                    delete this.provincerankparams.filter.method;
                    delete this.cityrankparams.filter.method;
                    return;
                }
                var obj1 = this.provincerankparams.filter;
                obj1 = Object.assign(obj1, {'method': [e]});
                this.provincerankparams.filter = obj1;
                var obj2 = this.cityrankparams.filter;
                obj2 = Object.assign(obj2, {'method': [e]});
                this.cityrankparams.filter = obj2;
                var obj3 = this.districtrankparams.filter;
                obj3 = Object.assign(obj3, {'method': [e]});
                this.districtrankparams.filter = obj3;
            },
            city_provinceChange(e) {
                if (e == '全部') {
                    delete this.cityrankparams.filter.province;
                    return;
                }
                var obj = this.cityrankparams.filter;
                obj = Object.assign(obj, {province: [e]});
                this.cityrankparams.filter = obj;
                this.getCityData();
            },
            district_provinceChange(e) {
                this.cityList2 = [];
                if (e == '全部') {
                    delete this.districtrankparams.filter.province;
                    return;
                }
                var obj = this.districtrankparams.filter;
                obj = Object.assign(obj, {province: [e]});
                this.districtrankparams.filter = obj;
                this.cityparams3.areaName = e;
                this.getCdata3();
            },
            district_cityChange(e) {
                if (e == '全部') {
                    delete this.districtrankparams.filter.city;
                    return;
                }
                var obj = this.districtrankparams.filter;
                obj = Object.assign(obj, {city: [e]});
                this.districtrankparams.filter = obj;
                this.getDistrictData();
            },
            sortchange(e) {
                this.baserankparams.order = e.key;
                this.baserankparams.sc = e.order;
                this.getBaseRankData();
            },
            sellersortchange(e) {
                this.sellerrankparams.order = e.key;
                this.sellerrankparams.sc = e.order;
                this.getSellerData();
            },
            provincesortchange(e) {
                this.provincerankparams.order = e.key;
                this.provincerankparams.sc = e.order;
                this.getProvinceData();
            },
            citysortchange(e) {
                this.cityrankparams.order = e.key;
                this.cityrankparams.sc = e.order;
                this.getCityData();
            },
            districtsortchange(e) {
                this.districtrankparams.order = e.key;
                this.districtrankparams.sc = e.order;
                this.getDistrictData();
            },
            tabchange(e) {  //table改变
                this.baserankparams.page = 1;
                this.baserankparams.order = 'amount';
                if (e == 0) this.baserankparams.column = 'name';
                if (e == 1) this.baserankparams.column = 'brand';
                if (e == 2) this.baserankparams.column = 'sort';
                this.getBaseRankData();
            },
            basePagechange(e) {
                this.baserankparams.page = e;
                this.getBaseRankData();
            },
            sellerpageChange(e) {
                this.sellerrankparams.page = e;
                this.getSellerData();
            },
            baseSelect() {  //基础排行
                this.getBaseRankData();
                this.getBuyerData();
            },
            sellerRankSelect() {  //卖家排行
                this.sellerrankparams.page = 1;
                this.getSellerData();
            },
            districtRankSelect() {
                this.getProvinceData();
                this.getCityData();
                this.getDistrictData();
            },
            proviceChange1(e) {   //基础排行-省份改变
                this.cityList = [];
                if (e == '全部') {
                    delete this.baserankparams.filter.buyer_province;
                    return;
                }
                var obj = this.baserankparams.filter;
                obj = Object.assign(obj, {'buyer_province': [e]});
                this.baserankparams.filter = obj;
                this.cityparams.areaName = e;
                this.getCdata();
            },
            proviceChange2(e) {  //卖家排行-省份改变
                this.marketList = [];
                if (e == '全部') {
                    delete this.sellerrankparams.filter.province;
                    return;
                }
                var obj = this.sellerrankparams.filter;
                obj = Object.assign(obj, {'province': [e]});
                this.sellerrankparams.filter = obj;
                this.cityparams2.areaName = e;
                this.getCdata2();
            },
            cityChange1(e) {  //基础排行-市改变
                this.districtList = [];
                if (e == '全部') {
                    delete this.baserankparams.filter.buyer_city;
                    return;
                }
                var obj = this.baserankparams.filter;
                obj = Object.assign(obj, {'buyer_city': [e]});
                this.baserankparams.filter = obj;
                this.disparams.areaName = e;
                this.getDisData();

            },
            marketChange2(e) {  //卖家排行-市场改变
                if (e == '全部') {
                    delete this.sellerrankparams.filter.pianquId;
                    return;
                }
                var obj = this.sellerrankparams.filter;
                obj = Object.assign(obj, {'pianquId': [e]});
                this.sellerrankparams.filter = obj;
            },
            districtChange1(e) {  //基础排行-区县改变
                if (e == '全部') {
                    delete this.baserankparams.filter.buyer_district;
                    return;
                }
                var obj = this.baserankparams.filter;
                obj = Object.assign(obj, {'buyer_district': [e]});
                this.baserankparams.filter = obj;
            },
            dayslenthChange1(e) {
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.startday1 = startday;
                this.endday1 = endday;
                this.baserankparams.time = [startday, endday];
                this.buyerrankparams.time = [startday, endday];
            },
            dayslenthChange2(e) {
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.startday2 = startday;
                this.endday2 = endday;
                this.sellerrankparams.time = [startday, endday];
            },
            dayslenthChange3(e) {
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - e)).toLocaleDateString();
                this.startday3 = startday;
                this.endday3 = endday;
                this.provincerankparams.time = [startday, endday];
                this.cityrankparams.time = [startday, endday];
                this.districtrankparams.time = [startday, endday];
            },
            startdayChange1(e) {   //基础排行开始时间改变
                this.baserankparams.time[0] = e;
                this.buyerrankparams.time[0] = e;
            },
            enddayChange1(e) { //基础排行结束时间改变
                this.baserankparams.time[1] = e;
                this.buyerrankparams.time[1] = e;
            },
            startdayChange2(e) {   //卖家排行开始时间改变
                this.sellerrankparams.time[0] = e;
            },
            enddayChange2(e) { //卖家排行结束时间改变
                this.sellerrankparams.time[1] = e;
            },
            startdayChange3(e) {
                this.provincerankparams.time[0] = e;
                this.cityrankparams.time[0] = e;
                this.districtrankparams.time[0] = e;
            },
            enddayChange3(e) {
                this.provincerankparams.time[1] = e;
                this.cityrankparams.time[1] = e;
                this.districtrankparams.time[1] = e;
            },
            getCdata() {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/shop/series',
                    body: _this.cityparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.cityList = response.body.data;
                        var all = {'city': '全部'};
                        _this.cityList.push(all);
                    }
                });
            },
            getCdata2() {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/shop/series',
                    body: _this.cityparams2,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.marketList = response.body.data;
                        var all = {'market': '全部'};
                        _this.marketList.push(all);
                    }
                });
            },
            getCdata3() {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/shop/series',
                    body: _this.cityparams3,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.cityList2 = response.body.data;
                        var all = {'city': '全部'};
                        _this.cityList2.push(all);
                    }
                });
            },
            getDisData() {
                var _this = this;
                _this.$http({
                    method: 'POST',
                    url: '/bi/shop/series',
                    body: _this.disparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.districtList = response.body.data;
                        var all = {'county': '全部'};
                        _this.districtList.push(all);
                    }
                });
            },
            getDefaultDate() {
                var t = new Date();
                var iToDay = t.getDate();
                var iToMon = t.getMonth();
                var iToYear = t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay - 30)).toLocaleDateString();
                this.startday1 = startday;
                this.endday1 = endday;
                this.startday2 = startday;
                this.endday2 = endday;
                this.startday3 = startday;
                this.endday3 = endday;
                this.startday = startday;
                this.endday = endday;
                this.baserankparams.time = [startday, endday];
                this.buyerrankparams.time = [startday, endday];
                this.sellerrankparams.time = [startday, endday];
                this.filterparams.time = ['2015-01-10', endday];
                this.filterparams2.time = ['2015-01-01', endday];
                this.provincerankparams.time = [startday, endday];
                this.cityrankparams.time = [startday, endday];
                this.districtrankparams.time = [startday, endday];
            },
            getBaseRankData() {
                var _this = this;
                _this.$Loading.start();
                _this.basespinShow = true;
                _this.$http({
                    method: 'POST',
                    url: '/bi/sale/goods',
                    body: _this.baserankparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.basespinShow = false;
                        _this.selldata = response.body.data.detail;
                        _this.selltotal = response.body.data.total;
                        if (response.body.data.current_page == 1 && _this.baserankparams.order == 'amount') _this.baserate = response.body.data.detail[0].amount;
                        if (response.body.data.current_page == 1 && _this.baserankparams.order == 'num') _this.baserate = response.body.data.detail[0].num;
                        if (_this.baserankparams.order == 'amount') {
                            for (let i = 0, len = _this.selldata.length; i < len; i++) {
                                let obj = _this.selldata[i];
                                let realrate = _this.selldata[i].amount / _this.baserate * 100;
                                obj = Object.assign(obj, {'realrate': realrate});
                                _this.selldata[i] = obj;
                            }
                        }
                        if (_this.baserankparams.order == 'num') {
                            for (let i = 0, len = _this.selldata.length; i < len; i++) {
                                let obj = _this.selldata[i];
                                let realrate = _this.selldata[i].num / _this.baserate * 100;
                                obj = Object.assign(obj, {'realrate': realrate});
                                _this.selldata[i] = obj;
                            }
                        }
                    }
                });
            },
            getBuyerData() {
                var _this = this;
                _this.buyerdataspinShow = true;
                _this.$http({
                    method: 'POST',
                    url: '/bi/sale',
                    body: _this.buyerrankparams,
                    // method: 'GET', 
                    // url: './mock/xiaoshou3.json', 
                    // data: _this.buyerrankparams, 
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.buyertotal = response.body.data.total;
                        _this.buyerdataspinShow = false;
                        _this.buyerdata = response.body.data.detail;
                    }
                });
            },
            getSellerData() {
                var _this = this;
                _this.sellerdataspinShow = true;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/xiaoshou3.json', 
                    // data: _this.sellerrankparams, 
                    method: 'POST',
                    url: '/bi/sale',
                    body: _this.sellerrankparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.sellerdataspinShow = false;
                        _this.sellertotal = response.body.data.total;
                        _this.sellerdata = response.body.data.detail;
                    }
                });
            },
            getProvinceData() {   //获得省市排行
                var _this = this;
                _this.provinceRankspinShow = true;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/xiaoshou3.json', 
                    // data: _this.provincerankparams, 
                    method: 'POST',
                    url: '/bi/sale',
                    body: _this.provincerankparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.provinceRankspinShow = false;
                        _this.provincedata = response.body.data.detail;
                    }
                });
            },
            getCityData() {  //获得市排行
                var _this = this;
                _this.cityRankspinShow = true;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/xiaoshou3.json', 
                    // data: _this.cityrankparams, 
                    method: 'POST',
                    url: '/bi/sale',
                    body: _this.cityrankparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.cityRankspinShow = false;
                        _this.cityRankdata = response.body.data.detail;
                    }
                });
            },
            getDistrictData() {
                var _this = this;
                _this.districtRankspinShow = true;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/xiaoshou3.json', 
                    // data: _this.districtrankparams, 
                    method: 'POST',
                    url: '/bi/sale',
                    body: _this.districtrankparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                        _this.districtRankspinShow = false;
                        _this.districtRankdata = response.body.data.detail;
                    }
                });
            },
            getFilterData() {  //销售商品排行筛选项
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/methods.json', 
                    // params: _this.filterparams, 
                    method: 'POST',
                    url: '/bi/order/filter',
                    body: _this.filterparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {

                        _this.provinceList = response.body.data.buyer.geo.province;
                        _this.provinceList.unshift('全部');
                        // _this.cityList = response.body.data.buyer.geo.city;
                        // _this.cityList.unshift('全部');
                        // _this.districtList = response.body.data.buyer.geo.district;
                        // _this.districtList.unshift('全部');
                    }
                    if (response.body.code == 10106) {
                        this.$Message.warning('您尚未登录，请登录', 1.5, function () {
                            window.location.href = 'http://oa.zdongpin.com/';
                        });
                    }
                });
            },
            getFilterData2() {  //销售排行
                var _this = this;
                _this.$http({
                    // method: 'GET', 
                    // url: './mock/methods.json', 
                    // params: _this.filterparams2, 
                    method: 'POST',
                    url: '/bi/sale/filter',
                    body: _this.filterparams2,
                    header: 'Accept application/json'
                }).then(response => {
<<<<<<< HEAD
                    if (response.body.code ==0 ){
                      
                         _this.provinceList2 = response.body.data.province;
                         _this.provinceList2=Object.assign(_this.provinceList2, {'-1.province': '全部'});
=======
                    if (response.body.code == 0) {

                        _this.provinceList2 = response.body.data.province;
                        _this.provinceList2 = Object.assign(_this.provinceList2, {'-1.province': '全部'});
                        // _this.marketList = response.body.data.pianquId;
                        // _this.marketList = Object.assign(_this.marketList,  {'-1':'全部'});
                        // _this.cityList2 = response.body.data.city;
                        // _this.cityList2 = Object.assign(_this.cityList2, {'-1.city': '全部'});
>>>>>>> 64cc611360039bfbd3219223865f6fb550b420f9
                    }
                });
            }
        },
        created() {
            this.getDefaultDate();
            this.getFilterData();
            this.getFilterData2();
            this.getBaseRankData();
            this.getBuyerData();
            this.getSellerData();
            this.getProvinceData();
            this.getCityData();
            this.getDistrictData();
        }
    };
</script>