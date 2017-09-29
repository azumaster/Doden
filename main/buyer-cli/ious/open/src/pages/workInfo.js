/*
* xy 2017-06-20
* 工作信息
* */
const { Link } = ReactRouter;
class WorkInfo extends React.Component {
    constructor(props) {
        super(props);
        let area = props.area,
            provinceId = 0,       //省数据;
            cityId = 0,           //当前省下面的所有市;
            countyId = 0;
        if(props.area) {
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
        this.state = {
            data: props.data || {},
            areaArr: props.area,
            provinceId: provinceId,       //省数据;
            cityId: cityId,           //当前省下面的所有市;
            countyId: countyId          //当前的所有区县;
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data});
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

    //请选择您的现居住地;
    residentArea() {
        let area = this.props.area;

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
            data.license_area = {
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

    //保存用户信息
    savePersonal() {
        let param = this.state.data;
        $.loading.show('提交中');
        $.req.basis({basis_data: param}, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                $.toast({text: '提交成功'});
                this.props.getApplyData(1);
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    //设置是否同意授权确认书
    setAgree() {
        let data = this.state.data;
        if(data.agree_deal == 1) {
            data.agree_deal = 0;
        }else {
            data.agree_deal = 1;
        }
        this.setState({data: data});
    }

    createBtn() {
        let data = this.state.data;
        if(data.license_code && data.license_name && data.license_area && data.license_address &&
            (data.enterprise_tel || data.enterprise_mobile) && data.agree_deal == 1) {
            return (
                <button className="btn btn-primary btn-full" onClick={this.savePersonal.bind(this)}>保存</button>
            );
        }else {
            return (
                <button className="btn btn-primary btn-full" disabled onClick={this.savePersonal.bind(this)}>保存</button>
            );
        }
    }

    setLicense() {
        let data = this.state.data;
        $.dialog({
            title: '请输入社会信用代码/营业执照号码',
            content: '<div style="padding:0 50px;"><input id="license" class="license-input" type="text" value="'+(data.license_code || '')+'" placeholder="请输入社会信用代码/营业执照号码"/></div>',
            cancel: true,
            okCallback: () => {
                let val = $.selector('#license').value;
                data.license_code = val;
                this.setState({data: data});
            }
        });
    }

    render() {
        let data = this.state.data;
        return (
            <div>


                <div id="workInfo" className="work-info">
                    <div className="scroller">
                        <h4 className="plate-hd">企业信息 <span className="text-orange">(固话、手机必填一项)</span></h4>
                        <div className="plate-bd">
                            <div className="cell">
                                <label>社会信用代码/营业执照号码<i className="text-orange">*</i></label>
                                <a className="bd" onClick={this.setLicense.bind(this)}>
                                    {!data.license_code ? '请输入号码' :
                                        <span className="text-muted">{data.license_code.substring(0, 8)+'···'}</span>
                                    }
                                </a>
                                <i className="more-icon">
                                </i>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>企业名称<i className="text-orange">*</i></label>
                                <input type="text" placeholder="企业名称必须为营业执照名称的全称" value={data.license_name}
                                       onChange={this.changeHandle.bind(this, 'license_name')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>企业经营所在地区<i className="text-orange">*</i></label>
                                <a className="bd" onClick={this.residentArea.bind(this)}>
                                    {!data.license_area || !this.state.areaArr ? '请选择您的现居住地' :
                                        <span className="text-muted">
                                                {this.state.areaArr.province[data.license_area.province_id]}
                                            {this.state.areaArr.city[data.license_area.province_id][data.license_area.city_id]}
                                            {this.state.areaArr.county[data.license_area.province_id][data.license_area.city_id][data.license_area.county_id]}
                                            </span>}
                                </a>
                                <i className="more-icon">
                                </i>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>详细地址<i className="text-orange">*</i></label>
                                <input type="text" placeholder="请输入详细地址" value={data.license_address}
                                       onChange={this.changeHandle.bind(this, 'license_address')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>企业电话 (固话)</label>
                                <input type="text" placeholder="请输区号+座机号" value={data.enterprise_tel}
                                       onChange={this.changeHandle.bind(this, 'enterprise_tel')}/>
                            </div>
                            <hr/>
                            <div className="cell">
                                <label>企业电话 (手机)</label>
                                <input type="text" placeholder="请输入企业电话（手机）" value={data.enterprise_mobile}
                                       onChange={this.changeHandle.bind(this, 'enterprise_mobile')}/>
                            </div>
                        </div>
                        <h5 className="agreement-register"><i className={data.agree_deal == 1 ? 'icon checked-fill' : 'icon checked'} onClick={this.setAgree.bind(this)}>
                        </i>我已阅读并同意
                            <Link to="personal/work/article/authorization-qiye"><a className="agreement">《授权确认书(企业版)》</a></Link>
                        </h5>
                        <div className="sub-btn">{this.createBtn()}</div>
                    </div>
                </div>
                {this.props.children && React.cloneElement(this.props.children, data)}
            </div>
        );
    }
}

export default WorkInfo;