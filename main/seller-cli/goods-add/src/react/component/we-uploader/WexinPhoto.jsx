/*
* 微信上传图片*/

class WexinPhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnXml: [],
            localPic: {}   //本地图片;
        };
        this.chooseImg = this.chooseImg.bind(this);
    }

    componentDidUpdate() {
        this.props.scroll && this.props.scroll.refresh();
    }

    //点击添加图片的按钮;
    chooseImg() {
        let arr = this.props.picArr,
            that = this;
        if(arr.length >= this.props.maxLength) return;
        wx.chooseImage({
            count: this.props.maxLength-arr.length, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有;
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有;
            success: function (res) {
                //res={"sourceType":"album","localds":["地址1","地址2"],"errMsg":"chooselmage:ok"};
                var localIds = res.localIds; //返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
                var localIndex=0;
                function upImg(){
                    wx.uploadImage({
                        localId: localIds[localIndex], // 需要上传的图片的本地ID，由chooseImage接口获得;
                        isShowProgressTips: 1, // 默认为1，显示进度提示;
                        success: function(res){
                            let newObj = {picture_id: 0, picture_add: res.serverId},
                                localPic = that.state.localPic;
                            arr.push(newObj);
                            localPic[res.serverId] = localIds[localIndex];
                            that.setState();
                            if(arr.length<that.props.maxLength){
                                if(localIds[localIndex]){
                                    localIndex++;
                                    upImg();
                                }
                            }else {
                                this.props.setModifyState && this.props.setModifyState(2);
                            }
                        }
                    });
                }
                upImg();
            }
        });
    }

    //删除图片;
    delPhoto(e) {
        let index = e.target.dataset.index,
            arr = this.props.picArr;
        if(index || index ==0) {
            arr.splice(index, 1);
        }
        this.setState();
        this.props.setModifyState && this.props.setModifyState(2);
    }

    render() {
        let picArr = this.props.picArr;
        return (
            <div className="we-uploader">
                <div className="we-uploader-hd">*添加照片</div>
                <div className="we-uploader-bd">
                    <div className="photo-list" onClick={this.delPhoto.bind(this)}>
                        {
                            picArr.map((val, index) => {
                                let url = this.state.localPic[val.picture_add] ? this.state.localPic[val.picture_add] : H.localhost + val.picture_add + H.imgSize()[110];
                                return (
                                    <div key={index} className="we-uploader-file" style={{backgroundImage: 'url('+url+')'}}>
                                        <i className="del-photo" data-index={index}>&times;</i></div>
                                );
                            })
                        }
                    </div>
                    <div style={picArr.length < this.props.maxLength ? {} : {display: 'none'}} className="we-uploader-btn" onClick={this.chooseImg.bind(this)}></div>
                </div>
                <div className="we-uploader-ft">
                    <p>{this.props.desc}</p>
                </div>
            </div>
        );
    }
}

export default WexinPhoto;