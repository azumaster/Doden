import InputArea from './input_area.jsx';
import WexinPhoto from './we-uploader/WexinPhoto.jsx';
import PriceUpdate from '../component/price_update.jsx';

class GoodsUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultPara: {
              basic_infos: {},
              basic_attributes: [],
              special_attributes: [],
              pictures: [],
              inspection_reports: []
            },
            goods_type_id: 0,
            type_constraint: '', //型号
            spec_constraint: '',  //规格
            basic_attributes_list: [],
            special_attributes_list: [],
            goodsType: {},
            index: '', //查找的二维数组
            root: '', //根节点
            basicAttrData: null,
            specialData: [],
            deleteList: [],
            goodsTypeList: [],
            goodsTypeIndex: [],
            lastSelected: [],
            modifyState: 0    //商品修改的状态，0表示什么都没修改，1表示只修改了价格，2表示修改了其它的.
        };
        this.submit =  this.submit.bind(this);
        this.deleteBasicAttributes = this.deleteBasicAttributes.bind(this);
        this.createScroll = this.createScroll.bind(this);
    }

    static contextTypes = {
        goods_id: React.PropTypes.number,
        units: React.PropTypes.array,
        rules: React.PropTypes.array
    };

    // 默认是添加 1是修改
    componentWillMount(){
        let tArray = new Array();  //先声明一维
        for(var k = 0; k < 40; k++){    //一维长度为i,i为变量，可以根据实际情况改变
            tArray[k] = new Array();  //声明二维，每一个一维数组里面的一个元素都是一个数组；
            for(var j=0;j < 40;j++){   //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；
                tArray[k][j] = '';    //这里将变量初始化，我这边统一初始化为空，后面在用所需的值覆盖里面的值
            }
        }
        this.state.index = tArray;
        this.getGoodsType();
        this.getGoodsInfo();
    }

    componentDidMount(){
        window.onhashchange = () => {
            if(location.hash.indexOf('pop') == -1) {
                $('#multi_choice_wrap').removeClass('show');
            }
            if(location.hash.indexOf('uploader') == -1) {
                $('#inspect_report_wrap').removeClass('show');
            }
        };
    }

    //设置型号规格部分
    setBasic(d){
        let data = this.state.defaultPara;
        data.basic_attributes = JSON.parse(JSON.stringify(d));
        this.setState({defaultPara: data});
        this.createBasicAttributes('true');
    }

    componentDidUpdate(){
        let signal = $('.signal'),
            basic = this.state.defaultPara.basic_attributes;
        if(signal.length > 0){
            signal.off();
            signal.map((sig) => {
                let single = $(signal[sig]);
                $(single).click((e)=>{
                    $(e.target).blur();
                    this.state.addPrice = (
                        <PriceUpdate key={Math.random()} parent={this}
                                     basic_attr={this.state.defaultPara.basic_attributes}
                                     setData={this.setBasic.bind(this)}
                        />
                    );
                    this.forceUpdate();
                });
            });
            (()=>{
                let unitName = '件';
                this.context.units.map((unit)=>{
                    if(unit.id == basic.goods_unit_id){
                        unitName = unit.name;
                    }
                });
                $('.signal-prompt').remove();
                let rules = '',
                    name = null;
                let price_rules = this.state.defaultPara.basic_attributes.price_rules[0];
                if(price_rules){
                    let unit, preferential_unit;
                    this.context.rules.map((rule)=>{
                        if(rule.price_rule_id == price_rules.price_rule_id){
                            unit = rule.buy_unit;
                            name = rule.show_name;
                            preferential_unit = rule.preferential_unit;
                        }
                    });
                    price_rules.rules.map((filledRule)=>{
                        rules += '<span>'+ '买' + filledRule.buy_num + unit + name + filledRule.preferential + preferential_unit + '&nbsp; </span>';
                    });
                }
                if(!name){
                    return;
                }
                signal.after('<div class="cell-row input-line signal-prompt"><div class="cell-body"></div><span class="type">' + name + '</span><span>' + rules + '</span></div>');
                if(this.state.deleteList.length > 0){
                    this.state.deleteList.map((para)=>{
                        if(index != para){
                            if(!$.isEmptyObject(basic)){
                                let price = basic.goods_price ? basic.goods_price + '元/' : '';
                                $(signal[0]).find('.price-foot').html(price  + unitName);
                                $(signal[0]).find('.cell-input').val('');
                            }
                        }
                    });
                }else {
                    let price = basic.goods_price ? basic.goods_price + '元/' : '';
                    $(signal[0]).find('.price-foot').html(price + unitName);
                    if(!$.isEmptyObject(basic)){
                        $(signal[0]).find('.cell-input').val(' ');
                    }
                }
            })();
        }
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('goods_update_wrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    getGoodsType(){
        H.server.getShopGoodsType({}, (res) => {
            if(res.code == 0){
                this.setState({
                    goodsType: res.data
                }, ()=>{
                    let goodsType = this.state.goodsType,
                        tempKey = [],
                        index = this.state.index,
                        len = 0,
                        sum = 0,
                        id = this.state.defaultPara.basic_infos.goods_type_id;
                    if(!id){
                        return;
                    }
                    for(let i in goodsType){
                        var key = goodsType[i].node_id;
                        tempKey = key.split('.');
                        len = tempKey.length;
                        if(goodsType[i].id == id){
                            id = key;
                        }
                        if(len == 1){
                            goodsType[i].parent = 0;
                            goodsType[i].self = tempKey[len-1];
                            index[parseInt(sum/40)][sum%40] = goodsType[i];
                            this.state.root = tempKey[len-1];
                            sum++;
                            continue;
                        }
                        goodsType[i].parent = tempKey[len-2];
                        goodsType[i].self = tempKey[len-1];
                        index[parseInt(sum/40)][sum%40] = goodsType[i];
                        sum++;
                    }
                    id = id.split('.');
                    if(id.length == 1){
                        return;
                    }
                    $('#type_mask').hide();
                    this.state.firstType = this.getType(id[1], 'self')[0].name;
                    this.state.secondType = this.getType(id[2], 'self')[0].name;
                    this.state.thirdType = this.getType(id[3], 'self')[0];
                    this.state.goods_type_id = this.state.thirdType.id;
                    this.state.thirdType = this.state.thirdType.name;
                    this.getSpecialAttrList();
                    this.getBasicAttr();
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    getGoodsInfo(){
        H.server.getGoodsInfo({goods_id: this.props.goods_id}, (res)=>{
            if(res.code == 0){
                let oldData = $.extend(true, {}, res.data);
                this.setState({
                    defaultPara: res.data,
                    oldData: oldData
                }, ()=>{
                    this.createScroll();
                    this.createBasicAttributes();
                    this.setString();
                    this.getGoodsType();
                });
            }
        });
    }

    //获得特殊属性列表
    getSpecialAttrList(){
        H.server.getSpecialAttrList({type_id: this.state.goods_type_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    special_attributes_list: res.data.attributes,
                    specialData: res.data.attributes
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    getBasicAttr(){
        H.server.getBasicAttr({type_id: this.state.goods_type_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    type_constraint: res.data.type_constraint,
                    spec_constraint: res.data.spec_constraint,
                    basicAttrData: res.data
                }, ()=>{
                    this.createBasicAttributes('true');
                    this.setString();
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    //基本属性
    createBasicInfo(){
        let titles = ['品名', '品牌', '产地', '清真'],
            placeholders = ['请输入品名', '请输入厂家名', '请输入产地', ''],
            para = ['goods_name', 'brand_name', 'origin', 'halal'],
            value = '',
            cellStyle = ['', '', '', 'hidden'];
        let basic_info = this.state.defaultPara.basic_infos,
            len = para.length;

        value = [];
        for(let i=0; i<len; i++){
            value.push(basic_info[para[i]]);
        }
        return (
            <InputArea style="add-goods-item" titles={titles} placeholders={placeholders} para={para} value={value} setModifyState={this.setModifyState.bind(this)}
                        submit={'basic_infos'} parent={this.state.defaultPara} cellStyle={cellStyle} basic={basic_info}/>
        );
    }

    //创建型号规格
    createBasicAttributes(refresh){
        let titles = ['型号', '包装规格', '带箱重', '去箱重', '价格'],
            placeholders = ['', '请输入规格', '请输入带箱重', '请输入去箱重', '请输入平台价'],
            cellStyle = ['hidden', 'hidden'],
            format_values = [],
            format_type_id = [],
            para = ['', '', 'rough_weight', 'net_weight', 'goods_price'],
            value = '',
            state = this.state;
        let basic_attributes = state.defaultPara.basic_attributes,
            len = para.length,
            constraint_id = [],
            listLen = 0;
        if(refresh == 'true'){
            this.state.basic_attributes_list = [];
        }
        if(!basic_attributes.specs){
            return;
        }
        value = [];
        for(let i=0; i<len; i++){
            value.push(basic_attributes[para[i]]);
        }
        format_type_id.push(state.type_constraint.format_type_id, state.spec_constraint.format_type_id);
        format_values.push(state.type_constraint.format_values, state.spec_constraint.format_values);
        constraint_id.push(state.type_constraint.attribute_id, state.spec_constraint.attribute_id);
        listLen = this.state.basic_attributes_list.length;
        format_values = $.extend(true, [], format_values);
        this.state.basic_attributes_list.push(
            <div className="basic_attr">
                <div className="plate-title">{'*型号规格'}</div>
                <InputArea titles={titles} placeholders={placeholders} para={para} cellStyle={cellStyle} value={value}
                           format_values={format_values} format_type_id={format_type_id}  submit={'basic_attributes'}
                            parent={this.state.defaultPara} constraint_id={constraint_id} style="add-goods-item" setModifyState={this.setModifyState.bind(this)}
                             deleteBasicAttributes={this.deleteBasicAttributes} operateType={this.props.type} basic={basic_attributes}/>
                {listLen >= 1 ?
                    <a className="btn btn-delete"  data-para={listLen} onClick={this.deleteBasicAttributes.bind(this)}>删除型号</a> : null}
            </div>
        );
        this.setState({
            basic_attributes_list: this.state.basic_attributes_list
        });
    }

    //特殊属性
    createsSpecialAttributes(){
        let titles = [],
            format_values = [],
            format_type_id = [],
            cellStyle = ['hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden'],
            state = this.state,
            constraint_id = [];
        state.special_attributes_list.map((special_attribute) => {
            titles.push(special_attribute.attribute_name);
            format_values.push(special_attribute.format_values);
            format_type_id.push(special_attribute.format_type_id);
            constraint_id.push(special_attribute.attribute_id);
        });
        return(<InputArea titles={titles} format_values={format_values} format_type_id={format_type_id} cellStyle={cellStyle}
                            special={true} submit={'special_attributes'} parent={this.state.defaultPara} constraint_id={constraint_id}
                          style="add-goods-item special-attr-wrap"  operateType={this.props.type} setModifyState={this.setModifyState.bind(this)}/>);
    }

    getItem(goodsTypeId){
        let parentID = this.getType(goodsTypeId, 'self');
        if(!parentID){
            return;
        }
        this.state.lastSelected.push(parentID);
        this.state.goodsTypeList.push(this.getType(parentID[0].parent, 'parent'));
        this.getItem(parentID[0].parent);
    }

    getIndex(goodsTypeList, lastSelected){
        goodsTypeList.map((TypeList)=>{
            if(!TypeList){
                return;
            }
            TypeList.map((list, index)=>{
                lastSelected.map((last)=>{
                    if(last[0].self == list.self){
                        this.state.goodsTypeIndex.push(index);
                    }
                });
            });
        });
    }

    //创建类型选择工具
    createTimeBar() {
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="provincePicker"></div></div><div class="region-picker"><div id="cityPicker"></div>'+
            '</div><div class="region-picker"><div id="areaPicker"></div></div>';
        $('#type_mask').hide();
        H.picker(str, '选择分类');
        var type, type1, type2, up, up1, up2;
        let that = this;
        if(this.state.goods_type_id == 0){
            type = this.handleResult(this.getType(this.state.root, 'parent'));
            type1 = this.handleResult(this.getType(type[0].key, 'parent'));
            type2 = this.handleResult(this.getType(type1[0].key, 'parent'));
        }else{
            this.getItem(this.state.goods_type_id);
            this.getIndex(this.state.goodsTypeList, this.state.lastSelected);
            type = this.handleResult(this.state.goodsTypeList[2]);
            type1 = this.handleResult(this.state.goodsTypeList[1]);
            type2 = this.handleResult(this.state.goodsTypeList[0]);
        }

        this.state.goodsTypeList = [];
        this.state.lastSelected = [];
        up = UIPickerView.createPickerView({
            dataSource: type,
            id: 'provincePicker',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                type1 = that.handleResult(that.getType(data.key, 'parent'));
                up1.UPRender(type1);
                that.state.firstType = data.value;
                if(up1.UPSelectRowIndexPath(1)){
                    up1.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        type2 =  that.handleResult(that.getType(value.key, 'parent'));
                        up2.UPRender(type2);
                        that.state.secondType = value.value;
                    });
                }else {
                    type2 =  that.handleResult(that.getType('-1', 'parent'));
                    up2.UPRender(type2);
                    that.state.secondType = '';
                    that.state.thirdType = '';
                }

                if(up2.UPSelectRowIndexPath(1)){
                    up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        that.state.thirdType = value.value;
                        that.state.goods_type_id = value.key;
                    });
                }else {
                    that.state.thirdType = '';
                }
            }
        });

        up1 = UIPickerView.createPickerView({
            dataSource: type1,
            id: 'cityPicker',
            constraintsId: 'wower1',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                type2 = that.handleResult(that.getType(data.key, 'parent'));
                up2.UPRender(type2);
                that.state.secondType = data.value;
                if(up2.UPSelectRowIndexPath(1)){
                    up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        that.state.thirdType = value.value;
                        that.state.goods_type_id = value.key;
                    });
                }else {
                    that.state.thirdType = '';
                }
            }
        });

        up2 = UIPickerView.createPickerView({
            dataSource: type2,
            id: 'areaPicker',
            constraintsId: 'wower3',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                that.state.thirdType = data.value;
                that.state.goods_type_id = data.key;
            }
        });

        up.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[2]+1).UPThen(function(indexPath, value) {
            that.state.firstType = value.value;
        });

        up1.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[1]+1).UPThen(function(indexPath, value) {
            type2 =  that.handleResult(that.getType(value.key, 'parent'));
            up2.UPRender(type2);
            that.state.secondType = value.value;
        });

        up2.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[0]+1).UPThen(function(indexPath, value) {
            that.state.thirdType = value.value;
            that.state.goods_type_id = value.key;
        });

        let animaed = CAAnimation.createAnimation({
            id: 'region-picker'
        });
        $('#selectClear').unbind('click');
        $('#selectClear').bind('click', () => {
            $('#picker_mask').hide();
            animaed.finish();
        });
        $('#selectFinish').unbind('click');
        $('#selectFinish').bind('click', () => {
            if(!this.state.thirdType){
                H.operationState('当前分类不能添加商品，请重新选择！');
            }else {
                animaed.finish();
                $('#picker_mask').hide();
                this.getBasicAttr();
                this.getSpecialAttrList();
                this.setState({
                    firstType: this.state.firstType,
                    secondType: this.state.secondType,
                    thirdType: this.state.thirdType,
                    modifyState: 2
                });
                animaed.removeEvent();
                this.state.goodsTypeIndex = [];
            }
        });
        animaed.start();
    }

    //删除一个基本属性
    deleteBasicAttributes(e){
        let target = e.target,
            para = target.dataset.para,
            parent = $(target).parents('.basic_attr');
        this.state.deleteList.push(para);
        parent.remove();
    }

    createGoodsType(){
        return(
            <div className="cell-row input-line plate-goods-type" >
                <div className="cell-head" >分类</div>
                <div className="cell-body" style={{display: 'none'}}></div>
                <div className="cell-foot flex-num1" style={{textAlign: 'right'}} onClick={this.createTimeBar.bind(this)}>
                    {
                        this.state.goods_type_id ?
                    <div>
                        <span className="goods-type-value">{this.state.firstType ? this.state.firstType: null}</span>
                        <span className="goods-type-value">{this.state.secondType ? this.state.secondType : null}</span>
                        <span className="goods-type-value">{this.state.thirdType ? this.state.thirdType : null}</span>
                        <span className="right-arrow"></span>
                    </div> : '请选择分类'
                    }
                </div>
            </div>
        );
    }

    //获得类型对象
    getType(id, type){
        let index = this.state.index,
            len = index.length,
            result = [],
            node = '';
        if(!id){
            return;
        }
        for(let i = 0; i < len; i++){
            for(let k = 0; k<len; k++){
                node = index[i][k];
                if(node == '') break;
                if(node[type] == id){
                    result.push(node);
                }
            }
        }
        return result;
    }

    handleResult(arr){
        if(!arr){
            return;
        }
        let len = arr.length,
            result = [];

        for(let i = 0; i < len;i++){
            let obj = {
                key: '',
                value: ''
            };
            obj.key = arr[i].self;
            obj.value = arr[i].name;
            result.push(obj);
        }
        return result;
    }

    submit(){
        let defaultPara =  $.extend(true, {}, this.state.defaultPara),
            special_attributes = defaultPara.special_attributes,
            basic_attributes = defaultPara.basic_attributes,
            specsValues = [],
            typeValues = [];
        defaultPara.basic_infos.goods_type_id = this.state.goods_type_id;
        if(this.state.modifyState != 2) {
            let p = {
                goods_id: this.props.goods_id,
                new_price: defaultPara.basic_attributes.goods_price,
                price_rules: defaultPara.basic_attributes.price_rules
            };
            H.we_loading.show();
            H.server.changePrice(JSON.stringify(p), (res) => {
                H.we_loading.hide();
                if(res.code == 0) {
                    H.sheet.create({
                        style: 1,
                        title: '价格修改成功',
                        content: '<div class="actionsheet_cell read-only">' +
                        '<div class="actionsheet_item center"><p style="margin: 30px 0;text-align: center;width: 100%;">价格修改成功，请点击返回。</p></div>'+
                        '</div>',
                        cancel: '继续修改',
                        confirm: '返回商品列表',
                        confirmCallback: ()=>{
                            H.sheet.hide();
                            window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=sellerGoodsListPage#my-goods';
                        }
                    });
                }else {
                    H.operationState(res.message);
                }
            });
            return;
        }
        for(let i =0; i<special_attributes.length; i++){
            if(!special_attributes[i]){
                special_attributes.splice(i, 1);
                i--;
                continue;
            }
            let valuesLen = special_attributes[i].values.length,
                values = special_attributes[i].values;
            if(special_attributes[i].attr_values){
                delete special_attributes[i].attr_values;
            }
            for(let j=0; j<valuesLen; j++){
                if(!values[j]){
                    values.splice(j, 1);
                }
            }
        }

        if(basic_attributes['specs'].attr_values){
            delete basic_attributes['specs'].attr_values;
        }
        specsValues = basic_attributes['specs'].values;
        for(let j=0; j<specsValues.length; j++){
            if(!specsValues[j]){
                specsValues.splice(j, 1);
            }
        }

        if(basic_attributes['types'].attr_values){
            delete basic_attributes['types'].attr_values;
        }
        typeValues = basic_attributes['types'].values;
        for(let j=0; j<typeValues.length; j++){
            if(!specsValues[j]){
                specsValues.splice(j, 1);
            }
        }
        let arr = [basic_attributes];

        defaultPara.basic_attributes = arr;
        let resData = null;
        H.we_loading.show();
        setTimeout(() => {
            if(!resData) {
                H.operationState('服务器超时, 稍后再试', 4000);
                setTimeout(() => {
                    H.we_loading.hide();
                }, 4000);
            }
        }, 6000);
        H.server.updateGoods(JSON.stringify(defaultPara), (res)=>{
            if(res.code == 0){
                H.we_loading.hide();
                H.sheet.create({
                    style: 1,
                    title: '修改商品成功',
                    content: '<div class="actionsheet_cell read-only">' +
                    '<div class="actionsheet_item center"><p style="margin: 30px 0;text-align: center;width: 100%;">修改商品成功，请点击返回。</p></div>'+
                    '</div>',
                    confirm: '返回',
                    confirmCallback: ()=>{
                        H.sheet.hide();
                        window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=sellerGoodsListPage#my-goods/auditing';
                    }
                });
            }else {
                H.we_loading.hide();
                H.operationState(res.message);
            }
            resData = 1;
        });

    }

    updateValue(e){
        let target = e.target,
            para = target.dataset.para;
        this.state.defaultPara.basic_infos[para] = target.value;
        this.setModifyState(2);
    }

    setString(){
        let prompt = [];
        if(this.state.basicAttrData && this.state.specialData.length > 0 && this.state.oldData.basic_infos) {
            let oldData = $.extend({}, this.state.oldData),
                specialData = this.state.specialData;
            if(oldData.basic_attributes.specs.constraint_id != this.state.basicAttrData.spec_constraint.attribute_id) {
                prompt.push('规格');
            }else {
                if(oldData.basic_attributes.specs.format_type_id != this.state.basicAttrData.spec_constraint.format_type_id) {
                    if(prompt.length == 0){
                        prompt.push('规格');
                    }
                    prompt.map((prompt1)=>{
                        if(prompt1 != '规格'){
                            prompt.push('规格');
                        }
                    });
                }
            }
            if(oldData.basic_attributes.types.constraint_id != this.state.basicAttrData.type_constraint.attribute_id) {
                prompt.push('型号');
            }else {
                if(oldData.basic_attributes.types.format_type_id != this.state.basicAttrData.type_constraint.format_type_id) {
                    if(prompt.length == 0){
                        prompt.push('型号');
                    }
                    prompt.map((prompt1)=>{
                        if(prompt1 != '型号'){
                            prompt.push('型号');
                        }
                    });
                }
            }
            let oldSpecial = $.extend({}, oldData.special_attributes),
                _arr = [];
            for(let k in oldSpecial) {
                _arr.push(oldSpecial[k]);
            }
            let bool = false;
            oldSpecial = _arr;
            for(let i = 0 ; i < specialData.length; i++) {
                for(let j = 0; j < oldSpecial.length; j++){
                    if(specialData[i].attribute_id == oldSpecial[j].constraint_id) {
                        bool = true;
                    }
                }
                if(!bool){
                    prompt.push('特殊属性');
                }
            }
        }
        if(prompt.length > 0){
            H.dialog({
                title: '提示',
                content: '<div>以下规则：</div><P>'+prompt.join(' / ') + '</P><div>有变化，需重新填写</div>'
            });
        }
    }

    //显示检验报告编辑的弹窗;
    showInspectReport(status) {
        if(status == 1) {
            $('#inspect_report_wrap').addClass('show');
            window.location.href = '#uploader';
        }else {
            $('#inspect_report_wrap').removeClass('show');
            window.history.back();
        }
    }

    //modifyState
    setModifyState(state) {
        this.setState({modifyState: state});
    }

    render() {
        if(!this.state.defaultPara.basic_infos.goods_id){
            return null;
        }
        let basicInfo = this.state.defaultPara.basic_infos;
        return (
            <div>
            <div id="goods_update_wrap" className="add-goods-list">
                <div className="scroller">
                    <div className="container">
                        <div className="plate-title">*请选择分类</div>
                        {this.createGoodsType()}
                        <div className="plate-title">*商品类型</div>
                        <div className="add-goods-item">
                            <div className="cell-row input-line">
                                <div className="cell-head">品名</div>
                                <div className="cell-body">
                                    <input className="cell-input" onChange={this.updateValue.bind(this)} data-para="goods_name" value={basicInfo.goods_name}/>
                                </div>
                            </div>
                            <div className="cell-row input-line">
                                <div className="cell-head">品牌</div>
                                <div className="cell-body">
                                    <input className="cell-input" onChange={this.updateValue.bind(this)} data-para="brand_name" value={basicInfo.brand_name}/>
                                </div>
                            </div>
                            <div className="cell-row input-line">
                                <div className="cell-head">产地</div>
                                <div className="cell-body">
                                    <input className="cell-input" onChange={this.updateValue.bind(this)} data-para="origin" value={basicInfo.origin}/>
                                </div>
                            </div>
                        </div>
                        <WexinPhoto picArr={this.state.defaultPara.pictures} maxLength={6} setModifyState={this.setModifyState.bind(this)}
                                    scroll={this.state.SCROLL} desc="*至少包含1张外包装，1张开箱图，1张细节图" />
                        <div>{this.state.basic_attributes_list}</div>
                        {this.props.type == 1 ? null : this.state.goods_type_id ? <div><a className="btn btn-add" onClick={this.createBasicAttributes.bind(this)}><i>&times;</i>添加多型号</a></div> : null}
                        <div className="plate-title">*特殊介绍</div>
                        {this.createsSpecialAttributes()}
                        <div className="plate-title">选填项</div>
                        <div className="add-goods-item special-attr-wrap">
                            <div className="cell-row inspect-report-item" onClick={this.showInspectReport.bind(this, 1)}>
                                <div className="cell-head">
                                    检验报告
                                </div>
                                <div className="cell-body"></div>
                                <div className="cell-foot">
                                    <div className="cell-more">{this.state.defaultPara.inspection_reports.length > 0 ? '已添加' : '未添加'}<i className="right-arrow"></i></div>
                                </div>
                            </div>
                            <div className="cell-row" style={{height: '83px', overflow: 'hidden', alignItems: 'inherit', paddingTop: '10px'}}>
                                <div className="cell-body">
                                    <textarea className="text-area" placeholder="优势描述" rows="4"  data-para="describe" onChange={this.updateValue.bind(this)}
                                              defaultValue={this.state.defaultPara.basic_infos.describe}/>
                                </div>
                            </div>
                        </div>
                        <div><a className="btn btn-confirm" onClick={this.submit.bind(this)}>保存</a></div>
                    </div>
                </div>
                <div id="inspect_report_wrap" className="inspect-report-wrap">
                    <WexinPhoto picArr={this.state.defaultPara.inspection_reports} setModifyState={this.setModifyState.bind(this)}
                                maxLength={3} desc="*非必须，最多上传3张检验报告相关的图片"  />
                    <div className="inspect-report-btn" onClick={this.showInspectReport.bind(this, 0)}>保存</div>
                </div>
            </div>
                {this.state.addPrice}
            </div>
        );
    }

}
export default GoodsUpdate;