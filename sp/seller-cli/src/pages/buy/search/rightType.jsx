/*
 * 右边分类;
 * Created by xy on 2017.03.08.
 * */

import { connect } from 'react-redux';
import Action from './../../../redux/actions/action.js';

class RightType extends React.Component {
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
        var wrapper = document.getElementById('RightTypeWrap'),
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

    searchGoods(typeId) {
        let data = this.props.goodsTypeState,
            param = this.props.param;
        data[1] = typeId;
        param.type_ids = [data[1]];
        param.xinghaos = [];
        param.brand_ids = [];
        param.order = [0, true];
        param.halal = null;
        param.page = 1;
        param.state = 2;
        param.search = '';
        this.props.getTypeFilter(data);
        this.props.searchGoods(param);   //请求商品数据;
        this.props.getGoodsFilter({type_ids: [data[1]], select: ['halal', 'brands']});   //请求筛选项;
        window.location.href = $.seller ? '#/seller/mall/result' :'#/buyer/buy/result';
    }

    createTypeList() {
        if(!this.props.goodsTypeState[0]) return null;
        let currentType = this.props.goodsTypeState[0],
            goodsType = this.props.goodsType,
            list = goodsType[1][currentType],
            XML = [];
        for(let i in list) {
            if(typeof list[i] == 'object') {
                XML.push(
                    <li key={i}>
                        <a onClick={this.searchGoods.bind(this, list[i].type_id)}>
                            <img src={$.cdn() + list[i].type_pic_url + $.img(90, 90)} />
                            <span>{list[i].type_name}</span>
                        </a>
                    </li>
                );
            }
        }
        return XML;
    }

    render() {
        return (
            <div id="RightTypeWrap" className="right-type-wrap" style={{bottom: $.seller && 0}}>
                <div className="scroller">
                   <ul className="type-goods-list clear-fix">
                       {this.createTypeList()}
                   </ul>
                </div>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        goodsType: state.customerType,
        goodsTypeState: state.goodsTypeState,
        param: state.searchGoodsParam
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        searchGoods: (data) =>{Action(dispatch, 'fetchSearchGoods', data);},
        getGoodsFilter: (data) => {Action(dispatch, 'fetchGetGoodsFilter', data);},
        getTypeFilter: (data) => {Action(dispatch, 'fetchGetTypeFilter', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RightType);