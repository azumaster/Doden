import React from 'react';
import Tabs from '../components/tabs/tabs.jsx';
import TabContent from '../components/order/order-controller.jsx';
import ActionSheet from '../components/action-sheet/action-sheet.jsx';
import Nav from '../components/nav/nav.jsx';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectIndex: 0,
			badge: [],
			isFresh: true,
			parentId: '',
			identity: null,      //身份 1老板  2买家  3访客
			carData: {   //购物车数据;
				goods_count: 0
			}
		};
		this.userShopType = this.userShopType.bind(this);
		this.getCarData = this.getCarData.bind(this);
	}

	router = () => {
		// #全部订单 all|null   未付款 no-shop-page，待发货waitting-to-deliver，已发货has-delivered
		let hash = window.location.href.split('#')[1] || '',
			selectIndex;
		switch (hash) {
			case '':
				selectIndex = 0;
				break;
			case 'all':
				selectIndex = 0;
				break;
			case 'no-shop-page':
				selectIndex = 1;
				break;
			case 'waitting-to-deliver':
				selectIndex = 2;
				break;
			case 'has-delivered':
				selectIndex = 3;
				break;
			default:
				selectIndex = 0;
				break;
		}
		return selectIndex;
	}

	componentWillMount() {
	 	let selectIndex = this.router();
	 	this.setState({
	 		selectIndex: selectIndex
	 	});
		this.userShopType();
	}

	componentDidMount() {
		// let selectIndex = this.router(),
		this.getMessages((data) => {
			this.setState({
				badge: data
			});
		});
	}

	//获取当前登录用户的类型;
	userShopType() {
		H.server.userShopType({}, (res) => {
			if(res.code == 0){
				if(res.data.shopType == 11 || res.data.shopType == 12) {
					this.setState({identity: 1});
				}else {
					this.state.identity = 2;
					this.getCarData();
				}
			}else {
				H.we_loading.hide();
				H.dialog(res.message);
			}
		});
	}

	//获取购物车数据;
	getCarData() {
		H.server.shopCartInfo({}, (res) => {
			if(res.code == 0) {
				this.setState({carData: res.data});
			}else {
				H.dialog(res.message);
			}
		});
	}
	
	getMessages = (fn = () => {}) => {
		H.we_loading.show();
		H.server.order_buy_quantity({}, (res)=>{
			if (res.code === 0) {
				fn(res.data);
			} else {
				H.we_loading.hide();
				H.dialog(res.message);
			}
		});
	}

	handleChange = (value) => {
		this.getMessages((data) => {
			this.setState({
				badge: data,
				selectIndex : value,
				isFresh: true
			});		
		});
	}

	refreshBadge = (fn = () => {}) => {
		this.getMessages((data) => {
			this.setState({
				badge: data,
				isFresh: false
			}, () => {
				fn();
			});
		});
	}

	render() {
		console.log(this.state.selectIndex);
		return (
			<div>
				<Tabs 
					selectIndex={this.state.selectIndex}
					badge={this.state.badge} 
					handleChange={this.handleChange}
				/>

				<TabContent 
					selectIndex={this.state.selectIndex}
					refreshBadge={this.refreshBadge}
					isFresh={this.state.isFresh}
				/>

				{
					this.state.identity ?
						<Nav index='2' identity={this.state.identity} num={this.state.carData.goods_count > 0 ? {1: this.state.carData.goods_count} : null}/> : null
				}
				<ActionSheet
					parentId={this.state.parentId}
				/>
			</div>
		);
	}
}

export default Main;
