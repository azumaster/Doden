import React from "react";

let TrInfo = React.createClass({

    propTypes: {
        infoData: React.PropTypes.array,
        infoFlag: React.PropTypes.object,
        violationTypes: React.PropTypes.array
    },

    submitViolation() {
        let _this = this,
            params = {
                shop_id : this.props.infoFlag.shop_id,
                sub_order_id : $('#sub_order_no').val(),
                type: $('#violation_type').val()
            };

        if (!params.sub_order_id) {
            H.Modal({
                content: '请输入订单号',
                okCallback() {
                    $('#sub_order_no').focus();
                }
            });
        }

        H.server.admin_shop_seller_violation_add(params, (res)=> {
            H.Modal({
                content: res.message,
                okCallback() {
                    $('#sub_order_no').val('').focus();
                    // 刷新子列表
                    _this.props.parentFresh({}, () => {
                        _this.props.infoFreshHandler(_this.props.infoFlag);
                    });
                }
            });
        });
    },

    // 撤回
    cancel(id) {
        let _this = this;
        H.Modal({
            content: '确定撤回？',
            cancel: true,
            autoClose: false,
            okCallback(o) {
                H.server.admin_shop_seller_violation_cancel({
                    id: id
                }, (res) => {
                    if (res.code === 0) {
                        // 刷新
                        console.log(o.el);
                        o.el.html(res.message)
                            .siblings()
                            .find('button')
                            .prop('disabled',true);

                        _this.props.parentFresh({}, () => {
                            _this.props.infoFreshHandler(_this.props.infoFlag);
                        });

                        setTimeout(() => {
                            o.destroy();
                        },1300);
                    }
                });
            },
            cancelCallback(el) {
                el.destroy();
            }
        });
    },

    render(){
        let headArr = ['处理ID','处理人','订单号','处理结果','处理时间','操作'],
            violationTypesArr = [];
            this.props.violationTypes.forEach((el, index) => {
                violationTypesArr[el.type] = el.title;
            });

        return (
            <div className="info-w">
                <h3 className="info-title">
                    {"ID:" + this.props.infoFlag.shop_id}
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    { this.props.infoFlag.shop_name + ' (' + this.props.infoFlag.market_name + ')' }
                </h3>
                <div className="info-main-w">
                    <div className='submit_violation-w'>
                        <h3>添加处理标记</h3>
                        <div className="form-c form-inline">
                            <div className='input-w'>
                                <span>订单号：</span>
                                <input type="text" id="sub_order_no" className="form-control"/>
                            </div>
                            <div className='input-w'>
                                <span>处理选项：</span>
                                <select name='violation_type' id="violation_type" className='form-control'>
                                    {this.props.violationTypes.map((el, index) => {
                                        return (
                                            <option key={'op_' + index} value={el.type}>{el.title + ' (' + el.score + ')'}</option>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                                        );
                                    })}
                                </select>
                            </div>
                            <button className='btn btn-default btn-submit' onClick={this.submitViolation}>提交</button>
                        </div>
                    </div>
                    <div className="table-w">
                        <table className="table table-bordered table-hover table-responsive tr-table">
                            <thead>
                                <tr>
                                    <th>处理ID</th>
                                    <th>处理人</th>
                                    <th>订单ID</th>
                                    <th>订单号</th>
                                    <th>处理结果</th>
                                    <th>处理时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.props.infoData.map((el,index)=>{
                                return (
                                    <tr key={'order_info_' + index}>
                                        <td>{el.id}</td>
                                        <td>{el.operator}</td>
                                        <td>{el.sub_order_id}</td>
                                        <td>{el.sub_order_no}</td>
                                        <td>{violationTypesArr[el.violation_type] + ' (' + el.violation_score + ')'}</td>
                                        <td>{el.opt_time}</td>
                                        <td>{el.is_del ? '已撤回' : <button className="btn btn-default" onClick={this.cancel.bind(this, el.id)}>撤回</button>}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
});

export default TrInfo;