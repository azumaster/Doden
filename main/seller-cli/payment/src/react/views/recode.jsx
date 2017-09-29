/**
 * 提现记录
 * Created by Doden on 2017.07.10
 */

import React from 'react';

class Recode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recodeList: [],
            final: true,
            finalRecode: false,
            params: {
                page_num: 1,
                page_size: 10
            }
        };
    }

    componentDidMount(){
        this.getData();
        this.createScroll();
    }

    componentDidUpdate(){
        this.SCROLL.refresh();
    }

    createScroll(){
        H.scroll('#paymentRecode', (SCROLL)=>{
            this.SCROLL = SCROLL;
            SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if (this.state.final) return;
                if ((SCROLL.y - SCROLL.maxScrollY) < 100) {
                    this.state.params.page_num++;
                    new Promise(() => {
                        this.getData();
                    });
                }
            });
        });
    }

    async getData(){
        let recodeList = this.state.recodeList;

        H.loading.show();

        await new Promise((resolve)=>{
            H.server.getRecode(this.state.params, (res)=>{
                if(res.code == 0){
                    let final = false;
                    if(res.data.data.length<=0) {
                        final = true;
                        H.toast('没有更多啦~');
                    }

                    if(this.state.params.page_num == 1){
                        recodeList = [];
                    }

                    recodeList = recodeList.concat(res.data.data);

                    this.setState({
                        recodeList: recodeList,
                        final: final,
                        finalRecode: true
                    });
                }else {
                    H.toast(res.message);
                }
                resolve('ok');
            });
        });

        H.loading.hide();
    }

    createList(){
        let list = [],
            recodeList = this.state.recodeList,
            status = {nowWithdraw: '提现中', withdrawYes: '已提现', withdrawNo: '失败了'};

        recodeList.map((recode, i)=>{
            list.push(<div key={i} className="recode-item">
                <div className={'item-icon '+recode.status}>
                    <p><i className="icon wallet"></i></p>
                    <p>{status[recode.status]}</p>
                </div>
                <div className="item-money">
                    <p className={recode.status}>{H.formatMoney(recode.money, 2, '')}</p>
                    <p>提现{recode.orderNum}笔订单</p>
                </div>
                <div className="item-date">
                    <p>{status[recode.status]=='提现中'?recode.startTime:recode.endTime}</p>
                </div>
            </div>);
        });

        return <div className="recode-list">{list}</div>;
    }

    createDefault(){
        return (<div id="orderDefault" className="default" style={{height: window.innerHeight+'px'}}>
            <div className="default-body">
                <div className="default-img"><img src="http://img.idongpin.com/Public/images/seller-cli/no-recode.png@640w_100Q.png" /></div>
                <div className="default-text">
                    <h1>暂无提款记录</h1>
                    <p>您可以点击申请提现进行自动提款</p>
                </div>
            </div>
        </div>);
    }

    render() {
        return (<div className="payment-recode" id="paymentRecode">
            <div className="scroller">
                {this.state.finalRecode?(this.state.recodeList.length>0?this.createList():this.createDefault()):null}

            </div>
        </div>);
    }
}

export default Recode;