/**
 * Created by Administrator on 2016/2/1.
 * 选择时间
 */
var React = require('react');
var DropDown = require('../drop_down/drop-down.js');
var Btn = require('../btn/btn.js');


/*关键字搜索栏*/
var KeySearch = React.createClass({
    getInitialState: function () {
        return {
            selVal:0
        }
    },
    searchSub: function (e) {
        e.preventDefault();
        var keyVal = this.refs.key.value;
        if(keyVal == null || keyVal == undefined || keyVal == ""){
            alert("搜索的关键词不能为空！");
            return ;
        }
        var selVal = this.state.selVal;
        this.props.emit && this.props.emit(selVal,keyVal);
    },
    backSelVal: function (val) {
        this.setState({selVal:val},function () {
            //alert(val);
        });
    },
    render: function (){
        return (
            <div className="search-w">
                <DropDown dropdownData={this.props.dropdownMenus} changeEv={this.backSelVal} selectVal={this.state.selVal} />
                <input id="component_search_input" className="form-control input-key" type="text" ref="key" />
                <Btn name="搜 索" btnEvent={this.searchSub} />
            </div>
        )
    }
});

module.exports = KeySearch;