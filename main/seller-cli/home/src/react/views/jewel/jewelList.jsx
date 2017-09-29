/**
 * Created by Doden on 2017.06.01
 */

import React from 'react';

class JewelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardList: [],
            final: true,
            me: {},
            page: 1,
            size: 10
        };
    }

    componentWillMount(){
        new Promise((resolve)=>{
            this.getMe(resolve);
        }).then(()=>{
            this.getJewelList();
        });

    }

    componentDidMount(){
        this.createScroll();
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

        let SCROLL = new IScroll('#jewelList', scrollOptions);
        this.SCROLL = SCROLL;

        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 300) {
                this.state.page++;
                new Promise(() => {
                    this.getJewelList();
                });
            }
        });
    }

    getMe(resolve){
        H.server.getMe({}, (res)=>{
            if(res.code == 0){
                let me = res.data.shop_infos;
                this.setState({
                    me: me
                });
                resolve('ok');
            } else{
                H.toast(res.message);
            }
        });
    }

    getJewelList(){
        let cardList = this.state.cardList;
        H.loading.show();

        H.server.getJewelDetail({page: this.state.page, size: this.state.size}, (res)=>{
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

    createJewelList(){
        let list = [];

        this.state.cardList.map((card, i)=>{
           list.push(<div className="jewel-detail-li" key={i}>
               <div className={'jewel-num '+(card.diamond<0?'sub':'add')}>{card.diamond<0?card.diamond:'+'+card.diamond} 钻石</div>
               <div className="jewel-num-info">
                   <p>{card.show_text}</p>
                   <p>{card.created_at}</p>
               </div>
           </div>);
        });

        return list;
    }

    render() {
        return (<div className="jewel-detail-list" id="jewelList">
            <div className="scroller" id="scroll">
                <div className="jewel-current">
                    <p><i className="icon jewelL"></i>当前可用钻石</p>
                    <p>{this.state.me.diamond}</p>
                </div>
                <div className="jewel-detail-ul">
                    {this.createJewelList()}
                </div>
                <div className="jewel-footer">
                    没有更多啦~
                </div>
            </div>
        </div>);
    }
}

export default JewelList;