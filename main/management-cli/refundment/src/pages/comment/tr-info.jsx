import React from 'react';

const TrInfo = React.createClass({

    getInitialState() {
        return {
            data: {}  
        };
    },

    propTypes: {
        parentFresh: React.PropTypes.func
    },

    submitViolation() {
        let params = {},
            isNumber = /^[0-9]*$/,
            sub_order_no = $('#sub_order_no');

        if (!sub_order_no.val()) {
            H.Modal({
                content: '请输入订单ID',
                okCallback() {
                    sub_order_no.focus();
                }
            });
            return false;
        }

        if ( isNumber.test(sub_order_no.val()) ) {
            params.sub_order_id = sub_order_no.val();
        } else {
            params.sub_order_no = sub_order_no.val();
        }

        H.server.order_goods_info(params, (res)=> {
            if (res.code === 0) {
                $('#sub_order_no').val('').focus();
                this.setState({
                    data: res.data
                });
            } else {
                H.Modal(res.message);
            }
        });
    },

    // 选择退款商品
    showGoodsList(list = [], sub_order_no = '') {
        let _this = this;
        let M = (() => {
            let order_goods_ids = '';

            return {
                init(data = []) {
                    let _this = this,
                        datas = data.map((el) => {
                        el.selected = false;
                        return el;
                    });
                    this.createDom();
                    this.getViolationTypes();
                    this.render(datas);

                    $('.goods-list')
                        .on('click', '#checkAll', function() {
                            let ids = [],
                                isChecked = $(this).prop('checked');
                            datas = datas.map((el) => {
                                el.selected = isChecked;
                                if (el.selected) {
                                    ids.push(el.order_goods_id);
                                }
                                return el;
                            });
                            order_goods_ids = '[' + ids.join(',') + ']';

                            _this.render(datas);
                        })
                        .on('click', '.list-item-checkbox', function() {
                            let oid = $(this).data('oid'),
                                ids = [],
                                isChecked = $(this).prop('checked');
                            datas = datas.map((el) => {
                                if (el.order_goods_id === oid) {
                                    el.selected = isChecked;
                                }
                                if (el.selected) {
                                    ids.push(el.order_goods_id);
                                } else {
                                    $('#checkAll').prop('checked', false);
                                }
                                return el;
                            });
                            order_goods_ids = '[' + ids.join(',') + ']';
                        });
                },
                render(datas) {
                    let status = ['', '未审核', '已审核', '已下架', '已删除'];
                    let listItemsDom = datas.map((el) => {
                            return ('<div class="list-item"><label><span>' + el.goods_name + '(' + status[el.status] + ')' + '</span><span>' + el.buy_number + el.goods_unit + '</span><input class="list-item-checkbox" data-oid="'+ el.order_goods_id +'" type="checkbox" ' + (el.selected ? 'checked' : '') + '></label></div>');
                        }).join('');
                    $('.goods-list .list-w').html(listItemsDom);
                },
                createDom() {
                    let listDom, otherDom;
                    listDom = '<div class="goods-list">' +
                            '<div class="check-all"><label for="checkAll"><input type="checkbox" id="checkAll">全选</div></label>' +
                            '<div class="list-w"></div>' +
                        '</div>';

                    otherDom = '<div class="remark-w">' +
                            '<span>退款备注：</span>' +
                            '<input type="text" id="remark">' +
                        '</div>' +
                        '<div class="remark-w">' +
                        '<span>卖家处罚</span>' +
                        '<div id="selViolation" style="display: inline-block;"></div>'+
                        '</div>'+
                        '<div class="send-buyer-w">' +
                            '<span>通知卖家：</span>' +
                            '<label><input type="radio" checked name="sendBuyer" id="yes">是</label>' + '&nbsp;&nbsp;&nbsp;' +
                            '<label><input type="radio" name="sendBuyer" id="no">否</label>' +
                        '</div>' +
                        '<div class="error-mes"></div>';
                    $('.dialog-content').html(listDom + otherDom);
                    //return listDom + otherDom;
                },

                getOrderGoodsId() {
                    return order_goods_ids;
                },

                getViolationTypes() {
                    H.server.admin_shop_seller_violation_types({}, (res) => {
                        if(res.code == 0) {
                            let xml = '<select id="violationType"><option value="0">不处罚</option>';
                            for(let i = 0 ; i < res.data.length ; i++) {
                                xml += '<option value="'+res.data[i].type+'">'+res.data[i].title+'</option>';
                            }
                            xml += '</select>';
                            $('#selViolation').html(xml);
                        }else {
                            H.Modal(res.message);
                        }
                    });
                },

                off() {
                    $('.goods-list' ).find(':checkbox').off('click');
                }
            };
        })();

        H.Modal({
            title: '请选择要退的商品',
            content: '加载中',
            closeBtn: true,
            width: 400,
            height: 350,
            autoClose: false,
            okText: '提交',
            okCallback(o) {
                let btn = o.el.siblings('.dialog-btn-group').find('button'),
                    scoreType = $('#violationType').val();

                btn.attr('disabled', true);
                $('.error-mes').text('');

                if (!$('#remark').val()) {
                    // $('.error-mes').text('请输入备注');
                    H.tip('请输入备注');
                    btn.attr('disabled', false);
                    return;
                }

                H.server.order_refund_apply({
                    sub_order_no: sub_order_no,
                    order_goods_ids: M.getOrderGoodsId(),
                    remark: $('#remark').val(),
                    send_message_buyers: $('#yes').prop('checked') ? 1 : 0,
                    score_type: scoreType
                }, (res) => {
                    if (res.code === 0) {
                        o.el.html(res.message);
                        setTimeout(() => {
                            o.destroy();
                            M.off();
                        }, 1500);
                        _this.setState({
                            data: {}
                        }, () => {
                            _this.props.parentFresh();
                        });
                    } else {
                        $('.error-mes').text(res.message);
                        btn.attr('disabled', false);
                    }
                });
            },
            initFunc() {
                M.init(list);
            }
        });
    },

    render(){
        let status = ['', '未审核', '已审核', '已下架', '已删除'],
            order_infos = this.state.data.order_infos,
            goods_infos = this.state.data.goods_infos,
            tr = (<tr></tr>);

        if ( order_infos ) {
            tr = (
                <tr>
                    <td>{order_infos.buyers_shop_name || ''}</td>
                    <td>{order_infos.order_amount || ''}</td>
                    <td>{order_infos.payment_amount || ''}</td>
                    <td>{order_infos.sell_shop_name || ''}</td>
                    <td>{order_infos.create_time || ''}</td>
                    <td>{status[this.state.data.order_status || 0]}</td>
                    <td><button type="button" className="btn btn-default" onClick={this.showGoodsList.bind(this, goods_infos, order_infos.sub_order_no)}>申请退款</button></td>
                </tr>
            );
        }

        return (
            <div className="info-w">
                <h3 className="info-title">
                    添加退款
                </h3>
                <div className="info-main-w">
                    <div className="submit_violation-w">
                        <div className="form-c">
                            <div className='input-w'>
                                <label>订单ID：</label>
                                <input type="text" id="sub_order_no" placeholder="请输入订单ID" />
                            </div>
                            <button className='btn btn-default btn-submit' onClick={this.submitViolation}>提交</button>
                        </div>
                    </div>
                    <div className="table-w">
                        <table className="table table-bordered table-hover table-responsive tr-table">
                            <thead>
                                <tr>
                                    <th>买家</th>
                                    <th>订单金额</th>
                                    <th>实付金额</th>
                                    <th>卖家</th>
                                    <th>下单时间</th>
                                    <th>发货状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tr}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

export default TrInfo;