/*
 * 排行榜*/
import React from 'react';
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import RankGoods from './rank-goods.jsx';
import RankOrder from './rank-order.jsx';

class Rank extends React.Component{
    constructor(props){
        super(props);
            this.state ={
                currentPage: 0
            };

    }

    createMenu(){
        let btnNames = ['订单排行', '商品排行'],
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
            panel = <RankOrder />;
        } else if(page == 1){
            panel = <RankGoods />;
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
export default Rank;