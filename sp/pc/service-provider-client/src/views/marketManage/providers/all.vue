<template>
  <div id="allproviders">
    <Tabs :animated="false">
        <TabPane label="已上架供应商">
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
        </TabPane>
        <!-- 已上架供应商结束 -->
        <TabPane label="未上架供应商">
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
        </TabPane>
         <!-- 未上架供应商结束 -->
    </Tabs>
    <!-- 改价弹窗 -->
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
        <!-- 改价内容弹窗 -->
    <div class="dcm_price_info" id="dcm_price_info">
        <div class="sanjiao"></div>
    </div>
    <!-- 销售品种弹窗 -->
     <div class="dcm_sellsort" id="dcm_sellsort">
        <div class="sanjiao"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'allproviders',
  data () {
      return {
          add: [1,2],
          cityList: [
                    {
                        value: 'jianjia',
                        label: '减价'
                    },
                    {
                        value: 'jiajia',
                        label: '加价'
                    }],
          cityLists: [{
                        value: 'baifen',
                        label: '%'
                    },
                    {
                        value: 'yuan',
                        label: '元'
                    }],  
          newTime: '2012-12-12 00:00:00',
          switch1: true,
          arr:[1,2,3],
          shoplevel: [1,1,1,1],
          onShelfcurrent: 3,
          onShelftotal: 300,
          underShelfcurrent: 1,
          underShelftotal: 80,
          transData: null,
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
  methods: {
      remove (index, id) { //服务商下架
        this.onShelfdata.splice(index, 1); //本地下架
      },
      putOnShelf (index, id) {
            //   本地实现
          this.transData = this.underShelfdata.splice(index, 1);
          this.onShelfdata = this.onShelfdata.concat(this.transData);
          this.underShelfdata.splice(index, 1) //本地
          req.getUserInfo(this, {}, (res) => {
              console.log(123,res)
          })
      },
      changePrice (id) {
        
      },
      addRuler () {
          var num = 1;
          this.add.push(num)
      },
      MouseOut () {
          var priceInfo = document.getElementById('dcm_price_info');
          priceInfo.style.display = 'none';
        
      },
      MouseHover (e,name) {
          var priceInfo = document.getElementById('dcm_price_info');
         priceInfo.style.display = 'block';
          priceInfo.style.top=e.clientY+ 'px';
          priceInfo.style.left=e.clientX+ 'px'
         
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
      }
  },
  created () { 
  }
}
</script>
<style lang="less" >
@checkcolor: #12b571; @bgcolor: #45c8dc;
#allproviders{
    font-size: 14px;
    padding-right: 50px;
    margin-bottom: 60px;
    .ivu-tabs-nav .ivu-tabs-tab{margin-left: 0px;}
    .ivu-tabs-nav-container{margin-left: 30px;}
    .ivu-tabs-tab-disabled{ position: relative;right: -100%;}
    .inner{margin-left: 30px;}
    // 开关样式
    .ivu-switch-checked { border-color: @checkcolor; background-color: @checkcolor;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .dcm_so_btn{margin-right: 20px;}
    // 设置表头背景色
    .ivu-table-header .ivu-table-column-center{background: #f0f0f0}
    // 选中之后，选择框的样式
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @checkcolor;background-color: @checkcolor;}
    .ivu-table{font-size: 14px;} //表格字体
    // 让分页在右边
    .pageBar{width: 100%;
        ul{float: right}
    }
    tr.ivu-table-row-hover td{background-color:#fff}
}
</style>
