/**
 * Created by Administrator on 2016/1/29.
 * 分页栏
 * Hu XiaoYu
 */
var React = require('react');
var PageLi = React.createClass({
    getPage: function (){
        this.props.clickEv(this.props.num);
    },
    render: function () {
        var str="";
        if(this.props.classN=="active"){
            str="active"
        }else {
            str="";
        }
        return (
            <li className={str} onClick={this.getPage} >
                <a>{this.props.num}</a>
            </li>
        )
    }
});
var PageCtrlBar = React.createClass({
    getInitialState: function (){
        return {
            pageNum: 1,
            _maxPage: 18,
            numArr: []
        }
    },
    calculatePage: function (n) {
        if(n < 1){
            n=1;
            return;
        }else if(n > this.state._maxPage){
            n=this.state._maxPage;
            return;
        }
        //if(n<=1){
        //    n=1;
        //    return ;
        //}else if(n>=this.state._maxPage){
        //    n=this.state._maxPage;
        //    return ;
        //}
        // TODO 这样写纯属无奈，后续再看能不能优化
        this.setPageData(n,this.state._maxPage,(n)=>{
            this.props.clickCallback && this.props.clickCallback({page: n});
        });

    },
    setPageData: function (n,max,callback) {
        //if(max == "" || !max){
        //    return ;
        //}
        var max = max || 1;
        var arr = [];
        if(max >= 9){
            if(n <= 5){
                arr = [1,2,3,4,5,6,7,8,9];
            }else if(n > 5 && n < max-4){
                for(var i = (n-4);i <= (n+4) ;i++){
                    arr.push(i);
                }
            }else if(n >= max-4){
                for(var i = max-8;i <= max ;i++){
                    arr.push(i);
                }
            }
        }else {
            for(var i = 1 ; i <= max ; i++){
                arr.push(i);
            }
        }
        this.setState({
            pageNum: n,
            _maxPage: max,
            numArr: arr
        }, ()=>{
            callback && callback(n);
        });
    },
    componentWillMount: function () {
        this.setPageData(this.state.pageNum,this.props.maxPage);
    },
    componentWillReceiveProps(nextProps){
        let pageNum = 1;
        if(this.props.pageNum){
            pageNum = this.props.pageNum;
        }else {
            pageNum = this.state.pageNum;
        }
        this.setPageData(pageNum,nextProps.maxPage);
    },
    render: function () {
        var firstDisable = "";
        var lastDisable = "";
        var str=[];
        var thisPage=this.state.pageNum;
        var clickEv = this.calculatePage;
        if(this.state.pageNum == 1){
            firstDisable = "disabled";
        }
        if(this.state.pageNum == this.state._maxPage){
            lastDisable = "disabled";
        }
        this.state.numArr.forEach(function(n,index){
            if(thisPage == n){
                str.push(<PageLi key={index} num={n} clickEv={clickEv} classN="active" />);
            }else {
                str.push(<PageLi key={index} num={n} clickEv={clickEv} />);
            }
        });
        return (
            <nav>
                <ul className="pagination" >
                    <li className={firstDisable} onClick={this.calculatePage.bind(this,1)}>
                        <a aria-label="Previous">
                            首页
                        </a>
                    </li>
                    <li className={firstDisable} onClick={this.calculatePage.bind(this,this.state.pageNum-1)}>
                        <a aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>

                    {str}

                    <li className={lastDisable} onClick={this.calculatePage.bind(this,this.state.pageNum+1)}>
                        <a aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                    <li className={lastDisable} onClick={this.calculatePage.bind(this,this.state._maxPage)}>
                        <a aria-label="Next">
                            <span aria-hidden="true">尾页</span>
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
});

module.exports = PageCtrlBar;
