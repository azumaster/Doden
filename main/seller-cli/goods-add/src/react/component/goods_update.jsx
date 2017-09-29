import WexinPhoto from './we-uploader/WexinPhoto.jsx';
import BasicInfo from './common/basicInfo.jsx';
import BasicAttr  from './common/basicAttr.jsx';
import SpecialAttr  from './common/specialAttr.jsx';
import ChangPrice from './common/change-price.jsx';

class GoodsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultPara: {
                basic_infos: {halal: 0},
                basic_attributes: {
                    'goods_price': '',
                    'goods_unit_id': 0,
                    'rough_weight': '',
                    'net_weight': '',
                    'specs': {},
                    'types': {},
                    'price_rules': []
                },
                special_attributes: [],
                pictures: [],
                inspection_reports: []
            },
            goods_type_id: 0,
            goodsType: {},
            index: '', //查找的二维数组
            root: '', //根节点
            basicAttrData: [],   //型号规格数据;
            specialData: [],    //特殊属性数据;
            deleteList: [],
            refresh: false,
            goodsTypeList: [],
            goodsTypeIndex: [],
            lastSelected: [],
            pricePage: null   //设置价格的页面;
        };
        this.submit =  this.submit.bind(this);
        this.createScroll = this.createScroll.bind(this);
        $('#type_mask').hide();
    }

    setChangePricePage(index) {
        let dom = null;
        if(index != -1) {
            dom = (
                <ChangPrice closePrice={this.setChangePricePage.bind(this)}
                            data={this.state.defaultPara.basic_attributes}
                            param={this.state.defaultPara}
                            updatePrice={this.updatePrice.bind(this)}
                            setBasicAttr={this.setBasicAttr.bind(this)}/>);
        }
        this.setState({pricePage: dom});
    }

    //获取商品详情;
    getGoodsInfo(){
        H.we_loading.show();
        H.server.getGoodsInfo({goods_id: this.props.goods_id}, (res)=>{
            H.we_loading.hide();
            if(res.code == 0){
                this.setState({
                    defaultPara: res.data
                }, ()=>{
                    this.createScroll();
                    this.getGoodsType();
                });
            }
        });
    }

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
        this.getGoodsInfo();
        //this.getBasicAttr();
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
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('add_goods_list'),
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
                    this.state.firstType = this.getType(id[1], 'self')[0].name;
                    this.state.secondType = this.getType(id[2], 'self')[0].name;
                    this.state.thirdType = this.getType(id[3], 'self')[0];
                    this.state.goods_type_id = this.state.thirdType.id;
                    this.state.thirdType = this.state.thirdType.name;
                    this.setState({
                        thirdType: this.state.thirdType
                    }, () => {
                        this.getSpecialAttrList();
                        this.getBasicAttr();
                    });
                    this.createGoodsType();
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获得特殊属性列表
    getSpecialAttrList(){
        H.server.getSpecialAttrList({type_id: this.state.goods_type_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    specialData: res.data.attributes
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    //获取基本属性规则;
    getBasicAttr(){
        H.server.getBasicAttr({type_id: this.state.goods_type_id}, (res)=>{
            if(res.code == 0){
                this.setState({
                    basicAttrData: res.data
                }, ()=>{
                    setTimeout(() => {
                        this.state.SCROLL.refresh();
                    }, 100);
                });
            }else{
                H.operationState(res.message);
            }
        });
    }

    //设置数据;
    setParam (data) {
        this.setState({defaultPara: data});
    }

    //设置型号规格;
    setBasicAttr(data) {
        let param = this.state.defaultPara;
        param.basic_attributes = data;
        this.setParam(param);
    }

    //创建类型选择工具
    createTimeBar() {
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="provincePicker"></div></div><div class="region-picker"><div id="cityPicker"></div>'+
            '</div><div class="region-picker"><div id="areaPicker"></div></div>';
        H.picker(str, '选择分类');
        var type, type1, type2, up, up1, up2, firstType = this.state.firstType, secondType = this.state.secondType,
            thirdType = this.state.thirdType;
        let that = this;

        if(this.state.goods_type_id == 0){
            type = this.handleResult(this.getType(this.state.root, 'parent'));
            type1 = this.handleResult(this.getType(type[0].key, 'parent'));
            type2 = this.handleResult(this.getType(type1[0].key, 'parent'));
        }else {
            this.getItem(this.state.goods_type_id);
            this.getIndex(this.state.goodsTypeList, this.state.lastSelected);
            type = this.handleResult(this.state.goodsTypeList[2]);
            type1 = this.handleResult(this.state.goodsTypeList[1]);
            type2 = this.handleResult(this.state.goodsTypeList[0]);
            this.state.goodsTypeList = [];
            this.state.lastSelected = [];
        }

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
                firstType = data.value;

                if(up1.UPSelectRowIndexPath(1)){
                    up1.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        type2 =  that.handleResult(that.getType(value.key, 'parent'));
                        up2.UPRender(type2);
                        secondType = value.value;
                    });
                }else {
                    type2 =  that.handleResult(that.getType('-1', 'parent'));
                    up2.UPRender(type2);
                    secondType = '';
                    thirdType = '';
                }

                if(up2.UPSelectRowIndexPath(1)){
                    up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        thirdType = value.value;
                        that.state.goods_type_id = value.key;
                    });
                }else {
                    thirdType = '';
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
                secondType = data.value;
                if(up2.UPSelectRowIndexPath(1)){
                    up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                        thirdType = value.value;
                        that.state.goods_type_id = value.key;
                    });
                }else {
                    thirdType = '';
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
                thirdType = data.value;
                that.state.goods_type_id = data.key;
            }
        });

        up.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[2]+1).UPThen(function(indexPath, value) {
            firstType = value.value;
        });


        up1.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[1]+1).UPThen(function(indexPath, value) {
            type2 =  that.handleResult(that.getType(value.key, 'parent'));
            up2.UPRender(type2);
            secondType = value.value;
        });

        up2.UPSelectRowIndexPath(this.state.goods_type_id == 0 ? 1 : this.state.goodsTypeIndex[0]+1).UPThen(function(indexPath, value) {
            thirdType = value.value;
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
            this.state.goodsTypeIndex = [];
            if(!thirdType){
                H.operationState('当前分类不能添加商品，请重新选择！');
            }else {
                animaed.finish();
                $('#picker_mask').hide();
                let param = this.state.defaultPara;
                if(thirdType != this.state.thirdType) {
                    this.getBasicAttr();
                    this.getSpecialAttrList();
                    param.basic_attributes = {
                        'goods_price': '',
                        'goods_unit_id': 0,
                        'rough_weight': '',
                        'net_weight': '',
                        'specs': {},
                        'types': {},
                        'price_rules': []
                    };
                    param.special_attributes = [];
                }
                this.setState({
                    firstType: firstType,
                    secondType: secondType,
                    thirdType: thirdType,
                    defaultPara: param
                });
                animaed.removeEvent();
            }
        });
        animaed.start();
    }

    //创建分类;
    createGoodsType(){
        return(
            <div className="cell-row input-line plate-goods-type" >
                <div className="cell-head">分类</div>
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

    submit(){
        let defaultPara =  $.extend(true, {}, this.state.defaultPara),
            special_attributes = defaultPara.special_attributes,
            basic_attributes = defaultPara.basic_attributes,
            specsValues = [],
            typeValues = [];
        defaultPara.basic_infos.goods_type_id = this.state.goods_type_id;
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
        typeValues = basic_attributes['types'].values;
        if(!specsValues || !typeValues) {
            H.operationState('规格型号必须填写');
            return;
        }
        for(let j=0; j<specsValues.length; j++){
            if(!specsValues[j]){
                specsValues.splice(j, 1);
            }
        }

        if(basic_attributes['types'].attr_values){
            delete basic_attributes['types'].attr_values;
        }

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
                    cancel: '继续修改',
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
    }

    //显示检验报告编辑的弹窗;
    showInspectReport(status) {
        if(status == 1) {
            $('#inspect_report_wrap').addClass('show');
            window.location.href = '#uploader';
        }else {
            $('#inspect_report_wrap').removeClass('show');
            window.history.back();
            this.setState();
        }
    }

    updatePrice(data) {
        let p = {
            goods_id: this.props.goods_id,
            new_price: data.goods_price,
            price_rules: data.price_rules
        };
        H.we_loading.show();
        H.server.changePrice(JSON.stringify(p), (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                H.operationState('价格修改成功');
            }else {
                H.operationState(res.message);
            }
        });
    }

    render() {
        return (
            <div>
                <div id="add_goods_list" className="add-goods-list">
                    <div className="scroller">
                        <div className="container">
                            <div className="plate-title">*请选择分类</div>
                            {this.createGoodsType()}
                            <BasicInfo param={this.state.defaultPara} setParam={this.setParam.bind(this)} />
                            <WexinPhoto picArr={this.state.defaultPara.pictures} maxLength={6} scroll={this.state.SCROLL} desc="*至少包含1张外包装，1张开箱图，1张细节图" />
                            <div>
                                <BasicAttr data={this.state.defaultPara.basic_attributes} setParam={this.setParam.bind(this)} setBasicAttr={this.setBasicAttr.bind(this)}
                                           setChangePricePage={this.setChangePricePage.bind(this)}
                                           attr={this.state.basicAttrData} />
                            </div>
                            <SpecialAttr param={this.state.defaultPara} data={this.state.specialData} setParam={this.setParam.bind(this)} />
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
                                        <textarea className="text-area" placeholder="优势描述" rows="4"  data-para="describe" onChange={this.updateValue.bind(this)}/>
                                    </div>
                                </div>
                            </div>
                            <div><a className="btn btn-confirm" onClick={this.submit.bind(this)}>保存并继续添加</a></div>
                        </div>
                    </div>
                    <div id="inspect_report_wrap" className="inspect-report-wrap">
                        <WexinPhoto picArr={this.state.defaultPara.inspection_reports} maxLength={3} desc="*非必须，最多上传3张检验报告相关的图片" />
                        <div className="inspect-report-btn" onClick={this.showInspectReport.bind(this, 0)}>保存</div>
                    </div>
                </div>
                {this.state.pricePage}
            </div>
        );
    }

}
export default GoodsAdd;