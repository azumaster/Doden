/*
* 评分*/

class Star extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeArr: ['', '', '', '', '']
        };
    }

    componentWillMount() {
        let arr = ['', '', '', '', ''];
        for(let i = 0 ; i < parseInt(this.props.score) ; i++){
            arr[i] = 'active';
        }
        this.setState({activeArr: arr});
    };

    handler(n) {
        if(!this.props.score || this.props.score > 0) return;
        let arr = ['', '', '', '', ''];
        for(let i = 0 ; i < n ; i++){
            arr[i] = 'active';
        }
        this.setState({activeArr: arr});
        this.props.starEv && this.props.starEv(n, this.props.goodsId);
    };

    render() {
        /*
        * score: 当前分数；如果没有或者小于0则表示需要操作。
        * starEv: 打分之后的回调;
        * */

        return (
            <div className="star-wrap">
                <i className={'score-level ' + this.state.activeArr[0]} onClick={this.handler.bind(this, 1)}>
                </i>
                <i className={'score-level ' + this.state.activeArr[1]} onClick={this.handler.bind(this, 2)}>
                </i>
                <i className={'score-level ' + this.state.activeArr[2]} onClick={this.handler.bind(this, 3)}>
                </i>
                <i className={'score-level ' + this.state.activeArr[3]} onClick={this.handler.bind(this, 4)}>
                </i>
                <i className={'score-level ' + this.state.activeArr[4]} onClick={this.handler.bind(this, 5)}>
                </i>
            </div>
        );
    }
}

export default Star;