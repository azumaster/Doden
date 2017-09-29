import React from 'react';
import DatePicker from '../../components/datePicker/index.jsx';

const TimeSearchControl = React.createClass({
    search() {
        this.props.searchHandler({page: 1});
    },
    render(){
        return <DatePicker prefix={ this.props.prefix || 'time_' } searchEvt={this.search} />;
    }
});

export default TimeSearchControl;