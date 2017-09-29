import React from 'react';
import PageCtrlBar from '../../components/page/paging';
import Refresh from '../../components/refresh/refresh.js';
import FuzzySearchControl from './fuzzy-search-control.jsx';
var DropDown = require('../../components/drop_down/drop-down.js');

let Control = React.createClass({

    contextTypes: {
        currFresh: React.PropTypes.func
    },

    getInitialState(){
        return {
            selVal: 0,
            filterCondition: {}
        };
    },

    getCurrentPageData(condition = {}){
        // 根据已有的状态跟新当前页的数据业务逻辑
            // 与当前已有的条件进行合并
        let newCondition = Object.assign(this.state.filterCondition, condition);
        this.setState({
            filterCondition: newCondition
        }, () => {
            this.context.currFresh(this.state.filterCondition);
        });
    },

    refresh(){
        this.setState({
            filterCondition:{},
            infoPanelIsShow: false
        }, () => {
            // 初始化关键字搜索和日期选择，再点击筛选按钮组中的全部按钮来请求全部数据一次来达到页面刷新的效果
            $('#component_search_input').val('');
            this.context.currFresh(this.state.filterCondition);
        });
    },

    save(p){
        let param = p,
            data = this.props.data;
        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].bank_card_infos.id == param.id) {
                Object.assign(param, data[i].bank_card_infos);
            }
        }
        H.server.shop_bankCard_set_info(param, (res) => {
            if(res.code == 0){
                H.Modal(res.message);
            }else {
                H.Modal(res.message);
            }
        });
    },

    bankAddressChange(id) {
        let val = this.refs['bank_address_' + id].value;
        this.props.bankAddressChange && this.props.bankAddressChange(val, id);
    },

    render(){
        return (
            <div className="section-withdraw">
                <div className="section-filter">
                    <Refresh refreshEv={this.refresh}/>
                    <form action="" className="form-inline">
                        <div className="search-inputs-w">
                            <FuzzySearchControl searchHandler={this.getCurrentPageData} dropdownMenus={['店铺名']}/>

                        </div>

                    </form>
                </div>
                <div className="section-table">
                    <table className="table table-bordered table-responsive">
                    	<thead>
                            <tr>
                                <th>商品信息</th>
                                <th>收款银行</th>
                                <th>开户地址</th>
                                <th>省</th>
                                <th>市</th>
                                <th>操作</th>
                            </tr>
                    	</thead>
                        <tbody>
                            {this.props.data.map((data, index)=>{
                                let param = {
                                    id: data.bank_card_infos.id,
                                    shop_id: data.shop_infos.shop_id
                                    },
                                    bankSelVal = 0;
                                for(let n = 0 ; n < this.props.dropdownBank.length ; n++) {
                                    if(data.bank_card_infos.bank_name == this.props.dropdownBank[n]) {
                                        bankSelVal = n;
                                        break;
                                    }
                                }
                                return (
                                    <tr key={'tr_' + index}>
                                        <td>{data.shop_infos.user_name}({data.shop_infos.shop_name})</td>
                                        <td>
                                            <DropDown
                                                dropdownData={this.props.dropdownBank}
                                                changeEv={this.props.backSelVal}
                                                selectVal={bankSelVal}
                                                bankId={data.bank_card_infos.id}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                id={'bank_address_' + data.bank_card_infos.id}
                                                className='form-control'
                                                defaultValue={data.bank_card_infos.bank_address}
                                                onChange={this.bankAddressChange.bind(this, data.bank_card_infos.id)}
                                                ref={'bank_address_' + data.bank_card_infos.id}
                                            />
                                        </td>
                                        <td>
                                            <DropDown
                                                dropdownData={this.props.cityData.privince_infos}
                                                changeEv={this.props.changePrivince}
                                                selectVal={data.bank_card_infos.province_id}
                                                bankId={data.bank_card_infos.id}

                                            />
                                        </td>
                                        <td>
                                            <DropDown
                                                dropdownData={this.props.cityData.city_infos[data.bank_card_infos.province_id]}
                                                changeEv={this.props.changeCity}
                                                selectVal={data.bank_card_infos.city_id}
                                                bankId={data.bank_card_infos.id}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" onClick={this.save.bind(this, param)}>保存</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <PageCtrlBar clickCallback={this.getCurrentPageData} pageNum={this.props.currentPage} maxPage={this.props.pageNum}/>

                </div>

            </div>
        );
    }
});

module.exports = Control;