/**
 * Created by Doden on 2017.03.02
 */

import React from 'react';
import BtnGroup from './../../../components/btn-group/btn_group.jsx';
import ServiceWeChatTag from './serviceWechatTag.jsx';
import ServiceWeChatMenu from './serviceWechatMenu.jsx';

class ServiceInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage:0
        };
    }

    createMenu(){
        let btnNames = ['微信标签', '微信菜单'],
            btnData = [0, 1];

        return (<BtnGroup btnNames={btnNames} bindData={btnData} clickCallback={this.toggle.bind(this)}
                          style="btn btn-lg" activeStyle="btn btn-lg btn-default" status={this.state.currentPage}/>);
    }

    toggle(e){
        let index = e.target.dataset.index;

        if(index == this.state.currentPage){
            return;
        }

        this.setState({
            currentPage: index
        });
    }

    createPanel(){
        let panel = null;

        if(this.state.currentPage == 0){
            // 微信会员
            panel = <ServiceWeChatTag source={this.props.source}/>;
        }else if(this.state.currentPage == 1){
            // 菜单
            panel = <ServiceWeChatMenu source={this.props.source}/>;
        }

        return panel;
    }

    render() {
        return (<div className="section-warp" style={{marginTop:'30px'}}>
            <div className="section-filter">
                <form className="form-inline">
                    <div className="filter-row" style={{border:'none'}}>
                        {this.createMenu()}
                    </div>
                </form>
            </div>
            <div className="section-table">
                {this.createPanel()}
            </div>
        </div>);
    }
}

export default ServiceInterface;