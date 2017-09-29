<template>
	<div>
		<Card>
			<Select  style="width:200px;margin-bottom: 21px;margin-right: 20px;" placeholder="全部" @on-change="ticketChange">
        <Option v-for="item in ticketList" :value="item.type_no" :key="item">{{ item.name }}</Option>
    </Select>
    <Select  style="width:200px;margin-bottom: 21px;" placeholder="全部" @on-change="exchangeChange">
        <Option v-for="item in ticketType" :value="item.value" :key="item">{{ item.label }}</Option>
    </Select>

    <template>
    <Table border :columns="columns" :data="data" stripe border></Table>
     <Page :current="exhangedparams.page" show-elevator :total="total" simple @on-change="pageChange"></Page>
</template>
		</Card>
	</div>
</template>
<script>
    // import Localbase from '../../common/localbase.js';  //本地
    import Base from '../../common/base.js'; //线上
	export default {
        // mixins: [Localbase],
        mixins: [Base],
		data () {
			return {
                total: 0,
                ticketType: [
                	{
                        value: 1,
                        label: '待兑换'
                    },
                    {
                        value: 2,
                        label: '已兑换'
                    }
                ],
                columns: [
                    {
                        title: '兑换券分类',
                        key: 'type_name',
                    },
                    {
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '消耗钻石',
                        key: 'price'
                    },
                    {
                        title: '兑换内容',
                        key: 'worth'
                    },
                     {
                        title: '店铺名',
                        key: 'shop_name'
                    },
                     {
                        title: '联系电话',
                        key: 'user_tel'
                    },
                     {
                        title: '兑换时间',
                        key: 'buy_time'
                    },
                    {
                        title: '状态',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, exhangedparams) => {
                           if (exhangedparams.row.audit == '已兑换') {
                                return h('div', [
                                h('strong', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, exhangedparams.row.audit)
                            ]);
                           }
                        else {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(exhangedparams.row.id);
                                        }
                                    }
                                }, exhangedparams.row.audit)
                            ]);
                        }
                        }
                    }
                ],
                data: [],
                exhangedparams: {
                    page:1,
                    size:10
                },
                ticketstatusparams: {
                    status:2,
                    id: 0
                }
			}
		},
        methods: {
            pageChange (e) {
                this.exhangedparams.page = e;
                this.getExchangeHistory();
            },
            show (index) {
                var _this = this;
                _this.$Modal.confirm({
                    title: '用户信息',
                    content: `确认该兑换券已兑换`,
                    onOk: () => {
                        _this.ticketstatusparams.id = index;
                        _this.ticketstatusChange();
                    }
                });
            },
            ticketChange (e) {
                if (e == 'all_ticket') {delete this.exhangedparams.type_no; this.getExchangeHistory(); return;}
                this.exhangedparams.page = 1;
                this.exhangedparams.type_no = e;
                this.getExchangeHistory();
            },
            exchangeChange (e) {
                this.exhangedparams.status = e;
                this.getExchangeHistory();
            }
        },
        created () {
            this.getExchangeHistory();
        }
	}
</script>