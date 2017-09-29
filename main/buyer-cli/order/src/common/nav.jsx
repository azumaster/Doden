import React from "react";
var Nav = React.createClass({
	getInitialState: function() {
		return {
			isDirect: true,
			cellBack: false
		}
	},
	handler: function(url) {
		window.location.href = url;
	},
	componentWillMount: function() {
		H.server.userShopType({},(res) => {
			let f = true;
			if(res.code === 0){
				if(res.data.shopType == 11 && res.data.shopType == 12) {
					f = false;
				}
				this.setState({isDirect: f, cellBack: true});
			}else {
				H.we_loading.hide();
				H.dialog(res.message);
			}
		});
	},
	render: function() {
		var xml = '';
		if(this.state.cellBack) {
			if(this.state.isDirect) {
				xml = (
					<div id="nav">
						<div className="navs">
							<a style={{backgroundPosition: "0% 0%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=Buyers&c=Goods&a=goodsGroupSHow")}>
							</a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "0 100%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=PublicTemplate&c=ApiPublic&a=oftenbuy")}>
							</a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "100% 25%"}}> </a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "0 75%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=PublicTemplate&c=ApiPublic&a=Community")}>
							</a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "0% 50%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=Buyers&c=user&a=info")}>
							</a>
						</div>
					</div>
				)
			}else {
				xml = (
					<div id="nav">
						<div className="navs">
							<a style={{backgroundPosition: "0 100%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=PublicTemplate&c=ApiPublic&a=oftenbuy")}>
							</a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "100% 25%"}}> </a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "0 75%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=PublicTemplate&c=ApiPublic&a=Community")}>
							</a>
						</div>
						<div className="navs">
							<a style={{backgroundPosition: "0% 50%"}}
							   onTouchStart={this.handler.bind(this, "index.php?m=Buyers&c=user&a=info")}>
							</a>
						</div>
					</div>
				)
			}
		}
		return (
			<div>
				{xml}
			</div>
		)
	}
});

export default Nav;