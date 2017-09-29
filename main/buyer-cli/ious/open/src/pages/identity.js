/*
* xy 2017.06.15
* 身价认证
* */
const { Link } = ReactRouter;
class Identity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shootingStandard: false,     //是否显示查看拍摄标准页面;
            data: props.data.identity_data || {},
            localPic: {}  //微信上传图片是记录本地图片地址;
        };
    }

    componentDidMount() {
        this.createScroll();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.data.identity_data || {}});
    }

    createScroll(){
        var wrapper = document.getElementById('identityPage'),
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


    //提交身份认证信息;
    saveIdentity() {
        let data = this.state.data,
            param = {
                name: data.name,
                id_card: data.id_card,
                front_image: data.front_image,
                reverse_image: data.reverse_image,
                portrait: data.portrait,
                agree_deal: data.agree_deal
            };
        if(!param.name) {
            $.toast({icon: 'info', text: '姓名不能为空'});
            return;
        }
        if(!param.id_card) {
            $.toast({icon: 'info', text: '身份证号必须填写'});
            return;
        }
        if(!param.front_image || !param.reverse_image || !param.portrait ) {
            $.toast({icon: 'info', text: '必须上传身份证照片'});
            return;
        }
        $.loading.show('提交中');
        $.req.identity({identity_data: param}, (res) => {
            $.loading.hide();
            console.log(res);
            if(res.code == 0){
                if(res.data.image_status.front_image == 5 || res.data.image_status.reverse_image == 5 || res.data.image_status.portrait == 5) {
                    $.toast({text: '认证失败'});
                }else {
                    $.toast({text: '提交成功'});
                    this.props.getApplyData(1);
                }
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    //查看拍摄标准;
    shootingStandard(bool) {
        this.setState({shootingStandard: bool});
    }

    //输入框改变时;
    changeHandle(e) {
        let data = this.state.data,
            key = e.target.dataset.key,
            val = e.target.value;
        if(!key) return;
        data[key] = val;
        this.setState({data: data});
    }

    //上传图片;
    uploadHandle(key, status) {
        if(status == 1 || status == 10) return;
        let data = this.state.data;
        $.upload({
            length: 1,
            load: (url, localUrl) => {
                data[key] = url;
                this.state.localPic[key] = localUrl;
                this.setState({data: data});
            }
        });
    }

    //生成上传的材料的DOM;
    createUploadDOM(key) {
        let data = this.state.data,
            image = data.image_status,
            xml = (
                <div className="flex-item upload-idCard-item" onClick={this.uploadHandle.bind(this, key, 0)}>
                    <div><div className="icon add"></div><h3 className="text-other">身份证正面照片</h3></div>
                </div>
            );

        let imageStatus = (key) => {
            let stateText = null;
            switch (image[key]) {
                case 1:
                    stateText = (<h3 className="text-white"><i className="icon tanhao text-warning"></i>认证中</h3>);
                    break;
                case 5:
                    stateText = (<h3 className="text-white"><i className="icon tanhao text-warning"></i>认证失败<br />点击重新上传</h3>);
                    break;
                case 10:
                    stateText = (<h3 className="text-white"><i className="icon checked-fill text-green"></i>认证通过</h3>);
                    break;
            }
            return stateText;
        };
        if(data[key]) {   //图片地址存在, 上传过图片;
            if(image) {    //图片审核的状态存在, 已经提交过一次的;
                xml = (
                    <div className="flex-item upload-idCard-item" onClick={this.uploadHandle.bind(this, key, image[key])} >
                        <img src={this.state.localPic[key] ? this.state.localPic[key] : $.cdn + data[key] + $.img(200, 90)} width="100%" height="100%"/>
                        <div className="upload-mask text-warning">
                            {imageStatus(key)}
                        </div>
                    </div>
                );
            }else {    //第一次上传图片,没有提交过;
                xml = (
                    <div className="flex-item upload-idCard-item" onClick={this.uploadHandle.bind(this, key, 0)} >
                        <img src={this.state.localPic[key] ? this.state.localPic[key] : $.cdn + data[key] + $.img(200, 90)} width="100%" height="100%"/>
                    </div>
                );
            }
        }else {   //图片地址不存在，没上传过图片;
            let t = null;
            if(key == 'front_image') {
                t = (<h3 className="text-other">身份证正面照片</h3>);
            }else if(key == 'reverse_image') {
                t = (<h3 className="text-other">身份证背面照片</h3>);
            }else if(key == 'portrait') {
                t = (<h3 className="text-other">手持身份证照片</h3>);
            }
            xml = (
                <div className="flex-item upload-idCard-item" onClick={this.uploadHandle.bind(this, key, 0)}>
                    <div className="chooseImage"><div className="icon add"></div>{t}</div>
                </div>
            );
        }
        return xml;
    }

    createBtn() {
        let data = this.state.data,
            btnXML = null;
        switch (data.status) {
            case 1:  //认证中;
                btnXML = (<button className="btn btn-primary btn-full" disabled onClick={this.saveIdentity.bind(this)}>认证中</button>);
                break;
            case 5:   //失败;
                btnXML = (<button className="btn btn-primary btn-full" onClick={this.saveIdentity.bind(this)}>提 交</button>);
                break;
            case 10:  //成功;
                btnXML = (<button className="btn btn-primary btn-full" disabled onClick={this.saveIdentity.bind(this)}>已认证</button>);
                break;
            default:
                //没有认证过的;
                if(data.name && data.id_card && data.front_image && data.reverse_image && data.portrait && data.agree_deal) {
                    btnXML = (<button className="btn btn-primary btn-full" onClick={this.saveIdentity.bind(this)}>提 交</button>);
                }else {
                    btnXML = (<button className="btn btn-primary btn-full" disabled onClick={this.saveIdentity.bind(this)}>提 交</button>);
                }
        }
        return btnXML;
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

    render() {
        let data = this.state.data,
            disabled = false;   //输入框是否可以输入;
        if(data.status) {
            if(data.status == 1 || data.status == 10) disabled = true;
        }
        return (
            <div id="identityPage" className="identity-page">
                <div className="scroller">
                    <h4 className="plate-hd">身份认证信息 (非公开)</h4>
                    <div className="plate-bd">
                        <div className="cell">
                            <label htmlFor="username">姓名</label>
                            <input id="username" type="text" placeholder="请输入您的姓名" data-key="name"
                                   disabled={disabled} value={data.name} onChange={this.changeHandle.bind(this)} />
                        </div>
                        <hr/>
                        <div className="cell">
                            <label htmlFor="identityCode">身份证号</label>
                            <input id="identityCode" type="text" placeholder="请输入您的身份证号码" data-key="id_card"
                                   disabled={disabled} value={data.id_card} onChange={this.changeHandle.bind(this)}/>
                        </div>
                    </div>
                    <h4 className="plate-hd flex"><div className="flex-item">上传证件材料</div>
                        <a className="shooting-standard" onClick={this.shootingStandard.bind(this, true)}>拍摄标准</a></h4>

                    <div className="upload-idCard">
                        <div className="flex">
                            {this.createUploadDOM('front_image')}
                            {this.createUploadDOM('reverse_image')}
                        </div>
                        <div className="flex">
                            {this.createUploadDOM('portrait')}
                            <div className="flex-item upload-idCard-item no-border"></div>
                        </div>
                    </div>

                    <h5 className="open-sub-prompt"><i className="icon tanhao"></i>您填写的内容请在7天内提交，否则系统将自动清除</h5>
                    <h5 className="agreement-register"><i className={data.agree_deal == 1 ? 'icon checked-fill' : 'icon checked'} onClick={this.setAgree.bind(this)}>
                    </i>我已阅读并同意
                        <Link to="identity/article/authorization-geren"><a className="agreement">《授权确认书(个人版)》</a></Link>
                    </h5>
                    <div className="sub-btn">
                        {this.createBtn()}
                    </div>
                </div>
                {
                    this.state.shootingStandard ?
                        <div className="shooting-standard-page">
                            <div className="flex id-card-cell">
                                <div className="flex-item img-item"><img src="/Public/buyer-cli/ious/images/id-card1.png" width="100%"/></div>
                                <div className="flex-item img-item"><img src="/Public/buyer-cli/ious/images/id-card2.png" width="100%" /></div>
                            </div>
                            <h3><span className="serial-number">1</span>请按照图示上传身份证正、背面照片、证件信息必须清晰。</h3>
                            <div className="personal-id-card"><img src="/Public/buyer-cli/ious/images/id-card3.png" width="100%"/></div>
                            <h3><span className="serial-number">2</span>请按照图示上传手持身份证照片，持证人面部轮廓与身份证信息必须清晰且匹配。</h3>
                            <button className="btn btn-full btn-market" onClick={this.shootingStandard.bind(this, false)}>好的，我知道了</button>
                        </div> : null
                }
                {this.props.children && React.cloneElement(this.props.children, data)}
            </div>
        );
    }
}

export default Identity;