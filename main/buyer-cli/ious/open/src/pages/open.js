/*
* xy 2017.06.15
* 验证手机页面;
* */

class Open extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeNum: -1,     //获取验证之后显示的时间，在多少时间之后才可以再次获取;
            interval: null,    //控制时间轮循;
            mobile_code: '',
            verification_code: ''
        };
    }

    //开通服务事件;
    openServiceHandler() {

        let mobile = this.state.mobile_code,
            code = this.state.verification_code;
        $.loading.show();
        if($.validate.mobile(mobile) && code.length >= 4) {
            $.req.verify({mobile_code: mobile, verification_code: code}, (res) => {
                $.loading.hide();
                if(res.code == 0) {
                    $.toast({text: '验证成功'});
                    this.props.setStatus && this.props.setStatus(3);
                }else {
                    $.toast({icon: 'info', text: res.message});
                }
            });
        }else {
            $.loading.hide();
            $.toast({icon: 'info', text: '信息不完成'});
        }
    }

    //点击获取手机验证码;
    getMobileCode() {
        let mobile = this.state.mobile_code;
        if($.validate.mobile(mobile)){
            $.req.getMobile({mobile_code: mobile}, (res) => {
                if(res.code == 0) {
                    this.timeLoop();
                }else {
                    $.toast({icon: 'info', text: res.message});
                }
            });
        }else {
            $.toast({icon: 'info', text: '请输入正确的手机号'});
        }
    }

    //输入框的值改变时;
    inHandler(key, e) {
        this.state[key] = e.target.value;
        this.setState();
    }

    timeLoop() {
        this.setState({timeNum: 60});
        let loop = () => {
            let timeNum = this.state.timeNum;
            if(timeNum < 0) {
                clearInterval(this.state.interval);
            }else {
                timeNum--;
            }
            this.setState({timeNum: timeNum});
        };
        this.state.interval = setInterval(loop, 1000);
    }

    render() {
        return (
            <div className="verify-phone">
                <div className="hd">
                    <div className="item flex align-items-center">
                        <i className="icon phone"></i>
                        <input type="tel" className="flex-item input" placeholder="请输入手机号" value={this.state.mobile_code} onChange={this.inHandler.bind(this, 'mobile_code')} />
                        {
                            this.state.timeNum < 0 ?
                                <button className="verify-code" onTouchStart={this.getMobileCode.bind(this)}>获取验证码</button> :
                                <button className="verify-code disabled">重新获取({this.state.timeNum}s)</button>
                        }
                    </div>
                    <hr/>
                    <div className="item flex align-items-center">
                        <i className="icon verify"></i>
                        <input type="tel" className="flex-item input" placeholder="请输入验证码" value={this.state.verification_code} onChange={this.inHandler.bind(this, 'verification_code')} />
                    </div>
                    <hr/>
                    <h3 className="item flex align-items-center text-assist">您正在开通冻品白条服务</h3>
                </div>
                <div className="sub-btn">
                    <button className="btn btn-primary btn-full" onClick={this.openServiceHandler.bind(this)}>开通服务</button>
                </div>
            </div>
        );
    }
}

export default Open;