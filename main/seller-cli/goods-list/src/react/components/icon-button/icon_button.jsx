/*
* 图标按钮
* id : ''    父类的id 区别操作
* margin: '' 上间距
* clickCallback: fn  单击后的回调
* iconStyle: '' 图标样式
* href: ''      超链接
* btnStyle: ''  按钮样式
* btnName:  ''  按钮名字
* */
/*
*clickCallback: 单击回调
*operate: ''     操作
*para: ''        参数
*num: ''      数字
*btnName: ''  按钮名字
* */

class IconButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.active ? 'cell-column active' : 'cell-column'} data-num={this.props.num} data-index={this.props.index}
                 onClick={this.props.clickCallback} data-operate={this.props.operate} data-para={this.props.para}>
                <div className="cell-head" >
                    <i className={this.props.iconStyle}>{this.props.num}</i>
                </div>

                <div className="cell-body" >
                    <a href='javascript:;'>{this.props.btnName}</a>
                </div>
            </div>
        );
    }
}
export default IconButton;