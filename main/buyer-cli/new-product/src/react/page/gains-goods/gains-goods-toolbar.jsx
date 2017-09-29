//import React from 'react';

class GainsGoodsTop extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header className="gains-goods-toolbar flex-box">
                <div className={this.props.dataStatus == 3 ? 'flex-num1 all active' : 'flex-num1 all'} onClick={this.props.setDataStatus.bind(this, 3)}>全部</div>
                <div className={this.props.dataStatus == 2 ? 'flex-num1 rose active' : 'flex-num1 rose'} onClick={this.props.setDataStatus.bind(this, 2)}>涨价</div>
                <div className={this.props.dataStatus == 1 ? 'flex-num1 drop active' : 'flex-num1 drop'} onClick={this.props.setDataStatus.bind(this, 1)}>降价</div>
            </header>
        );
    }
}

export default GainsGoodsTop;