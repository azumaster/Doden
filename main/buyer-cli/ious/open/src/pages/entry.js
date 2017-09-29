/*
* xy 2017.06.15
* 认证入口;
* */
const { Link } = ReactRouter;

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applyData: {}
        };
    }

    componentWillMount() {
        this.getApplyData();
    }

    componentDidMount() {
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('entryPage'),
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

    getApplyData(n) {
        if(n) $.loading.show();
        $.req.getApplyData({}, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                this.setState({applyData: res.data});
                location.hash = '#/';
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    //设置applyData ;
    setApplyData(key, data) {
        let d = this.state.applyData;
        d[key] = data;
        this.setState({applyData: d});
    }

    //设置注册协议和声明;
    setProtocol() {
        let d = this.state.applyData;
        d.final_protocol = d.final_protocol || {};
        if(d.final_protocol.register_protocol == 1) {
            d.final_protocol.register_protocol = 0;
            d.final_protocol.privacy_protocol = 0;
        }else {
            d.final_protocol.register_protocol = 1;
            d.final_protocol.privacy_protocol = 1;
        }
        this.setState({applyData: d});
    }

    //提交审核;
    subInfo() {
        let d = this.state.applyData;
        if(!d.final_protocol){
            $.toast({icon: 'info', text: '请先同意注册协议和声明'});
            return;
        }
        if(d.final_protocol.register_protocol != 1){
            $.toast({icon: 'info', text: '请先同意注册协议和声明'});
            return;
        }
        $.loading.show('正在提交');
        $.req.submitApply({final_protocol: d.final_protocol}, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                $.toast({text: '提交成功，等待审核'});
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    verifyState() {
        let identityData = this.state.applyData.identity_data,
            xml = null;
        if(identityData) {
            switch (identityData.status) {
                case 1:
                    xml = (<div className="verify-entry">认证中<i className="icon identity"></i></div>);
                    break;
                case 5:
                    xml = (<div className="text-warning">认证失败<i className="icon identity"></i></div>);
                    break;
                case 10:
                    xml = (<div className="">已认证<i className="icon checked-fill"></i></div>);
                    break;
                default:
                    xml = (<div className="verify-entry">未填写<i className="icon identity"></i></div>);
            }
        }else {
            xml = (<div className="verify-entry">未填写<i className="icon identity"></i></div>);
        }
        return (
            <Link to="/identity" className="content">
                {xml}
            </Link>
        );
    }

    imageStatus() {
        let data = this.state.applyData.image_data;
        if(data) {
            if(data.status == 5) {
                return (<div className="text-warning">认证失败<i className="icon images"></i></div>);
            } else {
                return(<div className="">已填写<i className="icon checked-fill"></i></div>);
            }
        }else {
            return (<div className="verify-entry">未填写<i className="icon images"></i></div>);
        }
    }

    render() {
        let data = this.state.applyData;
        data.final_protocol = data.final_protocol || {};
        return (
            <div id="entryPage" className="entry-page">
                <div className="scroller">
                    <h4 className="plate-hd">开通服务</h4>
                    <div className="plate-bd">
                        <div className="cell">
                            <label>身份认证</label>
                            {this.verifyState()}
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>完善资料</label>
                            <Link to="/personal" className="content">
                                {
                                    this.state.applyData.basis_data ?
                                        <div className="">已填写<i className="icon checked-fill"></i></div> :
                                        <div className="verify-entry">未填写<i className="icon personal"></i></div>
                                }
                            </Link>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>影像资料</label>
                            <Link to="/images" className="content">
                                {this.imageStatus()}
                            </Link>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>联系人信息</label>
                            <Link to="/contacts" className="content">
                                {
                                    this.state.applyData.contacts ?
                                        <div className="">已填写<i className="icon checked-fill"></i></div> :
                                        <div className="verify-entry">未填写<i className="icon contacts"></i></div>
                                }
                            </Link>
                            <i className="more-icon">
                            </i>
                        </div>
                        <hr/>
                        <div className="cell">
                            <label>银行卡信息</label>
                            <Link to="/bank" className="content">
                                {
                                    this.state.applyData.bank_data ?
                                        <div className="">已填写<i className="icon checked-fill"></i></div> :
                                        <div className="verify-entry">未填写<i className="icon bank"></i></div>
                                }
                            </Link>
                            <i className="more-icon">
                            </i>
                        </div>
                    </div>
                    <h5 className="open-sub-prompt"><i className="icon tanhao"></i>您填写的内容请在7天内提交，否则系统将自动清除</h5>
                    <h5 className="agreement-register">
                        <i className={data.final_protocol.register_protocol == 1 ? 'icon checked-fill' : 'icon checked'} onClick={this.setProtocol.bind(this)}>
                        </i>我已阅读并同意
                        <Link to="/article/registerProtocol"><a className="agreement">《e签宝注册协议》</a></Link>
                        <Link to="/article/privacyStatement"><a className="agreement">《e签宝隐私声明》</a></Link>
                    </h5>
                    <div className="sub-btn"><button className="btn btn-primary btn-full" onClick={this.subInfo.bind(this)}>提交</button></div>
                </div>
                {this.props.children && React.cloneElement(this.props.children,
                    {
                        data: this.state.applyData,
                        setData: this.setApplyData.bind(this),
                        getApplyData: this.getApplyData.bind(this)
                    }
                )}
            </div>
        );
    }
}

export default Entry;