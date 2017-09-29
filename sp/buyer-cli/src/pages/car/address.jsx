/**
 * Created by Doden on 2017.03.10
 */

import { connect } from 'react-redux';
import Action from '../../redux/actions/action.js';

class EditAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentId: props.carConfirmData.param.address_id
        };
        if(!this.props.address) location.href = '#/buyer/car';
    }

    createAddress () {
        let address = this.props.address.addresses,
            XML = [],
            currentId = this.state.currentId || this.props.carConfirmData.param.address_id;
        if(address.length <= 0) {
            XML = (
                <li>
                    <p>您还没有收货地址</p>
                    <a href="/me.html" style={{color: 'blue', lineHeight: '2', display: 'inline-block'}}>点击添加</a>
                </li>
            );
        }else {
            for(let i in address) {
                XML.push(
                    <li key={i}>
                        <label className={currentId == address[i].id ? 'item active' : 'item'}>
                            <input type="radio" className="car-address-radio" onChange={this.radioChange.bind(this, address[i].id)} />
                            <div className="flex"><div className="flex-item">收货人：{address[i].receiver}</div><div>{address[i].mobile}</div></div>
                            <div>{address[i].intact_address}</div>
                        </label>
                    </li>
                );
            }
        }

        return XML;
    }

    //选择地址;
    radioChange(id) {
        this.setState({currentId: id});
    }

    confirmAddress() {
        let data = this.props.carConfirmData;
        data.param.address_id = this.state.currentId;
        this.props.setCarConfirmData(data);
        location.href = '#/buyer/car/confirm';
    }

    render() {
        return (
            <div id="carAddress" className="car-address">
                <h1 className="hd flex"><div className="flex-item">选择收货地址</div><a href="/me.html" style={{color: 'blue', fontSize: '12px'}}>管理地址</a></h1>
                <ul>
                    {this.createAddress()}
                </ul>
                <div className="btn-cell"><button className="btn btn-full btn-primary" onClick={this.confirmAddress.bind(this)}>确定</button></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        address: state.carAddress,
        carConfirmData: state.carConfirmData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCarConfirmData: (data)=>{Action(dispatch, 'fetchCarConfirmData', data);}
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(EditAddress);