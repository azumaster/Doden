import React from "react";
import ReactDOM from "react-dom";

var OrderGoodsList = React.createClass({
    getInitialState: function () {
        return {
            data: {}
        }
    },
    //删除订单中的商品;
    delOrderGoods: function(p,e) {
		e.stopPropagation();
        let _this = this;
        let dialog = H.dialog({
            title: "删除商品",
			autoClose: false,
            content: "<div class='del-goods-dialog'><div>吐槽一下吧，我们下次会做到更好</div><div class='check'>" +
            "<div><input type='checkbox' id='del-goods-option1'><label for='del-goods-option1'>价格太贵</label></div>" +
            "<div><input type='checkbox' id='del-goods-option2'><label for='del-goods-option2'>担心品质不好</label></div>" +
            "<div><input type='checkbox' id='del-goods-option3'><label for='del-goods-option3'>不想要了</label></div>" +
            "<div><input type='checkbox' id='del-goods-option4'><label for='del-goods-option4'>数量选错</label></div>" +
            "</div><div class='textarea-warp'><textarea id='del-cause' placeholder='其它原因：'></textarea></div></div>",
            okCallback(){
                $('#del-cause').blur();
                let server = H.server;
                var arr = [];
                var mes = "<p>期待你能找到更合适的商品。</p>";
                if ($("#del-goods-option1").is(':checked')) {
                    arr.push("价格太贵");
                }
                if ($("#del-goods-option2").is(':checked')) {
                    arr.push("担心品质不好");
                }
                if ($("#del-goods-option3").is(':checked')) {
                    arr.push("不想要了");
                }
                if ($("#del-goods-option4").is(':checked')) {
                    arr.push("数量选错");
                    mes = "<p>商品已经自动加入到购物车中，方便你重新下单。</p>";
                }
                if ($("#del-cause").val() != "" && $("#del-cause").val()) {
                    arr.push($("#del-cause").val());
                }
                var param = {
                    order_goods_id: p.goodsId, del_reasons: JSON.stringify(arr)
                };
                server.order_buy_goods_del(param, (res)=> {
                    if (res.code == 0) {
                        p.order_new_price = res.data.order_new_price;
                        p.discount_new_amount = res.data.discount_new_amount;
                        _this.props.delOrderGoods && _this.props.delOrderGoods(p);
                        dialog.reRender({
                            title: "删除成功",
                            content: mes,
							autoClose: true,
                            okText: "关闭"
                        });
                    } else {
                        dialog.reRender({
                            content: "<p>" + res.message + "</p>",
                            okText: "关闭"
                        });
                    }
                });
            },
            cancel: true,
			cancelCallback() {
                $('#del-cause').blur();
				dialog.destroy();
			}
        });
    },
    render: function() {
        var delXml = "";

        return (
            <ul className="order-goods-list">
                {
                    this.props.data.map((data, index) => {
                        if(this.props.orderId){
                            var param = {
                                orderId: this.props.orderId,
                                delState: this.props.delState,  //判断是大订单还是小订单;大订单为2，小订单为1;
                                goodsId: data.order_goods_id
                            };
                            delXml = <button className="btn btn-small" onClick={this.delOrderGoods.bind(this,param)} >删除</button>
                        }
                        return (
							<li id={"goods"+data.order_goods_id} className="cls goodslist" key={index}>
                            	<div className="goods-img">
                            	    <img src={"http://img.idongpin.com/"+data.goods_pic+"@100w_90Q.jpg"} width="90%" />
                            	</div>
                            	<div className="goods-info">
                                	<div className="goods-title">{data.goods_name}</div>
                                	<div className="goods-num">
                                    	{data.buy_price}元*{data.buy_num}
                                    	{data.goods_unit}={data.goods_total_amount}元</div>
                            	</div>
                            	<div className="operation">
                                	{delXml}
                            	</div>
                        	</li>
						);
                    })
                }
            </ul>
        )
    }
});

export default OrderGoodsList;
