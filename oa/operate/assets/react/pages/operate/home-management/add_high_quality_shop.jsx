/**
 * 添加供应商到优质供应商
 */

class AddHighQualityShop extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            shopImgPath:'',    // 上传图片的路径
            shopId:0,           // 店铺id
            shopName: '',       // 搜索出来的店铺名
            lastTime:0,         // 搜索的最后时间
            canSubmit: false,
            btnName: '提交确认'
        };
    }

    componentWillMount(){
        if($('#mybase64').length <= 0){
            let scriptStr = '<script id="mybase64" src="/js/mybase64.js"></script>';
            $('body').append(scriptStr);
        }
    }

    createFilter() {
        let options = [],
            i = 1;
        while(i<=3){
            options.push(<option key={i} value={i}>{i}</option>);
            i++;
        }

        return(<div className="section-filter" style={{marginBottom: '30px'}}>
            <form className="form-inline col-lg-12">
                <label className="control-label">上线日期
                    <input id="shop-online" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
                <label className="control-label">下线日期
                    <input id="shop-offline" type="datetime-local" className="form-control" style={{margin: '0 20px'}}/></label>
                <label className="control-label">位置排序
                    <select id="shop-position" className="form-control" style={{margin: '0 20px'}}>{options}</select></label>
            </form>
        </div>);
    }

    createSearch() {
        return(<div className="section-filter" style={{marginBottom: '30px'}}>
            <form className="form-inline col-lg-12">
                <label className="control-label">
                    <input id="shop-search" type="text" className="form-control" style={{margin: '0 20px 0 0'}}
                           placeholder="请输入供应商id" onChange={this.search.bind(this)}/>
                    {this.state.shopName?this.state.shopName:null}
                </label>
            </form>
        </div>);
    }

    search(e){
        let time = e.timeStamp,
            value = e.target.value.trim();
        this.state.lastTime = time;

        setTimeout(()=>{
            if(this.state.lastTime - time == 0 && value){
                H.server.indexManage_get_highQualitySuppliers_byId({shop_id: parseInt(value)}, (res)=>{
                    if(res.code == 0){
                        this.setState({
                            shopName: res.data.shop_name,
                            shopId: value
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        }, 500);

    }

    createUpload() {
        return (<div className="section-filter" style={{overflow: 'hidden'}}>
            <form className="col-lg-12">
                <div className="col-lg-1">
                    <a href="javascript:;" className="file-upload btn btn-sm btn-default">
                        上传图片
                        <input type="file" onChange={this.previewImg.bind(this)}/>
                    </a>
                </div>
                <div className="col-lg-3">
                    <img src="/images/noImg.jpg" id="brand-preview" style={{width: '100%', height: 'auto', borderRadius:'5px', border: '1px solid #d8d8d8'}}/>
                </div>
            </form>
        </div>);
    }

    // 上传图片
    previewImg(e) {
        var img = e.target.files[0];
        var suffix = img.name.substring(img.name.lastIndexOf('.')+1).toLowerCase();
        var allowSuffix = '.jpg,.gif,.png,.jpeg';
        var path = 'Public/Uploads/highQualitySuppliers/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+
            '.'+ suffix;

        this.setState({
            canSubmit: false
        });

        if(allowSuffix.indexOf(suffix) == -1) {
            H.Modal('仅支持'+allowSuffix+'为后缀名的文件! @_@');
            return ;
        }

        // 预览
        $('#brand-preview').attr({'src': window.URL.createObjectURL(img),
            'data-upload':'upload',
            'data-type': img.type,
            'data-suffix': suffix,
            'data-path': path
        });

        var POLICY_JSON = {
            'expiration': '2120-12-01T12:00:00.000Z',
            'conditions': [
                ['starts-with', path, ''],
                {'bucket': 'idongpin'},
                ['starts-with', img.type, ''],
                ['content-length-range', 0, 104857600]
            ]
        };

        var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));

        H.server.other_oss_signature({signature_data: policyBase64}, (res) => {
            if(res.code == 0) {
                var signature = res.data.signature;
                H.server.other_oss_identity_data({}, (res) => {
                    if(res.code == 0) {
                        var access_id = res.data.access_id;
                        var fd = new FormData();
                        //alert(file.type);
                        fd.append('key', path);  //上传到的路径信息;
                        fd.append('Content-Type', img.type);  //文件类型;
                        fd.append('Content-Length', Math.round(img.size * 100 / 1024) / 100);  //文件大小KB;
                        fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
                        fd.append('OSSAccessKeyId', access_id);
                        fd.append('policy', policyBase64);  //参与签名的头信息;
                        fd.append('signature', signature);  //签名;
                        fd.append('file', img);  //需上传的文件对像;

                        var xhr = new XMLHttpRequest();
                        //上传百分比的计算，目前没有用，因为OSS没有返回上传过程的数据;
                        //xhr.upload.addEventListener("progress", uploadProgress, false);
                        //完成后的请求
                        xhr.addEventListener('load', () => {
                            this.setState({
                                shopImgPath: path,
                                canSubmit: true,
                                btnName: '提交确认'
                            });
                        }, false);
                        //请求error
                        xhr.addEventListener('error', function() {
                            H.Modal('上传出现错误，您可以重新点击上传');
                        }, false);
                        //请求中断
                        xhr.addEventListener('abort', function() {
                            H.Modal('上传中断，请检查网络后重新上传');
                        }, false);
                        //发送请求
                        xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                        xhr.send(fd);
                        this.setState({
                            btnName: '正在上传...'
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    // 提交确认
    saveBrand() {
        /**
         * 第一步：上传图片
         */
        if($('#brand-preview').data('upload')=='upload'){
            let putOnAt = $('#shop-online').val().split('T').join(' ')+':00',
                putOffAt = $('#shop-offline').val().split('T').join(' ')+':00',
                shopId = $('#shop-search').val(),
                position = $('#shop-position').val();
            H.Modal({
                content: '确认新增优质供应商？',
                okText:'提交',
                cancel: true,
                okCallback: ()=>{
                    // 新增品牌到品牌馆
                    H.server.indexManage_highQualitySuppliers_add({
                        area_id: this.props.areaId,
                        shop_id: shopId,
                        put_on_at: putOnAt,
                        pull_off_at: putOffAt,
                        position: position,
                        image: this.state.shopImgPath
                    }, (res)=>{
                        if(res.code == 0){
                            H.Modal({
                                content:'增加成功了',
                                okText: '我知道了',
                                okCallback: this.props.closePanel
                            });
                        }else if(res.code == 10106) {
                            H.overdue();
                        }else {
                            H.Modal(res.message);
                        }
                    });
                }

            });
        } else {
            H.Modal('还没有上传图片 @_@');
        }
    }

    render() {
        return (<div className="waybill-info-container">
            <div className="waybill-info-head container-fluid">
                <h3 className="title">新增优质供应商<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                <hr/>
                <div className="waybill-info-content" style={{overflowY:'scroll'}}>
                    {this.createFilter()}
                    {this.createSearch()}
                    {this.createUpload()}
                    <div className="section-filter" style={{marginTop: '50px'}}>
                        <p>图片上传成功后，才可提交确认</p>
                        {this.state.canSubmit?<button type="button" className="btn btn-lg btn-orange" onClick={this.saveBrand.bind(this)}>{this.state.btnName}</button>:<button type="button" className="btn btn-lg btn-orange" disabled="disabled" onClick={this.saveBrand.bind(this)}>提交确认</button>}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default AddHighQualityShop;