<template>
  <div id="allprovidersUndershelf">
      <div class="inner">
                <div class="actions_area">
                    <button class="dcm_so_btn">上架</button>
                </div>
                <!-- 表格 -->
                <Table border :columns="underShelfcolumns" :data="underShelfdata"></Table>
                <div class="pageBar">
                    <Page :current="underShelfcurrent"  :total="underShelftotal" simple></Page>
                </div>
            </div>
  </div>
</template>
<script>
export default {
    data () {
      return {
        arr:[1,2,3],
        shoplevel: [1,1,1,1],
        underShelfcolumns: [
              {
                        type: 'selection',
                        align: 'center',
                        width: '7%',
                        title: '全选'
                    },
                    {
                        title: '供应商名称',
                        width: '10%',
                        align: 'center',
                        key: 'name',
                        render: (h, params) =>{
                            return h('div', [
                                h('i', {
                                    'class' : {
                                        'iconfont': true,
                                        'icon-unfavourite': true
                                    },
                                    style: {
                                        fontSize: '20px',
                                        color: '#12b571',
                                        marginRight: '5px'
                                    }
                                }),
                                h('span', params.row.name)
                            ])
                        }
                    },
                    {
                        title: '店铺等级',
                        width: '9.4%',
                        align: 'center',
                        key: 'age',
                        render: (h, params) => {
                            return h('div',this.shoplevel.map(function(){
                                return h('span',{
                                    'class': {
                                                    'iconfont': true,
                                                    'icon-medal': true
                                                },
                                                style: {
                                                    fontSize: '24px',
                                                    color: '#ff8400'
                                                }
                                })
                            }))
                        }
                    },
                    {
                        title: '发货地址',
                        align: 'center',
                        width: '7%',
                        key: 'address'
                    },
                    {
                        title: '服务评价',
                        width: '11%',
                        align: 'center',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('span', this.arr.map(function(){
                                        return h('span', [
                                            h('Icon',{
                                                'class': {
                                                    'iconfont': true,
                                                    'icon-xingxing-copy-copy-copy': true
                                                },
                                                style: {
                                                    fontSize: '20px',
                                                    color: '#ff8400'
                                                }
                                            }) 
                                        ])
                                })),
                                h('span',[
                                    h ('Icon', {
                                        'class': {
                                            'iconfont': true,
                                            'icon-star-outline': true
                                        },
                                        style: {
                                                    fontSize: '20px',
                                                    color: '#ff8400'
                                                }
                                    })
                                ])
                            ])
                        }
                    },
                    {
                        title: '发货速度',
                         width: '11%',
                        align: 'center',
                        key: 'address'
                    },
                    {
                        title: '商品总评',
                         width: '11%',
                        align: 'center',
                        key: 'address'
                    },
                    {
                        title: '销售品种',
                        align: 'center',
                         width: '11%',
                        key: 'address'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        background: '#45c8dc',
                                        borderColor: '#45c8dc',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click: () => {
                                            this.putOnShelf(params.index, params.row.id)
                                        }
                                    }
                                }, '上架')
                            ]);
                        }
                    }
          ],
          underShelfdata: [
                    {   id: 1,
                        name: '王小明22',
                        age: 4,
                        address: 2,
                    },
                    {   id: 2,
                        name: '王小明33',
                        age: 4,
                        address: 2,
                        
                    }
            ]
      }
    },
    created () {

    }
}
</script>
<style lang="less">
#allprovidersUndershelf {
  .inner{margin-left: 30px;}
}
</style>

