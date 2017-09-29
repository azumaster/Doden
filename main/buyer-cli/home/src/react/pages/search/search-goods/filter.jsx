/*
* 搜索筛选
* */

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            show: false,
            defaultParam: {
                area_id: this.props.areaId,
                search: this.props.keyWords,
                type_ids: this.props.type_ids,
                brand_ids: null,
                xinghaos: null,
                halal: null,
                market_ids: null,
                select: this.props.filterArr
            },
            filterVal: {},
            brand_ids: false,     //品牌的更多是否展开;
            type_ids: false      //分类的更多是否展开;
        };
        this.getGoodsFilter = this.getGoodsFilter.bind(this);
        this.createFilter = this.createFilter.bind(this);
        this.createScroll = this.createScroll.bind(this);
    }

    componentWillReceiveProps(nextProp) {
        this.setState({show: nextProp.show});
        if(nextProp.show) {
            this.getGoodsFilter();
        }
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    //创建滚动;
    createScroll(){
        var wrapper = document.getElementById('filterContent'),
            SCROLL = new IScroll(wrapper, {
                zoom: true,
                scrollX: false,  //是不中可以横向滚动;
                scrollY: true,  //是否可以纵向滚动;
                mouseWheel: true, //是否监听鼠标滚轮;
                wheelAction: 'zoom',
                probeType: 2,
                preventDefault: false
            });
        this.state.SCROLL = SCROLL;
    }

    //获取筛选条件列表;
    getGoodsFilter() {
        if(!this.props.isGetData) {
            return;
        }else {
            this.state.filterVal = {};
            let param = this.state.defaultParam;
            param.select = this.props.filterArr;
            param.type_ids = this.props.type_ids;
            param.area_id = this.props.areaId;
            param.search = this.props.keyWords;
            H.we_loading.show();
            H.server.getGoodsFilter(JSON.stringify(param), (res) => {
                if(res.code == 0) {
                    let data = res.data,
                        arr = [];
                    if(data.categories) {
                        for(let i = 0 ; i < data.categories.length ; i++) {
                            if(data.categories[i].series == 4) {
                                arr.push(data.categories[i]);
                            }
                        }
                        data.categories = arr;
                    }
                    this.setState({
                        data: data,
                        show: true
                    });
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }
    }

    //隐藏筛选框;
    closeFilter() {
        this.props.refreshSort && this.props.refreshSort(5);
    }

    createFilter() {
        let data = this.state.data,
            filterVal = this.state.filterVal,
            xml = [];
        if(!data) return;
        if(data.categories) {    //生成分类;
            let categoriesArr = [],
                length = data.categories.length;
            categoriesArr.push(
                <span className={!filterVal.type_ids ? 'active' : null} data-operate="type_ids" data-val={null}>不限</span>
            );
            if(length > 8 && !this.state.type_ids) {
                for(let i = 0 ; i < 7 ; i++) {
                    let className = null;
                    if(filterVal.type_ids) {
                        if(filterVal.type_ids.indexOf(data.categories[i].id + '') != -1) className = 'active';
                    }
                    categoriesArr.push(
                        <span className={className} data-operate="type_ids" data-val={data.categories[i].id}>{data.categories[i].sort_name}</span>
                    );
                }
                categoriesArr.push(<span data-operate="type_ids" data-val={-100}>···</span>);

            }else {
                for(let i = 0 ; i < length ; i++) {
                    let className = null;
                    if(filterVal.type_ids) {
                        if(filterVal.type_ids.indexOf(data.categories[i].id + '') != -1) className = 'active';
                    }
                    categoriesArr.push(
                        <span className={className} data-operate="type_ids" data-val={data.categories[i].id}>{data.categories[i].sort_name}</span>
                    );
                }
                //categoriesArr.push(<span data-operate="type_ids" data-val={-200}>收起</span>);
            }

            xml.push(
                <div className="filter-item">
                    <div className="filter-hd">分类</div>
                    <div className="filter-bd">
                        {categoriesArr}
                    </div>
                </div>
            );
        }
        if(data.brands) {    //生成品牌;
            let brandsArr = [],
                length = data.brands.length;
            brandsArr.push(
                <span className={!filterVal.brand_ids ? 'active' : null} data-operate="brand_ids" data-val={null}>不限</span>
            );
            if(length > 8 && !this.state.brand_ids) {
                for(let i = 0 ; i < 7 ; i++) {
                    let className = null;
                    if(filterVal.brand_ids) {
                        if(filterVal.brand_ids.indexOf(data.brands[i].id + '') != -1) className = 'active';
                    }
                    brandsArr.push(
                        <span className={className} data-operate="brand_ids" data-val={data.brands[i].id}>{data.brands[i].brand}</span>
                    );
                }
                brandsArr.push(<span data-operate="brand_ids" data-val={-100}>···</span>);

            }else {
                for(let i = 0 ; i < length ; i++) {
                    let className = null;
                    if(filterVal.brand_ids) {
                        if(filterVal.brand_ids.indexOf(data.brands[i].id + '') != -1) className = 'active';
                    }
                    brandsArr.push(
                        <span className={className} data-operate="brand_ids" data-val={data.brands[i].id}>{data.brands[i].brand}</span>
                    );
                }
                //brandsArr.push(<span data-operate="brand_ids" data-val={-200}>收起</span>);
            }

            xml.push(
                <div className="filter-item">
                    <div className="filter-hd">品牌</div>
                    <div className="filter-bd">
                        {brandsArr}
                    </div>
                </div>
            );
        }
        if(data.xinghaos) {    //生成型号;
            let xinghaosArr = [];
            xinghaosArr.push(
                <span className={!filterVal.xinghaos ? 'active' : null} data-operate="xinghaos" data-val={null}>不限</span>
            );
            for(let i = 0 ; i < (data.xinghaos.length > 8 ? 8 : data.xinghaos.length) ; i++) {
                let className = null;
                if(filterVal.xinghaos) {
                    if(filterVal.xinghaos.indexOf(data.xinghaos[i]) != -1) className = 'active';
                }
                xinghaosArr.push(
                    <span className={className} data-operate="xinghaos" data-val={data.xinghaos[i]}>{data.xinghaos[i]}</span>
                );
            }
            xml.push(
                <div className="filter-item">
                    <div className="filter-hd">型号</div>
                    <div className="filter-bd">
                        {xinghaosArr}
                    </div>
                </div>
            );
        }
        if(data.halal) {    //生成是否清真;
            let className = null;
            if(!filterVal.halal) {
                if(filterVal.halal != 0) className = 'active';
            }
            xml.push(
                <div className="filter-item">
                    <div className="filter-hd">清真食品</div>
                    <div className="filter-bd">
                        <span className={className} data-operate="halal" data-val={null}>不限</span>
                        <span className={filterVal.halal == 0 ? 'active' : null} data-operate="halal" data-val={0}>否</span>
                        <span className={filterVal.halal == 1 ? 'active' : null} data-operate="halal" data-val={1}>是</span>
                    </div>
                </div>
            );
        }
        if(data.markets) {    //生成发货市场;
            let marketsArr = [];
            marketsArr.push(
                <span className={!filterVal.market_ids ? 'active' : null} data-operate="market_ids" data-val={null}>不限</span>
            );
            for(let i = 0 ; i < data.markets.length ; i++) {
                let className = null;
                if(filterVal.market_ids) {
                    if(filterVal.market_ids.indexOf(data.markets[i].pianquId + '') != -1) className = 'active';
                }
                marketsArr.push(
                    <span className={className} data-operate="market_ids" data-val={data.markets[i].pianquId}>{data.markets[i].pianqu}</span>
                );
            }
            xml.push(
                <div className="filter-item">
                    <div className="filter-hd">发货市场</div>
                    <div className="filter-bd">
                        {marketsArr}
                    </div>
                </div>
            );
        }
        return xml;
    }

    //点击筛选;
    filterHandler(e) {
        let node = e.target,
            operate = node.dataset.operate,
            val = node.dataset.val,
            filterVal = this.state.filterVal;
        if(!operate) {
            return;
        }
        if(val == -100) {
            this.state[operate] = true;
            this.setState();
            return;
        }else if(val == -200) {
            this.state[operate] = false;
            this.setState();
            return;
        }

        if(!val) {
            if(operate == 'type_ids') {
                let data = this.state.data;
                data.xinghaos = null;
            }
            filterVal[operate] = null;
            this.setState({filterVal: filterVal});
            return;
        }
        if(operate == 'type_ids') {    //分类，
            let arr = filterVal[operate] || [],
                index = arr.indexOf(val);
            if(index == -1) {
                arr.push(val);
            }else {
                arr.splice(index, 1);
            }
            if(arr.length == 0) arr = null;
            filterVal[operate] = arr;
            if(arr) {      //选择分类之后如果被选择分类里有需要拉取选中分类下对应的型号;
                let param = this.state.defaultParam;
                param.select = ['xinghaos'];
                param.type_ids = filterVal[operate];
                H.we_loading.show();
                H.server.getGoodsFilter(JSON.stringify(param), (res) => {
                    if(res.code == 0) {
                        let data = this.state.data;
                        data.xinghaos = res.data.xinghaos;
                        this.setState({
                            data: data,
                            show: true
                        });
                    }else {
                        H.operationState(res.message);
                    }
                    H.we_loading.hide();
                });
            }else {    //在筛选中如果取消了所有分类，将不显示型号;
                let data = this.state.data;
                data.xinghaos = null;
            }
        }else if(operate == 'brand_ids' || operate == 'xinghaos') {   //品牌，型号为多选值;
            let arr = filterVal[operate] || [],
                index = arr.indexOf(val);
            if(index == -1) {
                arr.push(val);
            }else {
                arr.splice(index, 1);
            }
            if(arr.length == 0) arr = null;
            filterVal[operate] = arr;
        }else if(operate == 'halal') {    //是否清真为单选,bool值;
            filterVal[operate] = val == 1 ? true : false;
        }else {   //发货市场为单选;
            filterVal[operate] = [val];
        }
        this.setState({filterVal: filterVal});
    }

    //保存筛选的数据并提交筛选;
    saveFilter() {
        this.props.saveFilter && this.props.saveFilter(this.state.filterVal);
    }

    render() {
        return (
            <div className={this.state.show ? 'filter-wrap show' : 'filter-wrap'}>
                <div className="filter-mask" onClick={this.closeFilter.bind(this)}></div>
                <div className="filter-body">
                    <div className="filter-content" id="filterContent" onClick={this.filterHandler.bind(this)}>
                        <div className="scroller">
                            {this.createFilter()}
                        </div>
                    </div>
                    <div className="filter-btn flex-box">
                        <a className="flex-num1" onClick={this.closeFilter.bind(this)}>关闭</a>
                        <a className="flex-num1" onClick={this.saveFilter.bind(this)}>完成</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;