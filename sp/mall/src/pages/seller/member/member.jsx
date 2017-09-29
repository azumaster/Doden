/**
 * Created by Doden on 2017.03.30
 */

import React from 'react';
import Clipboard from 'clipboard';

class member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberList:[],
            clipboard: null
        };
    }

    componentWillMount(){
        this.canOperate();
    }

    componentDidMount(){
        this.createScroll();
        // 把剪贴板绑定到dialog的OK按钮上
        let clipboard = new Clipboard('.btn-dialog-confirm');
        this.setState({
            clipboard:clipboard
        });
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

        let SCROLL = new IScroll('#memberList', scrollOptions);

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    // 是否有权限操作
    canOperate(){
        $.req.canOperateMember({}, (res)=>{
            if(res.code == 0){
                this.getData();
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    getData(){
        $.loading.show();

        $.req.getMemberList({}, (res)=>{
            if(res.code == 0){
                $.loading.hide();
                this.setState({
                    memberList: res.data
                });
            }else {
                $.loading.hide();
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    add(){
        $.req.getMemberLink({}, (res)=>{
            if(res.code == 0){
                $.dialog({
                    title: '新增成员',
                    content:'<div class="link">' +
                    '<input id="memberUrl" class="member-url" type="text" value="'+res.data.url+'">' +
                    '<h5 class="text-muted">请将此链接复制，分享给好友</h5>' +
                    '<h5 class="text-muted">（如果你的手机复制失败，请手动复制以上链接）</h5>' +
                    '</div>',
                    cancel: true,
                    seller: true,
                    okText: '复制链接',
                    okCallback: ()=>{
                        let clipboard = this.state.clipboard;

                        clipboard.on('success', ()=>{
                            $.toast({text:'已复制'});
                        });
                        clipboard.on('error', ()=>{
                            $.toast({text:'复制失败'});
                        });

                    }
                });
                $.selector('#dialogOk').setAttribute('data-clipboard-text', res.data.url);

            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }


    del(e){
        let id = e.target.dataset.id;

        $.dialog({
            content: '<h4>确定要删除该成员？</h4>',
            cancel: true,
            seller: true,
            okText: '删除',
            okCallback: ()=>{
                $.req.deleteMember(JSON.stringify({wechat_openid: id}), (res)=>{
                    if(res.code == 0){
                        $.toast({text: '操作成功'});
                        this.getData();
                    }else {
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });
    }

    createList(){
        let list = [];

        this.state.memberList.map((member, index)=>{
            list.push(<div key={index} className="li">
                <h4 className="pull-left text-muted">{member.wechat_name}</h4>
                <h5 className="pull-right text-green" data-id={member.wechat_openid} onClick={this.del.bind(this)}>删除成员</h5>
            </div>);
        });

        return list;
    }

    render() {
        return (<div id="sellerMember" className="seller-member">
            <div id="memberAdd" className="member-add" onClick={this.add.bind(this)}>新增成员</div>
            <div className="member-list" id="memberList">
                {this.state.memberList.length>0?<div className="ul">
                    {this.createList()}
                </div>:<div className="car-goods-no">
                    <img src={$.cdn() + 'Public/service-provider/images/car-goods-no.png'} />
                    <p className="note">你还没有成员哦~</p>
                </div>}
            </div>

        </div>);
    }
}

export default member;