import React from 'react';

class TabContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        	refundList : {}
        };
    }

    static defaultProps = {
    	listData : {}
    }

    static propTypes = {
        listData : React.PropTypes.object.isRequired,
        handleConfirm : React.PropTypes.func.isRequired
    }

    domGenerate = (products = [], tr_buyer, tr_time, order_no, pIndex) => {
    	const len = products.length;
    	const trs = products.map((el, index) => {
    		// 判断是否在退回列表中
    		let isRefund = this.state.refundList[order_no] ? (this.state.refundList[order_no][el.goods_id] ? 'disabled' : '') : '' ;
    		return (
    			<tr key={'product' + index} className={isRefund + ' ' + (pIndex % 2 == 1 ? 'bg-light' : '')}>
    				<td>{el.goods_brand + ' ' + el.goods_name}</td>
					<td><a href={'tel:' + el.goods_sell_phone} className="phone-icon">{el.sell_shop_name}</a></td>
					<td>{el.goods_price}</td>
					<td>{el.buy_quantity}</td>
					<td><a href="#" className="btn" onClick={(e) => {e.preventDefault();this.orderRefund(el.goods_id, order_no, len, isRefund);}}>退款</a></td>
    			</tr>
    		);
    	}),

    	hr = (
    		<tr className="hr">
    			<td colSpan="5" style={{height: 5}}></td>
    		</tr>
    	);

    	trs.unshift([tr_buyer, tr_time]);
    	trs.push(hr);
    	return trs;
    }

    orderConfirm = (...el) => {
        let [order_no] = el;
		this.props.handleConfirm(...el, () => {
			delete this.state.refundList[order_no];
			this.setState({
				refundList: this.state.refundList
			});
		});
    }

	mainOrderConfirm = (...el) => {
		let _this = this;
		H.dialog({
			content: '确认进行该操作吗？',
			cancel: true,
			okCallback() {
				_this.orderConfirm(...el);
			}
		});
	}

    orderRefund = (goods_id, order_no, len, isDisabled) => {
    	if ( isDisabled === 'disabled' ) return;
		let _this = this;
		H.dialog({
			content: '确认退款吗？',
			cancel: true,
			okCallback() {
				// 如果已该大订单为键的对象不存在则新建对象，用来保存当前大订单挂起的退款商品键值对
				if (!_this.state.refundList[order_no]) {
					_this.state.refundList[order_no] = {};
				}
				_this.state.refundList[order_no][goods_id] = goods_id;
				_this.setState({
					refundList: _this.state.refundList
				}, () => {
					// 每次点击退款，若退款的商品数等于该大订单的商品数，则直接发起确认操作
					if (len === H.allKeys(_this.state.refundList[order_no]).length) {
						// 参数： 大订单号，退款商品id的字符串
						_this.orderConfirm(order_no, H.allKeys(_this.state.refundList[order_no]).join(','));
					}
				});
			}
		});

    }

    render() {

    	const list = this.props.listData.order_infos || [];

        return (
            <div className="section-tabContent">
				<div className="thead">
					<span>付款人</span>
					<span>大区</span>
					<span>实付金额</span>
					<span>操作</span>
				</div> 
				<div className="section-table-w">
					<table className="table">
						<tbody>
							{list.map((el, index) => {
								let tr_buyer = (
									<tr key={index} className={ index % 2 == 1 ? 'bg-light' : ''}>
										<td style={{width: '25%'}}><a href={'tel:' + el.buy_phone} className="phone-icon">{el.buy_shop_name}</a></td>
										<td style={{width: '25%'}}>{el.buy_area}</td>
										<td>{el.payment_amount}</td>
										<td colSpan="2" style={{width: '25%'}}><a href="#" className="btn" onClick={(e) => {e.preventDefault();this.mainOrderConfirm(el.order_no, H.allKeys(this.state.refundList[el.order_no]).join(','));}}>确认</a></td>
									</tr>
								),

								tr_time = (
									<tr key={'time' + index} className={ index % 2 == 1 ? 'bg-light' : ''}>
										<td colSpan="5" className="order-time" style={{textAlign: 'left'}}>
											<span>{el.create_time}</span>
											<span>&nbsp;&nbsp;减免：{el.discount_amount}元</span>
										</td>
									</tr>
								);

								let trs = this.domGenerate(el.goods_infos, tr_buyer, tr_time, el.order_no, index);

								return trs;
							})}
						</tbody>
					</table>
				</div>
			</div>
        );
    }
}

export default TabContent;