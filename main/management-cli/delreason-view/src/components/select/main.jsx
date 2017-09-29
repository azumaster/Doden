import React from 'react';

class  Select extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        menuTypes: React.PropTypes.array.isRequired,
        defaultValue: React.PropTypes.string,
        selecetChange: React.PropTypes.func
    }

    getType = (e) => {
        console.log(e.target.value);
        this.props.selecetChange(e.target.value);
    }

    render() {
        let menuTypes = this.props.menuTypes,
            defaultVal = this.props.defaultValue || 0;
        return (
            <select name="menu-type" className="level-1-type" value={defaultVal} onChange={this.getType}>
                <option value="0">
                    --请选择菜单类型--
                </option>
                {menuTypes.map((el, index) => {
                    return (
                        <option
                            key={'s_' + index}
                            value={el.menu_type_value}>{el.menu_type_name}</option>
                    );
                })}
            </select>
        );
    }
}

export default Select;