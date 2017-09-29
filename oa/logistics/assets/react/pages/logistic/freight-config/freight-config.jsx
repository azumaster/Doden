class FreightConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                'base': '',
                'collection': '',
                'overdue': '',
                'charges': [
                    {
                        'name': '',
                        'amount': ''
                    }
                ],
                'sales': [
                    {
                        'price': '',
                        'sale': ''
                    }
                ]
            }
        };
        this.getFreightConfig = this.getFreightConfig.bind(this);
    }

    componentWillMount() {
        this.getFreightConfig();

    }

    //获取运费配置;
    getFreightConfig() {
        H.server.logistics_charge_config_get({}, (res) => {
            if(res.code == 0) {
                let data = res.data;
                if(data.charges.length == 0) {
                    data.charges.push(
                        {
                            'name': '',
                            'amount': ''
                        }
                    );
                }
                if(data.sales.length == 0) {
                    data.sales.push(
                        {
                            'price': '',
                            'sale': ''
                        }
                    );
                }
                this.setState({data: data});
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //设置运费配置;
    submit() {
        H.server.logistics_charge_config_set(JSON.stringify(this.state.data), (res) => {
            if(res.code == 0) {
                H.Modal('保存成功');
            }else if(res.code == 10106) {
                H.overdue();
            }else{
                H.Modal(res.message);
            }
        });
    }

    //输入框改变时修改数据值;
    changeHandler(e) {
        let data = this.state.data,
            target = e.target,
            value = target.value,
            key = target.dataset.key,
            index = target.dataset.index,
            operate = target.dataset.operate;
        if(index){
            data[key][index][operate] = value;
        }else {
            data[key] = value;
        }
        this.forceUpdate();
    }

    //添加和删除规则配置和打折配置;
    add(key) {
        let data = this.state.data;
        switch (key) {
            case 'charges':
                data[key].push({
                    'name': '',
                    'amount': ''
                });
                break;
            case 'sales':
                data[key].push({
                    'price': '',
                    'sale': ''
                });
                break;
        }
        this.forceUpdate();
    }

    reduce(key, index) {
        let data = this.state.data;
        data[key].splice(index, 1);
        this.forceUpdate();
    }

    render() {
        let data = this.state.data;
        return (
            <div calssName="section-warp row">
                <div className="section-filter"></div>
                <div className="col-lg-7">
                    <div className="freight-config panel panel-default">
                        <div className="panel-heading">运费配置</div>
                        <div className="panel-body form-horizontal">
                            <form className="form-inline">
                                <label className="col-lg-2 control-label">起步价：</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" data-key="base" value={data.base} onChange={this.changeHandler.bind(this)}/>
                                    <div className="input-group-addon">元</div>
                                </div>
                            </form>
                            <form className="form-inline">
                                <label className="col-lg-2 control-label">代收货款：</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" data-key="collection" value={data.collection} onChange={this.changeHandler.bind(this)}/>
                                    <div className="input-group-addon">元/笔</div>
                                </div>
                            </form>
                            <form className="form-inline">
                                <label className="col-lg-2 control-label">滞纳金：</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" data-key="overdue" value={data.overdue} onChange={this.changeHandler.bind(this)}/>
                                    <div className="input-group-addon">元/天</div>
                                </div>
                            </form>
                            <form className="form-inline">
                                <label className="col-lg-2 control-label">运费细则：</label>
                                <div className="input-group"></div>
                            </form>

                            {
                                data.charges.map((val, index) => {
                                    return (
                                        <form key={'charges_' + index} className="form-inline">
                                            <label className="col-lg-2 control-label"></label>
                                            <div className="input-group rule-item">
                                                <div className="input-group content">
                                                    <div className="form-inline"><label className="control-label">文字描述</label><div className="input-group">
                                                        <input className="form-control" type="text" data-key="charges" data-index={index} data-operate="name" value={val.name} onChange={this.changeHandler.bind(this)}/></div></div>
                                                    <div className="form-inline"><label className="control-label">每件收费</label>
                                                        <div className="input-group">
                                                            <input type="text" className="form-control"data-key="charges" data-index={index} data-operate="amount" value={val.amount} onChange={this.changeHandler.bind(this)}/>
                                                            <div className="input-group-addon">元</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    index == 0 ? <div className="input-group add" onClick={this.add.bind(this, 'charges')}></div> :
                                                        <div className="input-group reduce" onClick={this.reduce.bind(this, 'charges', index)}></div>
                                                }
                                            </div>
                                        </form>
                                    );
                                })
                            }

                            <form className="form-inline">
                                <label className="col-lg-2 control-label">运费细则：</label>
                                <div className="input-group"></div>
                            </form>

                            {
                                data.sales.map((val, index) => {
                                    return (
                                        <form key={'sales_' + index} className="form-inline">
                                            <label className="col-lg-2 control-label"></label>
                                            <div className="input-group rule-item">
                                                <div className="input-group content">
                                                    <div className="form-inline"><label className="control-label">收件人达到</label>
                                                        <div className="input-group">
                                                            <input type="text" className="form-control" data-key="sales" data-index={index} data-operate="price" value={val.price} onChange={this.changeHandler.bind(this)}/>
                                                            <div className="input-group-addon">元</div>
                                                        </div>
                                                        （同一发货人）
                                                    </div>
                                                    <div className="form-inline"><label className="control-label">每件收费</label>
                                                        <div className="input-group">
                                                            <input type="text" className="form-control" data-key="sales" data-index={index} data-operate="sale" value={val.sale} onChange={this.changeHandler.bind(this)}/>
                                                            <div className="input-group-addon">%</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    index == 0 ? <div className="input-group add" onClick={this.add.bind(this, 'sales')}></div> :
                                                        <div className="input-group reduce" onClick={this.reduce.bind(this, 'sales', index)}></div>
                                                }
                                            </div>
                                        </form>
                                    );
                                })
                            }

                        </div>
                        <div className="panel-footer clearfix">
                            <button className="btn btn-lg btn-default pull-right" onClick={this.submit.bind(this)}>保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FreightConfig;