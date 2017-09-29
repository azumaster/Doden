/**
 * Created by Doden on 2017.05.08
 */

import React from 'react';

import Table from '../../../components/table.jsx';
import Paging from '../../../components/page/paging.js';

class Market extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceList:[],
            marketList: [],
            provinceId: 0,
            page:1,
            size:20,
            total: 0
        };
    }

    componentWillMount(){
        new Promise((resolve)=>{
            this.getData(resolve);
        }).then(()=>{
            this.getCity();
        });
    }

    getData(resolve){
        H.server.get_market_detail({divideid: this.props.divideid, page: this.state.page, size: this.state.size}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    marketList: res.data.detail,
                    provinceId: res.data.province_id,
                    page: res.data.current,
                    total: res.data.total
                }, ()=>{if(resolve) resolve('OK');});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    getCity(){

        if(this.state.provinceId >= 0 && this.state.provinceId <= 30){
            H.server.get_province_list({pid: this.state.provinceId}, (res)=>{
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
    }

    createTable(){
        let headlines = ['市场名', '所在地', '添加时间'],
            order = ['pianqu', 'place', 'addTime'];

        this.state.marketList.map((market)=>{
            market.place = market.province+market.city+market.county;
        });

        return (
            <Table values={this.state.marketList} headlines={headlines} order={order} id={'market'}/>
        );
    }

    addNew(){

        let cities = '',
            counties = '';
        H.Modal({
            title: '新增市场',
            content: '<div class="row"><div class="form-group">' +
            '<div class="input-group" id="cityLevel" style="margin-bottom: 20px;display:none">' +
            '<div class="input-group-addon">所在市级</div>' +
            '<select id="selectCity" class="form-control"></select></div>' +
            '<div class="input-group" id="countyLevel" style="margin-bottom: 20px; display:none">' +
            '<div class="input-group-addon">所在区县级</div>' +
            '<select id="selectCounty" class="form-control"></select></div>' +
            '<div class="input-group">' +
            '<div class="input-group-addon">市场名</div>' +
            '<input type="text" class="form-control" id="marketName" placeholder="请输入市场名"></div>' +
            '</div></div>',
            cancel: true,
            okCallback: ()=>{
                let pid = this.state.provinceId,
                    cid = $('#selectCity option:selected').val()?$('#selectCity option:selected').val():0,
                    county_id = $('#selectCounty option:selected').val()?$('#selectCounty option:selected').val():0,
                    name = $('#marketName').val();

                H.server.open_market({pid: parseInt(pid), cid: cid, county_id: county_id, name: name}, (res)=>{
                    if(res.code == 0){
                        H.Modal('开通市场成功');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });

        this.state.provinceList.map((province, index)=>{
            cities += '<option value="'+index+'">'+province+'</option>';
        });

        $('#selectCity').html(cities).change(()=>{
            let cityId = $('#selectCity').get(0).selectedIndex;

            counties = '';
            if(this.state.provinceId>=3 && this.state.provinceId<=30 && this.state.provinceId != 9){
                H.server.get_county_list({pid: this.state.provinceId, cid: cityId}, (res)=>{
                    if(res.code == 0){
                        res.data.map((county, index)=>{
                            counties += '<option value="'+index+'">'+county+'</option>';
                        });
                        $('#selectCounty').html(counties);

                        if(counties){
                            $('#countyLevel').css({display: 'table'});
                        }else{
                            $('#countyLevel').css({display: 'none'});
                        }

                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });

        if(cities){
            $('#cityLevel').css({display: 'table'});
        }

        if(this.state.provinceId>=3 && this.state.provinceId<=30 && this.state.provinceId != 9) {
            H.server.get_county_list({
                pid: this.state.provinceId,
                cid: $('#selectCity').get(0).selectedIndex
            }, (res) => {
                if (res.code == 0) {
                    res.data.map((county, index) => {
                        counties += '<option value="' + index + '">' + county + '</option>';
                    });

                    if(counties){
                        $('#countyLevel').css({display: 'table'});
                    }

                    $('#selectCounty').html(counties);

                } else if (res.code == 10106) {
                    H.overdue();
                } else {
                    H.Modal(res.message);
                }
            });
        }

    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.getData);
    }

    render() {
        return (<div className="panel-contents" style={{position: 'absolute', width: '100%', height: '100%', top: '52px', left: 0, zIndex: 2, backgroundColor: '#fff'}}>
            <div className="container-fluid panel-head">
                <h3 className="title">市场管理<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                <hr/>
                <div className="panel-body">
                    <div className="panel-filter">
                        <button type="button" className="btn btn-default btn-lg" onClick={this.addNew.bind(this)}>新增市场</button>
                    </div>
                    {this.state.marketList.length>0?
                        <div className="section-table" >
                            <p>共开通了{this.state.total}个市场</p>
                            {this.createTable()}
                            <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                        </div>:<div className="section-table" >
                            <h4>还没有添加市场</h4>
                    </div>}
                </div>
            </div>
        </div>);
    }
}

export default Market;