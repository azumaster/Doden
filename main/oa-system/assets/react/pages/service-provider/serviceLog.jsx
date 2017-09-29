/**
 * Created by Doden on 2017.03.02
 */

import React from 'react';
import Table from '../../../components/table.jsx';
import Paging from '../../../components/page/paging.js';

class ServiceLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logList:[],
            page: 1,
            size: 20,
            total: 21
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.service_log_list({page: this.state.page, size: this.state.size}, (res)=>{
            if(res.code == 0) {
                this.setState({
                    logList: res.data.logs,
                    total: res.data.total,
                    page: res.data.current
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    createTable(){
        let headlines = ['日期', '操作人', '操作说明'],
            order = ['created_at', 'user_name', 'operate'];

        let operate = {0: '关闭管理员', 1: '新增管理员', 2: '开通管理员', 10: '更新接口', 20: '关闭', 21: '编辑', 22: '申请开通', 23: '确认通过'};

        this.state.logList.map((log)=>{
            log.operate = operate[log.operate];
        });

        return (
            <Table values={this.state.logList} headlines={headlines} order={order} id={'serviceLog'}/>
        );
    }

    setPageNum(page){
        this.setState({
            page: page.page
        }, this.getData);
    }

    render() {
        return (<div className="section-warp" style={{marginTop:'30px'}}>
            <div className="section-table">
                <div className="col-lg-12" >
                    <div className="row col-lg-12">
                        <p>共{this.state.total}条操作日志</p>
                        {this.createTable()}
                        <Paging maxPage={Math.ceil(this.state.total/this.state.size)} clickCallback={this.setPageNum.bind(this)}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default ServiceLog;