/*
* 主控制页面;
* */
import Nav from '../../../components/nav/nav.jsx';
import Send from './send/send.jsx';
import History from './history/history.jsx';
import Address from './address/address.jsx';
class Main extends React.Component {
    constructor(props) {
        super(props);
        const hash = location.hash.substr(1);
        if(hash == 'history/info') {
            location.href = '#history';
        }else if(hash == '/map') {
            location.href = '#';
        }else if(hash == 'address/map') {
            location.href = '#address';
        }
        this.state = {
            hash: location.hash.substr(1)    //路由：地址中hash值，为''表示发件页面，为'history'表示历史记录页
        };
        this.createWrap = this.createWrap.bind(this);
    }

    componentWillMount() {
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        window.onhashchange = () => {
            this.setState({hash: location.hash.substr(1)});
        };
    }

    createWrap(){
        let hash = this.state.hash;
        if(hash == '' || hash == '/map') {
            return (<Send hash={this.state.hash} />);
        }else if(hash.indexOf('history') != -1) {
            return (<History hash={this.state.hash} />);
        }else if(hash.indexOf('address') != -1) {
            return (<Address hash={this.state.hash} />);
        }
    }

    render() {
        return (
            <div>
                <div className="tool-bar flex-box"><div className="show-nav-btn"></div><div className="flex-num1">历史记录</div><div className="kf-btn"></div></div>
                {this.createWrap()}
                <Nav hash={this.state.hash} />
            </div>
        );
    }
}

export default Main;