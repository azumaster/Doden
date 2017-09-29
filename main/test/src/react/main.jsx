import Tab from './order/tab.jsx';
import Order from './order/orderCtrl.jsx';
import  ActionSheet from './order/actionSheet.jsx';

class Main extends React.Component {
	constructor(){
		super();
		this.state={
			status:1,
			parentId:{}
		};
		this.togglePage=this.togglePage.bind(this);
		this.getOrderId=this.getOrderId.bind(this);
	}

	//切换页面
	togglePage(index){
		this.setState({
			status:index
		});

	}
	//得到我们需要的orderId
	getOrderId(order){
		this.setState({
			parentId:order.parent_order_no
		});
	}

	render() {
		return (
			<div>
				<Tab togglePage={this.togglePage.bind(this)}/>
				<Order status={this.state.status} getOrderId={this.getOrderId}/>
				<ActionSheet parentId={this.state.parentId} />;
			</div>
		);
	}
}
export default Main;
