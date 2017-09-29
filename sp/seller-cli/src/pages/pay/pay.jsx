/**
 * Created by Doden on 2017.03.30
 */

import MultiBtnGroup from '../../components/multiBtnGroup/multiBtnGroup.jsx';

class pay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payList: [],
            checkedPay: []
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        let checked = [];
        $.loading.show();

        $.req.getPayList({}, (res)=>{
            if(res.code == 0){
                $.loading.hide();
                res.data.map((m, i)=>{
                    if(m.selected){
                        checked.push(i);
                    }
                });
                this.setState({
                    payList: res.data,
                    checkedPay: checked
                });
            }else {
                $.loading.hide();
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    togglePay(e){
        let index = e.target.dataset.index,
            checked = this.state.checkedPay,
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
            checkedPay:checked
        });
    }

    createPayList(){
        let payList = this.state.payList,
            checked = this.state.checkedPay,
            btnNames = [],
            btnData = [];
        if(!payList){
            return;
        }

        payList.map((pay, index)=>{
            btnNames.push(pay.pay_name);
            btnData.push(index);

        });

        return <MultiBtnGroup btnNames={btnNames} btnData={btnData} style="btn-default" activeStyle="btn-market"
                              clickCallback={this.togglePay.bind(this)} checked={checked}/>;
    }

    submitPay(){
        let pay = [];

        this.state.checkedPay.map((p)=>{
            pay.push(this.state.payList[p].id);
        });

        $.req.updatePay(JSON.stringify({pay_methods:pay}), (res)=>{
            if(res.code == 0){
                this.setState({
                    checkedPay: []
                }, ()=>{
                    $.toast({text:'提交成功！'});
                    this.getData();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    render() {
        let status = false;

        this.state.payList.map((pay)=>{
            if(pay.pay_name == '微信支付'){
                status = true;
            }
        });

        return (<div id="sellerPay" className="seller-pay">
            <div id="payNotice" className="pay-notice">
                <h5 className="text-assist">请选择收款方式</h5>
            </div>
            <div id="payChoice" className="pay-choice">
                <div className="pay-list">
                    {this.createPayList()}
                </div>
                {status?<h6 className="text-assist text-center pay-info">
                    <i className="icon info text-green" />微信在线支付，微信将收取您0.6%的手续费</h6>:null}
            </div>
            <div id="paySubmit" className="pay-submit">
                <button type="button" className="btn btn-ok btn-full" onClick={this.submitPay.bind(this)}>确认提交</button>
            </div>
        </div>);
    }
}

export default pay;