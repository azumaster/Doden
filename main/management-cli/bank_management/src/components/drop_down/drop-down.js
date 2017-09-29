/**
 * Created by Administrator on 2016/2/1.
 * 下拉选择
 */
import React from "react";

/*选择下拉框,select标签;*/
var DropDown = React.createClass({
    getInitialState: function() {
        return {
            optionArr: []
        }
    },
    selChange: function () {
        if(this.props.changeEv) {
            this.props.changeEv(this.refs.selectNode.value, this.props.bankId);
        }
    },
    componentWillMount(){
        this.setState({optionArr : this.props.dropdownData});
    },
    componentWillReceiveProps(object){
        this.setState({optionArr : object.dropdownData});
    },
    render: function () {
        var val = 0;
        if(this.props.selectVal){
            val = this.props.selectVal;
        }

        if(this.props.selectVal == null || this.props.selectVal == undefined){
            val = -1;
        }

        return (
            <select value={val} className="form-control" onChange={this.selChange} ref="selectNode">
                <option value='-1' >请选择......</option>
                {
                    React.Children.map(this.state.optionArr,function (name,index) {
                        return <option value={index} key={index} >{name}</option>;
                    })
                }
            </select>
        );
    }
});

module.exports = DropDown;