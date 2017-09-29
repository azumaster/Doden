/**
 * Created by Administrator on 2016/2/1.
 * 下拉选择
 */
import React from "react";

/*选择下拉框,select标签;*/
class DropDown extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            optionArr: []
        }
    }
    selChange = () => {
        if(this.props.changeEv) {
            this.props.changeEv(this.refs.selectNode.value);
        }
    };
    componentWillMount = () => {
        this.setState({optionArr : this.props.dropdownData});
    };
    render = () => {
        var val = 0;
        if(this.props.selectVal){
            val = this.props.selectVal;
        }
        var checkData = "";
        if(this.props.checkData){
            checkData = this.props.checkData;
        }
        return (
            <select value={val} className="form-control select" onChange={this.selChange} ref="selectNode">
                {
                    this.state.optionArr.map(function (name,index) {
                        var optionVal = "";
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