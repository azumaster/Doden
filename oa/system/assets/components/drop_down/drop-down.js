/**
 * Created by Administrator on 2016/2/1.
 * 下拉选择
 */
/*选择下拉框,select标签;*/
class DropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optionArr: [],
            val: 0
        };

        this.selChange = this.selChange.bind(this);
    }

    selChange() {
        if (this.props.changeEv) {
            this.props.changeEv(this.refs.selectNode.value);
        }

        this.setState({val: this.refs.selectNode.value});
    }

    componentWillMount() {
        this.setState({optionArr: this.props.dropdownData});
        this.setState({val: this.props.selectVal});
    }

    render() {
        var DomXml = '',
            dataArr = this.state.optionArr;
        var checkData = "";
        if (this.props.checkData) {
            checkData = this.props.checkData;
        }
        DomXml = dataArr.map((name, index) => {
            var optionVal = "";
            if (checkData[index]) {
                optionVal = checkData[index];
            } else {
                optionVal = index;
            }
            return <option value={optionVal} key={index}>{name}</option>;
        });
        return (
            <select value={this.state.val} className="form-control" onChange={this.selChange} ref="selectNode">
                {DomXml}
            </select>
        );
    }
}

export default DropDown;