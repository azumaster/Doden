import React from 'react';
import PageCtrlBar from '../components/page/paging.js';

class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {},
            currentPage: 1,
            pageNum: 1
        };
    }

    componentDidMount() {
        this.getData({
            size: 20,
            page: 1
        }, (data) => {
            this.setState({
                data: data,
                pageNum: Math.ceil(data.data_total/20)
            });
        });
    }

    pagingClickHandler = (page = {}) => {
        let params = Object.assign({size: 20}, page);
        this.setState({
            currentPage: params.page
        }, () => {
            this.getData(params, (data) => {
                this.setState({
                    data: data,
                    pageNum: Math.ceil(data.data_total/20)
                });
            });
        });
    }


    getData = (params, fn = () => {}) => {
        H.we_loading.show();
        H.server.order_del_goods_reason_list(params, (res) => {
            if (res.code === 0) {
                fn(res.data);
                H.we_loading.hide();
            } else {
                H.we_loading.hide();
                H.dialog(res.message);
            }
        });
    }

    render() {
        let data = this.state.data.lists || [];
        return (
            <div className="section-table-w">
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>买家店铺名</th>
                            <th>卖家店铺名</th>
                            <th>商品名</th>
                            <th>原因</th>
                            <th>删除时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((el, index) => {
                            return (
                                <tr key={index}>
                                    <td>{el.buy_shop_name}</td>
                                    <td>{el.sell_shop_name}</td>
                                    <td>{el.del_goods_name}</td>
                                    <td>{el.del_reason.join('、')}</td>
                                    <td>{el.del_time}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <PageCtrlBar pageNum={this.state.currentPage}  maxPage={this.state.pageNum} clickCallback={this.pagingClickHandler}/>
            </div>
        );
    }
}

export default Main;
