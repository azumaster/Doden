import React from 'react';
import DropDown from '../common/drop-down.js';

class OptionCell extends React.Component{
    constructor(props) {
        super(props);
    }
    backSelVal = (val) => {
        console.log(val);
    };
    render = () => {
        let data = this.props.data;
        return (
            <a className="cell">
                <div className="name">{data.title}</div>
                <div className="options">
                    <DropDown dropdownData={data.optionArr} changeEv={this.backSelVal} selectVal={data.val} />
                </div>
            </a>
        )
    }
}

export default OptionCell;