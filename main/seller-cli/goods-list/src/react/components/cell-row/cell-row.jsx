/*
* cell
* 参数说明：
* options: {
* style: ''        顶层的class类名;可选
* icon: ''         前面的图标如果是图片就有值;可选
* label: ''        中间部分的文字信息;可选
* foot: ''         foot部分的内容;可选
* more：'more'     是否有向右的箭头表示更多;可选
* para: para       标识;可选
* }
* */

class CellRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = this.props.options;
        return (
            <div className={this.props.style ? this.props.style + 'cell-row cell-row-item': 'cell-row cell-row-item'} data-para={props.para}>
                <div className="cell-head">
                    <i className={props.icon ? 'icon-font ' + props.icon : ''}>
                    </i>
                    {props.label}
                </div>

                <div className="cell-body">
                    {this.props.children}
                </div>

                <div className={props.more ? 'cell-foot more': 'cell-foot'}>
                    {props.foot}
                </div>
            </div>
        );
    }
}

export default CellRow;