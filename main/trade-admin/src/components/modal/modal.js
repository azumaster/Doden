import React from "react";

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: true
        };
        this.confirmHandler = this.confirmHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
    }

    //确认按钮的回调事件;
    confirmHandler() {
        this.props.confirmCallback && this.props.confirmCallback();
    }

    //关闭按钮的回调事件;
    closeHandler() {
        this.props.closeCallback && this.props.closeCallback();
    }

    render() {

        /*
        * width：宽-默认350px,
        * header：标题 默认弹窗,
        * confirm: 确认按钮文字（必须有）,
        * cancel： 取消按钮文字（必须有）,
        * confirmCallback: 确认按钮事件,
        * confirmDisabled: 确认按钮不可用样式,
        * cancelCallback: 取消按钮事件,
        * cancelDisabled: 取消按钮不可用样式,
        * 弹窗内容：this.props.children
        * */

        let confirmBtn = '',
            cancelBtn = '';
        if(this.props.confirm) {
            if(this.props.confirmDisabled) {
                confirmBtn = (<button className="modal-btn active disabled" onClick={this.confirmHandler}>{this.props.confirm}</button>);
            }else {
                confirmBtn = (<button className="modal-btn active" onClick={this.confirmHandler}>{this.props.confirm}</button>);
            }
        }
        if(this.props.cancel) {
            if(this.props.cancelDisabled) {
                cancelBtn = (<button className="modal-btn disabled" onClick={this.props.cancelCallback || this.closeHandler}>{this.props.cancel}</button>);
            }else {
                cancelBtn = (<button className="modal-btn" onClick={this.props.cancelCallback || this.closeHandler}>{this.props.cancel}</button>);
            }
        }
        return (
            <div className={this.state.status ? 'modal-wrap show' : 'modal-wrap'} >
                <div className="modal-mask"></div>
                <div className="modal-container" style={{width: this.props.width ? this.props.width : '350px'}}>
                    <div className="modal-head">
                        <i className="glyphicon glyphicon-remove" onClick={this.closeHandler}></i>
                        {this.props.header ? this.props.header : '弹窗'}
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                    <div className="modal-foot">
                        {confirmBtn}
                        {cancelBtn}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;