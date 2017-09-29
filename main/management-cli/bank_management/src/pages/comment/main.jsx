import React from 'react';
import Control from './table-control.jsx';

const Main = React.createClass({

    getInitialState(){
        return {
            ListData: [],
            cityData: [],
            pageNum: 1,
            currentPage: 1,
            dropdownMenus: ['中国银行', '中国工商银行', '中国建设银行', '中国农业银行', '中国民生银行', '招商银行', '兴业银行', '交通银行', '中国光大银行', '广东发展银行']
        };
    },

    getChildContext: function() {
        return {
            currFresh: this.refresh
        };
    },

    childContextTypes: {
        currFresh: React.PropTypes.func
    },

    //下拉更改省;
    changePrivince: function (val, id) {
        let data = this.state.ListData;
        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].bank_card_infos.id == id) {
                if(val == -1){
                    data[i].bank_card_infos.city_id = null;
                    data[i].bank_card_infos.province_id = null;
                }else {
                    data[i].bank_card_infos.city_id = 0;
                    data[i].bank_card_infos.province_id = parseInt(val);
                }

                this.setState({ListData: data});
            }
        }
    },

    //下拉更改城市;
    changeCity: function (val, id) {
        let data = this.state.ListData;
        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].bank_card_infos.id == id) {
                data[i].bank_card_infos.city_id = parseInt(val);
                this.setState({ListData: data});
            }
        }
    },

    //下拉更改银行卡;
    backSelVal: function (val, id) {
        let data = this.state.ListData;
        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].bank_card_infos.id == id) {
                data[i].bank_card_infos.bank_name = this.state.dropdownMenus[parseInt(val)];
                this.setState({ListData: data});
            }
        }
    },

    //改变开户地址;
    changeBankAddress: function (val, id){
        let data = this.state.ListData;
        for(let i = 0 ; i < data.length ; i++) {
            if(data[i].bank_card_infos.id == id) {
                data[i].bank_card_infos.bank_address = val;
                this.setState({ListData: data});
            }
        }
    },

    componentDidMount(){
        this.getListData({
            shop_name: '',
            size: 20,
            page: 1
        });
    },

    refresh(p = {}, fn = () => {}) {
        let params = {};
        Object.assign(params, p);
        this.getListData(params, fn);
    },

    // 获取列表
    getListData(param = {}, fn = () => {}){
        let server = H.server,
            obj = param,
            defaultParam = {
                size: 20,
                page: 1
            },
            params = Object.assign(defaultParam, obj);

        this.setState({
            currentPage: params.page
        }, () => {
            server.shop_bankCard_list(params, (res) => {
                if (res.code == 0) {
                    this.setState({
                        ListData: [],
                        cityData: res.data.province_city_infos || [],
                        pageNum: Math.ceil(res.data.total/20)
                    }, () => {
                        fn();
                        this.setState({ListData: res.data.shop_bank_card_infos || []});
                    });
                } else {
                    H.Modal(res.message);
                }
            });
        });
    },

    render(){
        let dom = '';
        if (this.state.ListData.length === 0) {
            dom = (
                <div>加载中...</div>
            );
        } else {
            dom = (
                <Control
                    currentPage={this.state.currentPage}
                    pageNum={this.state.pageNum}
                    status={this.state.status}
                    data={this.state.ListData}
                    cityData={this.state.cityData}
                    changePrivince={this.changePrivince}
                    changeCity={this.changeCity}
                    backSelVal={this.backSelVal}
                    dropdownBank={this.state.dropdownMenus}
                    bankAddressChange={this.changeBankAddress}
                />
            );
        }
        return dom;
    }
});

export default Main;