/*
* 备货和填成本价;
* */

import React from 'react';

class GoodsPrepare extends React.Component {
    constructor(props) {
        super(props);
        this.createGoodsList = this.createGoodsList.bind(this);
    }

    createGoodsList() {
        let data = this.props.data.goods_infos,
            xmlArr = [];
        for(let i in data) {
            if(data[i].goods_id != 0) {
                xmlArr.push(
                    <li key={i}>
                        <p>商品：{data[i].goods_name}</p>
                        <p className="form-inline">
                            <span className="form-group">成本价：</span>
                            <span className="form-group prepare-input"><input id={'prepare_' + data[i].order_goods_id} className="form-control" type="text" /></span>
                        </p>
                    </li>
                );
            }
        }
        return xmlArr;
    }

    render() {
        return (
            <div>
                <ul className="prepare-ul">
                    {this.createGoodsList()}
                </ul>
            </div>
        );
    }
}

export default GoodsPrepare;