/*
* 服务商统计*/

import React from 'react';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import CustomerStatistics from './customer-statistics.jsx';
import OrderStatistics from './order-statistics.jsx';

class ServiceStatistics extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            currentPage: 0   //当前统计的状态，0表示客户统计，1表示订单统计;
        };
    }

    componentWillMount() {

    }

    createMenu(){
        let btnNames = ['客户统计', '订单统计'],
            btnData = [0, 1];

        return (<BtnGroup btnNames={btnNames} bindData={btnData} clickCallback={this.toggle.bind(this)}
                          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentPage}/>);
    }

    toggle(e){
        let page = e.target.dataset.index;
        if(page == this.state.currentPage){
            return;
        }
        this.setState({currentPage: page});
    }

    createPanel(){
        let panel = null,
            page = this.state.currentPage;
        if(page == 0){
            panel = <CustomerStatistics />;
        } else if(page == 1){
            panel = <OrderStatistics />;
        }
        return panel;
    }
    render(){
        return(
            <div className="section-warp">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createMenu()}
                        </div>
                    </form>
                </div>
                <div className="section-table" >
                    {this.createPanel()}
                </div>
            </div>
        );
    }
}
export default ServiceStatistics;