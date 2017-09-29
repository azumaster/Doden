
/**
 * 搜索权限的配置
 */
class AccessConfig extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: {} //设置项
        };

        this.createForm = this.createForm.bind(this);
    }

    componentWillMount() {
        H.server.get_access_config({}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    data: res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //创建一个表单
    createForm() {
        let form = [],
            tips = [],
            boosts = [];

        for(let val in this.state.data.tip) {
            tips.push(this.state.data.tip[val]);
        }

        for(let val in this.state.data.boost) {
            boosts.push(this.state.data.boost[val]);
        }

        for(let i = 0; i < tips.length; i++) {
            form.push(
                <div className='form-group has-primary' key={i}>
                    <div className='input-group col-md-6'>
                        <div className='input-group-addon access-input-addon'>{tips[i]}</div>
                        <input className="form-control input-lg" type="number" placeholder="Enter email" defaultValue={boosts[i]}/>
                    </div>
                </div>
            );
        }

        return form;
    }

    pushAccess() {
        let boosts = [],
            labels = [],
            pushBoosts = {};

        // 弹出确认提交的框
        H.Modal({
            title: '确认提交',
            content: '<p>你确定要提交权重设置信息吗？</p>',
            okText: '确认提交',
            cancel: true,
            okCallback:() => {
                //获取到表单当中的数据
                for(let i=0; i < $('.form-control').length; i++) {
                    boosts.push($('.form-control')[i].value);
                }

                for(let val in this.state.data.boost) {
                    labels.push(val);
                }
                for(let i=0; i<boosts.length; i++){
                    pushBoosts[labels[i]] = boosts[i];
                }

                //提交数据
                H.server.push_access_config(pushBoosts, (res) => {
                    if(res.code == 0) {
                        H.Modal('提交成功！');
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else {
                        H.Modal(res.message);
                    }
                });


            }
        });

    }

    render() {
        return (
            <div className="section-warp">
                <div className="section-filter">

                </div>
                <div className="section-table">
                    {this.createForm()}
                    <div className="btn-group col-lg-6">
                        <a className="btn btn-lg btn-default" style={{float:'right'}} onClick={this.pushAccess.bind(this)}>提交数据</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccessConfig;