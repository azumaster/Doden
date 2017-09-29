import React from 'react';
import Tabs from './tabs.jsx';
import TabContent from './tab-content.jsx';

class Main extends React.Component {
    constructor(){
    	super();
        this.state = {
            selectIndex: 0,
            isFresh: true,
            area: [],
            confirmList: {}
        };
    }

	componentDidMount() {
        this.getAreaList(() => {
        	this.getConfirmList({
        		area_id: ''
        	});
        });
	}    

    getAreaList = (fn = () => {}) => {
        H.server.area_list({}, (res) => {
            if (res.code === 0) {
                res.data.unshift({
                    area_id:'',
                    area_name: '所有大区'
                });
                this.setState({
                    area: res.data
                }, () => {
                    fn(res.data);
                });
            } else {
            	H.dialog(res.message);
            }
        });
    }

    getConfirmList = (params, fn = () => {}) => {
        H.we_loading.show();
        H.server.order_buy_wechat_payment_list(params, (res) => {
            if (res.code === 0) {
                H.we_loading.hide();
                this.setState({
                    confirmList: res.data
                }, () => {
                    fn(res.data);
                });
            } else {
            	H.dialog(res.message);
            }
        });
    }

    orderConfirm = (order_no, fn = () => {}) => {
        this.state.confirmList.order_infos.map((el, index) => {
            if (el.order_no === order_no) {
                this.state.confirmList.order_infos.splice(index, 1);
            }
        });
        this.setState({
            confirmList: this.state.confirmList
        }, () => {
            fn();
        });
    }

    handleChange = (areaId, selectIndex) => {
   		this.getConfirmList({
   			area_id: areaId
   		}, () => {
   			this.setState({
   				selectIndex: selectIndex
   			});
   		});
    }

    handleConfirm = (...el) => {
        let [order_no, goods_ids, fn] = el;
        H.server.order_buy_goods_back({
            main_order_no: order_no,
            delete_goods_ids: goods_ids
        }, (res) => {
            if (res.code === 0) {
                this.orderConfirm(order_no, fn);
            } else {
                // 只能以这种方式规避点透 T_T
                setTimeout(() => {
                    H.dialog(res.message);
                }, 300);
            }
        });
    }

    render() {
        return (
		    <div>
                <Tabs
                    selectIndex={this.state.selectIndex}
                    regions={this.state.area}
                    handleChange={this.handleChange} />

                <TabContent 
                	listData={this.state.confirmList} 
                    handleConfirm={this.handleConfirm}/>
            </div>
		);
    }
}
export default Main;
