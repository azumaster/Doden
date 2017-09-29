import React from 'react';
import MenuList from './menu-list.jsx';

class Main extends React.Component {
    constructor(){
    	super();
        this.state = {
            isFresh: true,
            menuList: {}
        };
    }

	componentDidMount() {
        this.getMenuList((data) => {
            this.setState({
                menuList: data
            });
        });
	}

    getMenuList = (fn = () => {}) => {
        H.we_loading.show();
        H.server.wechat_menu_list({}, (res) => {
            H.we_loading.hide();
            if (res.code === 0) {
                fn(res.data);
            } else {
                H.dialog(res.message);
            }
        });
    }    

    refresh = () => {
        this.getMenuList((data) => {
            this.setState({
                menuList: data
            });
        });
    }

    render() {
        return (
		    <div className="section-main">
                <button className="btn-refresh" onClick={this.refresh}>刷新分组</button>
                <MenuList 
                    listRefresh={this.getMenuList}
                    menuList={this.state.menuList} />
            </div>
		);
    }
}
export default Main;
