/*
* 评价*/

import Star from '../star/star.jsx';

class Evaluation extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.scrollRefresh && this.props.scrollRefresh();
    }

    render() {
        let data = this.props.data;
        return (
            <div className="evaluation">
                <div className="header">
                    <p>商品评价：{data.evaluate_times}次</p>
                    <p>好评度：{Math.round(data.praise_degree*100)+'%'}</p>
                    {
                        data.evaluate_times == 0 ? <p style={{textAlign: 'center'}}>商品上线不久，评价内容暂不显示</p> : ''
                    }
                </div>
                <ul className="evaluation-list">
                    {
                        data.evaluate_details.map((data, index) => {
                            let img = data.buyers_fotocall ? data.buyers_fotocall + '64' : H.localhost + 'Public/images/buyer-cli/default-header.png';
                            return (
                                <li key={index} className="flex-box">
                                    <div><img className="head-img" src={img}/></div>
                                    <div className="flex-num1 right">
                                        <div className="flex-box center">
                                            <div className="flex-num1 shop-name">{data.buyers_name}</div>
                                            <Star score={data.evaluate_grade}/>
                                        </div>
                                        <p className="comments">{data.evaluate_content}</p>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}

export default Evaluation;