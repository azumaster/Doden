<template>
  <div id="underShelfBrands">
     <div class="actions_area">
                        <button class="dcm_so_btn">上架</button>
        </div>
      <Table border :loading="loading" @on-selection-change="selectBrands" :columns="underShelfcolumns" :data="data"></Table>
                <div class="pageBar">
                    <Page :current="current"  :total="total" simple></Page>
                </div>
  
  </div>
</template>
<script>
export default {
    data (){
        return {
            newTime: '2012-12-12 00:00:00',
            switch1: true,
            loading: true,
            params: {type: 'under'},
            underShelfcolumns: [
              {
                        type: 'selection',
                        align: 'center',
                        width: '20%',
                        title: '全选'
                    },
                    {
                        title: '品牌名',
                        width: '40%',
                        align: 'center',
                        key: 'name',
                        render: (h, params) =>{
                            return h('div', [
                                h('span', params.row.name)
                            ])
                        }
                    },
                     {
                        title: '上架',
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
                                            this.pushOnShelf(params.index, params.row.id)
                                        }
                                    }
                                }, '上架')
                            ]);
                        }
                    }
          ],
          data: []
    }
  },
  methods: {
      pushOnShelf (index, id) { //上架
        this.data.splice(index, 1);
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
  #underShelfBrands{
    padding-right: 50px;
    margin-left: 30px;margin-top: 12px;
    .cancel{width:70px}
    .dcm_so_btn{margin-right: 20px;}
    .txt{padding-right: 60px;padding-left: 20px;}
    .ivu-switch-checked { border-color: @checkcolor ; background-color: @checkcolor ;}
    .ivu-checkbox-checked .ivu-checkbox-inner {border-color: @checkcolor;background-color: @checkcolor;}
  }
</style>
