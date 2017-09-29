/*
* 商品搜索列表的排序功能;
* create: xy, time: 2017-03-09
* */

class Sort extends React.Component {
    constructor(props) {
        super(props);
    }

    sortHandler(state) {
        let order = this.props.param.order;
        if(order[0] == state) {   //如果相等，说明排序方式没变
            if(state != 0) {
                order[1] = !order[1];
            }
        }else {
            if(order[0] == 1) {
                order = [state, false];
            }else {
                order = [state, true];
            }
        }
        this.props.setParam('order', order);
    }

    filterHandler() {
        this.props.setFilterShow(true);
    }

    render() {
        let param = this.props.param,
            order = param.order,
            style = null;
        if(param.state == 1) {
            style = {top: 0};
        }
        return (
            <div className="sort-wrap flex justify-space-between border-bottom" style={style}>
                <a className={order[0] == 0 ? 'sort-item sort-default active' : 'sort-item sort-default'} onClick={this.sortHandler.bind(this, 0)}>默认</a>
                <a className={order[0] == 2 ? 'sort-item sort-sales active' : 'sort-item sort-sales'} onClick={this.sortHandler.bind(this, 2)}>销量</a>
                <a className={order[0] == 4 ? 'sort-item sort-price active' : 'sort-item sort-price'} onClick={this.sortHandler.bind(this, 4)}>价格</a>
                <a className="sort-item sort-filter" onClick={this.filterHandler.bind(this)}>筛选</a>
            </div>
        );
    }
}

export default Sort;