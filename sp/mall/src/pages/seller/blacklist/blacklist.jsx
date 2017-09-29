/*
 * Created by xy on 2017.03.08
 * 服务商商品屏蔽
* */

import React from 'react';

class Blacklist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            blacklist: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate() {
        this.state.SCROLL.refresh();
    }

    //获取需要屏蔽的或者已经屏蔽的列表;
    getData() {
        $.loading.show();
        $.req.getBlacklist({sort_id: this.props.params.id}, (res) => {
            $.loading.hide();
            if(res.code==0){
                this.setState({blacklist: res.data});
            }else{
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    createScroll(){
        let SCROLL = new IScroll('#blacklistWrap', {
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

    //恢复销售;
    blacklistRemove(i) {
        let data = this.state.blacklist[i],
            sort_id = data.sort_id;
        this.dialog('销售', data.brands.blacklist, (brand_ids) => {
            $.loading.show();
            $.req.blacklistRemove(JSON.stringify({sort_id: sort_id, brand_ids: brand_ids}), (res) => {
                if(res.code == 0) {
                    this.getData();
                }else {
                    $.loading.hide();
                    $.toast({text:res.message, icon: 'info'});
                }
            });
        });
    }

    //屏蔽品牌;
    blacklistAdd(i) {
        let data = this.state.blacklist[i],
            sort_id = data.sort_id;
        this.dialog('屏蔽', data.brands.normal, (brand_ids) => {
            $.loading.show();
            $.req.blacklistAdd(JSON.stringify({sort_id: sort_id, brand_ids: brand_ids}), (res) => {
                if(res.code == 0) {
                    this.getData();
                }else {
                    $.loading.hide();
                    $.toast({text:res.message, icon: 'info'});
                }
            });
        });
    }

    dialog(title, list, fn) {
        let str = '',
            brandArr = [];
        for(let i = 0 ; i < list.length ; i++) {
            str += '<div class="cell"><div class="cell-item" data-id="'+list[i].brand_id+'">'+list[i].brand_name+'</div></div>';
        }
        $.dialog({
            title: '请选择要'+title+'的品牌',
            seller: true,
            cancel: true,
            content: '<div id="chooseBlacklistBrand" class="choose-blacklist-brand"><div class="scroller">'+str+'</div></div>',
            okText: '确认'+title,
            okCallback: ()=>{
                if(brandArr.length > 0) {
                    fn && fn(brandArr);
                }
            }
        });
        $.selector('#chooseBlacklistBrand').onclick = (e) => {
            if(e.target.dataset.id) {
                let node = e.target,
                    id = node.dataset.id,
                    index = brandArr.indexOf(id);
                if(index == -1) {
                    brandArr.push(id);
                    node.className = 'cell-item active';
                }else {
                    brandArr.splice(index, 1);
                    node.className = 'cell-item';
                }
            }
        };
        new IScroll('#chooseBlacklistBrand', {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });
    }

    createDOM() {
        return this.state.blacklist.map((value, i) => {
            return (
                <div key={i} className="blacklist-type-item">
                    <div className="type-name">{value.sort_name}</div>
                    <div className="normal-item">
                        <div className="hd flex"><h4 className="flex-item text-assist">
                            {value.brands.normal.length <= 0 ? '当前没有未屏蔽的品牌' : '当前未屏蔽品牌'+value.brands.normal.length+'种'}</h4>
                            {
                                value.brands.normal.length > 0 ? <div className="btn btn-info" onClick={this.blacklistAdd.bind(this, i)}>屏蔽品牌</div> : null
                            }
                        </div>
                        <div className="bd clear-fix">
                            {
                                value.brands.normal.map((val, index) => {
                                    return (<div key={index} className="cell"><div className="cell-item">{val.brand_name}</div></div>);
                                })
                            }
                        </div>
                    </div>
                    <div className="blacklist-item">
                        <div className="hd flex"><h4 className="flex-item text-assist">
                            {value.brands.blacklist.length <= 0 ? '当前没有已屏蔽的品牌' : '当前已屏蔽品牌'+value.brands.blacklist.length+'种'}</h4>
                            {
                                value.brands.blacklist.length > 0 ? <div className="btn btn-info" onClick={this.blacklistRemove.bind(this, i)}>恢复销售</div> : null
                            }
                        </div>
                        <div className="bd clear-fix">
                            {
                                value.brands.blacklist.map((val, index) => {
                                    return (<div key={index} className="cell"><div className="cell-item">{val.brand_name}</div></div>);
                                })
                            }
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        return (
            <div id="blacklistWrap" className="blacklist-wrap">
                <div className="scroller">
                    {this.createDOM()}
                </div>
            </div>
        );
    }
}

export default Blacklist;