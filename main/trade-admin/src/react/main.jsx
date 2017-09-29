import React from 'react';
import NavController from './nav-bar.jsx';
import HeadBar from './head-bar.jsx';

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
        server.user_navigate({}, (res)=>{
            if(res.code == 0) {
                this.setState({res: res.data});
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
                <HeadBar />
                <NavController menu={this.state.res}/>
            </div>
        );
    }
}
export default Main;
