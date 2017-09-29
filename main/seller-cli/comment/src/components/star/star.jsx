import React from "react";

class Star extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeArr: ['','','','','']
        }
    }

    handler = (n) => {
        if(this.props.operate > 0) return;
        let arr = ['','','','',''];
        for(let i = 0 ; i < n ; i++){
            arr[i] = 'active';
        }
        this.setState({activeArr: arr});
        this.props.starEv && this.props.starEv(n, this.props.goodsId);
    };

    componentDidMount = () => {
        let arr = ['','','','',''];
        for(let i = 0 ; i < this.props.operate ; i++){
            arr[i] = 'active';
        }
        this.setState({activeArr: arr});
    };

    render = () => {
        let sizeClass = 'flex-num1 star-cell ';
        if(this.props.size == 2) {
            sizeClass += 'start-cell-big';
        }
        return (
            <div className={sizeClass}>
                <i className={this.state.activeArr[0]} onClick={this.handler.bind(this, 1)}>&#xe605;</i>
                <i className={this.state.activeArr[1]} onClick={this.handler.bind(this, 2)}>&#xe605;</i>
                <i className={this.state.activeArr[2]} onClick={this.handler.bind(this, 3)}>&#xe605;</i>
                <i className={this.state.activeArr[3]} onClick={this.handler.bind(this, 4)}>&#xe605;</i>
                <i className={this.state.activeArr[4]} onClick={this.handler.bind(this, 5)}>&#xe605;</i>
            </div>
        )
    }
}

export default Star;