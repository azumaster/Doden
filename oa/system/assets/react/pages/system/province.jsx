/**
 * Created by Doden on 2017.05.02
 */

import React from 'react';

import Market from './market.jsx';
import Table from '../../../components/table.jsx';
import Paging from '../../../components/page/paging.js';

class Province extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markets: [],
            provinceList: [],
            countyList: [],
            showPanel: null,
            page: 1,
            total: 21,
            size: 20
        };
        this.operate = this.operate.bind(this);
        this.closePanel = this.closePanel.bind(this);
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        new Promise((resolve)=>{
            this.getMarketList(resolve);
        }).then(()=>{
            this.getProvince();
        });
    }

    getMarketList(resolve){
        H.server.get_market_list({page: this.state.page, size: this.state.size}, (res)=>{
            if(res.code == 0){
                this.setState({
                    markets: res.data.detail,
                    page: res.data.current,
                    total: res.data.total
                }, ()=>{if(resolve) resolve('ok');});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    getProvince(){
        H.server.get_province_list({is_add: 'add'}, (res)=>{
            if(res.code == 0){
                this.setState({
                    provinceList: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createTable(){
        let headlines = ['开通时间', '开通省市', '卖家市场数', '买家区域数', '买家数量', '卖家数量', '操作'],
            order = ['open_time', 'dividename', 'seller_market_num', 'buyer_county_num', 'buyer_num', 'seller_num', 'operate'],
            statusOperate = {},
            fn= {
                6: this.operate
            };
        this.state.markets.map((market, index) => {
             market.operate = index;
             statusOperate[index] = ['市场管理'];
        });
        return (
            <Table values={this.state.markets} headlines={headlines} order={order} bodyOperate={fn} id={'province'}
                   statusOperate={statusOperate}/>
        );
    }

    operate(e){
        let operate = e.target.innerHTML,
            divideId = this.state.markets[e.target.dataset.reactid.split('$')[2].split('.')[0]].divide_id;

        switch (operate){
            case '市场管理':
                this.setState({
                    showPanel: <Market divideid={divideId} closePanel={this.closePanel}/>
                });
                break;
        }
    }

    // 新增省市
    addProvince(){
        let options = '';

        H.Modal({
            title: '开通省市',
            content: '<h5>请选择要开通的区域</h5>' +
            '<select id="provinceList" class="form-control"></select>' +
            '<h5 id="provinceName"></h5>',
            cancel: true,
            okText: '确认开通',
            okCallback: ()=>{
                H.server.open_province({id: $('#provinceList option:selected').val()}, (res)=>{
                    if(res.code == 0){
                        H.Modal('成功开通');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });

        for(let key in this.state.provinceList){
            options += '<option value="'+key+'">'+this.state.provinceList[key]+'</option>';
        }

        $('#provinceList').html(options).change(()=>{
            $('#provinceName').html('您已选择：'+$('#provinceList').find('option:selected').text());
        });

        $('#provinceName').html('您已选择：'+$('#provinceList').find('option:first-child').text());
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.getMarketList);
    }

    closePanel() {
        this.setState({showPanel: null});
    }

    render() {
        return (<div className="section-warp">
            <div className="section-filter">
                <form className="form-inline">
                    <div className="filter-row">
                        <button className="btn btn-lg btn-default" type="button" onClick={this.addProvince.bind(this)}>新增省市</button>
                    </div>
                </form>
            </div>
            <div className="section-table" >
                <p>共开通了{this.state.total}个省市</p>
                {this.createTable()}
                <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
            </div>
            {this.state.showPanel}
        </div>);
    }
}

export default Province;