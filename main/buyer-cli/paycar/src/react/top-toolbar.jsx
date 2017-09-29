import React from 'react';

class TopToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: null
        };
        this.telPhone = this.telPhone.bind(this);
    }

    //客服按钮;
    kf() {
        if(this.state.phone) {
            this.telPhone(this.state.phone);
        }else {
            H.we_loading.show();
            H.server.other_phone_customService({}, (res) => {
                H.we_loading.hide();
                if(res.code == 0) {
                    this.setState({phone: res.data.phone});
                    this.telPhone(res.data.phone);
                }else {
                    H.operationState(res.message);
                }
            });
        }
    }

    telPhone(phone) {
        H.sheet({
            title: '联系客服',
            content: '<div class="actionsheet_cell read-only">' +
            '<div class="icon-wrap kf"></div>'+
            '<p style="line-height: 1.6;">服务时间：上午8点-下午6点</p><p style="line-height: 1.6;">找冻品网客服竭诚为您服务</p>'+
            '</div>',
            cancel: '关闭',
            confirm: '拨打电话',
            confirmCallback: () => {
                console.log(phone);
                window.location.href = 'tel:'+phone;
            }
        });
    }

    findGoods() {
        window.location.href = 'index.php?m=Buyers';
    }

    back() {
        history.back();
    }

    render() {
        return (
            <header className="car-toolbar flex-box">
                {
                    this.props.pageStatus == 0 ?
                        <a className="find-goods" onClick={this.findGoods.bind(this)}>找货</a> :
                        <a className="find-goods" onClick={this.back.bind(this)}>返回</a>
                }
                <div className="flex-num1">请确认商品</div>
                <div className="kf-btn" onClick={this.kf.bind(this)}>客服</div>
            </header>
        );
    }
}

export default TopToolbar;