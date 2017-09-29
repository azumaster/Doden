/*
* xy 2017.08.24  
* 收藏功能
* */

class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,    //收藏的商品所有数据;
            sortData: null,     //分类筛选;
            list: null,    //需要显示的数据，分类筛选出来的结果列表;
            show: false,     //控制分类筛选的显示和危隐藏;
            editState: false,   //编辑的状态;
            sortVal: {        //分类选择值;
                id: 0,
                name: '全部商品'
            },
            ids: [],            //需要操作的商品列表ID;
            SCROLL: null
        };
    }

    componentWillMount() {
        this.getData();
    }

    componentDidMount() {
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL && this.state.SCROLL.refresh();
    }

    createScroll(){
        var wrapper = document.getElementById('CollectionWrap'),
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
        //SCROLL.on('scrollStart', () => {
        //    SCROLL.refresh();
        //});
    }

    //获取所有的收藏商品列表数据;
    getData() {
        $.loading.show();
        $.req.collections({}, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                this.setState({data: res.data, list: res.data}, () => {
                    this.setSortArr();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //统计出有多少个分类;
    setSortArr() {
        let data = this.state.data,
            sortArr = {};
        for(let i = 0 ; i < data.length ; i++) {
            if(!sortArr[data[i].sort_id]) {
                sortArr[data[i].sort_id] = {
                    sort_id: data[i].sort_id,
                    sort_name: data[i].sort_name
                };
            }
        }
        this.setState({sortData: sortArr});
    }

    hrefHandler(gid) {
        if(this.state.editState) return;
        location.href = '#/buyer/goodsInfo?&id='+gid;
    }

    //找同类商品;
    searchSame(sort_id, halal, e) {
        e && e.stopPropagation();
        if(halal) {
            location.href = '#/buyer/buy/result?&type_id='+sort_id+'&halal=1';
        }else {
            location.href = '#/buyer/buy/result?&type_id='+sort_id;
        }
    }

    //加入进货单;
    addCar(gid, e) {
        e && e.stopPropagation();
        let bool = true;
        $.loading.show();
        $.req.getGoodsInfo(gid, (res) => {
            $.loading.hide();
            if(res.code == 0) {
                let data = res.data,
                    num = 1;
                if(data.goods_start_num > 0) {
                    num = data.goods_start_num;
                }
                let dialog = $.dialog({
                    title: '加入进货单',
                    content: '<div class="add-car-dialog"><div class="flex hd border-bottom">' +
                    '<div><img class="goods-img" src="'+$.cdn() + data.goods_picture[0].goods_image + $.img(80, 90) +'" width="60px" aria-checked="60px" /></div>' +
                    '<div class="flex-item goods-info"><div>商品名：'+data.goods_name+'</div><div>净重：'+data.goods_net_weight+'kg</div></div></div>' +
                    '<div class="edit-num">请输入你要购买的数量 <span id="reductionNum" class="reduction sub icon"></span><input id="addCarNum" type="tel" value="'+num+'" />' +
                    '<span id="addNum" class="add icon"></span></div></div>',
                    cancel: '取消',
                    autoClose: false,
                    okCallback: () => {
                        if(bool) {
                            bool = false;
                            let val = $.selector('#addCarNum').value,
                                param = {goods_id: gid, buy_num: val};
                            if(!parseInt(val)) {
                                $.selector('#addCarNum').focus();
                                return;
                            }
                            $.req.addCar(JSON.stringify(param), (res) => {
                                dialog.hide();
                                if(res.code == 0) {
                                    $.toast({text: '成功加入购物车', icon: 'ok'});
                                }else {
                                    $.toast({text:res.message, icon: 'info'});
                                }
                            });
                        }
                    }
                });
                let addNumNode = $.selector('#addNum'),
                    reductionNumNode = $.selector('#reductionNum'),
                    addCarNumNode = $.selector('#addCarNum');

                addNumNode.onclick = (e) => {
                    e.preventDefault();
                    let val = parseInt(addCarNumNode.value),
                        inventory = data.goods_inventory || 9999;
                    if(val < inventory) {
                        addCarNumNode.value = val+1;
                    }
                };
                reductionNumNode.onclick = (e) => {
                    e.preventDefault();
                    let val = parseInt(addCarNumNode.value);
                    if(val > num) {
                        addCarNumNode.value = val-1;
                    }
                };
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //创建商品列表;
    createList() {
        let xml = [],
            list = this.state.list;
        if(!list) return null;
        for(let i = 0 ; i < list.length ; i++) {
            xml.push(
                <a key={i} className="goods-item flex" style={this.state.editState ? {paddingLeft: '45px'} : null} onClick={this.hrefHandler.bind(this, list[i].id)}>
                    <div><img className="goods-item-img" src={$.cdn() + list[i].pic + $.img(90, 90)} width="60px"/></div>
                    <div className="goods-item-info flex-item">
                        <div className="goods-item-title">{list[i].title}</div>
                        <div className="goods-item-price">￥{list[i].price}</div>
                        <div className="goods-item-num">销量：{list[i].sell_num}</div>
                        {
                            this.state.editState ? null :  <button className="btn btn-default btn-primary" onClick={this.addCar.bind(this, list[i].id)}>加入进货单</button>
                        }
                    </div>
                    {
                        list[i].status === '正常' ? null :
                            <div className="collection-not-available">
                                {
                                    this.state.editState ? null : <div className="search-same icon search" onClick={this.searchSame.bind(this, list[i].sort_id, list[i].halal)}>找同类商品</div>
                                }
                            </div>
                    }
                    {
                        this.state.editState ?
                            <div className={this.state.ids.indexOf(list[i].id) == -1 ? 'collection-choose' : 'collection-choose active'}
                                 onClick={this.choose.bind(this, list[i].id)}></div> : null
                    }
                </a>
            );
        }
        return xml;
    }

    //选择分类筛选;
    chooseHandle(sort_id, name, e) {
        if(this.state.data.length <= 0) return;
        e && e.stopPropagation();
        if(sort_id == 0) {
            this.setState({list: JSON.parse(JSON.stringify(this.state.data)), show: false, sortVal: {id: sort_id, name: name}});
        }else {
            let data = this.state.data,
                list = [];
            for(let i = 0 ; i < data.length ; i++) {
                if(data[i].sort_id == sort_id) {
                    list.push(data[i]);
                }
            }
            this.setState({list: list, show: false, sortVal: {id: sort_id, name: name}});
        }
    }

    //创建分类筛选;
    createSort() {
        let sort = this.state.sortData,
            xml = [];
        if(!sort || !this.state.show) return null;
        for(let d in sort) {
            xml.push(<li onClick={this.chooseHandle.bind(this, sort[d].sort_id, sort[d].sort_name)}>{sort[d].sort_name}</li>);
        }
        return (
            <ul className="sort-list">
                <li onClick={this.chooseHandle.bind(this, 0, '全部商品')}>全部商品</li>
                {xml}
            </ul>
        );
    }

    //显示分类筛选;
    showSort() {
        this.setState({show: true});
    }

    //编辑状态切换;
    editHandle(bool){
        if(!bool && this.state.list.length <= 0) {
            this.setState({editState: bool, ids: [], list: this.state.data, sortVal: {id: 0, name: '全部商品'}, show: false});
        }else {
            this.setState({editState: bool, ids: [], show: false});
        }
    }

    //全选;
    chooseAll() {
        let list = this.state.list,
            ids = [];
        if(this.state.ids.length != this.state.list.length) {
            for(let i = 0 ; i < list.length ; i++) {
                ids.push(list[i].id);
            }
        }
        this.setState({ids: ids});
    }

    //单个选择
    choose(id, e) {
        e && e.stopPropagation();
        let ids = this.state.ids;
        if(ids.indexOf(id) == -1) {
            ids.push(id);
        }else {
            ids.splice(ids.indexOf(id), 1);
        }
        this.setState({ids: ids});
    }

    //删除;
    delHandle() {
        if(this.state.ids.length <= 0) return;
        $.loading.show();
        $.req.collectionsDel(JSON.stringify({ids: this.state.ids}), (res) => {
            $.loading.hide();
            if(res.code == 0) {
                let data = this.state.data,
                    ids = this.state.ids,
                    sort_id = this.state.sortVal.id,
                    sort_name = this.state.sortVal.name;
                for(let i = 0 ; i < ids.length ; i++) {
                    for(let n = 0 ; n < data.length ; n++) {
                        if(data[n].id == ids[i]) {
                            data.splice(n, 1);
                        }
                    }
                }
                this.chooseHandle(sort_id, sort_name);
                this.setState({data: data, ids: []}, () => {
                    $.toast({text: '删除成功'});
                    this.setSortArr();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    render() {
        let data = this.state.data;
        if(data) {
            if(data.length == 0) {
                return (
                    <div className="nothing-page">
                        <div className="nothing-img"></div>
                        <p>收藏夹空空如也</p>
                        <div><a href="/home" className="btn">去冻品商城找货</a></div>
                        <p>商品详情中，可进行收藏商品操作</p>
                        <div><a href="/order" className="btn">去订单中找买过的货</a></div>
                        <p>点击订单中的商品，可查看商品详情</p>
                    </div>
                );
            }
        }
        return (
            <div className="collection-page">
                <div className="hd flex">
                    {
                        this.state.editState ?
                            <div className="choose-all flex-item" onClick={this.chooseAll.bind(this)}>
                                <div style={{marginTop: '-10px'}} className={this.state.ids.length == this.state.list.length ? 'collection-choose active' : 'collection-choose'}></div>
                                <span className="label">全选</span>
                            </div> :
                            <div className="choose-wrap flex-item">
                                <div className="choose-sort" onClick={this.showSort.bind(this)}>
                                    <span className="choose-val">{this.state.sortVal.name}</span>
                                    {this.createSort()}
                                </div>
                            </div>
                    }
                    {
                        this.state.editState ?
                            <div className="edit" onClick={this.editHandle.bind(this, false)}>完成</div> :
                            <div className="edit" onClick={this.editHandle.bind(this, true)}>编辑</div>
                    }
                </div>
                <div id="CollectionWrap" className="collection-wrap">
                    <div className="scroller">
                        {this.createList()}
                    </div>
                </div>
                {
                    this.state.editState ?
                        <div className="ft flex">
                            <div className="flex-item">您选中了：{this.state.ids.length}种商品</div>
                            <div className="del" onClick={this.delHandle.bind(this)}>删除</div>
                        </div> : null
                }

            </div>
        );
    }
}

export default Collection;