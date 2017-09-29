
import Level from './../../components/appraise/level.jsx';
import Star from './../../components/appraise/star.jsx';
import Swipe from './../../components/appraise/swipe.jsx';

class Appraise extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            params: {
                page_size: 10,
                page_num: 1
            },
            final: true,
            // 当前状态
            currentTab: 0,
            currentReplay: 0,
            currentReplayIndex: 0,
            // 获得数据
            appraiseList: [],
            appraiseNum: {'allCount': 0, 'goodCount': 0, 'mediumCount': 0, 'poorCount': 0, 'imgCount': 0},
            cardPic: '',
            shopInfo: {},
            appraise: {}
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
        let input = document.getElementById('replayInput'),
            replay = document.getElementById('replay');

        if(input){
            document.getElementById('replayInput').focus();
        }

        if(replay){

        }

    }

    createScroll(){
        let SCROLL = new IScroll('#apprise', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
        SCROLL.on('scrollEnd', () => {
            SCROLL.options.preventDefault = false;
            if (this.state.final) return;
            if ((SCROLL.y - SCROLL.maxScrollY) < 300) {
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
        await new Promise(resolve => this.getShopInfo(resolve));
        await new Promise(resolve => this.getAppraise(resolve));
        H.loading.hide();
    }

    // 获取所有买家评价
    getAppraise(resolve) {
        let params = this.state.params;

        if(this.state.currentTab == 0){
            params.type = 4;
        }else{
            params.type = this.state.currentTab;
        }

        let list = this.state.appraiseList;

        H.server.getAppraise(params, res=>{
            if(res.code == 0) {
                let final = false;

                if(res.data.data.length<=0){
                    final = true;
                }

                if(this.state.params.page_num == 1){
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
            if(resolve) { resolve('ok'); }
        });
    }

    // 获取商铺信息
    getShopInfo(resolve) {
       H.server.getShopInfo({}, (res)=>{
           if(res.code == 0 || res.status == 0){
            H.server.getShopDetail({shop_id: res.data.shopid}, response=>{
                if(response.code == 0 || response.status == 0){
                    this.setState({
                        shopInfo: response.data,
                        cardPic: res.data.cardpic
                    }, this.getApp);
                }else{
                    H.toast(res.message);
                }
                resolve('ok');
            });
           }else {
               H.toast(res.message);
           }
        });
    }

    // 获取店铺评价
    getApp() {
        H.server.getAvg({shop_id: this.state.shopInfo.shop_id}, res=> {
            if (res.code == 0) {
                this.setState({
                    appraise: res.data
                });
            } else {
                H.toast(res.message);
            }
        });
    }


    /**
     * 创建View
     */
    // 创建头部
    createHead(){
        return (<section className="appraise-head">
            <div className="title">
                <div className="shop-head"><img src={H.getCdn()+this.state.cardPic+H.imgSize()[110]}/></div>
                <div className="shop-name"><p>{this.state.shopInfo.shop_name}</p><Level level={this.state.shopInfo.shop_rank}/></div>
                <div className="shop-reception"><span className="precent">{this.state.appraise.shop_integral?this.state.appraise.shop_integral:0}</span><span className="tip">积分</span><p onClick={this.toScore.bind(this)}>积分的使用？</p></div>
            </div>
            <div className="shop-apprise">
                <div className="apprise-star">
                    <div className="star-label">发货速度<Star point={this.state.appraise.delivery_speed} /></div>
                    <div className="star-label">服务态度<Star point={this.state.appraise.service_grade} /></div>
                </div>
            </div>
        </section>);
    }

    // 创建Tab
    createTab(){
        let tabs = [{name:'全部', num: this.state.appraiseNum.allCount}, {name: '好评', num: this.state.appraiseNum.goodCount},
                {name: '中评', num: this.state.appraiseNum.mediumCount}, {name: '差评', num: this.state.appraiseNum.poorCount}],
            tabItem = [];

        tabs.map((tab, i)=>{
            tabItem.push(<div data-index={i} className={'tab-item '+(this.state.currentTab==i?'active':'')} key={i}>{tab.name+'('+tab.num+')'}</div>);
        });

        return (<section className="appraise-tab" onClick={this.changeTab.bind(this)}>
            {tabItem}
        </section>);
    }

    // 创建列表
    createList(){
        let list = [],
            addContent = [],
            datas = this.state.appraiseList;


        datas.map((appraise, i)=>{
            addContent = [];
            let replay = null;

            appraise.addContent.map((add, i)=>{
                addContent.push(<div>
                    <p className="addContent-content" key={i}>{add.content}</p>
                    {add.replay?<p className="appraise-replay">商家：{add.replay}</p>:null}
                </div>);
            });

            if(!appraise.replay){
                //如果没有回复，就要考虑追加是不是有回复
                if(appraise.addContent[0]){
                    if(!appraise.addContent[0].replay){
                        replay = (<i id={'replay'+i} data-index={i} data-id={appraise.addContent[0].id} onClick={this.replay.bind(this)} className="icon mes"></i>);
                    }
                }else{
                    replay = (<i id={'replay'+i} data-index={i} data-id={appraise.id} onClick={this.replay.bind(this)} className="icon mes"></i>);
                }
            }else{
                // 如果有回复，如果追加没有回复就有回复按钮
                if(appraise.addContent[0]){
                    if(!appraise.addContent[0].replay){
                        replay = (<i id={'replay'+i} data-index={i} data-id={appraise.addContent[0].id} onClick={this.replay.bind(this)} className="icon mes"></i>);
                    }
                }
            }

            list.push(<div className="appraise-item">
                <div className="list-head">
                    <div className="head-img"><img src={appraise.buyer.unionPic}/></div>
                    <div className="head-info">
                        <p className="name">{appraise.buyer.unionName}</p>
                        <p className="time">{appraise.created_at}</p>
                    </div>
                    <div className={'head-score '+(appraise.score<0?'down':'up')}>{(appraise.score<0?'':'+')+(appraise.score)}积分</div>
                </div>
                <div className="list-body">
                    <p className="appraise-body">{appraise.content}</p>
                    {appraise.replay?<div className="appraise-replay">商家：{appraise.replay}</div>:null}
                    {appraise.addContent.length>0?
                        <div className="addContent">
                            <p className="addContent-title">追加评论</p>
                            {addContent}
                        </div>
                        :null}
                    {appraise.appraise_img.length>0?<div className="body-swipe"><Swipe imgs={appraise.appraise_img} index={i}/></div>:null}
                </div>
                <div className="list-footer">
                    <div className="foot-info">
                        <p className="size">{appraise.goods.gname+' '+appraise.goods.specification} </p>
                        {/*<p className="order">查看订单</p>*/}
                    </div>
                    <div className="foot-operate">
                        {replay}
                        <span className="zan-item" onClick={this.praise.bind(this)} data-id={appraise.id} data-praise={appraise.praise.length>0?'2':'1'}>
                            <i className={'icon '+(appraise.praise.length>0?'zan-fill active':'zan')}></i>
                            <span className={appraise.praise.length>0?'active':''}>{appraise.praises_num}</span>
                        </span>

                    </div>
                </div>
            </div>);
        });


        return (<section className="appraise-list">
            {list}
        </section>);
    }

    /**
     * 一些事件
     */

    // 去往积分使用
    toScore(){
        window.location.href = '#/appraise/score';
    }

    // 切换Tab
    changeTab(e){
        let index = e.target.dataset.index,
            params = {page_num: 1, page_size: 10};

        if(index){
            this.setState({
                currentTab: index,
                params:params
            }, this.getAppraise);
        }
    }

    // 点赞和取消点赞
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

                if(node[0].className == 'icon zan'){
                    node[0].className = 'icon zan-fill active';
                }else{
                    node[0].className = 'icon zan';
                }

            }else{
                H.toast(res.message);
            }
        });
    }

    // 回复
    replay(e){
        let index = e.target.parentNode.parentNode.parentNode.dataset.reactid.split('.')[6];

        this.setState({
            currentReplay: e.target.dataset.id,
            currentReplayIndex: index
        }, ()=>{
            H.dialog({
                title: '回复评价',
                content: '<div class="replay"><textarea id="replayInput" placeholder="请输入评价内容..."></textarea></div>',
                okText: '确认回复',
                cancel: true,
                okCallback: ()=>{
                    this.toReplay(this.state.currentReplay);
                }
            });
        });
    }

    closeReplay(e){
        if(e.target.dataset.type == 'close'){
            this.setState({
                replay: false
            });
        }
    }

    // 确认回复
    toReplay(id) {
        let index = this.state.currentReplayIndex,
            context = document.getElementById('replayInput').value,
            appraiseList = this.state.appraiseList;

        if(context.length<=0){
            H.toast('不能回复空白内容。');
            return;
        }
        if(context.length>150){
            H.toast('回复内容过多，请修改。');
            return;
        }

        H.server.replay({praise_id: id, content: context}, res =>{
            if(res.code == 0){
                if(appraiseList[index].addContent.length<=0){

                    appraiseList[index].replay = context;
                }else{
                    appraiseList[index].addContent[0].replay = context;
                }

            }else {
                H.toast(res.message);
            }
            this.setState({
                replay: false
            });
        });
    }

    render() {
        return (<div id="apprise" className="appraise-page">
            <div className="scroller">
                {this.createHead()}
                {this.createTab()}
                {this.createList()}
            </div>
        </div>);
    }
}

export default Appraise;