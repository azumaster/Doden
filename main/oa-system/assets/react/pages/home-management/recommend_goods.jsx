/*
 * 描述：推荐好货
 * 作者：wjz
 * 联系方式：iamnew@zdongpin.com
 * 创建时间：2016-12-26
 **/

import React from 'react';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import Table from '../../../components/table.jsx';
import Paging from '../../../components/page/paging.js';

class RecommendGoods extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPara: {
                area_id: '', //地区id
                status: 2,   //上架状态
                page: 1,
                size: 20
            },
            goodsList: [],
            put_on_at: '',  //上架时间
            pull_off_at: '', //下架时间
            goods_id: 0,
            total: 0
        };
        this.clickCallback = this.clickCallback.bind(this);
        this.onChange = this.onChange.bind(this);
        this.bodyOperate = this.bodyOperate.bind(this);
    }

    componentWillMount(){
        this.state.defaultPara.area_id = this.context.areaData[0].area_id;
        this.init();
    }

    //初始化
    init(){
        H.server.indexManage_recommendGoods_list(this.state.defaultPara, (res)=>{
            if(res.code == 0){
                this.setState({
                    goodsList: res.data.goods,
                    total: res.data.total
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //创建地区筛选
    createAreaFilter(){
        let btnNames = [],
            operate = [],
            bindData = [];
        this.context.areaData.map((area)=>{
            btnNames.push(area.area_name);
            operate.push('area_id');
            bindData.push(area.area_id);
        });
        return (<BtnGroup btnNames={btnNames} operate={operate} clickCallback={this.clickCallback} bindData={bindData}
                          style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.defaultPara.area_id} />);
    }

    // 创建输入区域
    createInputArea(){
        return(
            <div>
                <div onChange={this.onChange} style={{display: 'inline-block'}}>
                    上架日期：<input type="datetime-local" data-para="put_on_at"/>
                    下架日期：<input type="datetime-local" data-para="pull_off_at"/>
                    <input type="text" placeholder="请输入商品ID" data-para="goods_id"/>
                </div>

                <a className="btn btn-sm" data-operate="add" onClick={this.clickCallback}>添加</a>
            </div>
        );
    }

    //商品状态筛选器
    createStatusFilter(){
        let btnNames = ['上架', '待上架', '下架'],
            bindData = [2, 1, 3],
            operate = ['status', 'status', 'status'];
        return (<BtnGroup btnNames={btnNames} clickCallback={this.clickCallback} bindData={bindData} operate={operate}
                          style="btn btn-sm" activeStyle="btn btn-sm btn-default" status={this.state.defaultPara.status} />);
    }

    //创建商品列表
    createGoodsList(){
        let headlines = ['排序', '商品id', '商品名', '店铺', '上架时间', '下架时间', '状态', '点击量', '操作'],
            order = ['order', 'goods_id', 'goods_name', 'shop_name', 'put_on_at', 'pull_off_at', 'status', 'pv', 'status'],
            status = {
                6: {
                    1: '待上架',
                    2: '上架',
                    3: '已下架'
                }
            },
            statusOperate = {
                1: ['下移', '上移', '下架'],
                2: ['下移', '上移', '下架'],
                3: []
            },
            bodyOperate = {
                8: this.bodyOperate
            };
        this.state.goodsList.map((goods, index)=>{
            goods.order = index + 1;
        });
        return(
            <Table key={this.state.defaultPara.status} id="recommend_goods" values={this.state.goodsList} headlines={headlines}
                   status={status} statusOperate={statusOperate} order={order} bodyOperate={bodyOperate}/>
        );
    }

    //表格操作
    bodyOperate(e){
        let target = e.target,
            text = target.text,
            parent = target.parentNode,
            index = Number(parent.dataset.index),
            id = this.state.goodsList[index].id,
            len =  this.state.goodsList.length;
        switch (text){
            case '下移':
                if(index + 1 >= len){
                    H.Modal('您不能这样操作');
                    return;
                }
                H.server.indexManage_recommendGoods_move({
                    current_id: id,
                    next_id: this.state.goodsList[index + 1].id
                }, (res)=>{
                    if(res.code == 0){
                        this.init();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);}
                });
                break;
            case '上移':
                if(index - 1 < 0) {
                    H.Modal('您不能这样操作');
                    return;
                }
                H.server.indexManage_recommendGoods_move({
                    current_id: id,
                    next_id: this.state.goodsList[index - 1].id
                }, (res)=>{
                    if(res.code == 0){
                        this.init();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);}
                });
                break;
            case '下架':
                H.Modal({
                    title: '确认下架商品',
                    content: '<p>确定要下架该商品吗，下架之后若要恢复请联系管理员</p>',
                    okText: '确定',
                    cancel: true,
                    okCallback: () => {
                        H.server.indexManage_recommendGoods_pullOff({
                            id: id
                        }, (res)=>{
                            if(res.code == 0){
                                H.Modal('下架成功');
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '查看图片':
                break;
        }

    }

    //适配器
    clickCallback(e){
        let target = e.target,
            dataset = target.dataset,
            operate = dataset.operate,
            index = dataset.index;
        if(!operate) return;
        if(index){
            this.state.defaultPara[operate] = index;
            this.init();
            this.state.defaultPara.page = 1;
            return;
        }
        this[operate]();
    }

    //输入框的值
    onChange(e) {
        let target = e.target,
            dataset = target.dataset,
            para = dataset.para,
            value = target.value.split('T').join(' ');
        if(target.type == 'text'){
            value = target.value;
            this.state[para] = value;
            return;
        }
        this.state[para] = value + ':00';
    }

    //添加推荐商品
    add(){
        let state = this.state,
            para = {
                area_id: state.defaultPara.area_id,
                goods_id: state.goods_id,
                put_on_at: state.put_on_at,
                pull_off_at: state.pull_off_at
            };
        H.server.indexManage_recommendGoods_add(para, (res)=>{
            if(res.code == 0){
                H.Modal('添加成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //翻页
    setPageNum(page){
        this.state.defaultPara.page = page.page;
        this.init();
    }

    render() {
        return (
            <div>
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createAreaFilter()}
                        </div>
                    </form>
                </div>

                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createInputArea()}
                        </div>
                    </form>
                </div>

                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createStatusFilter()}
                        </div>
                    </form>
                </div>

                {this.createGoodsList()}
                <Paging key={this.state.defaultPara.status + 1}   maxPage={Math.ceil(this.state.total/this.state.defaultPara.size)} clickCallback={this.setPageNum.bind(this)} />
            </div>
        );
    }
}

RecommendGoods.contextTypes = {
    areaData: React.PropTypes.array
};

export default RecommendGoods;