/**
 * 当前店铺的所有评价
 * Created by Doden on 2017.07.07
 */

import Swipe from './../components/appraise/swipe.jsx';

class Appraise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                page_size:10,
                page_num: 1
            },
            final: true,
            // 当前状态
            currentType: 1,
            // 获取数据
            appraiseList: [],
            appraiseNum: {allCount: 0, goodCount: 0, mediumCount: 0, poorCount: 0, imgCount: 0}
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
        this.SCROLL.refresh();
    }

    createScroll(){
        var SCROLL = new IScroll(document.getElementById('appraise'), {
            zoom: true,
            scrollX: false,
            scrollY: true,
            mouseWhell: true,
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });
        this.SCROLL = SCROLL;
        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 100) {
                this.state.params.page_num++;
                new Promise(() => {this.getAppraise();});
            }
        });
    }

    /**
     * 获取数据
     */
    async getData(){
        H.loading.show();
        await new Promise(resolve => this.getAppraise(resolve));
        H.loading.hide();
    }

    // 获取评论列表
    getAppraise(resolve){
        let params = this.state.params;
        params.type = this.state.currentType;
        params.buy_shop_id = this.props.params.id;

        let list = this.state.appraiseList;

        H.server.getAppraise(params, res=>{
            if(res.code == 0){
                let final = false;

                if(res.data.data.length<=0){
                    final = true;
                    this.setState({
                        params: params
                    });
                }


                if(this.state.params.page_num === 1){
                    list = [];
                }


                list = list.concat(res.data.data);


                this.setState({
                    appraiseList: list,
                    appraiseNum: res.data.diffGrade,
                    final: final
                });
            }else {
                H.toast(res.message);
            }
            if(resolve) resolve('ok');
        });
    }

    // 获取店铺id
    getShopInfo(){

    }

    /**
     * 创建View
     */

    // 创建头部
    createTop(){
        let apprise = [{'name': '好评', 'num': this.state.appraiseNum.goodCount}, {'name': '中评', 'num': this.state.appraiseNum.mediumCount},
                {'name': '差评', 'num': this.state.appraiseNum.poorCount}, {'name': '有图', 'num': this.state.appraiseNum.imgCount}],
            items = [];

        apprise.map((a, i)=>{
            if(i == 3){
                i = 4;
            }
            items.push(<div data-type={i+1} className={'top-item '+((i+1)==this.state.currentType?'active':'')}>{a.name}({a.num})</div>);
        });

        return (<nav className="appraise-top" onClick={this.changeTop.bind(this)}>{items}</nav>);
    }

    // 创建列表
    createList(){
        let list = [],
            addContent = [];

        this.state.appraiseList.map((appraise, index)=>{

            addContent = [];

            appraise.addContent.map((add, i)=>{
                addContent.push(<div>
                    <p className="addContent-content" key={i}>{add.content}</p>
                    {add.replay?<p className="appraise-replay">商家：{add.replay}</p>:null}
                </div>);
            });

            list.push(<div className="appraise-item">
                <div className="item-head">
                    <div className="head-img"><img src={appraise.buyer.unionPic}/></div>
                    <div className="head-info">
                        <p className="name">{appraise.buyer.unionName}</p>
                        <p className="time">{appraise.updated_at?appraise.updated_at:appraise.created_at}</p>
                    </div>
                </div>
                <div className="item-body">
                    <p className="body-content">{appraise.content}</p>
                    {appraise.replay?<div className="appraise-replay">商家：{appraise.replay}</div>:null}
                    {appraise.addContent.length>0?
                        <div className="addContent">
                            <p className="addContent-title">追加评论</p>
                            {addContent}
                        </div>
                        :null}
                    {appraise.appraise_img.length>0?<div className="body-swipe"><Swipe imgs={appraise.appraise_img} index={index}/></div>:null}
                </div>
                <div className="item-footer">
                    <div className="detail">
                        <span className="detail-info">{appraise.goods.gname}</span>
                        {/*<span className="detail-btn">查看订单</span>*/}
                    </div>
                    <div className="foot-operate">
                        <span className="zan-item" onClick={this.praise.bind(this)} data-id={appraise.id} data-praise={appraise.praise.length>0?'2':'1'}>
                            <i className={'icon '+(appraise.praise.length>0?'like-fill active':'like')}></i>
                            <span className={appraise.praise.length>0?'active':''}>{appraise.praises_num}</span>
                        </span>

                    </div>
                </div>
            </div>);

        });

        return (<div className="appraise-list">
            {list}
        </div>);
    }
    /**
     * 一些事件
     */
    // 切换顶部
    changeTop(e){
        let type = e.target.dataset.type,
            params = this.state.params;

            params.page_num = 1;

        if(!type) return;
        if(type == this.state.currentType) return;

        this.setState({
            currentType: type,
            params: params
        }, ()=>{
            this.getAppraise();
            this.SCROLL.scrollTo(0, 0, 200);
        });
    }

    //点赞
    praise(e){
        let type = e.target.dataset.praise?e.target.dataset.praise:e.target.parentNode.dataset.praise,
            id = e.target.dataset.id?e.target.dataset.id:e.target.parentNode.dataset.id;

        let node = e.target.parentNode.children,
            parent = e.target.parentNode;

        H.server.praise({appraise_id: id, type: type}, res =>{
            if(res.code == 0){
                if(parent.dataset.praise == 1){
                    parent.dataset.praise = 2;
                }else{
                    parent.dataset.praise = 1;
                }

                if(node[1].className == 'active'){
                    node[1].className = '';
                    node[1].innerText = Number(node[1].innerText) - 1;
                }else{
                    node[1].className = 'active';
                    node[1].innerText = Number(node[1].innerText) + 1;
                }

                if(node[0].className == 'icon like'){
                    node[0].className = 'icon like-fill active';
                }else{
                    node[0].className = 'icon like';
                }

            }else{
                H.toast(res.message);
            }
        });
    }

    render() {
        return (<div id="appraise" className="appraise">
            <div className="scroller">
                {this.createList()}
            </div>
            {this.createTop()}
        </div>);
    }
}

export default Appraise;