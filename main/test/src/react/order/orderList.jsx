import OrderItem from './orderItem.jsx';
import Loading from './loading.jsx';

class OrderList extends React.Component{
    constructor(){
        super();
    }

    showActionSheet(order){
        $('#mask')
            .addClass('fade_toggle')
            .css('display', 'block');
        $('#actionsheet').addClass('actionsheet_toggle');
        this.props.getOrderId(order);
    }

    createOrderItem(order){
        let orderXML  =  [];
        order.order_goods_infos.map((goods) =>(
            orderXML.push(
                <OrderItem order_goods_info = {goods}/>
            )
        ));
        return orderXML;
    }

    createOrderList(){
        let rows  =  [];
        let status  =  false;
        this.props.orderInfoArr.map((order)  =>{
            switch (this.props.status){
                case 1:
                    status = 'all';
                    break;
                case 2:
                    status = false;
                    break;
                case 3:
                    status = true;
                    break;
                case 4:
                    status = true;
                    break;
            }
            let xml  =  [];
            status  ===  'all'?xml.push(order.status  ===  7 ? <div className = "cell-ft"><a className = "btn btn-mini" >去评价</a></div> : <div className = "cell-ft"><a className = "btn btn-mini" onClick={this.showActionSheet.bind(this, order)}>支付</a></div>):
                xml.push(status?<div className = "cell-ft"><a className = "btn btn-mini">去评价</a></div>:<div className = "cell-ft"><a className = "btn btn-mini" onClick={this.showActionSheet.bind(this, order)}>支付</a></div>);
            rows.push(
                <div className = "cells order-list">
                    <ul className = "cells">
                        <div className = "cells">
                            <div className = "cell">
                                <div className = "cell-head">
                                    <p>减&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;免:{order.discount_amount}</p>
                                    <p>应付金额:{order.total_count}</p>
                                </div>

                                <div className = "cell-primary">
                                </div>
                                {xml}
                            </div>

                            <div className = "cell">
                                <div className = "cell-primary">
                                    <ul className = "carousel">
                                        <li>{order.logistic_info[0]}</li>
                                        <li>{order.logistic_info[1]}</li>
                                    </ul>
                                    下单时间：{order.status_time}
                                </div>
                            </div>
                        </div>
                        {this.createOrderItem(order)}
                    </ul>
                </div>
            );
        });
        return rows;
    }

    render(){
        if(this.props.orderInfoArr.length === 0) return(<Loading/>);
        return(
            <div className = "cells">
                {this.createOrderList()}

            </div>
        );
    }
}
export default OrderList;