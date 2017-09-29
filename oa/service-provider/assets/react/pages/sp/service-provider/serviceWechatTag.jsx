/**
 * Created by Doden on 2017.03.16
 */
import Table from '../../../../components/table.jsx';

class ServiceWechatTag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: []
        };
        this.operate = this.operate.bind(this);
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.wechat_tag_list({source: this.props.source}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    tagList: res.data.tags
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createTable(){
        let headlines = ['ID', '标签名', '会员数', '操作'],
            order = ['id', 'name', 'count', 'operate'],
            statusOperate = {},
            fn= {
                3: this.operate
            };

        this.state.tagList.map((tag, index)=>{
            tag.operate = index;
            statusOperate[index] = ['编辑', '删除'];
        });

        return (
            <Table values={this.state.tagList} headlines={headlines} order={order} bodyOperate={fn} id={'wechatTag'}
                   statusOperate={statusOperate} />
        );
    }

    operate(e){
        let operate = e.target.innerHTML,
            source = this.props.source,
            tag_id = this.state.tagList[e.target.parentNode.dataset.index].id,
            tag_name = this.state.tagList[e.target.parentNode.dataset.index].name;

        switch (operate){
            case '编辑':
                H.Modal({
                    title: '编辑微信标签',
                    content: '<div class="form-horizontal" role="form">' +
                    '<div class="form-group"><label class="col-lg-4 control-label">新标签名：</label>' +
                    '<div class="col-lg-8"><input type="text" id="tagName" class="form-control" value="'+tag_name+'"></div></div>' +
                    '</div>',
                    cancel: true,
                    okCallback:()=>{
                        H.server.update_tag({source: source, tag_id: tag_id, tag_name:$('#tagName').val()}, (res)=>{
                            if(res.code == 0) {
                                H.Modal('操作成功');
                                this.getData();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
            case '删除':
                H.Modal({
                    title: '删除微信标签',
                    content:'是否删除该微信标签？',
                    cancel: true,
                    okCallback: ()=>{
                        H.server.del_tag({source: source, tag_id: tag_id}, (res)=>{
                            if(res.code == 0) {
                                H.Modal('操作成功');
                                this.getData();
                            }else if(res.code == 10106) {
                                H.overdue();
                            }else{
                                H.Modal(res.message);
                            }
                        });
                    }
                });
                break;
        }
    }

    render() {
        return (<div className="section-warp" style={{marginTop:'30px'}}>
            <div className="section-table">
                <div className="col-lg-12" >
                    <div className="row col-lg-12" style={{height: '500px', overflowY:'scroll'}}>
                        {this.createTable()}
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ServiceWechatTag;