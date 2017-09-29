/*
 * 底部Tab切换
 * tabNames: [],     //切换Tab的名字组
 * tabStatus: [],     //Tab绑定的状态
 * touchCallback: fn //点击Tab时的回调
 * style: ''         //Tab的样式
 * status: 0         //当前选择的Tab
 * activeStyle: string  //选择Tab的样式;
 * */

class TabNav extends React.Component{
    constructor(props){
        super(props);
    }

    //创建按钮
    createTabItem(){
        let tabStatus = this.props.tabStatus,
            style = this.props.style,
            status = this.props.status,
            activeStyle = this.props.activeStyle,
            operate = this.props.operate;
        let items = [];
        this.props.tabNames.map((name, index)=>{
            items.push(<a data-operate={operate?operate[index]:null} className={status != tabStatus[index]? style : activeStyle}
                            key={index} data-index={tabStatus[index]} href="javascript:;" >{name}</a>);
        });
        return items;
    }

    render(){
        return(
            <div id="tabNav" onTouchEnd={this.props.touchCallback || null} className="tab-nav" data-index={this.props.index}>
                {this.createTabItem()}
            </div>
        );
    }
}
export default TabNav;
