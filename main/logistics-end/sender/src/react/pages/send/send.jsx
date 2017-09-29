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
            chooseData: [],    //被选中的数据;
            chooseIdArr: [],      //被选中的数据;
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
                preventDefault: false
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

    setStep(chooseData) {   //被选中的数据;在选择地址时选择下一步时会有这个参数(step==2);
        if(this.state.step == 1) {
            this.state.step = 2;
            this.state.chooseData = chooseData;
        }else if(this.state.step == 2) {
            let param = {
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
        }
        this.forceUpdate();
    }

    createComponent() {
        switch (this.state.step) {
            case 1:
                return (<Step1 SCROLL={this.state.SCROLL} step={this.state.step} list={this.state.list} setStep={this.setStep.bind(this)}
                               total={this.state.total} setShowMap={this.setShowMap.bind(this)} currentAddress={this.state.currentAddress} />);
                break;
            case 2:
                return (<Step2 SCROLL={this.state.SCROLL} step={this.state.step} list={this.state.chooseData} setStep={this.setStep.bind(this)} />);
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

    render() {
        return (
            <div id="logisticWrap">
                <div id="sendWrap" className="send-wrap" style={(this.state.step == 3 ? {backgroundColor: '#fff'} : null)}>
                    <div className="scroller">
                        {this.createComponent()}
                    </div>
                </div>
                {
                    (this.props.hash.indexOf('/map') != -1 ?
                        <Map currentAddress={this.state.currentAddress} setCurrentAddress={this.setCurrentAddress.bind(this)} /> : null)
                }
            </div>
        );
    }
}

export default Send;