<template>
    <div class="products-page putaway">
        <div class="type-list">
            <div class="page-oper">
                <Button type="primary" @click="unPutaway" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">下架</Button>
                <Button type="primary" @click="toChangePrice" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">改价</Button>
                <Button type="primary" @click="toPutaway" style="background: #45c8dc; border-color: #45c8dc; height: 40px; width: 70px;">置顶排序</Button>
            </div>
            <div class="typing">
                <Checkbox>全选</Checkbox>
                <Tree :data="typeData" @on-select-change="choiceTree"></Tree>
            </div>
        </div>
        <div class="products-list">
            <div class="list-oper">
                <p>自动上架已选分类商品</p>
                <i-switch v-model="autoPutaway" @on-change="changeAutoPutaway" size="large"><span slot="open">ON</span><span slot="close">OFF</span></i-switch>
            </div>
            <div class="list-type">
                <div class="type-ul" @click="checkType">
                    <button class="type-btn checked" data-id="0">全部</button>
                    <button v-for="btn in this.typeBtn" class="type-btn" :data-id="btn.type_id">{{btn.type_name}}</button>
                </div>
                <Checkbox @on-change="checkAll">全选</Checkbox>
            </div>
            <ul class="product-list">
                <li class="product-item">
                    <div class="item-info">
                        <div class="item-img"><img src="http://img1.imgtn.bdimg.com/it/u=421905016,4050374065&fm=27&gp=0.jpg"></div>
                        <div class="item-des">
                            <p>奥卓鸡胸200g-300g，散装，颜色偏黄，仔是几十块</p>
                            <div class="putaway-price"><span>￥<input type="number">/件 <del>￥156</del></span></div>
                            <div class="putaway-btn" data-type="once" @click="toPutaway">上架</div>
                        </div>
                    </div>
                    <div name="btnChecked" class="checked"><i class="icon icon-checked" @click="checkGood"></i></div>
                </li>
            </ul>
        </div>
        <Model title="改价提醒" v-if="showPutaway">
            <div slot="body">
                <p>亲，您要上架的商品还未进行加价，为了避免您的损失，请及时改价。</p>
            </div>
            <div slot="footer">
                <div class="btn-group">
                    <div class="model-btn ok" @click="toChangePrice">去改价</div>
                    <div class="model-btn ok" @click="justPutaway">直接上架</div>
                </div>
            </div>
        </Model>
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
        <div class="stick-mask" v-if="!stickModel">
            <div class="stick">
                <header><h1>置顶排序</h1><span class="icon icon-cha"></span></header>
                <main>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                    <div class="stick-item">
                        <div class="item-img"><img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1885148145,725800906&fm=15&gp=0.jpg"></div>
                        <div class="item-info"><p class="name">奥卓鸡胸200g-300g,散装，颜色偏黄，仔是几十块</p><div class="price">￥<input type="text">/件 <s>￥156</s></div></div>
                        <div class="item-index">1</div>
                        <div class="item-btn">Top</div>
                    </div>
                </main>
                <footer><div class="stick-btn">确认</div><div class="stick-btn">取消</div></footer>
            </div>
        </div>
    </div>
</template>

<script>

    import Model from './../../../components/model.vue';
    import Draggable from 'vuedraggable';

    const message = [ 'vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based' , 'on', 'Sortablejs' ];

    export default {
        components: {Model, Draggable},
        data: function () {
            return {
                autoPutaway:false,
                showPutaway: false,
                showType: false,
                changePriceModel: false,
                changePriceType: '',
                stickModel: false,
                typeTree: {},
                typeData: [],
                typeBtnData: [],
                typeBtn: []
            };
        },
        methods: {
            // 获得商品分类
            getGoodsType: function () {
                let _this = this;
                window.req.getGoodsTree(this, {}, (req)=>{
                    if(req.code == 0){
                        let fourth = [];
                        let typeList = [];

                        this.typeTree = req.data;

                        for(let firstIndex in req.data){
                            let firstChildren = [];

                            for(let secondIndex in req.data[firstIndex]){
                                if(typeof req.data[firstIndex][secondIndex] == 'object'){
                                    let secondChildren = [];

                                    for(let thirdIndex in req.data[firstIndex][secondIndex]){
                                        if(typeof req.data[firstIndex][secondIndex][thirdIndex] == 'object'){
                                            secondChildren.push({expand: true, title: '<p>'+req.data[firstIndex][secondIndex][thirdIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex][thirdIndex].type_id+'</span></p>'})

                                            for(let fourthIndex in req.data[firstIndex][secondIndex][thirdIndex]){
                                                if(typeof req.data[firstIndex][secondIndex][thirdIndex][fourthIndex] == 'object'){
                                                    req.data[firstIndex][secondIndex][thirdIndex][fourthIndex].pid = thirdIndex;
                                                    fourth.push(req.data[firstIndex][secondIndex][thirdIndex][fourthIndex]);
                                                }
                                            }

                                        }
                                    }

                                    firstChildren.push({expand: true, title: '<p>'+req.data[firstIndex][secondIndex].type_name+'<span style="display: none">'+req.data[firstIndex][secondIndex].type_id+'</span></p>', children: secondChildren});
                                }
                            }

                            typeList.push({expand: true, title: '<p>'+req.data[firstIndex].type_name+'<span style="display: none">'+req.data[firstIndex].type_id+'</span></p>', children: firstChildren});
                        }

                        this.typeData = typeList;
                        this.typeBtnData = fourth;
                    }else{
                        _this.$Message.error(req.message);
                    }
                });
            },
            // 下架
            unPutaway: function () {
                this.$Modal.confirm({
                    title: '下架提醒',
                    content: '您是否要下架选中商品？',

                });
            },
            // 上架
            toPutaway: function (e) {
                let type = e.target.dataset.type;
                if(type) this.changePriceType = type;

                this.$store.state.showPutaway = true;
            },
            // 直接上架
            justPutaway: function () {
                this.$store.state.showPutaway = false;
            },
            // 去改价
            toChangePrice: function () {
                this.$store.state.showPutaway = false;
                this.changePriceModel = true;
            },
            // 选择树形结构
            choiceTree: function (nodes) {

                if(nodes.length<=0){
                    this.typeBtn = [];
                    return;
                }

                let id = nodes[0].title.split('>')[2].split('<')[0];

                let typeBtn = [];

                if(!nodes[0].children || nodes[0].children.length<=0){
                    // 第一种情况：第三级别菜单
                    this.typeBtnData.map((data)=>{
                        if(id == data.pid){
                            typeBtn.push(data);
                        }
                    });
                } else {
                    // 第二种情况是有子节点的
                    for(let fIndex in this.typeTree){
                        if(this.typeTree[fIndex].type_id == id){
                            // 第一级
                            for(let sIndex in this.typeTree[fIndex]){
                                if(typeof this.typeTree[fIndex][sIndex] == 'object'){
                                    for(let tIndex in this.typeTree[fIndex][sIndex]){
                                        if(typeof this.typeTree[fIndex][sIndex][tIndex] == 'object'){
                                            this.typeBtnData.map((data)=>{
                                                if(this.typeTree[fIndex][sIndex][tIndex].type_id == data.pid){
                                                    typeBtn.push(data);
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        } else {
                            // 第二级
                            for(let sIndex in this.typeTree[fIndex][id]){
                                if(typeof this.typeTree[fIndex][id][sIndex] == 'object'){
                                    this.typeBtnData.map((data)=>{
                                        if(this.typeTree[fIndex][id][sIndex].type_id == data.pid){
                                            typeBtn.push(data);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }


                this.typeBtn = typeBtn;
            },
            // 是否自动上架已选分类商品
            changeAutoPutaway: function (status) {
                this.autoPutaway = status;
                // 这里发起请求
            },
            // 选择第四级的分类
            checkType: function (e) {
                let node = e.target,
                    html = e.target.innerText;
                if (node.nodeName != 'BUTTON') {
                    return;
                }

                if (html == '全部') {
                    if (e.target.className.indexOf('checked') == -1) {
                        for (let i = 0; i < e.target.parentNode.children.length; i++) {
                            if (e.target.parentNode.children[i].innerText != '全部') {
                                e.target.parentNode.children[i].className = 'type-btn';
                            }
                            e.target.className = 'type-btn checked';
                        }
                    } else {
                        return;
                    }
                } else {
                    for (let i = 0; i < e.target.parentNode.children.length; i++) {
                        if (e.target.parentNode.children[i].innerText == '全部') {
                            e.target.parentNode.children[i].className = 'type-btn';
                        }
                    }

                    if (e.target.className.indexOf('checked') == -1) {
                        e.target.className = 'type-btn checked';
                    } else {
                        e.target.className = 'type-btn';
                    }
                }
                // 需要获取所选择dom

            },
            // 选择商品
            checkGood: function (e) {
                let target = e.target.parentNode;

                if (target.className.indexOf('active') != -1) {
                    target.className = 'checked'
                    e.target.className = 'icon icon-checked';
                } else {
                    target.className = 'checked active';
                    e.target.className = 'icon icon-checked active';
                }
            },
            // 全选
            checkAll: function (status) {
                let nodes = document.getElementsByName('btnChecked');

                if(status){
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked active';
                        nodes[i].children[0].className = 'icon icon-checked active'
                    }
                }else{
                    for(let i = 0; i<nodes.length; i++){
                        nodes[i].className = 'checked';
                        nodes[i].children[0].className = 'icon icon-checked'
                    }
                }
            }
        },
        created: function () {
            this.getGoodsType();
        },
        computed: {
            getShowPutaway () {
                return this.$store.state.showPutaway;
            }
        },
        watch: {
            getShowPutaway (val) {
                this.showPutaway = val;
            }
        }
    }
</script>

<style>
    .ivu-modal-content{
        height: auto !important;
    }
    .ivu-modal-confirm{
        padding: 0 30px !important;
    }
    .ivu-btn-primary{
        background-color: #45c8dc !important;
        border-color: #45c8dc !important;
    }
    .stick-mask{
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10086;
        background: rgba(0, 0, 0, .5);
    }
    .stick-mask .stick{
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        transform: translate(-50%, -50%);
        width: 824px;
        height: 690px;

    }
    .stick-mask .stick header{ height:50px; position: relative; border: 1px solid #f5f5f5; }
    .stick-mask .stick header h1{ text-align: center; font-weight: normal; line-height: 50px; color: #666666; font-size: 18px; }
    .stick-mask .stick header span{ position: absolute; width: 34px; height: 32px; line-height: 32px; text-align: center; right: 0; top: 0; background: #f5f5f5; color: #45c8dc; font-size: 16px; }

    .stick-mask .stick main{  height: 574px;  padding: 0 20px; }


    .stick-mask .stick footer { padding: 15px 20px; height: 36px; display: flex; justify-content: flex-end; }
    .stick-mask .stick footer .stick-btn { cursor: pointer; width: 100px; height: 36px; background: #45c8dc; color: #ffffff; border-radius: 4px; text-align: center; line-height: 36px; font-size: 16px; }
    .stick-mask .stick footer .stick-btn:not(:last-child){ margin-right: 20px; }
    .stick-mask .stick footer .stick-btn:active { background: #00CCCC; }

    .stick main{
        display: flex;
        flex-flow: column wrap;
    }
    .stick main .stick-item{  width: 387px;  height: 106px;  border: 1px solid #e5e7e6; position: relative; margin-bottom: 7px; }
    .stick main .stick-item .item-img{ float: left;  width: 100px;  height: 90px;  margin: 8px; border: 1px solid #eeefee  }
    .stick main .stick-item .item-img img{  width: 100%; height: 100%  }
    .stick main .stick-item .item-info{ float: left; margin: 10px 0 10px 10px; width: 200px; }
    .stick main .stick-item .item-info p{ line-height: 25px; font-size: 14px; color: #333333; }
    .stick main .stick-item .item-info .price{ line-height: 50px; }
    .stick main .stick-item .item-info .price input{ width: 50px; height: 22px; text-align: center; border: 1                                                                                                                                                                                                                                                                                                                                                                         px solid #666666; margin: 0 5px; }
    .stick main .stick-item .item-info .price s { font-size: 14px; color: #999999; }
    .stick main .stick-item .item-index {position: absolute; background: #ff7676; color: #ffffff; font-size: 14px; text-align: center; line-height: 20px; width: 30px; height: 20px; right: 0; top: 0; }
    .stick main .stick-item .item-index:before { position: absolute; content: ''; border-top: 10px solid #ff7676;  border-right: 15px solid transparent; bottom: -10px; right: 0 }
    .stick main .stick-item .item-index:after { position: absolute; content: ''; border-top: 10px solid #ff7676;  border-left: 15px solid transparent; bottom: -10px; left: 0 }
    .stick main .stick-item .item-btn { background: #45c8dc; position: absolute; right: 0; bottom: 10px; width: 60px; height: 24px; border-radius: 12px 0 0 12px; line-height: 24px; text-align: center; font-size: 14px; color: #ffffff}
</style>