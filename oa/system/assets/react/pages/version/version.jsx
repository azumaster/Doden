/*
* 前端版本控制;
* */
import BtnGroup from '../../../components/btn-group/btn_group.jsx';
import Table from '../../../components/table.jsx';
import Paging from '../../../components/page/paging.js';

class Version extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPara: {
                big_version: '',
                small_version: '',
                develop_version: ''
            },
            page: 1,
            size: 20,
            total: 0,
            logList: []
        };
        this.clickCallback = this.clickCallback.bind(this);
        this.update = this.update.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount(){
        this.init();
    }

    init(){
        H.server.version_log_list({
            page: this.state.page,
            size: this.state.size
        }, (res)=>{
            if(res.code == 0){
                this.setState({
                    total: res.data.total,
                    logList: res.data.version_logs
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //更新界面
    componentDidUpdate(){
        let logUpdate = document.querySelectorAll('.version-operate6');
        if(logUpdate[0] && this.state.page < 2){
            $(logUpdate[0]).removeClass('version-operate6');
            $(logUpdate[0]).click((e)=>{
                this.update(e);
            });
        }
    }

    createInputArea(){
        let btnNames = ['保存', '取消'],
            operate = ['save', 'cancel'];
        return(
            <div>
                <div onChange={this.onChange} className="input-area">
                    <p>大版本号：&emsp;<input type="number" data-para="big_version"/></p>
                    <p>小版本号：&emsp;<input type="number" data-para="small_version"/></p>
                    <p>开发版本号：<input type="number" data-para="develop_version"/></p>
                    <p>备注：&emsp;&emsp;&emsp;<input type="text" data-para="remark"/></p>
                </div>
                <BtnGroup btnNames={btnNames} operate={operate} clickCallback={this.clickCallback} style="btn btn-lg" />
            </div>
        );
    }

    createLogList(){
        let headlines = ['大版本号', '小版本号', '开发版本号', '备注', '创建时间', '更新时间', '操作'],
            order = ['big_version', 'small_version', 'develop_version', 'remark', 'created_at', 'updated_at'],
            operate = {
                6: ['更新']
            },
            bodyOperate = {
                6: this.update
            };
        return(
            <Table key={this.state.page} id="version" values={this.state.logList} headlines={headlines}
                   operate={operate} order={order} bodyOperate={bodyOperate}/>
        );
    }

    onChange(e){
        let target = e.target,
            para = target.dataset.para;
        this.state.defaultPara[para] = target.value;
    }

    clickCallback(e){
        let target = e.target,
            operate = target.dataset.operate;
        this[operate]();
    }

    //保存
    save(){
        H.server.version_log_add(this.state.defaultPara, (res) =>{
            if(res.code == 0){
                H.Modal('添加成功');
                this.init();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //取消
    cancel(){
        let inputArea = document.querySelector('.input-area'),
            inputs = inputArea.querySelectorAll('input'),
            len = inputs.length;
        for(let i = 0; i<len; i++){
            inputs[i].value = '';
        }
    }

    update(e){
        let index = e.target.parentNode.dataset.index,
            log = this.state.logList[index],
            remark = log.remark,
            develop_version = log.develop_version;
        H.server.version_log_update({
            develop_version: ++develop_version,
            remark: remark
        }, (res)=>{
            if(res.code == 0){
                H.Modal('更新成功');
                this.init();
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.init);
    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-table" >
                    <hr/>
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                {this.createInputArea()}
                            </div>
                        </form>
                    </div>
                    <hr/>
                    {this.createLogList()}
                    <Paging   maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)} />
                </div>
            </div>
        );
    }

}
export default Version;
