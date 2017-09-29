
class Help extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            help: [{
                index: '一',
                title: '关于商品上传',
                content: [
                    {question: '。。。。', answer: 'xxxxx'}
                ]}, {
                index: '二',
                title: '关于商品审核',
                content: [
                    {question: 'abc', answer: 'sflksdflk'}
                ]}, {
                index: '三',
                title: '关于商品排序',
                content: [
                    {question: 'abc', answer: 'sflksdflk'}
                ]}, {
                index: '四',
                title: '关于商品维护',
                content: [
                    {question: 'abc', answer: 'sflksdflk'}
                ]}, {
                index: '五',
                title: '关于店铺等级',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}, {
                index: '六',
                title: '关于钻石商城',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}, {
                index: '七',
                title: '关于集采报价',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}, {
                index: '八',
                title: '关于接单',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}, {
                index: '九',
                title: '关于收款',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}, {
                index: '十',
                title: '关于退货',
                content: [
                    {question: '店铺等级是怎么来的？我家迪纳普现在平台排名是多少？', answer: '店铺等级功能还在完善中'}
                ]}]
        };
    }

    /**
     * 准备工作
     */

    componentDidMount(){
        this.createScroll();
    }

    createScroll(){
        let SCROLL = new IScroll('#help', H.scrollOption);
        this.SCROLL = SCROLL;

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }


    /**
     * View构建
     */

    // 创建头部
    createHead(){
        return (<div className="help-header">
            <div className="help-img"><img src={H.getCdn()+'/Public/images/seller-cli/home/help.png@150w_100Q.png'}/></div>
        </div>);
    }


    // 创建列表
    createList(){
        let help = this.state.help;

        let helpList = [];
        help.map((h, i)=>{
            let helpContent = [];
            h.content.map((c, j)=>{
                helpContent.push(<div key={i+'_'+j} className="help-content">
                    <div className="question">问：{c.question}</div>
                    <div className="answer">答：{c.answer}</div>
                </div>);
            });

            helpList.push(<li key={i}>
                <div className="help-title" >
                    <div className="title-name"><span className="help-index">{h.index}</span>{h.title}</div>
                    <i className="icon right" onClick={this.open.bind(this)}></i>
                </div>
                {helpContent}
            </li>);
        });

        helpList.push(<li key={help.length}>
            <div className="help-title">
                <div className="title-name"><span className="help-index"></span>以上信息仍不能解决我的问题</div>
                <i className="icon right"></i>
            </div>
        </li>);

        return (<ul className="help-list">
            {helpList}
        </ul>);
    }

    /**
     * 一些事件
     */

    open(e){
        let node = e.target,
            content = node.parentNode.parentNode.children[1];

        if(node.className.indexOf('active') == -1){
            node.className = 'icon right active';
            content.className = 'help-content active';
        }else{
            node.className = 'icon right';
            content.className = 'help-content';
        }
    }

    render() {
        return (<section id="help" className="help-center">
            <div className="scroller">
                {this.createHead()}
                {this.createList()}
            </div>
        </section>);
    }
}

export default Help;