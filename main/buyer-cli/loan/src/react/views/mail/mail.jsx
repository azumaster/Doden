/**
 * 站内信（未开放）
 * Created by Doden on 2017.06.19
 */

import React from 'react';

class Mail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mails: [],
            final: false,
            page: 1,
            size: 10
        };
    }

    componentWillMount(){
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.SCROLL.refresh();
    }

    createScroll(){

        let SCROLL = new IScroll('#mailPage', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 300) {
                this.state.page++;
                new Promise(() => {
                    this.getData();
                });
            }
        });
    }

    getData(){
        let mails = this.state.mails;
        H.loading.show();

        H.server.getMail({page: this.state.page, size: this.state.size}, (res)=>{
            if(res.code == 0){
                let final = false,
                    mail = res.data.notified;

                if(mail.length<=0){
                    final = true;
                    H.toast('没有更多啦~');
                }

                if(this.state.page == 1){
                    mails = [];
                }

                mails = mails.concat(mail);

                this.setState({
                    mails: mails,
                    final: final
                });
            }else{
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }

    createMailList(){
        let mails = this.state.mails;
        let mailItem = [];

        mails.map((mail, index)=>{
            mailItem.push(<div key={index} className="mail-item">
                <p className="mail-body">{mail.content}</p>
                <p className="mail-date">{mail.notify_time}</p>
            </div>);
        });

        return (<div className="mail-list">
            {mailItem}
        </div>);
    }

    render() {
        return (<div id="mailPage" className="mail-page">
            <div className="scroller">
                {this.createMailList()}
            </div>
        </div>);
    }
}

export default Mail;