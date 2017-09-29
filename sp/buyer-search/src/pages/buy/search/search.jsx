/*
* 买货分类主页;
* Created by xy on 2017.03.08.
* */
// import React from 'react';
import { connect } from 'react-redux';
import Action from '../../../redux/actions/action.js';
import LeftType from './leftType.jsx';
import RightType from './rightType.jsx';


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            historyStatus: false
        };
    }

    componentWillMount(){
        if(!$.seller) {
            this.props.getContactShop();
        }
        if(!this.props.goodsType) {
            this.getGoodsType();
        }
    }

    componentDidMount() {
        //let b_id = $.urlParam('b_id');
        //if(b_id) {
        //    this.keyWordsSearch(b_id);
        //}
    }

    getGoodsType() {
        let data = {
            status: 0
        };
        this.props.getCustomerType(data);
    }

    //输入关键词搜索;
    keyWordsSearch(val) {
        let param = this.props.param;
        param.search = val;  //关键词搜索时更新搜索的参数;
        param.type_ids = [];
        param.xinghaos = [];
        param.brand_ids = [];
        param.order = [0, true];
        param.halal = null;
        param.page = 1;
        param.state = 1;
        this.props.searchGoods(param);   //请求商品数据;
        this.props.getGoodsFilter({search: val, select: ['halal', 'categories', 'brands']});   //请求筛选项;
        this.setHistoryStatus(false);
        if(!localStorage.searchHistory || localStorage.searchHistory == 'null') {
            localStorage.searchHistory = JSON.stringify([val]);
        }else {
            let arr = JSON.parse(localStorage.searchHistory);
            arr.push(val);
            if(arr.length == 9) {
                arr.splice(0, 1);
            }
            localStorage.searchHistory = JSON.stringify(arr);
        }
        window.location.href = $.seller ? '#/seller/mall/result' : '#/buyer/buy/result';
        return false;
    }

    setHistoryStatus() {
        if(location.href.indexOf('searchHistory') == -1) {
            location.hash = location.hash+'/searchHistory';
        }
    }

    searchSub(e) {
        e.preventDefault();
        this.keyWordsSearch($.selector('#keyWordsVal').value);
    }

    render() {
        if(!this.props.goodsType) return null;
        return (
            <div id="buyerRoute">
                <form method="post" action="" className="flex align-items-center border-bottom search-bar" onSubmit={this.searchSub.bind(this)}>
                    {
                        location.hash.indexOf('searchHistory') != -1 ? <div className="back-page" onClick={() => {history.back();}}></div> : null
                    }

                    <div className="flex-item search-content" >
                        <input id="keyWordsVal" placeholder="点此输入要找的货" type="search" onFocus={this.setHistoryStatus.bind(this)}/>
                    </div>
                    <input type="submit"
                           className="search-btn" value="搜索" />
                </form>
                <a href="#/buyer/collection" className="collection-entry">
                    收藏夹
                </a>
                <LeftType />
                <RightType />
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        goodsType: state.customerType,
        param: state.searchGoodsParam
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getGoodsType: (data)=>{Action(dispatch, 'fetchGoodsType', data);},
        getCustomerType: (data) => {Action(dispatch, 'fetchGetCustomerType', data);},
        setParam: (data)=>{Action(dispatch, 'fetchSetParam', data);},
        searchGoods: (data) => {Action(dispatch, 'fetchSearchGoods', data);},
        getGoodsFilter: (data) => {Action(dispatch, 'fetchGetGoodsFilter', data);},
        getContactShop: (data) => {Action(dispatch, 'fetchGetContactShop', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);