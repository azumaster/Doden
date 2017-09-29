/**
 * 转账还款（西姆金融方未开放这个接口）
 * Created by Doden on 2017.06.22
 */

import React from 'react';

class Transfer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: null,
            hasPic: false,
            edit: false,
            serverId: '',
            imgSrc: ''
        };
    }

    componentWillMount(){
        let current = this.props.current,
            params = {};

        if(!current){
            // 如果用户强制刷新，没有获取到current,则会返回到上一页
            window.history.back();
            return;
        }

        params.main_order_no = current.main_order_no;
        params.loan_no = current.loan_no;

        H.loading.show();
        H.server.getTransfer(params, (res)=>{
            if(res.code == 0){
                this.setState({
                    account: res.data
                });
            }else{
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    // 图片在这儿上传到微信服务器
    upload(){
        let _this = this;
        this.setState({
            edit: false
        }, ()=>{
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds;
                    syncUpload(localIds);
                }
            });
            var syncUpload = function(localIds) {
                var localId = localIds.pop();
                _this.setState({
                    imgSrc: localId
                });
                wx.uploadImage({
                    localId: localId,
                    isShowProgressTips: 1,
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID
                        this.setState({
                            serverId: serverId,
                            hasPic: true
                        });
                    }
                });
            };
        });
    }

    createAccount(){
        let account = this.state.account;

        if(!account) return null;
        let aliPay =  account.alipay,
            bank = account.bank;

        return (<div className="transfer-form">
            <div className="transfer-info">{aliPay.name}支付宝账号：{aliPay.account}</div>
            <div className="transfer-info">{bank.name}银行账号：{bank.account}</div>
        </div>);
    }

    createUpload(){

        return (<div className="upload-img" onClick={this.upload.bind(this)}>
            <div className="image-input"></div>
            {this.state.hasPic?<div className={'image-preview'} ><img src={this.state.imgSrc}/></div>:null}
        </div>);
    }

    // 上传凭证
    voucher(){
        let current = this.props.current,
            params = {};

        params.main_order_no = current.main_order_no;
        params.loan_no = current.loan_no;
        params.voucher = this.state.serverId;

        H.loading.show('上传中...');
        H.server.transfer(params, (res)=>{
            if(res.code == 0){
                this.props.transfer && this.props.transfer('rePaying', this.props.current);
            }else {
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    // 开始编辑
    edit(){
        this.setState({
            edit: true
        });
    }


    render() {

        return (<div id="transfer" className="transfer">
            <div className="transfer-notice">您可以手动打款至以下账户，然后上传打款凭证</div>
            {this.createAccount()}
            <div className="transfer-upload">
                <div className="upload-title">
                    <p>上传凭证</p>
                    {this.state.hasPic?<p className="edit" onClick={this.edit.bind(this)}>编辑</p>:null}
                </div>
                <div className="upload-body">
                    {this.createUpload()}
                </div>
                <div className="upload-tip">通过支付宝转账后，上传转账记录截图或银行转帐单照片<br />(图片字迹需清晰)</div>
            </div>
            <div className="transfer-btn">
                <button type="button" className="btn btn-full btn-primary" onClick={this.voucher.bind(this)}>上传凭证</button>
            </div>
        </div>);
    }
}

export default Transfer;