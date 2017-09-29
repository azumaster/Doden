<template>
    <div>
     <div class="layout-header">
        <h1>店铺数据</h1>
    </div>
        <Tabs :animated="false">
        <Tab-pane label="分布和趋势">
            <div>
              <h4>省份分布</h4>
                <div class="selectlist mainselect">
                <Select  style="width:150px" placeholder="全部店铺" clearable @on-change="provinceShopTypeChange">
                    <Option v-for="item in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Button type="success" @click="provinceSelect">确认筛选</Button>
                </div>
                <p style="margin-top: 20px;">*全部店铺数包含已删除和已拒绝店铺数。统计该省市下所有已注册的店铺。</p>
                <Row>
                    <Col span="10" >
                        <Spin size="large" fix v-if="provincePieChartsspinShow"></Spin>
                        <div id="provincePieCharts" style="width: 100%;height: 400px"></div>
                        <h6>合计：{{provinceShopTotal}}</h6>
                    </Col>
                    <Col span="14" >
                        <Table size="small" stripe border  :columns="provincecolumns" :data="provincedata" :context="self"></Table>
                        <Page :current="provinceparams.page" :total="provincetotal" :page-size="10" @on-change="provincePageChange" class-name="page" show-elevator simple></Page>
                        <Spin size="large" fix v-if="provincePieChartsspinShow"></Spin>
                    </Col>
                </Row>
            </div>
            <!-- 市分布 -->
    <div>
        <h4>市分布</h4>
         
        <div class="selectlist mainselect">
            <Select  style="width:150px" placeholder="四川省" @on-change="cityProvinceChange">
                <Option v-for="item in provinceList" :value="item" :key="index">{{ item }}</Option>
            </Select>
             <Select  style="width:150px" placeholder="全部店铺" @on-change="cityShopTypeChange">
                <Option v-for="item in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Button type="success" @click="citySelect">确认筛选</Button>
        </div>
        <p style="margin-top: 20px;">*全部店铺数包含已删除和已拒绝店铺数。统计该省市下所有已注册的店铺。</p>
        <!-- 表格内容 -->
        
            <Row>
                <Col span="10">
                   <Spin size="large" fix v-if="cityPieChartsspinShow"></Spin>
                        <div id="cityPieCharts" style="width: 100%;height: 400px"></div>
                        <h6>合计：{{cityShopTotal}}</h6>
                </Col>
                <Col span="14">
                   <Table size="small" stripe border  :columns="citycolumns" :data="citydata" :context="self"></Table>
                   <Spin size="large" fix v-if="cityPieChartsspinShow"></Spin>
                </Col>
            </Row>
    </div>
    <!-- 区县分布 -->
            <div>
                <h4>区县分布</h4>
                
                 <div class="selectlist mainselect">
                      <Select  style="width:150px" placeholder="四川省"  @on-change="districtProviceChange">
                <Option v-for="item in provinceList" :value="item" :key="index" >{{ item }}</Option>
            </Select>
                      <Select  style="width:150px" placeholder="成都市" @on-change="districtCityChange">
                <Option v-for="item in cityList" :value="item.city" :key="index">{{ item.city }}</Option>
            </Select>
            <Select  style="width:150px" placeholder="全部店铺" @on-change="districtShopTypeChange">
                <Option v-for="item in typeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Button type="success" @click="districtSelect">确认筛选</Button>
                 </div>
                <p style="margin-top: 20px;">*全部店铺数包含已删除和已拒绝店铺数。统计该省市下所有已注册的店铺。</p>
                 <Row>
                     <Col span="10">
                         <Spin size="large" fix v-if="districtPieChartsspinShow"></Spin>
                         <div id="districtPieCharts" style="width: 100%;height: 400px"></div>
                         <h6>合计：{{districtShopTotal}}</h6>
                     </Col>
                     <Col span="14">
                         <Table size="small" stripe border  :columns="districtcolumns" :data="districtdata" :context="self"></Table>
                         <Spin size="large" fix v-if="districtPieChartsspinShow"></Spin>
                     </Col>
                 </Row>
            </div>
        <!-- 底部折线图 -->
        <div>
            <div class="selectlist">
                <div><h4>趋势和变化</h4></div>
                    <Radio-group v-model="linesparams.group" type="button">
                    <Radio label="day">按日查看</Radio>
                    <Radio label="week">按周查看</Radio>
                    <Radio label="month">按月查看</Radio>
                    <Radio label="year">按年查看</Radio>
                </Radio-group>
            </div>
            <div class="selectlist mainselect">
                <Select v-model="dayslenthmodel" style="width:150px" @on-change="dayslenthChange">
                    <Option v-for="item in dayslenth" :value="item.value" :key="item">{{ item.label }}</Option>
                </Select>
                <Date-picker  format="yyyy-MM-dd" @on-change="startdayChange" v-model="startday" type="date" placeholder="选择日期" style="width: 150px"></Date-picker>至
                <Date-picker format="yyyy-MM-dd" @on-change="enddayChange" v-model="endday" type="date"  placeholder="选择日期" style="width: 150px;margin-left:20px"></Date-picker>
                <Select  @on-change="linesproviceChange" style="width:150px" placeholder="所有省/市">
                    <Option v-for="item in provinceList2" :value="item" :key="index">{{ item }}</Option>
                </Select>
                <Select @on-change="linescityChange" style="width:150px" placeholder="所有市">
                    <Option v-for="item in cityList2" :value="item.city" :key="index">{{ item.city }}</Option>
                </Select>
                <Select  @on-change="linesdistrictChange"  style="width:150px" placeholder="所有区县">
                    <Option v-for="item in districtList" :value="item.county" :key="index">{{ item.county }}</Option>
                </Select>
                <Button type="success" @click="linesSelect">确认筛选</Button>
            </div>
            <div style="height:600px;">
                <Spin size="large" fix v-if="linesspinShow"></Spin>
                <div id="linesCharts" style="width: 100%;height:600px;"></div>
            </div>
        </div>
        </Tab-pane>
    </Tabs>
    </div>
</template>
<script>
    import eCharts from 'echarts';
    export default{
        data () {
            return {
                provinceShopTotal: 0,  //省份分布合计
                provincetotal: 0,   //返回的省份数据总数
                cityShopTotal: 0, //市分布
                districtShopTotal: 0,
                 dayslenth: [{ value: '30', label: '近30天'}, { value: '15', label: '近15天'}, {value: '7', label: '近7天'}],
                dayslenthmodel: '30',
                provincePieChartsspinShow: true,  //省份分布饼图
                cityPieChartsspinShow: true,  //市分布
                districtPieChartsspinShow: true,  //区县分布
                linesspinShow: true,  //折线统计图
                provincerate: 0,
                cityrate: 0,
                districtrate: 0,
                self:this,
                provinceparams: {   //省分布
                    time: [],
                    group: 'province',
                    // is_shenghe: 'is',
                    filter: {},
                    page: 1,
                    size:10
                },
                cparams: {  //获得市
                  areaName: '',
                  role: 'province'
                },
                cparamslast: {  //获得市
                  areaName: '',
                  role: 'province'
                },
                dparams: { //获得区
                  areaName: '',
                  role: 'city'
                },
                cityparams: {
                  time: [],
                  group: 'city',
                  filter: {
                    province: ['四川省']
                  },
                  size:10
                },
                districtparams: {
                  time: [],
                  group: 'county',
                    filter: {
                       province: ['四川省'],
                       city: ['成都市']
                    },
                    size:10
                },
                cityfilterparams: {},  //省市区列表
                linesparams: { //底部折线图参数
                    group: 'day',
                    time: [],
                    filter: {},
                    split: [{trenchnum:['11']}, {trenchnum: ['21']}, {trenchnum: ['25']}]
                },
                provincecolumns:[{ title: '省市', width:150,  key: 'province'}, { title: '店铺数', key: 'num'}, { title: '   ', render (row) {
                           return `<div><p style="background: gray;height:20px;width:${row.realrate}%"></p></div>`;
                        }}],
                citycolumns:[{ title: '市', width:150,  key: 'city'}, { title: '店铺数', key: 'num'}, 
                {title: '占比', render (row) {
                           return `<div>${row.zhangbi}%</div>`;
                        }},
                { title: '   ', render (row) {
                           return `<div><p style="background: gray;height:20px;width:${row.realrate}%"></p></div>`;
                        }}],
                districtcolumns: [{ title: '区/县', width:150,  key: 'county'}, { title: '店铺数', key: 'num'}, 
                { title: '占比', render (row) {
                           return `<div>${row.zhangbi}%</div>`;
                        }},
                { title: '   ', render (row) {
                           return `<div><p style="background: gray;height:20px;width:${row.realrate}%"></p></div>`;
                        }}],
                provinceList: [],
                provinceList2: [],
                cityList2: [],
                cityList: [],
                cityPieData: [],
                districtPieData: [],
                provincedata: [],  //省份分布数据储存
                provincePieData: [],
                citydata: [],
                districtdata: [],
                districtList: [],
                typeList: [{value:11, label:'一批'}, {value:21, label:'二批'}, {value:25, label: '餐厅'}, {value: 90, label:'待审核'}, {value:0, label:'全部店铺'}],
                linesdata: '',
                staFilterparams: {
                  time: [],
                  select: ['province', 'city', 'trenchnum']
                },
                lineFilterparams: {
                  time: [],
                  select: ['province', 'city', 'county']
                }
            };
        },
        methods: {
              provinceSelect () {  //省份分布
                this.provinceparams.page = 1;
                this.getProvinceData();
              },
              citySelect () {  //市分布
                this.getCityData();
              },
              districtSelect () { //区分布
                  this.getdistrictData();
              },
              linesSelect () { //下路折线图
                this.getLinesData();
              },
              provincePageChange (e) {
                this.provinceparams.page = e;
                this.getProvinceData();
              },
              provinceShopTypeChange (e) {  //省分布
                if (e =='90') {delete this.provinceparams.filter.trenchnum; this.provinceparams.is_shenghe = 'is';return;}
                if (e == '0') {this.provinceparams.is_shenghe = 'is';this.provinceparams.filter.trenchnum=['11', '21', '25'];return;}
                var obj = this.provinceparams.filter;
                delete this.provinceparams.is_shenghe;
                obj = Object.assign(obj, {'trenchnum':[e]});
                this.provinceparams.filter = obj;
              },
              cityProvinceChange (e) {  //市分布-省份改变
                 if(e == '全部') {delete this.cityparams.filter.province; return;}
                 var obj = this.cityparams.filter;
                 obj = Object.assign(obj, {'province':[e]});
                 this.cityparams.filter = obj;
              },
              cityShopTypeChange (e) {  //市分布-店铺类型改变
                if(e == '90') {delete this.cityparams.filter.trenchnum;this.cityparams.is_shenghe = 'is';return;}
                if(e == '0') {this.cityparams.is_shenghe = 'is';this.cityparams.filter.trenchnum=['11', '21', '25'];return;}
                 var obj = this.cityparams.filter;
                 delete this.cityparams.is_shenghe;
                 obj = Object.assign(obj, {'trenchnum':[e]});
                 this.cityparams.filter = obj;
              },
              districtProviceChange (e) {   //区县分布-省改变
                if(e == '全部') {delete this.districtparams.filter.province; this.cityList = []; return;}
                var obj = this.districtparams.filter;
                this.cityList = [];
                 obj = Object.assign(obj, {'province':[e]});
                 this.districtparams.filter = obj;
                 this.cparams.areaName = e;
                 this.getCdata();
              },
              districtCityChange (e) {   //区县分布-省改变
                if(e == '全部') {delete this.districtparams.filter.city; return;}
                var obj = this.districtparams.filter;
                 obj = Object.assign(obj, {'city':[e]});
                 this.districtparams.filter = obj;
              },
              districtShopTypeChange (e) {
                if (e == '90') {delete this.districtparams.filter.trenchnum;this.districtparams.is_shenghe = 'is';return;}
                 if(e == '0') {this.districtparams.is_shenghe = 'is';this.districtparams.filter.trenchnum=['11', '21', '25'];return;}
                var obj = this.districtparams.filter;
                delete this.districtparams.is_shenghe;
                 obj = Object.assign(obj, {'trenchnum':[e]});
                 this.districtparams.filter = obj;
              },
              linesproviceChange (e) { //折线图省份改变
                this.cityList2 = [];
                if (e == '全部') {delete this.linesparams.filter.province; return;}
                 var obj = this.linesparams.filter;
                 obj = Object.assign(obj, {'province':[e]});
                 this.linesparams.filter = obj;
                 this.cparamslast.areaName = e;
                 this.getCdata2();
              },
              linescityChange (e) {  //折线图市改变
                this.districtList = [];
                if (e == '全部') {delete this.linesparams.filter.city; return;}
                 var obj = this.linesparams.filter;
                 obj = Object.assign(obj, {'city': [e]});
                 this.linesparams.filter = obj;
                 this.dparams.areaName =e;
                 this.getDdata();
              },
              linesdistrictChange (e) {
                if (e == '全部') {delete this.linesparams.filter.district; return;}
                 var obj = this.linesparams.filter;
                 obj = Object.assign(obj, {'county':[e]});
                 this.linesparams.filter = obj;
              },
              getDefaultDate () {
                var t=new Date();
                var iToDay=t.getDate();
                var iToMon=t.getMonth();
                var iToYear=t.getFullYear();
                var endday = t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay-30)).toLocaleDateString();
                this.startday = startday;
                this.endday = endday;
                this.linesparams.time = [startday, endday];
                this.staFilterparams.time = ['2015-01-01', endday];
                this.lineFilterparams.time = [startday, endday];
                this.provinceparams.time =  ['2015-01-01', endday];
                this.cityparams.time = ['2015-01-01', endday];
                this.districtparams.time= ['2015-01-01', endday];
            },
            dayslenthChange (e) {
                var t=new Date();
                var iToDay=t.getDate();
                var iToMon=t.getMonth();
                var iToYear=t.getFullYear();
                var  endday= t.toLocaleDateString();
                var startday = new Date(iToYear, iToMon, (iToDay-e)).toLocaleDateString();
                this.startday = startday;
                this.endday = endday;
                this.lineFilterparams =  [startday, endday];
                this.linesparams.time = [startday, endday];
                this.getLinesFilterData();
            },
            getCdata () {
              var _this = this;
              _this.$http({
                method: 'POST',
                url: '/bi/shop/series',
                body: _this.cparams,
                header: 'Accept application/json'
              }).then(response => {
                if (response.body.code == 0 ) {
                  _this.cityList = response.body.data;
                   var all = {'city': '全部'};
                  _this.cityList.push(all);
                }
              });
            },
            getCdata2 () {
              var _this = this;
              _this.$http({
                method: 'POST',
                url: '/bi/shop/series',
                body: _this.cparamslast,
                header: 'Accept application/json'
              }).then(response => {
                if (response.body.code == 0 ) {
                  _this.cityList2 = response.body.data;
                  var all = {'city': '全部'};
                  _this.cityList2.push(all);
                }
              });
            },
            getDdata () {
              var _this = this;
              _this.$http({
                method: 'POST',
                url: '/bi/shop/series',
                body: _this.dparams,
                header: 'Accept application/json'
              }).then(response => {
                if (response.body.code == 0 ) {
                  _this.districtList = response.body.data;
                  var all = {'county': '全部'};
                  _this.districtList.push(all);
                }
              });
            },
            startdayChange (e) {
                this.linesparams.time[0] = e;
                this.lineFilterparams.time[0] = e;
                this.getLinesFilterData();
            },
            enddayChange (e) {
                this.linesparams.time[1] = e;
                this.lineFilterparams.time[1] = e;
                this.getLinesFilterData();
            },
            getProvinceData () {  //省分布
                var _this = this;
                _this.provincePieChartsspinShow = true;
                _this.$Loading.start();
                _this.$http({
                    // method: 'GET',
                    // url: './mock/province.json',
                    // data: _this.provinceparams,
                    method: 'POST',
                    url: '/bi/shop/rank',
                    body: _this.provinceparams,
                    header: 'Accept application/json'
                }).then(response =>{
                    if (response.body.code == 0) {
                        _this.$Loading.finish();
                        _this.provincetotal = response.body.data.total;
                        _this.provincePieChartsspinShow = false;
                        _this.provincedata = response.body.data.detail;
                        _this.provincePieData = response.body.data.detail;
                        if (response.body.data.current == 1) {
                           _this.provincerate = response.body.data.detail[0].num;
                        }
                        for(var i=0, len=_this.provincedata.length; i<len; i++){
                            _this.provinceShopTotal += _this.provincedata[i].num;
                        var obj = _this.provincedata[i];
                        var realrate = _this.provincedata[i].num/_this.provincerate*100;
                        obj = Object.assign(obj, {'realrate':realrate});
                         _this.provincedata[i] = obj;
                       }
                        _this.initProvincePieCharts();
                    } 
                });
            },
            getCityData () {
                var _this = this;
                _this.cityPieChartsspinShow = true;
                _this.$Loading.start();
                _this.$http({
                    // method: 'GET',
                    // url: './mock/city.json',
                    // data: _this.cityparams,
                    method: 'POST',
                    url: '/bi/shop/rank',
                    body: _this.cityparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                       _this.$Loading.finish();
                        _this.cityPieChartsspinShow = false;
                        _this.citydata = response.body.data.detail;
                        _this.cityPieData = response.body.data.detail;
                        if (response.body.data.current ==1) {
                            _this.cityrate = response.body.data.detail[0].num;
                        }
                        for(let i=0, len=_this.citydata.length; i<len; i++) { _this.cityShopTotal +=_this.citydata[i].num;}
                       for(let i=0, len=_this.citydata.length; i<len; i++){
                        var obj = _this.citydata[i];
                        var realrate = (_this.citydata[i].num/_this.cityrate*100).toFixed(2);
                        var zhangbi = (_this.citydata[i].num/_this.cityShopTotal*100).toFixed(2);
                        obj = Object.assign(obj, {'realrate':realrate});
                        obj = Object.assign(obj, {'zhangbi':zhangbi});
                         _this.citydata[i] = obj;
                       }
                        _this.initCityPieCharts();
                    }
                });
            },
            getdistrictData () {
                 var _this = this;
                 _this.districtPieChartsspinShow = true ;
                 _this.$Loading.start();
                _this.$http({
                    // method: 'GET',
                    // url: './mock/district.json',
                    // data: _this.districtparams,
                    method: 'POST',
                    url: '/bi/shop/rank',
                    body: _this.districtparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                       _this.$Loading.finish();
                        _this.districtPieChartsspinShow = false;
                        _this.districtdata = response.body.data.detail;
                        _this.districtPieData = response.body.data.detail;
                        if (response.body.data.current ==1) {
                            _this.districtrate = response.body.data.detail[0].num;
                        }
                        for(let i=0, len=_this.districtdata.length; i<len; i++){ _this.districtShopTotal += _this.districtdata[i].num;}
                       for(let i=0, len=_this.districtdata.length; i<len; i++){
                        var obj = _this.districtdata[i];
                        var realrate = (_this.districtdata[i].num/_this.districtrate*100).toFixed(2);
                        var zhangbi  =  (_this.districtdata[i].num/_this.districtShopTotal*100).toFixed(2);
                        obj = Object.assign(obj, {'realrate':realrate});
                        obj = Object.assign(obj, {'zhangbi':zhangbi});
                         _this.districtdata[i] = obj;
                       }
                        _this.initDistrictPieCharts();
                    }
                });
            },
            getStaFilterData () {  //获得统计排行筛选项
              var _this = this;
              _this.$http({
                // method: 'GET',
                // url: './mock/dianpushaixuan.json',
                method: 'POST',
                url: '/bi/shop/filter',
                body: _this.staFilterparams,
                header: 'Accept application/json'
              }).then(response => {
                  if (response.body.code ==0 ) {
                    _this.provinceList = response.body.data.province;
                     _this.provinceList.unshift('全部');
                    // _this.cityList = response.body.data.city;
                    // _this.cityList.unshift('全部');
                  }
                    if(response.body.code == 10106) {
                        this.$Message.warning('您尚未登录，请登录', 1.5, function () {
                           window.location.href='http://oa.zdongpin.com/';
                        });
                    }
              });
            },
            getLinesFilterData () {  //获得下面折线图筛选项
              var _this = this;
              _this.$http({
                // method: 'GET',
                // url: './mock/dianpushaixuan.json',
                // data: _this.lineFilterparams,
                method: 'POST',
                url: '/bi/shop/filter',
                body: _this.lineFilterparams,
                header: 'Accept application/json'
              }).then(response => {
                  if (response.body.code ==0 ) {
                    _this.provinceList2 = response.body.data.province;
                    _this.provinceList2.unshift('全部');
                    // _this.cityList2 = response.body.data.city;
                    // _this.cityList2.unshift('全部');
                    // _this.districtList = response.body.data.county;
                    // _this.districtList.unshift('全部');
                  }
              });
            },
            initProvincePieCharts (){
                var _this = this,
                myCharts = eCharts.init(document.getElementById('provincePieCharts'));
                var totalPieData = _this.provincePieData,
                    provinceName = [],
                    provinceShopNum = [];
                    for(var i = 0, len = totalPieData.length; i<len; i ++){
                        provinceName.push(totalPieData[i].province);
                        provinceShopNum.push(totalPieData[i].num);
                    }
                   var colors = ['#A8246E', '#99CDFF', '#F1194B', '#CCFF9A', '#EF6B41', '#CCCCFE', '#2F9597', '#28353E', '#9BB89C', '#F48380'];
                myCharts.setOption({
                     color: colors,
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '40%'],
                            data:[
                                {value:provinceShopNum[0], name:provinceName[0]},
                                {value:provinceShopNum[1], name:provinceName[1]},
                                {value:provinceShopNum[2], name:provinceName[2]},
                                {value:provinceShopNum[3], name:provinceName[3]},
                                {value:provinceShopNum[4], name:provinceName[4]},
                                {value:provinceShopNum[5], name:provinceName[5]},
                                {value:provinceShopNum[6], name:provinceName[6]},
                                {value:provinceShopNum[7], name:provinceName[7]},
                                {value:provinceShopNum[8], name:provinceName[8]},
                                {value:provinceShopNum[9], name:provinceName[9]}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            initCityPieCharts () {
                 var _this = this,
                myCharts = eCharts.init(document.getElementById('cityPieCharts'));
                var totalPieData = _this.cityPieData,
                    cityName = [],
                    cityShopNum = [];
                    for(var i = 0, len = totalPieData.length; i<len; i ++){
                        cityName.push(totalPieData[i].city);
                        cityShopNum.push(totalPieData[i].num);
                    }
                    var colors = ['#A8246E', '#99CDFF', '#F1194B', '#CCFF9A', '#EF6B41', '#CCCCFE', '#2F9597', '#28353E', '#9BB89C', '#F48380'];
                    myCharts.setOption({
                     color: colors,
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '40%'],
                            data:[
                                {value:cityShopNum[0], name:cityName[0]},
                                {value:cityShopNum[1], name:cityName[1]},
                                {value:cityShopNum[2], name:cityName[2]},
                                {value:cityShopNum[3], name:cityName[3]},
                                {value:cityShopNum[4], name:cityName[4]},
                                {value:cityShopNum[5], name:cityName[5]},
                                {value:cityShopNum[6], name:cityName[6]},
                                {value:cityShopNum[7], name:cityName[7]},
                                {value:cityShopNum[8], name:cityName[8]},
                                {value:cityShopNum[9], name:cityName[9]}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            initDistrictPieCharts () {
                 var _this = this,
                myCharts = eCharts.init(document.getElementById('districtPieCharts'));
                 var totalPieData = _this.districtPieData,
                    districtName = [],
                    districtShopNum = [];
                    for(var i = 0, len = totalPieData.length; i<len; i ++){
                        districtName.push(totalPieData[i].county);
                        districtShopNum.push(totalPieData[i].num);
                    }
                    var colors =  ['#A8246E', '#99CDFF', '#F1194B', '#CCFF9A', '#EF6B41', '#CCCCFE', '#2F9597', '#28353E', '#9BB89C', '#F48380'];
                    myCharts.setOption({
                     color: colors,
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    series : [
                        {
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '40%'],
                            data:[
                                {value:districtShopNum[0], name:districtName[0]},
                                {value:districtShopNum[1], name:districtName[1]},
                                {value:districtShopNum[2], name:districtName[2]},
                                {value:districtShopNum[3], name:districtName[3]},
                                {value:districtShopNum[4], name:districtName[4]},
                                {value:districtShopNum[5], name:districtName[5]},
                                {value:districtShopNum[6], name:districtName[6]},
                                {value:districtShopNum[7], name:districtName[7]},
                                {value:districtShopNum[8], name:districtName[8]},
                                {value:districtShopNum[9], name:districtName[9]}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            getLinesData () {
                var _this = this ;
                _this.$Loading.start();
                 _this.linesspinShow = true;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/zhexian.json',
                    // data: _this.linesparams,
                    method: 'POST',
                    url: '/bi/shop/chart',
                    body: _this.linesparams,
                    header: 'Accept application/json'
                }).then(response => {
                    if (response.body.code == 0) {
                      _this.$Loading.finish();
                        _this.linesspinShow = false;
                        _this.linesdata = response.body.data;
                        _this.initLinesCharts();
                    }
                });
            },
            initLinesCharts () {
                var _this = this,
                    myCharts = eCharts.init(document.getElementById('linesCharts'));
                var totalLinesData = _this.linesdata,
                    xTime = [],
                    yNewOne = [],
                    yNewTwo = [],
                    yNewRes = [];
                   for(let i =  0, len=totalLinesData[11].length; i<len; i++){
                    xTime.push(totalLinesData[11][i].time);
                    yNewOne.push(totalLinesData[11][i].num);
                   }
                   for(let i =  0, len=totalLinesData[21].length; i<len; i++){
                    yNewTwo.push(totalLinesData[21][i].num);
                   }
                   for(let i =  0, len=totalLinesData[25].length; i<len; i++){
                    yNewRes.push(totalLinesData[25][i].num);
                   }
                myCharts.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        y: 'bottom',
                        data:['新增一批', '新增二批', '新增餐厅']
                    },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,  
                    data: xTime
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'新增一批',
                        type:'line',
                        stack: '总量',
                        data:yNewOne
                    },
                    {
                        name:'新增二批',
                        type:'line',
                        stack: '总量',
                        data: yNewTwo
                    },
                    {
                        name:'新增餐厅',
                        type:'line',
                        stack: '总量',
                        data:yNewRes
                    }
                ]
                });
            }
        },
        created () {
            this.getDefaultDate();
            this.getStaFilterData();
            this.getLinesFilterData();
            // this.getCityFilterData();
            this.getProvinceData();
            this.getCityData();
            this.getdistrictData();
            this.getLinesData();
        }
    };
</script>