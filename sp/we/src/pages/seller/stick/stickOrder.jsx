/**
 * Created by Doden on 2017.06.20
 */

import React from 'react';

class StickOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stick: null,
            brandsStick: [],
            brandsNormal: [],
            brandsIds: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    componentDidMount(){
        this.createScroll();
        // document.getElementById('scroll').style.minHeight = window.innerHeight - 15 + 'px';
    }

    createScroll(){
        let SCROLL = new IScroll('#stickOrder', {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    getData(){
        $.loading.show();

        $.req.getStickList({sort_id: this.props.params.id}, (res)=>{
            if(res.code==0){
                let stick = null,
                    sbs = [],
                    brandsIds = [];

                res.data.map((s)=>{
                    if(s.sort_id == this.props.params.sortId){
                        stick = s;
                    }
                });

                sbs = $.objToArr(stick.brands.stick);
                sbs.map((st)=>{
                    brandsIds.push(st.brand_id);
                });

                this.setState({
                    stick: stick,
                    brandsStick: $.objToArr(stick.brands.stick),
                    brandsNormal: $.objToArr(stick.brands.normal),
                    brandsIds: brandsIds
                });
            }else{
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();
        });
    }

    // 创建置顶排序
    createStickOrder(){
        let stickList = this.state.brandsStick,
            list = [];

        stickList.map((stick, index)=>{
            list.push(<div key={index} className="setting-list-item">
                <div className="setting-item order">{index==0?'排序最高':(index+1)}</div>
                <div className="setting-item name">{stick.brand_name}</div>
                <div className="setting-item cancel-stick" data-id={stick.brand_id} onClick={this.cancelStick.bind(this)}>取消置顶</div>
                <div className="setting-item up">{index==0?null:<i onClick={this.upStick.bind(this)} data-id={stick.brand_id} data-key={index} className="icon stick-up"></i>}</div>
            </div>);
        });

        return (<div className="stick-setting">
            <div className="setting-title">请设置置顶排序</div>
            <div className="setting-list">
                {list}
            </div>
            <div className="setting-notice">可置顶5个品牌</div>
        </div>);
    }

    // 创建置顶品牌
    createStickBrand(){
        let stickList = this.state.brandsNormal,
            list = [];

        stickList.map((stick, index)=>{
            list.push(<div key={index} className="stick-normal-item" data-id={stick.brand_id} data-key={index} onClick={this.stick.bind(this)}><em  data-id={stick.brand_id} data-key={index}>{stick.brand_name}</em></div>);
        });

        return (<div className="stick-setting brands">
            <div className="setting-title">请选择置顶品牌</div>
            {stickList.length>0?<div className="setting-list brand">{list}</div>:<div className="setting-list no"><p className="setting-notice">没有可置顶品牌</p></div>}
        </div>);
    }

    // 上移
    upStick(e){
        let index = e.target.dataset.key,
            brandsIds = [],
            y1 = 0,
            y2 = 0;

        let brandStick = this.state.brandsStick,
            currentStick = brandStick[index],
            lastStick = brandStick[index-1];

        let node = e.target.parentNode.parentNode,
            lastNode = e.target.parentNode.parentNode.parentNode.childNodes[index-1];

        // 点击了上移后，与上一条数据交换顺序。
        // 先执行DOM的移动，再删除数据
        brandStick.splice(index, 1, lastStick);
        brandStick.splice(index-1, 1, currentStick);

        brandStick.map((bs)=>{
            brandsIds.push(bs.brand_id);
        });

        let upInterval = setInterval(()=>{
            y1-=5;
            y2+=5;
            node.style.transform = 'translateY('+y1+'px)';
            lastNode.style.transform = 'translateY('+y2+'px)';
            if(y1 == -55 && y2 == 55){
                clearInterval(upInterval);
                node.style.transform = null;
                lastNode.style.transform = null;
                this.setState({
                    brandsStick: brandStick,
                    brandsIds: brandsIds
                });
            }
        }, 15);


    }

    // 取消置顶
    cancelStick(e){
        let id = e.target.dataset.id,
            node = e.target.parentNode,
            brandsStick = this.state.brandsStick,
            brandsNormal = this.state.brandsNormal,
            brandsIds = [],
            bNormal = null,
            key = -1;

        brandsStick.map((bs, i)=>{
            if(bs.brand_id == id){
                key = i;
            }
        });

        bNormal = brandsStick.splice(key, 1);
        brandsNormal.push(bNormal[0]);

        brandsStick.map((bs)=>{
            brandsIds.push(bs.brand_id);
        });

        let centent = 0;
        // 点击了取消置顶后，当前列表项向左移除后，再重置置顶排序，但此时并没有提交给后台，需要最后点击确认提交后，才将置顶
        let interval = setInterval(()=>{
            centent+=10;
            node.style.transform = 'translateX(-'+centent+'%)';
            if(centent == 100){
                clearInterval(interval);
                node.style.transform = null;
                this.setState({
                    brandsStick: brandsStick,
                    brandsIds: brandsIds,
                    brandsNormal: brandsNormal
                });
            }
        }, 15);
    }

    // 选择置顶品牌
    stick(e){
        let key = e.target.dataset.key,
            brandsNormal = this.state.brandsNormal,
            brandsStick = this.state.brandsStick,
            brandsIds = [],
            bStick = null;
        if(brandsStick.length>=5){
            $.toast({text: '最多只能置顶5个品牌', icon: 'info'});
        }else{
            bStick = brandsNormal.splice(key, 1);
            brandsStick.push(bStick[0]);
        }

        brandsStick.map((bs)=>{
            brandsIds.push(bs.brand_id);
        });

        // 点击了置顶品牌后，置顶品牌列表中消失，出现在置顶排序中
        this.setState({
            brandsStick: brandsStick,
            brandsIds: brandsIds,
            brandsNormal: brandsNormal
        });

    }

    // 确认提交；这里才是最终的确认置顶排序的地方，之前的操作，都只是界面上的变化，数据其实是没有变化的
    submit(){
        $.loading.show();

        $.req.resetStick(JSON.stringify({sort_id: this.props.params.sortId, brand_ids: this.state.brandsIds}), (res)=>{
            if(res.code==0){
                $.toast({text:'操作成功'});
                setTimeout(()=>{
                    window.history.go(-1);
                }, 1300);
            }else{
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();
        });
    }

    render() {
        return (<div id="stickOrder" className="stick-order">
            <div id="scroll" style={{paddingBottom: '60px'}}>
                {this.createStickOrder()}
                {this.createStickBrand()}

            </div>
            <button className="btn-all" onClick={this.submit.bind(this)}>确认提交</button>
        </div>);
    }
}

export default StickOrder;