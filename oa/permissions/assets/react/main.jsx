//import NavController from './Level-two-nav.jsx';
//import LevelOneNav from './Level-one-nav.jsx';
//权限管理(只有root用户还会有);
import PrivilegeManagement from  './pages/privilege-management/privilege_ctrl.jsx';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: null
        };
    }

    componentWillMount() {
        let server = H.server;
        //获取菜单;
        if(localStorage.navigate) {
            this.setState({res: JSON.parse(localStorage.navigate)});
        }else {
            server.user_navigate({}, (res)=>{
                if(res.code == 0) {
                    this.setState({res: res.data});
                    localStorage.navigate = JSON.stringify(res.data);
                }else if(res.code == 10106){
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }
    }

    render(){
        return (
            <div>
                <div className="section-top-navbar navbar navbar-default">
                    <a className="toggle-left-sidebar" href="#">
                        <img src="/images/logo.png" alt="logo" />
                    </a>
                    <div className="navbar-header" style={{width: 'auto'}}>
                        <a className="nav-brand">
                            找冻品网OA系统—权限设置
                        </a>
                    </div>
                </div>
                <div className="container-fluid">
                    <PrivilegeManagement />
                </div>
            </div>
        );
    }
}

export default Main;
