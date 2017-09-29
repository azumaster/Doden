//import React from 'react';

class ActionSheet extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showState: 0
        };
    }

    componentWillMount() {
        this.setState({showState: this.props.sheetState});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showState: nextProps.sheetState});
    }

    cancel() {   //关闭;

    }

    render() {
        return (
            <div className="actionSheet_wrap">
                <div className={this.showState == 1 ? 'mask_transition fade_toggle' : 'mask_transition'}></div>
                <div className={this.showState == 1 ? 'actionsheet actionsheet_toggle' : 'actionsheet'}>
                    <div className="actionsheet_menu">
                        <div className="actionsheet_cell read-only">{this.props.title}</div>
                        <div className="actionsheet_cell read-only">
                            {this.props.children}
                        </div>
                    </div>
                    <div className="actionsheet_action">
                        <div className="actionsheet_cell" onTouchStart={this.cancel}>关闭</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActionSheet;