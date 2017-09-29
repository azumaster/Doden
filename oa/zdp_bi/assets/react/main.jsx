import NavController from './Level-two-nav.jsx';
import LevelOneNav from './Level-one-nav.jsx';

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
        console.log(123);
        server.user_navigate({}, (res)=>{
            if(res.code == 0) {
                this.setState({res: res.data});
                //localStorage.navigate = JSON.stringify(res.data.navigates);
            }else if(res.code == 10106){
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    render(){
        return (
            <div>
                <LevelOneNav menu={this.state.res} />
                <NavController menu={this.state.res} />
            </div>
        );
    }
}

export default Main;
