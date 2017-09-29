/*
* 第二步骤
* */
import ChangeNum from '../../../../../components/change-num/change-num.jsx';
class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.createAddressList = this.createAddressList.bind(this);
    }

    createAddressList() {
        let list = this.props.chooseData,
            xml = [];
        console.log(list);
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
        let list = this.props.chooseData;
        list[index].num = val;
        this.props.chooseData = list;
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                {this.createAddressList()}
                <div className="time-instruct">收揽时间：上午7点-11点（11点后不收货）</div>
            </div>
        );
    }
}

export default Step2;