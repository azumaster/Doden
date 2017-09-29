<template>
    <div id="shopInfo" class="shop-info">
        <div class="operate">
            <Button type="primary" size="large" @click="save" style="margin-right: 30px">保存更改</Button>
            <Button size="large" @click="close">关闭店铺</Button>
        </div>
        <div class="layout-body form">
            <Form :model="auditedManage" :label-width="80">
                <Form-item label="店铺名称">
                    <Input v-model="auditedManage.shopName" placeholder="请输入店铺名称"></Input>
                </Form-item>
                <Form-item label="姓名">
                    <Input v-model="auditedManage.name" placeholder="请输入姓名"></Input>
                </Form-item>
                <Form-item label="店铺类型">
                    <Row>
                        <Col span="11">
                        <Select style="width:200px">
                            <Option v-for="item in shopType" :value="item.id" :key="item" placeholder="请选择
                            店铺类型">{{ item.name }}</Option>
                        </Select>
                        </Col>
                        <Col span="3" style="text-align: center">
                        微信分组</Col>
                        <Col span="10">
                        <Select style="width:200px">
                            <Option v-for="item in wechatGroup" :value="item.id" :key="item" placeholder="请选择
                            微信分组">{{ item.name }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="所属市场">
                    <Cascader :data="auditedManage.market" style="width: 200px"></Cascader>
                </Form-item>
                <Form-item label="店铺地址">
                    <Row>
                        <Col span="8">
                        <Cascader :data="auditedManage.shopAddress.shop" style="width: 200px"></Cascader>
                        </Col>
                        <Col span="16">
                        <Input v-model="auditedManage.shopAddress.detail" placeholder="请输入店铺门牌号"></Input></Col>
                    </Row>
                </Form-item>
                <Form-item label="店铺照片">
                    <div class="img"><img
                            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495534757&di=e4b1e89e6eb996092d3c54401485cd2f&imgtype=jpg&er=1&src=http%3A%2F%2Fqstatic.zuimeia.com%2Fimg%2Fcovers%2Fcld%2F2016012017505129177_640x360.jpeg">
                    </div>
                    <Upload action="" style="margin-top: 15px">
                        <Button type="ghost" icon="ios-cloud-upload-outline">更换照片</Button>
                    </Upload>
                </Form-item>
            </Form>
        </div>
    </div>
</template>

<script>
    import down from './../../../components/select.vue';
    import Base from './../../../common/base.js';
    export default {
        name: 'shopInfo',
        mixins: [Base],
        components: {
            down
        },
        data: function () {
            return {
                module: 'audited',
                refused: false,
                refuseForm: {
                    refuseInfo: ''
                },
                refuseRule: {
                    refuse: []
                },
                auditedManage: {
                    phone: '15812345678',
                    shopName: 'ABC',
                    name: '是的雷锋精神',
                    shopType: [{id: 0, name: '供应商'}],
                    wechatGroup: [{id: 0, name: '四川二批'}],
                    market: [{
                        value: 'sichuan', label: '四川省', children: [
                            {value: 'hbw', label: '海霸王'}, {value: 'qbj', label: '青白江'}
                        ]
                    }],
                    shopAddress: {
                        shop: [{
                            value: 'sichuan', label: '四川省', children: [
                                {
                                    value: 'cds', label: '成都市', children: [{
                                    value: 'slq', label: '双流区'
                                }]
                                }
                            ]
                        }],
                        detail: ''
                    }
                }
            };
        },
        methods: {
            // back: function () {
            //     window.location.href = '/#/audited';
            // },
            save: function () {
                this.$Modal.confirm({
                    title: '提示',
                    content: '你是否保存更改该店铺信息？',
                    okText: '保存',
                    onOk: function () {

                    }
                });
            },
            close: function () {
                this.$Modal.confirm({
                    title: '提示',
                    content: '你是否要关闭此店铺？',
                    okText: '关闭',
                    onOk: function () {

                    }
                });
            }
        },
        created () {
            this.getShopDetail();
        }
    };
</script>