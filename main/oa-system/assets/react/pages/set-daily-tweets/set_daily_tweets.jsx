import React from 'react';

class SetDailyTweets extends React.Component{
    constructor(){
        super();
        this.state = {
            currentArea: 2, //选中的地区
            areaData:[], //地区的数据
            manageData: null //manage_list的data
        };
        this.getDataList = this.getDataList.bind(this);
    }

    //开始渲染后可以获得用户数据刷新页面
    componentWillMount(){
        H.server.other_customArea_list({}, (res) => {
            if (res.code == 0) {
                this.setState ({
                    areaData: res.data
                }, this.getDataList);
            }
        });
    }

    //获取数据储存到state并且更新我们的页面
    getDataList(){
        let para = {
            area_id:this.state.currentArea
        };
        H.server.operate_dailyNews_manage_list(para, (res) => {
            if (res.code == 0) {
                this.setState({
                    manageData:res.data
                });
            }
        });
    }

    //检查输入的问题
    checkInput(data){
        if(data.edit_user_id === ''){
            this.refs[1].focus();
        }else if(data.review_user_id === ''){
            this.refs[2].focus();
        }else{
            return true;
        }
        return false;
    }

    //选择区域
    switchArea(area){
        this.setState({
            currentArea:area.area_id
        }, () => {
            this.getDataList();
        });
    }

    //changeInput
    input(status, e){
        let data = this.state.manageData,
            val = e.target.value;
        if(status == 1) {
            data.edit_user_id = val;
        }else {
            data.review_user_id = val;
        }
        this.setState({manageData: data});
    }

    //提交我们请求参数
    submit(){
        let data = this.state.manageData;
        let para = {};
        if(this.checkInput(data)){
            para = {
                id: data.id,
                area_id: this.state.currentArea,
                edit_user_id: data.edit_user_id,
                review_user_id: data.review_user_id,
                send_time: data.send_time
            };
            H.server.operate_dailyNews_manage_edit(para, (res) => {
                if(res.code == 0){
                    H.Modal('修改成功');
                }else if(res.code == 10106) {
                    H.overdue();
                }else {
                    H.Modal(res.message);
                }
            });
        }
    }

    render(){
        return (
            <div className="section-warp">
                <div className="section-filter">
                    <form className="form-inline">
                        <div className="filter-row">
                            <div className="btn-group">
                                {
                                    this.state.areaData.map((data, index) => {
                                        return (
                                            <btn key={index}
                                                 className={data.area_id === this.state.currentArea ? 'btn btn-sm btn-default' : 'btn btn-sm'}
                                                 onClick={this.switchArea.bind(this, data)}
                                            >{data.area_name}</btn>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </form>
                </div>

                <div className="section-table">
                        <div>
                            <form role="form">
                                <div className="from-group">
                                    <label>推文编辑人员ID</label><br/>
                                    <div className="short-input">
                                        <input type="text" className="form-control" ref="1"
                                                value={this.state.manageData ? this.state.manageData.edit_user_id : null} onChange={this.input.bind(this, 1)} />
                                    </div>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每天下午3点，未编写推文，系统会下发短信到此手机上</span>
                                </div>

                                <div className="from-group">
                                    <label >推文审查人员ID</label><br/>
                                    <div className="short-input">
                                        <input type="text" className="form-control" ref="2"
                                               value={this.state.manageData ? this.state.manageData.review_user_id : null} onChange={this.input.bind(this, 2)} />
                                    </div>
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每天下午4点，未编写推文，系统会下发短信到此手机上</span>
                                </div>

                                <div className="header">
                                    <p>推文推送时间:{this.state.manageData ? this.state.manageData.send_time : null}</p>
                                </div>
                                <btn className="btn btn-sm" onClick={this.submit.bind(this)}>保存</btn>
                            </form>
                        </div>
                </div>
            </div>
        );
    }
}
export default SetDailyTweets;