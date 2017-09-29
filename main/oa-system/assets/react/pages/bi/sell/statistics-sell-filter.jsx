import React from 'react';
import BtnGroup from '../../../../components/btn-group/multi_btn_group.jsx';

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.parent = props.parent;

        this.state = {
            buyer: {
                type: [],
                market: [],
                geo: {
                    province: [],
                    city: [],
                    district: []
                }
            },
            seller: {
                type: [],
                market: [],
                geo: {
                    province: [],
                    city: [],
                    district: []
                }
            },
            goods: {
                type: [],
                brand: []
            },
            pay: {
                method: [],
                channel: []
            },
            delivery: [],
            status: []
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        let self = this,
            parent = this.parent;
        H.server.bi_order_filter({
            time: parent.request.time,
            filter: parent.request.filter
        }, function (res) {
            self.state = res.data;
            self.forceUpdate();
        });
    }

    render() {
        let parent = this.parent;
        return (
            <div className="form col-lg-4">
                <legend>数据筛选</legend>
                <div className="form-group">
                    <label>买家类型</label>
                    <BtnGroup className="btn-group btn-group-justified"
                              btnNames={this.state.buyer.type}
                              bindData={this.state.buyer.type}
                              clickCallback={function(status) {
                                if (status.length === 0) {
                                    if (!parent.request.filter.hasOwnProperty('buyer')) {
                                        delete parent.request.filter.buyer.type;
                                    }
                                    return;
                                }

                                if (!parent.request.filter.hasOwnProperty('buyer')) {
                                    parent.request.filter.buyer = {};
                                }

                                parent.request.filter.buyer.type = status;
                              }}
                              style="btn"
                              activeStyle="btn btn-default"
                              status={parent.request.filter.hasOwnProperty('buyer') ? parent.request.filter.buyer.type : []}/>
                </div>
                <div className="form-group">
                    <label>买家市场</label>
                    <BtnGroup className="btn-group"
                              btnNames={this.state.buyer.market}
                              bindData={this.state.buyer.market}
                              clickCallback={function(status) {
                                if (status.length === 0) {
                                    if (!parent.request.filter.hasOwnProperty('buyer')) {
                                        delete parent.request.filter.buyer.market;
                                    }
                                    return;
                                }

                                if (!parent.request.filter.hasOwnProperty('buyer')) {
                                    parent.request.filter.buyer = {};
                                }

                                parent.request.filter.buyer.market = status;
                              }}
                              style="btn"
                              activeStyle="btn btn-default"
                              status={parent.request.filter.hasOwnProperty('buyer') ? parent.request.filter.buyer.market : []}
                        />
                </div>
            </div>
        );
    }
}

export default Filter;