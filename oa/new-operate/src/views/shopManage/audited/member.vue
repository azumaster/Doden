<template>
    <div id="member" class="member">
        <div>123444</div>
        <div class="table">
            <Table border :columns="th" :data="td"></Table>
        </div>
        <!-- <div class="paging">
            <Page :total="total" :current="params.page" :page-size="params.size"></Page>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'member',
        data: function () {
            return {
                // total: 0,
                params: {page: 1, size: 20},
                th:[{title:'姓名', key:'xingming'}, {title: '角色', key:'role'}, {title: '电话', key:'lianxiTel'},
                    {title: '操作', render: (h, params)=>{
                        return h('div', [h('strong', {props: {type: 'primary', size: 'small' }, on: {
                            click: () => { this.delMember(params.index, params.row);}
                        }}, params.row.operate)]);
                    }}],
                td:[],
                delparasm: {}
            };
        },
        methods: {
            delMember: function (index,row) {
                var _this = this;
                this.$Modal.confirm({
                    title: '提示',
                    content: '你是否要从店铺中删除该成员？',
                    okText: '删除',
                    onOk: function () {
                        _this.removeMember(index,row)
                    }
                });
            },
            removeMember (index,row) {
                var _this = this;
                _this.delparasm.shId = row.shId;
                _this.delparasm.shopId = row.shopId;
                _this.$http({
                    // method: 'GET',
                    // url: './mock/del.json',
                    method: 'POST',
                    url: '/shop/member/del',
                    body: _this.delparasm,
                    header: 'application/json'
                }).then (response => {
                    if (response.body.code == 0) {
                        console.log(_this.delparasm);
                        // _this.td.splice(index, 1);
                        _this.$Message.success('成员删除成功');
                        _this.getMember();
                    }
                })
                
            },
            getMember () {
                var _this = this;
                _this.$http({
                    method: 'GET',
                    url: './mock/chenyuan.json',
                    // url: '/shop/member',
                    params: _this.params,
                    header: 'application/json'
                }).then( response => {
                    if (response.body.code == 0) {
                        var memberData = response.body.data;
                        for (var i in memberData) {
                            if (memberData[i].laoBanHao != 0) {
                               memberData[i] = Object.assign(memberData[i], {'operate': '删除成员'});
                            }
                            if (memberData[i].laoBanHao == 0){
                                memberData[i] = Object.assign(memberData[i], {'operate': '添加员工'});
                            }


                            if (memberData[i].laoBanHao == 0) {
                                memberData[i] = Object.assign(memberData[i], {'role': '老板'}, {'operate': '添加员工'});
                            }
                            else if (memberData[i].laoBanHao == 1) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '库管'});
                            }
                            else if (memberData[i].laoBanHao == 2) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '接单员'});
                            }
                            else if (memberData[i].laoBanHao == 3) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '小老板(合作伙伴)'});
                            }
                            else if (memberData[i].laoBanHao ==4 ) {
                                 memberData[i] = Object.assign(memberData[i], {'role': '普通员工'});
                            };
                        };
                        _this.td = memberData;
                    };
                });
            }
        },
        created () {
            this.getMember();
            alert(123);
        }
    };//已OK
</script>