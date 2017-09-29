import IconButton from '../icon-button/icon_button.jsx';
/*
 * 图标按钮组
 * clickCallback: fn  单击后的回调
 * style: ''   容器的class名
 * btnNames:  []  按钮名字
 * operate: []  给按钮绑定的操作
 * para: []     给按钮绑定的参数
 * num: []  数量
 * */
/*
 <IconButton key={index}  style={btnStyle[index]} btnName={btnName}
                num={num?num[index]:null} operate={operate?operate[index]:null} para={para?para[index]:null}  />
 */

class IconBtnGroup extends React.Component {
    constructor(props) {
        super(props);
        this.slider = this.slider.bind(this);
    }

    static defaultProps = {
        para: [0, 1, 2, 3, 4, 5, 6]
    };

    componentWillMount() {

    }

    componentDidMount() {
        if(this.props.slider) {
            this.refs.slider.style.width = (100/this.props.btnNames.length) + '%';
            this.refs.slider.style.webkitTransform = 'translate3d('+ this.props.active*100 +'%, 0, 0)';
        }
    }

    //创建按钮
    createButton() {
        let btnNames = this.props.btnNames,
            operate = this.props.operate,
            para = this.props.para,
            num = this.props.num,
            buttons = new Array(btnNames.length),
            iconStyle = this.props.iconStyle;
        btnNames.map((btnName, index) => {
            let active = false;
            if(index == this.props.active) {
                active = true;
            }
            buttons[index] = (<IconButton key={index} btnName={btnName} active={active} iconStyle={iconStyle?iconStyle[index]:null} index={index}
                                         num={num?num[index]:null} operate={operate?operate:null} para={para?para[index]:null} />);
        });
        return buttons;
    }

    slider(e){
        let parent = $(e.target).parents('.cell-column'),
            index = parent.data('para');
        parent.siblings().removeClass('active');
        parent.addClass('active');
        if(this.props.slider) {
            let offset = index * 100 + '%';
            this.refs.slider.style.webkitTransform = 'translate3d('+ offset +', 0, 0)';
        }
        return index;
    }

    //处理点击事件;
    handleClick(e){
        let index = this.slider(e);
        this.props.clickCallback && this.props.clickCallback(index, e);
    }

    render() {
        let slider = [];
        if(this.props.slider) {
            slider.push(
                <div ref="slider" className={this.props.slider} >
                    <div className="slider-line">{null}</div>
                </div>
            );
        }
        return (
            <div className={this.props.style ? 'cells-row ' + this.props.style : 'cells-row'} onClick={this.handleClick.bind(this)}>
                {this.createButton()}
                {slider}
            </div>
        );
    }
}
export default IconBtnGroup;