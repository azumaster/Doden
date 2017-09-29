import React from 'react';

class TakeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: [],  //省数据;
            city: [],  //市数据;
            county: [],  //县数据;
            provinceId: null,  //省ID
            cityId: null,  //市ID
            countyId: null,  //县ID,
            option: null,
            areaData: null  //选择器对象;
        };
        this.createTimeBar = this.createTimeBar.bind(this);
        this.areaState = this.areaState.bind(this);
        this.changeCity = this.changeCity.bind(this);
        this.changeCounty = this.changeCounty.bind(this);
        this.showOption = this.showOption.bind(this);
        this.getAreaData = this.getAreaData.bind(this);
        this.changeTakeInfo = this.changeTakeInfo.bind(this);
    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    getAreaData() {
        //获取城市信息;
        H.we_loading.show();
        H.server.other_area_list({}, (res) => {
            if(res.code == 0) {
                this.setState({areaData: res.data}, () => {
                    this.areaState();
                });
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    //生成当前地区的数据;
    areaState() {
        let take = this.props.data.take_info,
            area = this.state.areaData,
            province_id = 0,
            city_id = take.city_id,
            county_id = take.county_id,
            provinceArr = area.provinces,
            cityArr = area.citys[take.province_id] ? area.citys[take.province_id] : [{key: -1, value: '无'}],
            countyArr = [];
        for(var i in provinceArr) {
            if(take.province_id == provinceArr[i].key) {
                province_id = i;
            }
        }
        if(area.countys[take.province_id]) {
            countyArr = area.countys[take.province_id][city_id] ? area.countys[take.province_id][city_id] : [{key: -1, value: '无'}];
        }else {
            countyArr = [{key: -1, value: '无'}];
        }
        this.setState({
            province: provinceArr,
            city: cityArr,
            county: countyArr,
            provinceId: province_id,
            cityId: city_id,
            countyId: county_id
        }, () => {
            this.changeTakeInfo();
        });
    }

    changeCity(data) {
        let area = this.state.areaData,
            cityArr = area.citys[data.key] ? area.citys[data.key] : [{key: -1, value: '无'}];
        this.setState({city: cityArr});
        return cityArr;
    }

    changeCounty(province, city) {
        let area = this.state.areaData,
            countyArr = [],
            province_id = province.key,
            city_id = city.key;
        if(area.countys[province_id]) {
            countyArr = area.countys[province_id][city_id] ? area.countys[province_id][city_id] : [{key: -1, value: '无'}];
        }else {
            countyArr.push({key: -1, value: '无'});
        }
        this.setState({county: countyArr});
        return countyArr;
    }

    //创建城市选择工具;
    createTimeBar() {
        var str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="provincePicker"></div></div><div class="region-picker"><div id="cityPicker"></div>'+
            '</div><div class="region-picker"><div id="areaPicker"></div></div>';
        H.picker(str, '选择地区');
        var provinceData, cityData, countyData, up, up1, up2,
            province = this.state.province,
            city = this.state.city,
            county = this.state.county;
        up = UIPickerView.createPickerView({
            dataSource: province,
            id: 'provincePicker',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                city = this.changeCity(data);
                up1.UPRender(city);
                up1.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    cityData = value;
                });
                county = this.changeCounty(data, city[0]);
                up2.UPRender(county);
                up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    countyData = value;
                });
                provinceData = data;
            }
        });
        up1 = UIPickerView.createPickerView({
            dataSource: city,
            id: 'cityPicker',
            constraintsId: 'wower1',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                county = this.changeCounty(provinceData, data);
                up2.UPRender(county);
                up2.UPSelectRowIndexPath(1).UPThen(function(indexPath, value) {
                    countyData = value;
                });
                cityData = data;
            }
        });
        up2 = UIPickerView.createPickerView({
            dataSource: county,
            id: 'areaPicker',
            constraintsId: 'wower3',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                this.setState({countyId: data.key});
                countyData = data;
            }
        });

        up.UPSelectRowIndexPath(parseInt(this.state.provinceId) + 1).UPThen(function(indexPath, value) {
            provinceData = value;
        });
        up1.UPSelectRowIndexPath(parseInt(this.state.cityId) == -1 ? 1 : parseInt(this.state.cityId) + 1).UPThen(function(indexPath, value) {
            cityData = value;
        });
        up2.UPSelectRowIndexPath(parseInt(this.state.countyId) == -1 ? 1 : parseInt(this.state.countyId) + 1).UPThen(function(indexPath, value) {
            countyData = value;
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
            $('#picker_mask').hide();
            animaed.finish();
            let p_id = 0;
            for(var i in this.state.province) {
                if(provinceData.key == this.state.province[i].key) {
                    p_id = i;
                }
            }
            this.setState({
                provinceId: p_id,
                cityId: cityData.key,
                countyId: countyData.key
            }, () => {
                $('#city-value').html(cityData.value);
                $('#county-value').html(countyData.value);
            });
            animaed.removeEvent();
        });

        this.setState({option: animaed}, () => {
            this.state.option.start();
        });
    }

    showOption() {
        this.createTimeBar();
    }

    changeTakeInfo() {
        let take = this.props.data.take_info,
            cityData = this.state.city[this.state.cityId].value,
            countyData = this.state.countyId == -1 ? '无' : this.state.county[this.state.countyId].value;

        H.sheet({
            title: '收货地址',
            content: '<div class="actionsheet_cell read-only">'+
            '<div class="actionsheet_item center"><span class="label" style="width: 3em;">市县：</span>'+
            '<div class="flex-num1"><div class="flex-box">' +
            '<span id="city-value" class="input city-value" style="margin-right: 15px;">'+cityData+'</span>' +
            '<span id="county-value" class="input county-value">'+countyData+'</span>' +
            '</div></div></div>'+
            '<div class="actionsheet_item center"><span class="label" style="width: 3em;">地址：</span>' +
            '<input id="address" class="input flex-num1" value="'+take.address+'" type="text" placeholder="请填写详细地址" /></div>'+
            '<div class="actionsheet_item center"><span class="label" style="width: 3em;">电话：</span>' +
            '<input id="phone" class="input flex-num1" value="'+take.phone+'" type="text" placeholder="请填写收货电话" /></div>'+
            '</div>',
            confirmCallback: () => {
                let data = this.props.data,
                    address = $('#address').val(),
                    phone = $('#phone').val();
                if(address != '' && H.isPhone(phone)) {
                    data.take_info.address = address;
                    data.take_info.phone = phone;
                    data.take_info.province_id = this.state.province[this.state.provinceId].key;
                    data.take_info.city_id = this.state.cityId;
                    data.take_info.county_id = this.state.countyId;
                    data.take_info.province_name = this.state.province[this.state.provinceId].value;
                    data.take_info.city_name = this.state.city[this.state.cityId].value;
                    data.take_info.county_name = this.state.countyId == -1 ? '' : this.state.county[this.state.countyId].value;
                    this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
                    H.hideSheet();
                }
            }
        });
        $('.city-value, .county-value').click(() => {
            this.showOption();
        });
    }

    takeInfo() {
        if(this.state.areaData) {
            this.changeTakeInfo();
        }else {
            this.getAreaData();
        }
    }

    render() {
        let take = this.props.data.take_info;
        return (
            <section className="section-item">
                <div className="header-cell flex-box">
                    <div className="flex-num1">收货信息<span className="aside-info">{!this.props.operation ? '(运费到付)' : ''}</span></div>
                </div>
                <div className="body-cell flex-box center" onClick={this.takeInfo.bind(this)}>
                    <div className="flex-num1">
                        <p>{take.province_name} {take.city_name} {take.county_name}</p>
                        <p>{take.address}</p>
                        <p>{take.contacts} tel:{take.phone}</p>
                    </div>
                    <div><i className="after-more big-after-more"></i></div>
                </div>
            </section>
        );
    }
}

export default TakeInfo;