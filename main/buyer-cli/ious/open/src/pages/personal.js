/*
* xy 2017.06.15
* 个人信息完善
* */
//import WeCheckbox from '../components/weCheckbox';
class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.basis_data || {  //个人信息数据;
                'is_car':'NO',
                'children':'NO'
            },
            residentArr: [],    //居住情况的列表数据;
            marriageArr: [],    //婚姻状况
            areaArr: null,      //所有地区列表;
            provinceId: [],       //省数据;
            cityId: [],           //当前省下面的所有市;
            countyId: []          //当前的所有区县;
        };
    }

    componentWillMount() {
        this.getDwellCondition();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data.basis_data) {
            this.setState({data: nextProps.data.basis_data});
        }
    }


    //下一步;
    nextStep() {
        location.hash = '#/personal/work';
    }

    //获取居住状况和婚姻状况编码数组;
    getDwellCondition() {
        $.loading.show();
        $.req.getDwellCondition({}, (res) => {
            let residentArr = [], marriageArr = [];
            if(res.code == 0) {
                residentArr = res.data;
            }else {
                $.toast({icon: 'info', text: res.message});
            }
            $.req.getMarriageCode({}, (res) => {
                if(res.code == 0) {
                    marriageArr = res.data;
                }else {
                    $.toast({icon: 'info', text: res.message});
                }
                $.req.getArea({}, (res) => {
                    $.loading.hide();
                    if(res.code == 0) {
                        let area = res.data,
                            provinceId = 0,       //省数据;
                            cityId = 0,           //当前省下面的所有市;
                            countyId = 0,
                            data = this.state.data.resident_area;          //当前的所有区县;
                        if(this.state.data.resident_area) {
                            provinceId = data.province_id;
                            cityId = data.city_id;
                            countyId = data.county_id;
                        }else {
                            for(let i in area.province) {
                                provinceId = i;
                                break;
                            }
                            for(let k in area.city[provinceId]) {
                                cityId = k;
                                break;
                            }
                            for(let j in area.county[provinceId][cityId]) {
                                countyId = j;
                                break;
                            }
                        }
                        this.setState({
                            residentArr: residentArr, marriageArr: marriageArr,
                            areaArr: res.data, provinceId: provinceId,
                            cityId: cityId, countyId: countyId
                        });
                    }else {
                        console.log(123);
                        $.toast({icon: 'info', text: res.message});
                    }
                });
            });
        });
    }

    componentDidMount() {
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('personalPage'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 3,
                preventDefault: false
            });
        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    //输入框改变时;
    changeHandle(key, e) {
        let data = this.state.data,
            val = e.target.value;
        if(!key) return;
        if(key == 'is_car' || key == 'children') {  //如果是否有车和是否有子女选项;
            val = data[key] == 'YES' ? 'NO' : 'YES';
        }
        data[key] = val;
        this.setState({data: data});
    }

    //选择居住情况;
    residentType() {
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="Picker1"></div></div>', up, current = 0, key = this.state.data.resident_type,
            arr = this.state.residentArr;
        for(let i = 0 ; i < arr.length ; i++) {
            if(arr[i].code == this.state.data.resident_type) {
                current = i;
            }
        }

        $.picker(str, '选择居住情况', () => {
            let data = this.state.data;
            data.resident_type = key;
            this.setState({data: data});
        });
        up = UIPickerView.createPickerView({
            dataSource: arr,
            id: 'Picker1',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                key = data.code;
            }
        });
        up.UPSelectRowIndexPath(current + 1).UPThen(function(indexPath, value) {
            key = value.code;
        });
    }

    //选择婚姻情况;
    chooseMarriage() {
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="Picker1"></div></div>', up, current = 0, key = this.state.data.marriage,
            arr = this.state.marriageArr;
        for(let i = 0 ; i < arr.length ; i++) {
            if(arr[i].code == key) {
                current = i;
            }
        }

        $.picker(str, '选择婚姻情况', () => {
            let data = this.state.data;
            data.marriage = key;
            this.setState({data: data});
        });
        up = UIPickerView.createPickerView({
            dataSource: arr,
            id: 'Picker1',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                key = data.code;
            }
        });
        up.UPSelectRowIndexPath(current + 1).UPThen(function(indexPath, value) {
            key = value.code;
        });
    }

    //请选择您的现居住地;
    residentArea() {
        let area = this.state.areaArr;

        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="Picker1"></div></div><div class="region-picker"><div id="Picker2"></div></div>' +
                '<div class="region-picker"><div id="Picker3"></div></div>', up, up1, up2, province = 0, city = 0, county = 0,
            provinceArr = [], cityArr = [], countyArr = [], provinceId = this.state.provinceId, cityId = this.state.cityId, countyId = this.state.countyId;
        //先生成三个数组;

        let provinceData = [],
            cityData = [],    //在area数组中取出当前省下面的城市;
            countyData = [];  //在area数组中取出当前省当前市下面的县;

        //生成当前省的数组;
        function setProvince() {
            provinceData = area.province;
            provinceArr = [];
            for(let k in provinceData) {
                provinceArr.push({code: k, name: provinceData[k]});
                if(k == provinceId) {
                    province = provinceArr.length - 1;
                }
            }
        }

        //生成当前市的数组;
        function setCity() {
            cityData = area.city[provinceId];
            cityArr = [];
            for(let k in cityData) {
                cityArr.push({code: k, name: cityData[k]});
                if(k == cityId) {
                    city = cityArr.length - 1;
                }
            }
        }

        //生成当前市的数组;
        function setCounty() {
            countyData = area.county[provinceId][cityId];
            countyArr = [];
            for(let k in countyData) {
                countyArr.push({code: k, name: countyData[k]});
                if(k == countyId) {
                    county = countyArr.length - 1;
                }
            }
        }

        setProvince();
        setCity();
        setCounty();

        $.picker(str, '选择您的现居住地', () => {
            let data = this.state.data;
            data.resident_area = {
                province_id: provinceId,
                city_id: cityId,
                county_id: countyId
            };
            this.setState({data: data});
        });

        up = UIPickerView.createPickerView({
            dataSource: provinceArr,
            id: 'Picker1',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                provinceId = data.code;
                setCity();
                up1.UPRender(cityArr);
                up1.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    cityId = value.code;
                });
                setCounty();
                up2.UPRender(countyArr);
                up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    countyId = value.code;
                });
            }
        });
        up.UPSelectRowIndexPath(province + 1).UPThen(function(indexPath, value) {
            provinceId = value.code;
        });

        up1 = UIPickerView.createPickerView({
            dataSource: cityArr,
            id: 'Picker2',
            constraintsId: 'wower1',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                cityId = data.code;
                setCounty();
                up2.UPRender(countyArr);
                up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    countyId = value.code;
                });
            }
        });
        up1.UPSelectRowIndexPath(city + 1).UPThen(function(indexPath, value) {
            cityId = value.code;
        });

        up2 = UIPickerView.createPickerView({
            dataSource: countyArr,
            id: 'Picker3',
            constraintsId: 'wower2',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                countyId = data.code;
            }
        });
        up2.UPSelectRowIndexPath(county + 1).UPThen(function(indexPath, value) {
            countyId = value.code;
        });

    }

    //创建下一步的按钮;
    createBtn() {
        let data = this.state.data;
        if(data.mobile_codes && data.resident_type && data.resident_area && data.resident_address && data.marriage && data.is_car && data.introduction){
            return (
                <button className="btn btn-primary btn-full" onClick={this.nextStep.bind(this)}>下一步</button>
            );
        }else {
            return (
                <button className="btn btn-primary btn-full" disabled onClick={this.nextStep.bind(this)}>下一步</button>
            );
        }
    }

    render() {
        let data = this.state.data || {},
            resident = '', marriage = '',
            residentArr = this.state.residentArr,
            marriageArr = this.state.marriageArr;
        for(let i = 0 ; i < residentArr.length ; i++) {
            if(residentArr[i].code == data.resident_type) resident = residentArr[i].name;
        }
        for(let j = 0 ; j < marriageArr.length ; j++) {
            if(marriageArr[j].code == data.marriage) marriage = marriageArr[j].name;
        }
        return (
            <div>
                <div id="personalPage" className="personal-page">
                    <div className="scroller">
                        <h4 className="plate-hd">个人基本信息</h4>
                        <div className="plate-bd">
                            <div className="cell">
                                <label>手机号码<i className="text-orange">*</i></label>
                                <input type="tel" value={data.mobile_codes} onChange={this.changeHandle.bind(this, 'mobile_codes')} placeholder="请输入您的手机号码"/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>电子邮箱</label>
                                <input type="text" value={data.email} onChange={this.changeHandle.bind(this, 'email')} placeholder="请输入您的电子邮箱"/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>居住情况<i className="text-orange">*</i></label>
                                <a className="bd" onClick={this.residentType.bind(this)}>
                                    {!data.resident_type ? '请选择您的居住情况' : <span className="text-muted">{resident}</span>}
                                </a>
                                <i className="more-icon">
                                </i>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>现居住所在地区<i className="text-orange">*</i></label>
                                <a className="bd" onClick={this.residentArea.bind(this)}>
                                    {!data.resident_area || !this.state.areaArr ? '请选择您的现居住地' :
                                        <span className="text-muted">
                                            {this.state.areaArr.province[data.resident_area.province_id]}
                                            {this.state.areaArr.city[data.resident_area.province_id][data.resident_area.city_id]}
                                            {this.state.areaArr.county[data.resident_area.province_id][data.resident_area.city_id][data.resident_area.county_id]}
                                        </span>}
                                </a>
                                <i className="more-icon">
                                </i>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>居住详细地址<i className="text-orange">*</i></label>
                                <input type="text" placeholder="详细地址(街道、小区、楼层)" value={data.resident_address}
                                       onChange={this.changeHandle.bind(this, 'resident_address')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>是否有车<i className="text-orange">*</i></label>
                                <div className="bd"></div>
                                <input className="we-switch" type="checkbox" checked={data.is_car == 'YES'}
                                       onChange={this.changeHandle.bind(this, 'is_car')} />
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>车牌号码</label>
                                <input type="text" placeholder="如：川A123F5" value={data.car_code}
                                       onChange={this.changeHandle.bind(this, 'car_code')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>婚姻状况<i className="text-orange">*</i></label>
                                <a className="bd" onClick={this.chooseMarriage.bind(this)}>
                                    {!data.marriage ? '请选择您的婚姻状况' : <span className="text-muted">{marriage}</span>}
                                </a>
                                <i className="more-icon">
                                </i>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>是否有子女</label>
                                <div className="bd"></div>
                                <input className="we-switch" type="checkbox" checked={data.children == 'YES'}
                                       onChange={this.changeHandle.bind(this, 'children')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>配偶姓名</label>
                                <input type="text" placeholder="请输入您的配偶姓名" value={data.spouse_name}
                                       onChange={this.changeHandle.bind(this, 'spouse_name')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>配偶身份证号码</label>
                                <input type="text" placeholder="请输入您的配偶身份证号码" value={data.spouse_id_card}
                                       onChange={this.changeHandle.bind(this, 'spouse_id_card')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>配偶手机号码</label>
                                <input type="tel" placeholder="请输入您的配偶手机号码" value={data.spouse_mobile_codes}
                                       onChange={this.changeHandle.bind(this, 'spouse_mobile_codes')}/>
                            </div>
                            <div className="cell textarea">
                                <label>贷款简介<i className="text-orange">*</i></label>
                                <textarea placeholder="请输入贷款简介(255字以内)" value={data.introduction}
                                          onChange={this.changeHandle.bind(this, 'introduction')}>
                                </textarea>
                            </div>
                        </div>
                        <div className="sub-btn">{this.createBtn()}</div>
                    </div>
                </div>

                {this.props.children && React.cloneElement(this.props.children, {data: this.state.data, area: this.state.areaArr, getApplyData: this.props.getApplyData})}

            </div>
        );
    }
}

export default Personal;