/**
 * Created by Administrator on 2016/2/1.
 * 下拉选择
 */
import React from "react";

/*选择下拉框,select标签;*/
class DropDown extends React.Component {

    constructor(props) {
        super(props);
    }

    selChange() {
        if(this.props.changeEv) {
            this.props.changeEv(this.refs.selectNode.value);
        }
    }

    render() {
        let data = this.props.dropdownData ? this.props.dropdownData : [];
        var val = 0;
        if(this.props.selectVal){
            val = this.props.selectVal;
        }
        var checkData = "";
        if(this.props.checkData){
            checkData = this.props.checkData;
        }
        return (
            <select value={val} className="form-control" onChange={this.selChange.bind(this)} ref="selectNode">
                {
                    React.Children.map(data, function (name, index) {
                        var optionVal = '';
                        if(checkData[index]){
                            optionVal = checkData[index];
                        }else {
                            optionVal = index;
                        }
                        return <option value={optionVal} key={index} >{name}</option>;
                    })
                }
            </select>
        );
    }
}

export default DropDown;