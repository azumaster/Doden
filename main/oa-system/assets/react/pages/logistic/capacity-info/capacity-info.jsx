
/**
 * 运力管理
 * @author: 魏华东
 * @date: 2016/12/12
 */

import React from 'react';
import Table from '../../../../components/table.jsx';


class CapacityInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            capacityList:[]                         // 运力数据的数组
        };
        this.getData = this.getData.bind(this);
        this.operate = this.operate.bind(this);
    }

    componentWillMount() {
        this.getData();
    }

    // 获取数据
    getData() {
        H.server.get_capacity_info({display:'all'}, (res) => {
            if(res.code == 0) {
                this.setState({
                    capacityList:res.data
                });
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    // 创建运力管理的表格
    createTable() {
        let headlines = ['ID', '运力名称', '准载户数', '户数上限', '准载件数', '件数上限', '操作'],
            order = ['id', 'name', 'bill_no', 'bill_max', 'pack_no', 'pack_max', 'operate'],
            statusOperate = {},
            fn= {6: this.operate};

        this.state.capacityList.map((capacity, index) => {
            capacity.operate = index;
            statusOperate[index] = ['修改', '删除'];
        });

        return (
            <Table values={this.state.capacityList} headlines={headlines} order={order} bodyOperate={fn} id={'capacityInfo'}
                   statusOperate={statusOperate} status={status} />
        );
    }

    // 表格菜单的操作
    operate(e){
        let index = index = e.target.dataset.reactid.split('$')[2].split('.')[0],
            html = $(e.target).html(),
            capacityId = this.state.capacityList[index].id,                   // 运力ID
            capacityName = this.state.capacityList[index].name,               // 运力名称
            billNo = this.state.capacityList[index].bill_no,                  // 准载户数
            billMax = this.state.capacityList[index].bill_max,                // 最大户数
            packNo = this.state.capacityList[index].pack_no,                  // 准载件数
            packMax = this.state.capacityList[index].pack_max;                // 最大件数

        switch (html) {
            case '修改':
                H.Modal({
                    title:'修改运力信息',
                    width:'400',
                    content: '<div class="form-horizontal" role="form">' +
                    '<div class="form-group"><label class="col-lg-4 control-label">运力名称：</label>' +
                    '<div class="col-lg-8"><input id="capacityName" type="text" class="form-control" value='+capacityName+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">准载户数：</label>' +
                    '<div class="col-lg-8"><input id="billNo" min="0" type="number" class="form-control" value='+billNo+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">户数上限：</label>' +
                    '<div class="col-lg-8"><input id="billMax" min="0" type="number" class="form-control" value='+billMax+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">准载件数：</label>' +
                    '<div class="col-lg-8"><input id="packNo" min="0" type="number" class="form-control" value='+packNo+'></div></div>' +
                    '<div class="form-group"><label class="col-lg-4 control-label">件数上限：</label>' +
                    '<div class="col-lg-8"><input id="packMax" min="0" type="number" class="form-control" value='+packMax+'></div></div>' +
                    '</div>',
                    okText: '确认修改',
                    cancel: true,
                    okCallback: () => {
                        // 获取修改后的数据
                        capacityName = $('#capacityName').val();
                        billNo = $('#billNo').val();
                        billMax = $('#billMax').val();
                        packNo = $('#packNo').val();
                        packMax = $('#packMax').val();

                        //发起请求
                        H.server.modify_capacity({
                            id:capacityId,
                            name:capacityName,
                            bill_no:billNo,
                            bill_max:billMax,
                            pack_no:packNo,
                            pack_max:packMax
                        }, (res)=> {
                            if(res.code == 0) {
                                H.Modal('修改成功！');
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
                    content: '<p>确认要删除这条运力？</p>',
                    okText:'确认删除',
                    cancel: true,
                    okCallback: ()=>{
                        H.server.delete_capacity({id:capacityId}, (res)=> {
                            if(res.code == 0) {
                                H.Modal('删除成功！');
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

    // 添加新的运力信息
    addCapacity() {
        let addNew = H.Modal({
            title:'添加新运力',
            width:'400',
            autoClose:false,
            content: '<div id="capacityFrom" class="form-horizontal" role="form">' +
            '<div class="form-group"><label class="col-lg-4 control-label">运力名称：</label>' +
            '<div class="col-lg-8"><input id="caName" type="text" class="form-control" placeholder="请输入运力名称"></div></div>' +
            '<div class="form-group"><label class="col-lg-4 control-label">准载户数：</label>' +
            '<div class="col-lg-8"><input id="alNo" type="number" min="0" class="form-control" placeholder="请设置准载户数"></div></div>' +
            '<div class="form-group"><label class="col-lg-4 control-label">户数上限：</label>' +
            '<div class="col-lg-8"><input id="mNo" type="number" min="0" class="form-control" placeholder="请设置户数上限"></div></div>' +
            '<div class="form-group"><label class="col-lg-4 control-label">准载件数：</label>' +
            '<div class="col-lg-8"><input id="alNum" type="number" min="0" class="form-control" placeholder="请设置准载件数"></div></div>' +
            '<div class="form-group"><label class="col-lg-4 control-label">件数上限：</label>' +
            '<div class="col-lg-8"><input id="mNum" type="number" min="0" class="form-control" placeholder="请设置件数上限"></div></div>' +
            '</div>',
            okText: '确认添加',
            cancel: true,
            okCallback: () => {
                $('#capacityFrom').find('.form-group').removeClass('has-error');

                // 获取用户输入的数据
                let capacityName = $('#caName').val(),
                    billNo = $('#alNo').val(),
                    billMax = $('#mNo').val(),
                    packNo = $('#alNum').val(),
                    packMax = $('#mNum').val();

                if(capacityName == '') {
                    $('#caName').focus().parent().parent().addClass('has-error');
                }
                if(billNo == '' || billNo < 0) {
                    $('#alNo').focus().parent().parent().addClass('has-error');
                }
                if(billMax == '' || billMax < 0) {
                    $('#mNo').focus().parent().parent().addClass('has-error');
                }
                if(packNo == '' || packNo < 0) {
                    $('#alNum').focus().parent().parent().addClass('has-error');
                }
                if(packMax == '' || packMax < 0) {
                    $('#mNum').focus().parent().parent().addClass('has-error');
                }
                if(capacityName != '' && billMax != '' && billMax != '' && packNo != '' && packMax != '') {
                    // 如果全部数据都不为空，则关闭弹窗
                    addNew.destroy();
                }

                //发起请求
                H.server.add_capacity({
                    name: capacityName,
                    bill_no: billNo,
                    bill_max: billMax,
                    pack_no: packNo,
                    pack_max: packMax
                }, (res) => {
                    if(res.code == 0){
                        H.Modal('添加成功！');
                        this.getData();
                    }else if(res.code == 10106) {
                        H.overdue();
                    }else{
                        H.Modal(res.message);
                    }
                });
            },
            cancelCallback: () => {
                addNew.destroy();
            }
        });
    }

    render() {
        return(
            <div className="section-warp">
                <div className="section-table">
                    <div className="section-filter">
                        <form className="form-inline">
                            <div className="filter-row">
                                <a href="javascript:;" className="col-lg-6" onClick={this.getData.bind(this)}>刷新</a>
                                <a href="javascript:;" onClick={this.addCapacity.bind(this)} className="btn btn-lg btn-default pull-right col-lg-6">添加新运力</a>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-12" style={{marginTop:'30px'}}>
                        {this.createTable()}
                    </div>
                </div>
            </div>
        );
    }
}

export default CapacityInfo;