/**
 * 全部运单
 * @author: 胡小宇
 * @date: 2017.02.17
 */
import Card from '../common/card.jsx';
class All extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 2]
        };
        this.createList = this.createList.bind(this);
    }

    createList() {
        let data = this.state.data;
        return data.map(() => {
            return (<Card />);
        });
    }

    render() {
        return (
            <ul className="send-list">
                {this.createList()}
            </ul>
        );
    }
}

export default All;