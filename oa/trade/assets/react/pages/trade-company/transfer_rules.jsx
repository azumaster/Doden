class TransferRules extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areas: {
                provinces: [],
                citys: [],
                countys: {}
            },
            shopType: [],
            provincesVal: -1,
            cityVal: -1,
            countyVal: -1,
            data: null,
            time: [
                {text: '凌晨0点', res: '00:00:00'},
                {text: '凌晨1点', res: '01:00:00'},
                {text: '凌晨2点', res: '02:00:00'},
                {text: '凌晨3点', res: '03:00:00'},
                {text: '凌晨4点', res: '04:00:00'},
                {text: '凌晨5点', res: '05:00:00'},
                {text: '早上6点', res: '06:00:00'},
                {text: '早上7点', res: '07:00:00'},
                {text: '早上8点', res: '08:00:00'},
                {text: '上午9点', res: '09:00:00'},
                {text: '上午10点', res: '10:00:00'},
                {text: '上午11点', res: '11:00:00'},
                {text: '中午12点', res: '12:00:00'}
            ],
            week: [
                {text: '周一', res: '1'},
                {text: '周二', res: '2'},
                {text: '周三', res: '3'},
                {text: '周四', res: '4'},
                {text: '周五', res: '5'},
                {text: '周六', res: '6'},
                {text: '周天', res: '7'}
            ],
            timeVal: 0,
            checkArr: [],
            restDay: []
        };
    }

    selChange(s, e) {
        let data = this.state.data,
            val = parseInt(e.target.value);
        if(s == 1) {
            data.province_id = val;
            data.city_id = -1;
            data.county_id = -1;
        }else if(s == 2) {
            data.city_id = val;
            data.county_id = -1;
        }else if(s == 3) {
            data.county_id = val;
        }else if(s == 4) {
            data.abort_time = this.state.time[val].res;
        }
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    componentWillMount() {
        let areas = this.props.areas,
            val = this.props.val,
            shopType = this.props.shopType;
        this.setState({
            areas: {
                provinces: areas.provinces,
                citys: val.province_id == -1 ? [] : areas.citys[val.province_id],
                countys: areas.countys[val.province_id] ?
                    areas.countys[val.province_id][val.city_id] : []
            },
            shopType: shopType,
            provincesVal: val.province_id,
            cityVal: val.city_id,
            countyVal: val.county_id,
            restDay: val.rest_day == '' ? [] : val.rest_day.split(','),
            data: val,
            timeVal: this.calculateTime(val.abort_time),
            checkArr: val.shop_types == '' ? [] : val.shop_types.split(',')
        });
    }

    componentWillReceiveProps(nextProps) {
        let areas = nextProps.areas,
            val = nextProps.val,
            shopType = this.props.shopType;
        this.setState({
            areas: {
                provinces: areas.provinces,
                citys: areas.citys[val.province_id] ? areas.citys[val.province_id] : [],
                countys: (areas.countys[val.province_id] && val.city_id != -1) ?
                    areas.countys[val.province_id][val.city_id] : []
            },
            shopType: shopType,
            provincesVal: val.province_id,
            cityVal: val.city_id,
            countyVal: val.county_id,
            restDay: val.rest_day == '' ? [] : val.rest_day.split(','),
            data: val,
            timeVal: this.calculateTime(val.abort_time),
            checkArr: val.shop_types == '' ? [] : val.shop_types.split(',')
        });
    }

    //添加配送费;
    addFees() {
        let data = this.state.data;
        data.fees_rules.push({
            'from_min_amount': 0,
            'to_max_amount': 0,
            'freight_amount': 0
        });
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //删除配送费;
    delFess() {
        let data = this.state.data,
            length = data.fees_rules.length;
        data.fees_rules.splice(length-1, 1);
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //配送费规则输入;
    fessChange(index, state, e) {
        let data = this.state.data,
            val = e.target.value * 100;
        if(state == 1) {
            data.fees_rules[index].from_min_amount = val;

        }else if(state == 2) {
            data.fees_rules[index].to_max_amount = val;
        }else if(state == 3) {
            data.fees_rules[index].freight_amount = val;
        }
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //免运费、单笔封顶减、货到付款;
    paymentFree(state, e) {
        let data = this.state.data,
            val = e.target.value;
        if(state == 1) {
            data.free_freight_order_time = val;
        }else if(state == 2) {
            data.free_freight_max_amount = val * 100;
        }else if(state == 3) {
            data.payment_after_arrival_time = val;
        }else if(state == 4) {
            data.delivery_date_rule = val;
        }else if(state == 5) {
            data.delivery_time = val;
        }else if(state == 6) {
            data.freight_min_amount = val * 100;
        }
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //计算截单时间当前值在基本数据中的index;
    calculateTime(time) {
        let arr = this.state.time;
        for(let i in arr) {
            if(arr[i].res == time) {
                return i;
            }
            if(i == arr.length - 1) {
                return 0;
            }
        }
    }

    //用户类型变动;
    checkChange(tag, e) {
        let val = e.target.checked,
            data = this.state.data,
            checkArr = this.state.checkArr;
        if(val){
            checkArr.push(tag + '');
        }else {
            let index = checkArr.indexOf(tag + '');
            checkArr.splice(index, 1);
        }
        data.shop_types = checkArr.join(',');
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //休息时间选择;
    checkChangeWeek(tag, e) {
        let val = e.target.checked,
            data = this.state.data,
            checkArr = this.state.restDay;
        if(val){
            checkArr.push(tag);
        }else {
            let index = checkArr.indexOf(tag);
            checkArr.splice(index, 1);
        }
        data.rest_day = checkArr.join(',');
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    //修改运费规则;
    changeFeesType(e) {
        let val = e.target.value,
            data = this.state.data;
        data.fees_rule_type_id = val;
        this.props.dataRecord && this.props.dataRecord(this.props.index, data);
    }

    render() {
        let val = this.state.data,
            xml = '',
            addBtn = '';
        if(this.props.index == 0) {
            if(this.props.length == 0) {
                addBtn = (
                    <div className="add-del-btn">
                        <i onClick={this.props.addRuleHandler}>+</i>
                    </div>
                );
            }else {
                addBtn = (
                    <div className="add-del-btn">
                        <i onClick={this.props.delRuleHandler.bind(this, this.props.index)}>-</i>
                    </div>
                );
            }
        }else if(this.props.index == this.props.length) {
            addBtn = (
                <div className="add-del-btn">
                    <i onClick={this.props.addRuleHandler}>+</i>
                    <i onClick={this.props.delRuleHandler.bind(this, this.props.index)}>-</i>
                </div>
            );
        }else {
            addBtn = (
                <div className="add-del-btn">
                    <i onClick={this.props.delRuleHandler.bind(this, this.props.index)}>-</i>
                </div>
            );
        }
        if(val) {
            xml = (
                <ul>
                    <li>
                        <label>用户地区：</label>
                        <div className="item-right">
                            <select id={'provinces_sel_' + this.props.index} value={this.state.provincesVal} onChange={this.selChange.bind(this, 1)}>
                                <option value="-1">全部</option>
                                {
                                    this.state.areas.provinces.map((value, index) => {
                                        return (<option key={index} value={value.key}>{value.value}</option>);
                                    })
                                }
                            </select>
                            <select id={'city_sel_' + this.props.index} value={this.state.cityVal} onChange={this.selChange.bind(this, 2)}>
                                <option value="-1">全部</option>
                                {
                                    this.state.areas.citys.map((value, index) => {
                                        return (<option key={index} value={value.key}>{value.value}</option>);
                                    })
                                }
                            </select>
                            <select id={'county_sel_' + this.props.index} value={this.state.countyVal} onChange={this.selChange.bind(this, 3)}>
                                <option value="-1">全部</option>
                                {
                                    this.state.areas.countys.map((value, index) => {
                                        return (<option key={index} value={value.key}>{value.value}</option>);
                                    })
                                }
                            </select>
                        </div>
                    </li>
                    <li style={{lineHeight: '30px', whiteSpace: 'nowrap'}}>
                        <label>用户类型：</label>
                        <div className="item-right">
                            {
                                this.state.shopType.map((value, index) => {
                                    let checkboxXml = '';
                                    if(this.state.checkArr.indexOf(value.type_tag + '') != -1) {
                                        checkboxXml = (
                                            <input id={value.type_tag + '' + this.props.index}
                                                   type="checkbox" checked
                                                   onChange={this.checkChange.bind(this, value.type_tag)}
                                            />
                                        );
                                    }else {
                                        checkboxXml = (
                                            <input id={value.type_tag + '' + this.props.index}
                                                   type="checkbox"
                                                   onChange={this.checkChange.bind(this, value.type_tag)}
                                            />);
                                    }
                                    return (
                                        <span key={index} className="checkboxs">
                                            {checkboxXml}
                                            <label htmlFor={value.type_tag + '' + this.props.index}>{value.type_name}</label>
                                        </span>
                                    );
                                })
                            }
                        </div>
                    </li>
                    <li><label style={{width: '100px'}}>配送费规则：</label>
                        <div className="item-right">
                            {
                                this.props.tradeFeesList.map((value, index) => {
                                    let bool = false,
                                        id = val.fees_rule_type_id;
                                    if(!id && index == 0) {
                                        bool = true;
                                    }else {
                                        if(id == value.id) {
                                            bool = true;
                                        }
                                    }
                                    return (
                                        <label style={{lineHeight: '1'}} className="radio-inline" key={index} >
                                            <input style={{top: '-3px'}} type="radio" value={value.id} name={'feesType' + this.props.index}
                                                   checked={bool} onChange={this.changeFeesType.bind(this)}/>{value.fees_type}
                                        </label>
                                    );
                                })
                            }
                        </div>
                    </li>
                    <li>
                        <label>配送费：</label>
                        <div className="item-right">
                            {
                                val.fees_rules.map((value, index) => {
                                    let addXml = '',
                                        way = val.fees_rule_type_id == 1 ? '元' : 'kg';
                                    if(index == 0) {
                                        addXml = (<i onClick={this.addFees.bind(this)}>+</i>);
                                    }else if(index == 1) {
                                        addXml = (<i onClick={this.delFess.bind(this)}>-</i>);
                                    }
                                    return (
                                        <div key={index}>单件：
                                            <span className="input-box"><input type="text" value={value.from_min_amount/100} onChange={this.fessChange.bind(this, index, 1)} />{way}</span>
                                            <span className="to">——</span>
                                            <span className="input-box rightBig"><input type="text" value={value.to_max_amount/100} onChange={this.fessChange.bind(this, index, 2)} />{way}</span>
                                            收：<span className="input-box"><input type="text" value={value.freight_amount/100} onChange={this.fessChange.bind(this, index, 3)} />元</span>{addXml}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </li>
                    <li>
                        <div className="front">
                            <label>免运费：</label>
                            前：<span className="input-box"><input type="text" value={val.free_freight_order_time} onChange={this.paymentFree.bind(this, 1)} />单</span>
                        </div>
                        <div className="front">
                            <label style={{width: '84px'}}>单笔封顶减：</label>
                            <span className="input-box"><input type="text" value={val.free_freight_max_amount/100} onChange={this.paymentFree.bind(this, 2)} />元</span>
                        </div>
                        <div className="front">
                            <label>货到付款：</label>
                            前：<span className="input-box"><input type="text" value={val.payment_after_arrival_time} onChange={this.paymentFree.bind(this, 3)} />单</span>
                        </div>
                        <div className="front">
                            <label style={{width: '84px'}}>最低运费：</label>
                            <span className="input-box"><input type="text" value={val.freight_min_amount/100} onChange={this.paymentFree.bind(this, 6)} />元</span>
                        </div>
                    </li>
                    <li>
                        <label>截单时间：</label>
                        <div className="item-right">
                            <select value={this.state.timeVal} onChange={this.selChange.bind(this, 4)}>
                                {
                                    this.state.time.map((value, index) => {
                                        return (<option key={index} value={index}>{value.text}</option>);
                                    })
                                }

                            </select>
                        </div>
                    </li>
                    <li>
                        <label>送达时间：</label>
                        <div className="item-right">
                            T + <span className="input-box"><input type="text" value={val.delivery_date_rule} onChange={this.paymentFree.bind(this, 4)} />天</span>
                            <input className="input-time" type="text" value={val.delivery_time} onChange={this.paymentFree.bind(this, 5)} />
                        </div>
                    </li>
                    <li>
                        <label>休息时间：</label>
                        <div className="item-right">
                            {
                                this.state.week.map((value, index) => {
                                    let checkboxXml = '';
                                    if(this.state.restDay.indexOf(value.res) != -1) {
                                        checkboxXml = (
                                            <input id={value.res + '' + this.props.index}
                                                   type="checkbox" checked
                                                   onChange={this.checkChangeWeek.bind(this, value.res)}
                                            />
                                        );
                                    }else {
                                        checkboxXml = (
                                            <input id={value.res + '' + this.props.index}
                                                   type="checkbox"
                                                   onChange={this.checkChangeWeek.bind(this, value.res)}
                                            />);
                                    }
                                    return (
                                        <span key={index} className="week-checkbox">
                                            {checkboxXml}
                                            <label htmlFor={value.res + '' + this.props.index}>{value.text}</label>
                                        </span>
                                    );
                                })
                            }

                        </div>
                    </li>
                </ul>
            );
        }
        return (
            <div>
                {xml}
                {addBtn}
            </div>
        );
    }
}

export default TransferRules;