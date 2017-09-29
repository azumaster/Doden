<template>
  <div id="allprovidersOnshelf">
      <div class="inner">
                <div class="actions_area">
                    <button class="dcm_so_btn">下架</button>
                    <button class="dcm_so_btn">改价</button>
                    <span class="txt">自动上架已选分类商品</span>
                    <i-switch size="large" v-model="switch1">
                        <span slot="open">ON</span>
                        <span slot="close">OFF</span>
                    </i-switch>
                    <span class="dcanmou_newUpload_time">最新上传时间：<span>{{newTime}}</span></span> <!--这个为全局样式-->
                </div>
                <!-- 表格 -->
                <Table border :columns="onShelfcolumns" :data="onShelfdata"></Table>
                <div class="pageBar">
                    <Page :current="onShelfcurrent"  :total="onShelftotal" simple></Page>
                </div>
            </div>
            <!-- 改价 -->
  <div class="dcanmou_modal_shade" id="dcanmou_modal_shade" v-if="changePriceModel">
        <div class="dcanmou_modal" >
        <p class=" modal_title">改价方式</p>
        <i class="iconfont icon-icon dcanmou_close" @click="changePriceModel=!changePriceModel"></i>
        <Tabs>
            <TabPane label="按元改价" icon="checkmark-circled">
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus"></Button>
                    <div class="iptPrice">
                        <input/>
                        <span>元</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按百分比改价" icon="checkmark-circled">
                <div class="rmbchange">
                    <span>价格增加 </span>
                    <Button type="primary" shape="circle" icon="plus"></Button>
                    <div class="iptPrice">
                        <input/>
                        <span>%</span>
                    </div>
                    <Button type="primary" shape="circle" icon="minus"></Button>
                    <p class="btns">
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                </div>
            </TabPane>
            <TabPane label="按区间改价" icon="checkmark-circled">
                <div class="section">
                    <p>价格修改为</p>
                    <div class="changePriceActionArea">
                        <p class="actionInfo" v-for="item in add" key="item">
                            <input/> <span class="jian">-</span><input/>
                            <Select style="width:60px">
                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <Select style="width:60px">
                                <Option v-for="item in cityLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <input/>
                            <span>元</span>
                            <Icon type="ios-trash-outline"></Icon>
                        </p>
                        <p class="btns">
                        <button class="dcm_so_btn add" @click="addRuler"><Icon type="plus-circled"></Icon>添加</button>
                        <button class="dcm_so_btn">确定</button>
                        <button class="dcm_so_btn">取消</button>
                    </p>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div> 
    </div>
 <!-- end -->
         <!-- 改价内容弹窗 -->
    <div class="dcm_price_info" id="dcm_price_info">
        <div class="sanjiao"></div>
    </div>
    <!-- 销售品种弹窗 -->
     <div class="dcm_sellsort" id="dcm_sellsort">
        <div class="sanjiao"></div>
    </div>
    <!-- end -->
  </div>
</template>
<script>
export default {
   data () {
       return {
           arr:[1,2,3],
           shoplevel: [1,1,1,1],
           changePriceModel: false,
           onShelfcolumns: [
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
                                h('span',{
                                    on: {
                                        mouseover: (e) => {
                                            this.MouseHover (e, params.row.name)
                                        },
                                        mouseout: (e) => {
                                            this.MouseOut();
                                        }
                                    }
                                }, params.row.name)
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
                        key: 'address',
                        render: (h,params) => {
                            return h ('div', [
                                h('span',{
                                    on: {
                                    mouseover: (e) => {
                                            this.sellsortMouseHover (e, params.row.name)
                                        },
                                    mouseout: (e) => {
                                            this.sellsortMouseOut();
                                        }
                                }
                                },params.row.address)
                            ])
                        }
                    },
                    {
                        title: '自动上架供应商商品',
                        align: 'center',
                        width: '11%',
                        key: 'switchBtn',
                        render: (h, params) => {
                            return h('div', [
                                h('i-switch', {
                                    props: {
                                        value: params.row.switchBtn,
                                        size: 'default'
                                    },
                                    style: {
                                        
                                    },
                                    on: {
                                        change: (e) => {
                                            this.switchChange(e)
                                        }
                                    }
                                })
                            ])
                        }
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
                                            this.remove(params.index, params.row.id)
                                        }
                                    }
                                }, '下架'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        type: 'primary'
                                    },
                                    style :{
                                        background: '#45c8dc',
                                        borderColor: '#45c8dc',
                                        fontSize: '14px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changePriceModel = !this.changePriceModel;
                                            this.changePrice(params.row.id)
                                        }
                                    }
                                }, '改价')
                            ]);
                        }
                    }
          ],
          onShelfdata: [
                    {   id: 1,
                        name: '王小明',
                        age: 4,
                        address: 2,
                        switchBtn: true
                    },
                    {   id: 2,
                        name: '王小明2',
                        age: 4,
                        address: 2,
                        switchBtn: false
                    }
            ],
       }
   },
   methods: {
       changePrice () {
           this.changePriceModel = true;
       },
       MouseHover (e,name) {
          var priceInfo = document.getElementById('dcm_price_info');
         priceInfo.style.display = 'block';
          priceInfo.style.top=e.clientY+ 'px';
          priceInfo.style.left=e.clientX+ 'px'
      },
      MouseOut () {
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'none';
      },
      sellsortMouseHover (e, name) {
          var sellSortDiv = document.getElementById('dcm_sellsort');
          sellSortDiv.style.display = 'block';
          sellSortDiv.style.top=e.clientY+ 'px';
          sellSortDiv.style.left=e.clientX+ 'px'
      },
      sellsortMouseOut () {
          var sellSortDiv = document.getElementById('dcm_sellsort');
          sellSortDiv.style.display = 'none';
      },
      switchChange (e) { //开关改变
        console.log(123, e)
      }
   }
}
</script>
<style lang="less">
#allprovidersOnshelf {
    .inner{margin-left: 30px;}
}
</style>


