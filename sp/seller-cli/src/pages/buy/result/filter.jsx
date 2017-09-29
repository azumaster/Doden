/*
* 商品搜索筛选项;
* */

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: this.props.param,
            xinghaos: []   //型号的数据,点击分类之后就有型号;
        };
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('filterDialogWrap'),
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


    //获取型号的数据;
    getXinghao(typeId) {
        let param = {search: this.props.param.search, type_ids: typeId, select: ['xinghaos']};
        $.req.getGoodsFilter(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                this.setState({xinghaos: res.data.xinghaos});
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    createDOM() {
        let XML = [],
            data = this.props.filterData,
            categories = data.categories,
            xinghaos = data.xinghaos,
            brands = data.brands;
        if(categories && this.state.param.state == 1) {    //分类;
            let xml = this.createFilterItem('categories', 'type_ids', '分类', 'sort_name', 'id');
            XML.push(xml);
        }
        if(xinghaos) {   //型号;
            let xml = this.createFilterItem('xinghaos', 'xinghaos', '型号');
            XML.push(xml);
        }
        if(brands) {    //品牌;
            let xml = this.createFilterItem('brands', 'brand_ids', '品牌', 'brand', 'id');
            XML.push(xml);
        }
        return XML;
    }

    createFilterItem(key, paramKey, type, val, id) {
        let data = this.props.filterData[key],
            param = this.state.param[paramKey],
            xml = [];
        xml.push(
            <div key={key+'_-1'} className="coll">
                <span className={param.length > 0 ? 'coll-item' : 'coll-item active'} data-key={paramKey} data-id={-1}>全部</span>
            </div>
        );
        for(let i in data) {
            let name = val ? data[i][val] : data[i],
                ids = id ? data[i][id] : data[i];
            if(key === 'categories') {
                if(data[i].series == 4) {
                    xml.push(
                        <div key={key+'_'+i} className="coll">
                            <span className={param.indexOf(ids+'') != -1 ? 'coll-item active' : 'coll-item'} data-key={paramKey} data-id={ids}>{name}</span>
                        </div>);
                }
            }else {
                xml.push(
                    <div key={key+'_'+i} className="coll">
                        <span className={param.indexOf(ids+'') != -1 ? 'coll-item active' : 'coll-item'} data-key={paramKey} data-id={ids}>{name}</span>
                    </div>);
            }
        }
        return (
            <div key={key} className="filter-item">
                <div className="hd">{type}</div>
                <div className="bd clear-fix">{xml}</div>
            </div>
        );
    }

    clickHandler(e) {
        let node = e.target,
            key = node.dataset.key,
            id = node.dataset.id,
            param = this.state.param,
            xinghaos = this.state.xinghaos;
        if(!id) return;
        if(id == -1) {
            param[key] = [];
            xinghaos = [];
        }else {
            let index = param[key].indexOf(id);
            if(index != -1) {
                param[key].splice(index, 1);
            }else {
                param[key].push(id);
            }
            if(key == 'type_ids') {   //如果点的分类;
                if(param[key].length > 0) {   //判断大于0，需要获取型号;
                    this.getXinghao(param[key]);
                }else {    //否则直接清空;
                    xinghaos = [];
                }
            }
        }
        this.setState({param: param, xinghaos: xinghaos});
    }

    btnHandler(status) {
        if(status == 0) {
            this.props.setFilterShow(false);
        }else {
            this.props.setFilterShow(false, this.state.param);
        }
    }

    //选择是否清真;
    halalChange(bool) {
        let param = this.state.param;
        param.halal = bool;
        this.setState({param: param});
    }

    render() {
        if(!this.props.filterData) return null;
        return (
            <div className={this.props.filterShow ? 'mask filter-mask active' : 'mask filter-mask'}>
                <div className="filter dialog">
                    <div className="dialog-title"><h2 className="text-center">筛选</h2></div>
                    <div id="filterDialogWrap" className="dialog-body">
                        <div className="scroller">
                            <div onClick={this.clickHandler.bind(this)}>
                                {this.createDOM()}
                            </div>
                            <div className="filter-item">
                                <div className="hd">是否清真</div>
                                <div className="halal clear-fix">
                                    <label className="halal-item" htmlFor="halalF0">
                                        <input className="radio" type="radio" name="halalFilter" id="halalF0" onChange={this.halalChange.bind(this, null)} checked />
                                        <span className={this.state.param.halal === null ? 'icon check-fill' : 'icon check'}></span>全部
                                    </label>
                                    <label className="halal-item" htmlFor="halalF1">
                                        <input className="radio" type="radio" name="halalFilter" id="halalF1" onChange={this.halalChange.bind(this, true)} />
                                        <span className={this.state.param.halal === true ? 'icon check-fill' : 'icon check'}></span>是
                                    </label>
                                    <label className="halal-item" htmlFor="halalF2">
                                        <input className="radio" type="radio" name="halalFilter" id="halalF2" onChange={this.halalChange.bind(this, false)} />
                                        <span className={this.state.param.halal === false ? 'icon check-fill' : 'icon check'}></span>否
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dialog-button flex">
                        <button type="button" className="btn btn-dialog-cancel" onClick={this.btnHandler.bind(this, 0)}>取消</button>
                        <button type="button" className="btn btn-dialog-ok" onClick={this.btnHandler.bind(this, 1)}>确定</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Filter;