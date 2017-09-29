import React from "react";
import DatePicker from "../../components/datePicker/index-option.jsx";

let TimeOptionSearchControl = React.createClass({
    timeSearchHandle(key){
        let params = {},
            arr = [1,2];
        params.page = 1;
        params.date_type = arr[key];
        this.props.timeSearchHandler(params);
    },
    render(){
        return <DatePicker prefix="withdraw_" searchEvt={this.timeSearchHandle} dropdownMenus={this.props.dropdownMenus}/>;
    }
});

export default TimeOptionSearchControl;