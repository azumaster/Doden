/*
* xy 2017.08.10
* 客户注册信息统计
* */
import React from 'react';
import DropDown from '../../../../components/drop_down/drop-down';
import Paging from '../../../../components/page/paging.js';

class NewUserStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            param: {     //获取数据的参数;
                type: 'shop_name',
                pageNum: 1,
                pageSize: 20
            },
            data: [],
            selArr: ['shop_name', 'mobile_phone'],    //下拉选择的选项;
            maxPage: 1     //最大页码;
        };
    }

    componentWillMount() {
        this.getData();
    }

    //获取数据列表;
    getData() {
        H.server.provider_customersRegister(this.state.param, (res) => {
            if(res.code == 0) {
                this.setState({data: res.data.data || [], maxPage: res.data.last_page});
            }else if(res.code == 10106) {
                H.overdue();
            }else {
                H.Modal(res.message);
            }
        });
    }

    //更改搜索类型
    changeEv(index) {
        let param = this.state.param;
        param.type = this.state.selArr[index];
        param.value = null;
        this.setState({param: param});
    }

    //生成列表;
    CreateTable() {
        let data = this.state.data,
        xml = data.map((val, index) => {
            return(
                <tr key={index}>
                    <td>{val.shop_name}</td>
                    <td>{val.created_at}</td>
                    <td>{val.mobile_phone}</td>
                    <td>{val.type_name}</td>
                </tr>
            );
        });
        return (
            <tbody>{xml}</tbody>
        );
    }

    // 分页
    setPageNum(page){
        let param = this.state.param;
        param.pageNum = page.page;
        this.setState({param: param}, this.getData);
    }

    //输入框的值改变事件;
    changeVal(e) {
        let param = this.state.param;
        param.value = e.target.value;
        this.setState({param: param});
    }

    //点击筛选按钮;
    filterHandle() {
        let param = this.state.param;
        param.pageNum = 1;
        this.setState({param: param}, this.getData);
    }

    render() {
        return (
            <div className="order-statistics-wrap section-table">
                <div className="section-filter">
                    <div className="form-inline">
                        <div className="filter-row">
                            <DropDown dropdownData={['店铺名', '手机号码']} selectVal="0" changeEv={this.changeEv.bind(this)}/>
                            <input className="form-control" value={this.state.param.value} onChange={this.changeVal.bind(this)}/>
                            <a href="javascript:;" className="btn btn-sm btn-orange" onClick={this.filterHandle.bind(this)}>筛选</a>
                        </div>
                    </div>
                </div>
                <div className="total-count" style={{overflowX: 'auto'}}>
                    <table className="table table-bordered table-hover table-responsive">
                        <thead>
                        <tr>
                            <th>店铺名</th>
                            <th>注册时间</th>
                            <th>手机号</th>
                            <th>店铺分类</th>
                        </tr>
                        </thead>
                        {this.CreateTable()}
                    </table>
                    <Paging pageNum={this.state.param.pageNum} maxPage={this.state.maxPage} clickCallback={this.setPageNum.bind(this)}/>
                </div>
            </div>
        );
    }
}

export default NewUserStatistics;