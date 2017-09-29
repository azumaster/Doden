import React from "react";

class Star extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeArr: ['','','','',''],
            text: '无'
        }
    }

    handler = (n) => {
        if(this.props.val > 0) return;
        let arr = ['','','','',''],
            textArr = this.props.arr;
        for(let i = 0 ; i < n ; i++){
            arr[i] = 'active';
            this.state.text = textArr[i];
        }
        this.setState({activeArr: arr});
        this.props.starEv && this.props.starEv(n, this.props.goodsId);
    };

    componentDidMount = () => {
        let arr = ['','','','',''],
            textArr = this.props.arr;
        for(let i = 0 ; i < this.props.val ; i++){
            arr[i] = 'active';
            this.state.text = textArr[i];
        }
        this.setState({activeArr: arr});
    };

    render = () => {
        let sizeClass = 'star-cell ';
        if(this.props.size == 2) {
            sizeClass += 'start-cell-big';
        }


        return (
            <div className={sizeClass}>
                <i className={this.state.activeArr[0]} onClick={this.handler.bind(this, 1)}></i>
                <i className={this.state.activeArr[1]} onClick={this.handler.bind(this, 2)}></i>
                <i className={this.state.activeArr[2]} onClick={this.handler.bind(this, 3)}></i>
                <i className={this.state.activeArr[3]} onClick={this.handler.bind(this, 4)}></i>
                <i className={this.state.activeArr[4]} onClick={this.handler.bind(this, 5)}></i>
                <span className="level-text">{this.state.text}</span>
            </div>
        )
    }
}

export default Star;