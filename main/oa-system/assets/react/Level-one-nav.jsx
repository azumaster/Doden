import React from 'react';
class LevelOneNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: null
        };
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

    //一级菜单点击事件;
    menuOneHandler(o, e) {
        let have = false;

        if(o.url){
            for(let i=0; i<H.newPageList.length; i++){
                if(H.newPageList[i].indexOf(o.url) != -1){
                    have = true;
                    break;
                }
            }

            if(have) {
                window.open('/html/'+o.url+'/index.html');
                return;
            }
        }

        this.props.handler && this.props.handler(o.id);
        $(e.target).parent().siblings().find('a').removeClass('active');
        $(e.target).addClass('active');
    }

    logout(e) {
        e.preventDefault();
        H.server.logout({}, function (res) {
            if (res.code == 0) {
                window.location.href = '/';
            }
        });
    }

    render() {
        let NavLis = '';
        if(this.state.menu != null){
            NavLis = (
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                        <li>
                            <a className="active" onClick={this.menuOneHandler.bind(this, 0)}>首页</a>
                        </li>
                        {
                            this.state.menu.map((el, index)=>{
                                return (<li key={index}><a onClick={this.menuOneHandler.bind(this, el)}>{el.name}</a></li>);
                            })
                        }
                    </ul>
                </div>
            );
        }
        return (
            <div className="section-top-navbar navbar navbar-default">
                <a className="toggle-left-sidebar" href="#">
                    <img src="/images/logo.png" alt="logo" />
                </a>
                <div className="navbar-header">
                    <a className="nav-brand">
                        找冻品网内部OA系统
                    </a>
                </div>
                <a href="#" className="logout" id="logout" onClick={this.logout}><i className="glyphicon glyphicon-off" title="退出"></i></a>
                {NavLis}
            </div>
        );
    }
}

export default LevelOneNav;