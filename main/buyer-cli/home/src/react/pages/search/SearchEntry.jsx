/*
* 搜索入口页面;
* */
import KeyWordsGoodsList from './search-goods/keyWordsGoodsList.jsx';
import TypeGoodsLis from './search-goods/TypeGoodsList.jsx';
import ShopList from './ShopList.jsx';
import TypeList from './TypeList.jsx';

class SearchEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWay: [{key: 'goods', name: '商品'}, {key: 'shop', name: '店铺'}],   //搜索商品还是店铺;
            wayIndex: 0     //选择的搜索方式;搜商品还是搜店铺。
        };
        this.createPage = this.createPage.bind(this);
        this.getKeyWords = this.getKeyWords.bind(this);
    }

    componentWillMount() {
        if(this.props.searchWay == 'shop') {
            this.state.wayIndex = 1;
        }else if(this.props.searchWay == 'goods') {
            this.state.wayIndex = 0;
        }
        //history.replaceState('#/search', 'search', '');
        //if(route.indexOf('/search/goods/&') != -1 || route.indexOf('/search/shop/&') != -1) {
        //    if(route.indexOf('&/goodsInfo') == -1){
        //        history.replaceState('#' + route, 'keyWord', '');
        //    }
        //}else {
        //    history.replaceState('#/search', 'search', '');
        //}
    }

    //componentWillReceiveProps() {
        //let route = location.hash.substr(1);
        //if(route.indexOf('/search/shop') != -1) {
        //    this.state.wayIndex = 1;
        //}else if(route.indexOf('/search/goods') != -1) {
        //    this.state.wayIndex = 0;
        //}
        //history.replaceState('#/search', 'search', '');
        //if(route.indexOf('/search/goods/&') != -1 || route.indexOf('/search/shop/&') != -1) {
        //    if(route.indexOf('&/goodsInfo') == -1){
        //        history.replaceState('#' + route, 'keyWord', '');
        //    }
        //}else {
        //    history.replaceState('#/search', 'search', '');
        //}
    //}

    createPage() {
        let route = location.hash.substr(1),
            XML = null,
            type = null,
            typeId = null;

        if(location.hash.indexOf('?')!=-1){
            typeId = location.hash.split('?')[1].split('=')[1];
            this.context.typeId = typeId;
            type = 'hotCategory';
        }

        if(this.props.searchWay == 'shop') {
            XML = (<ShopList route={route} keyWords={this.context.keyWords} areaId={this.context.areaId} openGoodInfo={this.openGoodInfo.bind(this)}/>);
        }else if(this.props.searchWay == 'goods' || type == 'hotCategory') {
            if(this.context.keyWords != null) {   //搜索关键词进入的商品列表页;
                XML = (<KeyWordsGoodsList route={route} is_registered={this.context.identity != 3} keyWords={this.context.keyWords} areaId={this.context.areaId}/>);
            }

            if(this.context.typeId) {
                XML = (<TypeGoodsLis route={route} is_registered={this.context.identity != 3} typeId={this.context.typeId} areaId={this.context.areaId}/>);
            }
        }
        return XML;
    }

    // 打开商品详情
    openGoodInfo(good){
        this.props.openGoodInfo && this.props.openGoodInfo(good);
    }

    //输入关键词搜索;
    keyWordsSearch(e) {
        e.preventDefault();
        let keyWords = $('#keyWordsVal').val();
        window.location.href = '#/search/results';
        this.context.setKeyWords(keyWords, this.state.wayIndex);
        H.isGetgoodsData = false;  //搜索关键词重新拉取商品列表数据;
        return false;
    }

    //显示选择要搜索商品还是店铺的选项的弹窗;
    optionWayShow() {
        $('.search-way-wrap').show();
        $('.search-way-options').addClass('show');
    }

    //选择搜索商品的方法;
    optionWay(e) {
        let node = e.target,
            index = node.dataset.index;
        if(index) {
            this.setState({wayIndex: index});
        }
        $('.search-way-wrap').hide();
        $('.search-way-options').removeClass('show');
    }

    //返回上一个上地址;执行了浏览器的返回事件;
    back() {
        let route = location.hash.substr(1);
        if(route == '/search') {
            window.location.href = '#';
        }else if(route.indexOf('?')!=-1){
            window.location.href = '#';
        }else {
            window.location.href = '#/search';
        }
    }

    getKeyWords() {
        $('#keyWordsVal').val(this.context.keyWords);
    }

    render() {
        return (
            <div className="search-page">
                <form method="post" action="" className="flex-box center search-bar" onSubmit={this.keyWordsSearch.bind(this)}>
                    <span className="back-page" onClick={this.back.bind(this)}></span>
                    <div className="flex-num1">
                        <div className="flex-box center search-content">
                            <div className="search-way" onClick={this.optionWayShow.bind(this)}>{this.state.searchWay[this.state.wayIndex].name}</div>
                            <div className="flex-num1">
                                <input id="keyWordsVal" type="text" defaultValue={this.getKeyWords()} />
                            </div>
                        </div>
                    </div>
                    <input type="submit" className="search-btn" onSubmit={this.keyWordsSearch.bind(this)} value="搜索" />
                </form>
                <div className="search-way-wrap" onClick={this.optionWay.bind(this)}></div>
                <div className="search-way-options" onClick={this.optionWay.bind(this)}>
                    <div className="search-list"><span data-index={0}>商品</span><span data-index={1}>店铺</span></div>
                </div>
                <TypeList>
                    {this.createPage()}
                </TypeList>
            </div>
        );
    }
}

SearchEntry.contextTypes = {
    areaId: React.PropTypes.string,
    identity: React.PropTypes.string,
    keyWords: React.PropTypes.string,
    setKeyWords: React.PropTypes.fn,
    typeId: React.PropTypes.string
};

export default SearchEntry;