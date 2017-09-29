import React from 'react';
import Level from './list-item-level1.jsx';

class MenuListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdded: false
        };
    }

    static propTypes = {
        menuItem: React.PropTypes.object.isRequired,
        menuTypes: React.PropTypes.array.isRequired
    }

    componentWillMount() {
        if (this.props.menuItem.menu_info.length === 0) {
            this.setState({
                isAdded: true
            });
        }
    }

    domGenerate(itemArr) {
        let arr = itemArr,
            len = arr.length;
        // 保证最多可以设置3条菜单
        if (len < 3) {
            let count = 3 - len;
            for (var i = 0; i < count; i++) {
                arr.push({
                    name: '',
                    type: '',
                    value: '',
                    sub_button: []
                });
            }
        }
        return (arr.map((el, index) => {
            return(
                <Level
                    key={'c_' + index}
                    index={index}
                    menuTypes={this.props.menuTypes}
                    setTop={this.getLevel1}
                    item={el}/>
            );
        }));
    }

    getLevel1 = (...data) => {
        let [menuData, key] = data;
        Object.assign(this.props.menuItem.menu_info[key], menuData || {});
    }

    // 过滤掉空菜单数据
    // 如果二级不为空，则包含该二级菜单的一级菜单即使是空也不进行过滤，交由后台验证提示
    filter = (data) => {
        let arr = [];
        data.forEach((el, index) => {
            if((el.name || el.type || el.value) && el.sub_button.length === 0) {
                // 一级不为空，二级为空
                arr.push(el);
            } else if ((el.sub_button.length !== 0)) {
                let subArr = [];
                // 这里其实分两种情况：
                // (el.name || el.type || el.value)：一级不为空，二级不为空 组装数据发起正常请求
                // ！(el.name || el.type || el.value)一级为空，二级不为空，发起请求，后台验证通不过提示管理员修改
                arr.push(el);
                el.sub_button.forEach((subEl) => {
                    if (subEl.name || subEl.type || subEl.value) {
                        subArr.push(subEl);
                    }
                });
                arr[index].sub_button = subArr;
            }   
        });      

        return arr;      
    }

    // 保存操作
    conditionalSubmitHandler = () => {
        let newMenuData = this.props.menuItem,
            flag = true;
        newMenuData.menu_info.forEach((el) => {
            let sub = el.sub_button || [];
            if (!el.name && el.type != 0) {
                H.dialog('一级菜单名称未填写');
                flag = false;
            } else if (el.type == 0 && el.name) {
                H.dialog('一级菜单类型未填写');
                flag = false;
            }
            
            sub.forEach((el) => {
                if (el.type == 0 && el.name) {
                    H.dialog('二级菜单类型未填写');
                    flag = false;
                } else if (!el.name && el.type != 0) {
                    H.dialog('二级菜单名称未填写');
                    flag = false;
                }
            });
        });

        if (!flag) return;

        let newMenuFilterData = this.filter(newMenuData.menu_info);

        // 应老后台要求传字符串
        let params = {
            data: JSON.stringify({
                group_id: this.props.menuItem.group_id,
                status: this.state.isAdded ? 1 : 2,
                menu_id: newMenuData.menu_info[0].menu_id || '',
                menu: newMenuFilterData || []
            })
        };
        H.server.wechat_menu_set(params, (res) => {
            H.dialog(res.message);
        });
    }

    render() {
        let group = this.props.menuItem,
            menuItemInfo = group.menu_info;
        return (
            <div className="menu-list-item">
                <h3 className="item-name">组名： {group.group_name}</h3>
                <div className="list-item-forms">
						<span className="tag">
							导航：
						</span>
                    <div className="forms-w">
                        <ul>
                            {this.domGenerate(menuItemInfo)}
                        </ul>
                        <button className="btn-save" onClick={this.conditionalSubmitHandler}>保存</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MenuListItem;