<template>
    <div>
        <div class="filter_bar" style="margin-bottom: 20px">
            <Row :gutter="20">
                <i-col span="5" class="filter-item" style="display: flex">
                    <DatePicker type="date" @on-change="changeStartTime" :value="startTime" placeholder="请选择开始时间"></DatePicker>
                    <span style="line-height: 32px; margin: 0 5px">至</span>
                    <DatePicker type="date" @on-change="changeEndTime" :value="endTime" placeholder="请选择结束时间"></DatePicker>
                </i-col>
                <i-col span="6" class="filter-item" style="display: flex">
                    <Select v-model="province" clearable placeholder="选择省" @on-change="changeProvince">
                        <Option v-for="(item, i) in currentProvince" :value="i" :key="i">{{ item }}</Option>
                    </Select>
                    <Select v-model="city" clearable placeholder="选择市" @on-change="changeCity">
                        <Option v-for="(item, i) in currentCity" :value="i" :key="i">{{ item }}</Option>
                    </Select>
                    <Select v-model="county" clearable placeholder="选择区" @on-change="changeCounty">
                        <Option v-for="(item, i) in currentCounty" :value="i" :key="i">{{ item }}</Option>
                    </Select>
                </i-col>
                <i-col span="2" class="right"><Button type="primary" @click="doFilter">确认筛选</Button></i-col>
                <i-col span="5" class="filter-item right"><div style="width: 100%;height: 30px"><Input v-if="showSearch" v-model="searchContext" placeholder="请输入搜索内容"></Input></div></i-col>
                <i-col span="4" class="filter-item right"><Select v-model="filterSearch" @on-change="changeFilter">
                    <Option v-for="item in filterSearchItem" :value="item.value" :key="item.value">{{item.label}}
                    </Option>
                </Select></i-col>
            </Row>
        </div>
        <div class="data-all">
            <Row>
                <i-col span="3">订单评价率：100%</i-col>
                <i-col span="3">已评价订单：581477</i-col>
                <i-col span="3">好评率：100%</i-col>
                <i-col span="3">中评率：100%</i-col>
                <i-col span="3">中评率：100%</i-col>
                <i-col span="3">差评率：100%</i-col>
                <i-col span="3">带图评价率：100%</i-col>
            </Row>
            <Row>
                <i-col span="3">店铺平均好评率：100%</i-col>
                <i-col span="3">店铺平均配送分：100</i-col>
                <i-col span="3">店铺平均服务分：100</i-col>
            </Row>
        </div>
        <div class="table_iner" v-if="isTable">
            <Table  :columns="columns" :data="data" @on-sort-change="sort"></Table>
            <div style="margin-top: 20px"><Page :total="total" :page-size="params.page_size" @on-change="changePage"></Page></div>
            <Spin size="large" fix v-if="tableShow"></Spin>
        </div>
        <appraise :data="data" v-else></appraise>
    </div>
</template>
<script>
    import appraise from './appraise.vue';

    export default {
        components: {
            appraise: appraise
        },
        data() {
            return {
                startTime: '',
                endTime: '',
                sort_type: 4,
                sort_type_way: '',
                currentArea: [],
                currentProvince: [],
                province: '',
                currentCity: [],
                city: '',
                currentCounty: [],
                county: '',
                showSearch: false,
                filterSearch: 'all',
                filterSearchItem: [{label: '全部店铺', value: 'all'}, {label: '搜索店铺', value: 'dianPuName'}, {label: '搜索商品', value: 'goods'}],
                searchContext: '',
                columns: [],
                aColumns: [{title: '排名', key: 'dataIndex'}, {title: '店铺名称', key: 'name'}, {title: '注册时间', key: 'ZhuCe', sortable: 'custom'}, {title: '交易金额', key: 'allSale', sortable: 'custom'},
                    {title: '配送评价', key: 'deliverySpeed'}, {title: '服务评价', key: 'servicePlatform'}, {title: '评价数量', key: 'appraiseNum', sortable: 'custom'},
                    {title: '好评率', key: 'goodAppraise', sortable: 'custom'}],
                gColumns: [{title: '排名', key: 'dataIndex'}, {title: '商品名称', key: 'gname'}, {title: '上架时间', key: 'addtime'}, {title: '商品单价', key: 'goods_price'},
                    {title: '销售数量', key: 'saleNum'}, {title: '评价数量', key: 'appraiseNum'}, {title: '好评率', key: 'appraiseGood'}, {title: '店铺名称', key: 'dianPuName'},
                    {title: '服务评价', key: 'servicePlatform'}, {title: '配送评价', key: 'deliverySpeed'}],
                params: {page_size: 10, page_num: 1},
                data: [],
                total: 0,
                isTable: true, //控制显示是table还是chart
                tableShow: true
            };
        },
        methods: {
            /**
             * 准备过程
             */
            init(){
                let year = new Date().getFullYear(),
                    month = (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1),
                    day = new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate();

               let lastDate= new Date();
                   lastDate.setMonth(new Date().getMonth()-1);
               let lastYear = lastDate.getFullYear(),
                   lastMonth = (lastDate.getMonth()+1)<10?'0'+(lastDate.getMonth()+1):(lastDate.getMonth()+1),
                   lastDay = lastDate.getDate()<10?'0'+lastDate.getDate():lastDate.getDate();

                this.startTime = lastYear+'-'+lastMonth+'-'+lastDay;
                this.endTime = year+ '-'+month+'-'+day;
                this.getData();
            },
            /**
             * 获取数据
             */
            async getData() {
                this.$Loading.start();
                await new Promise(resolve => this.getApprise(resolve));
                await new Promise(resolve => this.getProvince(resolve));
                this.$Loading.finish();
            },
            // 获取评价数据
            getApprise(resolve){
                let params = {},
                    _this = this;

                this.isTable  = true;

                params.start_time = this.startTime;
                params.end_time = this.endTime;
                params.page_size = this.params.page_size;
                params.page_num = this.params.page_num;
                params.type = 1;
                if(this.filterSearch != 'all') {
                    params.seek = this.filterSearch;
                    params.seekVal = this.searchContext;
                }
                if(this.sort_type){
                    params.sort_type = this.sort_type;
                }
                if(this.sort_type_way){
                    params.sort_type_way = this.sort_type_way;
                }

                if(this.province || this.province === 0) params.province = this.currentProvince[this.province];
                if(this.city || this.city === 0) params.city = this.currentCity[this.city];
                if(this.county || this.county === 0) params.district = this.currentCounty[this.county];

                window.req.getProviders(this, params, (res) => {
                    if(res.code == 0) {
                        res.data.data.map((data, i)=>{
                            data.dataIndex = (res.data.current_page - 1) * _this.params.page_size + (i+1);
                        });
                        _this.data = res.data.data;
                        _this.total  = res.data.total;
                        if(res.data.data.length==1 && _this.filterSearch != 'all'){
                            _this.isTable = false;
                        }
                        _this.columns = _this.aColumns;
                    }else {
                        _this.$Message.error(res.message);
                    }
                    this.tableShow  = false;
                    if(resolve) resolve('ok');
                });
            },
            // 获取商品数据
            getGoods(){
                let params = {},
                    _this = this;

                this.isTable  = true;

                params.start_time = this.startTime;
                params.end_time = this.endTime;
                params.page_size = this.params.page_size;
                params.page_num = this.params.page_num;
                params.type = 1;
                params.seek = this.filterSearch;
                params.seekVal = this.searchContext;
                if(this.province || this.province === 0) params.province = this.currentProvince[this.province];
                if(this.city || this.city === 0) params.city = this.currentCity[this.city];
                if(this.county || this.county === 0) params.district = this.currentCounty[this.county];

                window.req.getGoods(this, params, function (res) {

                    if(res.code == 0) {
                        res.data.data.map((data, i)=>{
                            data.dataIndex = (res.data.current_page - 1) * _this.params.page_size + (i+1);
                        });
                        _this.data = res.data.data;
                        _this.columns = _this.gColumns;
                        _this.total  = res.data.total;
                    }else {
                        _this.$Message.error(res.message);
                    }
                });
            },
            // 获取省市的信息
            getProvince(resolve, id){
                let params = {};
                if(id || id === 0) params.pid = id;

                window.req.getProvince(this, params, res =>{
                    if(res.code == 0) {
                        if (params.pid) {
                            this.currentCity = res.data;
                        } else {
                            this.currentProvince = res.data;
                        }
                    }
                    if(resolve) resolve('ok');
                });
            },
            // 获取区县的信息
            getCounty(pid, cid){
                let params = {pid: pid, cid: cid};

                window.req.getCounty(this, params, res =>{
                    if(res.code == 0) {
                        this.currentCounty = res.data;
                    }
                });
            },
            /**
             * 一些事件
             */
            // 更改时间控件的内容
            changeStartTime(data){
                this.startTime = data;
            },
            changeEndTime(data){
                this.endTime = data;
            },
            // 更改省
            changeProvince(item){
                this.currentCity = [];
                this.currentCounty = [];
                this.getProvince(null, item);
            },
            // 更改市
            changeCity(item){
                this.currentCounty = [];
                this.getCounty(this.province, item);
            },
            // 更改区县
            changeCounty(){

            },
            // 排序
            sort(key){
                let keyType = {'ZhuCe': 1, 'allSale':2, 'appraiseNum': 3, 'goodAppraise': 4};

                this.sort_type = keyType[key.key];
                this.sort_type_way = '';
                if(key.order == 'asc'){
                    this.sort_type_way = key.order;
                }
                this.params.page_num = 1;

                this.getApprise();
            },
            // 更改筛选项的项目
            changeFilter(e) {

                if(e != 'all') this.showSearch = true;
                else this.showSearch = false;

                this.filterSearch = e;
            },
            //开始筛选
            doFilter() {
                if(this.filterSearch!='all'){
                    if(this.searchContext.length<=0){
                        this.$Message.error({
                            content: '宝宝不想说话，并向你抛出一个<span style="color: red">搜索输入框不能为空</span>的白眼~',
                            duration: 5
                        });
                    }else{
                        this.params.page_num = 1;
                        this.sort_type = '';
                        this.sort_type_way = '';
                        if(this.filterSearch == 'goods'){
                            this.getGoods();
                        }else{
                            this.getApprise();
                        }
                    }
                }else{
                    this.sort_type = 4;
                    this.sort_type_way = '';
                    this.params.page_num = 1;

                    console.log(this.sort_type);
                    this.getApprise();
                }
            },
            // 翻页
            changePage(page){
                this.params.page_num = page;
                this.getApprise();
            }
        },
        created() {
            this.init();
        }
    };
</script>
<style lang="less" scoped>
    #chart {
        width: 100%;
        height: 500px;
        border: 2px solid #f5f5f5;
    }
</style>
