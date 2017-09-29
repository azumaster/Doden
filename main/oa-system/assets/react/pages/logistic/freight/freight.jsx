/**
 * 运费管理
 * @author 魏华东
 * @date 2017.1.9
 */

import React from 'react';
import BtnGroup from '../../../../components/btn-group/btn_group.jsx';
import FreightCancel from './freight-cancel.jsx';
import FreightPay from './freight-pay.jsx';
import FreightUnPay from './freight-unpay.jsx';

class Freight extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentState:0,
            freightPanel:null
        };
        this.createSelect = this.createSelect.bind(this);
    }

    // 创建选择的菜单
    createSelect(){
        let selectNames = ['未付', '已付', '已撤销'],
            selectData = [0, 1, 2];

        return (
            <BtnGroup btnNames={selectNames} bindData={selectData} clickCallback={this.toggle.bind(this)}
                      style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentState}/>
        );
    }

    // 切换状态
    toggle(e){
        let index = e.target.dataset.index;

        if(index === this.state.currentState){
            return;
        }

        this.setState({
            currentState:index
        });
    }

    // 创建底部的栏目
    createPanel() {
        let index = this.state.currentState,
            freightPanel = null;

        if(index == 0){
            // 未付
            freightPanel = <FreightUnPay />;
        }else if(index == 1){
            // 已付
            freightPanel = <FreightPay />;
        }else if(index == 2){
            // 已作废
            freightPanel = <FreightCancel/>;
        }

        return freightPanel;
    }

    render() {
        return (
        <div className="section-warp">
            <div className="section-table">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            {this.createSelect()}
                        </div>
                    </form>
                </div>
                <div className="col-lg-12">
                    {this.createPanel()}
                </div>
            </div>
        </div>
        );
    }
}

export default Freight;