/**
 * Created by Doden on 2017.03.08
 */

import React from 'react';
import { connect } from 'react-redux';
import Action from './../../../redux/actions/action.js';

class ShopInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shopInfo: null
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        $.loading.show();
        $.req.getShopInfo({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    shopInfo: res.data
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
            $.loading.hide();

        });
    }

    createShopInfo(){
        let shopInfo = this.state.shopInfo;

        if(!shopInfo){
            return;
        }

        return (<div className="ul seller-shop-info-ul">
            <div className="li">
                <div className="grid-row">
                    <div className="grid-col-4 grid-col-sm-5">
                        <h3 className="text-muted"><i className="icon shop"/>店铺名称：</h3>
                    </div>
                    <div className="grid-col-8 grid-col-sm-7">
                        <h3 className="text-muted">{shopInfo.shop_name}</h3>
                    </div>
                </div>
            </div>
            <div className="li">
                <div className="grid-row">
                    <div className="grid-col-4 grid-col-sm-5">
                        <h3 className="text-muted"><i className="icon address"/>店铺地址：</h3>
                    </div>
                    <div className="grid-col-8 grid-col-sm-7">
                        <h3 className="text-muted">{shopInfo.address}</h3>
                    </div>
                </div>
            </div>
            <div className="li">
                <div className="grid-row">
                    <div className="grid-col-4 grid-col-sm-5">
                        <h3 className="text-muted"><i className="icon phone"/>联系电话：</h3>
                    </div>
                    <div className="grid-col-8 grid-col-sm-7">
                        <h3 className="text-muted">{shopInfo.mobile}</h3>
                    </div>
                </div>
            </div>
        </div>);
    }

    render() {
        return (<div id="sellerShopInfo" className="seller-shop-info">
            {this.createShopInfo()}
            <h5 className="text-assist text-center shop-info-notice">修改信息请拨打电话：<a href="tel:18978765656">18978765656</a></h5>
        </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        shopInfo: state.shop
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getShopInfo: ()=>{Action(dispatch, 'fetchShopInfo');}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShopInfo);