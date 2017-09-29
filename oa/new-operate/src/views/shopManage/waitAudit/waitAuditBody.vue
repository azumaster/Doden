<template>
    <div class="layout-body">
    <div class="operate">
        <Select v-model="params.province_id" style="width:200px" @on-change="soProvinceChange">
        <Option v-for="item in soprovinceList" :value="item.province_id" :key="item">{{ item.dividename }}</Option>
    </Select>
    <Select v-model="params.search_type" style="width:200px">
        <Option v-for="item in searchList" :value="item.type" :key="item">{{ item.name }}</Option>
    </Select>
    <Input v-model="params.search" placeholder="请输入搜索内容" style="width: 300px"></Input>
    <Button @click="sousuo">搜索</Button>
    </div>
        <div class="table">
            <Table border :columns="th" :data="data"></Table>
        </div>
        <div class="paging">
            <Page :total="total" :current="this.$store.state.page" :page-size="params.size" @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script>
    import search from './../../../components/search.vue';
    import Base from  './../../../common/base.js';
    export default {
        mixins: [Base],
        name: 'waitAuditBody',
        components: { search },
        data: function () {
            return {
                // params: {
                //     shengheAct: 0,
                //     page: 1,
                //     size: 10
                // },
                params: {
                    shengheAct: 0,
                    province_id: 0,
                    page:1,
                    size:10,
                    search_type: 'shop_name',
                    search: ''
                },
                soprovinceList: [],
                search: {
                    filter: [{id: 0, name: '店铺名称'}, {id: 1, name: '手机号码'}]
                },
                th:[{title:'店铺名', key:'dianPuName'}, {title: '姓名', key:'xingming'}, {title: '注册电话', key: 'lianxiTel'}, {title: '注册时间', key: 'zhuceTime'},
                    {title: '店铺地址', key: 'xiangXiDiZi'}, {title: '操作', key: 'operate', render: (h, params)=>{
                        return h('div', [h('Button', {props: {type: 'primary', size: 'small' }, on: {
                            click: () => { this.auditing(params.row.shopId);}
                        }}, '审核')]);
                    }}],
                data:[]
            };
        },
        methods: {
            auditing: function (id) {
                window.location.href = '/html/shop-check/index.html#/waitAudit/auditing?id='+id;
                // http://localhost:8080/#/waitAudit/auditing?id=1391
                // window.location.href = '/#/waitAudit/auditing?id='+id;
            }
        },
        created () {
            this.params.page = this.$store.state.page;
            this.getData();
        }
    };
</script>