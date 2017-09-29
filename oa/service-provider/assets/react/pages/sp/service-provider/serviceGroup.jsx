/**
 * Created by Doden on 2017.03.02
 */
import Table from '../../../../components/table.jsx';
import Paging from '../../../../components/page/paging.js';

class ServiceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupList:[],
            page: 1,
            size: 20,
            total: 21
        };
        this.operate = this.operate.bind(this);
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.group_list({page:this.state.page, size: this.state.size}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    groupList: res.data.groups,
                    total: res.data.total,
                    page: res.data.page
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createAdd(){
        return (<div className="section-filter" style={{paddingTop: 0}}>
            <form className="form-inline">
                <div className="filter-row">
                    <label className="control-label" style={{marginRight:'10px'}}>手机号：</label>
                    <input type="tel" className="form-control" placeholder="输入手机号"/>
                    <button type="button" onClick={this.addAdmin.bind(this)} className="btn btn-lg btn-orange">新增管理员</button>
                </div>
            </form>
        </div>);
    }

    addAdmin(){

    }

    createTable(){
        let headlines = ['姓名', '手机号', '微信号', '开通日期', '开通人', '操作'],
            order = ['name', 'mobile', 'wechat', 'created_date', 'person', 'operate'],
            statusOperate = {},
            fn= {
                5: this.operate
            };

        this.state.groupList.map((group, index)=>{
            group.operate = index;
            statusOperate[index] = ['关闭', '开通'];
        });

        return (
            <Table values={this.state.groupList} headlines={headlines} order={order} bodyOperate={fn} id={'serviceGroup'}
                   statusOperate={statusOperate} />
        );

    }

    operate(e){
        let operate = $(e.target).html();

        switch (operate){
            case '关闭':
                console.log(operate);
                break;
            case '开通':
                console.log(operate);
                break;
        }
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.getData);
    }

    render() {
        return (<div className="section-warp" style={{marginTop:'30px'}}>
            <div className="section-table">
                {this.createAdd()}
                <div className="col-lg-12" >
                    <div className="row col-lg-12">
                        <p>共{this.state.total}个管理员</p>
                        {this.createTable()}
                        <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ServiceInfo;