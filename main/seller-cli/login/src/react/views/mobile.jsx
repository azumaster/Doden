/**
 * 注册页面填写手机号码
 * Created by Doden on 2017.05.15
 */

import React from 'react';
import Protocol from './protocol.jsx';

class Mobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showProtocol: false,
            interval: null
        };
    }

    componentDidMount(){

        $('#stepOne').css({height: (window.innerHeight - 15) + 'px'});
    }

    createLoginForm(){
        return (<div className="mobile-info ul">
            <div className="li">
                <div className="li-input"><i className="icon phone"></i><input id="tel" type="tel" maxLength="11" placeholder="请输入手机号"/></div>
                <button type="button" id="verify" className="li-verify" onClick={this.verify.bind(this)}>获取验证码</button>
            </div>
            <div className="li">
                <div className="li-input"><i className="icon verify"></i><input id="verifyCode" maxLength="4" type="tel" placeholder="请输入验证码"/></div>
            </div>
            <div className="li"><p className="li-notice">注册成功后将处于自动登录状态</p></div>
        </div>);
    }

    // 发送验证码
    verify() {
        let tel = document.getElementById('tel').value;

        if(tel.length<11){
            H.toast('请输入合法中国大陆手机号码');
        }else {
            H.server.sendVerify({facilityCode: document.getElementById('tel').value, codeLength: 4}, (res)=>{
                if(res.code == 0 || res.status == 0){
                    H.toast('发送成功！');
                    let time = 60;
                    let timeInterval = setInterval(()=>{
                        let verify = document.getElementById('verify');
                        verify.innerHTML = time+'秒后重试';
                        verify.setAttribute('disabled', 'disabled');

                        time--;
                        if(time < 0){
                            clearInterval(timeInterval);
                            verify.innerHTML = '获取验证码';
                            verify.removeAttribute('disabled');
                        }
                    }, 1000);

                    this.setState({
                        interval: timeInterval
                    });
                }else {
                    H.toast(res.message);
                }
            });
        }
    }

    // 提交验证码
    next() {
        let tel = document.getElementById('tel').value,
            code = document.getElementById('verifyCode').value;

        H.server.pushVerify({regTel: tel, verifyCode: code}, (res) => {
            if(res.code == 0 || res.status == 0){
                clearInterval(this.state.interval);
                this.props.nextStep && this.props.nextStep(tel);
            }else {
                H.toast(res.message);
            }
        });
    }

    // 打开协议
    openProtocol(){
        this.setState({
            showProtocol: !this.state.showProtocol
        });
    }

    render() {
        return (<div id="stepOne" className="step_one">
            {this.createLoginForm()}
            <div className="login-btn" onClick={this.next.bind(this)}>注册</div>
            <p className="page-notice">提示：注册即代表您已阅读并同意 <a href="javascript:;" onClick={this.openProtocol.bind(this)}>《注册协议》</a></p>
            {this.state.showProtocol?<Protocol back={this.openProtocol.bind(this)}/>:null}
        </div>);
    }
}

export default Mobile;