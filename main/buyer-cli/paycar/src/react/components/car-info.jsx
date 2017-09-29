/*
* 车辆信息
* */

import React from 'react';

class CarInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: null,
            time: [],
            date: [],
            markedId: null
        };
        this.createCarInfo = this.createCarInfo.bind(this);
        this.createCarTime = this.createCarTime.bind(this);
        this.createTimeBar = this.createTimeBar.bind(this);
        this.createTimeArr = this.createTimeArr.bind(this);
    }

    componentWillMount() {
        let date = [], time = [], hours = new Date().getHours(),
            initI = hours <= 17 ? 0 : 1;

        for(var i = initI ; i < 3 ; i++) {
            let newDate = H.GetDateStr(i);
            date.push({
                key: newDate.time1,
                value: i == 0 ? '今天' : newDate.time2
            });
        }

        for(var k = 7 ; k <= 17 ; k++) {
            let p = k < 12 ? '上午' : '下午';
            if(initI == 0) {
                if(k >= hours) {
                    time.push({
                        key: p + k + '-' + (k+1) + '点',
                        value: k + '点过'
                    });
                }
            }else{
                time.push({
                    key: p + k + '-' + (k+1) + '点',
                    value: k + '点过'
                });
            }
        }
        this.setState({time: time, date: date});
    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }
    createTimeArr(obj) {
        let time = [], hours = new Date().getHours();
        for(var k = 7 ; k <= 17 ; k++) {
            let p = k < 12 ? '上午' : '下午';
            if(obj.value == '今天'){
                if(k >= hours) {
                    time.push({
                        key: p + k + '-' + (k+1) + '点',
                        value: k + '点过'
                    });
                }
            }else{
                time.push({
                    key: p + k + '-' + (k+1) + '点',
                    value: k + '点过'
                });
            }
        }
        return time;
    }

    createCarInfo() {
        let carInfo = this.props.data.voiture_info,
            xml = [];
        for(let i in carInfo) {
            let obj = carInfo[i];
            xml.push(
                <div className="body-cell flex-box center" key={i} onClick={this.changeCarInfo.bind(this, i, obj)}>
                    <div>
                        {obj.market_name}
                    </div>
                    <div className="after-text">{obj.voiture_location} {obj.license_plates} {obj.driver_tel}</div>
                    <i className="after-more"></i>
                </div>
            );
        }

        return (
            <section className="section-item">
                <div className="header-cell flex-box">
                    <div className="flex-num1">车辆信息</div>
                </div>
                {xml}
            </section>
        );
    }

    //车辆到达时间更改;
    changeCarInfo(marketId, obj) {
        H.sheet({
            title: obj.market_name + '车辆信息',
            content: '<div class="actionsheet_cell read-only">' +
            '<div class="actionsheet_item center"><span class="label">装货位置：</span>' +
            '<input id="licenseCarInfo" class="input flex-num1" value="'+obj.voiture_location+'" type="text" placeholder="请填写车辆停放位置" /></div>'+
            '<div class="actionsheet_item center"><span class="label">车牌号：</span>' +
            '<input id="platesCarInfo" class="input flex-num1" value="'+obj.license_plates+'" type="text" placeholder="请填写车牌号" /></div>'+
            '<div class="actionsheet_item center"><span class="label">司机电话：</span>' +
            '<input id="phoneCarInfo" class="input flex-num1" value="'+obj.driver_tel+'" type="tel" placeholder="请填写司机电话" /></div>'+
            '</div>',
            cancel: '关闭',
            confirmCallback: () => {
                let data = this.props.data,
                    license = $('#licenseCarInfo').val(),
                    plates = $('#platesCarInfo').val(),
                    phone = $('#phoneCarInfo').val();
                if(license != '' && plates != '' && phone != '') {
                    data.voiture_info[marketId].voiture_location = license;
                    data.voiture_info[marketId].license_plates = plates;
                    data.voiture_info[marketId].driver_tel = phone;
                    this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
                    H.hideSheet();
                }else {
                    H.operationState('请填写完整收货信息');
                }
            }
        });
    }

    //选择车辆时间;
    selectTime(markedId, obj) {
        this.setState({markedId: markedId}, () => {
            this.createTimeBar(obj);
        });
    }

    //创建时间选择工具;
    createTimeBar(obj) {
        var str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="provincePicker"></div></div>' +
            '<div class="region-picker"><div id="cityPicker"></div></div>';
        H.picker(str, obj.market_name+'车辆到达时间');
        var up, up1,
            data = this.props.data,
            dateData = this.state.date[0],
            timeData = this.state.time[0],
            date = this.state.date,
            time = this.state.time,
            dateId = 0,
            timeId = 0;
        if(data.voiture_info[this.state.markedId].dateId) {
            for(var i = 0 ; i < date.length ; i++) {
                if(data.voiture_info[this.state.markedId].dateId.key == date[i].key) {
                    dateId = i;
                    dateData = date[i];
                    break;
                }
            }
            time = this.createTimeArr(dateData);
        }

        if(data.voiture_info[this.state.markedId].timeId) {
            for(var i = 0 ; i < time.length; i++) {
                if(data.voiture_info[this.state.markedId].timeId.key == time[i].key) {
                    timeId = i;
                    timeData = time[i];
                    break;
                }
            }
        }
        up = UIPickerView.createPickerView({
            dataSource: date,
            id: 'provincePicker',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                dateData = data;
                time = this.createTimeArr(data);
                timeData = time[0];
                up1.UPRender(time);
            }
        });
        up1 = UIPickerView.createPickerView({
            dataSource: time,
            id: 'cityPicker',
            constraintsId: 'wower1',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                timeData = data;
            }
        });

        up.UPSelectRowIndexPath(parseInt(dateId) + 1).UPThen(function(indexPath, value) {
            dateData = value;
        });

        up1.UPSelectRowIndexPath(parseInt(timeId) + 1).UPThen(function(indexPath, value) {
            timeData = value;
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
            data.voiture_info[this.state.markedId].arrive_time = dateData.key + ' ' + timeData.key;
            data.voiture_info[this.state.markedId].dateId = dateData;
            data.voiture_info[this.state.markedId].timeId = timeData;
            this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
            animaed.removeEvent();
        });

        this.setState({option: animaed}, () => {
            this.state.option.start();
        });
    }

    //生成车辆到达时间;
    createCarTime() {
        let carInfo = this.props.data.voiture_info,
            xml = [];
        for(let i in carInfo) {
            let obj = carInfo[i];
            xml.push(
                <div className="body-cell flex-box" key={i} onClick={this.selectTime.bind(this, i, obj)}>
                    <div className="flex-num1">
                        {obj.market_name}
                    </div>
                    <i className="after-more">{obj.arrive_time ? obj.arrive_time : '请选择车辆到达时间'}</i>
                </div>
            );
        }

        return (
            <section className="section-item">
                <div className="header-cell flex-box">
                    <div className="flex-num1">车辆到达时间</div>
                </div>
                {xml}
            </section>
        );
    }

    render() {
        return (
            <div>
                {this.createCarInfo()}
                {this.createCarTime()}
            </div>
        );
    }
}

export default CarInfo;