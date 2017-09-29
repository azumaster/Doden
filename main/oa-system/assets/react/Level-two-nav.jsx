/**
 * Created by john on 2016/1/27.
 */
import React from 'react';
import NavLi from './nav-li.jsx';
import TabController from './main-tab.jsx';

class NavController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab:[
                {
                    id : 0,
                    parentId: 0,
                    name : 'home',
                    url : 'home',
                    selected : true,
                    isOpen : true,
                    isRequest : false
                }
            ],
            userInfo: {
                name:'',
                department_id:1,
                login_name:''
            },
            menu: []
        };
        this.stateUpdate = this.stateUpdate.bind(this);
        this.closeTabHandler = this.closeTabHandler.bind(this);
    }

    stateUpdate(tab, nTab){
        let newTab = nTab ? nTab : this.state.tab,
            index = -1;
        for(let i = 0 ; i < newTab.length ; i++) {
            if(newTab[i].id == tab.id && newTab[i].parentId == tab.parentId){
                newTab[i].selected = true;
                index = i;
                if($('#nid_' + newTab[i].parentId + '_' + newTab[i].id)[0]){
                    $('#nid_' + newTab[i].parentId + '_' + newTab[i].id)[0].click();
                }else {
                    $('.nav.nav-list li').removeClass('active');
                }
            }else {
                newTab[i].selected = false;
            }
        }
        if(index == -1) {
            newTab.push(tab);
        }
        this.setState({tab: newTab});
    }

    //获取用户名;
    componentDidMount() {
        H.server.user_info({}, (res) => {
            if(res.code == 0) {
                this.setState({userInfo: res.data.user_infos});
            }else if(res.code == 10106){
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.menu) return;
        if(nextProps.menuId == 0) {
            let tab = {
                id : 0,
                parentId: 0,
                name : 'home',
                url : 'home',
                selected : true,
                isOpen : true,
                isRequest : false
            };
            this.stateUpdate(tab);
        }
        if(!nextProps.menu.navigates[2]) return;
        let menuArr = [],
            obj = nextProps.menu.navigates[2][nextProps.menuId];
        for(let val in obj) {
            menuArr.push(obj[val]);
        }
        this.setState({menu: menuArr});
    }

    //打开个人设置;
    personalSettings(){
        $('.nav.nav-list')
            .find('a')
            .parent()
            .removeClass('active');
        let tab = {
            id : -1,
            parentId: -1,
            name : '权限管理',
            url : 'messageManagement',
            selected : true,
            isOpen: true,
            isRequest: false
        };
        this.stateUpdate(tab);
    }

    //关闭tab标签;
    closeTabHandler(obj) {
        let newTab = this.state.tab;
        for( let i = 0 ; i < newTab.length ; i++) {
            if(newTab[i].id == obj.id && newTab[i].parentId == obj.parentId) {
                newTab[i-1].selected = true; //移出关闭的tab标签后指定它前一个tab为选中状态;
                newTab.splice(i, 1);
                this.stateUpdate(newTab[i-1], newTab);
                break;
            }
        }
    }

    render(){
        let NavLis = this.state.menu.map((el, index)=>{
            return <NavLi
                key={index}
                data={el}
                parentId={this.props.menuId}
                updateTabMenu={this.stateUpdate}
            />;
        });
        return (
            <div className="section-main-holder">
                <div className="section-left-nav left-sidebar">
                    <div className="user-menu">
                        <img src="/images/avatar.png" alt=""/>
                        <div className="user-info">
                            <div className="welcome">welcome</div>
                            <div className="username">{this.state.userInfo.name}</div>
                        </div>
                        {
                            this.state.userInfo.name == 'root' ?
                                (<div className="user-status" id="nid_-1" onClick={this.personalSettings.bind(this, -1)}>
                                    <i className="glyphicon glyphicon-cog" aria-hidden="true" title="设置个人信息"></i>
                                </div>) : ''
                        }
                    </div>
                    {/*nav left menu*/}
                    <ul className="nav nav-list">
                        {NavLis}
                    </ul>
                </div>
                {/*right tab menu*/}
                <TabController
                    userInfo={this.state.userInfo}
                    stateUpdate={this.stateUpdate}
                    closeTabHandler={this.closeTabHandler}
                    tabMenuArr={this.state.tab}
                    userNavigate={this.props.menu}
                />
            </div>
        );
    }
}

export default NavController;