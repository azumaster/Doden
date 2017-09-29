/*
* 没有商品的模板;
* */
import CellRow from '../../components/cell-row/cell-row.jsx';

class EmptyTemp extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.SCROLL.refresh();
    }

    render() {
        return (
            <div className="empty-wrap">
                <a className="empty-add-goods" href="index.php?m=PublicTemplate&c=ApiPublic&a=addGoodsPage">
                    <i className="empty-add-icon"></i>
                    <p>添加商品</p>
                </a>
                <div className='reading-cell'>
                    <p className="instruct">不会用？看看这个</p>
                    <CellRow options={{style: 'reading-cell', label: '阅读：规范使用书'}} />
                    <CellRow options={{style: 'reading-cell', label: '阅读：价格更新制度'}} />
                    <CellRow options={{style: 'reading-cell', label: '阅读：发货退款制度'}} />
                </div>
            </div>
        );
    }
}

export default EmptyTemp;