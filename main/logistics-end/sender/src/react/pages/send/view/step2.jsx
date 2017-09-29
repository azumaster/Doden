/*
* 第二步骤
* */
import ChangeNum from '../../../../components/change-num/change-num.jsx';
class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list
        };
        this.createAddressList = this.createAddressList.bind(this);
    }

    createAddressList() {
        let list = this.state.list,
            xml = [];
        xml.push(
            list.map((val, index) => {
                return (
                    <li className="car-wrap">
                        <div className="car-bd">
                            <div className="green"><label>联系人</label>{val.mobile}（{val.name}）</div>
                            <div className="red"><label>提货码</label>{H.getExtractCode(val.code)}</div>
                        </div>
                        <div className="car-ft">
                            <div className="num">件数</div>
                            <ChangeNum valChange={this.changeNum.bind(this)} index={index} />
                        </div>
                    </li>
                );
            })
        );

        return (<ul className="send-list">{xml}</ul>);

    }

    changeNum(val, index) {
        let list = this.state.list;
        list[index].num = val;
        this.setState({list: list});
    }

    submit() {
        this.props.setStep(this.state.list);
    }

    render() {
        return (
            <div>
                <div className="step-bar flex-box">
                    <div className="instruct flex-num1">第二步：请确认货品数量</div>
                    <a className="step-btn" onClick={this.submit.bind(this)}>提交</a>
                </div>
                {this.createAddressList()}
                <div className="time-instruct">收揽时间：上午7点-11点（11点后不收货）</div>
            </div>
        );
    }
}

export default Step2;