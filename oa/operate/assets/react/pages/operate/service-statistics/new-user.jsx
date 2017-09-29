/*
* 2017-07-27  xy
* 服务商新用户统计;
* */
import DropDown from '../../../../components/drop_down/drop-down';

class NewUser extends React.Component {
    constructor(props) {
        super(props);
        let arr = [], year = new Date().getFullYear();
        for(let i = 0 ; i < 8 ; i ++) {
            arr.push(year-i);
        }
        this.state = {
            param: {
                'group': 'day',
                'split': [
                    {
                        'sp_name': ['1']
                    }
                ]
            },
            year: year,
            month: new Date().getMonth()+1,
            yearArr: arr,
            data: null
        };
    }

    componentWillMount() {
        this.getData();
    }

    //获取数据;
    getData() {
        let param = this.state.param,
            year = this.state.year,
            month = this.state.month,
            d = 0;
        if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            d = '31';
        }else if(month == 4 || month == 6 || month == 9 || month == 11) {
            d = '30';
        }else {
            if(year%400 == 0) {
                d = '29';
            }else {
                d = '28';
            }
        }
        param.time = [year + '-' + (month < 10 ? ('0'+month) : month) + '-01', year + '-' + (month < 10 ? ('0'+month) : month) + '-' + d];
        H.server.customer_statistics(JSON.stringify(param), (res) => {
            if(res.code == 0) {
                this.setState({data: res.data.detail});
            }
        });
    }

    radioHandler () {
        return null;
    }

    //生成表格;
    CreateTable() {
        if(!this.state.data) return null;
        let data = this.state.data,
            trArr = [],
            timeArr = [],
            time = true,
            length = 0;
        timeArr.push();
        for(let key in data) {
            let tdArr = [],
                list = data[key];
            if (Object.prototype.toString.call(list) === '[object Object]') return null;
            for(let i = 0 ; i < list.length-2 ; i++) {
                tdArr.push(<td>{list[i].number}</td>);
                if(time) {
                    timeArr.push(<td style={{backgroundColor: '#e4e1e1'}}>{i+1}</td>);
                }
            }
            if(time) {
                length = tdArr.length;
            }
            trArr.push(<tr><td>{key}</td>{tdArr}<td>{list[list.length-2].number}</td><td>{list[list.length-1].number}</td></tr>);
            time = false;
        }
        return (
            <table className="table table-bordered table-hover table-responsive" style={{fontSize: '12px'}}>
                <tbody>
                <tr style={{fontWeight: '700', backgroundColor: '#c3c3c3'}}><td rowSpan="2">加盟商</td><td colSpan={length} style={{textAlign: 'center'}}>{this.state.year}年{this.state.month}月</td><td rowSpan="2">当月合计</td><td rowSpan="2">总计</td></tr>
                <tr>{timeArr}</tr>
                {trArr}
                </tbody>
            </table>
        );
    }

    //时间改变时;
    changeEv(val, key) {
        if(key == 'year') {
            this.state[key] = this.state.yearArr[val];
        }else {
            this.state[key] = 1 + parseInt(val);
        }
        this.setState();
    }

    render() {
        return (
            <div className="order-statistics-wrap">

                <div className="section-filter">
                    <div className="form-inline">
                        <div className="filter-row">
                            <DropDown dropdownData={this.state.yearArr} selectVal={this.state.year} changeEv={this.changeEv.bind(this)} opearte="year"/> &nbsp;&nbsp;年&nbsp;&nbsp;
                            <DropDown dropdownData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} selectVal={this.state.month - 1} changeEv={this.changeEv.bind(this)} opearte="month" /> &nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="radio-inline" htmlFor="order_statistics_month">
                                <input type="radio" name="radioname" value="month" checked
                                       onChange={this.radioHandler.bind(this, 'month')} id="order_statistics_month"/>按月</label>
                            <a href="javascript:;" className="btn btn-sm btn-orange" onClick={this.getData.bind(this)}>筛选</a>
                        </div>
                    </div>
                </div>
                <div className="total-count" style={{overflowX: 'auto'}}>
                    {this.CreateTable()}
                </div>
            </div>
        );
    }
}

export default NewUser;