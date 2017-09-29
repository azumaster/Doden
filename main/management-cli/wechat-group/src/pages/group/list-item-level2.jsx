/**
 * 
        "sub_button": [
            {
                "name":"菜单名",
                "type":"view",
                "value":"http://auth.zdongpin.com"
            }
        ]
 *
 * */
import React from 'react';
import Select from '../../components/select/main.jsx';

class Level2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subItem: {}
        };
    }

    static propTypes = {
        sub: React.PropTypes.object.isRequired,
        menuTypes: React.PropTypes.array.isRequired,
        setSub: React.PropTypes.func.isRequired
    }

    componentWillMount() {
        this.setState({
            subItem: this.props.sub
        });
    }

    leve2NameChangeHandle = (e) => {
        this.state.subItem.name = e.target.value;
        this.updataState(this.state.subItem);
    }

    leve2TypeChangeHandle = (type) => {
        this.state.subItem.type = type;
        this.updataState(this.state.subItem);
    }

    leve2UrlChangeHandle = (e) => {
        this.state.subItem.value = e.target.value;
        this.updataState(this.state.subItem);
    }

    updataState = (newState) => {
        this.setState({
            subItem: newState
        }, () => {
            this.props.setSub(this.state.subItem, this.props.index);
        });
    }

    render() {
        let menuTypes = this.props.menuTypes,
            sub = this.state.subItem;

        return (
            <div className="menu-level-2" >
                <input type="text" className="level-2-name" placeholder="二级名称" value={sub.name} onChange={this.leve2NameChangeHandle}/>
                <Select menuTypes={menuTypes} defaultValue={sub.type} selecetChange={this.leve2TypeChangeHandle}/>
                <input type="text" className="level-2-url" placeholder="url" value={sub.value} onChange={this.leve2UrlChangeHandle}/>
            </div>
        );
    }
}

export default Level2;