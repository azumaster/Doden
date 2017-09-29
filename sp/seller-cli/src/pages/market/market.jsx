/**
 * Created by Doden on 2017.03.08
 */

import { connect } from 'react-redux';
import MultiBtnGroup from '../../components/multiBtnGroup/multiBtnGroup.jsx';
import Action from '../../redux/actions/action.js';


class Market extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marketList:[],
            checkedMarket: []
        };
    }

    componentWillMount(){
        this.getMarket();
    }

    getMarket(){
        let checked = [];
        $.loading.show();

        $.req.getMarketList({}, (res)=>{
            if(res.code == 0){
                $.loading.hide();
                res.data.map((m, i)=>{
                    if(m.selected){
                        checked.push(i);
                    }
                });
                this.setState({
                    marketList: res.data,
                    checkedMarket: checked
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
                $.loading.hide();
            }
        });
    }

    marketSubmit(){
        let market = [];

        this.state.checkedMarket.map((m)=>{
            market.push(this.state.marketList[m].market_id);
        });

        $.req.updateMarket(JSON.stringify({market_ids:market}), (res)=>{
            if(res.code == 0){
                this.setState({
                    checkedMarket: []
                }, ()=>{
                    $.toast({text:'提交成功！'});
                    this.getMarket();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    toggleMarket(e){
        let index = e.target.dataset.index,
            checked = this.state.checkedMarket,
            btnIndex = -1,
            isChecked = false;

        checked.map((c, i)=>{
            if(c == index){
                isChecked = true;
                btnIndex = i;
            }
        });

        if(isChecked){
            checked.splice(btnIndex, 1);
        }else {
            checked.push(index);
        }

        this.setState({
            checkedMarket:checked
        });
    }

    createMarketList(){
        let marketList = this.state.marketList,
            checked = this.state.checkedMarket,
            btnNames = [],
            btnData = [];
        if(!marketList){
            return;
        }

        marketList.map((market, index)=>{
            btnNames.push(market.market_name);
            btnData.push(index);

        });

        return <MultiBtnGroup btnNames={btnNames} btnData={btnData} style="btn-default" activeStyle="btn-market"
            clickCallback={this.toggleMarket.bind(this)} checked={checked}/>;
    }

    render() {
        return (<div id="sellerMarket" className="seller-market">
            <div id="marketNotice" className="market-notice">
                <h5 className="text-assist">请选择市场</h5>
            </div>
            <div id="marketChoice" className="market-choice">
                <div className="market-list">
                    {this.createMarketList()}
                </div>
                <h6 className="text-assist text-center market-info">
                    <i className="icon info text-green" />选择市场后，客户将在该市场浏览并购买商品</h6>
            </div>
            <div id="marketSubmit" className="market-submit">
                <button type="button" className="btn btn-ok btn-full" onClick={this.marketSubmit.bind(this)}>确认提交</button>
            </div>
        </div>);
    }
}

const mapStateToProps = (state)=>{
    return {
        marketList: state.market
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getMarketList: ()=>{Action(dispatch, 'fetchMarketList');},
        updateMarket: (data)=>{Action(dispatch, 'fetchUpdateMarket', JSON.stringify(data));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Market);