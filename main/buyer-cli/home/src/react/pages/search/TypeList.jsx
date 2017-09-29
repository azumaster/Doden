/*
* 搜索入口分类页面;
* */

class TypeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0    //当前被选择的二级分类数组下标,为对应的标签加active样式;
        };
        this.createTypeTwo = this.createTypeTwo.bind(this);
        this.createTypeThree = this.createTypeThree.bind(this);
        this.createScroll = this.createScroll.bind(this);
        this.byTypeSearch = this.byTypeSearch.bind(this);
    }

    componentWillMount() {
        if(this.context.goodsTypeData.length <= 0) {
            this.context.getSpecifiedList && this.context.getSpecifiedList(true);
        }
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.state.SCROLL1.refresh();
        }, 20);
    }

    //添加滚动;
    createScroll(){
        var wrapper = document.getElementById('typeListWrap'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        var wrapper1 = document.getElementById('typeGoodsWrap'),
            SCROLL1 = new IScroll(wrapper1, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
        this.state.SCROLL1 = SCROLL1;
        SCROLL.on('beforeScrollStart', () => {
            $('#keyWordsVal')[0].blur();
            SCROLL.refresh();
        });
        SCROLL1.on('beforeScrollStart', () => {
            $('#keyWordsVal')[0].blur();
            SCROLL1.refresh();
        });
    }

    //创建二级分类;
    createTypeTwo() {
        let data = this.context.goodsTypeData;
        if(data.length <= 0) return;
        return data.map((val, index) => {
            if(val.sale_goods_num <= 0) return null;
            return (
                <li key={index} data-typeid={val.id} data-index={index} className={this.state.index == index ? 'active' : null}>{val.name}</li>
            );
        });
    }

    //选择二级分类;
    chooseTypeTwo(e) {
        this.setState({index: e.target.dataset.index});
    }

    //通过点击分类进入商品搜索;
    byTypeSearch(val) {
        H.searchBool = false;
        window.location.href = '#/search/results';
        this.context.setKeyWords(null);
        this.context.setTypeId(val);
    }

    createTypeThree() {
        if(this.context.goodsTypeData.length <= 0) return;  //没有分类数据的时候不执行以下的;
        let index = this.state.index,
            data = this.context.goodsTypeData[index].children;
        let XML = data.map((val, index) => {
            let src = H.localhost + (val.pic_url ? val.pic_url : 'Public/images/buyer-cli/default-img1.png') + (H.localhost.indexOf('192.168.') == -1 ? '@120w_100Q.jpg' : '');
            if(val.sale_goods_num <= 0) return null;
            return (
                <li key={index}><a onClick={this.byTypeSearch.bind(this, val)}><img src={src} /><span>{val.name}</span></a></li>
            );
        });
        return XML;
    }

    render() {
        return (
            <div>
                <div id="typeGoodsWrap" className="type-goods-wrap">
                    <div className="scroller">
                        <ul className="type-goods-list">
                            {this.createTypeThree()}
                        </ul>
                    </div>
                </div>
                <div id="typeListWrap" className="type-list-wrap">
                    <div className="scroller">
                        <ul className="type-list" onClick={this.chooseTypeTwo.bind(this)}>
                            {this.createTypeTwo()}
                        </ul>
                    </div>
                </div>

                {this.props.children}
            </div>
        );
    }
}

TypeList.contextTypes = {
    goodsTypeData: React.PropTypes.array,
    getSpecifiedList: React.PropTypes.fn,
    route: React.PropTypes.string,
    areaId: React.PropTypes.string,
    setKeyWords: React.PropTypes.fn,
    typeId: React.PropTypes.string,
    setTypeId: React.PropTypes.fn
};

export default TypeList;