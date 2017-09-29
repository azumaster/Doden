/*
* 钻石减免
* */

import React from 'react';

class Breaks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            diamond: [{key: 0, value: '不减免'}, {key: 100, value: '100钻石'}, {key: 200, value: '200钻石'}],
            reducePrice: 0
        };
        this.createTimeBar = this.createTimeBar.bind(this);
    }

    //创建钻石选择工具;
    createTimeBar() {
        var str = '<div class="select-zone top"></div><div class="select-zone middle"></div><div class="select-zone bottom"></div>'+
            '<div class="region-picker"><div id="provincePicker"></div></div>';
        H.picker(str, '使用钻石数');
        var up,
            diamond = this.state.diamond,
            diamondData = this.state.diamond[0],
            diamondIndex = 0;
        for(var i = 0 ; i < diamond.length; i++) {
            if(this.props.data.diamond_use_number == diamond[i].key) {
                diamondData = diamond[i];
                diamondIndex = i;
            }
        }
        up = UIPickerView.createPickerView({
            dataSource: diamond,
            id: 'provincePicker',
            constraintsId: 'wower',
            kUP: {
                kUPCELLHEIGHT: 34,
                kUPFRICTION: 0.003
            },
            valueChange: (data) => {
                diamondData = data;
            }
        });

        up.UPSelectRowIndexPath(parseInt(diamondIndex) + 1).UPThen(function(indexPath, value) {
            diamondData = value;
        });

        let animaed = CAAnimation.createAnimation({
            id: 'region-picker'
        });
        $('#selectClear').unbind('click');
        $('#selectClear').bind('click', () => {
            $('#picker_mask').hide();
            animaed.finish();
        });
        $('#selectFinish').unbind('click');
        $('#selectFinish').bind('click', () => {
            $('#picker_mask').hide();
            animaed.finish();
            var data = this.props.data;
            if(diamondData.key == 0){
                data.reducePrice = 0;
                data.diamond_use_number = diamondData.key;
                this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
            }else {
                H.we_loading.show('验证优惠金额</br>请稍候……');
                H.server.other_diamond_exchange({diamond_number: diamondData.key}, (res) => {
                    if(res.code == 0) {
                        if(res.data.exchange_value <= this.context.totalPrice) {
                            this.setState({reducePrice: res.data.exchange_value});
                            data.reducePrice = res.data.exchange_value;
                            data.diamond_use_number = diamondData.key;
                            this.props.changeSettlementInfo && this.props.changeSettlementInfo(data);
                        }else {
                            H.operationState('钻石减免金额不能大于合计金额');
                        }
                    }else {
                        H.operationState(res.message);
                    }
                    H.we_loading.hide();
                });
            }
            animaed.removeEvent();
        });

        this.setState({option: animaed}, () => {
            this.state.option.start();
        });
    }

    scoreSelect() {
        this.createTimeBar();
    }

    render() {
        let diamondNum = '';
        if(this.props.data.diamond_use_number) {
            diamondNum = this.props.data.diamond_use_number + '钻石';
        }else{
            diamondNum = '无减免';
        }
        return (
            <section className="section-item">
                <div className="header-cell flex-box">
                    <div className="flex-num1">优惠减免</div>
                </div>
                <div className="body-cell flex-box" style={{padding: '30px 8px'}}>
                    <div className="flex-num1">
                        <div className="flex-box center">钻石
                            <div className={this.props.operation ? 'score-select' : 'score-select disabled'}
                                 onClick={this.props.operation ? this.scoreSelect.bind(this) : ''}>
                                <span className="text">
                                {diamondNum}
                            </span><i className="select-icon"></i></div>
                            <div className="flex-num1">= {this.state.reducePrice}元</div>
                            <div>最高可使用{this.props.data.max_diamond_use_number}钻石</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
Breaks.contextTypes = {
    totalPrice: React.PropTypes.number
};

export default Breaks;

