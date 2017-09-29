class LevelOneNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: null
        };
    }

    componentWillMount() {
        if(this.props.menu) {
            let menuArr = [],
                obj = this.props.menu.navigates[1];
            for(let value in obj){
                menuArr.push(obj[value]);
            }
            this.setState({menu: menuArr});
        }
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.menu) return;
        let menuArr = [],
            obj = nextProps.menu.navigates[1];
        for(let value in obj){
            menuArr.push(obj[value]);
        }
        this.setState({menu: menuArr});
    }

    render() {
        return (
            <div className="section-top-navbar navbar navbar-default">
                <a className="toggle-left-sidebar" href="#">
                    <img src="/images/logo.png" alt="logo" />
                </a>
                <div className="navbar-header" style={{width: 'auto'}}>
                    <a className="nav-brand">
                        找冻品网OA系统—商品管理
                    </a>
                </div>
            </div>
        );
    }
}

export default LevelOneNav;