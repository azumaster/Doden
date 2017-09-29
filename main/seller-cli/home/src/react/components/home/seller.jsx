/**
 * Created by Doden on 2017.05.03
 */

import React from 'react';

class Seller extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visit: 0
        };
    }

    componentDidMount(){
        H.server.getBrowser({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    visit: res.data.visit_num
                });
            }else {
                H.toast(res.message);
            }
        });
    }

    toSetting(){
        this.props.setting && this.props.setting();
    }

    render() {
        return (<div id="seller" className="seller" onClick={this.toSetting.bind(this)}>
            <div className={'seller-head '+(this.props.shopInfo.license_act==1?'vip':null)}><img src={H.getCdn()+this.props.shopInfo.cardpic+'@110w_90Q.jpg'}/></div>
            <div className="seller-info">
                <div className="shop-name"><p>{this.props.shopInfo.dianpuname}</p></div>
                <div className="shop-extra"><p><i className="icon head"></i>{this.props.shopInfo.xingming}</p><p><i className="icon phone"></i>{this.props.shopInfo.jiedantel}</p></div>
            </div>

            <div className="see">日浏览量：{this.state.visit}</div>
            <div className="seller-setting"><i className="icon setting"></i></div>
        </div>);
    }
}

export default Seller;