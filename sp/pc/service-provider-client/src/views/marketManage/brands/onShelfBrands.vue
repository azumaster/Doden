<template>
  <div id="onShelfBrands">
    
      <div class="actions_area">
                        <button class="dcm_so_btn">下架</button>
                        <button class="dcm_so_btn">改价</button>
                        <button class="dcm_so_btn">置顶</button>
                        <button class="dcm_so_btn cancel">取消置顶</button>
                        <span class="txt">自动上架已选分类商品</span>
                        <i-switch size="large" v-model="switch1">
                            <span slot="open">ON</span>
                            <span slot="close">OFF</span>
                        </i-switch>
                        <span class="dcanmou_newUpload_time">最新上传时间：<span>{{newTime}}</span></span> <!--这个为全局样式-->
        </div>
       <Table border :loading="loading" :columns="onShelfcolumns" @on-selection-change="selectBrands" :data="data"></Table>
                <div class="pageBar">
                    <Page :current="current"   :total="total" simple></Page>
                </div>
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
    <!-- 改价弹end -->
  </div>
  
</template>
<script>
export default {
  data (){
    return {
        loading: true,
        newTime: '2012-12-12 00:00:00',
        changePriceModel: false,
        add: [1,2],
        switch1: true,
        onShelfcolumns: [
              {
                        type: 'selection',
                        align: 'center',
                        width: '7%',
                        title: '全选'
                    },
                    {
                        title: '品牌名',
                        width: '10%',
                        align: 'center',
                        key: 'name',
                        render: (h, params) =>{
                            return h('div', [
                                h('span', params.row.name)
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
                                    }
                                    
                                })
                            ])
                        }
                    },
                    { //下架
                        title: '下架',
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
                                            this.putunderShelfBrands(params.index, params.row.id)
                                        }
                                    }
                                }, '下架')
                            ]);
                        }
                    },
                    { //改价
                        title: '改价',
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
                                            this.changePrice(params.index, params.row.id)
                                        }
                                    }
                                }, '改价')
                            ]);
                        }
                    },
                     { //置顶
                        title: '置顶',
                        align: 'center',
                        key: 'address',
                        render: (h, params) => {
                            if(params.row.serial) {
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
                                                this.pushTop(params.index, params.row.id)
                                            }
                                        }
                                    }, '置顶')
                                ]);
                            }
                           else{ //取消置顶
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
                                            this.cancelpushTop(params.index, params.row.id)
                                        }
                                    }
                                }, '取消置顶')
                            ]);
                           }
                        }
                    }
          ],
        data: [],
        params: {
            type: 'onShelft'
        }
    }
  },
  methods: {
      putunderShelfBrands (index, id) { //下架
          console.log(index, id);
          this.data.splice(index, 1);
      },
      changePrice (index, id) { //改价
         this.changePriceModel = true;
          console.log(index, id)
      },
      pushTop (index, id) { //置顶
        this.test();
        console.log(index, id);
      },
      cancelpushTop (index, id) { //取消置顶
          console.log(index, id)
      }
  },
  created () {
      this.getBrands ();
  }
}
</script>

<style lang="less" >
@checkcolor: #12b571; @bgcolor: #45c8dc;
  #onShelfBrands{
    padding-right: 50px;
    margin-left: 30px;margin-top: 12px;
    .cancel{width:70px}
    .dcm_so_btn{margin-right: 20px;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .ivu-switch-checked { border-color: @checkcolor ; background-color: @checkcolor ;}
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @checkcolor;background-color: @checkcolor;}
  }
</style>
