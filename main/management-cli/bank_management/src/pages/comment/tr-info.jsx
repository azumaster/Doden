import React from 'react';

const TrInfo = React.createClass({

    propTypes: {
        infoData: React.PropTypes.array,
        infoFlag: React.PropTypes.object,
        violationTypes: React.PropTypes.array
    },

    submitViolation() {
        let _this = this,
            comment = this.props.infoFlag,
            params = {
                appraise_id: comment.appraise_id,
                sell_shop_id: comment.sell_infos.shop_id,
                goods_id: comment.goods_infos.id,
                order_goods_id: comment.order_goods_id,
                sub_order_no: comment.sub_order_no,
                remark : $('#remark').val()
            };

        if (!params.remark) {
            H.Modal({
                content: '请输入备注',
                okCallback() {
                    $('#sub_order_no').focus();
                }
            });
        }

        H.server.order_appraise_admin_add_dispose(params, (res)=> {
            H.Modal({
                content: res.message,
                okCallback() {
                    $('#remark').val('').focus();
                    // 刷新子列表
                    _this.props.parentFresh({}, () => {
                        _this.props.infoFreshHandler(_this.props.infoFlag);
                    });
                }
            });
        });
    },

    render(){
        let shop_name = this.props.infoFlag.buyer_infos ? (this.props.infoFlag.buyer_infos.shop_name || '') : '',
            name = this.props.infoFlag.buyer_infos ? (this.props.infoFlag.buyer_infos.name || '') : '';
        return (
            <div className="info-w">
                <h3 className="info-title">
                    {'ID:' + (this.props.infoFlag.appraise_id || '')}
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    { shop_name + ' (' + name + ')' }
                </h3>
                <div className="info-main-w">
                    <div className="submit_violation-w">
                        <h3>添加备注</h3>
                        <div className="form-c">
                            <div className='input-w'>
                                <textarea name="remark" id="remark" className="form-control" cols="30" rows="5"></textarea>
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
                                    <th>处理备注</th>
                                    <th>处理时间</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.props.infoData.map((el, index)=>{
                                return (
                                    <tr key={'info_' + index}>
                                        <td>{el.dispose_id}</td>
                                        <td>{el.dispose_name}</td>
                                        <td>{el.remark}</td>
                                        <td>{el.create_time}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

export default TrInfo;