/*
* xy 2017.06.15
* 联系人信息
* */

class Contacts extends React.Component {
    constructor(props) {
        super(props);
        let d = [];
        if(props.data.contacts) {
            d = [props.data.contacts[0] || {}, props.data.contacts[1] || {}];
        }else {
            d = [{}, {}];
        }
        this.state = {
            data: d,   //联系人数据;
            relationArr: null  //与联系人的关系的数据;
        };
    }

    componentWillMount() {
        this.getRelationCode();
    }

    componentWillReceiveProps(nextProps) {
        let d = [];
        if(nextProps.data.contacts) {
            d = [nextProps.data.contacts[0] || {}, nextProps.data.contacts[1] || {}];
        }else {
            d = [{}, {}];
        }
        this.setState({data: d});
    }

    componentDidMount() {
        this.createScroll();
    }

    //获取紧急联系人关系列表;
    getRelationCode() {
        //$.loading.show();
        $.req.getRelationCode({}, (res) => {
            //$.loading.hide();
            if(res.code == 0) {
                this.setState({relationArr: res.data});
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    createScroll(){
        var wrapper = document.getElementById('contactsPage'),
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
    changeHandle(i, key, e) {
        let data = this.state.data,
            val = e.target.value;
        if(key == 'is_car' || key == 'children') {  //如果是否有车和是否有子女选项;
            val = data[key] == 'YES' ? 'NO' : 'YES';
        }
        data[i][key] = val;
        this.setState({data: data});
    }

    //保存;
    saveContacts() {
        let data = this.state.data;
        if(!$.validate.mobile(data[0].mobile_code) || !$.validate.mobile(data[1].mobile_code)) {
            $.toast({icon: 'info', text: '手机号码不正确'});
            return;
        }
        if(data[0].name && data[0].relation && data[1].name && data[1].relation) {
            $.loading.show();
            $.req.contact(JSON.stringify({contacts: data}), (res) => {
                $.loading.hide();
                if(res.code == 0) {
                    $.toast({text: '提交成功'});
                    this.props.getApplyData(1);
                }else {
                    $.toast({icon: 'info', text: res.message});
                }
            });
        }else {
            $.toast({icon: 'info', text: '信息不完整'});
        }
    }

    //选择与联系人的关系;
    chooseRelation(index) {
        let str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
                '<div class="region-picker"><div id="Picker1"></div></div>', up, current = 0, key = this.state.data[index].relation,
            arr = index == 0 ? this.state.relationArr.one : this.state.relationArr.two;
        for(let i = 0 ; i < arr.length ; i++) {
            if(arr[i].code == key) {
                current = i;
            }
        }
        $.picker(str, '选择与您的关系', () => {
            let data = this.state.data;
            data[index].relation = key;
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

    createBtn() {
        let data = this.state.data;
        if($.validate.mobile(data[0].mobile_code) && $.validate.mobile(data[1].mobile_code) &&
            data[0].name && data[0].relation && data[1].name && data[1].relation) {
            return (
                <button className="btn btn-primary btn-full" onClick={this.saveContacts.bind(this)}>提交</button>
            );
        }else {
            return (
                <button className="btn btn-primary btn-full" disabled onClick={this.saveContacts.bind(this)}>提交</button>
            );
        }
    }

    render() {
        let data = this.state.data,
            relation1 = '', relation2 = '',
            arr = this.state.relationArr;
        if(arr) {
            for(let i = 0 ; i < arr.two.length ; i++) {
                if(arr.two[i].code == data[0].relation) relation1 = arr.two[i].name;
                if(arr.two[i].code == data[1].relation) relation2 = arr.two[i].name;
            }
        }
        return (
            <div id="contactsPage" className="contacts-page">
                <div className="scroller">
                    <h4 className="plate-hd">联系人信息  <span className="text-orange">(必填)</span></h4>
                    <div className="plate-bd">
                        <div className="cell">
                            <label>第一联系人姓名<i className="text-orange">*</i></label>
                            <input type="text" placeholder="请输入姓名" value={data[0].name} onChange={this.changeHandle.bind(this, 0, 'name')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>与本人关系<i className="text-orange">*</i></label>
                            <a className="bd" onClick={this.chooseRelation.bind(this, 0)}>
                                {!data[0].relation ? '请选择与您的关系' : <span className="text-muted">{relation1}</span>}
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>手机号码<i className="text-orange">*</i></label>
                            <input type="tel" placeholder="请输入手机号码" value={data[0].mobile_code} onChange={this.changeHandle.bind(this, 0, 'mobile_code')}/>
                        </div>
                    </div>
                    <p></p>
                    <div className="plate-bd">
                        <div className="cell">
                            <label>第二联系人姓名<i className="text-orange">*</i></label>
                            <input type="text" placeholder="请输入姓名" value={data[1].name} onChange={this.changeHandle.bind(this, 1, 'name')}/>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>与本人关系<i className="text-orange">*</i></label>
                            <a className="bd" onClick={this.chooseRelation.bind(this, 1)}>
                                {!data[1].relation ? '请选择与您的关系' : <span className="text-muted">{relation2}</span>}
                            </a>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>手机号码<i className="text-orange">*</i></label>
                            <input type="tel" placeholder="请输入手机号码" value={data[1].mobile_code} onChange={this.changeHandle.bind(this, 1, 'mobile_code')}/>
                        </div>
                    </div>
                    <div className="sub-btn">{this.createBtn()}</div>
                </div>
            </div>
        );
    }
}

export default Contacts;