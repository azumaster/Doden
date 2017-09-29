/**
 * Created by Doden on 2017.05.31
 */

import React from 'react';
import Dialog from '../../components/jewel/dialog.jsx';

class Jewel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            showRules: false,
            final: true,
            meInfo: {},
            cardList: [],
            currentBuy:0,
            page: 1,
            size: 10
        };
    }

    componentWillMount(){
        document.title = '钻石商城';
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
        let li = document.getElementsByClassName('jewel-list-li');

        if(li.length>0){
            if(li.length%2==0){
                li[li.length-1].style.border = 0;
                li[li.length-2].style.border = 0;
            }else{
                li[li.length-1].style.border = 0;
            }
        }
    }

    componentDidUpdate(){
        this.SCROLL.refresh();
    }

    createScroll(){
        let scrollOptions = {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };

        let SCROLL = new IScroll('#jewel', scrollOptions);
        this.SCROLL = SCROLL;

        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 100) {
                this.state.page++;
                new Promise(() => {
                    this.getCardList();
                });
            }
        });
    }

    getData(){
        new Promise((resolve)=>{
            this.getMe(resolve);
        }).then(()=>{
            this.getCardList();
        });
    }

    getCardList(){
        let cardList = this.state.cardList;
        H.loading.show();

        H.server.getCardList({page: this.state.page, size: this.state.size}, (res)=>{

            if(res.code == 0){
                let final = false;
                if(res.data.length<=0) {
                    final = true;
                    H.toast('没有更多啦~');
                }

                if(this.state.page == 1){
                    cardList = [];
                }

                cardList = cardList.concat(res.data);

                this.setState({
                    cardList: cardList,
                    final: final
                });
            }else{
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    getMe(resolve){
        H.server.getMe({}, (res)=>{
           if(res.code == 0){
               let me = res.data.shop_infos;
               this.setState({
                  meInfo: me
               });
               if(resolve){
                   resolve('ok');
               }
           } else{
               H.toast(res.message);
           }
        });
    }

    buy(e){
        let id = e.target.dataset.id;

        this.setState({
            showDialog: true,
            currentBuy:id
        });
    }

    hideDialog(){
        this.setState({
           showDialog: false
        });
    }

    createDialog(){
        let id = this.state.currentBuy,
            current;
        this.state.cardList.map((card)=>{
            if(card.id == id) current = card;
        });
        let body;

        if(current){
            body = (<div className="dialog-buy-body">
                <div className="card-info">
                    <div className="card-img"><img src={H.getCdn()+current.image+'@450w_100Q.png'}/></div>
                    <div className="card-info-des">
                        <div className="card-dialog-name">{current.title}</div>
                        <div className="card-dialog-des"><p>{current.worth+current.unit}</p><p className="card-dialog-price">{current.price}<i className="icon jewelS"></i></p></div>
                    </div>
                </div>
                <div className="card-notice">工作人员将在1个工作日内联系您，遇周末和节假日顺延，请耐心等待。</div>
            </div>);
        }

        let _this = this;

        let options = {
            title: '确认购买',
            body: body,
            okText: '确认',
            submit: function () {
                H.server.buy({id: id}, (res)=>{
                    if(res.code == 0){
                        _this.getMe();
                        H.toast('兑换成功！');
                    }else{
                        H.toast(res.message);
                    }
                });
            }
        };
        return this.state.showDialog?<Dialog options={options} hide={this.hideDialog.bind(this)}></Dialog>:null;
    }

    createRules(){
        if(!this.state.showRules) return null;

        return (<div className="rules-mask">
            <div className="jewel-rules">
                <div className="rules-body">
                    <div className="rules-title">钻石规则</div>
                    <div className="rules-content">
                        <p>如何获取钻石：提现完成后，店铺将依据现金额，获得同等数量的钻石（即1元兑换1个钻石）。</p>
                        <p>钻石怎么用：店铺可以用这个钻石，在钻石商城内兑换各种券（如商城大图，推荐好货等）。</p>
                    </div>
                    <div className="rules-footer"><div className="rules-btn" onClick={this.hideRules.bind(this)}>我知道了</div></div>
                </div>
            </div>
        </div>);
    }

    hideRules(){
        this.setState({
            showRules: false
        });
    }

    toDetail(){
        window.location.href = '#/jewel/jewelList';
    }

    createJewelList(){
        let list = [];

        this.state.cardList.map((card, i)=>{
            list.push(<div className="jewel-list-li" key={i} data-id={card.id} onClick={this.buy.bind(this)}>
                <div className="list-img" data-id={card.id}><img data-id={card.id} src={H.getCdn()+card.image+'@480w_100Q.png'}/></div>
                <div className="list-name" data-id={card.id}>{card.title}</div>
                <div className="list-info" data-id={card.id}><p>{card.worth+card.unit}</p><p className="jewel-price">{card.price}<i className="icon jewelS"></i></p></div>
            </div>);
        });

        return list;
    }

    openRules(){
        this.setState({
            showRules: true
        });
    }

    render() {
        return (<div id="jewel" className="jewel-page">
                <div id="scroller">
                    <div className="jewel-title">
                        <h3>当前钻石</h3>
                        <h1>{this.state.meInfo.diamond}</h1>
                        <h4 onClick={this.toDetail.bind(this)}><i className="icon see"></i>查看明细</h4>
                    </div>
                    {this.state.cardList.length>0?<div>
                        <div className="jewel-list">
                            <div className="jewel-list-title">
                                <p className="title-name">钻石兑换</p>
                                <p className="title-operate" onClick={this.openRules.bind(this)}>钻石规则？</p>
                            </div>
                            <div className="jewel-list-ul">
                                {this.createJewelList()}
                            </div>
                        </div>
                        <div className="jewel-footer">
                            没有更多啦~
                        </div>
                    </div>:<div className="jewel-list">
                        <div className="jewel-list-title">
                            <p className="title-name">钻石兑换</p>
                            <p className="title-operate" onClick={this.openRules.bind(this)}>钻石规则？</p>
                        </div>
                        <div className="no-card">
                            <img src="http://img.idongpin.com/Public/images/seller-cli/nocard.png" />
                            <p>~稍后再来 优惠都被抢光了~</p>
                        </div>
                    </div>
                    }

                </div>
                {this.createDialog()}
                {this.createRules()}
            </div>

        );
    }
}

export default Jewel;