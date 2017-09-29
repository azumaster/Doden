/*
* xy 2017.06.15
* 影像资料
* */

class Images extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.image_data || {},
            localPic: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.image_data) {
            this.setState({data: nextProps.data.image_data});
        }
    }

    componentDidMount() {
        this.createScroll();
    }

    createScroll(){
        var wrapper = document.getElementById('imagesPage'),
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

    //保存影像;
    saveImages() {
        let data = this.state.data;
        if(!data.store_images) {
            $.toast({icon: 'info', text: '门店照片必须有'});
            return;
        }
        if(!data.firm_license) {
            $.toast({icon: 'info', text: '统一社会信用代码证/营业执照必须有'});
            return;
        }
        if(!data.store_contract) {
            $.toast({icon: 'info', text: '经营场所租赁/购买合同必须有'});
            return;
        }
        $.loading.show();
        $.req.images(JSON.stringify({image_data: data}), (res) => {
            $.loading.hide();
            if(res.code == 0) {
                $.toast({text: '保存成功'});
                this.props.getApplyData(1);
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    uploader(key) {
        let data = this.state.data,
            length = 10;
        data[key] = data[key] || [];
        if(key == 'firm_license') {
            length = 1;
        }else {
            length = data[key].length >= 1 ? (10 - data[key].length) : 9;
        }
        $.upload({
            length: length,
            load: (url, localUrl) => {
                data[key].push(url);
                this.state.localPic[url] = localUrl;
                this.setState({data: data});
            }
        });
    }

    //删除已经有的图片;
    delImage(key, index) {
        let data = this.state.data;
        data[key].splice(index, 1);
        this.setState({data: data});
    }

    render() {
        let data = this.state.data,
            firmLicense = [],
            storeImage = [],
            storeContract = [],
            creditReport = [];
        if(data) {
            firmLicense = data.firm_license || [];
            storeImage = data.store_images || [];
            storeContract = data.store_contract || [];
            creditReport = data.credit_report || [];
        }
        return (
            <div id="imagesPage" className="images-page">
                <div className="scroller">
                    <h4 className="plate-hd">门店照片  <span className="text-orange">(必填)</span></h4>
                    <div className="uploader-cell">
                        {
                            storeImage.map((val, index) => {
                                return (
                                    <div key={index} className="upload-img" >
                                        {
                                            data.status == 1 || data.status == 10 ? null : <span className="del" onClick={this.delImage.bind(this, 'store_images', index)}></span>
                                        }
                                        <img src={this.state.localPic[val] ? this.state.localPic[val] : $.cdn + val + $.img(80, 90)} width="100%" height="100%" />
                                    </div>
                                );
                            })
                        }
                        {
                            storeImage.length < 10 ? <div className="uploader" onClick={this.uploader.bind(this, 'store_images')}></div> : null
                        }
                    </div>
                    <h4 className="plate-hd">统一社会信用代码证/营业执照  <span className="text-orange">(二选一，必填)</span></h4>
                    <div className="uploader-cell">
                        {
                            firmLicense.map((val, index) => {
                                return (
                                    <div key={index} className="upload-img" >
                                        {
                                            data.status == 1 || data.status == 10 ? null : <span className="del" onClick={this.delImage.bind(this, 'firm_license', index)}></span>
                                        }
                                        <img src={this.state.localPic[val] ? this.state.localPic[val] : $.cdn + val + $.img(80, 90)} width="100%" height="100%" />
                                    </div>
                                );
                            })
                        }
                        {
                            firmLicense.length <= 0 ? <div className="uploader" onClick={this.uploader.bind(this, 'firm_license')}></div> : null
                        }
                    </div>
                    <h4 className="plate-hd">经营场所租赁/购买合同  <span className="text-orange">(二选一，必填)</span></h4>
                    <div className="uploader-cell">
                        {
                            storeContract.map((val, index) => {
                                return (
                                    <div key={index} className="upload-img" >
                                        {
                                            data.status == 1 || data.status == 10 ? null : <span className="del" onClick={this.delImage.bind(this, 'store_contract', index)}></span>
                                        }
                                        <img src={this.state.localPic[val] ? this.state.localPic[val] : $.cdn + val + $.img(80, 90)} width="100%" height="100%" />
                                    </div>
                                );
                            })
                        }
                        {
                            storeContract.length < 10 ? <div className="uploader" onClick={this.uploader.bind(this, 'store_contract')}></div> : null
                        }
                    </div>
                    <h4 className="plate-hd">征信报告  <span className="text-orange">(可选)</span></h4>
                    <div className="uploader-cell">
                        {
                            creditReport.map((val, index) => {
                                return (
                                    <div key={index} className="upload-img" >
                                        {
                                            data.status == 1 || data.status == 10 ? null : <span className="del" onClick={this.delImage.bind(this, 'credit_report', index)}></span>
                                        }
                                        <img src={this.state.localPic[val] ? this.state.localPic[val] : $.cdn + val + $.img(80, 90)} width="100%" height="100%" />
                                    </div>
                                );
                            })
                        }
                        {
                            creditReport.length < 10 ? <div className="uploader" onClick={this.uploader.bind(this, 'credit_report')}></div> : null
                        }
                    </div>
                    <h5 className="open-sub-prompt"><i className="icon tanhao"></i>支持jpg/png/gif图片格式，图片大小不要超过10M，最多上传分别不超过10张</h5>
                    <div className="sub-btn"><button className="btn btn-primary btn-full" onClick={this.saveImages.bind(this)}>保存</button></div>
                </div>
            </div>
        );
    }
}

export default Images;