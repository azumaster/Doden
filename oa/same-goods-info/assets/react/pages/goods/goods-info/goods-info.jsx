/*
* 商品转移，添加，修改用*/
import InputUnit from '../../../../components/input-unit/input-unit.jsx';
import GoodsClassSelect from '../../goods-class-select.jsx';
import RadioGroup from '../../../../components/radio/radio.jsx';
import EditImage from '../../goods/goods-transfer/editImage.jsx';

/*
* props参数说明:
* goodsId: 5  商品ID;
* */

class GoodsInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {  //需要提交的数据;
                'basic_infos': {
                    'goods_id': H.getUrlParam('goodsId') || 0,
                    'goods_name': '',
                    'goods_type_id': 11,
                    'brand_id': 0,
                    'origin': '',
                    'halal': 0,
                    'smuggle_id': 1,
                    'goods_title': '',
                    'describe': ''
                },
                'basic_attributes': {
                    'goods_price': 0,
                    'goods_unit_id': 1,
                    'price_adjust_frequency': 1,
                    'rough_weight': '',
                    'net_weight': '',
                    'meat_weight': '',
                    'inventory': 99999,
                    'minimum_order_quantity': 1,
                    'specs': {
                        'constraint_id':3,
                        'must':true,
                        'name':'规格',
                        'values':[
                            {
                                'value':'',
                                'unit':''
                            }
                        ]
                    },
                    'types':{
                        'constraint_id':2,
                        'must':true,
                        'name':'型号',
                        'values':[
                            {
                                'value':'',
                                'unit':''
                            }
                        ]
                    }
                },
                'special_attributes':[],
                'pictures':[],
                inspection_reports: [],
                price_rules:[

                ]
            },
            basicAttrData: null,  //基本属性规则;
            specialData: [],    //特殊属性规则;
            goodsClassData: null,  //商品分类数据;
            activitiesType: [],   //活动类型数据;
            goodsUnits: [],    //商品单位获取;
            goodsSmuggles: [],   //商品国别获取;
            goodsBrands: null,    //商品品牌;
            searchBrand: [],    //当前搜索出来的品牌;
            EditImage: '',   //编辑图片弹出框;
            brand_name: '',   //当前选中的这个品牌名;
            editor: null,   //编辑器;
            strArr: [],      //特殊属性中之前的属性值;
            priceRules: [],   //商品规则数据;
            sameParam: {},    //获取相似商品的参数;
            sameData: [],      //相似商品数据;
            areaId: H.getUrlParam('areaId') || 0,   //大区Id,
            goodsId: H.getUrlParam('goodsId') || 0  //商品Id
        };
        this.setTypeId = this.setTypeId.bind(this);
        this.getAttr = this.getAttr.bind(this);
        this.createFormatType = this.createFormatType.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.setNewImgUrl = this.setNewImgUrl.bind(this);
        this.hideEditImage = this.hideEditImage.bind(this);
    }

    componentWillMount() {
        this.getInitData();
    }

    componentDidMount() {
        document.addEventListener('click', function(event) {
            if(event.target.dataset.choose != 'input' && event.target.dataset.choose != 'brand'){
                $('.search-select').hide();
            }
        });
    }

    //基本属性规则和特殊属性规则获取;
    getAttr() {
        let param = {type_id: this.state.data.basic_infos.goods_type_id},
            that = this;
        that.state.specialData = [];
        H.server.goods_type_basicAttr_get(param, (res) => {  //基本属性规则获取
            if(res.code == 0) {
                if(!res.data.spec_constraint.attribute_id) {
                    H.Modal({
                        title: '警告',
                        content: '该分类下还没有设置规格约束，您暂时不能在这个分类下添加商品'
                    });
                }else if(!res.data.type_constraint.attribute_id) {
                    H.Modal({
                        title: '警告',
                        content: '该分类下还没有设置型号约束，您暂时不能在这个分类下添加商品'
                    });
                }
                this.state.basicAttrData = res.data;
                setString();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
        H.server.goods_type_specialAttr_list(param, (res) => {  //获取特殊属性;
            if(res.code == 0) {
                this.state.specialData = res.data.attributes;
                setString();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
        function setString() {
            if(that.state.basicAttrData && that.state.specialData.length > 0) {
                let oldData = Object.assign({}, that.state.oldData),
                    data = that.state.data,
                    specialData = that.state.specialData,
                    specsArr = [],
                    strArr = [];
                if(oldData.basic_attributes.specs.constraint_id != that.state.basicAttrData.spec_constraint.attribute_id) {
                    that.state.specsAttrString = oldData.basic_attributes.specs.attr_values;
                    data.basic_attributes.specs = that.createGoodsInfoKey(that.state.basicAttrData.spec_constraint, '规格');
                }else {
                    if(oldData.basic_attributes.specs.format_type_id != that.state.basicAttrData.spec_constraint.format_type_id) {
                        that.state.specsAttrString = oldData.basic_attributes.specs.attr_values;
                        data.basic_attributes.specs = that.createGoodsInfoKey(that.state.basicAttrData.spec_constraint, '规格');
                    }else {
                        data.basic_attributes.specs = {
                            'constraint_id': oldData.basic_attributes.specs.constraint_id,
                            'must': oldData.basic_attributes.specs.must,
                            'name': oldData.basic_attributes.specs.name,
                            'values': oldData.basic_attributes.specs.values
                        };
                    }
                }
                if(oldData.basic_attributes.types.constraint_id != that.state.basicAttrData.type_constraint.attribute_id) {
                    that.state.typesAttrString = oldData.basic_attributes.specs.attr_values;
                    data.basic_attributes.types = that.createGoodsInfoKey(that.state.basicAttrData.type_constraint, '型号');
                }else {
                    if(oldData.basic_attributes.types.format_type_id != that.state.basicAttrData.type_constraint.format_type_id) {
                        that.state.typesAttrString = oldData.basic_attributes.types.attr_values;
                        data.basic_attributes.types = that.createGoodsInfoKey(that.state.basicAttrData.type_constraint, '型号');
                    }
                }
                let oldSpecial = Object.assign({}, oldData.special_attributes),
                    _arr = [];
                for(let k in oldSpecial) {
                    _arr.push(oldSpecial[k]);
                }
                oldSpecial = _arr;
                for(let i = 0 ; i < specialData.length; i++) {
                    for(let j = 0 ; j < oldSpecial.length ; j++) {
                        if(specialData[i].attribute_id == oldSpecial[j].constraint_id) {
                            if(specialData[i].format_type_id == oldSpecial[j].format_type_id) {
                                specsArr[i] = {
                                    'constraint_id': oldSpecial[j].constraint_id,
                                    'must': specialData[i].must,
                                    'name': specialData[i].attribute_name,
                                    'values': oldSpecial[j].values
                                };
                                oldSpecial.splice(j, 1);
                                break;
                            }else {
                                specsArr[i] = that.createGoodsInfoKey(specialData[i]);
                            }

                        }else {
                            specsArr[i] = that.createGoodsInfoKey(specialData[i]);
                        }
                    }
                }
                for(let n = 0 ; n < oldSpecial.length ; n++) {
                    strArr.push(oldSpecial[n].attr_values);
                }
                data.special_attributes = specsArr;
                that.state.strArr = strArr;
                that.setState({data: data});
            }
        }
    }

    //根据对应的规则生成商品信息默认的字段;
    createGoodsInfoKey(res, name) {
        let must = false;
        if(name) {
            must = true;
        }else {
            must = res.must;
        }
        let obj = {'constraint_id': res.attribute_id, 'must': must, 'name': name ? name : res.attribute_name, 'values':[]},
            values = [];
        switch (res.format_type_id) {
            case 1:
                values = [{'value': '', 'unit': ''}];
                break;
            case 2:
                values = [{'value': '', 'unit': ''}];
                break;
            case 3:
                let arr = res.format_values;
                for(let i = 0 ; i < arr ; i++) {
                    values.push({'value': '', 'unit': arr[i].unit});
                }
                break;
            case 4:
                values = [{'value': '', 'unit': res.format_values[0].unit}, {'value': '', 'unit': res.format_values[1].unit}];
                break;
            case 5:
                values = [{'value': '', 'unit': res.format_values[0].unit}, {'value': '', 'unit': res.format_values[1].unit}];
                break;
        }
        obj.values = values;
        return obj;
    }

    //设置选择的分类;
    setTypeId(id) {
        let data = this.state.data,
            sameParam = this.state.sameParam;
        data.basic_infos.goods_type_id = id;
        data.special_attributes = [];
        data.basic_attributes.specs.values = [];
        data.basic_attributes.types.values = [];
        sameParam.type_id = id;
        this.setState({data: data, sameData: []}, () => {
            this.getAttr();
        });
    }

    //基本属性和特殊属性中几个对应的选项：单选、多选、文本框、X*Y、X-Y;
    createFormatType(data, value, label, status){
        let XML = [],
            mandatory = null;
        if(data.must) {
            mandatory = (<div className="ft mandatory">*</div>);
        }
        switch (data.format_type_id) {
            case 1:
                let defaultValue = '',
                    spanXml = [];
                if(value) {
                    if(value.values[0]){
                        defaultValue = value.values[0].value;
                    }
                }
                if(data.format_values[0].unit) {   //如果规则中有单位的需要在输入框后面加单位;
                    spanXml.push(<span key={status + '' + new Date().getTime()} className="unit-item">{data.format_values[0].unit}</span>);
                }

                XML.push(
                    <div className="clearfix" key={data.format_type_id + '' + new Date().getTime()}>
                        <div className="label-title">{label}</div>
                        <div className="bd form-inline" style={{width: 'auto'}}>
                            <div className="form-control input-unit">
                                <input type="text" value={defaultValue}/>{spanXml}
                            </div>
                        </div>
                        {mandatory}
                    </div>
                );
                break;
            case 2:
                XML.push(
                    <div className="clearfix" key={data.format_type_id + '' + new Date().getTime()}>
                        <div className="label-title" style={{marginTop: '0px'}}>{label}<span style={{color: '#38b7f6', display: 'inherit'}}>(单选)</span></div>
                        <div className="bd form-inline" style={{width: 'auto'}}>
                            <div className="form-group input-inline btn-group-rule">
                                {
                                    data.format_values.map((val, index) => {
                                        let flag = false;
                                        if(value) {
                                            if(value.values[0] && value.values[0].value == val.value) flag = true;
                                        }
                                        return (
                                            <btn key={index + '' + new Date().getTime()} className={flag ? 'btn active' : 'btn'}>{val.value}</btn>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        {mandatory}
                    </div>
                );
                break;
            case 3:
                XML.push(
                    <div className="clearfix" key={data.format_type_id + '' + new Date().getTime()}>
                        <div className="label-title" style={{marginTop: '0px'}}>{label}<span style={{color: '#38b7f6', display: 'inherit'}}>(多选)</span></div>
                        <div className="bd form-inline" style={{width: 'auto'}}>
                            <div className="form-group input-inline btn-group-rule">
                                {
                                    data.format_values.map((val, index) => {
                                        let that = val,
                                            flag = false;
                                        that.index = index;
                                        if(value) {
                                            for(let i = 0 ; i < value.values.length ; i++) {
                                                if(value.values[i]) {
                                                    if(value.values[i].value == val.value) {
                                                        flag = true;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                        return (
                                            <btn key={index + '' + new Date().getTime()} className={flag ? 'btn active' : 'btn'}>{val.value}</btn>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        {mandatory}
                    </div>
                );
                break;
            case 4:
                let flag1 = false, flag2 = false;
                if(value) {
                    if(value.values[0]) flag1 = true;
                }
                if(value) {
                    if(value.values[1]) flag2 = true;
                }
                XML.push(
                    <div className="clearfix" key={data.format_type_id + '' + new Date().getTime()}>
                        <div className="label-title">{label}</div>
                        <div className="bd form-inline" style={{width: 'auto'}}>
                            <input type="text" className="form-control sm-input" value={flag1 ? value.values[0].value : ''}
                                   />{data.format_values[0].unit} <span className="symbol">-</span>
                            <input type="text" className="form-control sm-input" value={flag2 ? value.values[1].value : ''}
                                   />{data.format_values[1].unit}
                        </div>
                        {mandatory}
                    </div>
                );
                break;
            case 5:
                let flag3 = false, flag4 = false;
                if(value) {
                    if(value.values[0]) flag3 = true;
                }
                if(value) {
                    if(value.values[1]) flag4 = true;
                }
                XML.push(
                    <div className="clearfix" key={data.format_type_id + '' + new Date().getTime()}>
                        <div className="label-title">{label}</div>
                        <div className="bd form-inline" style={{width: 'auto'}}>
                            <input type="text" className="form-control sm-input" value={flag3 ? value.values[0].value : ''}
                            />{data.format_values[0].unit} <span className="symbol">*</span>
                            <input type="text" className="form-control sm-input" value={flag4 ? value.values[1].value : ''}
                                   />{data.format_values[1].unit}
                        </div>
                        {mandatory}
                    </div>
                );
                break;
        }
        return XML;
    }

    getInitData() {
        let server = H.server,
            goodsUnits = null,
            goodsSmuggles = null,
            goodsBrands = null,
            goodsClassData = null,
            activitiesType = null,
            goodsInfo = null,
            priceRules = null,
            that = this;

        //商品单位获取;
        server.other_goods_units({}, (res) => {
            if(res.code == 0) {
                goodsUnits = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //商品国别获取;
        server.other_goods_smuggles({}, (res) => {
            if(res.code == 0) {
                goodsSmuggles = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //品牌获取;
        server.goods_brands_list({page: 1, size: 5000}, (res) => {
            if(res.code == 0) {
                goodsBrands = res.data.brands;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取商品分类数据;
        server.goods_type_list({area_id: this.state.areaId}, (res) => {
            if(res.code == 0) {
                goodsClassData = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取活动类型;
        server.activities_type({}, (res) => {
            if(res.code == 0) {
                activitiesType = res.data;
                activitiesType.push({id: 1, name: '无活动'});
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取商品详细信息;
        server.goods_info({goods_id: this.state.goodsId}, (res) => {
            if(res.code == 0) {
                goodsInfo = res.data;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        //获取价格体系规则;
        server.goods_price_rules({}, (res) => {
            if(res.code == 0) {
                priceRules = res.data.price_rules;
                setData();
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });

        function setData(){
            if(goodsUnits && goodsSmuggles && goodsBrands && goodsClassData && activitiesType && goodsInfo && priceRules) {
                let info = Object.assign({}, goodsInfo);
                //通过商品信息的brand_id在品牌列表数据中得出品牌名的默认值;
                let bindName = '';
                for(let i = 0 ; i < goodsBrands.length ; i++) {
                    if(goodsBrands[i].id == goodsInfo.basic_infos.brand_id) {
                        bindName = goodsBrands[i].brand + ' (' + goodsBrands[i].id + ')';
                    }
                }
                that.state.goodsUnits = goodsUnits;
                that.state.goodsSmuggles = goodsSmuggles;
                that.state.goodsBrands = goodsBrands;
                that.state.goodsClassData = goodsClassData;
                that.state.activitiesType = activitiesType;
                that.state.priceRules = priceRules;
                that.state.data = {
                    basic_infos: info.basic_infos,
                    basic_attributes: info.basic_attributes,
                    special_attributes: info.special_attributes,
                    pictures: info.pictures,
                    inspection_reports: info.inspection_reports,
                    price_rules: info.price_rules
                };
                that.state.oldData = info;
                that.state.brand_name = bindName;
                if(goodsInfo.basic_infos.goods_type_id && goodsInfo.basic_infos.goods_type_id != 1) {
                    that.getAttr();
                }else {
                    that.forceUpdate();
                }
            }
        }
    }

    //获取品牌数据;
    getBrandData() {
        //品牌获取;
        H.server.goods_brands_list({page: 1, size: 5000}, (res) => {
            if(res.code == 0) {
                this.setState({goodsBrands: res.data.brands});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //输入框修改时;
    inputChange() {
        return ;
    }

    //EditImage  显示裁剪图的弹窗; obj == '' 表示添加，否则表示修图，status == 1 表示检验报告，==2表示商品图片;
    showEditImage(obj, status) {
        if(this.state.data.pictures.length >= 6 && obj == '' && status == 2) {
            H.Modal('最多上传6张商品图片');
            return;
        }
        let EditImageXML = (<EditImage imgURL={obj.picture_add} imgObj={obj} status={status} setNewImgUrl={this.setNewImgUrl} closeModal={this.hideEditImage} />);
        this.setState({EditImage: EditImageXML});
    }

    hideEditImage() {
        this.setState({EditImage: ''});
    }

    //设置新图片的地址;
    setNewImgUrl(obj, status, url) {
        let data = this.state.data,
            arr = [];
        if(status == 1) {  //1是检验报告;
            arr = data.inspection_reports;
        }else {
            arr = data.pictures;
        }
        if(obj) {   //修图;
            if(obj.picture_id == 0) {
                arr[obj.index].picture_add = url;
            }else {
                for(let i = 0 ; i < arr.length ; i++) {
                    if(arr[i].picture_id == obj.picture_id) {
                        arr[i].picture_add = url;
                        break;
                    }
                }
            }
        }else {  //添加新图;
            arr.push({
                'picture_id': 0,
                'picture_add': url,
                'sort_value': arr.length+1
            });
        }
        this.setState({data: data, EditImage: ''});
    }

    render() {
        let data = this.state.data;
        return (
            <div className="goods-info-content" style={{height: 'auto', overflowY: 'hidden'}}>
                <div className="goods-info-warp">
                    {/*<div className="row">
                     <h5 className="col-lg-12 title">活动</h5>
                     <div className="col-lg-12 form-inline">
                     <div className="form-group"><span className="label-title">活动</span>
                     <RadioGroup
                     param={this.state.activitiesType}
                     defaultVal={oldData.activity_type || 1}
                     disabled={true}
                     index={this.props.goodsId}
                     name="activity"
                     />
                     </div>
                     </div>
                     </div>*/}
                    <div className="row">
                        <div className="col-xs-7">
                            <div className="base-info">
                                <div className="clearfix">
                                    <h5 className="title">基本信息</h5>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">商品名</div>
                                    <div className="bd form-inline">
                                        <input type="text" className="form-control input-inline" placeholder="(必须包含品牌名)"
                                               value={data.basic_infos.goods_name} />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>
                                <div className="clearfix form-inline">
                                    <span className="label-title">分类</span>
                                    <div className="bd">
                                        {
                                            this.state.goodsClassData ?
                                                <GoodsClassSelect
                                                    data={this.state.goodsClassData}
                                                    typeId={this.state.data.basic_infos.goods_type_id}
                                                    setTypeId={this.setTypeId}
                                                    showAll={true}
                                                /> : null
                                        }
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>
                                <div className="clearfix">
                                    <span className="label-title">品牌</span>
                                    <div className="bd" style={{width: '40%'}}>
                                        <div className="form-control input-inline" style={{position: 'relative'}}>
                                            <input type="text" placeholder="选择品牌" id="brand_input"
                                                   value={this.state.brand_name}
                                                   style={{outline: 'none', border: 'none', width: '100%'}}
                                                   data-choose="input"
                                            />
                                            <ul className="search-select" style={{display: 'none'}}>
                                                {
                                                    this.state.searchBrand.map((value, index) => {
                                                        return (
                                                            <li key={index} data-choose="brand">{value.brand}</li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="ft">
                                        {this.state.data.basic_infos.brand_name ?
                                            <span style={{color: '#999', lineHeight: '34px'}}>{this.state.data.basic_infos.brand_name}</span> : null}
                                        <span className="mandatory">*</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="clearfix">
                                    <div className="label-title">国别</div>
                                    <div className="bd" style={{width: '30%', marginTop: '8px'}}>
                                        <RadioGroup
                                            param={this.state.goodsSmuggles}
                                            name="country-real"
                                            defaultVal={data.basic_infos.smuggle_id}
                                            changeHandler={this.inputChange}
                                            identify={10}
                                            index={this.props.goodsId}
                                        />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px', width: '80px'}}>清真食品</div>
                                    <div className="bd" style={{width: '15%', marginTop: '8px'}}>
                                        <RadioGroup
                                            param={[{id: 0, name: '否'}, {id: 1, name: '是'}]}
                                            defaultVal={data.basic_infos.halal}
                                            name="halal"
                                            changeHandler={this.inputChange}
                                            identify={9}
                                            index={this.props.goodsId}
                                        />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">产地</div>
                                    <div className="bd form-inline">
                                        <input type="text" className="form-control input-inline"
                                               value={data.basic_infos.origin} />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>

                                {this.state.typesAttrString ?
                                    <div className="clearfix">
                                        <div className="label-title"></div>
                                        <div className="bd" style={{color: '#999'}}>
                                            {this.state.typesAttrString}
                                        </div>
                                    </div> : ''}
                                {this.state.basicAttrData ? this.createFormatType(this.state.basicAttrData.type_constraint, data.basic_attributes.types, '型号', -1) : ''}
                                {this.state.specsAttrString ?
                                    <div className="clearfix">
                                        <div className="label-title"></div>
                                        <div className="bd" style={{color: '#999'}}>
                                            {this.state.specsAttrString}
                                        </div>
                                    </div> : ''}
                                {this.state.basicAttrData ? this.createFormatType(this.state.basicAttrData.spec_constraint, data.basic_attributes.specs, '规格', -2) : ''}
                            </div>

                        </div>
                        <div className="col-xs-5"></div>
                        <div className="col-xs-12">
                            <div className="base-info">
                                <div className="clearfix">
                                    <div className="label-title">带箱重</div>
                                    <div className="bd" style={{width: '180px'}}>
                                        <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.rough_weight, identify: 3}}
                                                   changeHandler={this.inputChange}/>
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px'}}>去箱重</div>
                                    <div className="bd" style={{width: '180px'}}>
                                        <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.net_weight, identify: 14}}
                                                   changeHandler={this.inputChange}/>
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px'}}>解冻重</div>
                                    <div className="bd" style={{width: '180px'}}>
                                        <InputUnit param={{text: '公斤', placeholder: '（纯数字）', value: data.basic_attributes.meat_weight, identify: 4}}
                                                   changeHandler={this.inputChange}/>
                                    </div>
                                </div>
                            </div>
                            <div className="base-info">
                                <div className="clearfix">
                                    <h5 className="title">单位/价格</h5>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">单位</div>
                                    <div className="bd" style={{marginTop: '8px', width: 'auto'}}>
                                        <RadioGroup
                                            param={this.state.goodsUnits}
                                            name="unit"
                                            defaultVal={data.basic_attributes.goods_unit_id}
                                            changeHandler={this.inputChange}
                                            identify={12}
                                            index={this.props.goodsId}
                                        />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px'}}>库存量</div>
                                    <div className="bd" style={{width: 'auto'}}>
                                        <input className="form-control input-inline" type="text" placeholder="（纯数字）"
                                               value={data.basic_attributes.inventory == 99999 ? '' : data.basic_attributes.inventory}/>
                                    </div>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">单价</div>
                                    <div className="bd" style={{width: 'auto'}}>
                                        <InputUnit param={{text: '元', placeholder: '（货币）', value: data.basic_attributes.goods_price, identify: 7}}
                                                   changeHandler={this.inputChange}/>
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px'}}>起买量</div>
                                    <div className="bd" style={{width: '80px'}}>
                                        <input className="form-control input-inline" type="text" placeholder="（纯数字，默认为1）"
                                               value={data.basic_attributes.minimum_order_quantity} />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                    <div className="label-title" style={{marginLeft: '40px', 'width': '100px'}}>价格过期频率</div>
                                    <div className="bd" style={{width: 'auto', marginTop: '8px'}}>
                                        <RadioGroup
                                            param={[{id: 1, name: '每天过期'}, {id: 0, name: '长期有效'}]}
                                            name="gq"
                                            defaultVal={data.basic_attributes.price_adjust_frequency}
                                            changeHandler={this.inputChange}
                                            identify={11}
                                            index={this.props.goodsId}
                                        />
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>
                                <div className="clearfix">
                                    <div className="form-inline price-rules-wrap">
                                        {
                                            this.state.priceRules.map((value, index) => {
                                                let data = [],
                                                    ruleData = this.state.data.price_rules;
                                                for(let i = 0 ; i < ruleData.length ; i++) {
                                                    if(ruleData[i].price_rule_id == value.price_rule_id) {
                                                        data = ruleData[i].rules;
                                                    }
                                                }

                                                return (
                                                    <div key={value.price_rule_id + '' + index} className="price-rule-item">
                                                        <div className="hd">买{value.show_name}</div>
                                                        {
                                                            data.map((v, i) => {
                                                                return (
                                                                    <div key={value.price_rule_id + '' + index + i} className="price-rule-cell"><span className="price-rule-title">买</span>
                                                                        <input className="form-control input-inline" type="text" value={v.buy_num} />
                                                                        <span className="price-rule-title">{value.buy_unit + '，'}</span>
                                                                        <span className="price-rule-title">{value.show_name}</span>
                                                                        <input className="form-control input-inline" type="text" value={v.preferential_value} />
                                                                        <span className="price-rule-title">{value.preferential_unit}</span>
                                                                    </div>
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="base-info">
                                <div className="clearfix">
                                    <h5 className="title">特殊属性<span className="appendage">条例特殊属性配置</span></h5>
                                </div>
                                <div className="clearfix">
                                    {
                                        this.state.strArr.map((val, index) => {
                                            return (<div className="col-lg-6" style={{color: '#999', marginBottom: '10px'}} key={index}><span className="label-title"></span>{val}</div>);
                                        })
                                    }
                                </div>
                                {
                                    this.state.specialData.map((val, index) => {
                                        return (
                                            <div style={{marginTop: '10px'}}>{this.createFormatType(val, data.special_attributes[index], val.attribute_name, index)}</div>
                                        );
                                    })
                                }
                            </div>
                            <div>
                                <div className="clearfix">
                                    <h5 className="title">商品介绍</h5>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">商品标题</div>
                                    <div className="bd">
                                        <input type="text" className="form-control input-inline" placeholder="15-25字"
                                               value={data.basic_infos.goods_title} />
                                    </div>
                                </div>
                                <div className="clearfix" style={{marginTop: '10px'}}>
                                    <div className="label-title">优势描述</div>
                                    <div className="bd">
                                            <textarea className="input-inline" placeholder="支持断行、最多100字"
                                                      value={data.basic_infos.describe} >
                                            </textarea>
                                    </div>
                                    <div className="ft mandatory">*</div>
                                </div>
                                <div className="clearfix">
                                    <div className="label-title">检验报告<br/><span style={{color: '#ccc'}}>(最多3张)</span></div>
                                </div>
                                <div className="clearfix">
                                    <div className="input-inline">
                                        {
                                            data.inspection_reports.map((value, index) => {
                                                let val = value;
                                                val.index = index;
                                                return (
                                                    <div key={index} className="form-group goods-img">
                                                        <a style={{width: '200px', height: '200px', display: 'inline-block'}} href={H.cdn + val.picture_add} target="_blank">
                                                            <img src={H.cdn + val.picture_add + '@200w_50Q.jpg'} /></a>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="clearfix">
                                    <div className="input-inline">
                                        <p>最少4张，最多可添加6张图片，最好是竖屏图片</p>
                                        {
                                            data.pictures.map((value, index) => {
                                                let val = value;
                                                val.index = index;
                                                return (
                                                    <div key={index} className="form-group goods-img">
                                                        <a style={{width: '200px', height: '200px', display: 'inline-block'}} href={H.cdn + val.picture_add} target="_blank">
                                                            <img src={H.cdn + val.picture_add + '@200w_50Q.jpg'} /></a>
                                                        <div>
                                                            <div className="form-group sort">排序
                                                                <input type="text" className="sort-input" value={val.sort_value} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GoodsInfo;