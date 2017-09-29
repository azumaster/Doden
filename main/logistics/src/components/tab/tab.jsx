/**
 * 未装车运单
 * @author: 胡小宇
 * @date: 2017.02.17
 *
 * 说明:该组件常用于顶部的tab切换;
 * 参数：
 *  arr: []       传进来的文字数组，该数组长度是几这个tab切换就有几个;
 *  num: {1: 99}  如果有数字的需要显示数字，没有为null;
 *  default: num  初始进入时默认在第几个状态;
 *  slider: bool  是否显示滑块，为true表示显示滑块;
 *  tabHandler: fn   于父组件传递的方法;
 *  style: ''     需要另外设置样式的class名;
 */

class tab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default: this.props.default || 0,
            slider: this.props.slider
        };
    }

    handler(e) {
        let index = e.target.dataset.index;
        if(this.state.default != index) {
            this.setState({default: index});
            this.props.handler && this.props.tabHandler(index);
        }
    }

    render() {
        return (
            <div className={'tab ' + this.props.style} onTouchStart={this.handler.bind(this)}>
                {
                    this.props.arr.map((val, index) => {
                        return (
                            <div className={'cell ' + (this.state.default == index ? 'active' : '')} data-index={index}>{val}</div>
                        );
                    })
                }
                <div className="slider" style={{width: 1/this.props.arr.length*100+'%', transform: 'translate3d('+this.state.default*100+'%, 0, 0)'}}>
                    <div className="item"></div></div>
            </div>
        );
    }
}

export default tab;