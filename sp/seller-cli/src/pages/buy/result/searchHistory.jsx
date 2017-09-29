/*
* 搜索历史记录;
* */

import { connect } from 'react-redux';
import Action from '../../../redux/actions/action.js';

class SearchHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null
        };
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('searchHistory'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
    }

    handler(e) {
        let val = e.target.dataset.val,
            param = this.props.param;
        if(!val) return;
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
        document.getElementById('keyWordsVal').value = val;
        window.location.href = $.seller ? '#/seller/mall/result' : '#/buyer/buy/result';
    }

    clearHistory() {
        localStorage.searchHistory = null;
        this.forceUpdate();
    }

    render() {
        let h = [],
            d = [];
        if(localStorage.searchHistory && localStorage.searchHistory != 'null') {
            let data = JSON.parse(localStorage.searchHistory);
            for(let i = data.length-1 ; i >= 0 ; i--) {
                if(!data[i]) break;
                h.push(data[i]);
                if(h.length == 4) break;
            }
            for (let i = 0 ; i < data.length ; i++) {
                d.push(data[i]);
                if(d.length == 4) break;
            }
        }

        return (
            <div id="searchHistory" className="search-history" onClick={this.handler.bind(this)}>
                <div className="scroller">
                    <div className="search-history-item border-bottom">
                        <div className="hd flex">
                            <div className="flex-item history icon">历史搜索</div>
                            {
                                h.length > 0 ? <a className="clear-history" onClick={this.clearHistory.bind(this)}>清空记录</a> : null
                            }
                        </div>
                        <div className="bd clear-fix">
                            {
                                h.map((val, index) => {
                                    return (
                                        <a key={index} className="cell-item" data-val={val}>{val}</a>
                                    );
                                })
                            }
                        </div>
                    </div>
                    {
                        d.length > 0 ?
                            <div className="search-history-item">
                                <div className="hd flex">
                                    <div className="flex-item"><span className="try icon"></span>可以试试</div>
                                </div>
                                <div className="bd flex flex-wrap-wrap">
                                    {
                                        d.map((val, index) => {
                                            return (
                                                <a key={index} className="cell-item" data-val={val}>{val}</a>
                                            );
                                        })
                                    }
                                </div>
                            </div> : null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        param: state.searchGoodsParam
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        searchGoods: (data) => {Action(dispatch, 'fetchSearchGoods', data);},
        getGoodsFilter: (data) => {Action(dispatch, 'fetchGetGoodsFilter', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchHistory);