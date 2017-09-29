/*
 * 左边分类
 * Created by xy on 2017.03.08.
 * */
import React from 'react';
import { connect } from 'react-redux';
import Action from './../../../../redux/actions/action.js';

class LeftType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null
        };
    }

    componentDidMount() {
        this.createScroll();
        let typeStatus = this.props.goodsTypeState,
            list = this.props.goodsType[1],
            arr = [];
        if(!typeStatus[0]) {
            for(let i in list) {
                if(typeof list[i] == 'object') {
                    arr[0] = list[i].type_id;
                    for(let n in list[i]) {
                        if(typeof list[i][n] == 'object') {
                            arr[1] = list[i][n].type_id;
                            break;
                        }
                    }
                    break;
                }
            }
            this.props.setGoodsType(arr);
            $.setCookie('goodsType', JSON.stringify(arr));
        }
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('LeftTypeWrap'),
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

    createLeftType() {
        let type = this.props.goodsType,
            typeStatus = this.props.goodsTypeState[0];
        if(!type || !typeStatus) return;
        let list = type[1],
            XML = [];
        for(let i in list) {
            if(typeof list[i] == 'object') {
                XML.push(<li key={i} data-typeid={list[i].type_id} className={typeStatus == list[i].type_id ? 'active' : ''}>{list[i].type_name}</li>);
            }
        }
        return XML;
    }

    clickHandler(e) {
        let typeId = e.target.dataset.typeid;
        this.props.setGoodsType([typeId]);
    }

    render() {
        return (
            <div id="LeftTypeWrap" className="left-type-wrap" style={{bottom: $.seller && 0}}>
                <div className="scroller">
                    <ul className="type-list" onClick={this.clickHandler.bind(this)}>
                        {this.createLeftType()}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        goodsType: state.customerType,
        goodsTypeState: state.goodsTypeState
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        setGoodsType: (data)=>{Action(dispatch, 'fetchSetGoodsType', data);}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftType);