/**
 * Created by Doden on 2017.03.02
 */

import React from 'react';

class ServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            service: null
        };
        this.updateArea = this.updateArea.bind(this);
    }

    componentWillMount(){
        this.getServiceDetail();
    }

    getServiceDetail(){
       H.server.show_service({shop_id: this.props.shopId}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    service: res.data[0]
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createServiceInfo(){
        let info = this.state.service;

        return info?(<table className="table table-hover">
            <tbody>
            <tr><td>店铺ID</td><td>{info.uid}</td></tr>
            <tr><td>店铺名</td><td>{info.shop_name}</td></tr>
            <tr><td>联系人</td><td>{info.user_name}</td></tr>
            <tr><td>微信</td><td>{info.wechat_account.wechat_name}</td></tr>
            <tr><td>联系电话</td><td>{info.mobile}</td></tr>
            <tr><td>店铺地址</td><td>{info.address} <a href="javascript:;" onClick={this.updateArea.bind(this)}>修改地址区域</a></td></tr>
            </tbody>
        </table>):null;
    }

    updateArea(){
        let info = this.state.service;
        H.Modal({
            title:'修改地址区域',
            width:600,
            content: '<form class="form-inline">' +
            '<select id="province" class="form-control" style="margin-right: 10px"><option value="0">省</option></select>' +
            '<select id="city" class="form-control" style="margin-right: 10px"><option value="0">市</option></select>' +
            '<select id="county" class="form-control"><option value="0">县</option></select></form>',
            cancel: true,
            okCallback: ()=>{
                let data = {};
                data.uid = info.uid;
                data.updates = {
                    province_id: $('#province').val(),
                    city_id: $('#city').val(),
                    county_id:$('#county').val()
                };

                H.server.update_service(data, (res)=>{
                    if(res.code == 0) {
                        H.Modal('修改成功');
                        this.getServiceDetail();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });

        // 先获取省的
        H.server.get_provider_province({}, (res)=>{
            if(res.code == 0) {
                let options = '<option value="0">省</option>';
                res.data.map((province)=>{
                    if(info.province_id == province.id){
                        options += '<option selected value="'+province.id+'">'+province.name+'</option>';
                    }else{
                        options += '<option value="'+province.id+'">'+province.name+'</option>';
                    }
                });
                $('#province').html(options);
                if($('#province').val()!=0){
                    this.updateCity($('#province').val(), info.city_id, info.county_id);
                }
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });

        $('#province').change(()=>{
            this.updateCity($('#province').val(), info.city_id, info.county_id);
        });
        $('#city').change(()=>{
            this.updateCounty($('#city').val(), info.county_id);
        });

    }

    updateCity(id, city, county){
        H.server.get_provider_children({id: id}, (res)=>{
            if(res.code == 0) {
                let options = '<option value="0">市</option>';
                res.data.map((c)=>{
                    if(city == c.id){
                        options += '<option selected value="'+c.id+'">'+c.name+'</option>';
                    }else{
                        options += '<option value="'+c.id+'">'+c.name+'</option>';
                    }
                });
                $('#city').html(options);
                if($('#city').val()!=0){
                    this.updateCounty($('#city').val(), county);
                }
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    updateCounty(id, county){
        H.server.get_provider_children({id: id}, (res)=>{
            if(res.code == 0) {
                let options = '<option value="0">县</option>';
                res.data.map((c)=>{
                    if(county == c.id){
                        options += '<option selected value="'+c.id+'">'+c.name+'</option>';
                    }else{
                        options += '<option value="'+c.id+'">'+c.name+'</option>';
                    }
                });
                $('#county').html(options);
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    render() {
        return (<div className="section-warp" style={{marginTop:'30px'}}>
            <div className="section-table">
                <div className="col-lg-12" >
                    <div className="row col-lg-12">
                        {this.createServiceInfo()}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ServiceInfo;