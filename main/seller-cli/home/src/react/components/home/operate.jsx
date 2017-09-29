/**
 * Created by Doden on 2017.05.04
 */

import React from 'react';

class Operate extends React.Component {
    constructor(props) {
        super(props);
    }

    toHtml(type){
        switch (type){
            case 1:
                window.location.href = '#/setting';
                break;
            case 2:
                window.location.href = '/?m=PublicTemplate&c=ApiPublic&a=laoLaiGet';
                break;
            case 3:
                window.location.href = '#/jewel';
                break;
            case 4:
                window.location.href = '#/help';
                break;
            case 5:
                window.location.href = '/?m=PublicTemplate&c=ApiPublic&a=userFeedback';
                break;
        }
        this.props.stopAuto && this.props.stopAuto();
    }

    openFeedback(){
        if(!document.getElementById('mask')){
            var dialog = document.createElement('div');
            dialog.id = 'mask';
            dialog.className = 'mask';

            dialog.innerHTML = '<div id="dialog" class="dialog">' +
                '<div class="dialog-title">问题反馈</div>' +
                '<div class="dialog-body"><textarea id="fdContent" placeholder="请留下您的宝贵意见..."></textarea></div>' +
                '<div class="dialog-footer">' +
                '<div id="cancel" class="dialog-btn dialog-cancel">取消</div>' +
                '<div id="submit" class="dialog-btn dialog-submit">提交</div>' +
                '</div></div>';

            document.getElementById('app').appendChild(dialog);

            setTimeout(function () {
                document.getElementById('dialog').className = 'dialog active';
            }, 100);

            $('#cancel').click(function () {
                document.getElementById('dialog').className = 'dialog';

                setTimeout(function () {
                    document.getElementById('app').removeChild(document.getElementById('mask'));
                }, 300);
            });

            $('#submit').click(function () {
                var fdContent = document.getElementById('fdContent').value;

                $.ajax({
                    type: 'post',
                    url: '/index.php?m=Buyers&c=user&a=sendmessage',
                    data: {message: fdContent},
                    success: function () {
                        alert('我们已收到您的宝贵意见~');
                        document.getElementById('dialog').className = 'dialog';

                        setTimeout(function () {
                            document.getElementById('app').removeChild(document.getElementById('mask'));
                        }, 300);
                    }
                });
            });
        }
    }

    render() {
        let shopDetail = this.props.shopDetail;

        return (<div className="operate">
            <div className="item">
                <div className="operate-item" onClick={this.toHtml.bind(this, 1)}>
                    <div className="operate-icon"><i className="icon manage"></i></div>
                    <p>店铺管理</p>
                </div>
                <div className="operate-item" onClick={this.toHtml.bind(this, 2)}>
                    <div className="operate-icon"><i className="icon deadbeat"></i></div>
                    <p>老赖查询</p>
                </div>

                {shopDetail.laobanhao==0?<div className="operate-item" onClick={this.toHtml.bind(this, 3)}>
                        <div className="operate-icon"><i className="icon jewel"></i></div>
                        <p>钻石商城</p>
                    </div>
                    :<div className="operate-item">
                        <div className="operate-icon"><i className="icon jewel"></i></div>
                        <p>{shopDetail.diamond}</p>
                    </div>}
            </div>
            <div className="item">
                <div className="operate-item" onClick={this.toHtml.bind(this, 4)}>
                    <div className="operate-icon"><i className="icon helpCenter"></i></div>
                    <p>问题反馈</p>
                </div>
                <div className="operate-item" onClick={this.toHtml.bind(this, 5)}>
                    <div className="operate-icon"><i className="icon feedback"></i></div>
                    <p>问题反馈</p>
                </div>
            </div>
        </div>);
    }
}

export default Operate;