/**
 * 全部运单
 * @author: 胡小宇
 * @date: 2017.02.17
 */

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="card-wrap">
                <div className="card-hd">
                    <div className="title">
                        发件人：食品房子
                    </div>
                    <span className="load-status has">未装车</span>
                </div>
                <div className="card-bd">
                    <div className="green-icon">
                        <label>运单号</label>201702065585
                    </div>
                    <div className="red-icon">
                        <label>提货人</label>张哥（0102033）
                    </div>
                    <div className="orange-icon">
                        <label>预约数量</label>3件
                        <div className="operate btn-style-hollow" data-status="1">去处理</div>
                    </div>

                </div>
            </li>
        );
    }
}

export default Card;