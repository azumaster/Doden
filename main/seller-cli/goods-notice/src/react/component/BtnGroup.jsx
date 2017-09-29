/**
 *按钮组
 * status: [{}]         //状态装换
 * operate: []        //操作方法名
 * buttonStyle: []    //按钮样式
 * index: int         //数据标号
 * style: ''          //按钮组的样式
 * clickCallback: fn  //单击回调
 */
class BtnGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        status: []
    };

    //创建按钮
    createButtons(){
        let props = this.props,
            buttonStyle = props.buttonStyle,
            status = props.status,
            operate = props.operate;
        let buttons = [];
        this.props.btnNames.map((name, index)=>{
            let statusTemp = status[index];
            buttons.push(<a key={index} className={statusTemp ? statusTemp['style'] : buttonStyle[index]}
                               href="javascript:;" data-operate={operate[index]} >
                            {statusTemp ? statusTemp['name']:  name}
                        </a>);
        });
        return buttons;
    }

    render(){
        let props = this.props;
        return(
            <div className={props.style}
                 onClick={props.clickCallback || null}>
                {this.createButtons()}
            </div>
        );
    }
}
export default BtnGroup;