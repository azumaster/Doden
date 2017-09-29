/**
 * 添加卡（未开放）
 * Created by Doden on 2017.06.19
 */

import React from 'react';

class AddCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankList: [],
            bankInfo: null
        };
    }

    componentWillMount(){

        if(this.props.current){
            this.setState({
                bankInfo: this.props.current
            });
        }else{
            this.getBankCode();
        }
    }

    getBankCode(){
        H.server.getBankCode({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    bankList: res.data
                });
            }else{
                H.toast(res.message);
            }
        });
    }

    // 提交银行卡信息
    submit(){
        let code = $('#bankCode').val(),
            number = $('#bankId').val(),
            mobile = $('#bankMobile').val();

        if(!H.isMobile(mobile)){
            H.toast('手机号码不正确');
            return;
        }

        let params = {
            bank_code: code,
            card_number: number,
            mobile_code: mobile
        };

        H.server.addBank(params, (res)=>{
            if(res.code == 0){
                H.toast('添加成功！');
                setTimeout(()=>{
                    window.history.back();
                }, 1300);
            }else{
                H.toast(res.message);
            }
        });
    }

    render() {
        let options = [];

        options.push(<option key={-1} value="" disabled="disabled" selected style={{display: 'none'}}>请选择所属银行</option>);

        this.state.bankList.map((bank, i)=>{
            options.push(<option key={i} value={bank.code}>{bank.name}</option>);
        });

        return (<div className="add-card">
            <div className="info-body">
                <div className="info-title">
                    {this.state.bankInfo? <p className="info-name">我的银行卡</p>:
                        <p className="info-name">添加银行卡</p>}
                </div>
                <div className="info-ul">
                    <div className="info-li">
                        <p className="info-li-label">所属银行</p>
                        {this.state.bankInfo?<p className="info-li-label"><em className="info-notice">{this.state.bankInfo.name}</em></p>:
                            <p className="info-li-label"><select id="bankCode" className="info-notice">{options}</select><i className="icon right"></i></p>}
                    </div>
                    <div className="info-li">
                        <p className="info-li-label">银行卡号</p>
                        {this.state.bankInfo?<p className="info-li-label"><em className="info-notice">{this.state.bankInfo.number}</em></p>
                        :<input type="tel" id="bankId" className="info-li-input" placeholder="请输入银行卡号"/>}
                    </div>
                    <div className="info-li">
                        <p className="info-li-label">银行卡户手机号</p>
                        {this.state.bankInfo?<p className="info-li-label"><em className="info-notice">{this.state.bankInfo.mobile}</em></p>
                            :<input type="tel" id="bankMobile" maxLength="11" className="info-li-input" placeholder="请输入手机号码"/>}
                    </div>
                </div>
            </div>
            <div className="add-btn">
                {this.state.bankInfo?null:<button className="btn btn-lg btn-submit" onClick={this.submit.bind(this)}>提交</button>}
            </div>
        </div>);
    }
}

export default AddCard;