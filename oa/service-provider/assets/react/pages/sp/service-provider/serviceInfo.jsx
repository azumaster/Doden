/**
 * Created by Doden on 2017.03.02
 * 服务商信息;
 */
class ServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            service: null,
            areaData: null
        };
        this.updateArea = this.updateArea.bind(this);
    }

    componentWillMount(){
        this.getServiceDetail();
        this.getProviderArea();
    }

    getServiceDetail(){
        //获取该服务商的店铺信息数据;
        H.server.show_service({shop_id: this.props.shopId}, (res)=>{
            if(res.code == 0) {
                this.setState({service: res.data[0]});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //获取该服务商的服务区域列表;
    getProviderArea(){
        H.server.provider_area({sp_id: this.props.shopId}, (res) => {
            if(res.code == 0) {
                this.setState({areaData: res.data});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createServiceInfo(){
        let info = this.state.service,
            area = this.state.areaData,
            areaXML = [];
        for(let i in area) {
            if(area[i]) {
                areaXML.push(
                    <p>{area[i]}<a style={{marginLeft: '50px'}} href="javascript:;" onClick={this.editArea.bind(this, i)}>修改</a>
                        <a href="javascript:;" onClick={this.delArea.bind(this, i, area[i])}>删除</a></p>
                );
            }
        }
        return info?(<table className="table table-hover">
            <tbody>
            <tr><td>店铺ID</td><td>{info.uid}</td></tr>
            <tr><td>店铺名</td><td>{info.shop_name}</td></tr>
            <tr><td>联系人</td><td>{info.user_name}</td></tr>
            <tr><td>微信</td><td>{info.wechat_account.wechat_name}</td></tr>
            <tr><td>联系电话</td><td>{info.mobile}</td></tr>
            <tr><td>店铺地址</td><td>{info.address}</td></tr>
            <tr><td>服务区域</td><td>
                {areaXML}
                <p><btn className="btn btn-lg btn-default" href="javascript:;" onClick={this.addArea.bind(this)}>新增区域</btn></p>
            </td></tr>
            </tbody>
        </table>):null;
    }

    //删除区域;
    delArea(areaId, o) {
        H.Modal({
            title: '删除区域',
            content: '确认删除该区域： '+o,
            cancel: true,
            okCallback: () => {
                H.server.provider_area_remove(JSON.stringify({area_id: areaId}), (res) => {
                    if(res.code == 0) {
                        H.Modal('删除成功');
                        let area = this.state.areaData;
                        area[areaId] = null;
                        this.setState({areaData: area});
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            }
        });
    }

    //修改区域;
    editArea(i) {
        this.updateArea('修改服务区域', () => {
            let data = {
                area_id: i,
                province_id: $('#province').val(),
                city_id: $('#city').val(),
                county_id: $('#county').val()
            };
            H.server.provider_area_edit(JSON.stringify(data), (res)=>{
                if(res.code == 0) {
                    H.Modal('修改成功');
                    this.getProviderArea();
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    //添加区域;
    addArea() {
        this.updateArea('新增服务区域', () => {
            let data = {
                sp_id: this.props.shopId,
                province_id: $('#province').val(),
                city_id: $('#city').val(),
                county_id: $('#county').val()
            };
            H.server.provider_area_add(JSON.stringify(data), (res)=>{
                if(res.code == 0) {
                    H.Modal('添加成功');
                    this.getProviderArea();
                }else if(res.code == 10106) {
                    H.overdue();
                }else{
                    H.Modal(res.message);
                }
            });
        });
    }

    updateArea(title, fn){
        let info = this.state.service;
        H.Modal({
            title: title,
            width:600,
            content: '<form class="form-inline">' +
            '<select id="province" class="form-control" style="margin-right: 10px"><option value="0">省</option></select>' +
            '<select id="city" class="form-control" style="margin-right: 10px"><option value="0">市</option></select>' +
            '<select id="county" class="form-control"><option value="0">县</option></select></form>',
            cancel: true,
            okCallback: fn
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