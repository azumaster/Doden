/*
* 商品列表中的分类筛选;
* create: xy, 2017.03.08.
* */

import { connect } from 'react-redux';
import Action from '../../../redux/actions/action.js';

class TypeFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            state: -1,
            data: []
        };
        this.createScroll = this.createScroll.bind(this);
    }
    //
    //componentWillMount() {
    //    let param = {type_ids: [this.props.currentGoodsType[1]], select: ['categories']};
    //    $.req.getGoodsFilter(JSON.stringify(param), (res) => {
    //        if(res.code == 0) {
    //            this.setState({data: res.data.categories});
    //        }else {
    //            $.toast({text:res.message, icon: 'info'});
    //        }
    //    });
    //}

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('typeFilter'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: true,  //是不中可以横向滚动;
                scrollY: false,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });

        this.state.SCROLL = SCROLL;
    }

    createTypeList() {
        let list = this.props.typeFilter.data,
            state = this.props.typeFilter.state,
            XML = [];
        if(state != -1) {
            XML.push(<div key={-1} className="type-item" data-typeid="-1">全部</div>);
        }else {
            XML.push(<div key={-1} className="type-item active" data-typeid="-1">全部</div>);
        }
        for(let i in list) {
            if(list[i].series == 4) {
                XML.push(<div key={list[i].id} className={state == list[i].id ? 'type-item active' : 'type-item'}
                              data-typeid={list[i].id}>{list[i].sort_name}</div>);
            }
        }

        return XML;
    }

    handler(e) {
        let typeId = e.target.dataset.typeid,
            typeFilter = this.props.typeFilter;
        if(!typeId || typeId == typeFilter.state) return;
        if(typeId == -1) {
            this.props.setParam('type_ids', 0);
        }else {
            this.props.setParam('type_ids', typeId);
        }
        this.setState({state: typeId});
        typeFilter.state = typeId;
        this.props.setTypeFilter(typeFilter);
    }

    render() {
        return (
            <div id="typeFilter" className="type-filter border-bottom">
                <div className="scroller row flex align-items-center" onClick={this.handler.bind(this)}>
                    {this.createTypeList()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        typeFilter: state.typeFilter
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setTypeFilter: (data) => {Action(dispatch, 'fetchSetTypeFilter', data);}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeFilter);