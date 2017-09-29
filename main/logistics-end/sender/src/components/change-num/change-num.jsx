/*
* 改变数量：一个减号，一个加号，一个输入框
* 接收props：
* val: 默认数量;
* valChange: 设置父级的数量;
* max: 输入框支持最大值;
* min: 输入框支持最小值;
* index: 当这个组件在列表中时，index用来区分哪个;
* */

class ChangeNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: this.props.val || 1,
            max: this.props.max || 99999,
            min: this.props.min || 1
        };
    }

    reduce() {
        let val = parseInt(this.state.val);
        if(val > this.state.min) {
            val--;
            this.state.val = val;
        }
        this.props.valChange && this.props.valChange(val, this.props.index);
    }

    increase() {
        let val = parseInt(this.state.val);
        if(val <= this.state.max) {
            val++;
            this.state.val = val;
        }
        this.props.valChange && this.props.valChange(val, this.props.index);
    }

    numChange(e) {
        let val = e.target.value;
        this.state.val = val;
        this.props.valChange && this.props.valChange(val, this.props.index);
    }

    render() {
        return (
            <div>
                <div className="change-num">
                    <a className="reduce" onClick={this.reduce.bind(this)}></a>
                    <input type="text" value={this.state.val} className="num-input" onChange={this.numChange.bind(this)} />
                    <a className="increase" onClick={this.increase.bind(this)}></a>
                </div>
            </div>
        );
    }
}

export default ChangeNum;