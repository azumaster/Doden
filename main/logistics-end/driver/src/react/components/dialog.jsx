/**
 * 模态框
 * @props width: 80%            // dialog的宽度（用百分比表示）
 * @props height: 50%           // dialog的高度（用百分比表示）
 */

class Dialog extends React.Component {
    constructor(props){
        super(props);
        this.createFooter = this.createFooter.bind(this);
    }

    cancel() {
        this.props.cancelCallback && this.props.cancelCallback();
    }

    createFooter() {
        let confirm = '',
            cancel = '';
        if(this.props.confirm) {
            confirm = (<a href="javascript:;" className="dialog-btn active" onTouchEnd={this.props.confirmCallback}>{this.props.confirm}</a>);
        }
        if(this.props.cancel) {
            cancel = (<a href="javascript:;" className="dialog-btn" onClick={this.cancel.bind(this)}>{this.props.cancel}</a>);
        }

        return(
            <div className="dialog-footer">
                {cancel}
                {confirm}
            </div>
        );
    }

    render() {

        return(

            <div id="dialog" className="mask">
                <div className="dialog" style={{width: this.props.width?this.props.width:'80%'}}>
                    <div className="dialog-title">{this.props.title}</div>
                    {this.props.content}
                    {this.createFooter()}
                </div>
            </div>
        );
    }
}

export default Dialog;