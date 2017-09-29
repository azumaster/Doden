/**
 * Created by Administrator on 2016/2/1.
 * 时间搜索栏
 */
var React = require('react');
var DropDown = require('../drop_down/drop-down.js');
var ChooseTime = require('../choose_time/choose-time.js');
var Btn = require('../btn/btn.js');


/*时间搜索栏;*/
var TimeSearch = React.createClass({
    getInitialState: function () { /*初始state数据;*/
        return {
            selVal:0
        }
    },
    changeHandlerStart: function(time){  /*从子组件传过来的开始时间;*/
        //this.setState({startTime: time});
        var str = this.props.prefix ? this.props.prefix : "";
        var endTimeVal = $("#"+str+"endTime").val();
        if(time > endTimeVal){
            return false;
        }else {
            return true;
        }
    },
    changeHandlerEnd: function(time){  /*从子组件传过来的结束时间;*/
        //this.setState({endTime: time});
        var str = this.props.prefix ? this.props.prefix : "";
        var startTimeVal = $("#"+str+"startTime").val();
        if(startTimeVal > time){
            return false;
        }else {
            return true;
        }
    },
    backSelVal: function (val) {
        this.setState({selVal:val},function () {
            //alert(val);
        });
    },
    searchSub: function (e) {
        e.preventDefault();
        var selVal = this.state.selVal;
        this.props.emit && this.props.emit(selVal);
    },
    render: function () {
        return (
            <div>
                <DropDown dropdownData={this.props.dropdownMenus} changeEv={this.backSelVal} selectVal={this.state.selVal} />
                <ChooseTime changeHandler={this.changeHandlerStart} num="7" id={(this.props.prefix?this.props.prefix:"")+"startTime"} />—
                <ChooseTime changeHandler={this.changeHandlerEnd} num="0" id={(this.props.prefix?this.props.prefix:"")+"endTime"} />
                <Btn name="筛选" btnEvent={this.searchSub} />
            </div>
        )
    }
});

module.exports = TimeSearch;