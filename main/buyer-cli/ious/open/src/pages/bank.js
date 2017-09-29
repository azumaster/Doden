/*
* xy 2017.06.15
* 银行卡信息
* */

class Bank extends React.Component {
    constructor(props) {
        super(props);
        //生成信用卡有效期年的数组;
        const year = new Date().getFullYear(),
            arr = [];
        for(let i = year ; i < year+10 ; i++) {
            let code = (i+'').substring(2);
            arr.push({code: code, name: i+'年'});
        }

        this.state = {
            data: props.data.bank_data || {},
            bankArr: [],
            yearArr: arr,
            areaArr: null,      //所有地区列表;
            provinceId: [],       //省数据;
            cityId: [],           //当前省下面的所有市;
            monthArr: [{code: '01', name: '01月'}, {code: '02', name: '02月'}, {code: '03', name: '03月'}, {code: '04', name: '04月'},
                {code: '05', name: '05月'}, {code: '06', name: '06月'}, {code: '07', name: '07月'}, {code: '08', name: '08月'},
                {code: '09', name: '09月'}, {code: '10', name: '10月'}, {code: '11', name: '11月'}, {code: '12', name: '12月'} ]
        };
    }

    componentWillMount() {
        this.getBankCode();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data.bank_data || {}});
    }

    componentDidMount() {
        this.createScroll();
    }

    //获取开户行数据;
    getBankCode() {
        $.loading.show();
        $.req.getBankCode({}, (res) => {
            if(res.code == 0) {
                this.setState({bankArr: res.data});
            }else {
                $.toast({icon: 'info', text: res.message});
            }
            $.req.getArea({}, (res) => {
                $.loading.hide();
                if(res.code == 0) {
                    let area = res.data,
                        provinceId = 0,       //省数据;
                        cityId = 0,          //当前省下面的所有市;
                        data = this.state.data;          //当前的所有区县;
                    if(data.open_bank_province || data.open_bank_city) {
                        provinceId = data.province_id;
                        cityId = data.city_id;
                    }else {
                        for(let i in area.province) {
                            provinceId = i;
                            break;
                        }
                        for(let k in area.city[provinceId]) {
                            cityId = k;
                            break;
                        }
                    }
                    this.setState({
                        areaArr: res.data, provinceId: provinceId, cityId: cityId
                    });
                }else {
                    $.toast({icon: 'info', text: res.message});
                }
            });
        });
    }

    createScroll(){
        var wrapper = document.getElementById('bankPage'),
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
    changeHandle(type, key, e) {
        let data = this.state.data,
            val = e.target.value;
        data[type] = data[type] || {};
        data[type][key] = val;
        this.setState({data: data});
    }

    saveBank() {
        let data = this.state.data;
        if(data.debit_card) {
            if(data.debit_card.card_number && data.debit_card.bank_code && data.debit_card.mobile_code) {
                $.req.bankCard({bank_data: data}, (res) => {
                    if(res.code == 0) {
                        $.toast({text: '保存成功'});
                        this.props.getApplyData(1);
                    }else {
                        $.toast({icon: 'info', text: res.message});
                    }
                });
            }else {
                $.toast({icon: 'info', text: '借款/还款银行信息必须填写完整'});
            }
        }else {
            $.toast({icon: 'info', text: '借款/还款银行信息必须填写完整'});
        }
    }

    //选择发卡行 ;
    chooseBank(type) {
        let data = this.state.data;
        data[type] = data[type] || {};
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="Picker1"></div></div>', up, current = 0, key = data[type].bank_code,
            arr = this.state.bankArr;
        for(let i = 0 ; i < arr.length ; i++) {
            if(arr[i].code == key) {
                current = i;
            }
        }

        $.picker(str, '选择开户行', () => {
            let data = this.state.data;
            data[type].bank_code = key;
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

    //选择有效日期;
    chooseDate() {
        let data = this.state.data,
            credit_card = data.credit_card || {};
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="yearDate"></div></div><div class="region-picker"><div id="monthDate"></div></div>',
            up, up1, yearCurrent = 0, monthCurrent = 0, yearArr = this.state.yearArr, monthArr = this.state.monthArr,
            dateTime = credit_card.valid_time ? credit_card.valid_time.split('/') : [0, 0], yearKey = dateTime[1], monthKey = dateTime[0];
        for(let i = 0 ; i < yearArr.length ; i++) {
            if(yearArr[i].code == yearKey) {
                yearCurrent = i;
            }
        }
        for(let i = 0 ; i < monthArr.length ; i++) {
            if(monthArr[i].code == monthKey) {
                monthCurrent = i;
            }
        }

        $.picker(str, '选择有效期', () => {
            credit_card.valid_time = monthKey + '/' + yearKey;
            data.credit_card = credit_card;
            this.setState({data: data});
        });
        up = UIPickerView.createPickerView({
            dataSource: yearArr,
            id: 'yearDate',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                yearKey = data.code;
            }
        });
        up1 = UIPickerView.createPickerView({
            dataSource: monthArr,
            id: 'monthDate',
            constraintsId: 'wower1',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                monthKey = data.code;
            }
        });
        up.UPSelectRowIndexPath(yearCurrent + 1).UPThen(function(indexPath, value) {
            yearKey = value.code;
        });
        up1.UPSelectRowIndexPath(monthCurrent + 1).UPThen(function(indexPath, value) {
            monthKey = value.code;
        });
    }

    //选择开户行地区;
    residentArea() {
        let area = this.state.areaArr;

        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="Picker1"></div></div><div class="region-picker"><div id="Picker2"></div></div>',
            up, up1, province = 0, city = 0,
            provinceArr = [], cityArr = [], provinceId = this.state.provinceId, cityId = this.state.cityId;
        //先生成三个数组;

        let provinceData = [],
            cityData = [];    //在area数组中取出当前省下面的城市;

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

        setProvince();
        setCity();

        $.picker(str, '选择您的现居住地', () => {
            let data = this.state.data;
            data.debit_card.open_bank_province = provinceId;
            data.debit_card.open_bank_city = cityId;
            this.setState({data: data, provinceId: provinceId, cityId: cityId}, () => {
                console.log(this.state.provinceId);
            });
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
            }
        });
        up1.UPSelectRowIndexPath(city + 1).UPThen(function(indexPath, value) {
            cityId = value.code;
        });
    }

    //生成按钮;
    createBtn() {
        let data = this.state.data.debit_card || {};
        if(data.bank_code && data.card_number && data.mobile_code && data.open_bank_province && data.open_bank_city && data.open_bank_branch) {
            return (
                <button className="btn btn-primary btn-full" onClick={this.saveBank.bind(this)}>保存</button>
            );
        }else {
            return (
                <button className="btn btn-primary btn-full" disabled>保存</button>
            );
        }
    }

    render() {
        let data = this.state.data,
            debit_card = data.debit_card || {},
            credit_card = data.credit_card || {},
            arr = this.state.bankArr,
            debit_card_name = '', credit_card_name = '';
        for(let i = 0 ; i < arr.length ; i++) {
            if(arr[i].code == debit_card.bank_code) debit_card_name = arr[i].name;
            if(arr[i].code == credit_card.bank_code) credit_card_name = arr[i].name;
        }
        return (
            <div id="bankPage" className="bank-page">
                <div className="scroller">
                    <h4 className="plate-hd">借款/还款银行卡信息 <span className="text-orange">(必填)</span></h4>
                    <div className="plate-bd">
                        <div className="cell">
                            <label>借记卡卡号<i className="text-orange">*</i></label>
                            <input type="tel" placeholder="请输入卡号" value={debit_card.card_number}
                                   onChange={this.changeHandle.bind(this, 'debit_card', 'card_number')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>发卡行<i className="text-orange">*</i></label>
                            <a className="bd" onClick={this.chooseBank.bind(this, 'debit_card')}>
                                {!debit_card.bank_code ? '请选择发卡行' : <span className="text-muted">{debit_card_name}</span>}
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>银行预留手机号<i className="text-orange">*</i></label>
                            <input type="tel" placeholder="请输入手机号码" value={debit_card.mobile_code}
                                   onChange={this.changeHandle.bind(this, 'debit_card', 'mobile_code')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>开户行地区<i className="text-orange">*</i></label>
                            <a className="bd" onClick={this.residentArea.bind(this)}>
                                {!debit_card.open_bank_province || !this.state.areaArr ? '请选择开户行地区' :
                                    <span className="text-muted">
                                        {this.state.areaArr.province[debit_card.open_bank_province]}
                                        {this.state.areaArr.city[debit_card.open_bank_province][debit_card.open_bank_city]}
                                    </span>
                                }
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>开户行名称<i className="text-orange">*</i></label>
                            <input type="text" placeholder="请输入开户行名称" value={debit_card.open_bank_branch}
                                   onChange={this.changeHandle.bind(this, 'debit_card', 'open_bank_branch')}/>
                        </div>
                    </div>
                    <h4 className="plate-hd">信用卡信息  <span className="text-orange">(非必填，若填写，可提高额度)</span></h4>
                    <div className="plate-bd">
                        <div className="cell">
                            <label>信用卡卡号</label>
                            <input type="tel" placeholder="请输入卡号" value={credit_card.card_number}
                                   onChange={this.changeHandle.bind(this, 'credit_card', 'card_number')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>发卡行</label>
                            <a className="bd" onClick={this.chooseBank.bind(this, 'credit_card')}>
                                {!credit_card.bank_code ? '请选择发卡行' : <span className="text-muted">{credit_card_name}</span>}
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>银行预留手机号</label>
                            <input type="tel" placeholder="请输入手机号码" value={credit_card.mobile_code}
                                   onChange={this.changeHandle.bind(this, 'credit_card', 'mobile_code')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>信用卡额度</label>
                            <input type="tel" placeholder="请输入金额" value={credit_card.limit}
                                   onChange={this.changeHandle.bind(this, 'credit_card', 'limit')}/> <span style={{lineHeight: '23px'}}>元</span>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>有效期</label>
                            <a className="bd" onClick={this.chooseDate.bind(this)}>
                                {!credit_card.valid_time ? '月份 / 年份' : <span className="text-muted">{credit_card.valid_time}</span>}
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                    </div>
                    <div className="sub-btn">{this.createBtn()}</div>
                </div>
            </div>
        );
    }
}

export default Bank;