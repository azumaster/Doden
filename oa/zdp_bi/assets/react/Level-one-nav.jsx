class LevelOneNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: null
        };
    }

    render() {
        return (
            <div className="section-top-navbar navbar navbar-default">
                <a className="toggle-left-sidebar" href="#">
                    <img src="/images/logo.png" alt="logo" />
                </a>
                <div className="navbar-header" style={{width: 'auto'}}>
                    <a className="nav-brand">
                        找冻品网OA系统—系统管理
                    </a>
                </div>
            </div>
        );
    }
}

export default LevelOneNav;