/**
 * Created by xy on 2017.03.10
 */

import React from 'react';
import { connect } from 'react-redux';
import Action from '../../../redux/actions/action.js';

class Car extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            data: null,   //所有商品;
            editStatus: false,    //是否处于编辑状态
            invalid: [],    //无效的商品列表;
            valid: [],      //有效的商品列表;
            invalidChooseId: [],    //无效商品被选中的数组;
            editDel: [],
            param: {        //下单的数据;
                'address_id': null,
                'payment': 1,
                'delivery': 3,
                'goods': []
            },
            total: {        //底部的合计;
                'goods_count': '',
                'total_amount': ''
            }
        };
        this.createScroll = this.createScroll.bind(this);
    }

    componentWillMount() {
        //获取购物车商品列表;
        this.getGoodsList();
    }

    componentDidUpdate(){
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    //获取购物车商品列表;
    getGoodsList() {
        let param = this.state.param;
        $.loading.show();
        $.req.shoppingCart({}, (res)=>{
            $.loading.hide();
            if(res.code == 0){
                let data = res.data.goods,
                    invalid = [],
                    valid = [];
                for(let i = 0 ; i < data.length ; i++) {
                    if(data[i].available) {
                        valid.push(data[i]);
                        param.goods.push({goods_id: data[i].goods_id, buy_num: data[i].buy_num});
                    }else {
                        invalid.push(data[i]);
                    }
                }
                this.setState({data: data, invalid: invalid, valid: valid});
                this.updateTotal();
                if(data.length > 0) {
                    this.createScroll();
                }
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    createScroll(){
        var wrapper = document.getElementById('carWrap'),
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

    //创建有效商品的列表;
    validGoodsList() {
        let list = [],
            goods = this.state.param.goods;
        if(this.state.editStatus) {
            list = this.state.editValid;
        }else {
            list = this.state.valid;
        }
        return list.map((val, index) => {
            if(!val.available) return null;
            let xml = [];
            if(this.state.editStatus) {
                xml = (
                    <div className="goods-info">
                        <div className="flex">
                            <div className="flex-item">
                                <span className="reduction-num" data-index={index} data-operate="reductionNum"></span>
                                <input className="in-num" data-index={index} type="tel" value={val.buy_num}
                                       onChange={this.changeNum.bind(this)} onBlur={this.blurNum.bind(this)}/>
                                <span className="add-num" data-index={index} data-operate="addNum"></span>
                                <div className="price-item">￥{val.goods_price}</div>
                            </div>
                            <div className="del" data-index={index} data-operate="delValidGoods">删除</div>
                        </div>
                    </div>
                );
            }else {
                xml = (
                    <div className="goods-info">
                        <div className="title">{val.goods_title}</div>
                        <div className="assist flex">
                            <div className="price">￥{val.goods_price}</div>
                            <span className="num">X{val.buy_num}</span></div>
                    </div>
                );
            }

            //循环判断商品是否在param.goods中如果在表示已经被选择;
            let chooseClass = 'icon check';
            for(let i in goods) {
                if(goods[i].goods_id == val.goods_id) {
                    chooseClass = 'icon check-fill';
                    break;
                }
            }
            return (
                <li key={index}>
                    <label className={chooseClass} data-index={index} data-operate="validChoose">
                    </label>
                    <div className="goods-img">
                        <img src={$.cdn() + val.image + $.img(80, 90)} width="30px"/>
                    </div>
                    {xml}
                </li>
            );
        });

    }

    //创建无效商品的列表;
    invalidGoodsList() {
        let list = this.state.invalid,
            choose = this.state.invalidChooseId;
        return list.map((val, index) => {
            return (
                <li key={index}>
                    <label className={choose.indexOf(val.goods_id) == -1 ? 'invalid-item flex-item icon check' : 'invalid-item flex-item icon check-fill'}
                           onClick={this.invalidChoose.bind(this, val.goods_id)}>
                        <span className="invalid-title">{val.goods_title}</span>(暂无货)</label>
                    <a className="icon del del-invalid" onClick={this.delInvalidAll.bind(this, [val.goods_id])}></a>
                </li>
            );
        });
    }

    //删除被选中的无效商品;
    delInvalidAll(data) {
        let invalid = this.state.invalid,
            invalidChooseId = this.state.invalidChooseId,
            d = [].concat(data);
        if(data.length <= 0) return;
        $.req.shoppingCartDel(JSON.stringify({goods_ids: d}), (res) => {
            if(res.code == 0) {
                //删除成功之后需要把无效商品的state数据也删除;
                for(let n = 0 ;n < d.length ; n++) {
                    for(let m = 0 ; m < invalid.length ; m++) {
                        if(d[n] == invalid[m].goods_id) {
                            invalid.splice(m, 1);
                        }
                    }
                    invalidChooseId.splice(invalidChooseId.indexOf(d[n]), 1);
                }
                this.setState({invalid: invalid, invalidChooseId: invalidChooseId});
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //无效商品单个选中取消;
    invalidChoose(id) {
        let invalidChooseId = this.state.invalidChooseId,
            index = invalidChooseId.indexOf(id);
        if(index == -1) {
            invalidChooseId.push(id);
        }else {
            invalidChooseId.splice(index, 1);
        }
        this.setState({invalidChooseId: invalidChooseId});
    }

    //无效商品全选;
    invalidAllChoose(e) {
        let className = e.target.className,
            invalid = this.state.invalid,
            invalidChooseId = [];
        if(className.indexOf('check-fill') == -1) {
            for(let i in invalid) {
                invalidChooseId.push(invalid[i].goods_id);
            }
        }
        this.setState({invalidChooseId: invalidChooseId});
    }


    //全选择有效商品;
    validAllChoose(e) {
        let className = e.target.className,
            valid = this.state.valid,
            param = this.state.param;
        param.goods = [];
        if(className.indexOf('check-fill') == -1) {
            for(let i in valid) {    //把所有有效商品加入的param中;
                param.goods.push({goods_id: valid[i].goods_id, buy_num: valid[i].buy_num});
            }
        }
        this.updateTotal();
        this.setState({param: param});
    }

    //有效商品单个选中和取消
    validChoose(index) {
        let valid = this.state.valid,
            param = this.state.param,
            bool = false;
        for(let i in param.goods) {
            if(param.goods[i].goods_id == valid[index].goods_id) {
                param.goods.splice(i, 1);
                bool = true;
                this.updateTotal();
                break;
            }
        }
        if(!bool) {
            param.goods.push({goods_id: valid[index].goods_id, buy_num: valid[index].buy_num});
            this.updateTotal();
        }
        this.setState({param: param});
    }

    //编辑商品;
    editGoods(bool) {
        let editValid,
            valid = this.state.valid;
        if(bool) {  //进入编辑状态;
            editValid = JSON.parse(JSON.stringify(valid));
        }else {  //完成编辑状态;
            let editV = this.state.editValid,
                param = this.state.param,
                editDel = this.state.editDel,
                updateNumParam = {goods: []};
            //更新数量;
            for(let i = 0 ; i < editV.length ; i++) {
                for(let n = 0 ; n < valid.length ; n++) {
                    if(editV[i].goods_id == valid[n].goods_id && editV[i].buy_num != valid[n].buy_num) {
                        updateNumParam.goods.push({goods_id: editV[i].goods_id, buy_num: editV[i].buy_num});
                    }
                }
            }
            if(updateNumParam.goods.length > 0) {   //更新数量的参数如果有已经商品修改了数量;\需要更新购买数量;
                this.updateNum(updateNumParam);
            }
            //把更改后的商品列表放在参数的goods中;
            valid = JSON.parse(JSON.stringify(editV));
            param.goods = [];
            for(let i = 0 ; i < valid.length ; i++) {
                if(valid[i].available) {
                    param.goods.push({goods_id: valid[i].goods_id, buy_num: valid[i].buy_num});
                }
            }
            if(editDel.length > 0 ||updateNumParam.goods.length > 0) {
                this.updateTotal();
            }
        }
        this.setState({editStatus: bool, editValid: editValid, valid: valid});
    }

    //商品列表中的点击事件;选择商品，加减，删除等操作;
    goodsClick(e) {
        let node = e.target,
            index = node.dataset.index,
            operate = node.dataset.operate;
        if(!operate) return;
        this[operate](index);
    }

    //对有效商品的数量执行增加操作;
    addNum(index) {
        if(this.state.updateNumState) return;
        let editValid = this.state.editValid;
        editValid[index].buy_num++;
        this.setState({editValid: editValid});
    }

    //对有效商品的数量执行减少操作;
    reductionNum(index) {
        if(this.state.updateNumState) return;
        let editValid = this.state.editValid;
        if(editValid[index].buy_num > 1) editValid[index].buy_num--;
        this.setState({editValid: editValid});
    }

    //删除有效商品;
    delValidGoods(index) {
        let editValid = this.state.editValid,
            param = this.state.param,
            editDel = [],
            data = editValid[index];
        editDel.push(JSON.parse(JSON.stringify(data)));
        $.dialog({
            title: '删除商品',
            content: '<div class="add-car-dialog"><div class="flex hd border-bottom">' +
            '<div><img class="goods-img" src="'+$.cdn() + data.image + $.img(80, 90) +'" width="60px" aria-checked="60px" /></div>' +
            '<div class="flex-item goods-info"><div>商品名：'+data.goods_title+'</div><div>价格：'+data.goods_price+'元*'+data.buy_num+'</div></div></div>' +
            '<div class="edit-num">您确定要删除此商品吗？</div></div>',
            cancel: '取消',
            okCallback: () => {
                $.req.shoppingCartDel(JSON.stringify({goods_ids: [data.goods_id]}), (res) => {
                    if(res.code == 0) {
                        for(let i = 0 ; i < param.goods.length ; i++) {
                            if(param.goods[i].goods_id == data.goods_id) {
                                param.goods.splice(i, 1);
                            }
                        }
                        editValid.splice(index, 1);
                        this.setState({editValid: editValid, param: param, editDel: editDel});
                    }else {
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });
    }

    //输入框失去焦点时更新数量并提交到服务器;
    blurNum(e) {
        let node = e.target,
            editValid = this.state.editValid,
            index = node.dataset.index;
        editValid[index].buy_num = node.value;
        setTimeout(() => {this.state.updateNumState = false;}, 100);
    }

    //输入框值改变只更新valid的数量,不提交到服务器;
    changeNum(e) {
        let node = e.target,
            index = node.dataset.index,
            valid = this.state.editValid;
        valid[index].buy_num = node.value;
        this.state.updateNumState = true;
        this.setState({editValid: valid});
    }

    //更新购物车商品数量;
    updateNum(param) {
        $.req.updateNum(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                this.forceUpdate();
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //动态计算购物车商品数量和金额;
    updateTotal() {
        let param = {goods: this.state.param.goods};
        $.req.updateTotal(JSON.stringify(param), (res) => {
            if(res.code ==0) {
                this.setState({total: res.data});
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //去结算;
    next() {
        this.props.setCarConfirmData({
            param: this.state.param,
            total: this.state.total,
            valid: this.state.valid
        });
        location.href = '#/buyer/car/confirm';
    }

    render() {
        let param = this.state.param,
            valid = this.state.valid,
            invalid = this.state.invalid;
        if(!this.state.data) return null;
        if(valid.length <= 0 && invalid.length <= 0) {
            return (
                <div className="car-goods-no">
                    <img src={$.cdn() + 'Public/service-provider/images/car-goods-no.png'} />
                    <p className="note">您的进货单为空哦，快去买货吧~</p>
                    <a className="btn btn-full btn-primary" href="#/buyer/buy">去买货</a>
                </div>
            );
        }
        return (
            <div className="car-step1">
                <div id="carWrap" className="car-wrap">
                    <div className="scroller">
                        {
                            valid.length > 0 ?
                                <div className="goods-list">
                                    <div className="hd border-bottom justify-space-between flex">
                                        <label className={param.goods.length == valid.length ? 'all-choose icon check-fill' : 'all-choose icon check'}
                                               onClick={this.validAllChoose.bind(this)}>全选</label>
                                        {
                                            this.state.editStatus ? <a className="edit complete" onClick={this.editGoods.bind(this, false)}>完成</a>
                                                : <a className="edit" onClick={this.editGoods.bind(this, true)}>编辑</a>
                                        }
                                    </div>
                                    <ul className="bd" onClick={this.goodsClick.bind(this)}>
                                        {this.validGoodsList()}
                                    </ul>
                                </div> : null
                        }
                        {
                            invalid.length > 0 ?
                                (<div className="invalid-goods">
                                    <div className="hd flex justify-space-between">
                                        <label className={this.state.invalidChooseId.length == invalid.length ? 'all-choose icon check-fill' : 'all-choose icon check'}
                                                onClick={this.invalidAllChoose.bind(this)}>无效商品</label>
                                        <div>共{invalid.length}件<a className="icon del del-invalid" onClick={this.delInvalidAll.bind(this, this.state.invalidChooseId)}></a></div>
                                    </div>
                                    <ul className="bd">
                                        {this.invalidGoodsList()}
                                    </ul>
                                </div>) : null
                        }

                    </div>
                </div>
                <div className="car-ft flex border-top">
                    <label className={param.goods.length == valid.length ? 'all-choose icon check-fill' : 'all-choose icon check'}
                           onClick={this.validAllChoose.bind(this)}>全选</label>
                    <div className="flex-item price-item">
                        <div>合计<span className="total-price">￥{this.state.total.total_amount}</span></div>
                        <div>共{this.state.total.goods_count}件</div>
                    </div>
                    {
                        this.state.editStatus || this.state.param.goods.length <= 0 ? <div className="settlement-btn disable">去结算</div>
                            : <div className="settlement-btn" onClick={this.next.bind(this)}>去结算</div>
                    }
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = () => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCarConfirmData: (data)=>{Action(dispatch, 'fetchCarConfirmData', data);}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Car);