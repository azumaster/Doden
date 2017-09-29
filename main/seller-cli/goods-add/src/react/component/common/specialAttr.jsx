/*
 * xy 2017-09-13
 * 特殊属性
 * */
import Attr from './Attr.jsx';
class SpecialAttr extends React.Component {
    constructor(props) {
        super(props);
    }

    //设置特殊属性的值;
    setParamSpecial(data) {
        let val = data,
            param = this.props.param,
            length = 0;
        for(let i = 0 ; i < param.special_attributes.length ; i++) {
            if(param.special_attributes[i].constraint_id == val.constraint_id) {
                param.special_attributes[i] = val;
                length = 1;
            }
        }
        if(!length) {
            param.special_attributes.push(val);
        }
        this.props.setParam && this.props.setParam(param);
    }

    render() {
        return (
            <div>
                <div className="plate-title">*特殊介绍</div>
                <div className="add-goods-item special-attr-wrap">
                    {
                        this.props.data.map((data) => {
                            let param = this.props.param,
                                val = {};
                            for(let i = 0 ; i < param.special_attributes.length ; i++) {
                                if(param.special_attributes[i].constraint_id == data.attribute_id) {
                                    val = param.special_attributes[i];
                                }
                            }
                            return (
                                <Attr val={val} data={data} setData={this.setParamSpecial.bind(this)} />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default SpecialAttr;