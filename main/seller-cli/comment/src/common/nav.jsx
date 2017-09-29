import React from "react";
var Nav = React.createClass({
	handler: function(url) {
		window.location.href = url;
	},
	render: function() {
		return (
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
	}
});

export default Nav;