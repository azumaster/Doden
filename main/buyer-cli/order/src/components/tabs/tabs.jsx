import React from 'react';

class Tabs extends React.Component {
	constructor(props) {
		super(props);
	}

	static defaultProps = {
		selectIndex : 0
	}

	static propTypes = {
	    selectIndex : React.PropTypes.number.isRequired,
	    badge : React.PropTypes.array.isRequired,
	    handleChange : React.PropTypes.func.isRequired
	}

	render() {
		let badgeArr = [];
		this.props.badge.map((el) => {
			badgeArr[el.status] = el.number;
		});

		return (
			<div id="toolbar" className="toolbar">
				<ul className="order-tab">
					<li className={this.props.selectIndex == 0 ? 'active':''} onClick={this.props.handleChange.bind(this, 0)}>
						<a>
							<span>全部订单</span>
						</a>
					</li>
					<li className={this.props.selectIndex == 1 ? 'active':''} onClick={this.props.handleChange.bind(this, 1)}>
						<a>
							<span>未付款</span>
						</a>
						{badgeArr[1] ? <i className="count-red-dot">{badgeArr[1]}</i> : ''}
					</li>
					<li className={this.props.selectIndex == 2 ? 'active':''} onClick={this.props.handleChange.bind(this, 2)}>
						<a>
							<span>待发货</span>
						</a>
						{badgeArr[2] ? <i className="count-red-dot">{badgeArr[2]}</i> : ''}
					</li>
					<li className={this.props.selectIndex == 3 ? 'active':''} onClick={this.props.handleChange.bind(this, 3)}>
						<a>
							<span>已发货</span>
						</a>
						{badgeArr[3] ? <i className="count-red-dot">{badgeArr[3]}</i> : ''}
					</li>
				</ul>
			</div>
		);
	}
}

export default Tabs;