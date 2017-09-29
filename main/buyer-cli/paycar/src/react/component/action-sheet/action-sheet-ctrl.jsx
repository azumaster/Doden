//import React from 'react';
import ActionSheet from './action-sheet.jsx';

class ActionSheetCtrl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({status: nextProps.status});
    }

    render() {
        return (
            <ActionSheet
                title="收费标准"
                cancel="关闭"
                cancelCallBack=""
                confirm="查看订单"
                confirmCallBack=""
                sheetState={this.props.sheetState}
            >
                <div className="text-center">
                    <p className="text-center">如果微信已扣费，请联系客服人工处理</p>
                    <p className="text-center">如果未扣费，您可以在订单页重新付款</p>
                </div>
            </ActionSheet>
        );
    }
}

export default ActionSheetCtrl;