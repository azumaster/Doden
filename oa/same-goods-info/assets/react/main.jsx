
import LevelOneNav from './Level-one-nav.jsx';
import GoodsInfo from './pages/goods/goods-info/goods-info.jsx';
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
        //if(localStorage.navigate) {
        //    this.setState({res: JSON.parse(localStorage.navigate)});
        //}else {
        //
        //}
        server.user_navigate({}, (res)=>{
            if(res.code == 0) {
                this.setState({res: res.data});
                //localStorage.navigate = JSON.stringify(res.data);
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
                <GoodsInfo />
            </div>
        );
    }
}

export default Main;
