import React from "react";
import Search from "../../components/search/search.js";

const FuzzySearchControl = React.createClass({
    fuzzySearchHandler(keyFlag, keyword){
        let params = {},
            arr = [{key:'search_shop_name',value:''},{key:'search_name',value:''}];
        arr.map((el, index)=>{
            if (index == keyFlag) {
                params[el["key"]] = keyword;
            } else {
                params[el["key"]] = "";
            }
        });
        params.page = 1;
        this.props.searchHandler(params);
    },
    render(){
        return <Search emit={this.fuzzySearchHandler} dropdownMenus={this.props.dropdownMenus}/>;

    }
});

export default FuzzySearchControl;