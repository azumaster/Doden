/**
 * 我的（未开放）
 * Created by Doden on 2017.06.19
 */

import React from 'react';

class Me extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            me: null,
            marriage: []
        };
    }

    componentWillMount(){
        H.loading.show();
        new Promise((resolve)=>{
            this.getOptions(resolve);
        }).then(()=>{
            this.getData();
        }).then(()=>{
            H.loading.hide();
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){

        let SCROLL = new IScroll('#mePage', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    // 获取婚姻选项
    getOptions(resolve){
        H.server.getMarriage({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    marriage: res.data
                }, ()=>{resolve('ok');});
            }else {
                H.toast(res.message);
            }
        });
    }

    // 获取用户个人信息
    getData(){
        H.server.getMe({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    me: res.data
                });
            }else {
                H.toast(res.message);
            }
        });
    }

    createMyInfo(){
        let me = this.state.me;
        if(!me) return null;

        let gender = ['女', '男'],
            marriage = this.state.marriage,
            meMarriage = '';

        marriage.map((m)=>{
            if(m.code == me.personal_details.marriage){
                meMarriage = m.name;
            }
        });

        return (<div className="info-body">
            <div className="info-title">
                <p className="info-name">个人信息</p>
                {/*<p className="info-link">修改</p>*/}
            </div>
            <div className="info-ul">
                <div className="info-li">
                    <p className="info-li-label">姓名</p>
                    <p className="info-li-name">{me.personal_details.name}</p>
                </div>
                <div className="info-li">
                    <p className="info-li-label">身份证号码</p>
                    <p className="info-li-name">{me.personal_details.id_card_no}</p>
                </div>
                <div className="info-li">
                    <p className="info-li-label">性别</p>
                    <p className="info-li-name">{gender[me.personal_details.gender]}</p>
                </div>
                <div className="info-li">
                    <p className="info-li-label">婚姻状况</p>
                    <p className="info-li-name">{meMarriage}</p>
                </div>
                <div className="info-li">
                    <p className="info-li-label">电子邮箱</p>
                    <p className="info-li-name">{me.personal_details.email}</p>
                </div>
                <div className="info-li">
                    <p className="info-li-label">个人手机号码</p>
                    <p className="info-li-name">{me.personal_details.mobile_codes}</p>
                </div>
            </div>
        </div>);
    }
    createCard(){
        let me  = this.state.me,
            cardList = [];

        if(!me) return null;

        me.banks.map((b, i)=>{
            cardList.push(<div key={i} className="info-li">
                <p className="info-li-label">{b.bank_name}（{b.card_number.substr(-4, 4)}）</p>
            </div>);
        });

        return (<div className="info-body">
            <div className="info-title">
                <p className="info-name">我的银行卡</p>
            </div>
            <div className="info-ul">
                {cardList}
            </div>
        </div>);
    }

    render() {
        return (<div id="mePage" className="me-page">
            <div className="scroller">
                {this.createMyInfo()}
                {this.createCard()}
            </div>
        </div>);
    }
}

export default Me;