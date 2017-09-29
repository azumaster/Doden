/**
 * Created by Doden on 2017.03.02
 */

import React from 'react';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import ServiceInfo from './serviceInfo.jsx';
import ServiceInterface from './serviceInterface.jsx';

class ServiceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0
        };
    }

    createSelectArea(){
        let btnNames = ['基本信息', '接口管理'],
            btnData = [0, 1];

        return(<BtnGroup btnNames={btnNames} bindData={btnData} clickCallback={this.toggle.bind(this)}
                         style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentPage}/>);
    }

    toggle(e){
        let index = e.target.dataset.index;

        if(index === this.state.currentPage){
            return;
        }

        this.setState({
            currentPage:index
        });
    }

    createPanel(){
        let page = this.state.currentPage,
            panel = null;

        if(page == 0){
            panel = <ServiceInfo shopId={this.props.shopId}/>;
        }else if(page == 1){
            panel = <ServiceInterface source={this.props.source}/>;
        }

        return panel;
    }

    render() {
        return (<div className="waybill-info-container">
            <div className="waybill-info-head container-fluid">
                <h3 className="title">查看服务商信息<button type="button" className="close" data-dismiss="modal" onClick={this.props.closePanel} style={{fontSize: '40px'}}>&times;</button></h3>
                <hr/>
                <div className="waybill-info-content">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createSelectArea()}
                        </div>
                    </form>
                    <div className="section-table" >
                        {this.createPanel()}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ServiceDetail;