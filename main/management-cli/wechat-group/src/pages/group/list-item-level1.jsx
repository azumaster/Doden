/**
 * item: {
                "menu_id": 404180513,
                "name": "注册",
                "type": "view",
                "value": "http://test.auth.zdongpin.com",
                "sub_button": [
                    {
                        "name":"菜单名",
                        "type":"view",
                        "value":"http://auth.zdongpin.com"
                    }
                ]
            }
 *
 * */
import React from 'react';
import Select from '../../components/select/main.jsx';
import Level2 from './list-item-level2.jsx';

class Level1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {}
        };
    }

    static propTypes = {
        item: React.PropTypes.object.isRequired,
        index: React.PropTypes.number.isRequired,
        menuTypes: React.PropTypes.array.isRequired,
        setTop: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.setState({
            item: this.props.item
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState({
            item: nextProps.item
        });
    }

    leve1NameChangeHandle = (e) => {
        console.log(e.target.value);

        this.state.item.name = e.target.value;
        //this.setState({
        //    item: this.state.item
        //});
        this.updataState(this.state.item);
    }

    leve1TypeChangeHandle = (type) => {
        console.log(type);

        this.state.item.type = type;
        //this.setState({
        //    item: this.state.item
        //});
        this.updataState(this.state.item);
    }

    leve1UrlChangeHandle = (e) => {
        console.log(e.target.value);

        this.state.item.value = e.target.value;
        //this.setState({
        //    item: this.state.item
        //});
        this.updataState(this.state.item);
    }

    updataState = (newState) => {
        this.setState({
            item: newState
        }, () => {
            this.props.setTop(this.state.item, this.props.index);
        });
    }

    addSubItem = () => {
        if (this.state.item.sub_button.length >= 5) {
            H.dialog('目前最多添加5个子菜单。');
            return;
        }
        this.state.item.sub_button.push({
            name:'',
            type: '',
            value:''
        });
        this.setState({
            item: this.state.item
        });
    }

    getLevel2 = (...data) => {
        let [menuData, index] = data;
        Object.assign(this.state.item.sub_button[index], menuData || {});
        let newState = this.state.item;
        this.updataState(newState);
    }

    render() {
        let menuTypes = this.props.menuTypes,
            sub = this.state.item.sub_button || [],
            item = this.state.item;

        return (
            <li>
                <div className="menu-level-1">
                    <input type="text" className="level-1-name" placeholder="一级名称" value={item.name || ''} onChange={this.leve1NameChangeHandle}/>
                    <Select
                        menuTypes={menuTypes}
                        defaultValue={item.type}
                        selecetChange={this.leve1TypeChangeHandle}/>

                    <input type="text" className="level-1-url" placeholder="url" value={item.value || ''} onChange={this.leve1UrlChangeHandle}/>
                    <button className="btn-addLevel2" onClick={this.addSubItem}>添加二级</button>
                </div>
                {
                    sub.map((el, index) => {
                        return(
                            <Level2
                                key={'sub_' + index}
                                index={index}
                                menuTypes={menuTypes}
                                setSub={this.getLevel2}
                                sub={el}/>
                        );
                    })
                }
            </li>
        );
    }
}

export default Level1;