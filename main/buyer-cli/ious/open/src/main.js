/*
* xy 2017.06.15
* 路由
* */
import Open from './pages/open';
import Identity from './pages/identity';   //身份认证;
import Personal from './pages/personal';   //完善个人资料;
import Images from './pages/images';   //影像资料;
import Contacts from './pages/contacts'; //联系人信息;
import Bank from './pages/bank';    //银行卡信息;
import Entry from './pages/entry';  //完成资料的入口;
import WorkInfo from './pages/workInfo'; //工作信息;
import Article from './pages/article'; //工作信息;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null
            /*
            * "status":6,
            * //用户当前开通白条的状态;1=未在白名单 2=未申请 3=信息不完整 4=未通过 5=肖像认证失败 6=已通过 7=身份信息验证中 8=其它申请信息验证中;
             "identity_failure_times":0,
             "credit_limit":1500000
            * */
        };
    }

    componentWillMount() {
        this.getStatus();
    }

    //获取白条状态;
    getStatus() {
        $.loading.show();
        $.req.getStatus({}, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                if(res.data.ious_info.status == 6 && res.data.ious_info.identity_status == 10) {
                    location.href = '/?m=PublicTemplate&c=ApiPublic&a=iousManage';
                }
                this.setState({userInfo: res.data.ious_info});
            }else {
                $.toast({icon: 'info', text: res.message});
            }
        });
    }

    setStatus(status) {
        let userInfo = this.state.userInfo;
        userInfo.status = status;
        this.setState({userInfo: userInfo});
    }

    render() {
        if(!this.state.userInfo) return null;
        let dom = null,
            info = this.state.userInfo;
        const { Router, Route, hashHistory } = ReactRouter;
        if(info.status == 2) {  //未申请开通;进入验证手机开通页面;
            dom = (<Open setStatus={this.setStatus.bind(this)} />);
        } else if(info.status == 4 && info.identity_status  == 5 && info.identity_failure_times >= 3) {
            dom = (
                <div style={{textAlign: 'center', paddingTop: '100px'}}>
                    <img src="/Public/buyer-cli/ious/images/notthrough.png"/>
                    <p style={{fontSize: '15px', color: '#999'}}>抱歉，您未通过初步</p>
                </div>
            );
        } else {
            dom = (
                <Router history={hashHistory}>
                    <Route path="/" component={Entry} status={this.state.userInfo.status}>
                        <Route path="identity" component={Identity} status={this.state.userInfo.status} >
                            <Route path="article/:file" component={Article} />
                        </Route>
                        <Route path="personal" component={Personal}>
                            <Route path="work" component={WorkInfo} setStatus={this.state.status} >
                                <Route path="article/:file" component={Article} />
                            </Route>
                        </Route>
                        <Route path="images" component={Images} />
                        <Route path="contacts" component={Contacts} />
                        <Route path="bank" component={Bank} />
                        <Route path="article/:file" component={Article} />
                    </Route>
                </Router>
            );
        }
        return dom ;
    }
}

export default Main;