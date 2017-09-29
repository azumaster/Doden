/**
 * 卖家中心店铺管理的成员管理
 */
class Member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            roles: [],
            role: 4,
            current: {},
            src: '',
            showNew:false
        };
    }

    /**
     * 准备工作
     */

    componentDidMount(){
        this.getData();
        this.createScroll();
    }

    componentDidUpdate(){
        let memberNew = document.getElementById('memberNew');

        if(memberNew){
            setTimeout(()=>{
                if(this.state.showNew){
                    memberNew.className = 'member-new active';
                }else{
                    memberNew.className = 'member-new';
                }
            }, 100);

        }
    }

    createScroll(){
        let SCROLL = new IScroll('#member', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    /**
     * 获取数据
     */
    async getData(){
        H.loading.show();
        await new Promise(resolve => this.getMe(resolve));
        await new Promise(resolve => this.getMemberList(resolve));
        H.loading.hide();
    }

    // 获取当前用户信息
    getMe(resolve){
        H.server.getWechat({}, (res)=>{
            if(res.status == 0 || res.code == 0){
                this.setState({
                    current: res.data.userInfoArr
                });
            }else{
                H.toast(res.message);
            }
            resolve('ok');
        });
    }

    // 获取成员信息
    getMemberList(resolve){
        H.server.getMembers({}, (res)=>{
            if(res.status == 0 || res.code == 0){
                this.setState({
                    members: res.data.memberInfoArr,
                    roles: res.data.yuangongArr
                });
            }else{
                H.toast(res.message);
            }
            resolve('ok');
        });
    }

    // 获取QR
    getQR(fn){
        let role = this.state.role;

        H.loading.show();
        H.server.getQR({jueShe: role}, res => {
            if(res.status == 0 || res.code == 0){
                this.setState({
                    src: res.picPath
                }, fn);
            }else {
                H.toast(res.message);
            }
            H.loading.hide();
        });
    }


    /**
     * 创建View
     */

    // 创建操作项
    createList(){
        let members = [],
            membersList = this.state.members,
            role = {0: '大老板', 1: '仓管', 2: '接单员', 3: '老板', 4: '普通员工'};

        membersList.reverse();

        membersList.map((member, i)=>{
            members.push(<div className="member">
                <div className="member-img"><img src={member.unionpic}/></div>
                <div className="member-info">
                    <div className="id-card">
                        <p className="name">
                            {member.xingming}

                            {member.laobanhao==0?<span><i className="icon win"></i> {role[member.laobanhao]}</span>:
                                (this.state.current.laobanhao == 0?
                                    (<select className="role" defaultValue={member.laobanhao} data-uid={member.shid} onChange={this.changeMember.bind(this)}>
                                        <option value="2">接单员</option>
                                        <option value="4">普通员工</option>
                                    </select>):<p className="roleName">{role[member.laobanhao]}</p>)
                            }
                            </p></div>
                    <p className="number">{member.lianxitel}</p>
                </div>
                {this.state.current.laobanhao==0?
                    (member.laobanhao!=0?<div data-name={member.xingming} data-uid={member.shid} onClick={this.delMember.bind(this)} className="member-del"><i className="icon del"></i></div>:null):null}
            </div>);
        });

        return (<section className="members">
            {members}
        </section>);
    }

    // 创建按钮
    createBtn() {
        return (<div className="member-btn">
            <div className="add-member" onClick={this.addMember.bind(this)}><i className="icon add"></i>添加员工</div>
        </div>);
    }

    // 创建添加新的成员
    createNew(){
        return (<div id="memberNew" className="member-new">
            <div className="member-sq">
                <h3>扫码绑定</h3>
                <img src={this.state.src}/>
                <div className="select-role">
                    <select onChange={this.changeRole.bind(this)}>
                        <option value="4">普通员工</option>
                        <option value="2">接单员</option>
                    </select>
                </div>
                <p>员工手机扫描二维码，完成注册信息，即可成为员工。</p>
            </div>
            <div onClick={this.closeMember.bind(this)} className="member-close"><i className="icon closeSq"></i></div>
        </div>);
    }

    /**
     * 一些操作
     */

    // 删除成员
    delMember(e){
        let name = e.target.dataset.name?e.target.dataset.name:e.target.parentNode.dataset.name,
            uid = e.target.dataset.uid?e.target.dataset.uid:e.target.parentNode.dataset.uid;

        H.dialog({
            title: '删除员工？',
            content: '<div class="dialog-text"><p>通常情况下，员工离职后你需要删除他。</p><p>你确认要删除'+name+'？</p></div>',
            cancel: true,
            okText: '删除该员工',
            okCallback: ()=>{
                H.server.delMember({uid: uid}, res =>{
                    if(res.code == 0 || res.status == 0){
                        H.toast('已删除'+name);
                        this.getData();
                    }else {
                        H.toast(res.message);
                    }
                });
            }
        });
    }

    // 添加员工
    addMember(){
        this.getQR(()=>{
            this.setState({
                showNew: true
            });
        });
    }

    // 关闭员工
    closeMember(){
        this.setState({
            showNew: false
        }, this.getData);
    }

    // 改变角色
    changeRole(e){
        let role = e.target.value;
        this.setState({
            role: role
        }, this.getQR);
    }

    // 改变员工的角色
    changeMember(e){
        let node = e.target,
            jueShe = node.value,
            uid = node.dataset.uid;
        H.server.changeRole({jueShe: jueShe, uid: uid}, res=>{
           if(res.code == 0 || res.status == 0){
               H.toast('操作成功！');
               this.getData();
           } else {
               H.toast(res.message);
           }
        });
    }

    render() {
        return (<div id="member" className="setting-member">
            <div className="scroller">
                {this.createList()}
                {this.state.current.laobanhao == 0?this.createBtn():null}
            </div>
            {this.state.showNew?this.createNew():null}

        </div>);
    }
}

export default Member;