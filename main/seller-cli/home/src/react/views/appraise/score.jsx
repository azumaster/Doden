
class Score extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (<section id="score" className="apprise-score">
            <table className="score-table">
                <tr><th>评价</th><th>买家</th><th>卖家</th><th>交易所得</th></tr>
                <tr><td>好评</td><td rowSpan="3">+1分</td><td>+5分</td><td>交易金额/100</td></tr>
                <tr><td>中评</td><td>+1分</td><td>交易金额/50</td></tr>
                <tr><td>差评</td><td>-5分</td><td>-</td></tr>
                <tr><td>有图</td><td>+2分</td><td>-</td><td>-</td></tr>
                <tr><td>评论15字</td><td>钻石奖励</td><td>-</td><td>-</td></tr>
            </table>
        </section>);
    }
}

export default Score;

