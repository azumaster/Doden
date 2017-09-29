/*
* 发件;
* create: 胡小宇
* */
import Step1 from './view/step1.jsx';
import Step2 from './view/step2.jsx';
import OrderInfo from './../order-info.jsx';
import Map from '../map.jsx';
class Send extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultParam: {       //地址列表请求参数;
                page: 1,
                size: 10
            },
            list: [],             //地址列表数据;
            total: 0,             //总条数;
            chooseData: [],       //被选中的数据;
            chooseIdArr: [],      //被选中的数据id;
            step: 1,               //执行的步骤;
            showMap: false,       //是否显示地址页面;
            finishData: null       //提交完成后显示预约成功的数据;
        };
        this.createScroll = this.createScroll.bind(this);
        this.getAddressData = this.getAddressData.bind(this);
        this.createComponent = this.createComponent.bind(this);
    }

    componentWillMount() {
        H.we_loading.show();
        this.getAddressData();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('sendWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false,
                chooseIdArr: []
            });
        //SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;$('#keyWordsVal')[0].blur();});
        SCROLL.on('scroll', () => {
            if(this.state.list.length >= this.state.total || this.state.step != 1) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        SCROLL.on('scrollEnd', () => {
            //SCROLL.options.preventDefault = false;
            if(this.state.list.length >= this.state.total || this.state.step != 1) return;
            if((SCROLL.y - SCROLL.maxScrollY ) < 300) {
                this.state.defaultParam.page++;
                this.getAddressData();
            }
        });
        this.state.SCROLL = SCROLL;
    }

    getAddressData() {
        let param = this.state.defaultParam;
        H.server.shop_address(param, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                this.state.list = this.state.list.concat(res.data.customs);
                this.state.total = res.data.total;
                this.forceUpdate();
            }else {
                H.operationState(res.message);
            }
        });
    }

    createComponent() {
        console.log(this.state.list);
        switch (this.state.step) {
            case 1:
                return (<Step1 SCROLL={this.state.SCROLL} step={this.state.step} list={this.state.list}
                               total={this.state.total} setShowMap={this.setShowMap.bind(this)} currentAddress={this.state.currentAddress}
                               chooseIdArr={this.state.chooseIdArr}/>);
                break;
            case 2:
                return (<Step2 SCROLL={this.state.SCROLL} step={this.state.step} chooseData={this.state.chooseData} />);
                break;
            case 3:
                return (<OrderInfo SCROLL={this.state.SCROLL} step={this.state.step} list={this.state.finishData} />);
                break;
        }
    }

    //设置当前修改或者添加时提交的参数;
    setCurrentAddress(obj) {
        this.state.currentAddress = this.state.currentAddress || {};
        if(obj) {
            this.state.currentAddress.address = obj;
        }
        $('#chooseAddress').html(obj.address);
        $('#chooseAddress').removeClass('not');
        history.back();
    }

    //设置地图的隐藏显示;
    setShowMap(obj) {
        let data = this.state.currentAddress || {};
        data.name = obj.name;
        data.mobile = obj.mobile;
        this.setState({currentAddress: data}, () => {
            location.href = '#/map';
        });
    }

    //执行下一步时操作;
    nextStep() {
        switch (this.state.step) {
            case 1:
                if(this.state.chooseIdArr.length <= 0) {
                    H.operationState('请选择提货人');
                    return;
                }
                let list = this.state.list,
                    arr = this.state.chooseIdArr,
                    dataArr = [];
                for (let i = 0 ; i < arr.length ; i++) {
                    dataArr.push(list[arr[i]]);
                }
                this.setState({step: this.state.step+1, chooseData: dataArr});
                break;
            case 2:
                let chooseData = this.state.chooseData,
                    param = {
                    customs: []
                };
                for(let i = 0 ; i < chooseData.length ; i++) {
                    let obj = {
                        uid: chooseData[i].uid,
                        volume: chooseData[i].num || 1
                    };
                    param.customs.push(obj);
                }
                H.we_loading.show();
                H.server.shop_order_add(JSON.stringify(param), (res) => {
                    H.we_loading.hide();
                    if(res.code == 0) {
                        this.setState({finishData: res.data, step: 3});
                    }else {
                        H.operationState(res.message);
                    }
                });
                break;
            case 3:

                break;
        }
    }

    render() {
        return (
            <div>
                <div id="sendWrap" className="send-wrap" style={this.state.step == 3 ? {backgroundColor: '#fff'} : null}>
                    <div className="scroller">
                        {this.createComponent()}
                    </div>
                </div>
                {
                    this.props.hash.indexOf('/map') != -1 ? <Map currentAddress={this.state.currentAddress} setCurrentAddress={this.setCurrentAddress.bind(this)} /> : null
                }
                <div className="step-bar flex-box">
                    <div className="instruct flex-num1">{this.state.step == 1 ? '第一步：请批量选择提货人' : '第二步：请确认货品数量'}</div>
                    <a className="step-btn" onClick={this.nextStep.bind(this)}>{this.state.step == 1 ? '下一步' : '提交'}</a>
                </div>
            </div>
        );
    }
}

export default Send;