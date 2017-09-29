/**
 * Created by Doden on 2017.05.22
 */

import React from 'react';

class Cascade extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let options = {
            title: '提示',
            cancelText: '取消',
            okText: '提交',
            body: null,
            cancel: function () {},
            submit: function () {}
        };

        this.options = Object.assign(options, this.props.options);
    }

    componentDidMount(){
        $('#dialogBody').animate({bottom: 0}, 300);
    }

    cancel(){
        this.options.cancel();
        this.close();
    }

    submit(){
        this.options.submit();
        this.close();
    }

    close(){
        $('#dialogBody').animate({bottom: '-290px'}, 300, ()=>{
            this.props.hide && this.props.hide();
        });

    }

    render() {
        return (<div id="dialog" className="dialog-mask">
            <div id="dialogBody" className="dialog-content">
                <div className="dialog-head">{this.options.title}</div>
                <div className="dialog-body">{this.options.body}</div>
                <div className="dialog-btn-group">
                    <div className="btn_dialog dialog_cancel" onClick={this.cancel.bind(this)}>{this.options.cancelText}</div>
                    <div className="btn_dialog dialog_confirm" onClick={this.submit.bind(this)}>{this.options.okText}</div>
                </div>
            </div>
        </div>);
    }
}

export default Cascade;