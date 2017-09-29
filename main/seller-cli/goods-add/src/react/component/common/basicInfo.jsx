/*
* xy 2017-09-12
* 基本属性
* */

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    //更改基本属性的方法;
    setBasicAttr (e) {
        let key = e.target.dataset.para,
            data = this.props.param;
        if(key == 'halal') {
            if(data.basic_infos[key]) {
                data.basic_infos[key] = 0;
            }else {
                data.basic_infos[key] = 1;
            }
        }else {
            data.basic_infos[key] = e.target.value;
        }
        this.props.setParam(data);
    }

    render() {
        let basic_info = this.props.param.basic_infos;
        return (
            <div>
                <div className="plate-title">*商品基础属性</div>
                <div className="add-goods-item" onChange={this.setBasicAttr.bind(this)}>
                    <div className="cell-row input-line">
                        <div className="cell-head">品名</div>
                        <div className="cell-body">
                            <input className="cell-input" data-para="goods_name" placeholder="请输入品名" value={basic_info.goods_name} />
                        </div>
                    </div>
                    <div className="cell-row input-line">
                        <div className="cell-head">品牌</div>
                        <div className="cell-body">
                            <input className="cell-input" data-para="brand_name" placeholder="请输入品牌" value={basic_info.brand_name} />
                        </div>
                    </div>
                    <div className="cell-row input-line">
                        <div className="cell-head">产地</div>
                        <div className="cell-body">
                            <input className="cell-input" data-para="origin" placeholder="请输入产地" value={basic_info.origin} />
                        </div>
                    </div>
                    <div className="cell-row input-line">
                        <div className="cell-head">清真</div>
                        <div className="cell-foot" style={{textAlign: 'right', flex: '1', webkitBoxFlex: '1px', webkitFlex: '1px', mozBoxFlex: '1px'}}
                             data-index="3">
                            <input className="switch" type="checkbox" checked={basic_info.halal} data-para="halal" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BasicInfo;