<template>
    <div class="layout-body">
        <!-- <search></search> -->
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
            <Page :total="total" :current="params.page" :page-size="params.size" @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script>
    import search from './../../../components/search.vue';
    import Base from  './../../../common/base.js';
    export default {
        mixins: [Base],
        name: 'audited',
        components: {search},
        data: function () {
            return {
                // params: {shengheAct: 2, page: 1, size: 10},
                params: {
                    shengheAct: 2,
                    province_id: 0,
                    page: 1, 
                    size: 10,
                    search_type: 'shop_name',
                    search: ''
                },
                soprovinceList: [],
                th:[{title:'店铺名', key:'dianPuName'}, {title: '姓名', key:'xingming'},
                    {title: '电话', key:'lianxiTel'}, {title: '注册时间', key: 'zhuceTime'}, {title: '店铺地址', key: 'xiangXiDiZi'},
                    {title: '拒绝理由', key: 'grounds'}, {title: '操作', key: 'operate', render: (h, params)=>{
                        return h('div', [h('Button', {props: {type: 'primary', size: 'small' }, on: {
                            click: () => { this.auditing(params.row.shopId);}
                        }}, '审核')]);
                    }}],
                data:[],
                trenchnum: 0
            };
        },
        methods: {
            auditing: function (id) {
                window.location.href = '/html/shop-check/index.html#/refused/manage?id='+id;
                // window.location.href = '/#/refused/manage?id='+id;
            }
        },
        created () {
            this.getData();
        }
    };
</script>