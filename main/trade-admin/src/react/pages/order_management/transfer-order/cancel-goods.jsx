/*
* 取消商品;
* */

import React from 'react';

class CancelGoods extends React.Component {
    constructor(props) {
        super(props);
        this.createGoodsList = this.createGoodsList.bind(this);
    }

    allSel(e) {
        if($(e.target).is(':checked')) {
            $('.goods-sel').prop('checked', 'true');
        }else {
            $('.goods-sel').removeAttr('checked');
        }
    }

    goodsSel(e) {
        if($(e.target).is(':checked')) {
            if($('.goods-sel:checked').length == $('.goods-sel').length) {
                $('#goods_sel_all').prop('checked', 'true');
            }
        }else {
            $('#goods_sel_all').removeAttr('checked');
        }
    }

    createGoodsList() {
        let data = this.props.data.goods_infos,
            xmlArr = [];
        for(let i in data) {
            if(data[i].goods_id != 0) {
                xmlArr.push(
                    <tr key={i} style={{borderBottom: '1px solid #d0d0d0'}}>
                        <td>{data[i].goods_name}</td><td>{data[i].buy_num}{data[i].goods_unit}</td>
                        <td style={{width: '55px'}}>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" className="goods-sel" data-goods-id={data[i].order_goods_id} style={{position: 'absolute', marginLeft: '-20px'}}
                                           onChange={this.goodsSel.bind(this)} />
                                </label>
                            </div>
                        </td>
                    </tr>
                );
            }
        }
        return xmlArr;
    }

    render() {
        return (
            <div>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr style={{borderBottom: '1px solid #d0d0d0'}}><td colSpan="2">当前买家：{this.props.data.shop_name}</td><td style={{width: '55px'}}>
                        <div className="checkbox">
                            <label>
                                <input id="goods_sel_all" type="checkbox" style={{position: 'absolute', marginLeft: '-20px'}} onChange={this.allSel.bind(this)} />全选
                            </label>
                        </div>
                    </td></tr>
                    {this.createGoodsList()}

                    </tbody>
                </table>
                <div style={{marginTop: '20px'}}>
                    <span style={{float: 'left', marginTop: '7px', marginRight: '15px'}}>取消备注：</span>
                    <input type="text" id="cancel-note" className="form-control" style={{borderRadius: 0, width: '355px'}} />
                </div>
            </div>
        );
    }
}

export default CancelGoods;