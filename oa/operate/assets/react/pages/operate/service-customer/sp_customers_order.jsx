/**
 * Created by Doden on 2017.06.08
 */

import React from 'react';
import DatePicker from './../../../../components/datePicker/index.jsx';

class SpCustomersOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            param: {
                time: ['2000-01-01', '2001-01-01'],
                mobile: ''
            },
            status: [],
            current: null
        };
    }

    componentWillMount(){
        let param = this.state.param;

        param.time[0] = H.getSouroundDate(6);
        param.time[1] = H.getSouroundDate(0);

        this.setState({
            param: param
        });
    }

    changeMobile(e){
        let mobile = e.target.value;
        this.setState({
            current: null
        }, ()=>{
            if((/^1[34578]\d{9}$/.test(mobile))){
                // 发起请求获取到服务商名字
                H.server.search_service({search_type: 2, content: mobile}, (res)=>{
                    if(res.code == 0){
                        let current = res.data[0];
                        this.setState({
                            current: current
                        });
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }else {
                this.setState({
                    current: null
                });
            }
        });
    }

    dateRange(){
        let param = this.state.param;
        param.time[0] = $('#order_statistics_startTime').val();
        param.time[1] = $('#order_statistics_endTime').val();
        //传进来的起止时间，通过setDate去更新组件的状态
        this.setState({param: param});
    }

    // 选择状态
    changeStatus(){
        let statusDiv = document.getElementsByName('status'),
            status = [];

       for(let i = 0; i<statusDiv.length; i++){
           if(statusDiv[i].checked){
               if(statusDiv[i].value == 1){
                   status.push('101');
               }
               status.push(statusDiv[i].value);
           }
       }

       this.setState({
           status: status
       });
    }

    export(){
        let form = document.getElementById('exportForm');
        form.submit();
    }


    render() {
        let st = [];
        this.state.status.map((s, i)=>{
            st.push(<input type="hidden" name={'status['+i+']'} value={s}/>);
        });

        return (<div className="sp_order-wrap">
            <div className="section-filter">
                <div className="form-inline">
                    <div className="filter-row">
                        <input type="tel" maxLength="11" className="form-control input-sm" onChange={this.changeMobile.bind(this)} defaultValue={this.state.param.mobile} placeholder="请输入手机号"/>
                        <DatePicker start={this.state.param.time[0]} end={this.state.param.time[1]}
                                    prefix="order_statistics_" otherClass="input-sm" changeCallback={this.dateRange.bind(this)}/>
                        <button type="button" className="btn btn-default btn-lg" onClick={this.export.bind(this)}>导出订单</button>
                        <form id="exportForm" action="/provider/order/export" method="post">
                            <input type="hidden" name="begin" value={this.state.param.time[0]}/>
                            <input type="hidden" name="end" value={this.state.param.time[1]}/>
                            {this.state.current?<input type="hidden" name="sp_id" value={this.state.current.wechat_account.sp_id}/>:null}
                            {st}
                        </form>
                    </div>
                    <form id="formStatus" className="form-inline" style={{marginBottom: '10px'}} onChange={this.changeStatus.bind(this)}>
                        <span style={{marginRight: '30px'}}>选择状态</span>
                        <label style={{marginRight:'30px'}}><input type="checkbox" name="status" id="checkOne" value={1}/>待确认</label>
                        <label style={{marginRight:'30px'}}><input type="checkbox" name="status" id="checkTwo" value={2}/>待发货</label>
                        <label style={{marginRight:'30px'}}><input type="checkbox" name="status" id="checkThree" value={3}/>待收货</label>
                        <label style={{marginRight:'30px'}}><input type="checkbox" name="status" id="checkFour" value={4}/>已收货</label>
                        <label style={{marginRight:'30px'}}><input type="checkbox" name="status" id="checkFive" value={5}/>已取消</label>
                    </form>
                    <p>当前服务商：{this.state.current?this.state.current.shop_name:'[无此服务商]'}</p>
                </div>
            </div>
        </div>);
    }
}

export default SpCustomersOrder;